'use client'

import { useState } from 'react'

type FormData = {
    name: string
    phone: string
    email: string
    carModel: string
    budget: string
    city: string
    employment: string
    income: string
}

export default function CarLoan() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')

    const options = [
        { label: 'Salaried', value: 'salaried' },
        { label: 'Self Employed', value: 'self-employed' }]

    const initialForm = {
        name: '',
        phone: '',
        email: '',
        carModel: '',
        budget: '',
        city: '',
        employment: '',
        income: ''
    }

    const [form, setForm] = useState<FormData>(initialForm)

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        alert('Form Submitted')
        setForm(initialForm)
    }

    return (
        <div className="bg-gray-50 min-h-screen">

            {/*  HERO BANNER */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between">

                    {/* LEFT TEXT */}
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold">
                            Car Trust India
                        </h1>
                        <p className="mt-2 text-lg text-blue-200">
                            Get your Car Loan approved faster & easier
                        </p>
                        <p className="mt-1 text-sm text-blue-300">
                            Fill the form below to apply instantly
                        </p>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="mt-6 md:mt-0 flex justify-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png"
                            alt="car"
                            className="w-80 md:w-[320px] drop-shadow-2xl hover:scale-110 transition duration-500"
                        />
                    </div>

                </div>
            </div>

            {/*  FORM SECTION (overlap effect) */}
            <div className="max-w-3xl mx-auto px-4 -mt-12 mb-2">
                <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8">

                    <h2 className="text-xl font-semibold mb-6 text-gray-800">
                        Car Loan Inquiry
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input name="name" value={form.name} placeholder="Full Name"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

                        <input name="phone" value={form.phone} placeholder="Phone Number"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

                        <input name="email" value={form.email} placeholder="Email"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

                        <input name="carModel" value={form.carModel} placeholder="Car Model"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

                        <input name="budget" value={form.budget} placeholder="Budget (₹)"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

                        <input name="city" value={form.city} placeholder="City"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

                        <div className="relative w-full">

                            {/* SELECT BOX */}
                            <div
                                onClick={() => setOpen(!open)}
                                className="w-full border border-gray-300 p-3 rounded-lg flex justify-between items-center cursor-pointer bg-white"
                            >
                                <span className="text-gray-700">
                                    {value
                                        ? options.find(o => o.value === value)?.label
                                        : 'Employment Type'}
                                </span>

                                {/*  Arrow */}
                                <svg
                                    className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''
                                        }`}
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
                                    {options.map((opt) => (
                                        <div
                                            key={opt.value}
                                            onClick={() => {
                                                setValue(opt.value)
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

                        <input name="income" value={form.income} placeholder="Monthly Income"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

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