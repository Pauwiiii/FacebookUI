import React, { useEffect, useState } from 'react';
import { listPosts, createPost, updatePost, deletePost } from './api';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // post being edited

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPosts();
      // sort by createdDate descending if present
      data.sort((a, b) => {
        const da = a.createdDate ? new Date(a.createdDate).valueOf() : 0;
        const db = b.createdDate ? new Date(b.createdDate).valueOf() : 0;
        return db - da;
      });
      setPosts(data);
    } catch (e) {
      setError('Failed to load posts');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async (payload) => {
    const saved = await createPost(payload);
    if (saved) {
      setPosts(prev => [saved, ...prev]);
    }
    return saved;
  };

  const handleUpdate = async (id, payload) => {
    const updated = await updatePost(id, payload);
    if (updated) {
      setPosts(prev => prev.map(p => (p.id === id ? updated : p)));
    }
    setEditing(null);
    return updated;
  };

  const handleDelete = async (id) => {
    const ok = await deletePost(id);
    if (ok) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
    return ok;
  };

  return (
    <div className="container">
      <header>
        <h1>Facebook Posts</h1>
      </header>

      <section className="create-section">
        <h2>Create Post</h2>
        <PostForm
          onSubmit={handleCreate}
          onCancel={() => {}}
          submitLabel="Create"
        />
      </section>

      <section className="list-section">
        <h2>All Posts</h2>
        {loading && <div>Loading posts…</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <PostList
            posts={posts}
            onEdit={(post) => setEditing(post)}
            onDelete={handleDelete}
          />
        )}
      </section>

      {editing && (
        <section className="edit-section">
          <h2>Edit Post</h2>
          <PostForm
            initial={editing}
            onSubmit={(payload) => handleUpdate(editing.id, payload)}
            onCancel={() => setEditing(null)}
            submitLabel="Save"
          />
        </section>
      )}

      <footer>
        <small>Connects to backend at /api/posts (proxy to localhost:8080 during dev)</small>
      </footer>
    </div>
  );
}