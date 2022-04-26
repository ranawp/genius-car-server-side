const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()
const { MongoClient, ServerApiVersion, CURSOR_FLAGS, ObjectId } = require('mongodb');


//medileware 
app.use(cors());
app.use(express.json())

//mongodb ডাটাবেস এর সাথে express (clint) side এর কানেক্ট করার জন্য।  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ptcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('myGeniusCar').collection('service');

        app.get('/service', async (req, res) => {
            const query = {}; //query ekhn korbo na ti empty erray 
            const cursor = serviceCollection.find(query);// 1 tar beshi data khujle find 
            const services = await cursor.toArray(); // cursor k array te convert korse 
            res.send(services);
        });

        //single id data pawar jnno 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //POST 
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        //DELETE api 
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}





//root file e api তৈরি করি api check করে কিনা বুঝার জন্য 
app.get('/', (req, res) => {
    res.send('Running Genius server');
});

//আমাদের ডাটা গুলো যেন server listen করতে পারে তার listen করেত হবে-- 
app.listen(port, () => {
    console.log('lesting to port', port)
})

run().catch(console.dir)


