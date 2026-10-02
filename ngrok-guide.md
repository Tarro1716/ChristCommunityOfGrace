# Ngrok Local Preview Guide

## Prerequisites
- Python 3 installed
- ngrok downloaded to `/tmp/ngrok`
- ngrok auth token configured

## Start

```bash
cd /mnt/c/users/chin/documents/ChristCommunityOfGrace
python3 -m http.server 8080 &
/tmp/ngrok http 8080 &
```

Visit http://127.0.0.1:4040 to see your public ngrok URL. Share that URL with others to preview the site.

## Stop

```bash
pkill ngrok
pkill -f "python3 -m http.server"
```

## Notes
- The public URL changes each time you restart (free tier)
- Visitors will see an ngrok interstitial page on first load — click "Visit Site" to proceed
- The tunnel stays active as long as both processes are running
