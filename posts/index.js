const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => { // not used, only for testing!
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  };

  const localUrl = 'http://localhost:4005/events';
  const depUrl = 'http://event-bus-srv:4005/events';

  await axios.post(depUrl, {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  return res.send({});
});

app.listen(4000, () => {
  console.log('v2');
  console.log('[Posts] Listening to 4000');
});