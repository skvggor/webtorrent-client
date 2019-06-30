const WebTorrent = require('webtorrent-hybrid')
const client = new WebTorrent()
const magnetLink = process.argv[2]
const events = require('events')
const port = process.env.WEBTORRENT_CLIENT_PORT || 3000
events.defaultMaxListeners = 20

;(async () => {
  await client.add(magnetLink, torrent => {
    const server = torrent.createServer()

    torrent.on('done', () => {
      console.log('Download done!')
      server.close()
      client.destroy()
    })

    server.listen(port)
  })
})()


