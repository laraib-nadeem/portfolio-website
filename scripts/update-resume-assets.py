"""Regenerate AI context and the PDF from dist/resume.html (requires reportlab)."""
from pathlib import Path
from html.parser import HTMLParser
from html import escape
import json,re
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,HRFlowable,PageBreak
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont('ResumeSans','/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('ResumeSansBold','/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))

root=Path(__file__).resolve().parents[1]
source=(root/'dist/resume.html').read_text()
main=source[source.index('<main'):source.index('</main>')]
class ResumeParser(HTMLParser):
    def __init__(self):super().__init__();self.items=[];self.tag=None;self.parts=[]
    def handle_starttag(self,tag,attrs):
        if tag in ('h2','h3','p','li'):self.tag=tag;self.parts=[]
    def handle_data(self,text):
        if self.tag:self.parts.append(text)
    def handle_endtag(self,tag):
        if tag==self.tag:self.items.append((tag,''.join(self.parts).strip()));self.tag=None
parser=ResumeParser();parser.feed(main)
text=' '.join(value for _,value in parser.items)
(root/'api/portfolio-context.js').write_text('export const resume = '+json.dumps(text)+';\n')
styles=getSampleStyleSheet();green=colors.HexColor('#548235')
styles.add(ParagraphStyle('Name',fontName='ResumeSansBold',fontSize=23,leading=28,textColor=green,alignment=1,spaceAfter=5))
styles.add(ParagraphStyle('ContactLine',fontName='ResumeSans',fontSize=9,leading=12,alignment=1,spaceAfter=12))
styles.add(ParagraphStyle('SectionTitle',fontName='ResumeSansBold',fontSize=15,leading=19,textColor=green,spaceBefore=9,spaceAfter=4,keepWithNext=True))
styles.add(ParagraphStyle('EntryTitle',fontName='ResumeSansBold',fontSize=10,leading=13,spaceBefore=9,spaceAfter=3,keepWithNext=True))
styles.add(ParagraphStyle('ResumeText',fontName='ResumeSans',fontSize=10,leading=13,spaceAfter=4))
styles.add(ParagraphStyle('ResumeBullet',fontName='ResumeSans',fontSize=10,leading=13,leftIndent=13,firstLineIndent=0,bulletIndent=1,spaceAfter=3))
story=[]
for i,(tag,value) in enumerate(parser.items):
    value=escape(value)
    if i==0:story.append(Paragraph(value.upper(),styles['Name']))
    elif i==1:story.append(Paragraph(value,styles['ContactLine']))
    elif tag=='h2':
        if value=='Work Experience':story.append(PageBreak())
        story.extend([Paragraph(value.upper(),styles['SectionTitle']),HRFlowable(width='100%',thickness=.5,color=colors.lightgrey,spaceAfter=5)])
    elif tag=='h3':story.append(Paragraph(value,styles['EntryTitle']))
    elif tag=='li':story.append(Paragraph(value,styles['ResumeBullet'],bulletText='•'))
    else:story.append(Paragraph(value,styles['ResumeText']))
SimpleDocTemplate(str(root/'dist/resume.pdf'),pagesize=letter,rightMargin=34,leftMargin=34,topMargin=30,bottomMargin=30,title='Laraib Nadeem — Résumé',author='Laraib Nadeem').build(story)
print('Updated AI reference and résumé PDF')
