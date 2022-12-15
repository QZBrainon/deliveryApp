const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../api/app')
const products = require('./mocks/Products')

chai.use(chaiHttp);

describe('Testa a rota products', () => {
    it('Testa o get', async () => {
        const response = await chai.request(app).get('/products')

      chai.expect(response.status).to.be.equal(200)
      chai.expect(response.body).to.deep.equal(products)
    })
    it('Testa o get', async () => {
        const response = await chai.request(app).get(new Error())

      chai.expect(response.status).to.be.equal(404)
      // console.log(response)
      // chai.expect(response.body).to.equal('Ocorreu um erro')
    })
})