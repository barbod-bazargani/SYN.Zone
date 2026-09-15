# SYN ZONE

Coming-soon landing page for SYN ZONE — an independent print zine. Static site with a video background, countdown to release, and a "remind me" button that generates a calendar (.ics) invite.

## Structure

```
index.html      entry point
css/style.css   styles
js/main.js      loader animation, countdown, remind-me logic
assets/         images and background video
```

## Running locally

Just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, go to **Pages** and set the source to the `main` branch, root folder.
3. The site will be published at `https://<username>.github.io/<repo>/`.
