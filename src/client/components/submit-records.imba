export tag SubmitRecords
  prop submits default: []
  prop page default: 1
  prop isAdmin default: no
  prop useridfilter default: -1

  def setup
    crawl 1

  def crawl page
    var url = "/api/submits?page={page}"
    if @isAdmin
      if @useridfilter != -1
        url += '&userid=' + @useridfilter
      else
        url += '&all=true'
    window:$.ajax({url: url}).done do |data|
      @submits = data:submits
      console.log data
      Imba.commit

  def render
    return 
      <self>
        <p>
          "jump to page"
          <input[page] :change.crawl(@page)>
          if @isAdmin
            "filter userid(-1 for all)"
            <input[useridfilter] :change.crawl(@page)>
        <table.table.table-striped>
          <thead.thead-dark>
            <tr>
              <th> "id"
              if @isAdmin
                <th> "uid"
              <th> "time"
              <th> "qid"
              <th> "score"
              <th> "runtime"
              <th> "state"
          <tbody>
            for submit in submits
              <tr>
                <td> submit:_id.slice(0,6)
                if @isAdmin
                  <td> submit:user_id
                <td> submit:submit_time
                <td> submit:question_id
                <td> submit:score
                <td> submit:runtime
                <td> submit:state