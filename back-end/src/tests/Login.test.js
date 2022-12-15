const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../api/app')
const sinon = require('sinon')
const { User } = require('../database/models');

// const { request, expect, use } = chai;

chai.use(chaiHttp);

const emailZebirita = 'zebirita@email.com'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJkYXRhIjp7ImlkIjozLCJuYW1lIjoiQ2xpZW50ZSBaw6kgQmlyaXRhIiwiZW1haWwiOiJ6ZWJ'
  + 'pcml0YUBlbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZX'
  + 'IifSwiaWF0IjoxNjcwOTU2MDE4LCJleHAiOjE2Nzk1MDk2MTh9.'
  + 'qCdfvrHvSz8IP_nUAXDK0xsRlGFbIk_FvadFUDVYC1U';

const expectedResponse = {
  id: 3,
  name: 'Cliente Zé Birita',
  email: emailZebirita,
  role: 'customer',
  token,
}

const user = { 
id: 3,
name: 'Cliente Zé Birita',
email: emailZebirita,
role: 'customer' 
}

const jwtRegex = /^(?:[\w-]*\.){2}[\w-]*$/;

describe('Testa o Login', () => {
  it('Testa o post com sucesso', async () => {
    const response = await chai.request(app).post('/login').send({ email: emailZebirita,
      password: '$#zebirita#$' })
      
      sinon.stub(User, 'findOne').resolves(user)

      chai.expect(response.status).to.be.equal(200)
      chai.expect(response.body.token).to.match(jwtRegex)
      chai.expect(response.body.name).to.be.equal('Cliente Zé Birita')
      chai.expect(response.body.email).to.be.equal(emailZebirita)
      chai.expect(response.body.role).to.be.equal('customer')
  })
  it('Testa o post sem sucesso', async () => {
    const response = await chai.request(app).post('/login').send({ email: emailZebirita })

      chai.expect(response.status).to.be.equal(400)
      chai.expect(response.body.message).to.be.equal('Required fields are missing')
  })
})