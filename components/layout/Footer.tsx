import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Car } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white text-2xl font-bold">Car Trust India</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              India's most trusted platform for buying and selling quality used cars with complete transparency.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/cars" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Buy Cars
              </Link></li>
              <li><Link href="/dealers" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Dealers
              </Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Services
              </Link></li>
              <li><Link href="/warranty" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Warranty
              </Link></li>
              <li><Link href="/dealer/add-vehicle" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Sell Your Car
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                About Us
              </Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Contact
              </Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                FAQ
              </Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Terms & Conditions
              </Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-primary-600 rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                Privacy Policy
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href="mailto:support@cartrustindia.com" className="text-gray-300 hover:text-primary-400 transition">
                    support@cartrustindia.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href="tel:+911800XXXXXX" className="text-gray-300 hover:text-primary-400 transition">
                    +91 1800-XXX-XXXX
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Address</p>
                  <p className="text-gray-300">Noida, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; 2024 <a href="https://cartrustindia.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition">cartrustindia</a>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-primary-400 transition">Terms</Link>
              <Link href="/privacy" className="hover:text-primary-400 transition">Privacy</Link>
              <Link href="/cookies" className="hover:text-primary-400 transition">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
