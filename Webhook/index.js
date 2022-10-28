'use strict'

const authenticationToken = "666";

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
var nodemailer = require('nodemailer');
const port = process.env.PORT || 4001

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/webhook', (req, res)=>{
    res.sendStatus(200);
    var webhook = req.body;
    console.log(webhook);

    //res.send({message:'Bienvenido a mi Webhook'}) //Este mensaje esta en formato Json
})

app.listen(port, ()=>{
    console.log(`Servicio corriendo en el puerto ${port}`)
})

app.post('/webhook', (req, res) => {
    var data = req.body;
    console.log('Inicio del Json recibido')
    console.log(data)
    console.log('Fin del Json recibido')
    res.sendStatus(200)
    
})

app.post('/sendMail', (req, res) => {
    var {mensaje, remitente, asunto, token} = req.body;
    
    if ( token === authenticationToken) {

      var transporter = nodemailer.createTransport({
          // service: 'hotmail',
          service: 'outlook',
          auth: {
            user: 'juliperelda@outlook.com',
            pass: 'juli40928607'
          }
        });
        
      //   var mensaje = msj;
        
        var mailOptions = {
          from: 'juliperelda@outlook.com',
          to: remitente,
          subject: asunto,
          text: mensaje
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado: ' + info.response);
          }
        });

      var {mensaje, remitente, asunto} = req.body;
      // logica del envio de mail

    } else{
      console.log('Autenticación incorrecta');
    }
})
