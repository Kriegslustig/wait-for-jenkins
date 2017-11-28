#!/usr/bin/env node

const pollJenkinsFeed = require('./lib')

const JENKINS_BASE_URL = process.env.JENKINS_BASE_URL
const [,, projectName] = process.argv


pollJenkinsFeed(JENKINS_BASE_URL, projectName, (error, newTitle) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(newTitle)
  process.exit(0)
})
