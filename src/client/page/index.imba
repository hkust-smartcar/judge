import { store } from '../lib/store.imba'
import { Submit } from '../components/submit'

export tag Index
  def render
    return
      <self>
        <h1> "Online Judging System"
        if !store:user
          <p> "You are not currently logged in, please log in"
          <a.btn.btn-raised.btn-primary href="/login"> "login"
        else 
          <p> "Hello {store:user:displayName}, you may submit your works at here"
          <Submit>