A github action to render a ejs template using github context

# Input:
* template: [optional] ejs template string
* template-path: [optional] ejs template file path
* ext-inputs: [optional] json string, extend inputs for template render
* post-run: [optional] a shell command run after template has been rendered, use <%- output %> to get template render result

# Output:
* content: template render result

# Usage
```yml
name: Test
on:
  push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kikyous/template-action@v2.0.0
        id: template
        with:
          template: "<% context.payload.commits.forEach(function(c){ %>[✅ <%= c.message %>](<%= c.url %>)\n<% }); %>> commiter: <%= context.payload.head_commit.author.name %>
          ext-inputs: '{"name": "${{ steps.stepId.outputs.name }}"}'
          post-run: |
            curl '${{ secrets.WECHAT_WORK_WEBHOOK_URL }}' -s \
            -H 'Content-Type: application/json' \
            -d '{
              "msgtype": "markdown",
              "markdown": {
                  "content": "<%- output %>"
              }
            }'

      - name: Get the render output
        run: echo "${{ steps.template.outputs.content }}"
```

# Template syntax
https://github.com/mde/ejs

# Render context
you can explore `context` use below action 
```yml
name: Test
on:
  push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kikyous/template-action@v2.0.0
        id: template
        with:
          template: "<%- JSON.stringify(context, undefined, 2) %>"

      - name: Get the render output
        run: echo "${{ steps.template.outputs.content }}"
```
