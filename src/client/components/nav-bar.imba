require 'imba-router'
import {store} from '../lib/store'

export tag NavBar
  def render
    <self.navbar>
      <a route-to='/'> "Judge"
      if store:user
        <a route-to='/profile'> "profile"
      else
        <a href="/login"> "login"
