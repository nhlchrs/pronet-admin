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

const Footer =()=>{
    return( <motion.footer
            className="bg-[#1A2A38] py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <div className="flex items-center mb-4">
                    <img 
                      src="/lovable-uploads/1dc005c5-1f18-4598-92dc-030b0afec31f.png" 
                      alt="Pro Net Solutions Logo" 
                      className="h-8 mr-2" 
                    />
                    <span className="text-xl font-bold">Pro Net Solutions</span>
                  </div>
                  <p className="text-gray-300 mb-4">Empowering financial freedom through innovative multi-service solutions.</p>
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-[#4CD3C8] rounded-full flex items-center justify-center">
                      <span className="text-[#1A2A38] text-sm font-bold">f</span>
                    </div>
                    <div className="w-8 h-8 bg-[#4CD3C8] rounded-full flex items-center justify-center">
                      <span className="text-[#1A2A38] text-sm font-bold">t</span>
                    </div>
                    <div className="w-8 h-8 bg-[#4CD3C8] rounded-full flex items-center justify-center">
                      <span className="text-[#1A2A38] text-sm font-bold">in</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4 text-[#4CD3C8]">About Us</h4>
                  <ul className="space-y-2">
                    <li><Link to="/about" className="text-gray-300 hover:text-[#4CD3C8] transition-colors">Our Story</Link></li>
                    <li><Link to="/testimonials" className="text-gray-300 hover:text-[#4CD3C8] transition-colors">Testimonials</Link></li>
                    <li><Link to="/contact" className="text-gray-300 hover:text-[#4CD3C8] transition-colors">Contact Us</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4 text-[#4CD3C8]">Services</h4>
                  <ul className="space-y-2">
                    <li><Link to="/services" className="text-gray-300 hover:text-[#4CD3C8] transition-colors">Our Services</Link></li>
                    <li><Link to="/faq" className="text-gray-300 hover:text-[#4CD3C8] transition-colors">FAQ</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-4 text-[#4CD3C8]">Resources</h4>
                  <ul className="space-y-2">
                    <li><Link to="/dashboard" className="text-gray-300 hover:text-[#4CD3C8] transition-colors">Affiliate Dashboard</Link></li>
                    <li><Link to="/admin" className="text-gray-300 hover:text-[#4CD3C8] transition-colors">Admin Portal</Link></li>
                  </ul>
                </div>
              </div>
    
              <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} Pro Net Solutions. All rights reserved.
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <Link to="/terms" className="text-gray-400 hover:text-[#4CD3C8] transition-colors text-sm">Terms of Service</Link>
                    <Link to="/privacy" className="text-gray-400 hover:text-[#4CD3C8] transition-colors text-sm">Privacy Policy</Link>
                    <Link to="/refund" className="text-gray-400 hover:text-[#4CD3C8] transition-colors text-sm">Refund Policy</Link>
                    <Link to="/disclaimer" className="text-gray-400 hover:text-[#4CD3C8] transition-colors text-sm">Disclaimer</Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.footer>)
}

export default Footer