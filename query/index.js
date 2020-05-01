const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const localEventsUrl = 'http://localhost:4005/events';
const depEventsUrl = 'http://event-bus-srv:4005/events'

const handleEvent = (type, data) => {
  switch (type) {
    case 'PostCreated': {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case 'CommentCreated': {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      post.comments.push({ id, content, status });
      break;
    }
    case 'CommentUpdated': {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      const comment = post.comments.find(thisComment => thisComment.id === id);
      comment.status = status;
      comment.content = content;
    }
    default:
      break;
  }
}

app.get('/posts', (req, res) => {
  return res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  return res.send({});
});

app.listen(4002, async () => {
  console.log('Query Listening to 4002');

  const { data: events } = await axios.get(depEventsUrl);

  for (let event of events) {
    console.log('Procesing event:', event.type);

    handleEvent(event.type, event.data);
  }
});