'use strict'

const WebTorrent = require('webtorrent-hybrid')
const client = new WebTorrent()
const magnetLink = process.argv[2]
const events = require('events')
const internalIp = require('internal-ip')
const childProcess = require('child_process')
const port = process.env.WEBTORRENT_CLIENT_PORT || 3000
const frontendWebtorrentPort = process.env.FRONTEND_WEBTORRENT_PORT || 8080
events.defaultMaxListeners = 20

;(async () => {
  const ip = await internalIp.v4()

  await client.add(magnetLink, torrent => {
    const server = torrent.createServer()
    torrent.on('download', () => console.log(`Streaming... Go to http://${ip}:${frontendWebtorrentPort} | ${(torrent.progress * 100).toFixed(1)}% | ${(torrent.downloaded/1024/1024).toFixed(1)} MB`))
    torrent.on('done', () => console.log(`Download is done! Ready for streaming... http://${ip}:${frontendWebtorrentPort}`))
    server.listen(port)
    childProcess.fork('./front-end.js', [process.argv[3]])
  })
})()


