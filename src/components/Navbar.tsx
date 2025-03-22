
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-10 bg-navy-darker border-b border-navy-dark flex items-center justify-between transition-all duration-300 ease-in-out">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-purple w-8 h-8 flex items-center justify-center rounded-md text-white font-bold">
          SI
        </div>
        <Link to="/" className="text-white font-semibold text-lg">
          Stepstone Invest
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <NavItem label="Home" active />
        <NavItem label="Investments" />
        <NavItem label="Performance" />
        <NavItem label="About" />
        <NavItem label="Contact" />
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="outline" className="border-gray-700 text-white hover:bg-navy-dark">
          Sign In
        </Button>
        <Button className="bg-gradient-purple hover:opacity-90 text-white border-none">
          Get Started
        </Button>
      </div>
    </nav>
  );
};

const NavItem = ({ label, active = false }: { label: string; active?: boolean }) => {
  return (
    <div className="relative group">
      <button className={`flex items-center space-x-1 text-sm ${active ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}>
        <span>{label}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-purple rounded-full" />
      )}
    </div>
  );
};

export default Navbar;
