const { expect } = require('chai');
const chai = require('chai')
const chaiHttp = require('chai-http');
const sinon = require('sinon')
const app = require('../api/app')
const { User } = require('../database/models');
const users = require('./mocks/Users')

chai.use(chaiHttp);

describe('Testa users', () => {
  beforeEach(() => sinon.restore())

  const admin = { 
    id: 1,
    name: 'Delivery App Admin',
    email: 'adm@deliveryapp.com',
    role: 'administrator' 
    }
    it('Testa o findAll', async () => {
        const login = await chai.request(app).post('/login').send({ email: 'adm@deliveryapp.com',
         password: '--adm2@21!!--' })

         sinon.stub(User, 'findOne').resolves(admin)

        const { token } = login.body;

        sinon.stub(User, 'findAll').resolves(users)

        const response = await chai.request(app).get('/users').set({ authorization: token })

        chai.expect(response.status).to.be.equal(200)

        chai.expect(response.body).to.deep.equal(users)
    })
    it.skip('Testa o findSellers', async () => {
        const login = await chai.request(app).post('/login').send({ email: 'adm@deliveryapp.com',
        password: '--adm2@21!!--' })

        sinon.stub(User, 'findOne').resolves(admin)

        const { token } = login.body;

        sinon.stub(User, 'findOne').resolves(users[0])

        const response = await chai.request(app).get('/sellers').set({ authorization: token })
        console.log(response);

        chai.expect(response.status).to.be.equal(200)

        chai.expect(response.body).to.deep.equal(users[0])
    })
})