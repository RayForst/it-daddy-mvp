const express = require('express')
const bodyPsarer = require('body-parser')
const robots = require('express-robots')
const nodemailer = require('nodemailer')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('config.json'))
const app = express()
const htmlPath = `${__dirname}/static/`
const urlencodedParser = bodyPsarer.urlencoded({ extended: false })

app.use(robots({ UserAgent: '*', Disallow: '/' }))

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'sergeikalpakov@gmail.com',
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refreshToken,
    accessToken: config.accessToken,
  },
})

app.use(express.static('static'))

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

  const HelperOptions = {
    from: '"It daddy" <admin@itdaddy.ca>',
    to: 'sergeikalpakov@gmail.com',
    subject: 'Contact form',
    text: 'Text from contact form',
  }

  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) console.log(error)
    else console.log('Success ', info)

    transporter.close()
  })

  res.json({
    type: 'success',
    message: 'Message Thank you for your message. It has been sent.',
    responseText: 'responseTExt Thank you for your message. It has been sent.',
    response: 'response Thank you for your message. It has been sent.',
  })
})

app.use('/assets/images', express.static('static/assets/images'))
app.use('/img', express.static('static/img'))
app.use('/css', express.static('static/css'))
app.use('/js', express.static('static/js'))
app.use('/fonts', express.static('static/fonts'))

app.listen(8000)
