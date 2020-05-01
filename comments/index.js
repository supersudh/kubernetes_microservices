const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

const localEventsUrl = 'http://localhost:4005/events';
const depEventsUrl = 'http://event-bus-srv:4005/events'

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  await axios.post(depEventsUrl, {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    }
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received Event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, content, id, status } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find(thisComment => thisComment.id === id);
    comment.status = status;
    await axios.post(depEventsUrl, {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        postId,
        status
      }
    });
  }

  return res.send({});
});

app.listen(4001, () => {
  console.log('Comments Listening to 4001');
});