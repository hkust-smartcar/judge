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
    super("Time Limit Exceeded.");
  }
}

module.exports = { InvalidTypeError, RuntimeError, MemoryError, TimeError };
