import * as core from '@actions/core'
import {context} from '@actions/github'
import * as doT from "dot"
import {exec} from "child_process"

doT.templateSettings.strip = false;

function run() {
  try {
    const template: string = core.getInput('template')
    const cmd: string = core.getInput('post-run')

    const tempFn = doT.template(template);
    const resultText = tempFn(context);

    core.setOutput('content', resultText)
    if (cmd) {
      const cmdTempFn = doT.template(cmd);
      const cmdText = cmdTempFn({output: resultText})
      exec(cmdText)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
