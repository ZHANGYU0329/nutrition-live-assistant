import React, { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useMobile() {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false
  })

  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth
      setState({
        isMobile: width < MOBILE_BREAKPOINT,
        isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
        isDesktop: width >= TABLET_BREAKPOINT
      })
    }

    // 初始检查
    checkSize()

    // 添加窗口大小变化监听
    window.addEventListener('resize', checkSize)

    // 清理函数
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  return state
}