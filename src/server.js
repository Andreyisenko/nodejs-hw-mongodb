import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
// import ContactCollection from './db/models/contact.js';
import { getContacts, getContactsById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  //   app.use(
  //     pino({
  //       transport: {
  //         target: 'pino-pretty',
  //       },
  //     }),
  //   );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello BoB Sinkler',
    });
  });

  app.get('/api/contacts', async (req, res) => {
    const data = await getContacts();
    res.json({
      status: 200,
      message: 'Successfully find contacts',
      data,
    });
  });

  app.get('/api/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    const data = await getContactsById(contactId);
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

// export default setupServer;
