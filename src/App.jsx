import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Box, ArrowDown, ArrowRight, ArrowUpRight, ChefHat, Clock3, MapPin, Menu, Minus, Plus, ShoppingBag, Sparkles, X } from 'lucide-react'

const PHONE_NUMBER = 'REPLACE_WITH_VERIFIED_WHATSAPP_NUMBER'
const menuItems = [
  { id: 1, name: 'Jollof Rice', category: 'Rice', description: 'Smoky, tomato-rich party rice, a Nigerian staple.', price: null, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Afang Soup', category: 'Soups', description: 'Afang leaves in a rich, hearty soup, traditionally eaten with swallow.', price: null, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Vegetable Soup', category: 'Soups', description: 'A leafy Nigerian soup, traditionally eaten with swallow.', price: null, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Nkwobi', category: 'Specials', description: 'Spiced cow foot in a palm oil sauce, a classic from the specials list.', price: null, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
]
const categories = ['All', 'Rice', 'Soups', 'Specials']

const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
const M = (color, rough = .65) => new THREE.MeshStandardMaterial({ color, roughness: rough })
const lathe = (pts, color, rough = .3) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 72), new THREE.MeshStandardMaterial({ color, roughness: rough, side: THREE.DoubleSide }))
const plate = () => lathe([[0,0],[1.5,0],[1.85,.14],[1.95,.2],[1.88,.2],[1.5,.07],[0,.07]], 0xf3ece0, .25)
const bowl = c => lathe([[0,0],[.7,0],[1.2,.4],[1.55,1.05],[1.62,1.1],[1.5,1.1],[1.1,.5],[.6,.1],[0,.1]], c, .3)
const surface = (y, R, color, rough = .25) => { const m = new THREE.Mesh(new THREE.CircleGeometry(R, 64), M(color, rough)); m.rotation.x = -Math.PI / 2; m.position.y = y; return m }
const blob = (g, color, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Mesh(g, M(color, .7)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); return m }
const disc = (r, R) => { const a = r() * 6.283, d = Math.sqrt(r()) * R; return [Math.cos(a) * d, Math.sin(a) * d] }
function scatter(group, geo, colors, count, rand, place) {
  const im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: .7 }), count), d = new THREE.Object3D()
  for (let i = 0; i < count; i++) { const q = place(); d.position.set(q.x, q.y, q.z); d.rotation.set(0, rand() * 6.28, 0); d.scale.set(q.sx || 1, q.sy || 1, q.sz || 1); d.updateMatrix(); im.setMatrixAt(i, d.matrix); im.setColorAt(i, new THREE.Color(colors[i % colors.length])) }
  group.add(im)
}
const DISHES = {
  1() { const g = new THREE.Group(), r = rng(1); g.add(plate())
    const m = blob(new THREE.SphereGeometry(1, 48, 32, 0, 6.2832, 0, 1.5708), 0xd4501c, -.15, .07, 0, 1.15, .75, 1.05); g.add(m)
    scatter(g, new THREE.SphereGeometry(.07, 8, 6), [0xe8742a, 0xc9440f, 0xf0a14a, 0xdb5a1f, 0x5d8c42], 220, r, () => { const t = r() * 1.3, p = r() * 6.283; return { x: -.15 + 1.18 * Math.sin(t) * Math.cos(p), y: .07 + .77 * Math.cos(t), z: 1.07 * Math.sin(t) * Math.sin(p), sx: 1.7, sy: .8 } })
    ;[[1.3,.7],[1.35,.1],[1.2,-.5]].forEach(([x, z]) => g.add(blob(new THREE.CylinderGeometry(.27, .27, .09, 24), 0xd99a2b, x, .14, z)))
    g.add(blob(new THREE.SphereGeometry(.42, 24, 18), 0x8a4a22, .55, .42, .95, 1.25, .7, .85)); return g },
  2() { const g = new THREE.Group(), r = rng(2); g.add(bowl(0x2b2420), surface(.82, 1.28, 0x2c5a22))
    scatter(g, new THREE.SphereGeometry(.13, 8, 6), [0x4f8a2c, 0x3b7022, 0x6da83a], 100, r, () => { const [a, b] = disc(r, 1.15); return { x: a, y: .85, z: b, sx: 1.4, sy: .28 } })
    scatter(g, new THREE.SphereGeometry(.2, 12, 10), [0x7a4325, 0x6a3a20], 5, r, () => { const [a, b] = disc(r, .9); return { x: a, y: .9, z: b, sy: .8 } })
    scatter(g, new THREE.CircleGeometry(.15, 16).rotateX(-Math.PI / 2), [0xe0902a], 8, r, () => { const [a, b] = disc(r, 1.1); return { x: a, y: .835, z: b } }); return g },
  3() { const g = new THREE.Group(), r = rng(3); g.add(bowl(0xe8dccb), surface(.85, 1.3, 0x5c8a28))
    scatter(g, new THREE.SphereGeometry(.12, 8, 6), [0x7cb342, 0x558b2f, 0x9ccc65], 140, r, () => { const [a, b] = disc(r, 1.2); return { x: a, y: .88, z: b, sx: 1.5, sy: .25 } })
    scatter(g, new THREE.CircleGeometry(.2, 16).rotateX(-Math.PI / 2), [0xd9731a], 10, r, () => { const [a, b] = disc(r, 1.1); return { x: a, y: .865, z: b } })
    scatter(g, new THREE.SphereGeometry(.17, 10, 8), [0xd8b88a, 0x8a5a30], 6, r, () => { const [a, b] = disc(r, .85); return { x: a, y: .92, z: b, sx: 1.3, sy: .7 } }); return g },
  4() { const g = new THREE.Group(), r = rng(4); g.add(lathe([[0,0],[.9,0],[1.5,.25],[1.7,.65],[1.78,.7],[1.68,.7],[1.45,.35],[.8,.08],[0,.08]], 0x6b4226, .55), surface(.5, 1.45, 0xc0430f, .35))
    scatter(g, new THREE.SphereGeometry(.3, 14, 10), [0xead6b3, 0xe2c99d], 7, r, () => { const [a, b] = disc(r, .95); return { x: a, y: .66, z: b, sx: 1.2, sy: .8 } })
    scatter(g, new THREE.TorusGeometry(.22, .035, 8, 24).rotateX(Math.PI / 2), [0xf2e9d8], 7, r, () => { const [a, b] = disc(r, 1.1); return { x: a, y: .56, z: b } })
    scatter(g, new THREE.SphereGeometry(.09, 8, 6), [0x3f7a2a, 0xd2201a], 40, r, () => { const [a, b] = disc(r, 1.3); return { x: a, y: .53, z: b, sy: .4 } }); return g },
}

function DishStage({ dishId }) {
  const mount = useRef(null), api = useRef(null)
  useEffect(() => {
    const host = mount.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, host.clientWidth / host.clientHeight, .1, 100)
    camera.position.set(0, 4.4, 8); camera.lookAt(0, .45, 0)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setSize(host.clientWidth, host.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)
    scene.add(new THREE.HemisphereLight(0xfff1dd, 0x3a2a1c, 1.6))
    const key = new THREE.DirectionalLight(0xffc27a, 2.4); key.position.set(4, 6, 4); scene.add(key)
    const rim = new THREE.PointLight(0xe9a15c, 25, 20); rim.position.set(-4, 3, -3); scene.add(rim)
    const cv = document.createElement('canvas'); cv.width = cv.height = 128
    const cx = cv.getContext('2d'), gr = cx.createRadialGradient(64, 64, 4, 64, 64, 64)
    gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128)
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 5.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }))
    sh.rotation.x = -Math.PI / 2; sh.position.y = -.03; scene.add(sh)
    const stage = new THREE.Group(), holder = new THREE.Group(); stage.add(holder); scene.add(stage)
    holder.scale.setScalar(.001)
    const steam = Array.from({ length: 16 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); m.userData = { life: i / 16, ox: (Math.random() - .5) * 1.4, oz: (Math.random() - .5) * 1.4 }; m.visible = !reduce; scene.add(m); return m })
    let yaw = .6, vel = reduce ? 0 : .004, drag = false, lastX = 0, scrollY = 0, tilt = 0, want = 1, pending = dishId, currentId = null, frame
    const down = e => { drag = true; lastX = e.clientX; host.setPointerCapture(e.pointerId); host.style.cursor = 'grabbing' }
    const move = e => {
      if (drag) { const dx = e.clientX - lastX; yaw += dx * .012; vel = dx * .012; lastX = e.clientX }
      else { const r = host.getBoundingClientRect(); tilt = ((e.clientY - r.top) / r.height - .5) * .3 }
    }
    const up = () => { drag = false; host.style.cursor = 'grab' }
    const onScroll = () => { scrollY = window.scrollY * .0015 }
    host.addEventListener('pointerdown', down); host.addEventListener('pointermove', move); host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up); window.addEventListener('scroll', onScroll, { passive: true })
    api.current = { setDish: id => { if (id === pending || (id === currentId && pending == null)) return; pending = id; want = 0 } }
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const sc = holder.scale.x, ns = sc + (want - sc) * .14
      holder.scale.setScalar(Math.max(ns, .001))
      if (want === 0 && ns < .03 && pending != null) { holder.clear(); holder.add(DISHES[pending]()); currentId = pending; pending = null; want = 1 }
      if (!drag) { yaw += vel; vel += ((reduce ? 0 : .004) - vel) * .03 }
      stage.rotation.y = yaw + scrollY
      stage.rotation.x += (tilt - stage.rotation.x) * .06
      holder.position.y = reduce ? 0 : Math.sin(Date.now() * .0012) * .05
      if (!reduce) steam.forEach(m => { const u = m.userData; u.life += .005; if (u.life > 1) { u.life = 0; u.ox = (Math.random() - .5) * 1.4; u.oz = (Math.random() - .5) * 1.4 }
        m.position.set(u.ox + Math.sin(u.life * 6 + u.ox) * .15, 1.2 + u.life * 1.8, u.oz); m.scale.setScalar(1 + u.life * 1.5); m.material.opacity = Math.sin(u.life * Math.PI) * .16 * holder.scale.x })
      renderer.render(scene, camera)
    }
    animate()
    const resize = () => { if (!host.clientWidth || !host.clientHeight) return; camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight) }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('scroll', onScroll); renderer.dispose(); host.replaceChildren() }
  }, [])
  useEffect(() => { api.current?.setDish(dishId) }, [dishId])
  return <div ref={mount} className="three-stage" role="img" aria-label="Interactive 3D model of the selected dish. Drag to rotate." />
}

function App() {
  const [active, setActive] = useState('All')
  const [dish, setDish] = useState(1)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', note: '' })
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => active === 'All' ? menuItems : menuItems.filter(x => x.category === active), [active])
  const current = menuItems.find(x => x.id === dish)
  const count = cart.reduce((n, x) => n + x.qty, 0)
  const add = item => setCart(old => {
    const found = old.find(x => x.id === item.id)
    return found ? old.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...old, { ...item, qty: 1 }]
  })
  const change = (id, delta) => setCart(old => old.map(x => x.id === id ? { ...x, qty: x.qty + delta } : x).filter(x => x.qty > 0))
  const checkout = e => {
    e.preventDefault()
    if (!cart.length) return
    if (PHONE_NUMBER.startsWith('REPLACE_')) {
      setNotice('Demo mode: add the restaurant’s verified WhatsApp number in src/App.jsx before sending real orders.')
      return
    }
    const lines = cart.map(x => `${x.qty} x ${x.name} (price to confirm)`).join('\n')
    const msg = `Hello Munchy's Kitchen, I would like to place an order:\n${lines}\n\nName: ${customer.name}\nPhone: ${customer.phone}\nAddress/pickup: ${customer.address}\nNote: ${customer.note || 'None'}\nPlease confirm availability and total price.`
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }
  const nav = ['Home', 'Menu', 'Why we cook', 'Contact']
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false) }
  return <div className="site-shell">
    <div className="topline"><span>Gwarinpa, Abuja</span><span>Home food for the days you can’t cook</span><span>Demo website concept</span></div>
    <header className="header">
      <a className="brand" href="#home" onClick={e => {e.preventDefault(); scrollTo('home')}}><span className="brand-mark">M<span>.</span></span><span>MUNCHY'S<br/><small>KITCHEN</small></span></a>
      <nav className="desktop-nav">{nav.map(n => <button key={n} onClick={() => scrollTo(n === 'Home' ? 'home' : n === 'Menu' ? 'menu' : n === 'Why we cook' ? 'story' : 'contact')}>{n}</button>)}</nav>
      <div className="header-actions"><button className="cart-trigger" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/> <span>Order</span><b>{count}</b></button><button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button></div>
    </header>
    {mobileOpen && <div className="mobile-nav">{nav.map(n => <button key={n} onClick={() => scrollTo(n === 'Home' ? 'home' : n === 'Menu' ? 'menu' : n === 'Why we cook' ? 'story' : 'contact')}>{n}</button>)}</div>}
    <main>
      <section className="hero" id="home">
        <div className="hero-copy">
          <h1>Home food for the days you can’t cook.</h1>
          <p className="hero-text">Munchy’s Kitchen cooks Nigerian soups, rice and specials in Gwarinpa, so a long day never has to end with an empty plate.</p>
          <div className="hero-buttons"><button className="primary-btn" onClick={() => setCartOpen(true)}>Order on WhatsApp <ArrowUpRight size={17}/></button><button className="text-btn" onClick={() => scrollTo('menu')}>See what’s cooking <ArrowDown size={15}/></button></div>
          <div className="hero-meta"><div><strong>Gwarinpa, Abuja</strong><span>Come in and sit down to eat</span></div><div><strong>Soups, rice, specials</strong><span>Cooked Nigerian style</span></div><div><strong>Order by WhatsApp</strong><span>Send it, we confirm it</span></div></div>
        </div>
        <div className="hero-visual"><DishStage dishId={dish}/><span className="drag-hint">Drag to turn it around</span><div className="dish-picker" role="group" aria-label="Choose a dish to view in 3D">{menuItems.map(x => <button key={x.id} className={dish === x.id ? 'dish-chip active' : 'dish-chip'} aria-pressed={dish === x.id} onClick={() => setDish(x.id)}>{x.name}</button>)}</div><div className="dish-card"><div><b>{current.name}</b><small>{current.description}</small></div><button className="primary-btn" onClick={() => {add(current); setNotice(`${current.name} added to your order.`)}}>Add to order <Plus size={16}/></button></div></div>
      </section>
      <section className="purpose-section section-pad" id="purpose">
        <p className="purpose-statement">We cook so you don’t have to, on the days you can’t.</p>
        <div className="purpose-grid">
          <div><h3>When work runs late</h3><p>Send your order on WhatsApp and get a proper meal, not another snack for dinner.</p></div>
          <div><h3>When people drop in</h3><p>Soups, rice and specials mean there’s something for everyone at the table.</p></div>
          <div><h3>When you miss home</h3><p>Familiar Nigerian flavours in a calm place to sit down and eat.</p></div>
        </div>
      </section>
      <section className="menu-section section-pad" id="menu">
        <div className="section-heading"><div><h2>What’s on the table</h2></div><p>A sample of the dishes we cook. Ask the kitchen what’s ready today, along with portions and prices.</p></div>
        <div className="menu-toolbar"><div className="filters">{categories.map(c => <button className={active === c ? 'filter active' : 'filter'} key={c} onClick={() => setActive(c)}>{c}</button>)}</div><span className="demo-note">Sample menu, to be confirmed with the kitchen</span></div>
        <div className="menu-grid">{filtered.map(item => <article className="menu-card" key={item.id} onPointerMove={e => {const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; e.currentTarget.style.setProperty('--ry', x * 9 + 'deg'); e.currentTarget.style.setProperty('--rx', -y * 9 + 'deg')}} onPointerLeave={e => {e.currentTarget.style.setProperty('--ry', '0deg'); e.currentTarget.style.setProperty('--rx', '0deg')}}><div className="menu-image"><img src={item.image} alt={`${item.name}, illustrative photo`} loading="lazy"/><button className="view3d" onClick={() => {setDish(item.id); scrollTo('home')}}><Box size={14}/> View in 3D</button><button className="add-btn" onClick={() => {add(item); setNotice(`${item.name} added to your order.`)}} aria-label={`Add ${item.name}`}><Plus size={20}/></button></div><div className="menu-info"><div><span className="category">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p></div><span className="price">Price on request</span></div></article>)}</div>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
      </section>
      <section className="story-section" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85" alt="Food served at a table"/><span className="image-stamp">Like<br/>home</span></div><div className="story-copy"><h2>Why Munchy’s Kitchen exists</h2><p>Munchy’s Kitchen is a restaurant in Gwarinpa, Abuja, serving Nigerian food. We’re here for the evenings when cooking at home isn’t going to happen: late meetings, tired legs, unexpected guests. Our job is simple. Put a proper meal in front of you.</p><div className="story-points"><div><ChefHat/><span><b>Cooked like home</b><small>Nigerian soups, rice and specials</small></span></div><div><Clock3/><span><b>Easy to order</b><small>Message the kitchen on WhatsApp</small></span></div></div><button className="outline-btn" onClick={() => scrollTo('contact')}>Find the kitchen <ArrowUpRight size={16}/></button></div></section>
      <section className="cta-section"><h2>Not cooking tonight?<br/>We are.</h2><button className="primary-btn" onClick={() => {setCartOpen(true); scrollTo('menu')}}>Start an order <ArrowUpRight size={17}/></button><div className="cta-decoration">M.</div></section>
      <section className="contact-section section-pad" id="contact"><div><h2>Find us in Gwarinpa</h2></div><div className="contact-details"><div><MapPin/><span><b>Visit the restaurant</b><small>68 1st Avenue, Gwarinpa, Abuja, Nigeria<br/>Please confirm the current address before visiting.</small></span></div><div><Clock3/><span><b>Opening hours</b><small>Public listings show morning to late evening hours. Confirm directly before visiting.</small></span></div><div><ShoppingBag/><span><b>Orders & enquiries</b><small>WhatsApp ordering will be enabled after the restaurant's contact number is verified.</small></span></div></div></section>
    </main>
    <footer><a className="brand footer-brand" href="#home"><span className="brand-mark">M<span>.</span></span><span>MUNCHY'S<br/><small>KITCHEN</small></span></a><span>© {new Date().getFullYear()} Munchy's Kitchen — concept website</span><span>Home food, Gwarinpa</span></footer>
    {cartOpen && <div className="drawer-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setCartOpen(false)}}><aside className="cart-drawer"><div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Your order <em>({count})</em></h2></div><button className="close-btn" onClick={() => setCartOpen(false)}><X/></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={34}/><h3>Your cart is empty.</h3><p>Add dishes from the menu to start a demo order.</p><button className="primary-btn" onClick={() => {setCartOpen(false); scrollTo('menu')}}>Browse menu <ArrowRight size={16}/></button></div> : <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt=""/><div className="cart-item-copy"><b>{item.name}</b><small>Price to be confirmed</small><div className="quantity"><button onClick={() => change(item.id, -1)}><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => change(item.id, 1)}><Plus size={13}/></button></div></div></div>)}</div><form className="checkout-form" onSubmit={checkout}><h3>Delivery / pickup details</h3><label>Your name<input required value={customer.name} onChange={e => setCustomer({...customer, name:e.target.value})} placeholder="Full name"/></label><label>Phone number<input required value={customer.phone} onChange={e => setCustomer({...customer, phone:e.target.value})} placeholder="Your phone number"/></label><label>Delivery address or pickup<input required value={customer.address} onChange={e => setCustomer({...customer, address:e.target.value})} placeholder="Enter details"/></label><label>Order note <textarea value={customer.note} onChange={e => setCustomer({...customer, note:e.target.value})} placeholder="Optional instructions"/></label><div className="price-disclaimer">Prices and availability must be confirmed by the restaurant. This demo does not process payments.</div><button className="primary-btn full-btn" type="submit">Continue to WhatsApp <ArrowUpRight size={17}/></button><button type="button" className="clear-cart" onClick={() => setCart([])}>Clear order</button></form></>}</aside></div>}
  </div>
}
export default App
