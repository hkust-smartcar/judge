require 'imba-router'
import {store} from './lib/store'
console.log store
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
	prop d
	def addItem
		data:items.push(title: data:title)
		data:title = ""
		
	def render
		<self.vbox>
			<header>
				<input[data:title] placeholder="New..." :keyup.enter.addItem>
				<button :tap.addItem> 'Add item'
				<button :click=(do d++)>
			<p>
				data:key

console.log window:user
Imba.mount <App[store] d=0>