const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

//app.use(cors())
//app.use(express.json());
app.use(express.json());
const corsConfig = {
origin: '*',
credentials: true,
methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}
app.use(cors(corsConfig))



const uri = "mongodb+srv://palppartha:pal610676@cluster0.kf7gnio.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7
      //await client.connect();
  
      const database = client.db("productDB");
      const productsCollection = database.collection("products");
      const brandCollection=database.collection("brandName");
      const cartCollection=database.collection("cartDetails");
      const userCollection=database.collection("userDetails");
// get brand data
        app.get('/brands', async(req, res) => {
            const cursor = brandCollection.find();
            const results= await cursor.toArray();
            res.send(results);
        })
// get product data
app.get('/products', async(req, res) => {
  const cursor = productsCollection.find();
  const results= await cursor.toArray();
  res.send(results);
})    
// get cart data
app.get('/cart', async(req, res) => {
  const cursor = cartCollection.find();
  const results= await cursor.toArray();
  res.send(results);
})
// get data
app.get('/products/:id',async(req,res)=>{
  const id=req.params.id;
  console.log('please send data from database',id);
  const query = { _id: new ObjectId(id) };
  const result = await productsCollection.findOne(query);
  res.send(result);
})   

//update data from database
app.put('/products/:id', async (req, res) => {
  const id=req.params.id;
  const updatedProduct=req.body;
  console.log(updatedProduct.name);
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
  $set: {
    image:updatedProduct.image,
    name:updatedProduct.name,
    brand:updatedProduct.brand,
    type:updatedProduct.type,
    price:updatedProduct.price,
    rating:updatedProduct.rating
    }
  }
  const result = await productsCollection.updateOne(query,updateDoc,options);
  res.send(result);
})
//delete cart data
app.delete('/cart/:id', async (req, res) => {
  const id=req.params.id;
  console.log('please delete from database',id);
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
  if (result.deletedCount === 1) {
    console.log("Successfully deleted one document.");
  } else {
    console.log("No documents matched the query. Deleted 0 documents.");
  }
})      
// get brand data
    // app.get('/brands/:brandName', async(req, res) => {
    //     const cursor = brandCollection.find();
    //     const results= await cursor.toArray();
    //     res.send(results);
    // })        
//add data to database      
      app.post('/products',async(req,res)=>{
        const products=req.body;
        console.log('add product',products)
        const result = await productsCollection.insertOne(products);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.send(result)
    })
    //user data to database      
    app.post('/user',async(req,res)=>{
      const users=req.body;
      console.log('add user',users)
      const result = await userCollection.insertOne(users);
      console.log(`user inserted with the _id: ${result.insertedId}`);
      res.send(result)
  })
  // product added to cart  
    app.post('/cart',async(req,res)=>{
      const cartProducts=req.body;
      console.log('Product added',cartProducts)
      const result = await cartCollection.insertOne(cartProducts);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send(result)
  })

  
  

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      //await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('automotive industry server is running well')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

  




   