var express = require 'express'
var config = require('../../config')(process:env.NODE_ENV)
process:config = config
let server = express()

console.log process:env.NODE_ENV
console.log process:config

server.use(express.static('./dist'))

server.get '/' do |req,res|
	var html = <html>
		<head>
			<title> "Imba - Hello World"
			<meta charset="utf-8">
			<link rel="stylesheet" href="/dist/index.css" media="screen">
		<body>
			<script src="/client.js">
	
	return res.send html.toString

var port = process:env.PORT or 8080

var server = server.listen(port) do
	console.log 'server is running on port ' + port
