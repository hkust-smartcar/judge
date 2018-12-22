require 'imba-router'
import {store} from './lib/store'
import {Index} from './page/index'
import {Profile} from './page/profile'
import {ScoreBoard} from './page/score-board'
var io = require 'socket.io-client'
var socket = io process:config.HOST

if process:config.MODE === 'dev'
	console.log 'development mode is on'
	console.log process:config
	socket.on 'reload' do
		console.log 'hot reloading...'
		Imba.setTimeout(1000) do
			window:location.reload
		 
tag App		
	def render
		<self>
			<a route-to='/'> "Home"
			<a route-to='/profile'> "profile"
			<Index route='/'> 
			<Profile route='/profile'>
			<p>
				page

store:user = window:user
store:page = window:page || '/'
Imba.mount <App page>