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
        <p> "The Online Judging System supports C++ and Python submissions, and currently only hosted for corner detection challenge problems, and there maybe other question types in the future. Here are some points you need to notice:"
        <ol>
          <li> "C++ compiler: g++11"
          <li> "Python version: 3.6.7"
          <li> "One file for each submittsion"
          <li> "Source code upload cannot exceed 100kb as file size"
          <li> "You code is runned by passing argument list"
          <li> "You code is graded by reading the standard output"
          <li> "Each problem has its own runtime limit and memory limit, please refer to question page"
          <li> "No new line character at the output, this can lead to incorrect answer"
          <li> "If there is any problem with this judging system, please contact Dipsy"

        <LeaderBoard>