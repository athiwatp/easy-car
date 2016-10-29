// The project is here: 
// https://github.com/codestar-work/easy-car

// npm install express ejs mysql multer
var express = require('express')
var app     = express()
var ejs     = require('ejs')
var multer  = require('multer')
var uploader= multer({dest: 'uploads/'})
var mysql   = require('mysql')
var database= {
	connectionLimit: 100,
	user: 'vin',
	password: 'diesel',
	host: '127.0.0.1',
	database: 'easy_car'
}
var pool    = mysql.createPool(database)
app.listen(4000)
app.engine('html', ejs.renderFile)
app.get('/', showHomePage)
app.get('/search', showSearchPage)
app.get('/login', showLoginPage)
app.get('/post', showPostPage)
app.post('/login', uploader.single(), checkLogin)
app.use( express.static('public') )

function checkLogin(req, res) {
	pool.query(`select * from member
		where password = sha2(?, 512) and
			name = ?`,
		[req.body.password, req.body.user],
		(error, data) => {
			if (data.length == 0) {
				res.redirect("/login?Wrong Password")
			} else {
				res.redirect("/")
			}
		}
	)
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