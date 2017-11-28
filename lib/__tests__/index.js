const pollJenkinsFeed = require('../')

const jenkinsFeedUrl = 'https://example.com'
const branchName = 'master'

jest.mock('../utils', () => ({
  genJenkinsFeedUrl: jest.fn(() => 'https://example.com'),
  getCurrentGitBranch: jest.fn(() => 'master'),
  getLatestFeedItem: jest.fn(),
}))

describe('pollJenkinsFeed', () => {
  jest.useFakeTimers()
  const {
    getLatestFeedItem,
    getCurrentGitBranch,
    genJenkinsFeedUrl,
  } = require('../utils')
  const callback = jest.fn()
  const jenkinsBaseUrl = 'https://example.com'
  const projectName = 'wait-for-jenkins'
  const initialTitle = 'something something 3'
  const newTitle = 'something something 4'
  getLatestFeedItem.mockImplementationOnce((url, fn) => fn(null, initialTitle))
  getLatestFeedItem.mockImplementationOnce((url, fn) => fn(null, newTitle))

  pollJenkinsFeed(jenkinsBaseUrl, projectName, callback)

  it('should get the current git branch', () => {
    expect(getCurrentGitBranch).toHaveBeenCalled()
  })

  it('should generate the jenkins feed URL', () => {
    expect(genJenkinsFeedUrl).toHaveBeenCalledWith(
      jenkinsBaseUrl,
      projectName,
      branchName,
    )
  })

  it('should get the latest feed item', () => {
    expect(getLatestFeedItem.mock.calls[0][0]).toBe(jenkinsFeedUrl)
  })

  it('should get the feed again after five seconds', () => {
    jest.runTimersToTime(5000)
    expect(getLatestFeedItem).toHaveBeenCalledTimes(2)
  })

  it('should call the callback with the new title', () => {
    jest.runTimersToTime(5000)

    expect(callback).toHaveBeenCalledWith(null, newTitle)
  })
})
