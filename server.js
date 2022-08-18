const express = require('express');
const handlebars = require('express-handlebars');
const { Server:HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

const productsList = [
    {
        id: 1,
        name: "Fender Duo-Sonic",
        price: 16500,
        thumbnail: "https://m.media-amazon.com/images/I/61ysTB0juPL._AC_SL1500_.jpg",
    },
    {
        id: 2,
        name: "Fender Telecaster Vintera",
        price: 24000,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8n-9wHj_8NCXSnUIVv7JEf9xbhobnQhstoyQPmLnkNAkHjHB3-ttvK8aoM2wwAjRErPE&usqp=CAU",
    },
    {
        id: 3,
        name: "Martin Acoustic",
        price: 19350,
        thumbnail: "https://images.musicstore.de/images/1280/martin-guitars-000-10e_1_GIT0050169-000.jpg.webp",
    },
]

const messagesList = [
    {
        id: 1,
        user: "user@mai.com",
        text: "Hola!",
        date: '18/8/2022, 15:03:26'
    },
    {
        id: 2,
        user: "amiga@mail.com",
        text: "Hola a todos! 👋",
        date: '18/8/2022, 15:13:43'
    },
    {
        id: 1,
        user: "amigo@mail.com",
        text: "Como andan? 🤩",
        date: '18/8/2022, 15:39:14'
    },
]

console.log([productsList, messagesList])

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views',
    })
);

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('index', {list: { messages: messagesList, products: productsList }})
})
 
io.on('connection', (socket) => {
    socket.on('new-message', (msg) => {
        messagesList.push(msg);
        io.sockets.emit('new-message-server', messagesList)
    })
    socket.on('new-product', (prod) => {
        productsList.push(prod);
        io.sockets.emit('new-product-server', productsList);
    })
})

const port = 9000;
httpServer.listen(port, () => {
    console.log(`Server running port ${port}`);
})