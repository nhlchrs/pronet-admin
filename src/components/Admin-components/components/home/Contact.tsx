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

const Contact =()=>{
    return( <section className="py-16 bg-[#1A2A38]">
            <motion.div
              className="container mx-auto px-6"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                <p className="text-xl text-gray-300">Ready to start your journey? Contact us today</p>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[ 
                  { icon: <Phone className="h-8 w-8 text-[#4CD3C8]" />, title: "Call Us", text1: "+1 (555) 123-4567", text2: "Mon-Fri 9AM-6PM EST" },
                  { icon: <Mail className="h-8 w-8 text-[#4CD3C8]" />, title: "Email Us", text1: "support@pronetsolutions.com", text2: "24/7 Response" },
                  { icon: <MapPin className="h-8 w-8 text-[#4CD3C8]" />, title: "Visit Us", text1: "123 Business Ave", text2: "New York, NY 10001" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="text-center"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-300">{item.text1}</p>
                    <p className="text-sm text-gray-400">{item.text2}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>)
}

export default Contact