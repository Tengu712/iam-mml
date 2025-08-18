import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export function InlineMath({ math }) {
  const ref = useRef()
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ''
      katex.render(math, ref.current, {
        displayMode: false,
        output: 'mathml',
        strict: false
      })
    }
  }, [math])
  return <span ref={ref}></span>
}

export function BlockMath({ math }) {
  const ref = useRef()
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ''
      katex.render(math, ref.current, {
        displayMode: true,
        output: 'mathml',
        strict: false
      })
    }
  }, [math])
  return <div ref={ref}></div>
}
