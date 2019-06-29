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

## Setting up the local repositories

Create a workspace to clone the local repositories and set your `GOPATH`.

```shell
mkdir -p $HOME/<workspace> # make sure the directory exists

export GOPATH=$HOME/<workspace>
```

To build the kubectl command reference guide, you need to have a local clone
of the following repositories:

```
go get -u github.com/spf13/pflag
go get -u github.com/spf13/cobra
go get -u gopkg.in/yaml.v2
go get -u kubernetes-incubator/reference-docs
go get -u k8s.io/kubernetes
```

Manually remove the spf13 package from `$GOPATH/src/k8s.io/kubernetes/vendor`.

The k8s.io/kubernetes repository provides access to the kubectl and kustomize source code.

If you don't already have the kubernetes/website repository, get it now:

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

* Determine the base directory of your clone of the
[k8s.io/kubernetes](https://github.com/k8s.io/kubernetes) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/k8s.io/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

* Determine the base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/<your-username>/website.`
The remaining steps refer to your base directory as `<web-base>`.

* Determine the base directory of your clone of the
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs) repository.
For example, if you followed the preceding step to get the repository, your
base directory is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.

In your local k8s.io/kubernetes repository, check out the branch of interest,
and make sure it is up to date. For example, if you want to generate docs for
Kubernetes 1.15, you could use these commands:

```shell
cd <k8s-base>
git checkout release-1.15
git pull https://github.com/kubernetes/kubernetes release-1.15
```

## Editing the kubectl source code

The kubectl command reference documentation is automatically generated from
the kubectl source code. If you want to change the reference documentation, the first step
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

Go to `<rdocs-base>`, and open the `Makefile` for editing:

* Set `K8SROOT` to `<k8s-base>`.
* Set `WEBROOT` to `<web-base>`.
* Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
if you want to build docs for Kubernetes 1.15, set `MINOR_VERSION` to 15. Save and close the `Makefile`.

## Creating a version directory

In the `<rdocs-base>/gen-kubectldocs/generators` directory, if you do not already
have a directory named `v1_<MINOR_VERSION>`, create one now by copying the directory
for the previous version. For example, suppose you want to generate docs for
Kubernetes 1.15, but you don't already have a `v1_15` directory. Then you could
create and populate a `v1_15` directory by running these commands:

```shell
mkdir gen-kubectldocs/generators/v1_15
cp -r gen-kubectldocs/generators/v1_14/* gen-kubectldocs/generators/v1_15
```

The version directory is a staging area for the kubectl command reference build.
The YAML files are used to create the structure and navigation for the new reference.

## Checking out a branch in k8s.io/kubernetes

In your local <k8s-base> repository, checkout the branch that has
the version of Kubernetes that you want to document. For example, if you want
to generate docs for Kubernetes 1.15, checkout the release-1.15 branch. Make sure
you local branch is up to date.

```shell
cd <k8s-base>
git checkout release-1.15
git pull https://github.com/k8s.io/kubernetes release-1.15
```

## Running the doc generation code

In your local kubernetes-incubator/reference-docs repository, build and run the
kubectl command reference generation code. You might need to run the command as root:

```shell
cd <rdocs-base>
make copycli
```

The `copycli` command will clean the staging directories, generate the kubectl command files,
and copy the collated html page and assets to `<web-base>`.

## Locate the generated files

These two files are the primary output of a successful build. Verify that they exist:

* `<rdocs-base>/gen-kubectldocs/generators/build/index.html`
* `<rdocs-base>/gen-kubectldocs/generators/build/navData.js`

## Locally test the documentation

Build the Kubernetes documentation in your local `<web-base>`.

```shell
cd <web-base>
make docker-serve
```

View the [local preview](/docs/reference/generated/kubectl/kubectl-cmds/) of the reference from:

`https://localhost:1313`

## Adding and committing changes in kubernetes/website

List the files that were generated and copied to the `<web-base>`:

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