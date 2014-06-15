###
# This is a script to clone all of a users repositories off of github
# CLI Usage Examples:
#   coffee gitScraper.coffee user :username
#   coffee gitScraper.coffee org :orgname
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
        console.log(err) if err
        res.forEach (repo) ->
            repoUrl = "https://github.com/#{username}/#{repo.name}.git"
            spawn 'git', ['clone', repoUrl], {cwd: username}

gitScrapeOrg = (orgname) ->
    spawn 'mkdir', [orgname]
    git.repos.getFromOrg {org: orgname}, (err ,res) ->
        console.log(err) if err
        res.forEach (repo) ->
            repoUrl = "https://github.com/#{orgname}/#{repo.name}.git"
            spawn 'git', ['clone', repoUrl], {cwd: orgname}

switch process.argv[2]
    when 'user' then gitScrapeUser process.argv[3]
    when 'org' then gitScrapeOrg process.argv[3]
