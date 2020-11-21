import * as core from '@actions/core'
import {context} from '@actions/github'
import * as doT from "dot"

function run() {
  try {
    const template: string = core.getInput('template')
    const tempFn = doT.template(template);
    const resultText = tempFn(context);

    core.setOutput('content', resultText)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
