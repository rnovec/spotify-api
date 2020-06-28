'use strict'
/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require('express')
const request = require('request')
const router = express.Router()

const client_id = process.env.CLIENT_ID // Your client id
const client_secret = process.env.CLIENT_SECRET // Your secret
const redirect_uri = process.env.REDIRECT_URI // Your redirect uri

const stateKey = 'spotify_auth_state'
const spotifyUrl = 'https://accounts.spotify.com/api/token'

const { generateRandomString } = require('../utilities')
const { getAuthUri, getToken } = require('../controllers/auth')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'VuePlay API' })
})

/* GET Authorization. */
router.get('/spotify', function (req, res) {
  // your application requests authorization
  const state = generateRandomString(16)
  res.cookie(stateKey, state)
  const { redirect } = req.query
  res.redirect(getAuthUri(redirect, state))
})

router.get('/callback', function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null
  res.clearCookie(stateKey)
  const result = getToken(code)
  res.send(result)
})

/*
  Spotify API Token server
    Esta aplicación únicamente toma el CLIENTID y CLIENTSecret
    que brinda spotify, para obtener el token mediante una petición
    POST desde el front-end.

*/
router.get('/spotify/:client_id/:client_secret', (req, resp) => {
  let client_id = req.params.client_id
  let client_secret = req.params.client_secret

  const authOptions = {
    url: spotifyUrl,
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64')
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  }

  request.post(authOptions, (err, httpResponse, body) => {
    if (err) {
      return resp.status(400).json({
        ok: false,
        mensaje: 'No se pudo obtener el token',
        err
      })
    }
    resp.json(body)
  })
})

router.get('/refresh_token/:token', function (req, res) {
  // requesting access token from refresh token
  const refresh_token = req.params.token
  const authOptions = {
    url: spotifyUrl,
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64')
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({
        access_token: access_token
      })
    }
  })
})

module.exports = router
