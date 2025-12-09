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

const Services =()=>{
    return(<section className="py-16 bg-[#0E1624]">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Our Services</h2>
                <p className="text-xl text-gray-300">Select the service that matches your needs and goals</p>
              </div>
    
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[#1A2A38] border-0 overflow-hidden shadow-lg">
              <img
                src="/lovable-uploads/f45804db-92eb-4f1b-9c00-8e2596c32221.png"
                alt="Financial Markets"
                className="w-full h-52 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-[#4CD3C8]">
                  Financial Markets
                </h3>
                <p className="text-gray-300 mb-6">
                  Access premium trading signals, expert mentorship, and build a passive income through our financial markets platform.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Trading signals & analysis</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Expert mentorship</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Affiliate earnings</span>
                  </div>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38] font-bold">
                    Access Financial Services
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
    
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[#1A2A38] border-0 overflow-hidden shadow-lg">
              <img
                src="/lovable-uploads/449cbb3b-5597-4a2e-a9fb-44f0a0dc059a.png"
                alt="Fantasy Gaming & eSports"
                className="w-full h-52 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-[#4CD3C8]">
                  Fantasy Gaming & eSports
                </h3>
                <p className="text-gray-300 mb-6">
                  Experience premium casino games, live sports betting, eSports competitions and more on our gaming platform.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Casino games & slots</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Sports & eSports betting</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Easy deposits & withdrawals</span>
                  </div>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38] font-bold">
                    Visit Gaming Platform
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
    
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            viewport={{ once: true }}
          >
            <Card className="bg-[#1A2A38] border-0 overflow-hidden shadow-lg">
              <img
                src="/lovable-uploads/507fa9de-7582-4b77-a24e-72f3a80ef637.png"
                alt="Dropshipping Solutions"
                className="w-full h-52 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-[#4CD3C8]">
                  Dropshipping Solutions
                </h3>
                <p className="text-gray-300 mb-6">
                  Start your e-commerce journey with our curated collection of products, tools, and Shopify integration.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Curated product collection</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Shopify integration</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-[#4CD3C8]" />
                    <span>Marketing support</span>
                  </div>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38] font-bold">
                    Explore Dropshipping
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
            </div>
          </section>)
}

export default Services