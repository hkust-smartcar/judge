const Queue = require("bee-queue");
const exec = require("await-exec");
const {
  InvalidTypeError,
  RuntimeError,
  MemoryError,
  TimeError,
  CompilationError
} = require("./error");

const execCppQueue = new Queue("execCpp", {
  removeOnSuccess: true,
  removeOnFailure: true
});

execCppQueue.on("ready", () => {
  execCppQueue.process(async job => {
    let cmd = job.data.cmd;
    let input = job.data.input;

    let output = await exec(cmd.concat(" ").concat(input)).catch(err => {
      console.log(err);
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
  });
});

module.exports = execCppQueue;