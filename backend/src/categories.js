function setupCategoriesRoutes(app) {
  app.get('/categories', async (req, res) => {
    const rows = await connection.query('SELECT * FROM `categories`')
    res.setHeader('Content-Type', 'application/json')
    res.send(rows)
  })
}

module.exports = setupCategoriesRoutes
