require 'imba-router'
import {store} from '../lib/store'

export tag NavBar
  def render
    <self.navbar.navbar-expand-lg.navbar-dark.bg-primary.bd-navbar css:color="white">
      <a.navbar-brand route-to='/'> "Judge"
      if store:user:id
        <div>
          <a route-to='/submit'> "submit"
          <a route-to='/profile'> "profile"
          <a href="/logout"> "logout"
      else
        <a.nav-link href="/login"> "login"
