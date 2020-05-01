const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const localEventsUrl = 'http://localhost:4005/events';
const depEventsUrl = 'http://event-bus-srv:4005/events'

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    await axios.post(depEventsUrl, {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }
  return res.send({});
});

app.listen(4003, () => {
  console.log('Moderation Listening on 4003');
});