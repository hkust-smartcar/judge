const Queue = require("bee-queue");
const exec = require("await-exec");
const { RuntimeError, MemoryError, TimeError } = require("./error");

const execPyQueue = new Queue("execPy", {
  removeOnSuccess: true,
  removeOnFailure: true
});

execPyQueue.on("ready", () => {
  execPyQueue.process(async job => {
    let cmd = job.data.cmd;
    let input = job.data.input;

    let output = await exec(cmd.concat(" ").concat(input)).catch(err => {
      // If no stderr => time limit exceeded
      if (err.stderr === "") {
        throw new TimeError();
      } else {
        // check error message from python output
        let errMsg = err.stderr.split("\n")[err.stderr.split("\n").length - 2];
        console.log(errMsg);
        // if message contains MemoryError, throw Memory Error
        if (errMsg.includes("MemoryError")) throw new MemoryError();
        // otherwise they are runtime errors
        else throw new RuntimeError();
      }
    });

    console.log(`stdout: ${output.stdout}`);
    return output.stdout;
  });
});

module.exports = execPyQueue;
