const express = require('express');
const cors = require('cors');
const loginRouter = require('../routes/loginRouter');
const userRouter = require('../routes/userRouter');
const productRouter = require('../routes/productRouter');
const saleRouter = require('../routes/saleRouter');
const { erro } = require('../middlewares/ErrorMid');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/images', express.static('public'));

app.use('/login', loginRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/sales', saleRouter);

app.get('/coffee', (_req, res) => res.status(418).end());

app.use(erro);

module.exports = app;
