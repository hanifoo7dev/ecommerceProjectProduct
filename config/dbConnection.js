const mongoose = require ('mongoose')

function dbConnection(){
    return mongoose.connect(process.env.MONGODB_URL).then(()=>{
            console.log("Database is connected...")}).catch((err)=>{
                console.log("Database is not connected..",err);
                })
        }

module.exports= dbConnection