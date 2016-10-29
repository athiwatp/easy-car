// The project is here: 
// https://github.com/codestar-work/easy-car

// npm install express ejs mysql multer
var express = require('express')
var app     = express()
var ejs     = require('ejs')
var multer  = require('multer')
var uploader= multer({dest: 'uploads/'})
app.listen(4000)
app.engine('html', ejs.renderFile)
app.get('/', showHomePage)
app.get('/search', showSearchPage)
app.get('/login', showLoginPage)
app.get('/post', showPostPage)
app.post('/login', uploader.single(), checkLogin)
app.use( express.static('public') )

function checkLogin(req, res) {
	// req.body.user
	// req.body.password
}

function showHomePage(req, res) {
	res.render('index.html')
}
function showSearchPage(req, res) {
	res.render('search.html')
}
function showLoginPage(req, res) {
	res.render('login.html')
}
function showPostPage(req, res) {
	res.render('post.html')
}