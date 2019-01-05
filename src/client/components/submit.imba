import {snackbar} from '../lib/snackbar-factory'

export tag Submit
  prop qid default:0
  prop temp_disable default: no

  def submit
    @temp_disable = yes
    Imba.setTimeout 2000 do
      @temp_disable = no

  def validateFile e
    # console.log 'validate',e
    let files = e:_event:target:files
    if files:length >0
      let size = files[0]:size
      if size > (process:config:fileSizeLimit||100)*1000 # 100kb
        e:_event:target:value = ''
        snackbar 'File Size Exceed limit 100kb','alert'

  def render
    return 
      <self>
        <iframe name="votar" style="display:none;">
        <form action="/submit" method="post" enctype="multipart/form-data" target="votar">
          <div.row css:align-items="baseline">
            <div.col-sm.form-group>
              <label.bmd-label-floating for="question">
                "Question"
              <input.form-control[@qid] id="question" name="qid" type="number">
              <span.bmd-help> "hi"
            
            <div.col-sm>
              <input.btn type="file" name="myfile" :change.validateFile accept=".cpp,.py" required>
            <button.btn.btn-raised.btn-primary disabled=@temp_disable :tap.submit> "submit"
