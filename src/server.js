import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getContacts, getContactsById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello BoB Sinkler',
    });
  });

  app.get('/api/contacts', async (req, res) => {
    const data = await getContacts();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
    });
  });

  app.get('/api/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    // console.log(contactId);

    const data = await getContactsById(contactId);

    if (!data) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
