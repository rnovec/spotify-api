require('dotenv').config()
const { assert, expect } = require('chai')
const server = require('../bin/www')
const request = require('supertest')(server)
const { search, getTrackByID } = require('../controllers/spotify')

describe('Tests for Spotify', () => {
  /**
   * Search
   */
  describe('Search tests', () => {
    it('Unit test for search()', async () => {
      const result = await search('rock')
      expect(result.tracks.items).to.be.an('array')
    })
    it('Integration test for API /search', done => {
      request.get('/search?q=rock').end((err, response) => {
        if (err) done(err)
        expect(response.body.items).to.be.an('array')
        expect(response.statusCode).to.equal(200)
        done()
      })
    })
  })

  /**
   * Tracks
   */
  describe('Track tests', () => {
    let id = '7ytR5pFWmSjzHJIeQkgog4'
    it('Unit test for getTrackbyID(id)', async () => {
      const result = await getTrackByID(id)
      assert.isObject(result, 'Result is an Object')
    })
    it('Integration test for API /track/:id', () => {
      request.get('/track/' + id).end((err, response) => {
        if (err) done(err)
        assert.isObject(response.body, 'Result is an Object')
        expect(response.statusCode).to.equal(200)
        done()
      })
    })
  })
})
