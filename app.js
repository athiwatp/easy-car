// The project is here: 
// https://github.com/codestar-work/easy-car

// npm install express ejs mysql multer
var express = require('express')
var app     = express()
var ejs     = require('ejs')
app.listen(4000)
app.engine('html', ejs.renderFile)
app.get('/', showHomePage)
app.get('/search', showSearchPage)
app.get('/login', showLoginPage)
app.get('/post', showPostPage)
app.use( express.static('public') )

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