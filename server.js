const express = require('express')
const bodyPsarer = require('body-parser')
const nodemailer = require('nodemailer')
const favicon = require('serve-favicon')
const fs = require('fs')
const path = require('path')
const GoogleTokenProvider = require('refresh-token').GoogleTokenProvider

const config = JSON.parse(fs.readFileSync('config.json'))
const app = express()
const htmlPath = `${__dirname}/static/`
const urlencodedParser = bodyPsarer.urlencoded({ extended: false })

const tokenProvider = new GoogleTokenProvider({
  refresh_token: config.refreshToken,
  client_id: config.clientId,
  client_secret: config.clientSecret,
})

app.use(express.static('static'))

app.get('/our-work', (req, res) => {
  res.sendFile(`${htmlPath}/our-work.html`)
})

const whatWeDo = ['/web-development', '/organic-seo', '/social-media', '/ppc']

app.get('/what-we-do/:name', (req, res) => {
  if (whatWeDo.includes(`/${req.params.name}`)) {
    res.redirect(301, `/${req.params.name}`)
  }

  res.status(404).send()
})

app.get(whatWeDo, (req, res) => {
  console.log('test')
  res.sendFile(`${htmlPath}${req.path}.html`)
})

const organicSeoPages = ['/usability-audit', '/competitors-audit', '/plan-of-action', '/audit-plan']

app.get('/organic-seo/:name', (req, res) => {
  console.log(req.params.name, organicSeoPages.includes(`/${req.params.name}`))
  if (organicSeoPages.includes(`/${req.params.name}`)) {
    console.log('requires', req.params.name, `${htmlPath}${req.params.name}.html`)
    return res.sendFile(`${htmlPath}${req.params.name}.html`)
  }

  res.status(404).send()
})

app.get('/contacts', (req, res) => {
  res.sendFile(`${htmlPath}/contacts.html`)
})

app.get('/about', (req, res) => {
  res.sendFile(`${htmlPath}/about-us.html`)
})

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(`${__dirname}/sitemap.xml`)
})

app.get('/BingSiteAuth.xml', (req, res) => {
  res.sendFile(`${__dirname}/BingSiteAuth.xml`)
})

app.get('/robots.txt', (req, res) => {
  res.sendFile(`${__dirname}/robots.txt`)
})

app.post('/contact', urlencodedParser, (req, res) => {
  if (!req.body) res.statusCode(404)

  tokenProvider.getToken((err, token) => {
    // token will be a valid access token.

    if (!err) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          password: 'holyfuckagain',
          user: 'sergeikalpakov@gmail.com',
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          refreshToken: config.refreshToken,
          accessToken: token,
        },
      })

      const HelperOptions = {
        from: '"It daddy" <admin@itdaddy.ca>',
        to: config.mail,
        subject: 'New client!',
        text: `Text from contact form${JSON.stringify(req.body)}`,
        html: `<h1>Text from contact form</h1>
      <div>Client Name: ${req.body.name}</div>
      <div>Client Email: ${req.body.email}</div>
      <div>Client phone: ${req.body.phone}</div>
      <div>Company:: ${req.body.company}</div>
      <div>Message: ${req.body.message}</div>
      <div>Prefered Contact type: ${req.body.contactType}</div>
      <div>Prefered Contact time: ${req.body.contactTime}</div>
    `, // html body
      }

      transporter.sendMail(HelperOptions, (error, info) => {
        if (error) console.log(error)
        else console.log('Mail send Success')

        transporter.close()
      })

      res.json({
        type: 'success',
        response: 'Thank you for your message. It has been sent.',
      })
    } else {
      console.log(err)
    }
  })
})

app.use('/assets/images', express.static('static/assets/images'))
app.use('/img', express.static('static/img'))
app.use('/css', express.static('static/css'))
app.use('/js', express.static('static/js'))
app.use('/fonts', express.static('static/assets/fonts'))
app.use('/favicon', express.static('favicon'))
app.use(favicon(path.join(__dirname, '/', 'favicon.ico')))

app.get('*', (req, res) => {
  res.status(404).send()
})

app.listen(config.port)
