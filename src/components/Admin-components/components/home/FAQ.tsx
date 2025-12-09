import React from 'react';
import { Link } from 'react-router';
import { Check, TrendingUp, DollarSign, BarChart3, Users, Award, ChevronDown, Shield, Clock, Star, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { motion } from "framer-motion"

const FAQ =()=>{
    return( 
    <section className="py-16 bg-[#0E1624]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">Get answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#1A2A38] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-[#4CD3C8]">How do I get started?</h3>
              <p className="text-gray-300">Simply sign up for an account, choose your preferred service, and follow our step-by-step onboarding process. Our support team is available 24/7 to help you.</p>
            </div>

            <div className="bg-[#1A2A38] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-[#4CD3C8]">Is my investment secure?</h3>
              <p className="text-gray-300">Yes, we use bank-level security measures including SSL encryption, secure payment processing, and regulatory compliance to protect your investments and personal data.</p>
            </div>

            <div className="bg-[#1A2A38] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-[#4CD3C8]">What are the earning potentials?</h3>
              <p className="text-gray-300">Earnings vary based on the service and your level of engagement. Our members typically see positive results within the first 30-90 days, with some achieving significant profits.</p>
            </div>

            <div className="bg-[#1A2A38] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-[#4CD3C8]">Can I access multiple services?</h3>
              <p className="text-gray-300">Absolutely! You can subscribe to multiple services and take advantage of our comprehensive platform that includes trading, gaming, and e-commerce solutions.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/faq">
              <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38] font-bold">
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </section>  
    )
}

export default FAQ