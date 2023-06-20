require('dotenv').config();
const PORT = process.env.PORT || 8080;
const router = require('./resources/routes');
const mongoose = require('mongoose');
const database = process.env.DATABASE || 'mongodb://127.0.0.1:27017/Elearning';
const app = require('./config/server').init();
const { User } = require('../src/resources/models');

mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
    console.log('Database connected')
})
.catch(err => {
    console.log(err);
})

router(app);


app.get('/', (req, res, next) => {
    return res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})