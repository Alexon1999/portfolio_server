# Deployment on Heroku with **Basic Dynos**

```bash
$ heroku login
$ git push heroku master
```

# Create a User
```bash
$ node scripts/createUser.js
```

# Run migrations
- create your own migrations with mongoose
```bash
$ node scripts/migrateProjects.js
```