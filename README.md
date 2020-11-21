A github action to render a template using github context

# Input:
* template: doT template string 
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
      - uses: kikyous/template-action@v1.0.0
        id: template
        with:
          template: "{{~it.payload.commits :commit}}[✅ {{=commit.message}}]({{=commit.url}})\n{{~}}> commiter: {{=it.payload.head_commit.author.name}}"
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


# Render context (it)
you can explore `it` use below action 
```yml
name: Test
on:
  push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kikyous/template-action@v1.0.0
        id: template
        with:
          template: "{{=JSON.stringify(it, undefined, 2)}}"

      - name: Get the render output
        run: echo "${{ steps.template.outputs.content }}"
```
