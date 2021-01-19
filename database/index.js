const mongoose = require("mongoose");

mongoose
    .connect(
        process.env.MONGO_ATLAS_CONNECTION,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    )
    .then(() => console.log("Connect with database"))
    .catch(error => console.log({error}))

module.exports = mongoose;