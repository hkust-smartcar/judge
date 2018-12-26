export tag Submit
  def render
    return 
      <self>
        <iframe name="votar" style="display:none;">
        <form action="submit" method="post" enctype="multipart/form-data" target="votar">
          <div.row css:align-items="baseline">
            <div.col-sm.form-group>
              <label.bmd-label-floating for="question">
                "Question"
              <input.form-control id="question" name="qid" value="0" disabled=true>
              <span.bmd-help> "hi"
            
            <div.col-sm>
              <input.btn type="file" name="myfile">
            <button.btn.btn-raised.btn-primary> "submit"
