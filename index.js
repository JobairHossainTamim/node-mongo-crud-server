const express=require('express');
const app=express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const objectId=require('mongodb').ObjectId;

const port=process.env.PORT ||5000;

// middle wire
app.use(cors());
app.use(express.json());
// SUBxjCN6dbBWD4Iz 

// Mongodb 
const uri = "mongodb+srv://mydbuser1:SUBxjCN6dbBWD4Iz@cluster0.ylwaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("FoodMaster");
      const usersCollection = database.collection("user");

      // create a Show data  to insert
      app.get('/users',async(req,res)=>{
        const cursor=usersCollection.find({});
        const users=await cursor.toArray();
        res.send(users);

      });
      


    // Add Data Post Api
            app.post('/users',async(req ,res)=>{

                const newUser=req.body;
                const result=await usersCollection.insertOne(newUser);
                console.log('result: ',result)
                console.log('hitting The post',req.body);
                res.json(result);
            });

            // Set Single Data  Api Database
            app.get('/users/:id', async(req,res)=>{
                  const id=req.params.id;
                  const query={_id:objectId(id) };
                  const user=await usersCollection.findOne(query);
                  res.send(user)
            });
            // update Data From DAtabase of mongodb
            app.put('/users/:id',async(req,res)=>{
              const id=req.params.id;
              const updateUser=req.body;
              const filter={_id:objectId(id)};
              const option={upsert : true};
              const updateDoc={
                $set:{
                  name:updateUser.name,
                  email:updateUser.email
                }
              };
              const result=await usersCollection.updateOne(filter,updateDoc,option)
              res.json(result);
            })

            // Delate Api users
      app.delete('/users/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:objectId(id) };
       const result=await usersCollection.deleteOne(query);
       res.json(result);
    }); 



    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

// client.connect(err => {
//   const collection = client.db("FoodMaster").collection("user");
//   // perform actions on the collection object
//   console.log('hitting Farther db');

// //   insert data Listen
//   const user={name:'Raihan', gmail:'raihan@gmail.com', phone: "0145875441"}

//   collection.insertOne(user)
//   .then(()=>{
//       console.log('Insert Success');
//   });

// //   client.close();
// });
// Mongo end




app.get('/',(req,res)=>{
    res.send("Hello Crud server")
})

// Set Port Listen
app.listen(port,()=>{
    console.log('listening to port ',port);
});