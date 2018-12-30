let maxScoreHelper = require('../lib/maxscore-helper')
import {store} from '../lib/store'

export tag LeaderBoard
  def setup
    @page = 1
    @maxscores = []
    @qids = []
    crawl 1
    window:$.ajax({url: "/api/questions"}).done do |data|
      @qids = data.map(|d| d:id)
    store:socket.on "scoreboard" do
      crawl @page
    
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
              <th> "UID"
              <th> "Total"
              for q in @qids
                <th> q
          <tbody>
            for ms in  @maxscores
              <tr>
                <td> ms:_id
                <td> ms:totalScores
                for q in @qids
                  <td> ms:questions[q] || 0
