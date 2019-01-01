import {store} from '../lib/store'
var upsert = require('../lib/upsert.js')
var moment = require('moment')

export tag SubmitRecords
  prop submits default: store:submits
  prop page default: 1
  prop exePage default: 1
  prop isAdmin default: no
  prop useridfilter default: -1
  prop qid_filter default: -1

  def setup
    crawl 1
    store:socket.on 'alert' do |data|
      if qid_filter != -1
        if qid_filter != data:question_id
          return
      if data:type == 'result'
        if @page == 1
          if data:subtask_id == undefined
            # console.log('b4',@submits,data)
            @submits = upsert(@submits, data, "submission_id")
            # console.log('ft',@submits)
        if data:subtask_id != undefined
          if @show == yes
            if data:submission_id == @sid
              if @exePage == 1
                @executions = upsert(@executions,data,"job_id")
      Imba.commit

    window:$("#modal").modal()
    @executions = []
    @show = no
    @exePage = 1
    @additionalResult = []
    @sid = 0

  def crawl page
    @page=Math.max(@page,1)
    var url = "/api/submits?page={@page}"
    if qid_filter != -1
      url += '&qid_filter='+qid_filter
    if @isAdmin
      if @useridfilter != -1
        url += '&userid=' + @useridfilter
      else
        url += '&all=true'
    window:$.ajax({url: url}).done do |data|
      @submits = data:submits
      # console.log data
      Imba.commit

  def crawlExe
    @exePage=Math.max(@exePage,1)
    var url = "/api/executions?submission_id={@sid}&page={@exePage}"
    window:$.ajax({url: url}).done do |data|
      @executions = data:executions
      Imba.commit
  
  def viewDetails sid, ar
    console.log('view details',sid)
    window:$("#modal").modal('toggle')
    @show = yes
    @sid = sid
    if(ar != undefined )
      @additionalResult = []
      for key in Object.keys(ar)
        @additionalResult.push({key: key, value: ar[key]})
    crawlExe sid,1

  def modalClose
    @show = no

  def nextPage
    @page++
    crawl @page

  def prevPage
    @page=Math.max(--@page,1)
    crawl @page

  def nextExePage
    @exePage++
    crawlExe @exePage

  def prevExePage
    @exePage=Math.max(--@exePage,1)
    crawlExe @exePage
  
  def render
    return 
      <self>
        <div.modal.fade id="modal">
          <div.modal-dialog role="document" css:max-width="100%">
            <div.modal-content>
              <div.modal-header>
                <h5.modal-title id="modalTitle"> "Execution Records of Submit {@sid}"
                <button.close data-dismiss="modal">
              <div.modal-body>
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

                <div css:display="flex" css:justify-content="space-between">
                  <p>
                    "Input Page Number"
                    <input[@exePage] :change.crawlExe(@sid,@exePage)>
                  <div>
                    <button.btn :tap.prevExePage> "Prev"
                    <button.btn :tap.nextExePage> "Next"
                <table.table>
                  <thead>
                    <tr>
                      <th> "ID"
                      <th> "Start Time"
                      <th> "End Time"
                      <th> "Score"
                      <th> "Status"
                  <tbody>
                    for exe in @executions
                      <tr>
                        <td> exe:job_id
                        <td> moment(exe:startTime).format 'YYYY-MM-DD HH:mm:ss'
                        <td> moment(exe:endTime).format 'YYYY-MM-DD HH:mm:ss'
                        if exe:score !=undefined
                          <td> exe:score
                        else
                          <td> exe:error
                        <td> exe:status
                  <button.btn :tap.prevExePage> "Prev"
                  <button.btn :tap.nextExePage> "Next"
              <div.modal-footer>
                <button.btn.btn-secondary data-dismiss="modal"> "Close"
        <p>
          "jump to page"
          <input[page] :change.crawl(@page)>
          if @isAdmin
            "filter userid(-1 for all)"
            <input[useridfilter] :change.crawl(@page)>
          <button.btn :tap.prevPage> "Prev"
          <button.btn :tap.nextPage> "Next"
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
                  <a.btn.btn-raised.btn-primary :tap.viewDetails(submit:submission_id, submit:additionalResult) href="#col{submit:submission_id}"> "details"
                  
        <button.btn :tap.prevPage> "Prev"
        <button.btn :tap.nextPage> "Next"