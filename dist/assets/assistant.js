(() => {
  const dialog=document.getElementById('study-assistant'),launch=document.getElementById('assistant-launch'),form=document.getElementById('assistant-form'),input=document.getElementById('assistant-input'),log=document.getElementById('assistant-messages'),send=document.getElementById('assistant-send');
  const messages=[];let pending=false;
  launch.addEventListener('click',()=>{dialog.showModal();input.focus();});
  document.getElementById('assistant-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>launch.focus());
  function add(text,kind){const p=document.createElement('p');p.className=kind;p.textContent=text;log.append(p);log.scrollTop=log.scrollHeight;return p;}
  function links(items){const row=document.createElement('div');row.className='assistant-links';for(const item of items){const a=document.createElement('a');a.textContent=item.label;a.href=item.href;if(item.href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer';}a.addEventListener('click',()=>dialog.close());row.append(a);}log.append(row);log.scrollTop=log.scrollHeight;}
  async function ask(text){if(pending||!text.trim())return;pending=true;send.disabled=true;input.disabled=true;input.value='';document.getElementById('assistant-suggestions').hidden=true;add(text,'assistant-question');const waiting=add('Thinking…','assistant-reply');messages.push({role:'user',content:text});
    try{const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:messages.slice(-9)}),signal:AbortSignal.timeout(29000)});const data=await response.json();if(!response.ok)throw Error(data.error);waiting.textContent=data.answer;messages.push({role:'assistant',content:data.answer});links(data.links||[]);}
    catch(error){messages.pop();waiting.textContent=error.name==='TimeoutError'?'That took a little too long. Please try again.':error.message==='Failed to fetch'?'Couldn’t connect. Please try again.':error.message;links([{label:'Read résumé',href:'resume.html'},{label:'Projects',href:'#projects'}]);}
    finally{pending=false;send.disabled=false;input.disabled=false;log.scrollTop=log.scrollHeight;if(dialog.open)input.focus();}
  }
  form.addEventListener('submit',event=>{event.preventDefault();ask(input.value.trim());});
  document.querySelectorAll('#assistant-suggestions button').forEach(button=>button.addEventListener('click',()=>ask(button.textContent)));
})();
