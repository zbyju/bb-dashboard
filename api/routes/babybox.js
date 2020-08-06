const express = require('express')
const router = express.Router()
const validateToken = require('../helper/checkAuth').validateToken
const multer = require('multer')
const fs = require('fs')
const path = require('path')

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `../frontend/src/assets/uploads/${ req.body.babyboxName }/gallery/`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: (req, file, cb) => {
    if(req.body.name) {
      console.log("test")
      cb(null, req.body.name + path.extname(file.originalname))
    } else {
      cb(null, file.originalname)
    }
  }
})

const upload = multer({ storage })


router.get('/all', validateToken, async (req, res) => {
    let result
    try {
        result = await babyboxDto.find()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
router.get('/all/populate', validateToken, async (req, res) => {
    let result
    try {
        result = await babyboxDto.findAndPopulate()
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})
router.get('/:id', validateToken, async (req, res) => {
    let result
    try {
        result = await babyboxDto.findById(req.params.id)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.put('/:id', validateToken, async (req, res) => {
    console.log(req.body)
    let result
    try {
        result = await babyboxDto.findByIdAndUpdate(req.params.id, req.body)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.get('/name/:name', validateToken, async (req, res) => {
    let result
    try {
        result = await babyboxDto.findByName(req.params.name)
    } catch(err) {
        console.log(err)
        return res.status(500).send()
    }
    return res.json(result)
})

router.get('/:name/gallery', validateToken, (req, res) => {
  console.log("test")
  let files = []
  const path = `../frontend/src/assets/uploads/${ req.params.name }/gallery/`
  try {
    fs.readdirSync(path).forEach(file => {
      files.push(file)
    });
  } finally {
    res.json(files)
  }

})

router.post('/:id/gallery',
            validateToken,
            upload.single("image"),
            async (req, res) => {})

module.exports = router