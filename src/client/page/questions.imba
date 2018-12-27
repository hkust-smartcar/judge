import {store} from '../lib/store'
import {Submit} from '../components/submit'

export tag Question
  prop qid
  prop question default: null

  def setup
    crawl @qid

  def crawl qid
    window:$.ajax({url: "/api/questions/{qid}"}).done do |data|
      @question = data
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
        <Submit qid=@qid>



export tag Questions
  def render
    return
      <self>
        <p>
          "questions" + @qid