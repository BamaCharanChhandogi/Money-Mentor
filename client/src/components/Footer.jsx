const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">MyFinanceApp</h2>
            <p className="text-gray-400">
              Your reliable partner in managing your finances efficiently.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG for social icon */}
                  <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.42 3.64 8.08 8.29 9.88v-6.99h-2.47v-2.89h2.47v-2.25c0-2.42 1.47-3.74 3.61-3.74 1.03 0 1.92.08 2.17.11v2.52h-1.49c-1.16 0-1.38.55-1.38 1.35v1.77h2.76l-.36 2.89h-2.4V22c4.64-1.8 8.03-5.45 8.03-9.96 0-5.52-4.48-10-10-10z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG for social icon */}
                  <path d="M22.54 6.42a8.12 8.12 0 01-2.36.64 4.1 4.1 0 001.8-2.26 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.73 11.6 11.6 0 01-8.42-4.27 4.1 4.1 0 001.26 5.48A4.1 4.1 0 013 9.75v.05a4.1 4.1 0 003.3 4 4.09 4.09 0 01-1.85.07 4.1 4.1 0 003.83 2.85A8.24 8.24 0 012 19.54a11.6 11.6 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.02-.54A8.32 8.32 0 0024 5.63a8.09 8.09 0 01-2.46.67z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG for social icon */}
                  <path d="M22.54 6.42a8.12 8.12 0 01-2.36.64 4.1 4.1 0 001.8-2.26 8.2 8.2 0 01-2.6 1 4.1 4.1 0 00-7 3.73 11.6 11.6 0 01-8.42-4.27 4.1 4.1 0 001.26 5.48A4.1 4.1 0 013 9.75v.05a4.1 4.1 0 003.3 4 4.09 4.09 0 01-1.85.07 4.1 4.1 0 003.83 2.85A8.24 8.24 0 012 19.54a11.6 11.6 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.02-.54A8.32 8.32 0 0024 5.63a8.09 8.09 0 01-2.46.67z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-gray-500 mt-8">
          <p>© 2024 MyFinanceApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
