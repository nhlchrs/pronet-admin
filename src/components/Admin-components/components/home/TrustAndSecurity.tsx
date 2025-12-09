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

const TrustAndSecurity =()=>{
  <section className="py-16 bg-[#1A2A38]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Pro Net Solutions?
          </h2>
          <p className="text-xl text-gray-300">
            Your success is our priority with industry-leading security and support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <motion.div
              className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="h-8 w-8 text-[#4CD3C8]" />
            </motion.div>
            <h3 className="text-lg font-bold mb-2">Bank-Level Security</h3>
            <p className="text-gray-300 text-sm">
              SSL encryption and secure data protection
            </p>
          </div>

          <div className="text-center">
            <motion.div
              className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Clock className="h-8 w-8 text-[#4CD3C8]" />
            </motion.div>
            <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
            <p className="text-gray-300 text-sm">
              Round-the-clock customer assistance
            </p>
          </div>

          {/* Rated */}
          <div className="text-center">
            <motion.div
              className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star className="h-8 w-8 text-[#4CD3C8]" />
            </motion.div>
            <h3 className="text-lg font-bold mb-2">5-Star Rated</h3>
            <p className="text-gray-300 text-sm">
              Trusted by thousands of satisfied users
            </p>
          </div>

          <div className="text-center">
            <motion.div
              className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Award className="h-8 w-8 text-[#4CD3C8]" />
            </motion.div>
            <h3 className="text-lg font-bold mb-2">Proven Results</h3>
            <p className="text-gray-300 text-sm">
              Track record of successful outcomes
            </p>
          </div>

        </div>
      </div>
    </section>
}

export default TrustAndSecurity