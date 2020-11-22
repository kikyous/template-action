import * as core from '@actions/core'
import {context} from '@actions/github'
import * as doT from "dot"
import {exec} from "child_process"
import {readFileSync} from "fs"
import {join} from 'path'

doT.templateSettings.strip = false;

function run() {
  try {
    const template: string = core.getInput('template')
    const cmd: string = core.getInput('post-run')
    const templatePath: string = core.getInput('template-path')

    let tempFn = (c: any)=>{}
    if (templatePath) {
      const fullPath = join(process.env.GITHUB_WORKSPACE || '', templatePath);
      tempFn = doT.template(readFileSync(fullPath, 'utf8'))
    } else {
      tempFn = doT.template(template);
    }
    const resultText = tempFn({context: context});

    core.setOutput('content', resultText)
    if (cmd) {
      const cmdTempFn = doT.template(cmd);
      const cmdText = cmdTempFn({output: resultText, context: context})
      exec(cmdText)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
