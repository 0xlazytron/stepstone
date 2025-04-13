
import React from 'react';
import Navbar from '@/components/Navbar';
import InvestmentCalculator from '@/components/InvestmentCalculator';
import { BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <InvestmentCalculator />
    </div>
  );
};

export default Index;
