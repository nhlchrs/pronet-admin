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

const Income =()=>{
    return( <section className="py-16 bg-[#0E1624]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Multiple Income Streams</h2>
              <p className="text-xl text-gray-300">
                Diversify your earnings through our comprehensive compensation plan.
              </p>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-[#1A2A38] p-8 rounded-lg"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-[#4CD3C8]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Direct Commissions</h3>
                <p className="text-gray-300">
                  Earn up to 10% commission on all direct referrals who subscribe to any of our plans.
                </p>
              </motion.div>
    
              <motion.div
                className="bg-[#1A2A38] p-8 rounded-lg"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-[#4CD3C8]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Team Overrides</h3>
                <p className="text-gray-300">
                  Earn residual income from your entire team's performance down to 5 levels deep.
                </p>
              </motion.div>
    
              <motion.div
                className="bg-[#1A2A38] p-8 rounded-lg"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#0E1624] rounded-full h-16 w-16 flex items-center justify-center mb-6">
                  <DollarSign className="h-8 w-8 text-[#4CD3C8]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Performance Bonuses</h3>
                <p className="text-gray-300">
                  Qualify for additional monthly bonuses based on team growth and subscription sales.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        )
}

export default Income