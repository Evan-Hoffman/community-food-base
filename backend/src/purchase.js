async function setupPurchaseRoutes(app) {
  app.post('/purchase/:customer_id/:item_id', async (req, res) => {
    const result = await connection.query(
      'INSERT INTO `orders` (`customer_id`, `item_id`) VALUES (?, ?)',
      [req.params.customer_id, req.params.item_id]
    )
    console.log(`Customer ${req.params.customer_id} purchased ${req.params.item_id}`)
    res.send(`Created order successfully`)
  })

  app.get('/purchase/:customer_id', async (req, res) => {
    const rows = await connection.query(
      'SELECT * FROM `orders` WHERE `customer_id` = ?', [req.params.customer_id]
    )
    res.setHeader('Content-Type', 'application/json')
    res.send(rows)
  })

  app.delete('/purchase/:customer_id', async (req, res) => {
    const result = await connection.query(
      'DELETE FROM `orders` WHERE `customer_id` = ?', [req.params.customer_id]
    )
    if (result.affectedRows === 0) {
      res.status(400).send('No orders found')
      return
    }
    // success
    res.send(`Deleted ${result.affectedRows} orders`)
  })

  app.put('/purchase/:customer_id', async (req, res) => {
    await connection.query(
      'UPDATE `users` SET `confirmed_purchase` = 1 WHERE `id` = ?',
      [req.params.customer_id]
    )
    res.send('Confirmed purchase')
  })
}

module.exports = setupPurchaseRoutes
