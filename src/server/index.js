var config = require('../../config')(process.env.NODE_ENV)
process.config = config
var express = require('express')
var app = express()
var port = process.config.PORT || 8080
var s = app.listen(port,()=>{ 
	console.log('server is running on port ' + port)
})
var server = require('http').createServer(app)
var io = require('socket.io').listen(s)
var bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const authInit = require('./auth')
const path = require('path')

const initExpress = client => {
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(session(process.config.passportSession))
	app.use(passport.initialize());
	app.use(passport.session());
	// console.log(__dirname)
	app.set('views', path.join(__dirname, '/views'));
	app.set('view engine', 'ejs') 
	app.all('/*:8081',(req,res,next)=>{
		res.header("Access-Control-Allow-Origin", "*")
		res.header("Access-Control-Allow-Headers", "X-Requested-With")
		res.header('Content-Type: application/json; charset=utf-8')
		next()
  })
	app.use(express.static('./dist'))
	app.get('/profile',(req,res)=>{
		if(!req.session.passport)
			res.redirect('/login')
		console.log(req.session)
		return res.send(req.session.passport.user.displayName)
  })
	app.get('/test', (req,res)=>{
		return res.render('test.ejs',{message: 'hi'})
  })
	authInit(app)
}

const initSocket = client => {
	io.sockets.on('connection', socket => {
		console.log('connected',socket.id)
		socket.emit('c','hi')
		socket.on('chatRoom', data => {
			console.log(data)
			io.sockets.emit('chatRoom', data)
    })
  })
}

const initMongo = async () => {
	let MongoClient = require('mongodb').MongoClient
	let uri = "mongodb://localhost:27017"
	const client = new MongoClient(uri, { useNewUrlParser: true })
	await new Promise((resolve,reject) => {
		client.connect(err=>{
			console.log(err||'no error connecting mongo')
			resolve(client)
    })
  })
	return client
}

// # console.log process:env.NODE_ENV
// # console.log process:config

const main = async ()=>{
	var client = await initMongo()
	initExpress(client)
	initSocket(client)
}

main()