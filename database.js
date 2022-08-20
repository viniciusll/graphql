const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin:admin@techday.g4haknb.mongodb.net/?retryWrites=true&w=majority';

console.log('[TECH DAY] conectando banco de dados');
mongoose.connect(
  uri,
  { useNewUrlParser: true }, (err) => {
    const msg = err || '[TECH DAY] banco de dados conectado';
    console.log(msg);
  },
);

mongoose.Promise = global.Promise;

module.exports = mongoose;