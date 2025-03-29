import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
function setupServer() {
  const PORT = 3000;

  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello BoB Sinkler',
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  app.listen(PORT, () => {
    console.log(`Servers running on port ${PORT}`);
  });
}

export default setupServer;
