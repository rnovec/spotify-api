const request = require('request')
const querystring = require('querystring')

const client_id = process.env.CLIENT_ID // Your client id
const client_secret = process.env.CLIENT_SECRET // Your secret
const redirect_uri = process.env.REDIRECT_URI // Your redirect uri

const spotifyUrl = 'https://accounts.spotify.com/api/token'
const scope = 'user-read-private user-read-email'

function getHeaders () {
  return {
    Authorization:
      'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64')
  }
}

/**
 * Get Spotify Authorization URL
 * @param {string} redirect URL redirect after request
 */
function getAuthUri (redirect, state) {
  return (
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri: redirect || redirect_uri,
      state
    })
  )
}

function getToken (code) {
  return new Promise((resolve, reject) => {
    const authOptions = {
      url: spotifyUrl,
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: getHeaders(),
      json: true
    }

    request.post(authOptions, (err, httpResponse, body) => {
      if (err) {
        return reject({
          status: 400,
          message: 'No se pudo obtener el token',
          err
        })
      }
      resolve(JSON.parse(body))
    })
  })
}

module.exports = {
  getAuthUri,
  getToken
}
