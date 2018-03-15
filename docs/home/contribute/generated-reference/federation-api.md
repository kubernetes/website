---
title: Generating Reference Documentation for Kubernetes Federation API
---

{% capture overview %}

This page shows how to automatically generate reference pages for the
Kubernetes Federation API.

{% endcapture %}


{% capture prerequisites %}

* You need to have
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed.

* You need to have
[Golang](https://golang.org/doc/install) version 1.9.1 or later installed,
and your `$GOPATH` environment variable must be set.

* You need to have
[Docker](https://docs.docker.com/engine/installation/) installed.

* You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).

{% endcapture %}


{% capture steps %}

## Running the update-federation-api-docs.sh script

If you don't already have the Kubernetes federation source code, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/federation
```

Determine the base directory of your local
[kubernetes/federation](https://github.com/kubernetes/federation) repository.
For example, if you followed the preceding step to get the federation source
code, you base directory is `$GOPATH/src/github.com/kubernetes/federation.`
The remaining steps refer to your base directory as `<fed-base>`.

Run the doc generation script:

```shell
cd <fed-base>
hack/update-federation-api-reference-docs.sh
```

The script runs the
[gcr.io/google_containers/gen-swagger-docs](https://console.cloud.google.com/gcr/images/google-containers/GLOBAL/gen-swagger-docs?gcrImageListquery=%255B%255D&gcrImageListpage=%257B%2522t%2522%253A%2522%2522%252C%2522i%2522%253A0%257D&gcrImageListsize=50&gcrImageListsort=%255B%257B%2522p%2522%253A%2522uploaded%2522%252C%2522s%2522%253Afalse%257D%255D)
image to generate this set of reference docs:

* /docs/api-reference/extensions/v1beta1/operations.html
* /docs/api-reference/extensions/v1beta1/definitions.html
* /docs/api-reference/v1/operations.html
* /docs/api-reference/v1/definitions.html

The generated files do not get published automatically. They have to be manually copied to the
[kubernetes/website](https://github.com/kubernetes/website/tree/master/docs/reference/generated)
repository.

These files are published at
[kubernetes.io/docs/reference](/docs/reference/):

* [Federation API v1 Operations](https://kubernetes.io/docs/reference/federation/v1/operations/)
* [Federation API v1 Definitions](https://kubernetes.io/docs/reference/federation/v1/definitions/)
* [Federation API extensions/v1beta1 Operations](https://kubernetes.io/docs/reference/federation/extensions/v1beta1/operations/)
* [Federation API extensions/v1beta1 Definitions](https://kubernetes.io/docs/reference/federation/extensions/v1beta1/definitions/)

{% endcapture %}

{% capture whatsnext %}

* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
* [Generating Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)

{% endcapture %}


{% include templates/task.md %}
