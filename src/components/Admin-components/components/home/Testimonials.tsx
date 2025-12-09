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

const Testimonials =()=>{
    return( <section className="py-16 bg-[#1A2A38]">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">What Our Members Say</h2>
                <p className="text-xl text-gray-300">Real success stories from our community</p>
              </div>
    
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-[#0E1624] border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">
                      "Pro Net Solutions changed my financial future. The trading signals are incredibly accurate and the community support is amazing."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4CD3C8] rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1A2A38] font-bold">JD</span>
                      </div>
                      <div>
                        <p className="font-bold">John Doe</p>
                        <p className="text-sm text-gray-400">Active Trader</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                <Card className="bg-[#0E1624] border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">
                      "The dropshipping tools and support helped me build a six-figure business in just 8 months. Highly recommend!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4CD3C8] rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1A2A38] font-bold">SM</span>
                      </div>
                      <div>
                        <p className="font-bold">Sarah Miller</p>
                        <p className="text-sm text-gray-400">E-commerce Entrepreneur</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                <Card className="bg-[#0E1624] border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">
                      "The gaming platform is fantastic and the affiliate program provides excellent passive income opportunities."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#4CD3C8] rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#1A2A38] font-bold">MR</span>
                      </div>
                      <div>
                        <p className="font-bold">Mike Rodriguez</p>
                        <p className="text-sm text-gray-400">Gaming Enthusiast</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>)
}

export default Testimonials