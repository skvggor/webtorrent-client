const nunjucks = require('nunjucks')
const express = require('express')
const internalIp = require('internal-ip')
const http = require('http')
const cheerio = require('cheerio')
const site = express()
const webTorrentClientPort = process.env.WEBTORRENT_CLIENT_PORT || 3000
const port = process.env.FRONTEND_WEBTORRENT_PORT || 8080
const videoFormat = 'mp4'

const nunjucksConfig = {
  autoescape: true,
  express: site
}

site.use(express.static('subtitles'))
site.set('view engine', 'njk')
nunjucks.configure('views', nunjucksConfig)

;(async () => {
  const ip = await internalIp.v4()
  const torrentUrl = `http://${ip}:${webTorrentClientPort}`
  let body = ''

  await http.get(torrentUrl, res => {
    res.on('data', chunk => body += chunk)
    res.on('end', () => {
      const $ = cheerio.load(body)
      const videoUrl = $(`a[href$=".${videoFormat}"]:not([href*="sample"])`).attr('href')

      site.get('/', (req, res) => {
        res.render('pages/index', {
          videoUrl: `${torrentUrl}${videoUrl}`
        })
      })

      site.listen(port)
    })
  })
})()

