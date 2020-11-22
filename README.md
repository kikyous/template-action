A github action to render a template using github context

# Input:
* template: [optional] doT template string
* template-path: [optional] doT template file path
* post-run: [optional] a shell command run after template has been rendered, can use {{= it.output }} to access template render result

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
      - uses: kikyous/template-action@v1.1.0
        id: template
        with:
          template: "{{~it.context.payload.commits :commit}}[✅ {{=commit.message}}]({{=commit.url}})\n{{~}}> commiter: {{=it.context.payload.head_commit.author.name}}"
          post-run: |
            curl '${{ secrets.WECHAT_WORK_WEBHOOK_URL }}' \
            -H 'Content-Type: application/json' \
            -d '{
              "msgtype": "markdown",
              "markdown": {
                  "content": "{{= it.output }}"
              }
            }'

      - name: Get the render output
        run: echo "${{ steps.template.outputs.content }}"
```

# Template syntax
http://olado.github.io/doT/


# Render context (it.context)
you can explore `it.context` use below action 
```yml
name: Test
on:
  push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kikyous/template-action@v1.1.0
        id: template
        with:
          template: "{{=JSON.stringify(it.context, undefined, 2)}}"

      - name: Get the render output
        run: echo "${{ steps.template.outputs.content }}"
```
