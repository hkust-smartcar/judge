import {store} from '../lib/store'
var moment = require('moment')
export tag SubmitRecords
  prop submits default: store:submits
  prop page default: 1
  prop isAdmin default: no
  prop useridfilter default: -1

  def setup
    crawl 1
    store:socket.on 'alert' do |data|
      if @page == 1
        if !data:subtask_id
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
  
  def viewDetails sid
    console.log('view details',sid)
    var sb = @submits.filter(|submit| submit:submission_id == sid )
    if sb:length==1
      sb=sb[0]
      if sb:execution
        window:$("#col{sid}").collapse('toggle')
      else
        window:$("#col{sid}").collapse()
        sb:execution = true

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
              <th> "ID"
              if @isAdmin
                <th> "UID"
              <th> "Start Time"
              <th> "End Time"
              <th> "Question"
              <th> "Score"
              <th> "Status"
              <th> "Details"
          <tbody>
            for submit in submits
              <tr>
                <td> submit:submission_id
                if @isAdmin
                  <td> submit:user_id
                <td> moment(submit:startTime).format 'YYYY-MM-DD HH:mm:ss'
                <td> moment(submit:endTime).format 'YYYY-MM-DD HH:mm:ss'
                <td> submit:question_id
                if submit:score == null
                  <td> submit:error
                else
                  <td> Math:round(100*submit:score)/100
                <td> submit:status
                <td>
                  <a.btn.btn-raised.btn-primary :tap.viewDetails(submit:submission_id) href="#col{submit:submission_id}"> "details"
              <tr.collapse id="col{submit:submission_id}">
                "veryLOOOOOOOOOOOOOOOOOOOOOOOOG"