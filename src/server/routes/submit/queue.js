const Queue = require("bee-queue");
const exec = require("await-exec");
const {
  InvalidTypeError,
  RuntimeError,
  MemoryError,
  TimeError,
  CompilationError
} = require("./error");

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
      case "py": {
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
            throw new TimeError();
          } else {
            // check error message from python output
            let errMsg = err.stderr.split("\n")[
              err.stderr.split("\n").length - 2
            ];
            console.log(errMsg);
            // if message contains MemoryError, throw Memory Error
            if (errMsg.includes("MemoryError")) throw new MemoryError();
            // otherwise they are runtime errors
            else throw new RuntimeError();
          }
        });

        console.log(`stdout: ${output.stdout}`);
        return output.stdout;
      }

      case "cpp": {
        console.log("Handling a C++ file.");
        await exec(`mv ${file.path} ${file.path}.cpp`);
        await exec(`g++ -std=c++11 ${file.path}.cpp -o ${file.path}`).catch(
          err => {
            throw new CompilationError();
          }
        ); // compilation
        await exec(`rm ${file.path}.cpp`);

        console.log("C++ compiled.");

        let output = await exec(
          `firejail --overlay-tmpfs --quiet --noprofile --net=none --rlimit-as=134217728 --timeout=00:00:04 ${
            file.path
          }`
        ).catch(err => {
          console.log(err);
          let errMsg = err.stderr;
          if (err.stderr.includes("std::bad_alloc")) {
            // C++ returns std::bad_alloc if new operators can no longer allocate memory
            // malloc should be fine because if no memory can be allocated, malloc returns NULL and
            // does not throw exceptions.
            throw new MemoryError();
          } else if (err.code == 1) {
            // code 1 means firejail terminated the procedure => time limit exceeded
            throw new TimeError();
          } else {
            throw new MemoryError();
          }
        });

        console.log(`stdout: ${output.stdout}`);
        return output.stdout;
      }
      default:
        return new InvalidTypeError();
    }
  });
});
module.exports = jobQueue;
