import { useEffect } from "react";
import { Globe, Languages } from "lucide-react";

// Extend the Window interface to include googleTranslateElementInit and google.translate
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: any;
        InlineLayout: {
          SIMPLE: any;
        };
      };
    };
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    // Function to remove Google translate elements
    const removeGoogleElements = () => {
      const googleElements = [
        ".goog-te-banner-frame",
        ".goog-logo-link",
        ".goog-te-balloon-frame",
        ".goog-te-gadget-icon", // Remove Google icon
      ];
      googleElements.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      });
    };

    // Load Google Translate script
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        const container = document.getElementById("google-translate-element");
        if (container) {
          // Avoid re-initialization
          if (!container.querySelector(".goog-te-combo")) {
            container.innerHTML = ""; // Clear any previous widget
            new window.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages: "en,hi,ta,te,ml,bn,kn,mr,gu,fr,it,ru,es,de,ja,ko,zh",
                layout:
                  window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
                multilanguagePage: true,
              },
              "google-translate-element"
            );
            
            // Remove Google elements after initialization
            setTimeout(() => {
              removeGoogleElements();
              // Add custom styling after widget loads
              addCustomStyling();
            }, 500);
          }
        }
      }
    };

    // Function to add custom styling
    const addCustomStyling = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.className = 'custom-translate-select';
      }
    };

    // Custom CSS to style the translate widget
    const style = document.createElement("style");
    style.textContent = `
      /* Container styling */
      .translate-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 8px 12px;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        transition: all 0.2s ease;
      }

      .translate-container:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .translate-container {
          background: #1f2937;
          border-color: #374151;
          color: #f9fafb;
        }
        
        .translate-container:hover {
          border-color: #60a5fa;
        }
        
        .goog-te-menu-frame {
          background: #1f2937 !important;
          border-color: #374151 !important;
        }
        
        .goog-te-menu2-item div {
          background: #1f2937 !important;
          color: #f9fafb !important;
        }
      }

      /* Hide Google's default styling */
      .goog-te-gadget {
        font-family: inherit !important;
        font-size: inherit !important;
        color: inherit !important;
      }

      .goog-te-gadget-simple {
        background: transparent !important;
        border: none !important;
        font-size: inherit !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }

      /* Style the select dropdown */
      .goog-te-combo,
      .custom-translate-select {
        background: transparent !important;
        border: none !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: inherit !important;
        outline: none !important;
        cursor: pointer !important;
        padding: 6px 32px 6px 12px !important;
        border-radius: 6px !important;
        min-width: 130px !important;
        transition: all 0.2s ease !important;
        background-color: rgba(59, 130, 246, 0.05) !important;
        border: 1px solid rgba(59, 130, 246, 0.2) !important;
      }

      .goog-te-combo:hover {
        background-color: rgba(59, 130, 246, 0.1) !important;
        border-color: rgba(59, 130, 246, 0.4) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15) !important;
      }

      .goog-te-combo:focus {
        background-color: rgba(59, 130, 246, 0.1) !important;
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
      }

      /* Custom dropdown arrow with animation */
      .goog-te-combo {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 10px center;
        background-repeat: no-repeat;
        background-size: 14px;
      }

      /* Dropdown menu styling */
      .goog-te-menu-frame {
        border-radius: 12px !important;
        border: 1px solid #e5e7eb !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        background: white !important;
        overflow: hidden !important;
        margin-top: 4px !important;
        animation: dropdownSlide 0.2s ease-out !important;
      }

      @keyframes dropdownSlide {
        from {
          opacity: 0;
          transform: translateY(-8px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Style dropdown items */
      .goog-te-menu2-item {
        transition: all 0.15s ease !important;
        border-radius: 0 !important;
      }

      .goog-te-menu2-item div {
        padding: 10px 16px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #374151 !important;
        background: white !important;
        border: none !important;
        transition: all 0.15s ease !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }

      .goog-te-menu2-item div:hover {
        background: #f3f4f6 !important;
        color: #1f2937 !important;
        transform: translateX(2px) !important;
      }

      .goog-te-menu2-item-selected div {
        background: #3b82f6 !important;
        color: white !important;
        font-weight: 600 !important;
      }

      .goog-te-menu2-item-selected div:hover {
        background: #2563eb !important;
        transform: none !important;
      }

      /* Add language flags/icons */
      .goog-te-menu2-item div:before {
        content: "🌐";
        font-size: 16px;
        margin-right: 4px;
      }

      /* Specific language flags */
      .goog-te-menu2-item[value="hi"] div:before { content: "🇮🇳"; }
      .goog-te-menu2-item[value="ta"] div:before { content: "🇮🇳"; }
      .goog-te-menu2-item[value="te"] div:before { content: "🇮🇳"; }
      .goog-te-menu2-item[value="ml"] div:before { content: "🇮🇳"; }
      .goog-te-menu2-item[value="bn"] div:before { content: "🇧🇩"; }
      .goog-te-menu2-item[value="kn"] div:before { content: "🇮🇳"; }
      .goog-te-menu2-item[value="mr"] div:before { content: "🇮🇳"; }
      .goog-te-menu2-item[value="gu"] div:before { content: "🇮🇳"; }
      .goog-te-menu2-item[value="fr"] div:before { content: "🇫🇷"; }
      .goog-te-menu2-item[value="it"] div:before { content: "🇮🇹"; }
      .goog-te-menu2-item[value="ru"] div:before { content: "🇷🇺"; }
      .goog-te-menu2-item[value="es"] div:before { content: "🇪🇸"; }
      .goog-te-menu2-item[value="de"] div:before { content: "🇩🇪"; }
      .goog-te-menu2-item[value="ja"] div:before { content: "🇯🇵"; }
      .goog-te-menu2-item[value="ko"] div:before { content: "🇰🇷"; }
      .goog-te-menu2-item[value="zh"] div:before { content: "🇨🇳"; }
      .goog-te-menu2-item[value="en"] div:before { content: "🇺🇸"; }

      /* Hide Google branding */
      .goog-logo-link,
      .goog-te-gadget img,
      .goog-te-gadget-icon,
      .goog-te-banner-frame {
        display: none !important;
      }

      /* Remove "Powered by" text */
      .goog-te-gadget-simple .goog-te-menu-value span:first-child {
        display: none !important;
      }

      /* Premium styling variant */
      .translate-container.premium {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        color: white !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .translate-container.premium:before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }

      .translate-container.premium:hover:before {
        left: 100%;
      }

      .translate-container.premium .goog-te-combo {
        color: white !important;
        background-color: rgba(255, 255, 255, 0.1) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      }

      .translate-container.premium .goog-te-combo:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
      }

      .translate-container.premium:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.3) !important;
      }

      /* Glass morphism variant */
      .translate-container.glass {
        background: rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important;
      }

      .translate-container.glass .goog-te-combo {
        background-color: rgba(255, 255, 255, 0.1) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        backdrop-filter: blur(5px) !important;
      }

      /* Neon variant */
      .translate-container.neon {
        background: #0a0a0a !important;
        border: 2px solid #00ffff !important;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3) !important;
        color: #00ffff !important;
      }

      .translate-container.neon .goog-te-combo {
        color: #00ffff !important;
        background-color: rgba(0, 255, 255, 0.1) !important;
        border-color: #00ffff !important;
        box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.1) !important;
      }

      .translate-container.neon:hover {
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 15px rgba(0, 255, 255, 0.1) !important;
      }

      /* Minimal styling variant */
      .translate-container.minimal {
        background: transparent !important;
        border: 1px solid #d1d5db !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
      }

      /* Compact variant */
      .translate-container.compact {
        padding: 4px 6px !important;
        font-size: 12px !important;
      }

      .translate-container.compact .goog-te-combo {
        font-size: 12px !important;
        min-width: 100px !important;
        padding: 4px 24px 4px 8px !important;
      }

      /* Floating action button style */
      .translate-container.fab {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        border-radius: 50% !important;
        width: 56px !important;
        height: 56px !important;
        padding: 0 !important;
        justify-content: center !important;
        background: #3b82f6 !important;
        color: white !important;
        border: none !important;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
        z-index: 1000 !important;
      }

      .translate-container.fab:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
      }

      .translate-container.fab .goog-te-combo {
        position: absolute !important;
        opacity: 0 !important;
        width: 100% !important;
        height: 100% !important;
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);

    // MutationObserver to continuously remove Google elements
    const observer = new MutationObserver(() => {
      removeGoogleElements();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      if ((window as any).googleTranslateElementInit) {
        delete (window as any).googleTranslateElementInit;
      }
    };
  }, []);

  return (
    <div className="translate-container">
      <Languages className="h-4 w-4 text-gray-600" />
      <div id="google-translate-element" className="translate-selector" />
    </div>
  );
};

// Alternative variants you can use
export const GoogleTranslatePremium = () => {
  // ... same useEffect code ...
  
  return (
    <div className="translate-container premium">
      <Globe className="h-4 w-4 text-white" />
      <div id="google-translate-element" className="translate-selector" />
      <span className="text-sm font-medium">Translate</span>
    </div>
  );
};

export const GoogleTranslateMinimal = () => {
  // ... same useEffect code ...
  
  return (
    <div className="translate-container minimal">
      <div id="google-translate-element" className="translate-selector" />
    </div>
  );
};

export const GoogleTranslateCompact = () => {
  // ... same useEffect code ...
  
  return (
    <div className="translate-container compact">
      <Globe className="h-3 w-3 text-gray-500" />
      <div id="google-translate-element" className="translate-selector" />
    </div>
  );
};

export default GoogleTranslate;
