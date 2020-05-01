const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

const localPostsUrl = 'http://localhost:4000/events';
const depPostsUrl = 'http://posts-clusterip-srv:4000/events';
const localCommentsUrl = 'http://localhost:4001/events';
const depCommentsUrl = 'http://comments-srv:4001/events';
const localQueryUrl = 'http://localhost:4002/events';
const depQueryUrl = 'http://query-srv:4002/events';
const localModerationUrl = 'http://localhost:4003/events';
const depModerationUrl = 'http://moderation-srv:4003/events';

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);


  axios.post(depPostsUrl, event);
  axios.post(depCommentsUrl, event);
  axios.post(depQueryUrl, event);
  axios.post(depModerationUrl, event);

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  return res.send(events);
});

app.listen(4005, () => {
  console.log('Event Bus Listening on 4005');
});