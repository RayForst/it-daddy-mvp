const express = require('express')
const bodyPsarer = require('body-parser')

const app = express()
const htmlPath = `${__dirname}/static/`
const urlencodedParser = bodyPsarer.urlencoded({ extended: false })

app.get('/', (req, res) => {
  res.sendFile(`${htmlPath}/index.html`)
})

app.get('/our-work', (req, res) => {
  res.sendFile(`${htmlPath}/our-work.html`)
})

app.get('/our-work/:name', (req, res) => {
  res.sendFile(`${htmlPath}/project.html`)
})

app.get('/what-we-do', (req, res) => {
  res.sendFile(`${htmlPath}/what-we-do.html`)
})

app.get('/what-we-do/:name', (req, res) => {
  res.sendFile(`${htmlPath}/service.html`)
})

app.get('/contacts', (req, res) => {
  res.sendFile(`${htmlPath}/contacts.html`)
})

app.get('/about', (req, res) => {
  res.sendFile(`${htmlPath}/about-us.html`)
})

app.post('/contact', urlencodedParser, (req, res) => {
  if (!req.body) res.statusCode(404)
  console.log(req.body)
  res.sendFile(`${htmlPath}/contacts.html`)
})

app.use('/assets/images', express.static('static/assets/images'))
app.use('/img', express.static('static/img'))
app.use('/css', express.static('static/css'))
app.use('/js', express.static('static/js'))
app.use('/fonts', express.static('static/fonts'))

app.listen(3000)
