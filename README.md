## Instructions for Contributing to the Kubernetes Documentation

Welcome! We are very pleased you want to contribute to the Kubernetes documentation.

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account called a *fork*. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**  Also note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one originally assigned to provide you feedback. Furthermore, in some cases, one of your reviewers might ask for a technical review from a [Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers) when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

For more information about contributing to the Kubernetes documentation, see:

* [Contributing to the Kubernetes Documentation](http://kubernetes.io/editdocs/)
* [Creating a Documentation Pull Request](http://kubernetes.io/docs/home/contribute/create-pull-request/)
* [Writing a New Topic](http://kubernetes.io/docs/home/contribute/write-new-topic/)
* [Review Issues](http://kubernetes.io/docs/home/contribute/review-issues/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/home/contribute/stage-documentation-changes/)
* [Using Page Templates](http://kubernetes.io/docs/home/contribute/page-templates/)
* [Documentation Style Guide](http://kubernetes.io/docs/home/contribute/style-guide/)

## Building the site using Docker

If you'd like, you can build the Kubernetes docs using Docker. To get started, build the image locally:

```bash
make docker-image

# The underlying command:
docker build . \
  --tag kubernetes-hugo \
  --build-arg HUGO_VERSION=0.40.3
```

You can create an image for a different version of Hugo by changing the value of the `HUGO_VERSION` argument for the build. You *must* specify a version or the image will not build.
Once the `kubernetes-hugo` image has been built locally, you can build the site:

```bash
make stage

# The underlying command:
docker run \
  --rm \
  --interactive \
  --tty \
  --volume $(PWD):/src \
  -p 1313:1313 \
  kubernetes-hugo \
  hugo server --watch --bind 0.0.0.0
```

As when building without using a Docker container, the results of the build will be published to the `public` directory (the default output directory for [Hugo](https://gohugo.io), the static site generator used to build this site).

## Thank you!

Kubernetes thrives on community participation, and we really appreciate your
contributions to our site and our documentation!
