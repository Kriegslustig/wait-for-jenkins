# Wait For Jenkins

A simple CLI which waits for a jenkins build to finish an then exits.

Requires [Node.js](https://nodejs.org/en/) > 8.9 to run.

```
JENKINS_BASE_URL="https://example.com/jenkins" \
  wait-for-jenkins my-project && say "Build done!"
```
