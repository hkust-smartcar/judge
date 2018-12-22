export tag Submit
  def render
    return 
      <self>
        <form action="submit" method="post" enctype="multipart/form-data">
          <input type="file" name="myfile">
          <button> "submit"
