let maxScoreHelper = require('../lib/maxscore-helper')
import {store} from '../lib/store'

export tag LeaderBoard
  def setup
    @page = 1
    @maxscores = []
    @qids = []
    @users = {}
    crawl 1
    window:$.ajax({url: "/api/questions"}).done do |data|
      @qids = data.map(|d| d:id)
    window:$.ajax({url: "/api/users"}).done do |data|
      data.forEach(|d| @users[d:user_id]=[d:displayName])
      Imba.commit
    store:socket.on "scoreboard" do |submit|
      # console.log submit
      crawl @page
      window:$.ajax({url: "/api/users?user_id={submit:user_id}"}).done do |data|
        data.forEach(|d| @users[d:user_id]=[d:displayName])
        Imba.commit
    
  def crawl page
    let url = "/api/maxscores/?all=true&page={page}"
    window:$.ajax({url: url}).done do |data|
      @maxscores = maxScoreHelper data:maxScores
      Imba.commit

  def render
    return
      <self>
        <h3> "LeaderBoard"
        # <p>
        #   "Input Page"
        #   <input[@page] :change.crawl(@page)>
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
                  <td> ms:questions[q] || 0
