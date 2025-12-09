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

const Community =()=>{
    return(
       <section className="py-16 bg-[#1A2A38]">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      
                <motion.div
                  initial={{ opacity: 0, x: -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold mb-6">Join Our Thriving Community</h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Connect with like-minded individuals who are committed to financial freedom and personal growth.
                  </p>
      
                  <div className="space-y-4 mb-8">
                    {[
                      "Daily market analysis and discussion",
                      "Weekly live training sessions and Q&A",
                      "Networking opportunities with successful traders",
                      "Exclusive access to our private community forum",
                    ].map((text, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="bg-[#0E1624] rounded-full h-10 w-10 flex items-center justify-center mr-3">
                          <Check className="h-5 w-5 text-[#4CD3C8]" />
                        </div>
                        <span>{text}</span>
                      </motion.div>
                    ))}
                  </div>
      
                  <Link to="/signup">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38] font-bold px-8 py-3 text-lg">
                        Join Now
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
      
                <motion.div
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.img
                    src="/lovable-uploads/3ad44ef9-5321-42a6-bf72-03b8e9f28de2.png"
                    alt="Community"
                    className="rounded-lg shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              </div>
            </div>
          </section>
    )
}

export default Community