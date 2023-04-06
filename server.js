const express = require('express');
const app = express();
const router = require('./routes/routes');
const routerx = require('./routes/auth_routes');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
require('dotenv').config();
app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(router);
app.use(routerx);
try { 
    sequelize.sync();
    console.log(`Database Connected`)
    app.listen((process.env.PORT),function(){
        console.log(`Server started at http://localhost:${process.env.PORT}`)
    })
} catch (err) {
    console.log(err);
}
