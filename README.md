## The Kubernetes documentation

Welcome! This repository houses all of the assets required to build the Kubernetes website and documentation. We're very pleased that you want to contribute!

## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a *fork*. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**  Also note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one originally assigned to provide you feedback. Furthermore, in some cases, one of your reviewers might ask for a technical review from a [Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers) when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

For more information about contributing to the Kubernetes documentation, see:

* [Start contributing](http://kubernetes.io/contribute/start/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Using Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Documentation Style Guide](http://kubernetes.io/docs/contribute/style/style-guide/)

## Running the site locally using Hugo

The Kubernetes documentation is built using the [Hugo](https://gohugo.io) static site generator. See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions.

> Building and running the site requires the Hugo version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](/blob/master/netlify.toml#L9) file.

To run the site locally when you have Hugo installed:

```bash
make serve
```

This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the site. As you make changes to the source files, Hugo updates immediately and forces a browser refresh.

## Building the site using Docker

You can build the Kubernetes docs using [Docker](https://docker.com). To get started, make sure that you have Docker running and build the image locally:

```bash
make docker-image
```

Once the `kubernetes-hugo` image has been built locally, you can build the site:

```bash
make docker-serve
```

As when building without using a Docker container, the results of the build will be published to the `public` directory (the default output directory for Hugo).

## Thank you!

Kubernetes thrives on community participation, and we really appreciate your contributions to our site and our documentation!
