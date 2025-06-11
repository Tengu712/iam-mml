import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

const mdxModules = Object.entries(import.meta.glob('../pages/**/*.mdx')).map(([path, module]) => ({ module: module, path: path.slice(9, -4) }))

function DocumentPage({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [MdxComponent, setMdxComponent] = useState(null)
  const [hasError, setHasError] = useState(false)

  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
    setHasError(false)
    const path = location.pathname.replace(/^\/|\/$/g, '') || 'index'
    mdxModules.find((n) => n.path === path)?.module()
        .then((n) => setMdxComponent(() => n.default))
        .catch(() => setHasError(true))
      ?? setHasError(true)
  }, [location])

  return hasError
    ? (<div>Page not found.</div>)
    : (
      <div className='app'>
        <div className='layout'>
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <nav>
              <div>
                <label>General</label>
              </div>
              <Link to='/docs/jp/about/'        className='sidebar-link nested'>Introduction</Link>
              <Link to='/docs/jp/release-note/' className='sidebar-link nested'>Release Note</Link>
              <div>
                <label>Tutorial</label>
              </div>
              <Link to='/docs/jp/tutorial/cdefgab/'    className='sidebar-link nested'>1. CDEFGAB</Link>
              <Link to='/docs/jp/tutorial/commands/'   className='sidebar-link nested'>2. Commands</Link>
              <Link to='/docs/jp/tutorial/directives/' className='sidebar-link nested'>3. Directives</Link>
              <Link to='/docs/jp/tutorial/instrument/' className='sidebar-link nested'>4. Instrument</Link>
              <div>
                <label>Reference</label>
              </div>
              <Link to='/docs/jp/reference/macro-inst/' className='sidebar-link nested'>Macro & Instrument</Link>
              <Link to='/docs/jp/reference/directives/' className='sidebar-link nested'>Directives</Link>
              <Link to='/docs/jp/reference/commands/' className='sidebar-link nested'>Commands</Link>
              <div>
                <label>Theory</label>
              </div>
              <Link to='/docs/jp/theory/synthesize/' className='sidebar-link nested'>Synthesize</Link>
              <div>
                <a href='https://github.com/Tengu712/iam-mml'>
                  <img src='/iam-mml/github-mark-white.svg' alt='GitHub' />
                </a>
              </div>
            </nav>
          </aside>
          <div className={`main-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <header className='header'>
              <div className='header-content'>
                <button className='menu-toggle' onClick={() => setSidebarOpen((prev) => !prev)}>
                  ☰
                </button>
                <div className='logo'>IAM.mml Docs</div>
              </div>
            </header>
            <main className='main-content'>
              <div className='mdx-content'>
                {MdxComponent && <MdxComponent />}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
}

export default DocumentPage
