export tag SubmitRecords
  prop submits default: []
  prop page default: 1

  def setup
    crawl 1

  def crawl page
    window:$.ajax({url:"/api/submits?page={page}"}).done do |data|
      @submits = data:submits
      console.log data
      Imba.commit

  def render
    return 
      <self>
        <p>
          "jump to page"
          <input[page] :change.crawl(@page)>
        <table.table.table-striped>
          <thead.thead-dark>
            <tr>
              <th> "id"
              <th> "time"
              <th> "qid"
              <th> "score"
              <th> "runtime"
              <th> "state"
          <tbody>
            for submit in submits
              <tr>
                <td> submit:_id.slice(0,6)
                <td> submit:submit_time
                <td> submit:question_id
                <td> submit:score
                <td> submit:runtime
                <td> submit:state