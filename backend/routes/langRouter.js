const express=require('express')
const langRouter= express.Router()
const { createLanguage }= require('../controllers/languageController')
const { checkAuth } = require('../middleware/checkAuth')

langRouter.route('/create-lang').post(checkAuth,createLanguage)
langRouter.route('/all-lang').get(getAllLanguages)

module.exports=langRouter