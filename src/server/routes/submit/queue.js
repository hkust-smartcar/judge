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
    switch (file.mimetype) {
      case "text/x-python":
        console.log("Handling a Python file.");
        // Commenting these for now because firejail is not yet available in host.
        /**
        let output = await exec(
          `firejail --overlay-tmpfs --quiet python ${file.path}`
        );

        console.log(`stdout: ${output.stdout}`);
        console.log(`stderr: ${output.stderr}`);

        if (output.stderr) return new Error("Runtime error");
        return output.stdout;

        **/
        return "done";

      default:
        return new Error("Invalid file type");
    }
  });
});
module.exports = jobQueue;
