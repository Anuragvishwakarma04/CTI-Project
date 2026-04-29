'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function LoanInquiry() {
  const pathname = usePathname()
  const isActive = pathname === '/carLoan' || pathname?.startsWith('/carLoan/')

  return (
    <Link
      href="/carLoan"
      className={`text-xs sm:text-base transition-colors pb-0.5 border-b-2 ${
        isActive
          ? 'text-primary border-primary'
          : 'text-black hover:text-primary border-transparent'
      }`}
    >
      Carloan
    </Link>
  )
}