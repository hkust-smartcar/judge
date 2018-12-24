const Queue = require("bee-queue");
const exec = require("await-exec");

const jobQueue = new Queue("job", {
  removeOnSuccess: true,
  removeOnFailure: true
});

jobQueue.on("ready", () => {
  jobQueue.process(async job => {
    console.log("processing job " + job.id);
    console.log(job.data.files);

    let file = job.data.files[0];
    // console.log(file.mimetype);
    if (file.mimetype === "text/plain") {
      if (file.originalname.match(".py")) {
        file.mimetype = "text/x-python";
      }
    }
    switch (file.mimetype) {
      // case "text/plain":
      case "text/x-python":
        console.log("Handling a Python file.");
        let output = await exec(
          `firejail --overlay-tmpfs --quiet --noprofile --net=none python ${
            file.path
          }`
        );

        console.log(`stdout: ${output.stdout}`);
        console.log(`stderr: ${output.stderr}`);

        if (output.stderr) return new Error("Runtime error");
        return output.stdout;

      default:
        console.log("invalid file type");
        return new Error("Invalid file type");
    }
  });
});
module.exports = jobQueue;
