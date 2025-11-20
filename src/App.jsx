import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { api } from './lib/api'

function LangSwitcher({ value, onChange }) {
  const langs = [
    { code: 'hu', label: 'HU' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'ro', label: 'RO' },
  ]
  return (
    <div className="flex gap-2">
      {langs.map(l => (
        <button key={l.code} onClick={() => onChange(l.code)} className={`px-3 py-1 rounded-md text-sm ${value===l.code?'bg-emerald-600 text-white':'bg-white/70 hover:bg-white text-slate-900'}`}>
          {l.label}
        </button>
      ))}
    </div>
  )
}

function Nav({ lang }) {
  const base = lang==='hu'?'/hu':'/' + lang
  const items = lang==='hu'
    ? [
        { to: `${base}`, label: 'Főoldal' },
        { to: `${base}/rolunk`, label: 'Rólunk' },
        { to: `${base}/oktatas`, label: 'Lovas oktatás' },
        { to: `${base}/turak`, label: 'Túrák' },
        { to: `${base}/hirek`, label: 'Hírek' },
        { to: `${base}/kapcsolat`, label: 'Kapcsolat' },
      ]
    : [
        { to: `${base}`, label: 'Home' },
        { to: `${base}/about`, label: 'About' },
        { to: `${base}/riding`, label: 'Riding Lessons' },
        { to: `${base}/tours`, label: 'Tours' },
        ...(lang!=='hu'? [{ to: `${base}/camping`, label: 'Camping' }]:[]),
        { to: `${base}/news`, label: 'News' },
        { to: `${base}/contact`, label: 'Contact' },
      ]
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={base} className="font-semibold text-slate-800">Táltos Lovasudvar</Link>
        <nav className="flex items-center gap-4">
          {items.map(i => <Link key={i.to} to={i.to} className="text-slate-700 hover:text-emerald-700 text-sm">{i.label}</Link>)}
        </nav>
      </div>
    </header>
  )
}

function Layout({ lang, onLang }) {
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 pt-4 flex justify-end"><LangSwitcher value={lang} onChange={onLang} /></div>
      <Nav lang={lang} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-600">© Táltos Lovasudvar</footer>
    </div>
  )
}

import { Routes, Route, Outlet, useLocation } from 'react-router-dom'

function useLangRouting() {
  const loc = useLocation()
  const [lang, setLang] = useState(loc.pathname.startsWith('/hu')? 'hu' : loc.pathname.split('/')[1]||'hu')
  const navigate = useNavigate()
  const change = (code) => {
    setLang(code)
    if (code==='hu') navigate('/hu')
    else navigate(`/${code}`)
  }
  return { lang, change }
}

function Hero({ title, subtitle, cta }){
  return (
    <section className="rounded-2xl bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center text-white p-8 md:p-16 shadow-lg">
      <div className="backdrop-brightness-[.7] rounded-xl p-6 md:p-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{title}</h1>
        <p className="text-lg md:text-2xl mb-6 max-w-2xl">{subtitle}</p>
        {cta}
      </div>
    </section>
  )
}

function HomeHU(){
  return (
    <div className="space-y-10">
      <Hero title="Nálunk sosem unalmas az élet" subtitle="Lovaglás, természet, közösség. Kezdőket is örömmel várunk." cta={<Link to="/hu/kapcsolat" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-md">Jöhet a kaland?</Link>} />
      <section>
        <h2 className="text-xl font-semibold mb-3">Programok</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title:'Lovasiskola', to:'/hu/oktatas' },
            { title:'Túrák', to:'/hu/turak' },
            { title:'Táborok', to:'/hu/rolunk' },
          ].map(c => (
            <Link key={c.to} to={c.to} className="p-5 rounded-xl bg-white shadow hover:shadow-md transition">
              <div className="font-medium mb-1">{c.title}</div>
              <div className="text-sm text-slate-600">Fedezd fel!</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function HomeEN(){
  return (
    <div className="space-y-10">
      <Hero title="Horse Riding & Authentic Experience in Transylvania" subtitle="Ride through wild landscapes, meet our kind horses, feel at home with our hospitality." cta={<Link to="/en/contact" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-md">Start your ride</Link>} />
    </div>
  )
}

function Contact({ lang='hu' }){
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'', lang })
  const [ok, setOk] = useState(null)
  const submit = async (e)=>{
    e.preventDefault()
    const res = await api.contact(form)
    setOk(res?.message || 'Köszönjük! 48 órán belül válaszolunk.')
  }
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">{lang==='hu'?'Kapcsolat':'Contact'}</h1>
      <form onSubmit={submit} className="space-y-3">
        {['name','email','subject','message'].map(k=> (
          <div key={k}>
            <label className="block text-sm mb-1 capitalize">{k}</label>
            {k==='message' ? (
              <textarea required value={form[k]} onChange={e=>setForm({ ...form, [k]: e.target.value })} className="w-full border rounded-md p-2" rows={5} />
            ) : (
              <input required type={k==='email'?'email':'text'} value={form[k]} onChange={e=>setForm({ ...form, [k]: e.target.value })} className="w-full border rounded-md p-2" />
            )}
          </div>
        ))}
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">{lang==='hu'?'Küldés':'Send'}</button>
      </form>
      {ok && <div className="mt-4 text-emerald-700">{ok}</div>}
    </div>
  )
}

function Booking({ lang='hu' }){
  const [form, setForm] = useState({ name:'', email:'', date:'', group_size:1, program:'', notes:'', lang })
  const [ok, setOk] = useState(null)
  const submit = async (e)=>{
    e.preventDefault()
    const res = await api.booking(form)
    setOk(res?.message)
  }
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-3">{lang==='hu'?'Foglalás':'Booking'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">{lang==='hu'?'Név':'Name'}</label>
            <input required value={form.name} onChange={e=>setForm({ ...form, name:e.target.value })} className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input required type="email" value={form.email} onChange={e=>setForm({ ...form, email:e.target.value })} className="w-full border rounded-md p-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">{lang==='hu'?'Dátum':'Date'}</label>
            <input required type="date" value={form.date} onChange={e=>setForm({ ...form, date:e.target.value })} className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">{lang==='hu'?'Létszám':'Group size'}</label>
            <input required type="number" min={1} value={form.group_size} onChange={e=>setForm({ ...form, group_size:Number(e.target.value) })} className="w-full border rounded-md p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">{lang==='hu'?'Program leírás':'Program description'}</label>
          <textarea required rows={4} value={form.program} onChange={e=>setForm({ ...form, program:e.target.value })} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">{lang==='hu'?'Megjegyzés':'Notes'}</label>
          <textarea rows={3} value={form.notes} onChange={e=>setForm({ ...form, notes:e.target.value })} className="w-full border rounded-md p-2" />
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">{lang==='hu'?'Küldés':'Send'}</button>
      </form>
      {ok && <div className="mt-3 text-emerald-700">{ok}</div>}
    </div>
  )
}

function HU(){
  return (
    <Routes>
      <Route index element={<HomeHU />} />
      <Route path="rolunk" element={<div>Rólunk oldal (tartalom készül)</div>} />
      <Route path="oktatas" element={<div>Lovas oktatás (tartalom készül)</div>} />
      <Route path="turak" element={<div className="space-y-6"><div>Túrák (1 órától 5-7 napig)</div><Booking lang="hu" /></div>} />
      <Route path="hirek" element={<div>Hírek (hamarosan)</div>} />
      <Route path="kapcsolat" element={<Contact lang="hu" />} />
    </Routes>
  )
}

function EN(){
  return (
    <Routes>
      <Route index element={<HomeEN />} />
      <Route path="about" element={<div>About page (coming soon)</div>} />
      <Route path="riding" element={<div>Riding lessons (coming soon)</div>} />
      <Route path="tours" element={<div className="space-y-6"><div>Tours overview</div><Booking lang="en" /></div>} />
      <Route path="camping" element={<div>Camping info (only international)</div>} />
      <Route path="news" element={<div>News (AI bot soon)</div>} />
      <Route path="contact" element={<Contact lang="en" />} />
    </Routes>
  )
}

export default function AppShell(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/hu/*" element={<LangWrapper code="hu" element={<HU />} />} />
        <Route path="/en/*" element={<LangWrapper code="en" element={<EN />} />} />
        <Route path="/de/*" element={<LangWrapper code="de" element={<EN />} />} />
        <Route path="/ro/*" element={<LangWrapper code="ro" element={<EN />} />} />
        <Route path="*" element={<RedirectToDefault />} />
      </Routes>
    </BrowserRouter>
  )
}

function LangWrapper({ code, element }){
  return (
    <LangLayout code={code}>
      {element}
    </LangLayout>
  )
}

function LangLayout({ code, children }){
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={`/${code}`} className="font-semibold">Táltos Lovasudvar</Link>
          <div className="flex gap-2">
            {['hu','en','de','ro'].map(l => (
              <button key={l} onClick={()=>navigate(l==='hu'? '/hu' : `/${l}`)} className={`px-2 py-1 rounded text-sm ${l===code? 'bg-emerald-600 text-white':'bg-emerald-100 hover:bg-emerald-200'}`}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="text-center text-sm text-slate-600 py-6">© Táltos Lovasudvar</footer>
    </div>
  )
}

function RedirectToDefault(){
  return <div className="p-8">Redirecting...</div>
}
