const express = require('express')
const router = express.Router()
const validateToken = require('../helper/checkAuth').validateToken
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

let Babybox = require('../models/babybox')
let babyboxDto = require('../dto/babyboxDto')

let config = require('../config/config')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Storage path", config.storage.path)
    const path = `${ config.storage.path }/${ req.body.babyboxName }/gallery/`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: (req, file, cb) => {
    if(req.body.name) {
      let extension = String(path.extname(file.originalname)).toLowerCase()
      cb(null, req.body.name + extension)
    } else {
      cb(null, file.originalname)
    }
  }
})

const upload = multer({ storage })


router.get('/all', validateToken, async (req, res) => {
  console.log(config.storage.path)
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
    let result
    try {
      result = await babyboxDto.findByIdAndUpdate(req.params.id, req.body)
    } catch(err) {
      console.log(err)
      return res.status(500).send()
    }
    return res.json(result)
})

router.delete('/contact/:id', validateToken, async (req, res) => {
  let result
  try {
    let index = _.findIndex(req.body.babybox.contacts, ['_id', req.body.contact._id]);
    if(index != 1) {
      req.body.babybox.contacts.splice(index, 1)
      result = await babyboxDto.findByIdAndUpdate(req.params.id, req.body.babybox)
    } else {
      return res.status(400).send()
    }
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