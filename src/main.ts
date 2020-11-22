import * as core from '@actions/core'
import {context} from '@actions/github'
import {render} from 'ejs'
import {exec} from "child_process"
import {readFileSync} from "fs"
import {join} from 'path'

function run() {
  try {
    let template: string = core.getInput('template')
    const cmd: string = core.getInput('post-run')
    const templatePath: string = core.getInput('template-path')
    if (templatePath) {
      const fullPath = join(process.env.GITHUB_WORKSPACE || '', templatePath);
      template = readFileSync(fullPath, 'utf8')
    }
    const resultText = render(template, {context: context})

    core.setOutput('content', resultText)
    if (cmd) {
      const cmdText = render(cmd, {output: resultText, context: context})
      exec(cmdText, function(error, stdout, stderr){
        if (error) {
          console.error(`error: ${error}`);
          return;
        }
        core.info(stdout)
        core.error(stderr)
      })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
