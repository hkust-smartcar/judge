require 'imba-router'
import {store} from '../lib/store'

export tag NavBar
  def render
    <self.navbar>
      <a route-to='/'> "Judge"
      <div>
        if store:user
          <a route-to='/submit'> "submit"
          <a route-to='/profile'> "profile"
        else
          <a href="/login"> "login"
