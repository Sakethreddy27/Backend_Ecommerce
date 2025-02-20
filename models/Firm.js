const mongoose = require('mongoose');

const firmSchema= new mongoose.Schema({

    firmName:{
        type:String,
        required:true,
        unique:true
        
    },
    area:{
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

    region:{
        type:[
            {type:String,
                enum:["south-india","north-india","bakehouse","indo-chinese"]
            }
    

        ]
    },
    offers:{
        type:String
    },
    image:{
        type:String
    },
    vendor:[

        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Vendor'
        }
    ],
    Product:[

        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
         
        }
    ],

    });

    firmSchema.index({ firmName: 1, vendorId: 1 }, { unique: true })
    
    const Firm= mongoose.model('Firm',firmSchema);

    module.exports = Firm;

