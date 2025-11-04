import React from 'react';
import PostItem from './PostItem';

export default function PostList({ posts = [], onEdit, onDelete }) {
  if (!posts.length) {
    return <div>No posts yet.</div>;
  }

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostItem
          key={post.id}
          post={post}
          onEdit={() => onEdit(post)}
          onDelete={() => onDelete(post.id)}
        />
      ))}
    </div>
  );
}