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

const Industry =()=>{
    return( <section className="py-16 bg-[#0E1624]">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Learn From Industry Experts</h2>
              <p className="text-xl text-gray-300">
                Our mentors have decades of combined experience in trading and network marketing.
              </p>
            </motion.div>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-[#1A2A38] border-0 overflow-hidden">
                  <motion.img
                    src="/lovable-uploads/561a3e79-6879-40c5-9a77-ccc5a70eb52e.png"
                    alt="James Wilson"
                    className="w-full h-52 object-cover object-top"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-1">James Wilson</h3>
                    <p className="text-[#4CD3C8] mb-4">Forex Trading Expert</p>
                    <p className="text-gray-300">
                      With over 15 years of experience in forex trading, James has helped thousands of traders master the markets.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
    
          
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-[#1A2A38] border-0 overflow-hidden">
                  <motion.img
                    src="/lovable-uploads/3ad44ef9-5321-42a6-bf72-03b8e9f28de2.png"
                    alt="Sarah Johnson"
                    className="w-full h-52 object-cover object-top"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-1">Sarah Johnson</h3>
                    <p className="text-[#4CD3C8] mb-4">Network Marketing Specialist</p>
                    <p className="text-gray-300">
                      Sarah has built multiple six-figure income streams through affiliate marketing and network building.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
    
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-[#1A2A38] border-0 overflow-hidden">
                  <motion.img
                    src="/lovable-uploads/3243cc5d-1204-4af5-8efc-0ef8c0323b6c.png"
                    alt="Michael Chang"
                    className="w-full h-52 object-cover object-top"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-1">Michael Chang</h3>
                    <p className="text-[#4CD3C8] mb-4">Crypto Investment Advisor</p>
                    <p className="text-gray-300">
                      Michael's crypto portfolio strategies have generated returns exceeding 400% for his clients.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>)
}

export default Industry