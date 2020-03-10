const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')
const morgan = require('morgan')
const shortid = require('shortid')
const fs = require('fs')
const upload = multer({ storage: multer.diskStorage({
  destination: (req,file,cd) =>{
    cd(null, __dirname + '/public/uploads/')
  },
  filename: (req, file, cb) =>{
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, shortid.generate() + '.' + extension)
  }
})
})


//set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// use
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))

// get upload page
app.get('/upload', (req,res) =>{
  res.render('upload')
})

// handling image post request 
app.post('/upload' ,(req, res) => {
  upload.single('image')(req,res, (err) => {
    if(err) return res.render('upload', { error: err.message })
    if(!req.file) return res.render('upload', { error : 'Please Enter a file' })
    const type = req.file.mimetype

    if(type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg' || type === 'image/gif'){
      res.render('thanks')
      console.log(req.file.filename.split('.')[0])
    }else{
      try{
        fs.unlinkSync(__dirname + `/public/uploads/${req.file.filename}`)
        res.render('upload', { error: 'invalid file type' })
      }catch(err){
        console.log(err)
      }
    }
  })

})

app.listen(5000,() => console.log("Server running on localhost 5000"))
