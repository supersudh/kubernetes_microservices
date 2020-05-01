import React, { useState } from 'react';
import axios from 'axios';

export default ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async evt => {
    evt.preventDefault();

    const localPostsUrl = `http://localhost:4001/posts/${postId}/comments`;
    const depPostsUrl = `http://posts.com/posts/${postId}/comments`;

    await axios.post(depPostsUrl, {
      content
    });

    setContent('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={e => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
