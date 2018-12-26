import {store} from '../lib/store'
import {Submit} from '../components/submit'
import {SubmitRecords} from '../components/submit-records'

export tag Admin
  def render
    return
      <self>
        <h1 css:margin="10px"> "Admin Panel"
        <SubmitRecords isAdmin=yes>