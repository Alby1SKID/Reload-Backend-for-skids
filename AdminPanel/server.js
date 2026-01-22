const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin'); 

const app = express();
const PORT = 3000;


mongoose.connect('mongodb://127.0.0.1/Reload', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


app.use('/admin', adminRoutes);


app.use(express.static(__dirname));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
