const setupPurchaseRoutes = require("./purchase")

function setupItemsRoutes(app) {
  app.get('/items/:category_id', async (req, res) => {
    const rows = await connection.query(
      'SELECT * FROM `items` WHERE `category_id` = ?',
      [req.params.category_id]
    )
    res.setHeader('Content-Type', 'application/json')
    res.send(rows)
  })
}

module.exports = setupItemsRoutes
