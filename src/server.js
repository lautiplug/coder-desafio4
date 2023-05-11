import express from 'express';
import { __dirname } from './path.js';
import {Server} from 'socket.io'
import handlebars from 'express-handlebars'
import viewsRoutes from './routes/viewRoutes.js';
import { addProduct, getProducts, deleteProduct } from './manager/productManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use("/", viewsRoutes);

const httpServer = app.listen(8080, () => {
console.log('Server is running on port 8080');
});

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    socket.on('newProduct',async (producto) => {
        await addProduct(producto.name, producto.price, producto.description);
        socketServer.emit('get-products', await getProducts());
        console.log('algo')
    });
    socket.on('deleteProduct', async (id) => {
        await deleteProduct(id);
        socketServer.emit('get-products', await getProducts());
    });
});