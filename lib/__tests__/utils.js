const fs = require('fs')
const {
  getCurrentGitBranch,
  genJenkinsFeedUrl,
  getLatestFeedItem,
} = require('../utils')

jest.mock('child_process', () => ({
  execSync: jest.fn(() => Buffer.from('asdf\n'))
}))

jest.mock('request', () => {
  const EventEmitter = require('events')
  const emitter = new EventEmitter()
  emitter.pipe = jest.fn()

  return jest.fn(() => {
    setTimeout(() => {
      emitter.emit('response', { statusCode: 200 })
    })

    return emitter
  })
})

jest.mock('feedparser', () => {
  const EventEmitter = require('events')
  return function () {
    const emitter = new EventEmitter()
    this.__proto__ = emitter
    emitter.read = () => ({ title: 'something something 3' })
    setTimeout(() => {
      emitter.emit('readable')
    })
  }
})

describe('getCurrentGitBranch', () => {
  const cwd = '/'
  process.cwd = () => cwd
  const { execSync } = require('child_process')

  const result = getCurrentGitBranch()

  it('should get the current git branch', () => {
    expect(execSync).toHaveBeenCalledWith(
      'git rev-parse --abbrev-ref HEAD',
      { cwd }
    )
  })

  it('should get the return the branch name', () => {
    expect(result).toBe('asdf')
  })
})

describe('genJenkinsFeedUrl', () => {
  const baseUrl = 'https://example.com'
  const gitBranch = 'maste/r'
  const projectName = 'wait-for-/jenkins'
  const result = genJenkinsFeedUrl(baseUrl, projectName, gitBranch)

  it('should return a URL to the jenkins build status feed', () => {
    expect(result).toBe(
      `${baseUrl}/job/${encodeURIComponent(projectName)}/job/${encodeURIComponent(gitBranch)}/rssAll`
    )
  })
})

describe('getLatestFeedItem', () => {
  const request = require('request')
  const url = 'https://example.com'
  const callback = jest.fn()
  jest.useFakeTimers()

  getLatestFeedItem(url, callback)
  jest.runAllTimers()

  it('request the given URL', () => {
    expect(request.mock.calls[0][0]).toBe(url)
  })

  it('should call back with the title of the first item', () => {
    expect(callback).toHaveBeenCalledWith(null, 'something something 3')
  })
})
