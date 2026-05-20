import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNavbar from './AdminNavbar';

function ManageAuthors() {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [limit] = useState(8);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, [currentPage, searchTerm]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/admin-api/authors', {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
        },
        withCredentials: true,
      });
      setAuthors(res.data.payload.authors);
      setTotalPages(res.data.payload.totalPages);
      setTotalAuthors(res.data.payload.totalAuthors);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch authors');
      if (err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (authorId) => {
    if (window.confirm('Are you sure you want to block this author?')) {
      try {
        await axios.patch(
          `http://localhost:4000/admin-api/block-user/${authorId}`,
          {},
          { withCredentials: true }
        );
        toast.success('Author blocked successfully');
        fetchAuthors();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to block author');
      }
    }
  };

  const handleUnblock = async (authorId) => {
    if (window.confirm('Are you sure you want to unblock this author?')) {
      try {
        await axios.patch(
          `http://localhost:4000/admin-api/unblock-user/${authorId}`,
          {},
          { withCredentials: true }
        );
        toast.success('Author unblocked successfully');
        fetchAuthors();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to unblock author');
      }
    }
  };

  const handleDelete = async (authorId) => {
    if (window.confirm('This will delete the author and all their articles. This action is permanent. Continue?')) {
      try {
        setDeletingId(authorId);
        await axios.delete(
          `http://localhost:4000/admin-api/delete-user/${authorId}`,
          { withCredentials: true }
        );
        toast.success('Author deleted successfully');
        fetchAuthors();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete author');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const StatusBadge = ({ isActive }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? 'Active' : 'Blocked'}
    </span>
  );

  const ArticleCountBadge = ({ count }) => (
    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
      {count} {count === 1 ? 'article' : 'articles'}
    </span>
  );

  if (loading && authors.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading authors...</p>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Manage Authors</h1>
          <p className="text-slate-600">Total: {totalAuthors} authors</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.length > 0 ? (
            authors.map((author) => (
              <div key={author._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* Author Avatar and Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {author.profileImageUrl ? (
                      <img
                        src={author.profileImageUrl}
                        alt={author.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center font-bold text-lg">
                        {author.firstName[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        {author.firstName} {author.lastName}
                      </h3>
                      <p className="text-sm text-slate-600">{author.email}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status:</span>
                    <StatusBadge isActive={author.isActive} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Articles:</span>
                    <ArticleCountBadge count={author.articleCount} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Joined:</span>
                    <span className="text-sm text-slate-900 font-medium">
                      {new Date(author.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-col">
                  {author.isActive ? (
                    <button
                      onClick={() => handleBlock(author._id)}
                      className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      Block Author
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(author._id)}
                      className="w-full px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      Unblock Author
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(author._id)}
                    disabled={deletingId === author._id}
                    className="w-full px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deletingId === author._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-md p-8 text-center">
              <p className="text-slate-500">No authors found</p>
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

export default ManageAuthors;
