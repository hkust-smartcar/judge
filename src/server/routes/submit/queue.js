const Queue = require("bee-queue");
const exec = require("await-exec");

const jobQueue = new Queue("job", {
  removeOnSuccess: true,
  removeOnFailure: true
});

jobQueue.on("ready", () => {
  jobQueue.process(async job => {
    let file = job.data.files[0];
    console.log(`Processing job ${job.id} with name ${file.originalname}`);
    let filetype = file.originalname.split(".").pop();

    switch (filetype) {
      case "py":
        console.log("Handling a Python file.");

        /**
         * firejail: sandbox
         * --overlay-tmpfs: Overlay a temporary filesystem which does not affect the real one
         * --quiet: No messages from firejail itself
         * --noprofile: Do not look for any predesigned firejail profiles
         * --net=none: No internet access
         * --rlimit-as=: RAM limit in Bytes
         * --timeout=: Time out. For python, we need to add 3s for startup time.
         * python3: Run python3
         */
        let output = await exec(
          `firejail --overlay-tmpfs --quiet --noprofile --net=none --rlimit-as=134217728 --timeout=00:00:04 python3 ${
            file.path
          }`
        ).catch(err => {
          // If no stderr => time limit exceeded
          if (err.stderr === "") {
            throw new Error("Time Limit Exceeded");
          } else {
            // check error message from python output
            let errMsg = err.stderr.split("\n")[
              err.stderr.split("\n").length - 2
            ];
            console.log(errMsg);
            // if message contains MemoryError, throw Memory Error
            if (errMsg.includes("MemoryError")) throw new Error("Memory Error");
            // otherwise they are runtime errors
            else throw new Error("Runtime Error");
          }
        });

        console.log(`stdout: ${output.stdout}`);
        return output.stdout;

      default:
        return new Error("Invalid File Type");
    }
  });
});
module.exports = jobQueue;
