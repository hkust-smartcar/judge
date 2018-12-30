export tag Submit
  prop qid default:1
  prop temp_disable default: no

  def submit
    @temp_disable = yes
    Imba.setTimeout 2000 do
      @temp_disable = no

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
              <input.btn type="file" name="myfile">
            <button.btn.btn-raised.btn-primary disabled=@temp_disable :tap.submit> "submit"
