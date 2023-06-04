const cool = require('cool-ascii-faces')
const { Pool } = require('pg')
const express = require('express')
const path = require('path')
const slider = require('./slider.json')

const PORT = process.env.PORT || 5001

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes())).get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/featuredSlider', (req, res) => res.json(slider))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

function showTimes() {
  const times = process.env.TIMES || 5
  let result = ''
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result
}