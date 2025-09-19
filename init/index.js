const mongoose= require("mongoose");
const Listing= require("../models/listing.js");
const initData= require("./data.js");
let mongo_URL= "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected with mongoose");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_URL);
};

const initDb = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:'68bfbb0998c4b7327c6e8aa2'})); 
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};
initDb();