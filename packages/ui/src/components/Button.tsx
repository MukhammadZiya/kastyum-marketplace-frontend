import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}