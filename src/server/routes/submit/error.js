// This file contains classes of errors which can be thrown through executing submitted codes.

class InvalidTypeError extends Error {
  constructor() {
    super("Invalid Type Error");
  }
}

class RuntimeError extends Error {
  constructor() {
    super("Runtime Error");
  }
}

class MemoryError extends Error {
  constructor() {
    super("Memory Error");
  }
}

class TimeError extends Error {
  constructor() {
    super("Time Limit Exceeded");
  }
}

class CompilationError extends Error {
  constructor() {
    super("Compilation Error");
  }
}

class MissingFieldError extends Error {
  /**
   * `Missing ${whatField}`
   *
   * @param {String} whatField the missing field
   */
  constructor(whatField = "Some field") {
    super(`Missing ${whatField}`);
  }
}

class WrongInputFormat extends Error {
  constructor() {
    super(`Wrong Input Format`);
  }
}

module.exports = {
  InvalidTypeError,
  RuntimeError,
  MemoryError,
  TimeError,
  CompilationError,
  MissingFieldError,
  WrongInputFormat
};
