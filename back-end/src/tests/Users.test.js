const { expect } = require('chai');
const chai = require('chai')
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../api/app')
const { User } = require('../database/models');
const users = require('./mocks/Users')
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

describe('Testa users', () => {
  beforeEach(() => sinon.restore())

  const admin = { 
    id: 1,
    name: 'Delivery App Admin',
    email: 'adm@deliveryapp.com',
    role: 'administrator' 
    }

  const customer = {
    id: 3,
    name: 'Cliente Zé Birita',
    email: 'zebirita@email.com',
    password: '$#zebirita#$'
  }
    it('Testa o createUser como admin', async () => {
      const login = await chai.request(app).post('/login').send({ email: 'adm@deliveryapp.com',
      password: '--adm2@21!!--' })

      const { token } = login.body;

         sinon.stub(User, 'create').resolves({ 
          name: 'Eduardo Prado sdgs',
          email: 'meuemaifjfl@teste.com',
          password: 'senha123',
          role: 'customer',
          })

          sinon.stub(User, 'findOne').resolves(null)

          sinon.stub(jwt, 'sign').returns('token')

        const response = await chai.request(app).post('/users').send({ name: 'Eduardo Prado sdgs',
      email: 'meuemaifjfl@teste.com',
      password: 'senha123'})
      .set({ authorization: token })

       console.log(response.body)

      expect(response.status).to.be.equal(201)  
      expect(response.body).to.deep.equal({ 
        name: 'Eduardo Prado sdgs',
        email: 'meuemaifjfl@teste.com',
        role: 'customer',
        token: 'token',
        })
    })
    it('Testa o createUser com token de customer sem sucesso', async () => {
      const login = await chai.request(app).post('/login').send({ email: 'adm@deliveryapp.com',
      password: '--adm2@21!!--' })

      const { token } = login.body;

         sinon.stub(User, 'create').resolves({ 
          name: 'Eduardo Prado sdgs',
          email: 'meuemaifjfl@teste.com',
          password: 'senha123',
          role: 'customer',
          })

          sinon.stub(User, 'findOne').resolves(null)

          sinon.stub(jwt, 'sign').returns('token')

        const response = await chai.request(app).post('/users').send({ name: 'Eduardo Prado sdgs',
      email: 'meuemaifjfl@teste.com',
      password: 'senha123'})
      .set({ authorization: token })

       console.log(response.body)

      expect(response.status).to.be.equal(201)  
      expect(response.body).to.deep.equal({ 
        name: 'Eduardo Prado sdgs',
        email: 'meuemaifjfl@teste.com',
        role: 'customer',
        token: 'token',
        })
    })
    it('Testa o createUser como customer', async () => {
         sinon.stub(User, 'create').resolves({
          name: 'Eduardo Prado sdgs',
          email: 'meuemaifjfl@teste.com',
          password: 'senha123',
          role: 'customer',
          })

          sinon.stub(User, 'findOne').resolves(null)

          sinon.stub(jwt, 'sign').returns('token')

        const response = await chai.request(app).post('/users').send({ name: 'Eduardo Prado sdgs',
      email: 'meuemaifjfl@teste.com',
      password: 'senha123'})

      expect(response.status).to.be.equal(201)  
      expect(response.body).to.deep.equal({ 
        name: 'Eduardo Prado sdgs',
        email: 'meuemaifjfl@teste.com',
        role: 'customer',
        token: 'token',
        })
    })
    it('Testa o createUser sem passar o name', async () => {
      const response = await chai.request(app).post('/users').send({
      email: 'meuemaifjfl@teste.com',
      password: 'senha123'})

      expect(response.status).to.be.equal(400)  
      expect(response.body).to.deep.equal({message: 'Required fields are missing'})
    })
    it('Testa o createUser com o name curto', async () => {
      const response = await chai.request(app).post('/users').send({ name: 'nome',
      email: 'meuemaifjfl@teste.com',
      password: 'senha123'})

      expect(response.status).to.be.equal(404)  
      expect(response.body).to.deep.equal({message: 'Dados de cadastro inválidos'})
    })
    it('Testa o createUser com uma conta já existente', async () => {
      sinon.stub(User, 'findOne').resolves(admin)

      const response = await chai.request(app).post('/users').send({ name: 'Algum nome qualquer',
      email: admin.email,
      password: 'senha123'})

      expect(response.status).to.be.equal(409)  
      expect(response.body).to.deep.equal({message: 'Conflict'})
    })
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
    it('Testa o findAll sem o role de admin', async () => {
      const login = await chai.request(app).post('/login').send({ email: customer.email,
         password: customer.password })

         sinon.stub(User, 'findOne').resolves(customer)

        const { token } = login.body;

      sinon.stub(User, 'findAll').resolves(users)

      const response = await chai.request(app).get('/users').set({ authorization: token })


      chai.expect(response.status).to.be.equal(401)

      chai.expect(response.body).to.deep.equal({message: 'Unauthorized'})
  })
    it('Testa o findSellers', async () => {
        const login = await chai.request(app).post('/login').send({ email: 'adm@deliveryapp.com',
        password: '--adm2@21!!--' })

        sinon.stub(User, 'findOne').resolves(admin)

        const { token } = login.body;

        sinon.stub(User, 'findAll').resolves(users[0])

        const response = await chai.request(app).get('/users/sellers').set({ authorization: token })
        // console.log(response);

        chai.expect(response.status).to.be.equal(200)

        chai.expect(response.body).to.deep.equal(users[0])
    })
    it('Testa o deleteUser', async () => {
      const login = await chai.request(app).post('/login').send({ email: 'adm@deliveryapp.com',
        password: '--adm2@21!!--' })

        sinon.stub(User, 'findOne').resolves(admin)

        const { token } = login.body;

      sinon.stub(User, 'destroy').resolves()

      const response = await chai.request(app).delete('/users/10').set({ authorization: token })
      // console.log(response)

      expect(response.status).to.be.equal(204)
      expect(response.body).to.deep.equal({})
    })
    it('Testa o deleteUser sem role de admin', async () => {
      const login = await chai.request(app).post('/login').send({ email: customer.email,
        password: customer.password })

        sinon.stub(User, 'findOne').resolves(customer)

       const { token } = login.body;

      sinon.stub(User, 'destroy').resolves()

      const response = await chai.request(app).delete('/users/10').set({ authorization: token })
      // console.log(response)

      expect(response.status).to.be.equal(401)
      expect(response.body).to.deep.equal({message: 'Unauthorized'})
    })
})