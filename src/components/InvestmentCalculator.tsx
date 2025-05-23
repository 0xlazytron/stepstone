/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Sparkle, Trophy } from 'lucide-react';

interface InvestmentData {
  month: number;
  value: number;
}

const InvestmentCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(40000);
  const [monthlyRoi, setMonthlyRoi] = useState(5);
  const [chartData, setChartData] = useState<InvestmentData[]>([]);
  const [doubleMonth, setDoubleMonth] = useState(0);
  const [doubleValue, setDoubleValue] = useState(0);
  const [annualRoi, setAnnualRoi] = useState(0);
  const [highlightActive, setHighlightActive] = useState(false);
  const [showDoubleTooltip, setShowDoubleTooltip] = useState(false);

  const calculateInvestmentGrowth = () => {
    // Calculate annual ROI
    const annualROI = monthlyRoi * 12;

    // Calculate months to reach 200% (double the investment)
    // For 1% monthly ROI, it takes 200 months to reach 200%
    // So we can calculate the months needed based on the monthly ROI percentage
    const monthsToDouble = Math.round(200 / monthlyRoi);

    // Generate chart data up to the doubling point
    const data: InvestmentData[] = [];
    const doubleAmount = initialInvestment * 2;
    const monthlyReturn = initialInvestment * (monthlyRoi / 100);
    
    let currentValue = initialInvestment;
    let accumulatedROI = 0;
    
    for (let month = 1; month <= monthsToDouble; month++) {
      // Add the monthly ROI
      accumulatedROI += monthlyReturn;
      currentValue = initialInvestment + accumulatedROI;
      
      // Ensure we don't exceed double the investment
      if (currentValue > doubleAmount) {
        currentValue = doubleAmount;
      }
      
      data.push({
        month: month,
        value: Number(currentValue.toFixed(2)),
      });

      // Stop if we've reached double the investment
      if (currentValue >= doubleAmount) {
        break;
      }
    }

    // Update state variables
    setChartData(data);
    setDoubleMonth(monthsToDouble);
    setDoubleValue(doubleAmount);
    setAnnualRoi(annualROI);

    // Reset highlight when data changes
    setHighlightActive(false);
    setShowDoubleTooltip(false);
  };

  useEffect(() => {
    calculateInvestmentGrowth();
  }, [initialInvestment, monthlyRoi]);

  // Format chart data for x-axis ticks (in years)
  const getYearTicks = () => {
    const maxYears = Math.ceil(doubleMonth / 12) + 1;
    return Array.from({ length: maxYears + 1 }, (_, i) => i * 12);
  };

  // Custom tooltip component for chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isDoublePoint = data.month === doubleMonth;
      
      // Calculate growth percentage starting from 0%
      // 100% means got back initial investment (risk-free point)
      // 200% means doubled the investment
      const growthAmount = data.value - initialInvestment;
      const percentGrowth = Math.min((growthAmount / initialInvestment) * 100, 200).toFixed(0);
      
      return (
        <div className={`chart-tooltip ${isDoublePoint ? 'double-point-tooltip' : ''}`}>
          {isDoublePoint && (
            <div className="flex items-center justify-center mb-2 text-yellow-400 animate-pulse">
              <span className="font-xs text-[#FF8C00]">Investment Doubled!</span>
            </div>
          )}
          {Number(percentGrowth) >= 100 && !isDoublePoint && (
            <div className="flex items-center justify-center mb-2 text-green-400">
              <span className="font-xs">Risk-Free Point Reached!</span>
            </div>
          )}
          <p className="text-sm text-gray-300 mb-1">Month {data.month}</p>
          <p className="text-lg font-semibold bg-gradient-to-r from-[#876DF8] to-[#C93DA7] bg-clip-text text-transparent">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs">ROI Growth: {percentGrowth}%</p>
          <p className="text-xs">Monthly Return: {formatCurrency(monthlyRoi * initialInvestment / 100)}</p>
        </div>
      );
    }
    return null;
  };

  // Format for Y-axis ticks
  const formatYAxisTick = (value: number) => {
    if (value === 0) return '$0';
    if (value >= 1000) return `$${Math.floor(value / 1000)}k`;
    return `$${value}`;
  };

  // Format for X-axis ticks
  const formatXAxisTick = (value: number) => {
    if (value === 0) return '0m';
    if (value % 12 === 0) return `${Math.floor(value / 12)}y`;
    return `${value}m`;
  };

  // Handle slider changes
  const handleInitialInvestmentChange = (value: number[]) => {
    setInitialInvestment(value[0]);
  };

  const handleMonthlyRoiChange = (value: number[]) => {
    setMonthlyRoi(value[0]);
  };

  const toggleDoubleHighlight = () => {
    setHighlightActive(!highlightActive);
    setShowDoubleTooltip(!showDoubleTooltip);
  };

  const DoubleIndicator = () => {
    if (doubleMonth <= 0) return null;
    return (
      <div
        className={`absolute top-5 right-4 flex items-center bg-navy-darker bg-opacity-90 backdrop-blur-sm border ${highlightActive ? 'border-[#5A5A73]' : 'border-purple-light'
          } rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow-purple`}
        onClick={toggleDoubleHighlight}
        onMouseEnter={() => setHighlightActive(true)}
        onMouseLeave={() => !showDoubleTooltip && setHighlightActive(false)}
      >
        <div className={`flex items-center ${highlightActive ? 'text-yellow-300' : 'text-purple-light'}`}>
          <Sparkle size={18} className={`mr-2 ${highlightActive ? 'animate-pulse' : ''}`} />
          <span className="font-medium text-sm">
            Double in <span className="font-bold">{doubleMonth} months</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-1 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-3">
        {/* Initial Investment Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-400">Initial Investment</label>
            <span className="text-2xl font-semibold bg-gradient-to-r from-[#8271FF] to-[#CF39A0] bg-clip-text text-transparent">
              {formatCurrency(initialInvestment)}
            </span>
          </div>
          <div className="bg-navy-dark rounded-lg p-6">
            <Slider
              defaultValue={[40000]}
              min={2000}
              max={50000}
              step={100}
              value={[initialInvestment]}
              onValueChange={handleInitialInvestmentChange}
              className="slider-track-purple"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>$2,000</span>
              <span>$50,000</span>
            </div>
          </div>
        </div>

        {/* Monthly ROI Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-gray-400">Monthly ROI</label>
            <span className="text-2xl font-semibold bg-gradient-to-r from-[#8271FF] to-[#CF39A0] bg-clip-text text-transparent">
              {monthlyRoi}% / month
            </span>
          </div>
          <div className="bg-navy-dark rounded-lg p-6">
            <Slider
              defaultValue={[5]}
              min={1}
              max={6}
              step={0.1}
              value={[monthlyRoi]}
              onValueChange={handleMonthlyRoiChange}
              className="slider-track-purple"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>1.0% / month</span>
              <span>6.0% / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Growth Chart */}
      <div className="bg-navy-dark rounded-lg p-6 mb-3 relative">
        <h3 className="text-white text-lg font-medium mb-4">Investment Growth Over Time</h3>
        <DoubleIndicator />
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 20, bottom: 10 }}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A98DEF" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#8658E9" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="doubleGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFD166" stopOpacity={1} />
                  <stop offset="100%" stopColor="#F97316" stopOpacity={1} />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={formatXAxisTick}
                ticks={getYearTicks()}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxisTick}
                axisLine={false}
                tickLine={false}
                width={50}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                domain={[0, 'dataMax']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#A98DEF"
                strokeWidth={3}
                fill="url(#purpleGradient)"
                animationDuration={1000}
              />
              {doubleMonth > 0 && (
                <ReferenceLine
                  x={doubleMonth}
                  stroke={highlightActive ? "url(#doubleGradient)" : "#FF6B6B"}
                  strokeWidth={highlightActive ? 3 : 2}
                  strokeDasharray={highlightActive ? "0" : "5 5"}
                  style={highlightActive ? { filter: "url(#glow)" } : {}}
                  label={!showDoubleTooltip ? {
                    value: '',
                    position: 'top',
                    fill: highlightActive ? '#FFD166' : '#FFD166',
                    fontSize: 10,
                    fontWeight: 'normal'
                  } : null}
                />
              )}
              {doubleMonth > 0 && showDoubleTooltip && (
                <svg>
                  <circle
                    cx={0} // This will be positioned by the component
                    cy={0} // This will be positioned by the component
                    r={6}
                    fill="#FFD166"
                    className="animate-pulse"
                  />
                </svg>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {doubleMonth > 0 && highlightActive && (
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 bg-opacity-20 text-white rounded-md py-3 px-4 text-center text-sm mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-center">
              <Trophy size={18} className="mr-2 text-yellow-300" />
              <span>
                Your investment doubles to <strong>{formatCurrency(doubleValue)}</strong> in just <strong>{doubleMonth} months</strong>
              </span>
            </div>
          </div>
        )}
        {!highlightActive && (
          <div className="bg-gradient-to-r from-[#F97316] to-[#0EA5E9] text-white rounded-md py-3 px-4 text-center text-sm mt-6 max-w-md mx-auto">
            Monthly ROI: {monthlyRoi}% ({formatCurrency(initialInvestment * monthlyRoi / 100)})
            <br />
            Months to Risk-Free (100%): {Math.round(100 / monthlyRoi)}
            <br />
            Months to Double (200%): {Math.round(200 / monthlyRoi)}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatsCard
          title="Initial Investment"
          value={formatCurrency(initialInvestment)}
          textColor="text-white"
        />
        <StatsCard
          title="Monthly ROI"
          value={`${monthlyRoi}%`}
          textColor="text-purple-light"
        />
        <StatsCard
          title="Risk-Free Point"
          value={`${Math.round(100 / monthlyRoi)} months`}
          textColor="bg-gradient-to-r from-[#8271FF] to-[#CF39A0] bg-clip-text text-transparent"
          highlight={true}
        />
        <StatsCard
          title="Time to Double"
          value={`${Math.round(200 / monthlyRoi)} months`}
          textColor="bg-gradient-to-r from-[#876DF8] to-[#C93DA7] bg-clip-text text-transparent"
          highlight={true}
        />
      </div>
    </div>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string;
  textColor: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

const StatsCard = ({ title, value, textColor, highlight = false, icon }: StatsCardProps) => {
  return (
    <div className={`bg-navy-dark rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${highlight ? 'hover:shadow-glow-purple hover:scale-105' : ''}`}>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <div className={`text-2xl font-bold ${textColor} flex items-center`}>
        {value}
        {icon}
      </div>
    </div>
  );
};

export default InvestmentCalculator;