let maxScoreHelper = require('../lib/maxscore-helper')
import {store} from '../lib/store'

export tag LeaderBoard
  prop isAdmin default: false
  def setup
    @page = 1
    @maxscores = []
    @qids = []
    @users = {}
    @bestAttempt = ''
    @additionalResult=[]
    crawl 1
    window:$.ajax({url: "/api/questions"}).done do |data|
      @qids = data.map(|d| d:id)
    window:$.ajax({url: "/api/users"}).done do |data|
      data.forEach(|d| @users[d:user_id]=d:displayName)
      Imba.commit
    store:socket.on "scoreboard" do |submit|
      console.log "onscoreboard",submit
      crawl @page
      window:$.ajax({url: "/api/users?user_id={submit:user_id}"}).done do |data|
        data.forEach(|d| @users[d:user_id]=d:displayName)
        console.log(@users)
        Imba.commit
    
  def crawl page
    let url = "/api/maxscores/?all=true&page={page}"
    window:$.ajax({url: url}).done do |data|
      @maxscores = maxScoreHelper data:maxScores
      Imba.commit

  def viewDetail user_id, question_id
    let url = "/api/best-attempts?user_id={user_id}&question_id={question_id}"
    window:$("#modal").modal('toggle')
    window:$.ajax({url: url}).done do |data|
      @bestAttempt = data
      @additionalResult = []
      if typeof(data:additionalResult) === typeof({})
        for key in Object.keys(data:additionalResult)
          @additionalResult.push({key: key, value: data:additionalResult[key]})


  def render
    return
      <self>
        <h3> "LeaderBoard"
        <div.modal.fade id="modal">
          <div.modal-dialog role="document">
            <div.modal-content>
              <div.modal-header>
                <h5.modal-title id="modalTitle"> "Submission Details"
                <button.close data-dismiss="modal">
              <div.modal-body>
                if @bestAttempt:message
                  <div> @bestAttempt:message
                else
                  <div> "user id: {@bestAttempt:user_id}"
                  <div> "question id: {@bestAttempt:question_id}"
                  <div> "Start Time: {@bestAttempt:startTime}"
                  <div> "Status: {@bestAttempt:status}"
                  <div> "End Time: {@bestAttempt:endTime}"
                  <div> "Score: {@bestAttempt:score}"
                  <div>
                    if @additionalResult
                      <table.table>
                        <thead>
                          <tr>
                            for ar in @additionalResult
                              <th> ar:key
                        <tbody>
                          <tr>
                            for ar in @additionalResult
                              <td> ar:value
              <div.modal-footer>
                <button.btn.btn-secondary data-dismiss="modal"> "Close"
        <table.table>
          <thead>
            <tr>
              <th> "Rank"
              <th> "UID"
              <th> "Name"
              <th> "Total"
              for q in @qids
                <th> "Question {q}"
          <tbody>
            for ms,k in  @maxscores
              <tr>
                <td> k+1
                <td> ms:user_id
                <td> @users[ms:user_id]
                <td> ms:totalScores
                for q in @qids
                  if !isAdmin
                    <td> ms:questions[q] || 0
                  else
                    <td :tap.viewDetail(ms:user_id, q)> ms:questions[q] || 0
