import { useEffect } from "react";

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

const GoogleTranslate2 = () => {
  useEffect(() => {
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
                includedLanguages: "en,hi,ta,te,ml,bn,kn,mr,gu,fr,it,ru",
                layout:
                  window.google.translate.TranslateElement.InlineLayout.SIMPLE,
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

    // Custom CSS to style with flags and match the image
    const style = document.createElement("style");
    document.head.appendChild(style);

    // MutationObserver to continuously remove Google elements
    const observer = new MutationObserver(removeGoogleElements);
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
      <div id="google-translate-element" className="translate-selector" />
    </div>
  );
};

export default GoogleTranslate2;
