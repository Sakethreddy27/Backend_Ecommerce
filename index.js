const express= require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const firmRoutes = require('./routes/firmroutes')
const productroutes = require('./routes/productRoutes')
const app = express()

const PORT = process.env.PORT || 4000;

dotEnv.config()

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // Increase timeout to 30s
  })

.then(()=>console.log("Mongodb connected sucessfully"))
.catch((error)=> console.log(error))

app.use(cors());  // middle ware
app.use(express.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productroutes);
app.use('/uploads',express.static('uploads'));

app.use('/',(req, res)=>{
    res.send("welcome to swugy");
})

app.listen(PORT, ()=>{

    console.log(`Server running sucessfully at ${PORT}`);


});



                                                                     

