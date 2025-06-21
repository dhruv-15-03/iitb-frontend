"use client"

export function ThemeProvider({ children, ...props }) {
  return (
    <div className="dark" {...props}>
      {children}
    </div>
  )
}