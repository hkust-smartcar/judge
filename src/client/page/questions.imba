import {store} from '../lib/store'
import {Submit} from '../components/submit'
import {SubmitRecords} from '../components/submit-records'
var prism = require('prismjs')
require('prismjs/components/prism-python')
require('prismjs/components/prism-clike')

export tag Question
  prop qid
  prop question default: null

  def setup
    crawl @qid

  def crawl qid
    window:$.ajax({url: "/api/questions/{qid}"}).done do |data|
      @question = data
      @pyhtml = Prism.highlight(data:code:python, Prism:languages:python, 'python')
      @cpphtml = Prism.highlight(data:code:cpp, Prism:languages:clike, 'clike')
      Imba.commit

  def render
    return
      <self>
        if question
          <h1> "Question {@question:id} - {@question:name}"
          <h5> "Type - {@question:type}"
          <h3> "Descriptions"
          for description in @question:descriptions
            <p> description
          <h3> "Limits"
          <p>
            <b> "Memory: "
            @question:limits:memory+'MB'
          <p>
            <b> "Time: "
            @question:limits:time+'s'
          <h3> "Input"
          <p> @question:input
          <h3> "Output"
          <p> @question:output
          <h3> "Examples"
          <table.table>
            <thead>
              <tr>
                <th> "Input"
                <th> "Output"
                <th> "Explanation"
            <tbody>
              for ex in @question:examples
                <tr>
                  <td> ex:input
                  <td> ex:output
                  <td> ex:explanation
          if question:subtasks
            <h3> "Subtasks"
            <table.table>
              <thead>
                <th> "Constraints"
                <th> "Points"
              <tbody>
                for st in question:subtasks
                  <tr>
                    <td>
                      for con in st:constraints
                        <p> con
                    <td> st:points
        <h3> "Sample Code"
        <h5> "Python"
        <pre>
          <code html=@pyhtml>
        <h5> "C++"
        <pre>
          <code html=@cpphtml>
        if store:user
          <Submit qid=@qid>
          <SubmitRecords qid_filter=@qid>
        else
          <p> "Please login to submit"
          <a.btn.btn-raised.btn-primary href="/login"> "Login"



export tag Questions
  prop questions default:[]
  def setup
    window:$.ajax({url:'/api/questions'}).done do |data|
      @questions = data
      Imba.commit
  def render
    return
      <self>
        <h1> "Questions"
        <table.table>
          <thead>
            <tr>
              <th> "ID"
              <th> "Name"
              <th> "Type"
              <th> "Memory"
              <th> "Time"
              <th> "Score"
              <th> "More"
          <tbody>
            for q in @questions
              <tr>
                <td> q:id
                <td> q:name
                <td> q:type
                <td> q:limits:memory + 'MB'
                <td> q:limits:time + 's'
                <td> q:subtasks.reduce(&,0) do |prev,currv,k|
                  prev+currv:points
                <td> <a.btn.btn-raised.btn-primary href="/questions/{q:id}"> "more"