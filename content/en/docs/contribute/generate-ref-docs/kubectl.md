---
title: Generating Reference Documentation for kubectl Commands
content_template: templates/task
---

{{% capture overview %}}

This page shows how to automatically generate reference pages for the
commands provided by the `kubectl` tool.

{{< note >}}
This topic shows how to generate reference documentation for
[kubectl commands](/docs/reference/generated/kubectl/kubectl-commands)
like
[kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) and
[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
This topic does not show how to generate the
[kubectl](/docs/reference/generated/kubectl/kubectl/)
options reference page. For instructions on how to generate the kubectl options
reference page, see
[Generating Reference Pages for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/).
{{< /note >}}

{{% /capture %}}


{{% capture prerequisites %}}

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
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

{{% /capture %}}


{{% capture steps %}}

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

In your local kubernetes/kubernetes repository, check out the branch of interest,
and make sure it is up to date. For example, if you want to generate docs for
Kubernetes 1.9, you could use these commands:

```shell
cd <k8s-base>
git checkout release-1.9
git pull https://github.com/kubernetes/kubernetes release-1.9
```

## Editing the kubectl source code

The reference documentation for the kubectl commands is automatically generated from
kubectl source code. If you want to change the reference documentation, the first step
is to change one or more comments in the kubectl source code. Make the change in your
local kubernetes/kubernetes repository, and then submit a pull request to the master branch of
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files)
is an example of a pull request that fixes a typo in the kubectl source code.

Monitor your pull request, and respond to reviewer comments. Continue to monitor your
pull request until it is merged into the master branch of the kubernetes/kubernetes repository.

## Cherry picking your change into a release branch

Your change is now in the master branch, which is used for development of the next
Kubernetes release. If you want your change to appear in the docs for a Kubernetes
version that has already been released, you need to propose that your change be
cherry picked into the release branch.

For example, suppose the master branch is being used to develop Kubernetes 1.10,
and you want to backport your change to the release-1.9 branch. For instructions
on how to do this, see
[Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

Monitor your cherry-pick pull request until it is merged into the release branch.

{{< note >}}
Proposing a cherry pick requires that you have permission to set a label and a
milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
{{< /note >}}

## Editing Makefile

Go to `<rdocs-base>`, and open `Makefile` for editing:

Set `K8SROOT` to the base directory of your local kubernetes/kubernetes
repository. Set `WEBROOT` to the base directory of your local kubernetes/website repository.
Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.9, set `MINOR_VERSION` to 9. Save and close `Makefile`.

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

## Creating a version directory

In the `gen-kubectldocs/generators` directory, if you do not already
have a directory named `v1_MINOR_VERSION`, create one now by copying the directory
for the previous version. For example, suppose you want to generate docs for
Kubernetes 1.9, but you don't already have a `v1_9` directory. Then you could
create and populate a `v1_9` directory by running these commands:

```shell
mkdir gen-kubectldocs/generators/v1_9
cp -r gen-kubectldocs/generators/v1_8/* gen-kubectldocs/generators/v1_9
```

## Checking out a branch in kubernetes/kubernetes

In you local kubernetes/kubernetes repository, checkout the branch that has
the version of Kubernetes that you want to document. For example, if you want
to generate docs for Kubernetes 1.9, checkout the release-1.9 branch. Make sure
you local branch is up to date.

## Running the doc generation code

In you local kubernetes-incubator/reference-docs repository, build and run the
doc generation code. You might need to run the command as root:

```shell
cd <rdocs-base>
make cli
```

## Locate the generated files

These two files are the primary output of a successful build. Verify that they exist:

* `<rdocs-base>/gen-kubectldocs/generators/build/index.html`
* `<rdocs-base>/gen-kubectldocs/generators/build/navData.js`

## Copying files to the kubernetes/website repository

Copy the generated files from your local kubernetes-incubator/reference-docs
repository to your local kubernetes/website repository.

```shell
cd <rdocs-base>
make copycli
```

## Adding and committing changes in kubernetes/website

List the files that were generated and copied to the `kubernetes/website`
repository:

```
cd <web-base>
git status
```

The output shows the new and modified files. For example, the output
might look like this:

```shell
modified: docs/reference/generated/kubectl/kubectl-commands.html
modified: docs/reference/generated/kubectl/navData.js
```

Run `git add` and `git commit` to commit the files.

## Creating a pull request

Create a pull request to the `kubernetes/website` repository. Monitor your
pull request, and respond to review comments as needed. Continue to monitor
your pull request until it is merged.

A few minutes after your pull request is merged, your updated reference
topics will be visible in the
[published documentation](/docs/home).


{{% /capture %}}

{{% capture whatsnext %}}

* [Generating Reference Documentation for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)

{{% /capture %}}



