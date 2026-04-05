<template>
     <!-- Footer-->
     <footer class="footer bg-dark position-relative pb-4 pt-md-3 py-lg-4 py-xl-5">
        <div class="d-none d-dark-mode-block position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(255,255,255, .03);"></div>
        <div class="container position-relative z-2 pt-5 pb-2" data-bs-theme="dark">
            <!-- Footer content removed -->
        </div>
     </footer>
    </template>
    <script>
    import "../assets/vendor/swiper/swiper-bundle.min.css";
    import "../assets/icons/around-icons.min.css";
    
    export default {
      name: 'AppFooter',
    
      mounted() {
        // Viewport meta tag
        this.addMetaTag('viewport', 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover');
    
        // SEO meta tags
        document.title = "Asmad – Des milliers de choix, un seul marché.";
        this.addMetaTag('description', 'Asmad – Des milliers de choix, un seul marché.');
        this.addMetaTag('keywords', 'bootstrap, business, corporate, coworking space, services, creative agency, dashboard, e-commerce, mobile app showcase, saas, multipurpose, product landing, shop, software, ui kit, web studio, landing, light and dark mode, html5, css3, javascript, gallery, slider, touch, creative');
        this.addMetaTag('author', 'Createx Studio');
    
        // Link tags
        this.addLinkTag({ rel: "manifest", href: "/manifest.json" });
        this.addLinkTag({ rel: "icon", type: "image/png", href: "assets/app-icons/icon-32x32.png", sizes: "32x32" });
        this.addLinkTag({ rel: "apple-touch-icon", href: "assets/app-icons/icon-180x180.png" });
        this.addLinkTag({ rel: "preconnect", href: "https://fonts.googleapis.com" });
        this.addLinkTag({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" });
        this.addLinkTag({ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap", id: "google-font" });
    
        // Theme switcher script (optional, will fail silently if not found)
        try {
          this.addScriptTag("assets/js/theme-switcher.js");
      
          // Add Vendor scripts: JS libraries and plugins (optional)
          this.addScriptTag('assets/vendor/sarala/dist/sarala.min.js');
          this.addScriptTag('assets/vendor/swiper/swiper-bundle.min.js');
          this.addScriptTag('assets/vendor/timezz/dist/timezz.js');
          this.addScriptTag('assets/js/theme.min.js');
        } catch (error) {
          // Silently ignore if scripts are not available
          console.debug('Optional vendor scripts not available');
        }
      },
    
      methods: {
        addMetaTag(name, content) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        },
    
        addLinkTag(attributes) {
          const link = document.createElement('link');
          Object.keys(attributes).forEach(attr => link.setAttribute(attr, attributes[attr]));
          document.head.appendChild(link);
        },
    
        addScriptTag(src) {
          try {
            const script = document.createElement('script');
            script.src = src;
            script.onerror = () => {
              // Silently ignore missing script files to avoid console errors
              console.debug(`Script not found: ${src}`);
            };
            document.body.appendChild(script);
          } catch (error) {
            // Silently ignore script loading errors
            console.debug(`Error loading script ${src}:`, error);
          }
        }
      }
    };
    </script>