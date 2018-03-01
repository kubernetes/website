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
* [Golang](https://golang.org/doc/install) version 1.9.1 or later
* [Docker](https://docs.docker.com/engine/installation/)
* [etcd](https://github.com/coreos/etcd/)

Your $GOPATH environment variable must be set, and the location of `etcd`
must be in your $PATH environment variable.

You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

{% endcapture %}


{% capture steps %}

## The big picture

Updating the Kubernetes API reference documentation is a two-stage process:

1. Generate an OpenAPI spec from the Kubernetes source code. The tools for
this stage are at [kubernetes/kubernetes/hack](https://github.com/kubernetes/kubernetes/tree/master/hack).

1. Generate an HTML file from the OpenAPI spec. The tools for this stage are at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).

## Getting three repositories

If you don't already have the kubernetes/kubernetes repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

If you don't already have the kubernetes/website repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

Determine the base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes/website.`
The remaining steps refer to your base directory as `<web-base>`.

If you don't already have the kubernetes-incubator/reference-docs repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes-incubator/reference-docs
```

Determine the base directory of your clone of the
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.

## Editing the Kubernetes source code

The Kubernetes API reference documentation is automatically generated from
an OpenAPI spec, which is generated from the Kubernetes source code. If you
want to change the reference documentation, the first step is to change one
or more comments in the Kubernetes source code.

### Making changes to comments in the source code

**Note**: The following steps are an example, not a general procedure. Details 
will be different in your situation.
{: .note}

Here's an example of editing a comment in the Kubernetes source code.

In your local kubernetes/kubernetes repository, check out the master branch,
and make sure it is up to date:

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

Suppose this source file in the master branch has the typo "atmost":

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

In your local environment, open `types.go`, and change "atmost" to "at most".

Verify that you have changed the file:

```shell
git status
```

The output shows that you are on the master branch, and that the `types.go`
source file has been modified:

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

### Committing your edited file

Run `git add` and `git commit` to commit the changes you have made so far. In the next step,
you will do a second commit. It is important to keep your changes separated into two commits.

### Generating the OpenAPI spec and related files

Go to `<k8s-base>` and run these scripts:

```shell
hack/update-generated-swagger-docs.sh
hack/update-swagger-spec.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

Run `git status` to see what was generated.

```shell
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/swagger-spec/apps_v1.json
    modified:   docs/api-reference/apps/v1/definitions.html
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types.go
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

View the contents of `api/openapi-spec/swagger.json` to make sure the typo is fixed.
For example, you could run `git diff -a api/openapi-spec/swagger.json`.
This is important, because `swagger.json` will be the input to the second stage of
the doc generation process.

Run `git add` and `git commit` to commit your changes. Now you have two commits:
one that has the edited `types.go` file, and one that has the generated OpenAPI spec
and related files. Keep these two commits separate. That is, do not squash your commits.

Submit your changes as a
[pull request](https://help.github.com/articles/creating-a-pull-request/) to the
master branch of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758)
is an example of a pull request that fixes a typo in the Kubernetes source code.

**Note**: It can be tricky to determine the correct source file to be changed. In the
preceding example, the authoritative source file is under the `staging` directory
in the `kubernetes/kubernetes` repository. But in your situation,the `staging` directory
might not be the place to find the authoritative source. For guidance, check the
`README` files in
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
repository and in related repositories like
[kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{: .note}

### Cherry picking your commit into a release branch

In the preceding section, you edited a file in the master branch and then ran scripts
to generate an OpenAPI spec and related files. Then you submitted your changes in a pull request
to the master branch of the kubernetes/kubernetes repository. Now suppose you want to backport
your change into a release branch. For example, suppose the master branch is being used to develop
Kubernetes version 1.10, and you want to backport your change into the release-1.9 branch.

Recall that your pull request has two commits: one for editing `types.go`
and one for the files generated by scripts. The next step is to propose a cherry pick of your first 
commit into the release-1.9 branch. The idea is to cherry pick the commit that edited `types.go`, but not
the commit that has the results of running the scripts. For instructions, see
[Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md). 

**Note:** Proposing a cherry pick requires that you have permission to set a label and a milestone in your
pull request. If you don't have those permissions, you will need to work with someone who can set the label
and milestone for you.

When you have a pull request in place for cherry picking your one commit into the release-1.9 branch,
the next step is to run these scripts in the release-1.9 branch of your local environment.

```shell
hack/update-generated-swagger-docs.sh
hack/update-swagger-spec.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

Now add a commit to your cherry-pick pull request that has the recently generated OpenAPI spec
and related files. Monitor your pull request until it gets merged into the release-1.9 branch.

At this point, both the master branch and the release-1.9 branch have your updated `types.go`
file and a set of generated files that reflect the change you made to `types.go`. Note that the
generated OpenAPI spec and other generated files in the release-1.9 branch are not necessarily
the same as the generated files in the master branch. The generated files in the release-1.9 branch
contain API elements only from Kubernetes 1.9. The generated files in the master branch might contain
API elements that are not in 1.9, but are under development for 1.10.

## Generating the published reference docs

The preceding section showed how to edit a source file and then generate
several files, including `api/openapi-spec/swagger.json` in the 
`kubernetes/kubernetes` repository.

This section shows how to generate the
[published Kubernetes API reference documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.9/),
which is generated by the tools at
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).
Those tools take the `api/openapi-spec/swagger.json` file as input.

### Editing Makefile in kubernetes-incubator/reference-docs

Go to `<rdocs-base>`, and open `Makefile` for editing:

Set `K8SROOT` to the base directory of your local kubernetes/kubernetes
repository. Set `WEBROOT` to the base directory of your local kubernetes/website repository.
Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.9, set `MINOR_VERSION` to 9. Save and close `Makefile`.

### Copying the OpenAPI spec

The doc generation code needs a local copy of the OpenAPI spec for the Kubernetes API.
Go to `<k8s-base>` and check out the branch that has the OpenAPI spec you want to use.
For example, if you want to generate docs for Kubernetes 1.9, checkout the release-1.9
branch.

Go back to `<rdocs-base>`. Enter the following command to copy the OpenAPI spec from the
`kubernetes/kubernetes` repository to a local directory:

```shell
make updateapispec
```

The output shows that the file was copied:

```shell
cp ~/src/github.com/kubernetes/kubernetes/api/openapi-spec/swagger.json gen-apidocs/generators/openapi-spec/swagger.json
```

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

Build and run the doc generation code. You might need to run the command as root:

```shell
cd <rdocs-base>
make api
```

### Locate the generated files

These two files are the output of a successful build. Verify that they exist:

* `<rdocs-base>/gen-apidocs/generators/build/index.html`
* `<rdocs-base>/gen-apidocs/generators/build/navData.js`

## Copying the generated docs to the kubernetes/website repository

The preceding sections showed how to edit a Kubernetes source file,
generate an OpenAPI spec, and then generate reference documentation for publication.

This section show how to copy the generated docs to the
[kubernetes/website](https://github.com/kubernetes/website) repository. The files
in the `kubernetes/website` repository are published in the
[kubernetes.io](https://kubernetes.io) website. In particular, the generated
`index.html` file is published [here](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.9/).

Enter the following command to copy the generated files to
your local kubernetes/website repository:

```shell
make copyapi
```

Go to the base of your local kubernetes/kubernetes repository, and 
see which files have been modified:

```shell
cd <web-base>
git status
```

The output shows the modified files:

```shell
On branch master
...
   modified:   docs/reference/generated/kubernetes-api/v1.9/index.html
```

In this example, only one file has been modified. Recall that you generated both
`index.html` and `navData.js`. But apparently the generated `navata.js` is not different
from the `navData.js` that was already in the kubernetes/website` repository.

In `<web-base>` run `git add` and `git commit` to commit the change.

Submit your changes as a
[pull request](/docs/home/contribute/create-pull-request/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.

A few minutes after your pull request is merged, your changes will be visible
in the [published reference documentation](/docs/reference/generated/kubernetes-api/v1.9/).

{% endcapture %}

{% capture whatsnext %}

* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)

{% endcapture %}


{% include templates/task.md %}
