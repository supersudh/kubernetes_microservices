import React, { useState } from 'react'
import axios from 'axios';

export default () => {
  const [title, setTitle] = useState('');

  const onSubmit = async evt => {
    evt.preventDefault();

    const localPostsUrl = 'http://localhost:4000/posts';
    const depPostsUrl = 'http://posts.com/posts/create';

    await axios.post(depPostsUrl, {
      title
    });

    setTitle('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
