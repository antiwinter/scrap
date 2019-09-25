const g = require('got')
const _ = require('underscore')
const log = console.log

let data = []
let index = 0

let api = {
  $srl: 'https://addons-ecs.forgesvc.net/api/v2/addon',

  search(index, done) {
    let qs = `${api.$srl}/search?gameId=1&index=${index}&pageSize=255&searchFilter=&sort=3`

    // log('searching', qs)
    g.get(qs)
      .then(res => {
        // log(res.body)
        done(res ? JSON.parse(res.body) : null)
      })
      .catch(err => {
        done()
      })
  },

  fetch(done) {
    log('fetching page', index / 255)
    api.search(index, res => {
      log('ack')
      if (!res) {
        log('error xx')
        done(data)
      } else {
        res = res.map(x => {
          let d = {
            id: x.id,
            name: x.name,
            key: x.slug,
            dir: [],
            source: 'curse',
            mode: _.uniq(x.latestFiles, l => l.gameVersionFlavor)
              .map(l => (l.gameVersionFlavor === 'wow_classic' ? 2 : 1))
              .reduce((a, b) => a | b, 0)
          }

          x.latestFiles.forEach(l => {
            d.dir = _.union(d.dir, l.modules.map(m => m.foldername))
          })

          // if (!_.find(x.latestFiles, f => f.releaseType === 1))
          //   log('!!! no 1 /', res.length, x)

          // if (
          //   _.find(x.latestFiles, f => f.releaseType > 3 || f.releaseType < 1)
          // )
          //   log('!!! >>> /', res.length, x)

          // let beta = _.filter(x.latestFiles, f => f.releaseType < 3)
          // if (!beta) log('!!! no formal', x)

          return d
        })

        // log('got', res.length)

        data = data.concat(res)
        if (res.length < 255) {
          // log('????')
          done(data)
          return
        }

        index += 255
        api.fetch(done)
      }
    })
  }
}

module.exports = api
