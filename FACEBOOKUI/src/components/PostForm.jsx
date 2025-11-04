import React, { useState } from 'react';

// initial: optional post object for editing
// onSubmit: async function(payload) -> saved post or throws
// onCancel: function
export default function PostForm({ initial = null, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [author, setAuthor] = useState(initial ? initial.author : '');
  const [content, setContent] = useState(initial ? initial.content : '');
  const [imageUrl, setImageUrl] = useState(initial ? (initial.imageUrl || '') : '');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function validateClient() {
    const errs = [];
    if (!author || !author.trim()) errs.push('author is required');
    if (author && author.length > 150) errs.push('author must not exceed 150 characters');
    if (!content || !content.trim()) errs.push('content is required');
    if (imageUrl && imageUrl.length > 1000) errs.push('imageUrl must not exceed 1000 characters');
    return errs;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const clientErrs = validateClient();
    if (clientErrs.length) {
      setErrors(clientErrs);
      return;
    }

    const payload = {
      author: author.trim(),
      content: content.trim(),
      imageUrl: imageUrl !== '' ? imageUrl.trim() : null
    };

    setSubmitting(true);
    try {
      const saved = await onSubmit(payload);
      // if onSubmit returns saved object, clear form for create; for edit we let parent close form
      if (!initial && saved) {
        setAuthor('');
        setContent('');
        setImageUrl('');
      }
    } catch (err) {
      // show backend validation messages or thrown message
      const msg = err && err.message ? err.message : 'Save failed';
      setErrors([msg]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      <div className="form-row">
        <label>Author</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={150} />
      </div>

      <div className="form-row">
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
      </div>

      <div className="form-row">
        <label>Image URL (optional)</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}