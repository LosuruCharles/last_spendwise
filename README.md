# Project title – Expense Tracker

## Project Description

Spendwise is a web-based expense tracking application that helps users record, categorise and monitor their spending in one place. 

**Key features**
- Add, edit and delete expense entries
- Categorise expenses and view spending summaries
- Responsive design for desktop and mobile

## Technologies Used
Frontend - HTML5, CSS, JavaScript 
Version Control - Git and GitHub 
Hosting / Deployment - Netlify (continuous deployment from GitHub) 
Tools - VS Code, Netlify CLI 

## GitHub Repository Information

Repository name: last_spendwise
Repository URL: https://github.com/LosuruCharles/last_spendwise
Main branch: main
Visibility: Public

## Live Netlify Website URL

🔗 **https://expensetrackerlc.netlify.app

## Deployment Process Summary
1. Prepared the project: Organised files so the entry point (`index.html`) sits at the project root and tested the app locally.
2. Pushed to GitHub: Initialised a Git repository, committed the code and pushed it to a GitHub repository.
3. Connected Netlify to GitHub: Logged in to Netlify, selected *Add new site → Import an existing project* and authorised access to the GitHub repository.
4. Configured build settings: Set the build command and publish directory. 
5. Added environment variables: Stored any API keys or configuration values in Netlify's *Site settings → Environment variables* rather than in the code.
6. Deployed: Clicked *Deploy site*. Netlify built and published the site at a `.netlify.app` URL.
7. Set up continuous deployment: Every push to the `main` branch now triggers an automatic redeploy.
8. Verified: Tested adding expenses and page navigation on the live site.

## Challenges Encountered During Deployment

Choosing a hosting platform: I compared Netlify, Vercel and Firebase Hosting before settling on Netlify because of its simple GitHub integration and free tier.
Build and publish settings: Incorrect publish directory or build command settings can lead to a blank page or a "Page not found" error.
Routing issues: Refreshing a page or opening a direct link returned a 404 until a redirect rule (`_redirects` file or `netlify.toml`) was added.
Environment variables and secrets: Keeping API keys out of the repository and configuring them correctly in Netlify.
Domain and naming: Deciding on a suitable site name and understanding domain options, since Netlify provides a free subdomain but custom domains are purchased separately or connected from another registrar.
Future migration: Planning a later move to another host while keeping the site working.

## Lessons Learned

- Continuous deployment from GitHub saves time: a `git push` is all that is needed to update the live site.
- Test locally first, but always retest on the live URL, since behaviour can differ in production.
- Never commit secrets; use environment variables and proper security rules for user data.
- Reading Netlify's deploy logs is the fastest way to diagnose failed deployments.
- Redirect rules are essential for single-page applications.
- Planning authentication, database rules and hosting together from the start avoids rework later.
- Clear commit messages and a well-organised repository make deployment and troubleshooting easier.

