var config = require('../../config')(process:env.NODE_ENV)
process:config = config
var express = require('express')
var app = express()
var port = process:env.PORT or 8080
var s = app.listen(port) do
	console.log 'server is running on port ' + port
var server = require('http').createServer(app)
var io = require('socket.io').listen(s)
var bodyParser = require('body-parser')
app.use(express.static('./dist'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.all '/*:8081' do |req,res,next|
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "X-Requested-With")
	res.header('Content-Type: application/json; charset=utf-8')
	next()

io:sockets.on 'connection', do |socket|
	console.log('connected',socket:id)
	socket.emit('c','hi')
	socket.on 'chatRoom'do |data|
		console.log(data)
		io.sockets.emit('chatRoom', data)


console.log process:env.NODE_ENV
console.log process:config

app.get '/' do |req,res|
	var html = <html>
		<head>
			<title> "Imba - Hello World"
			<meta charset="utf-8">
			<link rel="stylesheet" href="/dist/index.css" media="screen">
		<body>
			<script src="/client.js">
	
	return res.send html.toString
