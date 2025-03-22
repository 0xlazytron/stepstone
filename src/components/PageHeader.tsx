
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; path?: string }[];
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs, icon }) => {
  return (
    <div className="py-6 w-full max-w-7xl mx-auto px-4 animate-fadeIn">
      <div className="flex items-center mb-2">
        {icon && <div className="mr-3">{icon}</div>}
        <div>
          <div className="flex items-center text-sm text-gray-400 mb-2">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight size={14} className="mx-1" />}
                {item.path ? (
                  <Link to={item.path} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-purple">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
