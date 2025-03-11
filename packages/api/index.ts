import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
let db: any;

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const mongoClient = new MongoClient(DATABASE_URL);
    await mongoClient.connect();
    db = mongoClient.db();

    await db.collection('hotels').createIndex({ hotel_name: "text" });
    await db.collection('cities').createIndex({ name: "text" });
    await db.collection('countries').createIndex({ country: "text" });

    console.log('Successfully connected to MongoDB!');

    app.listen(PORT, () => {
      console.log(`API Server Started at ${PORT}`)
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

app.use(cors())
app.use(express.json());

app.get('/hotels/:query', async (req, res) => {
  try {
    const promises = [];

    promises.push(
      db
        .collection('hotels')
        .find({
          $or: [
            { hotel_name: { $regex: req.params.query, $options: 'i' } },
            { city: { $regex: req.params.query, $options: 'i' } },
            { country: { $regex: req.params.query, $options: 'i' } }
          ]
        })
        .sort({ hotel_rating: -1 })
        .limit(6)
        .toArray())

    promises.push(
      db
      .collection('cities')
      .find({name: { $regex: req.params.query, $options: 'i' }})
      .sort({ name: 1 })
      .limit(4)
      .toArray())

    promises.push(db
      .collection('countries')
      .find({country: { $regex: req.params.query, $options: 'i' }})
      .sort({ country: 1 })
      .limit(4)
      .toArray())

    const [hotels, cities, countries] = await Promise.all(promises);

    res.send({ hotels, cities, countries })
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/hotels/hotel/:id', async (req, res) => {
  try {
    const hotel = await db.collection('hotels').findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!hotel) {
      res.status(404).send('Hotel not found');
      return;
    }

    res.send(hotel)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/cities/:id', async (req, res) => {
  try {
    const city = await db.collection('cities').findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!city) {
      res.status(404).send('City not found');
      return;
    }

    res.send(city)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/countries/:id', async (req, res) => {
  try {
    const country = await db.collection('countries').findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!country) {
      res.status(404).send('Country not found');
      return;
    }

    res.send(country)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
})

startServer();
