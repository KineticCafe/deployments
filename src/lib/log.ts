import { setFailed } from '@actions/core'

export default class Logger {
  private debugLogs: boolean

  constructor(options: { debug: boolean }) {
    this.debugLogs = options.debug
  }

  info(message: string | unknown, ...optionals: unknown[]) {
    console.log(message, ...optionals)
  }

  debug(message: string | unknown, ...optionals: unknown[]) {
    if (this.debugLogs) {
      console.warn(message, ...optionals)
    }
  }

  fail(message: string | unknown, ...optionals: unknown[]) {
    console.error(message, ...optionals)
    setFailed(`${message} - see logs for more information`)
  }
}
