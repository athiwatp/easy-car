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
var approved= [ ]
app.listen(4000)
app.engine('html', ejs.renderFile)

app.get ('/', showHomePage)
app.get ('/search', showSearchPage)
app.get ('/login', showLoginPage)
app.get ('/post', showPostPage)
app.post('/post', uploader.single('photo'), savePost)
app.post('/login', uploader.single(), checkLogin)
app.get ('/profile', showProfilePage)
app.get ('/logout', showThankyouPage)
app.get ('/result', showSearchResult)
app.use( express.static('public') )
app.use( showError )

function showError(req, res, next) {
	res.status(404).render('error.html')
}

function showTime(req, res, next) {
	console.log(new Date())
	next()
}

function checkLogin(req, res) {
	pool.query(`select * from member
		where password = sha2(?, 512) and
			name = ?`,
		[req.body.password, req.body.user],
		(error, data) => {
			if (data.length == 0) {
				res.redirect("/login?Wrong Password")
			} else {
				var card = createCard()
				res.set('Set-Cookie', 'card='+card)
				approved[card] = data[0]
				res.redirect("/profile")
			}
		}
	)
}

function createCard() {
	return parseInt( Math.random() * 1000000000 )
}

function extractCard(req) {
	var cookie = req.get('cookie')
	if (cookie == null) cookie = ''
	cookie = cookie + ';'
	var start = cookie.indexOf('card=')
	if (start == -1) {
		return ''
	} else {
		var stop = cookie.indexOf(';', start)
		return cookie.substring(start + 5, stop)
	}
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
	var card = extractCard(req)
	if (approved[card]) {
		res.render('post.html')
	} else {
		res.redirect('/login')
	}
}

function showProfilePage(req, res) {
	var card = extractCard(req)
	if (approved[card]) {
		res.render('profile.html')
	} else {
		res.redirect('/login')
	}
}

function showThankyouPage(req, res) {
	var card = extractCard(req)
	delete approved[card]
	res.render('thankyou.html')
}

function savePost(req, res) {
	// req.body.topic
	var card = extractCard(req)
	if (approved[card]) {
		pool.query(`insert into product(topic, detail, make,
			model, submodel, year, color, mile, price,
			gas, owner) values(?,?,?,?,?,?,?,?,?,?,?)`,
			[req.body.topic, req.body.detail, req.body.brand,
			req.body.model, req.body.submodel, req.body.year,
			req.body.color, req.body.mile, req.body.price,
			req.body.gas, approved[card].id],
			(error, result) => {
				res.redirect('/profile')
			}
		)
	} else {
		res.redirect("/login")
	}
}

function showSearchResult(req, res) {
	pool.query(`select distinct * from product
		where detail like ?
	`, ['%' + req.query.data + '%'],
	(error, data) => {
		res.render('result.html', {data: data })
	})
}