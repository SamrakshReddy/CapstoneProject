function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold tracking-tight">BlogApp</p>
            <p className="mt-4 text-sm leading-7 text-slate-400 max-w-md">
              A modern place to share stories, discover authors, and engage with a community of thoughtful readers.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li>
                <a href="/" className="hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/write-article" className="hover:text-white transition-colors duration-200">
                  Write an article
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-white transition-colors duration-200">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition-colors duration-200">
                  Register
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Contact</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>support@blogapp.com</p>
              <p>123 Content Lane</p>
              <p>Readerville, IN 46077</p> 
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BlogApp. All rights reserved.</p>
          <p>Designed for modern storytelling.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;