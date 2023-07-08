const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const openai = require('openai');
require('dotenv').config();
require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

app.use(require('./config/checkToken'));

// OpenAI Configuration
openai.apiKey = process.env.OPENAI_API_KEY;

let chatHistory = [];

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  chatHistory.push({ role: 'user', content: message });

  const messages = chatHistory.map(({ role, content }) => ({ role, content }));

  try {
    const completion = await openai.Completion.create({
      engine: 'text-davinci-003',
      prompt: message,
      max_tokens: 60,
    });

    const completionText = completion.data.choices[0].text;

    chatHistory.push({ role: 'assistant', content: completionText });

    res.json({ messages: chatHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const port = process.env.PORT || 3001;

// Put API routes here, before the "catch all" route
app.use('/api/users', require('./routes/api/users'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, function () {
  console.log(`Express app running on port ${port}`);
});
