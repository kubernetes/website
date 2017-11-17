---
title: Generating Reference Pages for Kubernetes Federation Components
---

{% capture overview %}

This page shows how to automatically generate reference pages for Kubernetes federation components.
{% endcapture %}


{% capture prerequisites %}

* You need to have
[Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
installed.

* You need to have
[Golang](https://golang.org/doc/install) version 1.8 or later installed,
and your `$GOPATH` environment variable must be set.

{% endcapture %}


{% capture steps %}

## Running the generate-docs.sh script

If you don't already have the Kubernetes federation source code, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/federation
```

TODO: Checkout the branch of interest. For 1.8 docs, release-1.8.

Determine the base directory of your clone of the
[kubernetes/federation](https://github.com/kubernetes/federation) repository.
For example, if you followed the preceding step to get the federation source
code, you base directory is `$GOPATH/src/github.com/kubernetes/federation.`
The remaining steps refer to your base directory as `<fed-base>`.

Run the doc generation script:

```shell
cd <fed-base>
hack/generate-docs.sh
```

The script calls the
[gen_fed_docs.go](https://github.com/kubernetes/federation/blob/master/cmd/genfeddocs/gen_fed_docs.go)
Golang program to generate a set of reference docs:

### gen_fed_docs.go

The code at `<fed-base>/cmd/genkubedocs/gen_fed_docs.go` generates reference
pages for several federation components. It places these Markdown files in `<fed-base>/docs/admin>`:

* federation-apiserver.md
* federation-controller-manager.md
* kubefed_init.md
* kubefed_join.md
* kubefed.md
* kubefed_options.md
* kubefed_unjoin.md
* kubefed_versions.md

The generated files do not get published automatically. They have to be manually copied to the
[kubernetes/website](https://github.com/kubernetes/website/tree/master/docs/reference/generated)
repository.

These files are published at
[kubernetes.io/docs/reference](/docs/reference/).
Example: [federation-apiserver](/docs/reference/generated/federation-apiserver/).

{% endcapture %}

{% capture whatsnext %}

* [Generating the kubectl Reference Docs](/docs/home/contribute/generated-reference/kubectl/)
* [Generating Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Kubernetes Federation Reference Pages](/docs/home/contribute/generated-reference/federation-components/)
* [Generating the Kubernetes Federation API Reference Docs](/docs/home/contribute/generated-reference/federation-api/)

{% endcapture %}


{% include templates/task.md %}
