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
    const path = `${ config.storage.path }/${ req.body.babyboxName }/gallery/`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: (req, file, cb) => {
    const pathVar = `${ config.storage.path }/${ req.body.babyboxName }/gallery/`
    let originalFilename
    let extension = String(path.extname(file.originalname)).toLowerCase()
    if(req.body.name) {
      originalFilename = req.body.name + extension
    } else {
      originalFilename = file.originalname
    }
    let index = 0
    let filename = originalFilename
    while(fs.existsSync(pathVar + filename)) {
      ++index
      filename = `(${ index }) - ${ originalFilename }`
    }
    cb(null, filename)
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
  const path = `${appRoot}/uploads/${ req.params.name }/gallery/`
  try {
    fs.readdirSync(path).forEach(file => {
      if(file.includes('.')) {
        files.push({
          path: `uploads/${ req.params.name }/gallery/${ file }`,
          filename: file,
          name: file.split('.')[0],
          extension: file.split('.').pop()
        })
      }
    });
  } finally {
    res.json(files)
  }
})

router.get('/:name/backgroundImage', validateToken, (req, res) => {
  let backgroundImage
  let files = []
  const path = `${appRoot}/uploads/${ req.params.name }/gallery/background/`
  try {
    fs.readdirSync(path).forEach(file => {
      files.push({
        path: `uploads/${ req.params.name }/gallery/background/${ file }`,
        filename: file
      })
    });
  } finally {
    if(files.length == 0) {
      backgroundImage = {
        path: `uploads/background/defaultBabyboxBackground.jpg`,
        filename: "defaultBabyboxBackground.jpg"
      }
    } else {
      backgroundImage = files[0]
    }
    res.json(backgroundImage)
  }
})

router.delete('/:name/gallery', validateToken, (req, res) => {
  const path = `${appRoot}/uploads/${ req.params.name }/gallery/${ req.body.image.filename }`
  try {
    fs.unlinkSync(path)
    res.json({ msg: "ok" })
  } catch(err) {
    console.error(err)
    res.status(500).json({msg: err})
  }
})

router.put('/:name/gallery', validateToken, (req, res) => {
  const oldPath = `${appRoot}/uploads/${ req.params.name }/gallery/${ req.body.image.filename }`
  const backgroundFolder = `${appRoot}/uploads/${ req.params.name }/gallery/background`
  const newPath = `${backgroundFolder}/backgroundImage`

  try {
    fs.mkdirSync(backgroundFolder, { recursive: true })
    fs.unlinkSync(newPath)
  } catch(err) {}

  try {
    fs.copyFileSync(oldPath, newPath)
    res.json({ msg: "ok" })
  } catch(err) {
    console.error(err)
    res.status(500).json({msg: err})
  }
})

router.post('/:id/gallery',
            validateToken,
            upload.single("image"),
            async (req, res) => {
              res.status(200).json({msg: "ok"})
})

module.exports = router
