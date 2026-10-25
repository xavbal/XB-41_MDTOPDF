# Docker

The image is built from the `Dockerfile` at the repository root (Node 22 + Chromium + fonts).

```bash
docker build -t mdfolio .
docker run --rm -p 127.0.0.1:4141:4141 mdfolio
```

Inside the container the server listens on `0.0.0.0` (`HOST` env var) so the published port works;
outside Docker it stays on `127.0.0.1`. Publish the port on `127.0.0.1` only: the converter renders
raw HTML, so it should not be reachable from the network.
