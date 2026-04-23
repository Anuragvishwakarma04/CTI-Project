'use client'

import Link from 'next/link'

export default function LoanInquiry() {
  return (
    <Link
      href="/carLoan"
      className="text-xs sm:text-base text-black hover:text-primary-600"
    >
      CarLoan
    </Link>
  )
}