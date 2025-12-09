import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";

const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1A2A38] py-4 sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/1dc005c5-1f18-4598-92dc-030b0afec31f.png"
            alt="Pro Net Solutions Logo"
            className="h-8 mr-2"
          />
          <span className="text-xl font-bold text-white">
            Pro Net Solutions
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-[#4CD3C8] data-[state=open]:text-[#4CD3C8]">
                  Pages
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-[#1A2A38] border border-[#4CD3C8]/30 rounded-md shadow-lg w-56">
                  <div className="p-3 space-y-1">
                    <Link
                      to="/about"
                      className="block p-2 rounded-md text-sm text-gray-200 hover:bg-[#4CD3C8]/10 hover:text-[#4CD3C8]"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/services"
                      className="block p-2 rounded-md text-sm text-gray-200 hover:bg-[#4CD3C8]/10 hover:text-[#4CD3C8]"
                    >
                      Our Services
                    </Link>
                    <Link
                      to="/testimonials"
                      className="block p-2 rounded-md text-sm text-gray-200 hover:bg-[#4CD3C8]/10 hover:text-[#4CD3C8]"
                    >
                      Testimonials
                    </Link>
                    <Link
                      to="/contact"
                      className="block p-2 rounded-md text-sm text-gray-200 hover:bg-[#4CD3C8]/10 hover:text-[#4CD3C8]"
                    >
                      Contact Us
                    </Link>
                    <div className="border-t border-[#4CD3C8]/20 my-1"></div>
                    <Link
                      to="/faq"
                      className="block p-2 rounded-md text-sm text-gray-200 hover:bg-[#4CD3C8]/10 hover:text-[#4CD3C8]"
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block p-2 rounded-md text-sm text-gray-200 hover:bg-[#4CD3C8]/10 hover:text-[#4CD3C8]"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin"
                      className="block p-2 rounded-md text-sm text-gray-200 hover:bg-[#4CD3C8]/10 hover:text-[#4CD3C8]"
                    >
                      Admin Portal
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link
            to="/login"
            className="text-white hover:text-[#4CD3C8] transition-colors"
          >
            Login
          </Link>
          <Link to="/signup">
            <Button className="bg-[#4CD3C8] hover:bg-[#3CC3B8] text-white">
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1A2A38] border-t border-[#4CD3C8]/30 animate-slideDown">
          <div className="px-6 py-4 space-y-3">
            <details className="group">
              <summary className="cursor-pointer text-white text-base font-medium flex justify-between items-center">
                Pages
                <span className="text-[#4CD3C8] transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="mt-2 ml-2 space-y-2">
                <Link to="/about" className="block text-gray-300 hover:text-[#4CD3C8]">About Us</Link>
                <Link to="/services" className="block text-gray-300 hover:text-[#4CD3C8]">Our Services</Link>
                <Link to="/testimonials" className="block text-gray-300 hover:text-[#4CD3C8]">Testimonials</Link>
                <Link to="/contact" className="block text-gray-300 hover:text-[#4CD3C8]">Contact Us</Link>
                <Link to="/faq" className="block text-gray-300 hover:text-[#4CD3C8]">FAQ</Link>
                <Link to="/dashboard" className="block text-gray-300 hover:text-[#4CD3C8]">Dashboard</Link>
                <Link to="/admin" className="block text-gray-300 hover:text-[#4CD3C8]">Admin Portal</Link>
              </div>
            </details>

            <Link
              to="/login"
              className="block text-white hover:text-[#4CD3C8] transition-colors "
            >
                <Button className="w-full bg-[#4CD3C8] hover:bg-[#3CC3B8] text-white mb-2">

              Login
                </Button>
            </Link>
            <Link to="/signup">
              <Button className="w-full bg-[#4CD3C8] hover:bg-[#3CC3B8] text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavMenu;
