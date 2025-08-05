"use client";

import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
];

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    let script: HTMLScriptElement | null = null;
    let style: HTMLStyleElement | null = null;

    const initializeTranslate = () => {
      try {
        // Function to remove Google translate elements
        const removeGoogleElements = () => {
          const googleElements = [
            ".goog-te-banner-frame",
            ".goog-logo-link",
            ".goog-te-balloon-frame",
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
        let script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        // Initialize Google Translate
        window.googleTranslateElementInit = () => {
          if (window.google && window.google.translate) {
            const container = document.getElementById(
              "google-translate-element"
            );

            if (container) {
              // Avoid re-initialization
              if (!container.querySelector(".goog-te-combo")) {
                container.innerHTML = ""; // Clear any previous widget
                new window.google.translate.TranslateElement(
                  {
                    pageLanguage: "en",
                    includedLanguages: "en,hi,ta,te,ml,bn,kn,mr,gu,fr,it,ru",
                    layout:
                      window.google.translate.TranslateElement.InlineLayout
                        .SIMPLE,
                    autoDisplay: false,
                  },
                  "google-translate-element"
                );

                // Remove Google elements after initialization
                setTimeout(removeGoogleElements, 100);
              }
            }
          }
        };

        // Load Google Translate script
        script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onerror = () => {
          console.warn("Failed to load Google Translate script");
          setHasError(true);
        };

        // MutationObserver to continuously remove Google elements
        const observer = new MutationObserver(removeGoogleElements);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        document.body.appendChild(script);

        // Custom CSS to hide Google branding and improve styling
        style = document.createElement("style");
        style.innerHTML = `
          .goog-te-banner-frame, 
          .goog-logo-link, 
          .goog-te-balloon-frame {
            display: none !important;
            visibility: hidden !important;
          }
          .goog-te-gadget {
            color: transparent !important;
            font-size: 0 !important;
          }
          .goog-te-gadget-simple {
            border: none !important;
            background: none !important;
            padding: 0 !important;
          }
          .goog-te-menu-value {
            color: hsl(var(--foreground)) !important;
            font-family: inherit !important;
            font-size: 14px !important;
          }
          .goog-te-gadget-simple .goog-te-menu-value {
            color: hsl(var(--foreground)) !important;
          }
          #google-translate-element {
            display: none;
          }
          body {
            top: 0 !important;
          }
          .goog-te-banner-frame.skiptranslate {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      } catch (error) {
        console.warn("Google Translate setup failed:", error);
        setHasError(true);
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(initializeTranslate, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      try {
        if (script && document.body.contains(script)) {
          document.body.removeChild(script);
        }
        if (style && document.head.contains(style)) {
          document.head.removeChild(style);
        }
        if ((window as any).googleTranslateElementInit) {
          delete (window as any).googleTranslateElementInit;
        }
      } catch (error) {
        // Silently ignore cleanup errors
      }
    };
  }, []);

  const handleLanguageChange = (langCode: string) => {
    console.log("Script loaded?", !!window.google?.translate);

    setCurrentLang(langCode);

    // Trigger Google Translate
    const selectElement = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = langCode;
      selectElement.dispatchEvent(new Event("change"));
    }
  };

  // Don't render anything if there's an error
  if (hasError) {
    return null;
  }

  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0];

  return (
    <div className="flex items-center">
      <div id="google-translate-element" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover-lift flex items-center gap-2 px-2 md:px-3"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">
              {currentLanguage.flag}
            </span>
            <span className="hidden md:inline text-sm">
              {currentLanguage.name}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center gap-3 ${
                currentLang === language.code ? "bg-primary/10" : ""
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm">{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GoogleTranslate;
