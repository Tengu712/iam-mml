import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import style from './DocumentPage.module.css'

const mdxModules = Object.entries(import.meta.glob('../pages/**/*.mdx')).map(([path, module]) => ({ module: module, path: path.slice(9, -4) }))

function DocumentPage({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [MdxComponent, setMdxComponent] = useState(null)
  const [hasError, setHasError] = useState(false)

  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
    setHasError(false)
    window.scrollTo(0, 0);
    const path = location.pathname.replace(/^\/|\/$/g, '') || 'index'
    mdxModules.find((n) => n.path === path)?.module()
        .then((n) => setMdxComponent(() => n.default))
        .catch(() => setHasError(true))
      ?? setHasError(true)
  }, [location])

  return hasError
    ? (<div>Page not found.</div>)
    : (
      <div className={style.app}>
        <div className={style.layout}>
          <aside className={`${style.sidebar} ${sidebarOpen ? style.open : ''}`}>
            <nav>
              <div>
                <label>General</label>
              </div>
              <Link to='/docs/jp/about/'        className={style.sidebarLink}>Introduction</Link>
              <Link to='/docs/jp/release-note/' className={style.sidebarLink}>Release Note</Link>
              <div>
                <label>Tutorial</label>
              </div>
              <Link to='/docs/jp/tutorial/cdefgab/'    className={style.sidebarLink}>1. CDEFGAB</Link>
              <Link to='/docs/jp/tutorial/commands/'   className={style.sidebarLink}>2. Commands</Link>
              <Link to='/docs/jp/tutorial/directives/' className={style.sidebarLink}>3. Directives</Link>
              <Link to='/docs/jp/tutorial/instrument/' className={style.sidebarLink}>4. Instrument</Link>
              <div>
                <label>Reference</label>
              </div>
              <Link to='/docs/jp/reference/macro-inst/' className={style.sidebarLink}>Macro & Instrument</Link>
              <Link to='/docs/jp/reference/directives/' className={style.sidebarLink}>Directives</Link>
              <Link to='/docs/jp/reference/commands/' className={style.sidebarLink}>Commands</Link>
              <div>
                <label>Theory</label>
              </div>
              <Link to='/docs/jp/theory/synthesize/' className={style.sidebarLink}>Synthesize</Link>
              <div>
                <a href='https://github.com/Tengu712/iam-mml'>
                  <img src='/iam-mml/github-mark-white.svg' alt='GitHub' />
                </a>
              </div>
            </nav>
          </aside>
          <div className={`${style.mainContainer} ${sidebarOpen ? style.sidebarOpen : ''}`}>
            <header className={style.header}>
              <div className={style.headerContent}>
                <button className={style.menuToggle} onClick={() => setSidebarOpen((prev) => !prev)}>
                  ☰
                </button>
                <div className={style.logo}>IAM.mml Docs</div>
              </div>
            </header>
            <main className={style.mainContent}>
              <div className={style.mdxContent}>
                {MdxComponent && <MdxComponent />}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
}

export default DocumentPage
