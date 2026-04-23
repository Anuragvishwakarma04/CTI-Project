'use client'

import Link from 'next/link'

export default function InsuranceInquiry() {
  return (
    <Link
      href="/insurance"
      className="text-xs sm:text-base text-black hover:text-primary-600 "
    >
      Insurance
    </Link>
  )
}