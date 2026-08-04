# Create a User
```bash
$ node scripts/createUser.js
```

# Run migrations
- create your own migrations with mongoose
```bash
$ node scripts/migrateProjects.js
```

# Stockage des images avec MinIO

Les images de projets sont maintenant stockees dans MinIO (bucket S3-compatible) au lieu de `public/uploads`.
MinIO reste prive (non expose publiquement) et les images sont servies par l'API Node.

## Variables d'environnement

Ajoutez dans votre `.env` (voir `.env.example`) :

```bash
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=portfolio-images
```

## Avec Docker Compose

`docker-compose.yml` lance:
- l'app Node sur `http://localhost:5000`

Le service MinIO n'est pas publie sur le host. Il est accessible seulement depuis le reseau Docker interne.

Le bucket est cree automatiquement au premier upload.
Les URLs d'images stockees en base pointent vers l'API:

`/api/projects/image?key=projects%2F...`

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
   
   **Recommendation:** This is a CD pipeline given buy Heroku but make sure you have CI pipeline configured on your repo.
