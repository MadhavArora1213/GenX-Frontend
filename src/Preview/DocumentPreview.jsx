import React, { useState, useEffect, useRef } from 'react';
import { 
  FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, 
  FaFileAlt, FaFileImage, FaFileCode, FaFile, FaDownload,
  FaCode, FaEye, FaSearchPlus, FaSearchMinus, FaExpand, 
  FaExternalLinkAlt, FaTerminal, FaChevronLeft, FaChevronRight,
  FaTable
} from 'react-icons/fa';
import './DocumentPreview.css';

// Import Prism for code syntax highlighting
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

// Import core languages directly rather than trying to load them dynamically
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-clike';

// Import other commonly used languages
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

// PDF.js loading status tracking - avoid multiple attempts
const PDF_LIB_STATUS = {
  NOT_LOADED: 'not_loaded',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed'
};

// Global tracking of PDF.js loading status
let pdfJsStatus = PDF_LIB_STATUS.NOT_LOADED;

// Replace dynamic loading function with a safer language check
const isPrismLanguageLoaded = (language) => {
  return Prism.languages[language] !== undefined;
};

// PDF.js loading script component
const PdfJsScript = ({ onLoad }) => {
  useEffect(() => {
    // Load PDF.js from CDN
    const pdfJsScript = document.createElement('script');
    pdfJsScript.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js';
    pdfJsScript.async = true;
    pdfJsScript.onload = () => {
      // Set worker source from CDN
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js';
      onLoad(window.pdfjsLib);
    };
    
    document.head.appendChild(pdfJsScript);
    
    return () => {
      if (document.head.contains(pdfJsScript)) {
        document.head.removeChild(pdfJsScript);
      }
    };
  }, [onLoad]);
  
  return null;
};

const DocumentPreview = ({ file, content, useCodeMirrorHighlighting = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [objectUrl, setObjectUrl] = useState(null);
  const fileRef = useRef(file);
  const canvasRef = useRef(null);
  const [pdfLib, setPdfLib] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfPageNum, setPdfPageNum] = useState(1);
  const [pdfNumPages, setPdfNumPages] = useState(0);
  const [pdfScale, setPdfScale] = useState(1.2);
  const [usePdfFallback, setUsePdfFallback] = useState(true); // Default to fallback mode for safety
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isPdfValid, setIsPdfValid] = useState(false);
  
  // Extract file extension
  const extension = file?.name?.split('.').pop().toLowerCase();
  
  // File type categories with their extensions
  const fileTypes = {
    pdf: ['pdf'],
    word: ['doc', 'docx', 'docm', 'dot', 'dotx', 'rtf'],
    excel: ['xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'csv'],
    powerpoint: ['ppt', 'pptx', 'pptm', 'pot', 'potx', 'pps', 'ppsx'],
    text: ['txt', 'log'],
    code: [
      // Web development
      'js', 'jsx', 'ts', 'tsx', 'html', 'htm', 'css', 'scss', 'sass', 'less',
      // Server languages
      'php', 'py', 'rb', 'java', 'jsp', 'asp', 'aspx',
      // C-family languages
      'c', 'h', 'cpp', 'hpp', 'cc', 'cxx', 'c++', 'cs', 'go',
      // JVM languages
      'groovy', 'gradle', 'scala', 'kt', 'kts',
      // Mobile
      'swift', 'dart', 'm', 'mm',
      // Microsoft ecosystem
      'ps1', 'vb', 'vbs', 'bat', 'cmd',
      // Shell scripting
      'sh', 'bash', 'zsh', 'fish',
      // Databases
      'sql', 'plsql', 'psql',
      // Markup & data
      'xml', 'xsl', 'xsd', 'dtd', 'json', 'yaml', 'yml', 'toml', 'md', 'markdown',
      // Config files
      'ini', 'conf', 'cfg',
      // Rust ecosystem
      'rs', 'rust', 'cargo',
      // Functional languages
      'hs', 'elm', 'ex', 'exs', 'erl', 'hrl', 'clj', 'cljs', 'fs', 'fsx',
      // Scientific computing
      'r', 'matlab', 'octave', 'fortran', 'f', 'f90',
      // Other programming languages
      'lua', 'pl', 'pm', 'tcl', 'asm', 'pas', 'pp', 'lsp', 'lisp', 'v', 'vh',
      // DevOps
      'dockerfile', 'docker', 'tf', 'hcl', 'jenkinsfile', 'nginx', 'graphql', 'proto',
      // Version control
      'diff', 'patch',
    ],
  };
  
  // Map file extensions to Prism language identifiers
  const codeLanguageMap = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'html': 'markup',
    'htm': 'markup',
    'xml': 'markup',
    'svg': 'markup',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'less': 'less',
    'php': 'php',
    'py': 'python',
    'rb': 'ruby',
    'java': 'java',
    'c': 'c',
    'h': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'c++': 'cpp',
    'hpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'kts': 'kotlin',
    'scala': 'scala',
    'groovy': 'groovy',
    'gradle': 'groovy',
    'dart': 'dart',
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    'ps1': 'powershell',
    'sql': 'sql',
    'yaml': 'yaml',
    'yml': 'yaml',
    'json': 'json',
    'md': 'markdown',
    'markdown': 'markdown',
    'r': 'r',
    'lua': 'lua',
    'pl': 'perl',
    'pm': 'perl',
    'perl': 'perl',
    'clj': 'clojure',
    'cljs': 'clojure',
    'vb': 'clike', // Changed from vbnet to clike (generic syntax highlighting)
    'vbs': 'clike', // Changed from vbnet to clike (generic syntax highlighting)
    'docker': 'docker',
    'dockerfile': 'docker',
    'graphql': 'graphql',
    'gql': 'graphql',
    'diff': 'diff',
    'patch': 'diff',
    'ini': 'ini',
    'makefile': 'makefile',
    // Add more mappings as needed
  };
  
  // Determine file type based on extension and content
  const getFileType = (ext) => {
    // Binary office file formats - always handle with fallback approach
    const officeBinaryFormats = ['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt'];
    
    if (officeBinaryFormats.includes(ext)) {
      return 'binary';
    }
    
    for (const [type, extensions] of Object.entries(fileTypes)) {
      if (extensions.includes(ext)) {
        return type;
      }
    }
    return 'unknown';
  };
  
  const fileType = getFileType(extension);

  // If the component is being used in CodeEditor with already highlighted content
  // we might skip Prism highlighting in favor of CodeMirror's
  const shouldUseInternalHighlighting = () => {
    return !useCodeMirrorHighlighting && fileType === 'code';
  };

  // Create object URL for file preview
  useEffect(() => {
    if (file && fileRef.current !== file) {
      fileRef.current = file;
      
      // If content is directly provided (e.g., from CodeEditor)
      if (content && fileType === 'code') {
        setFileContent(content);
        setIsLoading(false);
        return;
      }

      // Check if file is valid before proceeding
      if (file.size === 0) {
        setError('File appears to be empty');
        setIsLoading(false);
        return;
      }

      // Create object URL for file previewing
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      
      // For PDF files, validate file size and type
      if (fileType === 'pdf') {
        // Default to fallback mode for small PDFs
        if (file.size < 100) { // Less than 100 bytes is likely not a valid PDF
          setUsePdfFallback(true);
          setIsPdfValid(false);
          console.warn('PDF file too small, might not be a valid PDF');
        } else {
          setIsPdfValid(true);
          // Start with fallback view for reliability
          setUsePdfFallback(true);
        }
      }
      
      // For code files, also load content as text
      if (fileType === 'code' && shouldUseInternalHighlighting()) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target.result);
          setIsLoading(false);
        };
        reader.onerror = () => {
          setError('Failed to read file content');
          setIsLoading(false);
        };
        reader.readAsText(file);
      } else {
        setIsLoading(false);
      }
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, content, fileType]);

  // Handle PDF.js library loading
  const handlePdfJsLoad = (pdfjsLib) => {
    setPdfLib(pdfjsLib);
    // Only attempt to load PDF if we have a valid file, object URL exists, 
    // we're not using fallback mode, and the PDF is likely valid
    if (fileType === 'pdf' && objectUrl && !usePdfFallback && isPdfValid) {
      loadPdfDocument(pdfjsLib, objectUrl);
    }
  };

  // Load PDF document when PDF.js is available
  const loadPdfDocument = async (lib, url) => {
    if (!lib || !url || !isPdfValid) return;
    
    setPdfLoading(true);
    try {
      // Check if URL is valid and accessible
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Failed to access PDF: ${response.status}`);
      }

      const loadingTask = lib.getDocument(url);
      loadingTask.onProgress = (progress) => {
        if (progress.total && progress.loaded === 0) {
          throw new Error('PDF data appears to be empty');
        }
      };
      
      const doc = await loadingTask.promise;
      
      if (doc.numPages < 1) {
        throw new Error('PDF contains no pages');
      }
      
      setPdfDoc(doc);
      setPdfNumPages(doc.numPages);
      setPdfPageNum(1);
      renderPage(doc, 1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setUsePdfFallback(true);
      setError(`Could not render PDF: ${err.message || 'Unknown error'}`);
    } finally {
      setPdfLoading(false);
    }
  };
  
  // Watch for pdfLib and objectUrl changes to load the document
  useEffect(() => {
    if (pdfLib && fileType === 'pdf' && objectUrl && !usePdfFallback && isPdfValid) {
      loadPdfDocument(pdfLib, objectUrl);
    }
  }, [pdfLib, objectUrl, fileType, usePdfFallback, isPdfValid]);

  // Render PDF page
  const renderPage = async (pdf, pageNumber) => {
    if (!pdf || !canvasRef.current) return;
    
    try {
      setPdfLoading(true);
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Calculate viewport to make the PDF fit the canvas width
      const viewport = page.getViewport({ scale: pdfScale });
      
      // Set canvas dimensions to match the viewport
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render the PDF page
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      setPdfLoading(false);
    } catch (err) {
      console.error('Error rendering PDF page:', err);
      setError('Failed to render page');
      setPdfLoading(false);
    }
  };
  
  // Change page in the PDF viewer
  const changePage = (offset) => {
    const newPage = pdfPageNum + offset;
    if (newPage >= 1 && newPage <= pdfNumPages) {
      setPdfPageNum(newPage);
      renderPage(pdfDoc, newPage);
    }
  };
  
  // Change the zoom level of the PDF
  const changeZoom = (factor) => {
    const newScale = Math.min(Math.max(pdfScale * factor, 0.5), 3.0);
    setPdfScale(newScale);
    renderPage(pdfDoc, pdfPageNum);
  };

  // Highlight code when content is loaded
  useEffect(() => {
    if (shouldUseInternalHighlighting() && fileContent) {
      Prism.highlightAll();
    }
  }, [fileContent, fileType, useCodeMirrorHighlighting]);
  
  // Render appropriate icon based on file type
  const renderFileIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="file-icon pdf" />;
      case 'word':
        return <FaFileWord className="file-icon word" />;
      case 'excel':
        return <FaFileExcel className="file-icon excel" />;
      case 'powerpoint':
        return <FaFilePowerpoint className="file-icon powerpoint" />;
      case 'text':
        return <FaFileAlt className="file-icon text" />;
      case 'code':
        return <FaFileCode className="file-icon code" />;
      case 'binary':
        // Special handling for binary file icon based on extension
        if (extension === 'xlsx' || extension === 'xls') {
          return <FaFileExcel className="file-icon excel" />;
        } else if (extension === 'docx' || extension === 'doc') {
          return <FaFileWord className="file-icon word" />;
        } else if (extension === 'pptx' || extension === 'ppt') {
          return <FaFilePowerpoint className="file-icon powerpoint" />;
        }
        return <FaFile className="file-icon" />;
      default:
        return <FaFile className="file-icon" />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };
  
  const handleLoadSuccess = () => {
    setIsLoading(false);
  };
  
  const handleLoadError = () => {
    setIsLoading(false);
    setError('Failed to load preview');
  };
  
  // Render PDF viewer content
  const renderPdfViewer = () => {
    if (usePdfFallback || !isPdfValid) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <FaFilePdf className="text-red-500 text-6xl mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">PDF Preview</h3>
          <p className="text-gray-600 mb-2 text-center max-w-md">
            {file.size === 0 
              ? "This PDF file appears to be empty."
              : "The PDF preview cannot be displayed in the embedded viewer."}
          </p>
          
          {error && (
            <p className="text-red-500 text-sm mb-4 max-w-md text-center">
              Error: {error}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <a 
              href={objectUrl} 
              download={file.name}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors w-full"
            >
              <FaDownload /> Download PDF
            </a>
            <a 
              href={objectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors w-full"
            >
              <FaExpand /> Open in New Tab
            </a>
          </div>
          
          {isPdfValid && (
            <button 
              onClick={() => setUsePdfFallback(false)} 
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FaCode /> Try Embedded Viewer
            </button>
          )}
        </div>
      );
    }
    
    return (
      <>
        <PdfJsScript onLoad={handlePdfJsLoad} />
        
        <div className="flex flex-col w-full h-full">
          {/* PDF Canvas Container with Gray Background */}
          <div className="flex-1 overflow-auto bg-gray-800 flex justify-center p-4">
            <div className="relative">
              {pdfLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="mt-2 text-gray-700">Loading page...</span>
                  </div>
                </div>
              )}
              <canvas 
                ref={canvasRef} 
                className="shadow-lg bg-white" 
              />
            </div>
          </div>
          
          {/* PDF Controls */}
          <div className="bg-gray-100 border-t border-gray-200 p-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => changePage(-1)} 
                disabled={pdfPageNum <= 1}
                className={`flex items-center justify-center w-9 h-9 rounded-md ${
                  pdfPageNum <= 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                aria-label="Previous page"
              >
                <FaChevronLeft />
              </button>
              
              <span className="text-gray-700 text-sm px-2">
                Page {pdfPageNum} of {pdfNumPages || '?'}
              </span>
              
              <button 
                onClick={() => changePage(1)} 
                disabled={pdfPageNum >= pdfNumPages}
                className={`flex items-center justify-center w-9 h-9 rounded-md ${
                  pdfPageNum >= pdfNumPages ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                aria-label="Next page"
              >
                <FaChevronRight />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changeZoom(0.8)} 
                className="flex items-center justify-center w-9 h-9 rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                aria-label="Zoom out"
              >
                <FaSearchMinus />
              </button>
              <span className="text-gray-700 text-sm w-16 text-center">
                {Math.round(pdfScale * 100)}%
              </span>
              <button 
                onClick={() => changeZoom(1.25)} 
                className="flex items-center justify-center w-9 h-9 rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                aria-label="Zoom in"
              >
                <FaSearchPlus />
              </button>
              
              <button 
                onClick={() => setUsePdfFallback(true)}
                className="ml-2 flex items-center gap-1 px-3 py-2 text-sm rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
              >
                <FaExternalLinkAlt className="text-xs" /> External Options
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render preview content based on file type
  const renderPreviewContent = () => {
    switch (fileType) {
      case 'pdf':
        return renderPdfViewer();
      
      case 'binary':
        // Handle binary documents like Excel files
        return (
          <div className="flex flex-col items-center justify-center w-full h-full p-8 bg-gray-50 border border-gray-200 rounded-lg">
            {extension === 'xlsx' || extension === 'xls' ? (
              <FaFileExcel className="text-green-600 text-6xl mb-4" />
            ) : extension === 'docx' || extension === 'doc' ? (
              <FaFileWord className="text-blue-600 text-6xl mb-4" />
            ) : extension === 'pptx' || extension === 'ppt' ? (
              <FaFilePowerpoint className="text-orange-600 text-6xl mb-4" />
            ) : (
              <FaFile className="text-gray-500 text-6xl mb-4" />
            )}
            
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {extension === 'xlsx' || extension === 'xls' 
                ? 'Excel Spreadsheet'
                : extension === 'docx' || extension === 'doc'
                ? 'Word Document'
                : extension === 'pptx' || extension === 'ppt'
                ? 'PowerPoint Presentation'
                : 'Binary File'}
            </h3>
            
            <p className="text-gray-600 mb-6 text-center max-w-md">
              This file type cannot be previewed directly in the browser.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href={objectUrl} 
                download={file.name}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                <FaDownload /> Download File
              </a>
            </div>
          </div>
        );
        
      case 'code':
        let language = codeLanguageMap[extension] || 'plain';
        
        // Check if language is available, otherwise fallback to a simpler one
        if (language !== 'plain' && !isPrismLanguageLoaded(language)) {
          // If language isn't loaded, try a safe fallback
          console.log(`Language '${language}' not available, falling back to generic syntax highlighting`);
          language = isPrismLanguageLoaded('clike') ? 'clike' : 'plain';
        }
        
        return (
          <div className="code-preview">
            {isLoading ? (
              <div className="loading-spinner">Loading content...</div>
            ) : (
              <pre className="language-preview">
                <code className={`language-${language}`}>
                  {content || fileContent}
                </code>
              </pre>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div className="image-preview">
            {isLoading && <div className="loading-spinner">Loading image...</div>}
            {objectUrl && (
              <img 
                src={objectUrl} 
                alt={file.name} 
                className="preview-image"
                onLoad={handleLoadSuccess}
                onError={handleLoadError}
                crossOrigin="anonymous"
              />
            )}
          </div>
        );
        
      default:
        return (
          <div className="generic-preview">
            <div className="preview-icon-container">
              {renderFileIcon()}
            </div>
            <div className="preview-message">
              <p>Preview not available for {fileType} files</p>
              {objectUrl && (
                <a href={objectUrl} download={file.name} className="download-button">
                  <FaDownload /> Download to view
                </a>
              )}
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        {renderFileIcon()}
        <div className="ml-3 flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
          <p className="text-xs text-gray-500">
            <span className="font-medium">{fileType.toUpperCase()}</span> • 
            <span className="ml-1">{formatFileSize(file.size)}</span>
          </p>
        </div>
      </div>
      
      <div className="relative min-h-[400px] max-h-[70vh] overflow-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && fileType !== 'pdf' ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <p className="text-red-500 mb-3">{error}</p>
            {objectUrl && (
              <a 
                href={objectUrl} 
                download={file.name}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
              >
                <FaDownload /> Download instead
              </a>
            )}
          </div>
        ) : (
          renderPreviewContent()
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
