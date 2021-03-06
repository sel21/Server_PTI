//Modulo para la web

const express = require('express');

const methodOverride = require("method-override"),
mongoose = require("mongoose");

const Informe = require("../models/informe_model.js");
const morgan = require("morgan");

//Obtener ruta root (no borrar!)
let ruta = __dirname;
ruta = ruta.split('/');
ruta.pop();
ruta.pop();
ruta  = ruta.join('/');

//Creamos variable route (funciona igual que app)
const router = express.Router();

var bodyParser = require('body-parser');

//AGREGADO PARA PRUEBAS AUNQUE QUIZA ES REDUNDANTE
router.use(bodyParser.json()).use(bodyParser.urlencoded({extended: true}));

const Empresa = require("../models/instalacion_model.js");
const { MongoClient, ObjectID } = require('mongodb');
const e = require("express");

//middleware
router.use(morgan('dev'));

//Permite obtener JSON y formularios en peticiones POST
router.use(express.urlencoded({extended: false }));
router.use(express.json());
//Permite hacer PUT y DELETE
router.use(methodOverride());



router.get("/", function (req, res) {
    res.render('menu');
});

router.get("/consulta_mapa", function (req, res) {

    // //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    // //Import empresa model
    let Empresa = require('../models/instalacion_model.js');

    Empresa.find( function(err, empresas){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            res.status(200).render('consulta_mapa', {empresas: empresas});
        }
    });
});

router.get("/consulta_placa", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    let id = req.query.id;

    Informe.find({id_placa: id}, function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            //cogemos el ultimo dato, el mas actual
            let co2 = informes[informes.length-1].datos_co2;
            let fecha = informes[informes.length-1].fecha_transaccion;
            let hora = informes[informes.length-1].hora_transaccion;
            let hash = informes[informes.length-1].hash_transaccion;
            let poblacion = informes[informes.length-1].nombre_poblacion;
            let nombre_loc = informes[informes.length-1].nombre_instalacion;
            let longitud = informes[informes.length-1].coordenadas_longitud_placa;
            let latitud = informes[informes.length-1].coordenadas_latitud_placa;

            res.status(200).render('consulta_placa', {id_placa: id, dato_co2: co2, fecha: fecha,
                hora: hora, hash: hash, poblacion: poblacion, nombre: nombre_loc, longitud: longitud, latitud: latitud});
        }
    });
});

router.get("/informes_placa", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    let id = req.query.id;

    Informe.find({id_placa: id}, function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else {
            let nombre = informes[0].nombre_instalacion;

            res.render('informes_placa', {informes: informes, nombre: nombre});
        }
    });
});

router.get("/consulta_placas", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    Informe.find( function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            res.status(200).render('consulta_placas', {informes: informes});
        }
    });
});


router.get("/busqueda_custom", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    res.render('busqueda_custom',);
});

router.post("/busqueda_custom_res", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    var resultado = req.body.search_1;

    Informe.find( {$or:[{nombre_poblacion: resultado}, {nombre_instalacion: resultado }] }  ,function(err, informes){

        if(err){
            console.log(err);
            res.send(500);
        }
        else {
            res.status(200).render('busqueda_custom_res', {informes: informes} );
        }

    });
});


router.get("/localizaciones", function (req, res) {
    res.render('todas_localizaciones');
});

router.get("/pasarValores", function (req, res) {
    res.render('pasarValores', {Title : "Esto es un valor"});
});

router.get("/copiar_pegar", function (req, res) {

    // //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    // //Import empresa model
    let Empresa = require('../models/instalacion_model.js');

    Empresa.find( function(err, empresas){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            res.status(200).render('copiar_pegar', {empresas: empresas});
        }
    });
});

//Modulo disponible
module.exports = router;
