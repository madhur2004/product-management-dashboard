export default function Footer() {
  // Get current year for copyright notice — updates automatically
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand section */}
          <div>
            <h3 className="text-2xl font-bold mb-2">📦 Product Hub</h3>
            <p className="text-gray-400">Your one-stop shop for everything</p>
          </div>

          {/* Quick links — placeholder pages, real routes can be added later */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>

          {/* Social links — static, no external URLs for this project */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            © {currentYear} Product Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}