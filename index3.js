const express  = require("express")
const app = express()

const cors = require("cors")
app.use(cors())

app.get("/", (req, res) => {
    res.status(200).json({"Name": "Hi"})
})
app.listen(3000, () => {
    console.log("http://localhost:3000")
})