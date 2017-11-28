const { execSync } = require('child_process')
const request = require('request')
const FeedParser = require('feedparser')

module.exports.getCurrentGitBranch = () =>
  execSync(
    'git rev-parse --abbrev-ref HEAD',
    { cwd: process.cwd() }
  ).toString().trim()

module.exports.genJenkinsFeedUrl = (baseUrl, projectName, gitBranch) => {
  const encProjectName = encodeURIComponent(projectName)
  const encBranchName = encodeURIComponent(gitBranch)
  return `${baseUrl}/job/${encProjectName}/job/${encBranchName}/rssAll`
}

module.exports.getLatestFeedItem = (feedUrl, callback) => {
  const res = request(feedUrl)

  res.on('error', callback)
  res.on('response', (response) => {
    if (response.statusCode !== 200) return callback(new Error())

    const parser = new FeedParser()

    res.pipe(parser)

    parser.on('error', () => callback(new Error()))
    parser.once('readable', function () {
      const stream = this
      const firstItem = stream.read()
      callback(null, firstItem.title)
    })
  })
}
