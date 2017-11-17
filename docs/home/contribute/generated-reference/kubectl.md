---
title: Generating Reference Pages for kubectl
---

{% capture overview %}

This page shows how to automatically generate reference pages for the
`kubectl` command-line tool.

{% endcapture %}


{% capture prerequisites %}

* You need to have
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed.

* You need to have
[Golang](https://golang.org/doc/install) version 1.8 or later installed,
and your `$GOPATH` environment variable must be set.

* You need to have
[Docker](https://docs.docker.com/engine/installation/) installed.

{% endcapture %}


{% capture steps %}

## Getting the source code

If you don't already have the Kubernetes source code, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the Kubernetes source
code, your base directory is `$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

Determine the name of your Git remote that is associated with
[https://github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

```shell
cd <k8s-base>
git remote -v
```

The output shows the names and URLs of your remotes. Typical names are `origin`
and `upstream`.

```shell
origin  https://github.com/kubernetes-incubator/reference-docs (fetch)
origin  https://github.com/kubernetes-incubator/reference-docs (push)
```

Check out the branch of interest, and make sure it is up to date. For example,
suppose you want to generate docs for Kubernetes 1.8, and your remote is named `origin`.
Then you could use these commands:

```shell
cd <k8s-base>
git checkout release-1.8
git pull origin release-1.8
```

If you don't already have the code at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs)
repository, get it now:

```shell
cd $GOPATH/src
go get github.com/kubernetes-incubator/reference-docs
```

Determine the base directory of your clone of the
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) repository.
For example, if you followed the preceding step to get the reference-docs source
code, your base directory is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.

## Editing Makefile

Go to `<rdocs-base>`, and open `Makefile` for editing:

Change the value of `K8SROOT` to the base directory of your clone of the kubernetes/kubernetes
repository. Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.8, set `MINOR_VERSION` to 8. Save and close Makefile.

## Building the brodocs image

The doc generation code requires the `pwittrock/brodocs` Docker image.

This command creates the `pwittrock/brodocs` Docker image. It also tries to push the image to
DockerHub, but it's OK if that step fails. As long as you have the image locally, the code generation
can succeed.


```shell
make brodocs
```

Verify that you have the brodocs image:

```shell
docker images
```

The output shows `pwittrock/brodocs` as one of the available images:

```shell
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
pwittrock/brodocs   latest              999d34a50d56        5 weeks ago         714MB
```

## Running the doc generation code

Build and run the doc generation code. You might need to run these commands as root:

```shell
cd <rdocs-base>
make cli
```

## Locate the generated files

These two files are the output of a successful build. Verify that they exist:

* `<rdocs-base>/gen-kubectldocs/generators/build/index.html`
* `<rdocs-base>/gen-kubectldocs/generators/build/navData.js`

The generated files do not get published automatically. They have to be manually copied to the
[kubernetes/website](https://github.com/kubernetes/website/tree/master/docs/reference/generated)
repository.

{% endcapture %}

{% capture whatsnext %}

* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Docs for Kubernetes Federation](/docs/home/contribute/generated-reference/federation-components/)
* [Generating Reference Documentaion for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)

{% endcapture %}


{% include templates/task.md %}
