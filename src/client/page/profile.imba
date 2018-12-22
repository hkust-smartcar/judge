import {store} from '../lib/store'

export tag Profile
  def render
    return
      <self>
        "profile"
        JSON.stringify(store)