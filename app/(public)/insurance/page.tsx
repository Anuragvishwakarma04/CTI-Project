'use client'

import { useEffect, useRef, useState } from 'react'

export default function CarInsurance() {

  const initialForm = {
    name: '',
    phone: '',
    email: '',
    carNumber: '',
    carModel: '',
    year: '',
    city: '',
    insuranceType: '',
    fuelType: '',
    claim: '',
    expiryDate: ''
  }

  const [form, setForm] = useState(initialForm)

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log(form)
    alert('Insurance Request Submitted 🚗')
    setForm(initialForm)
  }

  const CustomSelect = ({ placeholder, value, options, name }: any) => {
    const [open, setOpen] = useState(false)
    const ref = useRef<any>(null)

    useEffect(() => {
      const handleClick = (e: any) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setOpen(false)
        }
      }
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }, [])

    return (
      <div ref={ref} className="relative w-full">

        {/* SELECT BOX */}
        <div
          onClick={() => setOpen(!open)}
          className="w-full border border-gray-300 p-3 rounded-lg flex justify-between items-center cursor-pointer bg-white"
        >
          <span className="text-gray-700">
            {value
              ? options.find((o: any) => o.value === value)?.label
              : placeholder}
          </span>

          {/*  Arrow */}
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-lg z-50">
            {options.map((opt: any) => (
              <div
                key={opt.value}
                onClick={() => {
                  setForm({ ...form, [name]: opt.value })
                  setOpen(false)
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/*  HERO BANNER */}
   <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between">

          <div>
            <h1 className="text-3xl md:text-5xl font-bold">
              Car Trust India
            </h1>
            <p className="mt-2 text-lg text-white-200">
              Get the Best Car Insurance Deals
            </p>
            <p className="mt-1 text-sm text-white-300">
              Compare & Save instantly
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png"
              alt="insurance"
              className="w-80 md:w-[320px] drop-shadow-2xl hover:scale-110 transition duration-500"
            />
          </div>

        </div>
      </div>

      {/*  FORM SECTION */}
      <div className="max-w-3xl mx-auto px-4 -mt-12 mb-6">
        <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8">

          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Car Insurance Inquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Basic Info */}
            <input name="name" value={form.name} placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            <input name="phone" value={form.phone} placeholder="Phone Number"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            <input name="email" value={form.email} placeholder="Email"
              required
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            {/* Car Details */}
            <input name="carNumber" value={form.carNumber}
              required
              placeholder="Car Number (UP32AB1234)"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            <input name="carModel" value={form.carModel}
              required
              placeholder="Car Model"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            <input name="year" value={form.year}
              required
              placeholder="Registration Year"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            <input name="city" value={form.city}
              required
              placeholder="City"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

            {/* Insurance Type */}
           <CustomSelect
            name="insuranceType"
            placeholder="Insurance Type"
            value={form.insuranceType}
            options={[
              { label: 'New Insurance', value: 'new' },
              { label: 'Renewal', value: 'renewal' }
            ]}
          />

          <CustomSelect
            name="fuelType"
            placeholder="Fuel Type"
            value={form.fuelType}
            options={[
              { label: 'Petrol', value: 'petrol' },
              { label: 'Diesel', value: 'diesel' },
              { label: 'CNG', value: 'cng' },
              { label: 'Electric', value: 'electric' }
            ]}
          />

          <CustomSelect
            name="claim"
            placeholder="Any Claim Last Year?"
            value={form.claim}
            options={[
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' }
            ]}
          />

          {form.insuranceType === 'renewal' && (
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit
            </button>

          </form>
        </div>
      </div>

    </div>
  )
}