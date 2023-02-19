const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../api/app')
const sinon = require('sinon')
const { User, Sale, SaleProduct } = require('../database/models');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const order = {
    id: 1,
    userId: 3,
    sellerId: 2,
    totalPrice: "99.99",
    deliveryAddress: "Av. 9 de Julho",
    deliveryNumber: "999",
    saleDate: "2022-12-06T19:37:34.000Z",
    status: "Pendente",
    UserId: 3,
    products: [
      {
        id: 9,
        name: "Becks 600ml",
        price: "8.89",
        qtd: {
          quantity: 22
        }
      },
      {
        id: 8,
        name: "Brahma Duplo Malte 350ml",
        price: "2.79",
        qtd: {
          quantity: 33
        }
      }
    ]
  }
const newOrder = {
    id: 5,
    userId: 3,
    sellerId: 2,
    totalPrice: 10.00,
    deliveryAddress: "avenida flavio dos santos",
    deliveryNumber: 106,
    products: [
      {
        id: 9,
        name: "Becks 600ml",
        price: "8.89",
        quantity: 22
      },
      {
        id: 8,
        name: "Brahma Duplo Malte 350ml",
        price: "2.79",
        quantity: 33
      }
    ]
  }

describe('Testa o /sales', () => {
    beforeEach(() => sinon.restore())
    const admin = { 
        id: 1,
        name: 'Delivery App Admin',
        email: 'adm@deliveryapp.com',
        role: 'administrator' 
        }
    const seller = {
        id: 2,
        name: 'Fulana Pereira',
        email: 'fulana@deliveryapp.com',
        role: 'seller',
        password: '3c28d2b0881bf46457a853e0b07531c6'
    }
    const user = { 
        id: 3,
        name: 'Cliente Zé Birita',
        email: 'zebirita@email.com',
        role: 'customer',
        password: '1c37466c159755ce1fa181bd247cb925'
        }
        
  it('Testa o findSaleById como customer', async () => {
    sinon.stub(User, 'findOne').resolves(user)

    const login = await chai.request(app).post('/login')
    .send({ email: user.email, password: '$#zebirita#$' })
        
    const { token } = login.body;

    sinon.stub(Sale, 'findAll').resolves(order)

    const response = await chai.request(app).get('/sales').set({ authorization: token })

    expect(response.status).to.be.equal(200)
    expect(response.body).to.deep.equal(order)
  })
  it('Testa o findSaleById como seller', async () => {
    sinon.stub(User, 'findOne').resolves(seller)

    const login = await chai.request(app).post('/login')
    .send({ email: seller.email, password: 'fulana@123' })
        
    const { token } = login.body;

    sinon.stub(Sale, 'findAll').resolves(order)

    const response = await chai.request(app).get('/sales').set({ authorization: token })

    expect(response.status).to.be.equal(200)
    expect(response.body).to.deep.equal(order)
  })
  it('Testa o findSaleById sem sucesso', async () => {
    sinon.stub(User, 'findOne').resolves(seller)

    const login = await chai.request(app).post('/login')
    .send({ email: seller.email, password: 'fulana@123' })
        
    const { token } = login.body;

    sinon.stub(Sale, 'findOne').resolves(null)

    const response = await chai.request(app).get('/sales/1').set({ authorization: token })

    expect(response.status).to.be.equal(409)
    // expect(response.body).to.deep.equal(order)
  })
  it('Testa o detailedSale com customer', async () => {
    sinon.stub(User, 'findOne').resolves(user)

    const login = await chai.request(app).post('/login')
    .send({ email: user.email, password: '$#zebirita#$' })
        
    const { token } = login.body;

    sinon.stub(Sale, 'findOne').resolves(order)

    const response = await chai.request(app).get('/sales/1').set({ authorization: token })

    expect(response.status).to.be.equal(200)
    expect(response.body).to.deep.equal(order)
  })
  it('Testa o detailedSale com seller', async () => {
    sinon.stub(User, 'findOne').resolves(seller)

    const login = await chai.request(app).post('/login')
    .send({ email: seller.email, password: 'fulana@123' })
        
    const { token } = login.body;

    sinon.stub(Sale, 'findOne').resolves(order)

    const response = await chai.request(app).get('/sales/1').set({ authorization: token })

    expect(response.status).to.be.equal(200)
    expect(response.body).to.deep.equal(order)
  })
  it('Testa o createSale com customer', async () => {
    sinon.stub(User, 'findOne').resolves(user)

    const login = await chai.request(app).post('/login')
    .send({ email: user.email, password: '$#zebirita#$' })
        
    const { token } = login.body;

    sinon.stub(Sale, 'create').resolves(newOrder)

    sinon.stub(SaleProduct, 'bulkCreate')

    const response = await chai.request(app).post('/sales').send(newOrder).set({ authorization: token })

    expect(response.status).to.be.equal(201)
  })
  it('Testa o updateSale com sucesso', async () => {
    sinon.stub(User, 'findOne').resolves(seller)

    const login = await chai.request(app).post('/login')
    .send({ email: seller.email, password: 'fulana@123' })
        
    const { token } = login.body;

    sinon.stub(Sale, 'update')

    const response = await chai.request(app).patch('/sales/1')
    .send({status: 'Entregue'}).set({ authorization: token })

    expect(response.status).to.be.equal(200)
    //expect(response.body).to.deep.equal(newOrder)
  })
  it('Testa o updateSale com erro', async () => {
    sinon.stub(User, 'findOne').resolves(seller)

    const login = await chai.request(app).post('/login')
    .send({ email: seller.email, password: 'fulana@123' })
        
    const { token } = login.body;

    const response = await chai.request(app).patch('/sales/1')
    .send({status: 'status errado'}).set({ authorization: token })

    expect(response.status).to.be.equal(401)
  })
})