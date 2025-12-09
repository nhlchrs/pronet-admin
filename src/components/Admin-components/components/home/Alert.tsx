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

const Alert =()=>{
    return( <section className="py-16 bg-[#1A2A38]">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Alert Providers You Can Trust</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our network of experienced traders deliver accurate and timely signals that have been proven to generate consistent profits.
              </p>
            </motion.div>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-[#0E1624] p-8 rounded-lg text-center"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="bg-[#1A2A38] rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <TrendingUp className="h-10 w-10 text-[#4CD3C8]" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">Forex Signals</h3>
                <p className="text-gray-300">
                  Access precise entry and exit points for major currency pairs with 85%+ accuracy.
                </p>
              </motion.div>
    
              <motion.div
                className="bg-[#0E1624] p-8 rounded-lg text-center"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="bg-[#1A2A38] rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <DollarSign className="h-10 w-10 text-[#4CD3C8]" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">Crypto Analysis</h3>
                <p className="text-gray-300">
                  Stay ahead of the volatile crypto market with our trend predictions and signal alerts.
                </p>
              </motion.div>
              <motion.div
                className="bg-[#0E1624] p-8 rounded-lg text-center"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="bg-[#1A2A38] rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BarChart3 className="h-10 w-10 text-[#4CD3C8]" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">Stock Insights</h3>
                <p className="text-gray-300">
                  Receive detailed analysis and buy/sell recommendations for top-performing stocks.
                </p>
              </motion.div>
            </div>
          </div>
        </section>  )
}

export default Alert