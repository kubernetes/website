
You can reach the maintainers of Korean localization at:

* June Yi ([GitHub - @gochist](https://github.com/gochist))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-ko)

## Running the site locally using Docker

The recommended way to run the Kubernetes website locally is to run a specialized [Docker](https://docker.com) image that includes the [Hugo](https://gohugo.io) static site generator.

> If you are running on Windows, you'll need a few more tools which you can install with [Chocolatey](https://chocolatey.org). `choco install make`

> If you'd prefer to run the website locally without Docker, see [Running the site locally using Hugo](#running-the-site-locally-using-hugo) below.

If you have Docker [up and running](https://www.docker.com/get-started), build the `kubernetes-hugo` Docker image locally:

```bash
make docker-image
```

Once the image has been built, you can run the site locally:

```bash
make docker-serve
```

Open up your browser to http://localhost:1313 to view the site. As you make changes to the source files, Hugo updates the site and forces a browser refresh.

## Running the site locally using Hugo

See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions. Make sure to install the Hugo version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L9) file.

To run the site locally when you have Hugo installed:

```bash
make serve
```

This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the site. As you make changes to the source files, Hugo updates the site and forces a browser refresh.

## Thank you!

Kubernetes thrives on community participation, and we really appreciate your contributions to our site and our documentation!
i
