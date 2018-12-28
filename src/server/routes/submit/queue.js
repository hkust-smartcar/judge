const questions = require("../../../../questions.json");
const Queue = require("bee-queue");
const exec = require("await-exec");
const io = require("../../socket").getio();
const client = require("../../mongo").getdb();
const {
  InvalidTypeError,
  RuntimeError,
  MemoryError,
  TimeError,
  CompilationError,
  MissingFieldError
} = require("./error");

const jobQueue = new Queue("job", {
  removeOnSuccess: true,
  removeOnFailure: true
});

const execPyQueue = require("./execPy");
const execCppQueue = require("./execCpp");
const evaluate = require("./grade");

jobQueue.on("ready", () => {
  jobQueue.process(async job => {
    if (!job.data.files) {
      throw new MissingFieldError("Submit Files");
    }
    let file = job.data.files[0];
    let user = job.data.user;
    let qid = job.data.question_id;

    let subtasks = questions[qid]["subtasks"];

    console.log(`Processing job ${job.id} with name ${file.originalname}`);
    let filetype = file.originalname.split(".").pop();

    let queue = undefined;
    let cmd = undefined;

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
        cmd = `firejail --overlay-tmpfs --quiet --noprofile --net=none --rlimit-as=134217728 --timeout=00:00:04 python3 ${
          file.path
        }`;
        queue = execPyQueue;
        break;
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
        cmd = `firejail --overlay-tmpfs --quiet --noprofile --net=none --rlimit-as=134217728 --timeout=00:00:04 ${
          file.path
        }`;
        queue = execCppQueue;
        break;
      }
      default:
        return new InvalidTypeError();
    }

    for (subtask of subtasks) {
      for (dataset of subtask["dataset"]) {
        let output = dataset["output"];
        let maxScore = dataset["points"];
        console.log(
          `Handling input ${dataset["input"]} with output ${dataset["output"]}`
        );
        // Create job
        const execJob = queue.createJob({
          cmd,
          input: dataset["input"]
        });

        // On job successful, emit socket
        execJob

          .on("succeeded", function(result) {
            console.log("completed job " + job.id + " result ", result);
            io.to(user).emit("alert", {
              type: "result",
              submission_id: job.id,
              job_id: execJob.id,
              question_id: parseInt(qid),
              subtask_id: subtask["id"],
              status: "Completed",
              score: evaluate(result, output, questions[qid]["type"], maxScore)
            });
          })

          // On job failure, emit socket
          .on("failed", err => {
            console.log(`job failed with error ${err.message}.`);
            io.to(user).emit("alert", {
              type: "result",
              submission_id: job.id,
              job_id: execJob.id,
              question_id: parseInt(qid),
              subtask_id: subtask["id"],
              status: "Completed",
              error: err.message
            });
          })

          .save();
      }
    }
  });
});
module.exports = jobQueue;
