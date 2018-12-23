require 'imba-router'
import {store} from '../lib/store'

export tag NavBar
  def render
    <self.navbar.navbar-expand-lg.navbar-dark.bg-primary.bd-navbar css:color="white">
      <a.navbar-brand route-to='/'> "Judge"
      if store:user
        <div.btn-group>
          <a.nav-link.dropdown-toggle id="buttonMenu1" data-toggle="dropdown">
            <img.avatar src=store:user:_json:picture>
            store:user:displayName
          <div.dropdown-menu >
            <a.dropdown-item route-to='/submit'> "submit"
            <a.dropdown-item route-to='/profile'> "profile"
            <a.dropdown-item href="/logout"> "logout"
      else
        <a.nav-link href="/login"> "login"
