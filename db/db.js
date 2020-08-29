const mongoose = require('mongoose');

const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.mongo_Uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('connected to Database');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = ConnectDb;
