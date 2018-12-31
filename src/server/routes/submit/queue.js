var config = require("../../../../config")(process.env.NODE_ENV);
const logger = require("../../logger")("queue");
const questions = require("../../../../questions.json");
const Queue = require("bee-queue");
const exec = require("await-exec");
const io = require("../../socket").getio();
const {
  InvalidTypeError,
  CompilationError,
  MissingFieldError
} = require("./error");

const jobQueue = new Queue("job", {
  removeOnSuccess: true,
  removeOnFailure: true
});

const { sec2str } = require("../helper");

const { upsertSubmission, saveExecution } = require("../schema");

const execPyQueue = require("./execPy");
const execCppQueue = require("./execCpp");
const evaluate = require("./grade");

jobQueue.on("ready", () => {
  jobQueue.process(config["queueCapacity"], async job => {
    if (!job.data.files) {
      throw new MissingFieldError("Submit Files");
    }
    let file = job.data.files[0];
    let user = job.data.user;
    let qid = job.data.question_id;

    let subtasks = questions[qid]["subtasks"];
    let memoryLim = questions[qid]["limits"]["memory"] * 1024 * 1024; // Memory limit in byte
    let timeLim = sec2str(questions[qid]["limits"]["time"] + 3); // Time Limit in hh:mm:ss, plus 3 seconds of startup

    logger.info(`Processing job ${job.id} with name ${file.originalname}`);
    let filetype = file.originalname.split(".").pop();

    let queue = undefined;
    let cmd = undefined;

    switch (filetype) {
      case "py": {
        logger.info("Handling a Python file.");
        /**
         * firejail: sandbox
         * --overlay-tmpfs: Overlay a temporary filesystem which does not affect the real one
         * --quiet: No messages from firejail itself
         * --noprofile: Do not look for any predesigned firejail profiles
         * --net=none: No internet access
         * --blacklist: Blacklist the solution file
         * --rlimit-as=: RAM limit in Bytes
         * --timeout=: Time out. For python, we need to add 3s for startup time.
         * python3: Run python3
         */
        cmd = `firejail --overlay-tmpfs --quiet --noprofile --net=none --blacklist=~/judge/questions.json --blacklist=~/Documents/git/judge/questions.json --rlimit-as=${memoryLim} --timeout=${timeLim} ${process.config.pythonPath} ${
          file.path
        }`;
        queue = execPyQueue;
        break;
      }

      case "cpp": {
        logger.info("Handling a C++ file.");
        await exec(`mv ${file.path} ${file.path}.cpp`);
        await exec(`g++ -std=c++11 ${file.path}.cpp -o ${file.path}`).catch(
          err => {
            throw new CompilationError();
          }
        ); // compilation
        await exec(`rm ${file.path}.cpp`);

        logger.info("C++ compiled.");
        cmd = `firejail --overlay-tmpfs --quiet --noprofile --net=none --blacklist=~/judge/questions.json  --blacklist=~/Documents/git/judge/questions.json --rlimit-as=${memoryLim} --timeout=${timeLim} ${
          file.path
        }`;
        queue = execCppQueue;
        break;
      }
      default:
        return new InvalidTypeError();
    }

    let processedDataset = 0; // count number of dataset completed per subtask
    let totalScore = 0; // total score achieved in this submission
    let totalDataset = subtasks // total number of datasets
      .map(s => s["dataset"].length)
      .reduce((acc, cur) => acc + cur);

    for (subtask of subtasks) {
      for (dataset of subtask["dataset"]) {
        let output = dataset["output"];
        let maxScore = dataset["points"];
        // Create job
        const execJob = queue.createJob({
          cmd, // exec command
          input: dataset["input"], //data input
          startTime: Date.now() // Job start time
        });

        // On job successful, emit socket
        execJob

          .on("succeeded", function(result) {
            processedDataset++;
            try {
              score = evaluate(
                result,
                output,
                questions[qid]["type"],
                maxScore
              );
              error = null;
            } catch (e) {
              score = null;
              error = e.message;
            }
            logger.info(
              `Completed job ${job.id}:${execJob.id} with input ${
                execJob.data.input
              }, output ${result}, expected ${output} and score ${score}.`
            );
            totalScore += score;
            let payload = {
              user_id: parseInt(user),
              submission_id: parseInt(job.id),
              job_id: parseInt(execJob.id),
              question_id: parseInt(qid),
              subtask_id: subtask["id"],
              status: "Completed",
              score,
              error,
              startTime: execJob.data.startTime,
              endTime: Date.now()
            };

            io.to(user).emit("alert", {
              type: "result",
              ...payload
            });

            saveExecution(payload);

            // if this is the last execution in the submission
            if (processedDataset === totalDataset) {
              let payload = {
                user_id: parseInt(user),
                submission_id: parseInt(job.id),
                question_id: parseInt(qid),
                status: "Completed",
                score: totalScore,
                startTime: job.data.startTime,
                endTime: Date.now()
              };
              io.to(user).emit("alert", {
                type: "result",
                ...payload
              });

              upsertSubmission(payload);
            }
          })

          // On job failure, emit socket
          .on("failed", err => {
            logger.info(`job failed with error ${err.message}.`);
            processedDataset++;
            let payload = {
              user_id: parseInt(user),
              submission_id: parseInt(job.id),
              job_id: parseInt(execJob.id),
              question_id: parseInt(qid),
              subtask_id: subtask["id"],
              status: "Completed",
              error: err.message,
              startTime: job.data.startTime,
              endTime: Date.now()
            };

            io.to(user).emit("alert", {
              type: "result",
              ...payload
            });

            saveExecution(payload);

            // if this is the last execution in the submission
            if (processedDataset === totalDataset) {
              let payload = {
                user_id: parseInt(user),
                submission_id: parseInt(job.id),
                question_id: parseInt(qid),
                status: "Completed",
                score: totalScore,
                startTime: execJob.data.startTime,
                endTime: Date.now()
              };
              io.to(user).emit("alert", {
                type: "result",
                ...payload
              });

              upsertSubmission(payload);
            }
          })

          .save();
      }
    }
  });
});
module.exports = jobQueue;
