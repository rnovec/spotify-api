const request = require('request')
const querystring = require('querystring')
const publicAPI = process.env.PUBLIC_API

/**
 * search anything with Spotify API
 * @param {String} q Term to search
 * @param {String} type 'track'|'album'|'artist'
 * @param {Number} offset For pagination (default 0)
 */
function search (q, type = 'track', offset = 0) {
  return new Promise(async (resolve, reject) => {
    request.get(
      publicAPI +
        '/search?' +
        querystring.stringify({
          q,
          type,
          offset
        }),
      (err, httpResponse, body) => {
        if (err) {
          reject(
            httpResponse.status(500).json({
              ok: false,
              message: 'Something went wrong:(... Try again!!',
              err
            })
          )
        }
        resolve(JSON.parse(body))
      }
    )
  })
}

/**
 * get track details
 * @param {Number|String} id Track ID
 */
function getTrackByID (id) {
  return new Promise((resolve, reject) => {
    request.get(`${publicAPI}/tracks/${id}`, (err, httpResponse, body) => {
      if (err) {
        reject(
          httpResponse.status(500).json({
            ok: false,
            message: 'Something went wrong:(... Try again!!',
            err
          })
        )
      }
      resolve(JSON.parse(body))
    })
  })
}

module.exports = {
  search,
  getTrackByID
}
