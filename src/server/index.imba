var config = require('../../config')(process:env.NODE_ENV)
process:config = config
var express = require('express')
var app = express()
var port = process:config.PORT or 8080
var s = app.listen(port) do
	console.log 'server is running on port ' + port
var server = require('http').createServer(app)
var io = require('socket.io').listen(s)
var bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const authInit = require('./auth')

def initExpress client
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(session(process:config:passportSession))
	app.use(passport.initialize());
	app.use(passport.session());
	# console.log self:__dirname
	# app.set('views', path.join(__dirname, '/src/server/views'));
	app.set('view engine', 'ejs') 
	app.all '/*:8081' do |req,res,next|
		res.header("Access-Control-Allow-Origin", "*")
		res.header("Access-Control-Allow-Headers", "X-Requested-With")
		res.header('Content-Type: application/json; charset=utf-8')
		next()
	app.use(express.static('./dist'))
	app.get '/profile' do |req,res|
		if(!req:session:passport)
			res.redirect('/login')
		console.log(req:session)
		return res.send(req:session:passport:user:displayName)
	app.get '/test' do |req,res|
		res.render('test.ejs',{message: 'hi'})
		
	authInit app

def initSocket client
	io:sockets.on 'connection', do |socket|
		console.log('connected',socket:id)
		socket.emit('c','hi')
		socket.on 'chatRoom'do |data|
			console.log(data)
			io.sockets.emit('chatRoom', data)

def initMongo
	let MongoClient = require('mongodb').MongoClient
	let uri = "mongodb://localhost:27017"
	const client = MongoClient.new(uri, { useNewUrlParser: true })
	await Promise.new do |resolve,reject|
		client.connect do |err|
			console.log(err||'no error connecting mongo')
			resolve client
	return client

# console.log process:env.NODE_ENV
# console.log process:config

def main
	var client = await initMongo
	initExpress client
	initSocket client

main