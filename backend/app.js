import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import MongoConnectionFactory from "./inc/MongoConnectionFactory.js";

import conf from './conf.js';
MongoConnectionFactory.init(conf).then(() => {
    console.log('MongoConnectionFactory initialized');
});


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

import sheetRoutes from './routes/sheets.js';
app.use('/sheets', sheetRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send("File not found")
});



// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(500).json({error:"Server error occured"});
});


const server = http.createServer(app);
server.listen(conf.port);
server.on('error', (error)=>{
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', ()=>{
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});