const express = require('express')
const router = express.Router()
const { search, getTrackByID } = require('../controllers/spotify')

/* GET Spotify search */
router.get('/search', async (req, res) => {
  const q = req.query.q
  const type = req.query.type || 'track'
  const offset = req.query.offset || 0
  const result = await search(q, type, offset)
  res.status(200).send(result.tracks)
})

/* GET track detail */
router.get('/tracks/:id', async (req, res) => {
  const id = req.params.id
  const result = await getTrackByID(id)
  res.status(200).send(result.tracks)
})

module.exports = router
