---
title: Generating Reference Pages for Kubernetes Components and Tools
---

{% capture overview %}

This page shows how to use the `update-imported-docs` tool to generate
reference documentation for tools and components in the
[Kubernetes](https://github.com/kubernetes/kubernetes) and
[Federation](https://github.com/kubernetes/federation) repositories.

{% endcapture %}


{% capture prerequisites %}

* You need a machine that is running Linux or MacOS.

* You need to have this software installed:

    * [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

    * [Golang](https://golang.org/doc/install) version 1.9 or later

    * [make](https://www.gnu.org/software/make/)

    * [gcc compiler/linker](https://gcc.gnu.org/)

* Your `$GOPATH` environment variable must be set.

* You need to know how to create a pull request to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/home/contribute/create-pull-request/).

{% endcapture %}


{% capture steps %}

## Getting two repositories

If you don't already have the `kubernetes/website` repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

Determine the base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository.
For example, if you followed the preceding step to get the repository,
your base directory is `$GOPATH/src/github.com/kubernetes/website.`
The remaining steps refer to your base directory as `<web-base>`.

If you plan on making changes to the ref docs, and if you don't already have
the `kubernetes/kubernetes` repository, get it now:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Determine the base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
For example, if you followed the preceding step to get the repository,
your base directory is `$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

**Note:**
If you only need to generate, but not change, the reference docs, you don't need to
manually get the `kubernetes/kubernetes` repository. When you run the `update-imported-docs`
tool, it automatically clones the `kubernetes/kubernetes` repository.
{: .note}

## Editing the Kubernetes source code

The reference documentation for the Kubernetes components and tools is automatically
generated from the Kubernetes source code. If you want to change the reference documentation,
the first step is to change one or more comments in the Kubernetes source code. Make the
change in your local kubernetes/kubernetes repository, and then submit a pull request to
the master branch of
[github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

[PR 56942](https://github.com/kubernetes/kubernetes/pull/56942)
is an example of a pull request that makes changes to comments in the Kubernetes
source code.

Monitor your pull request, and respond to reviewer comments. Continue to monitor
your pull request until it is merged into the master branch of the
`kubernetes/kubernetes` repository.

## Cherry picking your change into a release branch

Your change is now in the master branch, which is used for development of the next
Kubernetes release. If you want your change to appear in the docs for a Kubernetes
version that has already been released, you need to propose that your change be cherry
picked into the release branch.

For example, suppose the master branch is being used to develop Kubernetes 1.10, and
you want to backport your change to the release-1.9 branch. For instructions on how
to do this, see
[Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).

Monitor your cherry-pick pull request until it is merged into the release branch.

**Note:** Proposing a cherry pick requires that you have permission to set a label
and a milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
{: .note}

## Overview of update-imported-docs

The `update-imported-docs` tool performs these steps:

1. Clone the `kubernetes/kubernetes` repository.
1. Run several scripts under `kubernetes/kubernetes/hack`. These scripts
   generate Markdown files and place the files under `kubernetes/kubernetes/docs`.
1. Copy the generated Markdown files to a local clone of the `kubernetes/website`
   repository under `kubernetes/website/docs/reference/generated`.
1. Clone the `kubernetes/federation` repository.
1. Run several scripts under `kubernetes/federation/hack`. These scripts
   generate Markdown files and place the files under `kubernetes/federation/docs`.
1. Copy the generated Markdown files to a local clone of the `kubernetes/website`
   repository under `kubernetes/website/docs/reference/generated`.

After the Markdown files are in your local clone of the `kubernetes/website`
repository, you can submit them in a
[pull request](https://kubernetes.io/docs/home/contribute/create-pull-request/)
to `kubernetes/website`.

## Setting the branch

Open `<web-base>/update-imported-docs/config.yaml` for editing.

Set the value of `branch` to the Kubernetes release that you want to document.
For example, if you want to generate docs for the Kubernetes 1.9 release,
set `branch` to `release-1.9`.

```shell
repos:
- name: kubernetes
  remote: https://github.com/kubernetes/kubernetes.git
  branch: release-1.9
```

## Setting sources and destinations

The `update-imported-docs` tool uses `src` and `dst` fields
in `config.yaml` to know which files to copy from the `kubernetes/kubernetes`
repository and where to place those files in the `kubernetes/website`
repository.

For example, suppose you want the tool to copy the `kube-apiserver.md` file
from the `docs/admin` directory of the `kubernetes/kubernetes` repository
to the `docs/reference/generated/` directory of the `kubernetes/website`
repository. Then you would include a `src` and `dst` in your `config.yaml`
file like this:

```shell
repos:
- name: kubernetes
  remote: https://github.com/kubernetes/kubernetes.git
  branch: release-1.9
  files:
  - src: docs/admin/kube-apiserver.md
    dst: docs/reference/generated/kube-apiserver.md
  ...
```

The configuration is similar for files in the `kubernetes/federation`
repository. Here's an example that configures the tool to copy `kubefed_init.md`
from the `docs/admin` directory of the `kubernetes/federation` repository
to the `docs/reference/generated` directory of the `kubernetes/website` repository:

```shell
- name: federation
  remote: https://github.com/kubernetes/federation.git
#  # Change this to a release branch when federation has release branches.
  branch: master
  files:
  - src: docs/admin/kubefed_init.md
    dst: docs/reference/generated/kubefed_init.md
  ...
```

Here's an example a `config.yaml` file that shows the sources and
destinations of all the Markdown files that were generated and copied
by the `update-imported-docs` tool at the beginning of the Kubernetes
1.9 release.

```shell
repos:
- name: kubernetes
  remote: https://github.com/kubernetes/kubernetes.git
  branch: release-1.9
  files:
  - src: docs/admin/cloud-controller-manager.md
    dst: docs/reference/generated/cloud-controller-manager.md
  - src: docs/admin/kube-apiserver.md
    dst: docs/reference/generated/kube-apiserver.md
  - src: docs/admin/kube-controller-manager.md
    dst: docs/reference/generated/kube-controller-manager.md
  - src: docs/admin/kubelet.md
    dst: docs/reference/generated/kubelet.md
  - src: docs/admin/kube-proxy.md
    dst: docs/reference/generated/kube-proxy.md
  - src: docs/admin/kube-scheduler.md
    dst: docs/reference/generated/kube-scheduler.md
  - src: docs/user-guide/kubectl/kubectl.md
    dst: docs/reference/generated/kubectl/kubectl.md
- name: federation
  remote: https://github.com/kubernetes/federation.git
#  # Change this to a release branch when federation has release branches.
  branch: master
  files:
  - src: docs/admin/federation-apiserver.md
    dst: docs/reference/generated/federation-apiserver.md
  - src: docs/admin/federation-controller-manager.md
    dst: docs/reference/generated/federation-controller-manager.md
  - src: docs/admin/kubefed_init.md
    dst: docs/reference/generated/kubefed_init.md
  - src: docs/admin/kubefed_join.md
    dst: docs/reference/generated/kubefed_join.md
  - src: docs/admin/kubefed.md
    dst: docs/reference/generated/kubefed.md
  - src: docs/admin/kubefed_options.md
    dst: docs/reference/generated/kubefed_options.md
  - src: docs/admin/kubefed_unjoin.md
    dst: docs/reference/generated/kubefed_unjoin.md
  - src: docs/admin/kubefed_version.md
    dst: docs/reference/generated/kubefed_version.md
  ```

## Running the update-imported-docs tool

Now that your `config.yaml` file contains your sources and destinations,
you can run the `update-imported-docs` tool:

```shell
cd <web-base>
go get ./update-imported-docs
go run update-imported-docs/update-imported-docs.go
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
...
    modified:   docs/reference/generated/cloud-controller-manager.md
    modified:   docs/reference/generated/federation-apiserver.md
    modified:   docs/reference/generated/federation-controller-manager.md
    modified:   docs/reference/generated/kube-apiserver.md
    modified:   docs/reference/generated/kube-controller-manager.md
    modified:   docs/reference/generated/kube-proxy.md
    modified:   docs/reference/generated/kube-scheduler.md
    modified:   docs/reference/generated/kubectl/kubectl.md
    modified:   docs/reference/generated/kubefed.md
    modified:   docs/reference/generated/kubefed_init.md
    modified:   docs/reference/generated/kubefed_join.md
    modified:   docs/reference/generated/kubefed_options.md
    modified:   docs/reference/generated/kubefed_unjoin.md
    modified:   docs/reference/generated/kubefed_version.md
    modified:   docs/reference/generated/kubelet.md
```

Run `git add` and `git commit` to commit the files.

## Creating a pull request

Create a pull request to the `kubernetes/website` repository. Monitor your
pull request, and respond to review comments as needed. Continue to monitor
your pull request until it is merged.

A few minutes after your pull request is merged, your updated reference
topics will be visible in the
[published documentation](/docs/home/).

{% endcapture %}

{% capture whatsnext %}

* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/) 
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)

{% endcapture %}


{% include templates/task.md %}
