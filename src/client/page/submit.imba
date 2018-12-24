export tag Submit
  def render
    return 
      <self>
        <iframe name="votar" style="display:none;">
        <form action="submit" method="post" enctype="multipart/form-data" target="votar">
          <input type="file" name="myfile">
          <button> "submit"
