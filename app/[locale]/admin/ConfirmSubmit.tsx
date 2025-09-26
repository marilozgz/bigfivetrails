"use client"

import { useRef } from "react"

interface ConfirmSubmitProps {
  children: React.ReactNode
  message?: string
}

export default function ConfirmSubmit({
  children,
  message = "¿Seguro que quieres borrar?"
}: ConfirmSubmitProps) {
  const formRef = useRef<HTMLFormElement | null>(null)
  return (
    <form
      ref={formRef}
      className='inline'>
      <button
        type='button'
        onClick={() => {
          if (confirm(message)) {
            // submit the nearest form
            formRef.current?.submit()
          }
        }}
        className='text-sm text-red-600'>
        {children}
      </button>
    </form>
  )
}
