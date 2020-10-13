"use strict"

const app = require("../app.js")
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("Bajigur App listening at http://localhost:" + port)
})