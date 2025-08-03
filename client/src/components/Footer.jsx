export default () => {
  const footerSections = {
    company: [
      { href: "/", name: "Home" },
      { href: "#about", name: "About Us" },
      { href: "#team", name: "Our Team" },
      { href: "#careers", name: "Careers" },
    ],
    features: [
      { href: "/product", name: "Coffee Shop" },
      { href: "/chat", name: "Chat" },
      { href: "/ml-matches", name: "AI Matches" },
      { href: "/chatvideo", name: "Video Chat" },
    ],
    support: [
      { href: "#help", name: "Help Center" },
      { href: "#contact", name: "Contact Us" },
      { href: "#privacy", name: "Privacy Policy" },
      { href: "#terms", name: "Terms of Service" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      href: "#facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.585-3.23-1.66C4.585 14.951 4 13.8 4 12.503s.585-2.448 1.219-3.326c.782-1.075 1.933-1.66 3.23-1.66s2.448.585 3.23 1.66c.634.878 1.219 2.029 1.219 3.326s-.585 2.448-1.219 3.326c-.782 1.074-1.933 1.659-3.23 1.659z"/>
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#linkedin",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-[#ECE4CF] border-t-2 border-[#8B4513] border-opacity-20" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8B4513] to-[#DEB887] rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">☕</span>
                </div>
                <h3 className="text-2xl font-bold text-[#8B4513]">Coffee Dates</h3>
              </div>
              <p className="text-[#654321] text-base leading-relaxed mb-6 max-w-md">
                Discover your perfect coffee companion through our unique AI-powered matchmaking experience. 
                Sip, connect, and create memorable moments together over the perfect cup of coffee.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 bg-white border-2 border-[#8B4513] border-opacity-20 rounded-full flex items-center justify-center text-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-all duration-300 hover:scale-110"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold text-[#8B4513] mb-6">Company</h4>
              <ul className="space-y-4">
                {footerSections.company.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-[#654321] hover:text-[#8B4513] transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[#8B4513] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features Links */}
            <div>
              <h4 className="text-lg font-semibold text-[#8B4513] mb-6">Features</h4>
              <ul className="space-y-4">
                {footerSections.features.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-[#654321] hover:text-[#8B4513] transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[#8B4513] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold text-[#8B4513] mb-6">Support</h4>
              <ul className="space-y-4">
                {footerSections.support.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-[#654321] hover:text-[#8B4513] transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-[#8B4513] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-[#8B4513] border-opacity-20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[#654321] text-sm">
              &copy; 2024 Coffee Dates. All rights reserved. Made with ❤️ and ☕
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-[#654321] hover:text-[#8B4513] transition-colors">
                Privacy Policy
              </a>
              <span className="text-[#8B4513] opacity-50">•</span>
              <a href="#terms" className="text-[#654321] hover:text-[#8B4513] transition-colors">
                Terms of Service
              </a>
              <span className="text-[#8B4513] opacity-50">•</span>
              <a href="#cookies" className="text-[#654321] hover:text-[#8B4513] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
