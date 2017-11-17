---
title: Generating Reference Documentation for the Kubernetes API
---

{% capture overview %}

This page shows how to update the automatically generated reference docs for the
Kubernetes API.

{% endcapture %}


{% capture prerequisites %}

You need to have these tools installed:

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Golang](https://golang.org/doc/install) version 1.8 or later
* [Docker](https://docs.docker.com/engine/installation/)
* [etcd](https://github.com/coreos/etcd/)

Your $GOPATH environment variable must be set, and the location of `etcd`
must be in your $PATH environment variable.

{% endcapture %}


{% capture steps %}

## The big picture

Updating the Kubernetes API reference documentation is a two-stage process:

1. Generate an OpenAPI spec from the Kubernetes source code. The tools for
this stage are at [kubernetes/kubernetes/hack](https://github.com/kubernetes/kubernetes/hack).

1. Generate an HTML file from the OpenAPI spec. The tools for this stage are at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).

## Editing the Kubernetes source code

The Kubernetes API reference documentation is automatically generated from
an OpenAPI spec, which is generated from the Kubernetes source code. If you
want to change the reference documentation, the first step is to change one
or more comments in the Kubernetes source code.

### Getting the Kubernetes source code

If you don't already have the Kubernetes source code, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the Kubernetes source
code, your base directory is `$GOPATH/src/github.com/kubernetes/kubernetes`.
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
origin  https://github.com/kubernetes/kubernetes (fetch)
origin  https://github.com/kubernetes/kubernetes (push)

```

### Making changes to comments in the source code

**Note**: The following steps are an example, not a general procedure. Details 
will be different in your situation.
{: .note}

Here's an example of editing the upstream Kubernetes source code. For this example,
assume your remote is named `origin`, and you want to make changes in the `release-1.9` branch.

In your local environment, check out the release-1.9 branch, and make sure it is up to date:

```shell
cd <k8s-base>
git checkout release-1.9
git pull origin release-1.9
```

Suppose this source file in the release-1.9 branch has the typo "atmost":

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/release-1.9/staging/src/k8s.io/api/apps/v1/types.go)

In your local environment, open `types.go`, and change "atmost" to "at most".

Verify that you have changed the file:

```shell
git status
```

The output shows that you are on the release-1.9 branch, and that the `types.go`
source file has been modified:

```shell
On branch release-1.9
...
    modified:   apps/v1/types.go
```

Go to the `<k8s-base>` and run these scripts:

```shell
hack/update-generated-swagger-docs.sh
hack/update-swagger-spec.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh (TODO: Is this needed?)
```

Run `git status` to see what was generated.

```shell
On branch release-1.9
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/swagger-spec/apps_v1.json
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types.go
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

View the contents of `api/openapi-spec/swagger.json` to make sure
the typo is fixed. This is important, because `swagger.json` will be the input to
the second stage of the doc generation process.

Run `git add` and `git commit` to commit your changes.

Submit your changes as a
[pull request](https://help.github.com/articles/creating-a-pull-request/) to the
release-1.9 branch of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.

**Note**: The preceding steps are an example, not a general procedure. Details might
be different for your situation. For example, you might want to submit to a different
branch of the `kubernetes/kubernetes` repository. Or you might want to submit to
a different repository.
{: .note}

**Note**: It can be tricky to determine the correct source file to be changed. In the
preceding example, the authoritative source file is under the `staging` directory
in the `kubernetes/kubernetes` repository. But in your situation,the `staging` directory
might not be the place to find the authoritive source. For guidance, check the
README files in
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
repository and in related repositories like
[kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{: .note}

## Generating the publihed reference docs

The preceding section showed how to edit a source file and then generate
several files, including the `api/openapi-spec/swagger.json` file in the 
`kubernetes/kubernetes` repository.

This section shows how to generate the
[published Kubernetes API reference documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.9/).
The published documentation is generated by the tools at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).
Those tools take the `api/openapi-spec/swagger.json' file as input.

### Getting the generation tools

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

### Editing Makefile

Go to `<rdocs-base>`, and open `Makefile` for editing:

Change the value of `K8SROOT` to the base directory of your clone of the `kubernetes/kubernetes`
repository. Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.9, set `MINOR_VERSION` to 9. Save and close Makefile.

### Copying the OpenAPI spec

The doc generation code needs a local copy of the OpenAPI spec for the Kubernetes API.

Copy the OpenAPI spec from the `kubernetes/kubernetes` repository to a local directory:

```shell
make updateapispec
```

The output shows that the file was copied:

```shell
cp ~/src/github.com/kubernetes/kubernetes/api/openapi-spec/swagger.json gen-apidocs/generators/openapi-spec/swagger.json
```

### Verify that the OpenAPI spec contains your changes

View the contens of `<rdocs-base>/gen-apidocs/generators/openapi-spec/swagger.json`. Make sure
the file contains your changes. For example, if you fixed a typo in the upstream
Kubernetes source code, make sure the type of fixed in your `swagger.json` file.

### Building the brodocs image

The doc generation code requires the
[pwittrock/brodocs](https://github.com/pwittrock/brodocs) Docker image.

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

### Running the doc generation code

Build and run the doc generation code. You might need to run these commands as root:

```shell
cd <rdocs-base>
make api
```

### Locate the generated files

These two files are the output of a successful build. Verify that they exist:

* `<rdocs-base>/gen-apidocs/generators/build/index.html`
* `<rdocs-base>/gen-apidocs/generators/build/navData.js`

The generated files do not get published automatically. They have to be manually copied to the
[kubernetes/website](https://github.com/kubernetes/website/tree/master/docs/reference/generated)
repository.

## Copying the generated docs to the kubernets/website repository

The preceding sections showed how to edit an upstream Kubernetes source file,
generate an OpenAPI spec, and then generate reference documentation for publication.

This section show how to copy the generated docs to the
[kubernetes/website](https://github.com/kubernetes/website) repository. The files
in the `kubernetes/website` repository are published in the
[kubernetes.io](https://kubernetes.io) website. In particular, the generated
`index.html` file is published [here](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.9/).

### Getting the kubernetes/website repository

If you don't already have the `kubernetes/website` repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the Kubernetes source
code, your base directory is `$GOPATH/src/github.com/kubernetes/website.`
The remaining steps refer to your base directory as `<web-base>`.

Determine the name of your Git remote that is associated with
[https://github.com/kubernetes/website](https://github.com/kubernetes/kubernetes).

```shell
cd <web-base>
git remote -v
```

The output shows the names and URLs of your remotes. Typical names are `origin`
and `upstream`.

```shell
origin  https://github.com/kubernetes/website (fetch)
origin  https://github.com/kubernetes/website (push)
```

Determine which branch of the `kubernetes/website` repository you want
to update. For guidance on choosing a branch, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).

If necessary, run `git checkout` to check out the branch that you want to update.

### Edit Makefile in kubernetes-incubator/reference-docs

Recall that `<ref-base>` is the base of your clone of the
`kubernetes-incubator/reference-docs`.

Go to `<ref-base>, and open `Makefile` for editing. Set the value of
WEBROOT to the base of your clone of the `kubernetes/website` repository.
In other words, set WEBROOT to your value of `<web-base>`. Also in Makefile,
verify that K8SROOT is set to your value of `<k8s-base>`. Save and
close `Makefile`.









## Alternative -- Running the update-api-reference-docs.sh script

As an alternative to using the generation tools at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs),
you can use the
[update-api-reference-docs.sh](https://github.com/kubernetes/kubernetes/blob/master/hack/update-api-reference-docs.sh)
script to generate reference docs for the Kubernetes API.  The docs generated by this script are not
published in the [kubernetes.io](https://kubernetes.io) website, and they are in a different format
from the docs published at kubernetes.io.

Run the doc generation script:

```shell
cd <k8s-base>
hack/update-api-reference-docs.sh
```

The script generates several pairs of files and places them under `<k8s-base>/docs/api-reference`.
Each pair has a file named `definitions.html` and a file named `operations.html`
The files are placed in directories according to API group and version. For example, the files
for version `v1` of the `autoscaling` API group are in the
`<k8s-base>/docs/api-reference/autoscaling/v1` directory.

Here are some othe examples of generated files:

* <k8s-base>/docs/api-reference/apps/v1/definitions.html
* <k8s-base>/docs/api-reference/apps/v1/operations.html
* <k8s-base>/docs/api-reference/v1/definitions.html
* <k8s-base>/docs/api-reference/v1/operations.html

## GoDoc

[GoDoc](https://godoc.org/) uses tools at [golang/gddo](https://github.com/golang/gddo)
to generate docs for many Golang packages, including packages that underlie the Kubernetes API.
The docs for each package are published at a URL that includes the package's import path.
For example, the package with import path
[k8s.io/kubernetes/pkg/apis/admission/v1beta1](https://github.com/kubernetes/kubernetes/blob/master/pkg/apis/admission/v1beta1/doc.go)
is documented at
[https://godoc.org/k8s.io/kubernetes/pkg/apis/admission/v1beta1](https://godoc.org/k8s.io/kubernetes/pkg/apis/admission/v1beta1).

For more information, see [About GoDoc](https://godoc.org/-/about).

{% endcapture %}

{% capture whatsnext %}

* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for kubectl](/docs/home/contribute/generated-reference/kubectl/)
* [Generating Reference Docs for Kubernetes Federation](/docs/home/contribute/generated-reference/federation-components/)
* [Generating Reference Documentaion for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)

{% endcapture %}


{% include templates/task.md %}
