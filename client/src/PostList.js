import React, { useState, useEffect } from 'react'
import axios from 'axios';

import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default () => {
  const [posts, setposts] = useState({});

  const fetchPosts = async () => {
    const localPostsUrl = 'http://localhost:4002/posts';
    const depPostsUrl = 'http://posts.com/posts';
    const { data } = await axios.get(depPostsUrl);
    setposts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map(post => {
    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px' }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
}
