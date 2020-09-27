function setupDeliveriesRoutes(app) {
  app.get('/deliveries', async (req, res) => {
    const rows = await connection.query(
      'SELECT `id` FROM `users` WHERE `confirmed_purchase` = 1'
    )
    res.setHeader('Content-Type', 'application/json')
    res.send(rows)
  })
}

module.exports = setupDeliveriesRoutes
