import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // More reliable image sources with additional fallbacks
  const imageSources = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
    "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
  ];
  
  // Static local fallback (should be in your public folder)
  const staticFallback = "/assets/technology-illustration.jpg";

  // Preload images for better performance
  useEffect(() => {
    const tryLoadImage = (index) => {
      if (index >= imageSources.length) {
        setImageError(true);
        setImageLoaded(true); // Still mark as loaded to show the fallback
        return;
      }
      
      const img = new Image();
      img.src = imageSources[index];
      img.onload = () => {
        setCurrentImageIndex(index);
        setImageLoaded(true);
      };
      img.onerror = () => tryLoadImage(index + 1);
    };
    
    tryLoadImage(0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">GenX</div>
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>
        <Link to="/login" className="bg-transparent hover:bg-indigo-600 text-indigo-600 hover:text-white py-2 px-4 border border-indigo-600 hover:border-transparent rounded transition-all duration-300">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 flex flex-col items-start">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-800">
            Welcome to the <span className="text-indigo-600">Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover the next generation of innovative solutions designed for your success.
          </p>
          <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Get Started
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 relative min-h-[300px]">
          {/* Loading indicator */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Main image with fallbacks */}
          <img 
            src={imageError ? staticFallback : imageSources[currentImageIndex]} 
            alt="Technology illustration" 
            className="rounded-lg shadow-2xl w-full h-auto object-cover"
            style={{ 
              minHeight: '300px',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.log(`Image ${currentImageIndex} failed to load, trying next`);
              if (currentImageIndex < imageSources.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1);
              } else {
                setImageError(true);
                // Last resort: inline SVG as data URL
                const imgElement = document.getElementById('hero-image');
                if (imgElement) {
                  imgElement.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
                      <rect width="600" height="400" fill="#4F46E5" opacity="0.1"/>
                      <text x="300" y="200" font-family="Arial" font-size="24" fill="#4F46E5" text-anchor="middle">
                        Technology Illustration
                      </text>
                    </svg>
                  `);
                  setImageLoaded(true);
                }
              }
            }}
            id="hero-image"
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature {item}</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 GenX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
