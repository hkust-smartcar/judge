var config = require("../../../../config")(process.env.NODE_ENV);
const Queue = require("bee-queue");
const exec = require("await-exec");
const { MemoryError, TimeError, RuntimeError } = require("./error");
const logger = require("../../logger")("queue");

const execCppQueue = new Queue("execCpp", {
  removeOnSuccess: true,
  removeOnFailure: true
});

execCppQueue.on("ready", () => {
  execCppQueue.process(config["queueCapacity"], async job => {
    let cmd = job.data.cmd;
    let input = job.data.input;

    let output = await exec(cmd.concat(" ").concat(input)).catch(err => {
      logger.error(err);
      if (err.stderr.includes("std::bad_alloc")) {
        // C++ returns std::bad_alloc if new operators can no longer allocate memory
        // malloc should be fine because if no memory can be allocated, malloc returns NULL and
        // does not throw exceptions.
        throw new MemoryError();
      } else if (err.code == 1) {
        // code 1 means firejail terminated the procedure => time limit exceeded
        throw new TimeError();
      } else {
        throw new RuntimeError();
      }
    });

    return output.stdout;
  });
});

module.exports = execCppQueue;
