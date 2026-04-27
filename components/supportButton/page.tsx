'use client'

import { Phone, MessageCircle, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function SupportButton() {
    const [open, setOpen] = useState(false)
    const popupRef = useRef<any>(null)

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const phone = "7668999098"
    const whatsapp = `https://wa.me/91${phone}`
    const mail = "support@cartrade.com"

    return (
        <>

            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setOpen(!open)
                    }}
                    className="bg-green-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
                >
                    <Phone className="w-6 h-6" />
                </button>
            </div>


            {open && (
                <div ref={popupRef} className="fixed bottom-20 left-6 bg-white shadow-2xl rounded-xl p-4 w-52 mb-1 z-50 border">

                    <h3 className="font-bold text-gray-800 mb-3">
                        Contact Support
                    </h3>


                    <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2  hover:bg-gray-100 rounded"
                    >
                        <Phone className="w-4 h-4 text-green-600" />
                        Call Now
                    </a>


                    {/* <a
            href={whatsapp}
            target="_blank"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            WhatsApp
          </a>

         
          <a
            href={`mailto:${mail}`}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
          >
            <Mail className="w-4 h-4 text-blue-500" />
            Email Us
          </a> */}

                </div>
            )}
        </>
    )
}