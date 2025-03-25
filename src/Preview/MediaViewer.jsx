import React, { useState, useEffect } from 'react';

const MediaViewer = ({ url, type, filename }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectedType, setDetectedType] = useState(type);

  // Comprehensive extension lists
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff', 'tif', 'ico', 'jfif', 'pjpeg', 'pjp', 'avif', 'apng'];
  const videoExtensions = ['mp4', 'webm', 'ogv', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'mpg', 'mpeg', 'm4v', '3gp', '3g2'];
  const fontExtensions = ['ttf', 'otf', 'woff', 'woff2', 'eot', 'pfb', 'pfm', 'tfil', 'dfont', 'pfa', 'afm'];
  
  // Audio extensions for potential future support
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'];

  useEffect(() => {
    // Detect file type from extension if not provided
    if (!type || type === 'file') {
      const extension = filename.split('.').pop().toLowerCase();
      
      if (imageExtensions.includes(extension)) {
        setDetectedType('image');
      } else if (videoExtensions.includes(extension)) {
        setDetectedType('video');
      } else if (fontExtensions.includes(extension)) {
        setDetectedType('font');
      } else if (audioExtensions.includes(extension)) {
        setDetectedType('audio');
      } else {
        setDetectedType('unknown');
      }
    }
  }, [filename, type]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Failed to load the image');
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setError('Failed to load the video');
  };

  const handleAudioLoad = () => {
    setIsLoading(false);
  };
  
  const handleAudioError = () => {
    setIsLoading(false);
    setError('Failed to load the audio file');
  };

  const renderMediaContent = () => {
    switch (detectedType) {
      case 'image':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            {isLoading && <div className="mb-4 animate-pulse text-gray-400">Loading image...</div>}
            <img 
              src={url} 
              alt={filename}
              className="max-h-full max-w-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </div>
        );

      case 'video':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            {isLoading && <div className="mb-4 animate-pulse text-gray-400">Loading video...</div>}
            <video 
              src={url} 
              controls 
              className="max-h-full max-w-full"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              style={{ display: isLoading ? 'none' : 'block' }}
            >
              Your browser does not support the video tag.
            </video>
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center h-full p-6">
            {isLoading && <div className="mb-4 animate-pulse text-gray-400">Loading audio...</div>}
            <div className="w-full max-w-md">
              <h3 className="text-lg font-medium mb-4 text-center">{filename}</h3>
              <audio
                src={url}
                controls
                className="w-full"
                onLoadedData={handleAudioLoad}
                onError={handleAudioError}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </div>
        );

      case 'font':
        // Extract font format for @font-face
        const extension = filename.split('.').pop().toLowerCase();
        const fontName = filename.split('.')[0];
        let fontFormat = 'truetype'; // default
        
        switch (extension) {
          case 'otf': fontFormat = 'opentype'; break;
          case 'woff': fontFormat = 'woff'; break;
          case 'woff2': fontFormat = 'woff2'; break;
          case 'eot': fontFormat = 'embedded-opentype'; break;
          default: fontFormat = 'truetype'; // ttf and others
        }
        
        return (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <style>
              {`
                @font-face {
                  font-family: "${fontName}";
                  src: url("${url}") format("${fontFormat}");
                }
              `}
            </style>
            <h3 className="text-lg font-medium mb-6">Font Preview: {filename}</h3>
            <div className="text-center space-y-4">
              <p style={{ fontFamily: fontName, fontSize: '18px' }}>
                The quick brown fox jumps over the lazy dog.
              </p>
              <p style={{ fontFamily: fontName, fontSize: '24px' }}>
                ABCDEFGHIJKLM NOPQRSTUVWXYZ
              </p>
              <p style={{ fontFamily: fontName, fontSize: '24px' }}>
                abcdefghijklm nopqrstuvwxyz
              </p>
              <p style={{ fontFamily: fontName, fontSize: '24px' }}>
                0123456789 !@#$%^&*()
              </p>
            </div>
            <a 
              href={url} 
              download={filename}
              className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
            >
              Download Font
            </a>
          </div>
        );

      default:
        return (
          <div className="text-center p-6">
            <p>This file type ({filename.split('.').pop()}) cannot be previewed directly.</p>
            <a 
              href={url} 
              download={filename}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block"
            >
              Download File
            </a>
          </div>
        );
    }
  };

  return (
    <div className="h-[90%] border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden bg-white">
      {renderMediaContent()}
    </div>
  );
};

export default MediaViewer;
