'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function InsuranceInquiry() {
  const pathname = usePathname()
  const isActive = pathname === '/insurance' || pathname?.startsWith('/insurance/')

  return (
    <Link
      href="/insurance"
      className={`text-xs sm:text-base transition-colors pb-0.5 border-b-2 ${
        isActive
          ? 'text-primary border-primary'
          : 'text-black hover:text-primary border-transparent'
      }`}
    >
      Insurance
    </Link>
  )
}