const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Endpoint de prueba
app.get('/', (req, res) => {
    res.send('Servidor corriendo correctamente');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
})