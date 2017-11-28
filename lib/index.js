const {
  getLatestFeedItem,
  getCurrentGitBranch,
  genJenkinsFeedUrl,
} = require('./utils')

const POLL_INTERVAL = 5000

const pollJenkinsFeed = (jenkinsBaseUrl, projectName, callback) => {
  let title = null

  const gitBranchName = getCurrentGitBranch()
  const feedUrl = genJenkinsFeedUrl(
    jenkinsBaseUrl,
    projectName,
    gitBranchName
  )

  const boundGetLatestFeedItem = () =>
    getLatestFeedItem(feedUrl, pollFeedTitle)

  const pollFeedTitle = (error, newTitle) => {
    if (error) return callback(error)

    if (title && newTitle !== title) {
      callback(null, newTitle)
    } else {
      title = newTitle
      setTimeout(boundGetLatestFeedItem, POLL_INTERVAL)
    }
  }

  boundGetLatestFeedItem()
}

module.exports = pollJenkinsFeed
