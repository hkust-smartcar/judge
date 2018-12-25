import {store} from '../lib/store'
import {Submit} from '../components/submit'
import {SubmitRecords} from '../components/submit-records'

export tag Profile
  def render
    return
      <self>
        <h1 css:margin="10px"> "Profile"
        <p> "Hello {store:user:displayName}, you may submit or view your works at here"
        <Submit>
        <SubmitRecords>