const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
// const query = require('express/lib/middleware/query');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// use MiddleWire
app.use(cors())
app.use(express.json())

// username: dbuser1
// password: M1OQcyaQ5jXPrqGE



const uri = "mongodb+srv://dbuser1:M1OQcyaQ5jXPrqGE@cluster0.agg0z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const userCollection = client.db("FoodExpress").collection("user");
        // get users to the client side UI
       app.get('/user', async(req, res)=>{
           const query ={};
           const cursor = userCollection.find(query)
           const usersData = await cursor.toArray()
           res.send(usersData)
       })

    // get particular user from database

       app.get('/user/:id', async(req, res)=>{
           const id = req.params.id;
           const query ={_id: ObjectId(id)}
           const result = await userCollection.findOne(query)
           res.send(result)
       })

        // Post User: Add a new User to the server side
        app.post('/user', async(req, res)=>{
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            console.log('The New user', newUser);
            res.send(result)
            
        })

        // UPDATE User

        app.put('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updatedDoc = {
               $set : {
                   name: updatedUser.name,
                   email: updatedUser.email
               }
            }
            const result = await userCollection.updateOne(filter, updatedDoc ,options)
            res.send(result)
        })

        // Delete User from the database

        app.delete('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Server is working')
})

app.listen(port, ()=>{
    console.log('Listening the port', port);
})