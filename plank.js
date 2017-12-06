#!/usr/bin/env node
const qrcodeTerminal = require('qrcode-terminal')

const {
  config,
  Contact,
  Room,
  Wechaty,
  log,
} = require('wechaty')

const bot = Wechaty.instance({ profile: config.default.DEFAULT_PROFILE })
bot
.on('scan', (url, code) => {
  if (!/201|200/.test(String(code))) {
    const loginUrl = url.replace(/\/qrcode\//, '/l/')
    qrcodeTerminal.generate(loginUrl)
  }
  console.log(`${url}\n[${code}] Scan QR Code in above url to login: `)
})
.on('logout'	, user => log.info('Bot', `${user} logouted`))
.on('error'   , e => log.info('Bot', 'error: %s', e))

/**
 * Global Event: login
 *
 * do initialization inside this event.
 * (better to set a timeout, for browser need time to download other data)
 */
.on('login', async function(user) {
  let msg = `${user} logined`

  log.info('Bot', msg)
  await this.say(msg)

  // msg = `setting to manageDingRoom() after 3 seconds ... `
  // log.info('Bot', msg)
  // await this.say(msg)
})

/**
 * Global Event: room-join
 */
 .on('room-join', (room, inviteeList, inviter) => {
   const nameList = inviteeList.map(c => c.name()).join(',')
   console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`)
 })
.on('message', async function(message) {
  const room    = message.room()
  const sender  = message.from()
  const content = message.content()

  console.log((room ? '[' + room.topic() + ']' : '')
              + '<' + sender.name() + ':' + sender.id + '>'
              + ':' + message.toStringDigest(),
  )
})
.start()
.catch(e => console.error(e))
