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

const LifeStyle =()=>{
    return(<section className="py-16 bg-[#1A2A38]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Lifestyle Fund</h2>
              <p className="text-xl text-gray-300">
                See how our members are using their earnings to fund the lifestyle of their dreams.
              </p>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Lifestyle 1 */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#0E1624] border-0 overflow-hidden text-center">
                  <img
                    src="/lovable-uploads/1dc005c5-1f18-4598-92dc-030b0afec31f.png"
                    alt="Gold Trading"
                    className="w-full h-52 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#4CD3C8]">Sparkle Through Gold Trading</h3>
                    <p className="text-gray-300 mb-6">
                      A smart money move that has proven profitable throughout economic uncertainties.
                    </p>
                    <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38]">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
    
              {/* Lifestyle 2 */}
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#0E1624] border-0 overflow-hidden text-center">
                  <img
                    src="/lovable-uploads/1dc005c5-1f18-4598-92dc-030b0afec31f.png"
                    alt="Travel the World"
                    className="w-full h-52 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#4CD3C8]">Travel the World on Earnings</h3>
                    <p className="text-gray-300 mb-6">
                      Learn how our members use market knowledge to fund their worldly adventures.
                    </p>
                    <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38]">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
    
              {/* Lifestyle 3 */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#0E1624] border-0 overflow-hidden text-center">
                  <img
                    src="/lovable-uploads/1dc005c5-1f18-4598-92dc-030b0afec31f.png"
                    alt="Real Estate"
                    className="w-full h-52 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-[#4CD3C8]">Build Dreams, Brick by Brick</h3>
                    <p className="text-gray-300 mb-6">
                      See how our top traders built their real estate portfolios with consistent market wins.
                    </p>
                    <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-[#1A2A38]">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>)
}

export default LifeStyle