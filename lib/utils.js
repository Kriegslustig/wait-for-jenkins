const { execSync } = require('child_process')
const request = require('request')
const FeedParser = require('feedparser')

module.exports.getCurrentGitBranch = () =>
  execSync(
    'git rev-parse --abbrev-ref HEAD',
    { cwd: process.cwd() }
  ).toString()

module.exports.genJenkinsFeedUrl = (baseUrl, projectName, gitBranch) => {
  const encProjectName = encodeURIComponent(projectName)
  const encBranchName = encodeURIComponent(gitBranch)
  return `${baseUrl}/job/${encProjectName}/job/${encBranchName}/rssAll`
}

module.exports.getLatestFeedItem = (feedUrl, callback) =>
  request(feedUrl, (err, response, body) => {
    if (err) callback(new Error())
    if (response.statusCode !== 200) callback(new Error())

    const parser = new FeedParser()
    parser.on('error', () => callback(new Error()))
    parser.on('readable', function () {
      console.log('readable')
      const stream = this
      const firstItem = stream.read()
      callback(null, firstItem.title)
    })
  })
