
import {xd} from './xd'
import {xdd} from '../xdd'
var io = require 'socket.io-client'
var socket = io process:config.HOST
socket.on('c',console:log)
console.log(xd)
console.log(xdd)
console.log process:env
console.log 'xd'
console.log process:config
var store = {
	title: ""
	items: [
		{title: "git clone hello-world-imba"}
		{title: "npm install"}
		{title: "npm run dev"}
		{title: "yooooo"}
		{title: "{xd}"}
		{title: "{xdd}"}
		{title: "hi"}
	]
}

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
				<button :click=(do d++)> d
			<ul> for item in data:items
				<li> item:title


Imba.mount <App[store] d=0>