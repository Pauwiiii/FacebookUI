import React from 'react';

export default function PostItem({ post, onEdit, onDelete }) {
  const { id, author, content, imageUrl, createdDate, modifiedDate } = post;

  const created = createdDate ? new Date(createdDate).toLocaleString() : '';
  const modified = modifiedDate ? new Date(modifiedDate).toLocaleString() : '';

  return (
    <article className="post-item">
      <div className="post-header">
        <strong className="post-author">{author}</strong>
        <div className="post-meta">
          <span className="created">{created}</span>
          {modified && <span className="modified"> • modified {modified}</span>}
        </div>
      </div>

      <div className="post-content">
        <p>{content}</p>
        {imageUrl && (
          <div className="post-image">
            <img src={imageUrl} alt="post visual" onError={(e)=>{ e.target.style.display='none'; }} />
          </div>
        )}
      </div>

      <div className="post-actions">
        <button onClick={onEdit} className="btn">Edit</button>
        <button onClick={() => { if (confirm('Delete post?')) onDelete(); }} className="btn btn-danger">Delete</button>
      </div>
    </article>
  );
}