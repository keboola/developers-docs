# Keboola Connection Developers Documentation

[![Build Status](https://travis-ci.com/keboola/developers-docs.svg?branch=master)](https://travis-ci.com/keboola/developers-docs)

How to write documentation [https://sites.google.com/keboola.com/devel-internal/dokumentace](https://sites.google.com/keboola.com/devel-internal/dokumentace)

## Documentation Development

### Running in Docker

```bash
docker-compose run --rm --service-ports jekyll
```

Documentation will be available at http://localhost:4000

### Publish

* `git push origin HEAD` - on `master` branch

New version is published immediately after push by [Travis](https://travis-ci.org/keboola/developers-docs)
