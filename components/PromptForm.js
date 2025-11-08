import React from 'react';
export default function PromptForm({ onSubmit, initial }){
  const [form,setForm]=React.useState({name:initial?.name||'',profession:initial?.profession||'developer',goal:initial?.goal||'internship',style:initial?.style||'minimal',palette:initial?.palette||'pastel',username:initial?.username||''});
  function change(e){const {name,value}=e.target; setForm(s=>({...s,[name]:value}));}
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit(form);}} className='space-y-3'>
      <label className='block text-sm'>Full name<input name='name' value={form.name} onChange={change} className='w-full p-2 border rounded mt-1'/></label>
      <label className='block text-sm'>Username (for public URL)<input name='username' value={form.username} onChange={change} className='w-full p-2 border rounded mt-1' placeholder='e.g. yourname'/></label>
      <label className='block text-sm'>Profession<select name='profession' value={form.profession} onChange={change} className='w-full p-2 border rounded mt-1'><option>developer</option><option>designer</option><option>student</option></select></label>
      <label className='block text-sm'>Goal<select name='goal' value={form.goal} onChange={change} className='w-full p-2 border rounded mt-1'><option>internship</option><option>job</option><option>freelance</option></select></label>
      <label className='block text-sm'>Style<select name='style' value={form.style} onChange={change} className='w-full p-2 border rounded mt-1'><option>minimal</option><option>creative</option><option>corporate</option></select></label>
      <label className='block text-sm'>Color palette<select name='palette' value={form.palette} onChange={change} className='w-full p-2 border rounded mt-1'><option value='pastel'>Pastel</option><option value='dark'>Dark</option><option value='vibrant'>Vibrant</option></select></label>
      <div className='flex gap-2'><button className='px-4 py-2 bg-sky-600 text-white rounded'>Generate Preview</button></div>
    </form>
  );
}
