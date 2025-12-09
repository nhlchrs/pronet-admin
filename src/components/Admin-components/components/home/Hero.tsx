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
import { motion } from "framer-motion";
import NavMenu from '@/components/home/NavMenu';

const Hero = () => {

  return (
    <header className="py-24 relative bg-[#0E1624] text-white overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Pro Net Solutions - Multi-Service Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-300"
          >
            Choose from our diverse range of services - Financial Markets, Fantasy Gaming, and Dropshipping Solutions.
          </motion.p>

          {/* Animated Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link to="/signup">
              <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38] font-bold px-8 py-4 text-lg flex items-center">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                className="border-[#4CD3C8] text-[#4CD3C8] hover:bg-[#4CD3C8] hover:text-[#1A2A38] font-bold px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Animated Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
            className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-[#4CD3C8] mr-2" />
              <span>Secure & Licensed</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-[#4CD3C8] mr-2" />
              <span>10,000+ Active Members</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-[#4CD3C8] mr-2" />
              <span>Industry Leaders</span>
            </div>
          </motion.div>

        </div>
      </div>
    </header>
  );
};

export default Hero;
