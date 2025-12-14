import express from 'express';
import http from 'http';
import cors from 'cors';
import MongoConnectionFactory from "./inc/MongoConnectionFactory.js";
import DiscordClientContainer from "./Discord/DiscordClientContainer.js";

 import conf from '../conf.js';
 MongoConnectionFactory.init(conf).then(() => {
     console.log('MongoConnectionFactory initialized, initialising discord bot');
     DiscordClientContainer.initialise(conf, MongoConnectionFactory.getInstance()).then(()=>{
         console.log("Discord client container initialised");
     });
 });


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Normalize the configured frontend origin (browser Origin header doesn't include a trailing slash)
const frontendOrigin = (conf.frontend && conf.frontend.url) ? conf.frontend.url.replace(/\/$/, '') : '*';
console.log(`Enabling CORS for frontend: ${frontendOrigin}`)
app.use(cors({
    origin: frontendOrigin,
    optionsSuccessStatus: 200
}));

import sheetRoutes from './routes/sheets.js';
app.use('/sheets', sheetRoutes);

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.status(404).send("File not found")
});



// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(500).json({error:"Server error occured"});
});


const server = http.createServer(app);
const port = conf.express.port;
server.listen(port);
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