const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const res = require('express/lib/response');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



//db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ya1rj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const bikeCollection = client.db('assignment').collection('bikes');

        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikeCollection.find(query);
            const bikes = await cursor.toArray();
            res.send(bikes);
        });

        app.get('/inventory/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const bike = await bikeCollection.findOne(query);
            res.send(bike);
        });

        app.post('/bikes', async (req, res) =>{
            const newBike = req.body;
            const result = await bikeCollection.insertOne(newBike);
            res.send(result);
        });

        app.put('/bikes/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedElement = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    stock: updatedElement.result
                }
            };
            const result = await bikeCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/bikes/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bikeCollection.deleteOne(query);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running genius server');
})

// port listening
app.listen(port, () => {
    console.log('listening to port', port);
})