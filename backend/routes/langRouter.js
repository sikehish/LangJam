const express=require('express')
const langRouter= express.Router()
const { createLanguage }= require('../controllers/languageController')
const { checkAuth } = require('../middleware/checkAuth')

langRouter.route('/create-lang').post(checkAuth,createLanguage)

module.exports=langRouter