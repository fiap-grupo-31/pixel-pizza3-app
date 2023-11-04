const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const expect = chai.expect

describe('Products API',  () => {
  describe('When there is no products in database', () => {
    it('GET /products returns list', async () => {
      const res = await chai.request('http://localhost:8080')
        .get('/products')
      expect(200).to.equal(200)
    })
  })
})


describe('Products API',  () => {
  describe('When there is no products in database', () => {
    it('GET /products/{id} returns one product', async () => {
      const res = await chai.request('http://localhost:8080')
        .get('/products/64dad58ab36af77994ed7087')
      expect(res.statusCode).to.equal(200)
    })
  })
})