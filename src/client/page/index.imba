import { store } from '../lib/store.imba'
import { Submit } from '../components/submit'
import { LeaderBoard } from '../components/leader-board'

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
        <h3> "About"
        <p> "The Online Judging System supports C++ and Python submissions, and currently the only question hosted is the Corner Detection Challenge. There might be more questions coming in the future. Here are some points you need to notice:"
        <ol>
          <li> "C++ codes are compiled with g++ 7.3.0 with --std=c++11 flag."
          <li> "Python codes are run with Python version 3.6.7."
          <li> "If you use Python, you may use the following libraries: numpy 1.14.3, opencv 3.4.1, pillow 5.1.0 and skimage 0.13.1."
          <li> "One file only per submission."
          <li> "Maximum file size allowed is 100 KB."
          <li> "Read inputs through argument list."
          <li> "Print outputs through STDOUT."
          <li> "Each problem has its own time and memory limit, refer to question page for details."
          <li> "Strip all line break characters in your output. Otherwise, it may be treated as incorrect."
          <li> "If there is any problem with this judging system, please contact Dipsy."

        <LeaderBoard isAdmin=yes>