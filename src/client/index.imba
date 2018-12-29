require 'imba-router'
var io = require 'socket.io-client'
var socket = io process:config.HOST
import {store} from './lib/store'
store:socket = socket
import {Index} from './page/index'
import {Profile} from './page/profile'
import {Admin} from './page/admin'
import {Questions,Question} from './page/questions'
import {Submit} from './components/submit'
import {NavBar} from './components/nav-bar'
# import {ScoreBoard} from './page/score-board'

import {alertHandler} from './lib/alert-handler'

store:user = window:user && window:user:user

if process:config.MODE === 'dev'
	console.log 'development mode is on'
	console.log process:config
	window:store = store
	console.log 'store is available to view at window.store'
	console.log 'store', store
	socket.on 'reload' do |data|
		console.log 'hot reloading...'
		console.log data
		Imba.setTimeout(1000) do
			window:location.reload

tag App		
	def render
		return
			<self>
				<NavBar>
				<div.container css:margin-top='10px'>
					<Index route='/'> 
					<Profile route='/profile'>
					<Submit route='/submit'>
					<Admin route='/admin'>
					<div route='/questions'>
						if window:qid !== undefined
							<Question qid=window:qid>
						else
							<Questions>


socket.on 'name' do |data|
	console.log data
socket.on 'alert' do |data|
	console.log data
	alertHandler data

Imba.mount <App>
