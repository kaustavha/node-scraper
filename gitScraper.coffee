###
# This is a script to clone all of a users repositories off of github
# Usage: coffee gitScraper.coffee username
###
process = require 'process'
githubApi = require 'github'
{spawn} = require 'child_process'

git = new githubApi(
    version: "3.0.0"
    debug: true
    protocol: 'https'
    timeout: 5000
)

gitScrapeUser = (username) ->
    spawn 'mkdir', [username]
    git.repos.getFromUser {user: username}, (err, res) ->
        res.forEach (repo) ->
            repoUrl = "https://github.com/#{username}/#{repo.name}.git"
            spawn 'git', ['clone', repoUrl], {cwd: username}
            console.log repo.name

gitScrapeUser process.argv[2]
