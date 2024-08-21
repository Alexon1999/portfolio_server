# Create a User
```bash
$ node scripts/createUser.js
```

# Run migrations
- create your own migrations with mongoose
```bash
$ node scripts/migrateProjects.js
```

# Deployment on Heroku with **Basic Dynos**

1. Manually Push to the heroku remote Repository
```bash
$ heroku login
$ git push heroku master
```

2. Connect your Github Repository to your Heroku Project
It will automatically update whenever there is a new code changes