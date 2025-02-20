const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({

     productName:{
        type:String,
        require:true,
    
    },
    price:{
        type:String,
        require:true,
        

    },
    category:{

        type:[
            {type:String,
                enum:["non-veg","veg"]
            }
        ],
        require:true,
    
        
    },

    offers:{
        type:String
    },
    image:{
        type:String
    },
    bestSeller:{
        type:String,

    },
    description:{
        type:String,
    },
    firm:[

        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Firm',
            required:true,
        }]
    });
    const Product= mongoose.model("Product",productSchema);

    module.exports = Product;

