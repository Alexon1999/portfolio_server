# Create a User
```bash
$ node scripts/createUser.js
```

# Run migrations
- create your own migrations with mongoose
```bash
$ node scripts/migrateProjects.js
```

# Automatic Deployment on Heroku with **Basic Dynos**

1. Manually Push to the heroku remote Repository

```bash
$ heroku login
$ git push heroku master
```

2. Automatic Deploys
   To Enables a chosen branch to be automatically deployed to this app.

   - We need to Connect your Github Repository on your Heroku Project. In the "Deployment method" section, select GitHub.
   - Enable Automatic Deploys

   This setup will automatically deploys whenever there is a new code changes on your Github Master Branch.
   
   **Recommendation:** This is a CD pipeline given bu Heroku but make sure you have CI pipeline configured on your repo.
