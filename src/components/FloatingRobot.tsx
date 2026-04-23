import { Link } from "@tanstack/react-router";
import { MessageCircle, Sparkles } from "lucide-react";

const FloatingRobot = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-float">
      <Link
        to="/chat"
        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 via-sky-300 to-blue-300 shadow-elegant transition-all duration-300 hover:scale-110 hover:shadow-glow animate-shimmer"
      >
        {/* Glittery Overlay Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute -top-2 -left-2 w-2 h-2">
          <Sparkles className="w-full h-full text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5">
          <Sparkles className="w-full h-full text-pink-400 animate-spin" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </div>
        <div className="absolute top-0 -right-2 w-1 h-1">
          <Sparkles className="w-full h-full text-blue-400 animate-spin" style={{ animationDuration: '2s', animationDelay: '1s' }} />
        </div>

        {/* Cute Character Face */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Graduation Cap with Glitter */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-4 bg-gradient-to-b from-blue-700 to-blue-900 rounded-t-sm relative animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-300/30 to-transparent"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-800"></div>
              {/* Glitter on cap */}
              <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-0.5 right-1 w-0.5 h-0.5 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Face Container */}
          <div className="relative">
            {/* Large Expressive Eyes with Sparkles */}
            <div className="flex gap-3 mb-1">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-br from-white to-gray-100 rounded-full border border-gray-300 shadow-sm animate-pulse"></div>
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-white rounded-full animate-ping"></div>
                <div className="absolute top-0 right-0 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-br from-white to-gray-100 rounded-full border border-gray-300 shadow-sm animate-pulse"></div>
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full animate-pulse" style={{ animationDelay: '75ms' }}></div>
                <div className="absolute top-0 left-0 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                <div className="absolute top-0 right-0 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.9s' }}></div>
              </div>
            </div>

            {/* Small Orange Nose with Glitter */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full animate-pulse shadow-sm"></div>

            {/* Pink Blush Cheeks with Shimmer */}
            <div className="absolute top-2 -left-2 w-2 h-1.5 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-2 -right-2 w-2 h-1.5 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>

            {/* Small Mouth with Glitter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-gradient-to-r from-pink-300 to-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Chat Icon Overlay with Glitter */}
        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 shadow-sm animate-pulse">
          <MessageCircle className="h-3 w-3 text-white" />
          <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full animate-ping"></div>
        </div>

        {/* Enhanced Hover Effect Ring with Glitter */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-200/40 via-white/20 to-pink-200/30 scale-0 group-hover:scale-100 transition-transform duration-300 animate-pulse"></div>
        
        {/* Additional Glitter Ring */}
        <div className="absolute inset-0 rounded-full border border-white/20 scale-0 group-hover:scale-105 transition-transform duration-500"></div>
      </Link>
    </div>
  );
};

export default FloatingRobot;
