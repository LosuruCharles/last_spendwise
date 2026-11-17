SETUP (about 10 minutes)
1. Go to supabase.com, create a free project.
2. SQL Editor > New query > paste schema.sql > Run.
3. Project Settings > API: copy the Project URL and the anon public key into config.js.
4. Authentication > URL Configuration: set Site URL to your Netlify address
   (e.g. https://yoursite.netlify.app) and add it under Redirect URLs.
5. Put all files (index.html, login.html, config.js) in your GitHub repo and push.
   Netlify redeploys automatically. schema.sql and README.txt are not needed on the site.
