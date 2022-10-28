import axios from 'axios';
import express from 'express';
import { PORT } from './config.js';
import { pool } from './db.js';


const app = express()

app.use(express.json()) //Esto es para que interprete el cuerpo del JSON que le envias desde el postman. 

app.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users')
    res.json(rows)


    axios.post('http://localhost:4001/webhook', {
        mensaje: "Se obtuvieron con exito los registros de la tabla USERS",
        data: rows
    })
})


app.get('/ping', async (req, res) => {
    const [result] = await pool.query(`SELECT "hello world" as RESULT`)
    res.send('Welcome to Server')
    res.json(result[0])
})

app.get('/create', async (req, res) => {
    const result = await pool.query('INSERT INTO users(name) VALUES ("Jonh")')
    res.json(result)
})

app.post('/webhook', async (req, res) => {
    res.send('Esto es una respuesta desde la api.')
})


app.post('/users', (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(500).send("El campo nombre no existe.");
        }
        const result = pool.query(`INSERT INTO users(name) VALUES ('${name}')`)

        res.send('Se inserto correctamente el registro en la tabla "Users"')

        axios.post('http://localhost:4001/sendMail', {
            mensaje: `¡Hola crack! Se inserto correctamente el usuario: ${name}`,
            remitente: 'juliperelda@gmail.com',
            asunto: 'Petición realizada',
            token: "666"
        })

    } catch (error) {
        res.send('Se produjo un error al insertar registro: ' + error)
        axios.post('http://localhost:4001/webhook', {
            mensaje: 'Se produjo un error.'
        })
    }

})



app.listen(PORT)
console.log('Server on port', PORT)
