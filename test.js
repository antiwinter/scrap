import ava from 'ava'
import fs from 'fs'
import curse from './wowa/curse'
import _ from 'underscore'

const log = console.log

let ccc = 1
function nme(x) {
  return ccc++ + '-' + x
}

ava.serial.cb(nme('update'), t => {
  curse.fetch(data => {
    let n = data.length
    data = JSON.stringify(data, null, 2)
    fs.writeFileSync('wowa/db-curse.json', data, 'utf-8')
    log('wrote', n, 'records', `(${(data.length / 1024).toFixed(0)} KB)`)

    t.assert(n > 7000)
    t.assert(data.length > 800000)
    t.end()
  })
})

ava.serial.cb(nme('check'), t => {
  let data = JSON.parse(fs.readFileSync('wowa/db-curse.json', 'utf-8'))
  // log(data.length)

  t.assert(data.length > 7000)
  t.end()
})
