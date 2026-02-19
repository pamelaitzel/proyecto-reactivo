const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://TU-FRONTEND.netlify.app"
    ]
}));

app.use(bodyParser.json());

let sensores = [
    { id: 1, nombre: 'Sensor Sala', tipo: 'Temperatura', valor: 24 },
    { id: 2, nombre: 'Sensor Cocina', tipo: 'Humedad', valor: 60 },
    { id: 3, nombre: 'Sensor Jardín', tipo: 'Luz', valor: 85 }
];

app.get('/api/sensores', (req, res) => {
    res.json(sensores);
});

app.post('/api/sensores', (req, res) => {
    const nuevoSensor = {
        id: Date.now(),
        nombre: req.body.nombre,
        tipo: req.body.tipo,
        valor: Number(req.body.valor)
    };
    sensores.push(nuevoSensor);
    res.status(201).json(nuevoSensor);
});

app.delete('/api/sensores/:id', (req, res) => {
    const id = parseInt(req.params.id);
    sensores = sensores.filter(sensor => sensor.id !== id);
    res.json({ mensaje: 'Sensor eliminado correctamente', id });
});

app.get('/api/sensores/tipo/:tipo', (req, res) => {
    const tipo = req.params.tipo;
    const filtrados = sensores.filter(s => s.tipo === tipo);
    res.json(filtrados);
});

app.listen(PORT, () => { 
    console.log(`Servidor API corriendo en puerto ${PORT}`);
});