const fs = require('fs');

const ENV = {
  PORT: process.env.PORT || 9000,
  PORT_SSL: process.env.PORT_SSL || 9001,
  EMAIL: process.env.EMAIL || '',
  PASSWORD: process.env.PASSWORD || '',
  HOST: process.env.host || ''
};

Main();

async function Main() {
  try {
    const result = await createServer();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

// ======================================================================

function createServer() {

  const http2 = require('spdy');

  const options = {
    // key: fs.readFileSync(`${__dirname}/certificate/server.key`),
    // cert: fs.readFileSync(`${__dirname}/certificate/server.crt`),
    spdy: {
      plain: true,
      ssl: false
    }
  };

  return new Promise(async (resolve) => {
    http2
      .createServer(options, await webService())
      .listen(ENV.PORT, (err) => {
        if (err) {
          throw new Error(err);
        }
        resolve('Listening on port: ' + ENV.PORT + '.');
      });
  });
};

async function webService() {
  const express = require('express');
  const compression = require('compression');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const path = require('path');
  const app = new express();

  app.use(compression({
    level: 7
  }));

  app.use(cors());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    next();
  });

  app.use('/', express.static(path.resolve(__dirname, 'build')));

  app.set('views', path.join(__dirname, 'build'));
  app.set('view engine', 'index');

  app.get('/*', (req, res) => {
    return res.send('HTTP2');
  });

  return app;
}
