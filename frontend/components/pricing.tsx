import React from 'react';

type PricingCardProps = {
  title: string;
  price: string;
  features: string[];
  isPrimary?: boolean;
  buttonText?: string;
};

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  features, 
  isPrimary = false,
  buttonText = "BUY NOW"
}) => {
  const cardClasses = isPrimary 
    ? "bg-gradient-to-br from-purple-600 to-blue-700 text-white border-transparent"
    : "bg-white text-gray-900 border-gray-200";

  const buttonClasses = isPrimary
    ? "bg-white text-purple-700 hover:bg-gray-100"
    : "bg-gradient-to-r from-purple-600 to-blue-700 text-white hover:from-purple-700 hover:to-blue-800";

  return (
    <div 
      className={`relative rounded-2xl border p-8 shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl ${cardClasses}`}
      style={{ 
        transformOrigin: 'center',
        transform: 'perspective(1000px) rotateX(0deg)'
      }}
    >
      <div className="text-center">
        <h3 className={`text-xl font-semibold mb-2 ${isPrimary ? 'text-white' : 'text-purple-700'}`}>
          {title}
        </h3>
        
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className={`text-sm ml-1 ${isPrimary ? 'text-purple-100' : 'text-gray-600'}`}>
            Per Month
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className={`text-sm flex items-center ${isPrimary ? 'text-purple-100' : 'text-gray-600'}`}
            >
              <span className={`w-2 h-2 rounded-full mr-3 ${isPrimary ? 'bg-purple-200' : 'bg-purple-600'}`}></span>
              {feature}
            </li>
          ))}
        </ul>

        <button className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${buttonClasses}`}>
          {buttonText} ↓
        </button>
      </div>
    </div>
  );
};

const PricingComponent = () => {
  const pricingPlans = [
    {
      title: "Standard",
      price: "29",
      features: ["1000+ Users", "10 time Voice Bot", "10 time Chat Bot"]
    },
    {
      title: "Advanced",
      price: "39", 
      features: ["15 Users", "100 time Voice Bot", "100 time Chat Bot"],
      isPrimary: true
    },
    {
      title: "Complete",
      price: "59",
      features: ["15 Users", "Unlimited Voice Bot", "Unlimited Chat Bot"]
    }
  ];

  return (
    <div 
      className="min-h-screen py-16 px-4 relative"
      style={{
        // backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundImage: `url('/script1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60"
        style={{ backgroundColor: 'rgba(33, 0, 31, 0.8)' }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pricing options for all budgets
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="flex justify-center">
              <div className="w-full max-w-sm">
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  features={plan.features}
                  isPrimary={plan.isPrimary}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;