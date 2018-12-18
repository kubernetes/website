# The Kubernetes documentation

Welcome! This repository houses all of the assets required to build the Kubernetes website and documentation. We're very pleased that you want to contribute!

## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a *fork*. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**  Also note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one originally assigned to provide you feedback. Furthermore, in some cases, one of your reviewers might ask for a technical review from a [Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers) when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

For more information about contributing to the Kubernetes documentation, see:

* [Start contributing](https://kubernetes.io/docs/contribute/start/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Using Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Documentation Style Guide](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)

## `README.md`'s Localizing Kubernetes Documentation

### Korean

See translation of `README.md` and more detail guidance for Korean contributors on the [Korean README](README-ko.md) page.

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
