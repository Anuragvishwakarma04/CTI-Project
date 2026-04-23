import PublicLayout from '@/components/layout/PublicLayout';
import { Car, Users, Shield, Award, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Car Trust India</h1>
          <p className="text-xl text-primary-100">India's Most Trusted Used Car Platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded with a vision to revolutionize the used car market in India, Car Trust India has become the most trusted platform for buying and selling pre-owned vehicles.
            </p>
            <p className="text-gray-700 mb-4">
              We understand that buying a car is one of the most important decisions in your life. That's why we've built a platform that ensures complete transparency, quality assurance, and peace of mind.
            </p>
            <p className="text-gray-700">
              With thousands of verified dealers and satisfied customers across India, we're committed to making your car buying and selling experience seamless and trustworthy.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">100% Verified Listings</h4>
                  <p className="text-gray-600 text-sm">Every car is inspected and verified</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Trusted Dealers</h4>
                  <p className="text-gray-600 text-sm">Network of certified dealers</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Award className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                  <p className="text-gray-600 text-sm">Comprehensive inspection reports</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Customer First</h4>
                  <p className="text-gray-600 text-sm">Dedicated support team</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Car className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
            <p className="text-gray-600">Cars Listed</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Verified Dealers</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">50,000+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700">
                To provide a transparent, reliable, and hassle-free platform for buying and selling used cars in India, ensuring every customer gets the best value and experience.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700">
                To become India's most trusted and preferred platform for pre-owned vehicles, setting new standards in quality, transparency, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
