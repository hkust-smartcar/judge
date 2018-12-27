import {store} from '../lib/store'
import {Submit} from '../components/submit'

export tag Question
  prop qid
  def render
    return
      <self>
        "single question"

export tag Questions
  def render
    return
      <self>
        <p>
          "questions" + @qid