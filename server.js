const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUploader = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');

const ConnectDb = require('./db/db');
const projectRoutes = require('./router/projectRoutes');

require('dotenv').config();

const app = express();

ConnectDb();
// .then(() =>
//   app.listen(port, () => console.log(`Server running on Port ${port}`))
// );

app.use(cors());
app.use(fileUploader());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.use(express.static('public'));

app.use('/projects', projectRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on Port ${port}`));
