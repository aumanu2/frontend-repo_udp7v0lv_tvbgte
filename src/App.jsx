import { useEffect, useState } from 'react'

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10">
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  )
}

function Loader() {
  return <div className="text-center text-gray-500">Loading...</div>
}

export default function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const [departments, setDepartments] = useState([])
  const [faculty, setFaculty] = useState([])
  const [events, setEvents] = useState([])
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dRes, fRes, eRes, nRes] = await Promise.all([
          fetch(`${baseUrl}/departments`),
          fetch(`${baseUrl}/faculty`),
          fetch(`${baseUrl}/events`),
          fetch(`${baseUrl}/notices`),
        ])
        const [d, f, e, n] = await Promise.all([
          dRes.ok ? dRes.json() : [],
          fRes.ok ? fRes.json() : [],
          eRes.ok ? eRes.json() : [],
          nRes.ok ? nRes.json() : [],
        ])
        setDepartments(Array.isArray(d) ? d : [])
        setFaculty(Array.isArray(f) ? f : [])
        setEvents(Array.isArray(e) ? e : [])
        setNotices(Array.isArray(n) ? n : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [baseUrl])

  const submitContact = async (e) => {
    e.preventDefault()
    setContactStatus('Sending...')
    try {
      const res = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
      if (res.ok) {
        setContactStatus('Message sent successfully!')
        setContact({ name: '', email: '', subject: '', message: '' })
      } else {
        const txt = await res.text()
        setContactStatus(`Failed to send: ${txt}`)
      }
    } catch (err) {
      setContactStatus(`Error: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800" id="home">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">S</div>
            <span className="font-bold text-lg">Springfield Public School</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-blue-600">About</a>
            <a href="#departments" className="hover:text-blue-600">Departments</a>
            <a href="#faculty" className="hover:text-blue-600">Faculty</a>
            <a href="#events" className="hover:text-blue-600">Events</a>
            <a href="#notices" className="hover:text-blue-600">Notices</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
          <a href="/test" className="text-sm text-blue-600 hover:underline">System Test</a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Inspiring Excellence, Empowering Students</h1>
            <p className="mt-4 text-white/90">A vibrant learning community fostering academic achievement, creativity, and character.</p>
            <div className="mt-6 flex gap-3">
              <a href="#about" className="bg-white text-blue-700 font-semibold px-5 py-2 rounded shadow hover:bg-blue-50">Explore</a>
              <a href="#contact" className="border border-white/60 px-5 py-2 rounded hover:bg-white/10">Get in Touch</a>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">1200+</div>
                <div className="text-white/80 text-sm">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold">85</div>
                <div className="text-white/80 text-sm">Faculty</div>
              </div>
              <div>
                <div className="text-3xl font-bold">40</div>
                <div className="text-white/80 text-sm">Classrooms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle title="About Our School" subtitle="Overview of our mission, vision, and values." />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-semibold text-lg">Mission</h3>
            <p className="text-gray-600 mt-2">To deliver holistic education that nurtures critical thinking, creativity, and compassion.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-semibold text-lg">Vision</h3>
            <p className="text-gray-600 mt-2">To be a beacon of excellence, empowering students to shape a better future.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-semibold text-lg">Values</h3>
            <p className="text-gray-600 mt-2">Integrity, Respect, Inclusion, and Lifelong Learning.</p>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Departments" subtitle="Academic units and areas of study." />
          {loading ? (
            <Loader />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(departments.length ? departments : [
                { name: 'Science', head: 'Dr. Allen', description: 'Physics, Chemistry, Biology' },
                { name: 'Mathematics', head: 'Ms. Carter', description: 'Algebra to Calculus' },
                { name: 'Arts', head: 'Mr. Smith', description: 'Fine arts, music, drama' },
              ]).map((d, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{d.name}</h3>
                    {d.head && <span className="text-sm text-gray-500">Head: {d.head}</span>}
                  </div>
                  {d.description && <p className="text-gray-600 mt-2">{d.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Faculty */}
      <section id="faculty" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle title="Faculty" subtitle="Educators dedicated to student success." />
        {loading ? (
          <Loader />
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(faculty.length ? faculty : [
              { name: 'Jane Doe', designation: 'Mathematics Teacher', department: 'Mathematics' },
              { name: 'John Smith', designation: 'Science Teacher', department: 'Science' },
              { name: 'Emily Johnson', designation: 'Art Teacher', department: 'Arts' },
            ]).map((f, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow border">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-bold">
                  {f.name?.split(' ').map(s => s[0]).join('').slice(0,2)}
                </div>
                <h4 className="mt-4 font-semibold">{f.name}</h4>
                <p className="text-sm text-gray-600">{f.designation || 'Faculty Member'}</p>
                {f.department && <p className="text-xs text-gray-500 mt-1">{f.department}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Events */}
      <section id="events" className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title="Upcoming Events" subtitle="Join our latest activities and programs." />
          {loading ? (
            <Loader />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(events.length ? events : [
                { title: 'Science Fair', date: new Date().toISOString(), location: 'Auditorium', description: 'Student science projects showcase.' },
                { title: 'Annual Sports Day', date: new Date().toISOString(), location: 'Playground', description: 'Track and field events.' },
                { title: 'Art Exhibition', date: new Date().toISOString(), location: 'Hall A', description: 'Artwork by students.' },
              ]).map((ev, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow border">
                  <h4 className="font-semibold text-lg">{ev.title}</h4>
                  {ev.date && <p className="text-sm text-gray-500 mt-1">{new Date(ev.date).toLocaleString()}</p>}
                  {ev.location && <p className="text-sm text-gray-500">{ev.location}</p>}
                  {ev.description && <p className="text-gray-600 mt-2">{ev.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Notices */}
      <section id="notices" className="max-w-6xl mx-auto px-4 py-16">
        <SectionTitle title="Notices & Announcements" subtitle="Latest updates for parents and students." />
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {(notices.length ? notices : [
              { title: 'Parent-Teacher Meeting', content: 'PTM scheduled for next Friday.', priority: 'high' },
              { title: 'Holiday Notice', content: 'School will remain closed on Monday.', priority: 'normal' },
            ]).map((n, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow border">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{n.title}</h4>
                  {n.priority && (
                    <span className={`text-xs px-2 py-1 rounded-full border ${n.priority === 'high' ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-600 border-gray-200 bg-gray-50'}`}>
                      {n.priority}
                    </span>
                  )}
                </div>
                {n.content && <p className="text-gray-600 mt-1">{n.content}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title="Contact Us" subtitle="We would love to hear from you." />
          <form onSubmit={submitContact} className="bg-white p-6 rounded-xl shadow border grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input value={contact.name} onChange={(e)=>setContact({...contact, name: e.target.value})} required className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={contact.email} onChange={(e)=>setContact({...contact, email: e.target.value})} required className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Subject</label>
              <input value={contact.subject} onChange={(e)=>setContact({...contact, subject: e.target.value})} required className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Message</label>
              <textarea rows="4" value={contact.message} onChange={(e)=>setContact({...contact, message: e.target.value})} required className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 flex items-center gap-4">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold">Send Message</button>
              {contactStatus && <span className="text-sm text-gray-700">{contactStatus}</span>}
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Springfield Public School. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
