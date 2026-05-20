import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

function Home() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:4000/common-api/articles", {
          withCredentials: true,
        });
        setFeaturedArticles(res.data.payload?.slice(0, 3) || []);
      } catch (err) {
        console.log("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          {/* <div className="mb-6 inline-block px-4 py-2 rounded-full border border-cyan-400/50 bg-cyan-500/10 text-cyan-300 text-sm font-medium">
            🚀 Modern MERN Blog Platform
          </div> */}

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              BLOG APP
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover powerful blogs, explore trending technologies, share your knowledge, and connect with developers around the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/articles"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
            >
              Explore Articles
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-cyan-400 hover:bg-cyan-500/10 rounded-lg font-semibold transition-all duration-300 hover:border-cyan-300"
            >
              Get Started
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-16">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">100+</div>
              <p className="text-slate-400">Published Articles</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">50+</div>
              <p className="text-slate-400">Active Authors</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">MERN</div>
              <p className="text-slate-400">Full Stack Powered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">A complete blogging solution designed for developers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "✍️", title: "Easy Publishing", desc: "Create and publish articles effortlessly with our intuitive editor" },
              { icon: "🔍", title: "Discover Content", desc: "Find articles on your favorite topics and technologies" },
              { icon: "👥", title: "Community", desc: "Connect with developers and share knowledge globally" },
              { icon: "📊", title: "Track Performance", desc: "Monitor your article engagement and readership" },
              { icon: "💬", title: "Comments", desc: "Engage with readers through comments on articles" },
              { icon: "🔐", title: "Secure", desc: "Your data is safe with enterprise-grade security" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {!loading && featuredArticles.length > 0 && (
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Latest Articles</h2>
                <p className="text-slate-600 mt-2">Discover the newest content from our community</p>
              </div>
              <Link to="/articles" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link
                  key={article._id}
                  to={`/article/${article._id}`}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-cyan-400 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{article.content.slice(0, 100)}...</p>
                  <div className="flex items-center gap-2">
                    {article.author?.profileImageUrl && (
                      <img
                        src={article.author.profileImageUrl}
                        alt={article.author.firstName}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-xs text-slate-600">
                      {article.author?.firstName} {article.author?.lastName}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Share Your Knowledge?</h2>
          <p className="text-lg text-cyan-100 mb-8">Join our community of developers and start publishing today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-cyan-600 font-semibold rounded-lg hover:bg-slate-100 transition-all"
            >
              Start Writing
            </Link>
            <Link
              to="/articles"
              className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-all"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;