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

const Call =()=>{
    return(<motion.section
            className="py-16 bg-[#0E1624]"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join Pro Net Solutions today and gain access to our premium services, expert mentorship, and thriving community.
              </p>
              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Link to="/signup">
                  <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38] font-bold px-8 py-3 text-lg">
                    Create Your Account
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-[#4CD3C8] text-[#4CD3C8] hover:bg-[#4CD3C8] hover:text-[#1A2A38] font-bold px-8 py-3 text-lg">
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.section>)
}

export default Call