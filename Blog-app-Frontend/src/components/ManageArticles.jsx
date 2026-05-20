import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from './AdminNavbar';

function ManageArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [limit] = useState(8);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/admin-api/articles', {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
          status: statusFilter,
        },
        withCredentials: true,
      });
      setArticles(res.data.payload.articles);
      setTotalPages(res.data.payload.totalPages);
      setTotalArticles(res.data.payload.totalArticles);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch articles');
      if (err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        setDeletingId(articleId);
        await axios.delete(
          `http://localhost:4000/admin-api/delete-article/${articleId}`,
          { withCredentials: true }
        );
        toast.success('Article deleted successfully');
        fetchArticles();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete article');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeactivate = async (articleId) => {
    if (window.confirm('Are you sure you want to deactivate this article?')) {
      try {
        await axios.patch(
          `http://localhost:4000/admin-api/deactivate-article/${articleId}`,
          {},
          { withCredentials: true }
        );
        toast.success('Article deactivated successfully');
        fetchArticles();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to deactivate article');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const StatusBadge = ({ isActive }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Manage Articles</h1>
          <p className="text-slate-600">Total: {totalArticles} articles</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Articles</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Article Info */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {truncateText(article.title, 50)}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      {truncateText(article.content, 100)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                      <StatusBadge isActive={article.isArticleActive} />
                    </div>
                  </div>

                  {/* Author Info */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Author</p>
                    <div className="flex items-center gap-2">
                      {article.author?.profileImageUrl ? (
                        <img
                          src={article.author.profileImageUrl}
                          alt={article.author.firstName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold">
                          {article.author?.firstName?.[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {article.author?.firstName} {article.author?.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{article.author?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-col">
                    {article.isArticleActive ? (
                      <button
                        onClick={() => handleDeactivate(article._id)}
                        className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium transition-colors w-full"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <div className="text-xs text-slate-500 text-center py-2">Inactive</div>
                    )}
                    <button
                      onClick={() => handleDelete(article._id)}
                      disabled={deletingId === article._id}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 w-full"
                    >
                      {deletingId === article._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <p className="text-slate-500">No articles found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-slate-600 text-sm">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageArticles;
