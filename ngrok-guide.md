# Sharing a Preview with ngrok

Lets someone outside your network view the site on their phone while you work on it.

## Prerequisites (one time)

- Node installed (the site server needs nothing else)
- ngrok installed at `~/.local/bin/ngrok` (WSL/Linux) and signed in:
  `ngrok config add-authtoken <your token>` from https://dashboard.ngrok.com

## Start

From the project folder, in WSL:

```bash
node serve.js 8090 &
~/.local/bin/ngrok http 8090
```

ngrok prints a `Forwarding https://....ngrok-free.dev` line. Share that URL.
Port 8080 is often taken by other projects on this machine, which is why 8090 is used here.

## Stop

Press Ctrl+C in the ngrok window, then:

```bash
pkill -f "serve.js 8090"
```

## Notes

- Rebuild with `npm test` after editing; the server serves the built files, so visitors see changes on refresh.
- The public URL changes each time ngrok restarts on the free plan.
- Visitors see an ngrok warning page on first load. Click "Visit Site" to continue.
- The tunnel stays up only while both processes are running and this computer is awake.
