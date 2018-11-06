---
title: Generating Reference Pages for Kubernetes Components and Tools
content_template: templates/task
---

{{% capture overview %}}

This page shows how to use the `update-imported-docs` tool to generate
reference documentation for tools and components in the
[Kubernetes](https://github.com/kubernetes/kubernetes) and
[Federation](https://github.com/kubernetes/federation) repositories.

{{% /capture %}}


{{% capture prerequisites %}}

* You need a machine that is running Linux or macOS.

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

{{% /capture %}}


{{% capture steps %}}

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

{{< note >}}
If you only need to generate, but not change, the reference docs, you don't need to
manually get the `kubernetes/kubernetes` repository. When you run the `update-imported-docs`
tool, it automatically clones the `kubernetes/kubernetes` repository.
{{< /note >}}

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

{{< note >}}
Proposing a cherry pick requires that you have permission to set a label
and a milestone in your pull request. If you don’t have those permissions, you will
need to work with someone who can set the label and milestone for you.
{{< /note >}}

## Overview of update-imported-docs

The website repository contains a `update-imported-docs` tool under the
`kubernetes/website/update-imported-docs/` directory that performs the
following steps:

1. Clones the related repositories specified in a configuration file. For the
   purpose of generating reference docs, the repositories that are cloned by
   default are `kubernetes-incubator/reference-docs` and `kubernetes/federation`.
1. Runs commands under the cloned repositories to prepare the docs generator and
   then generates the Markdown files.
1. Copies the generated Markdown files to a local clone of the `kubernetes/website`
   repository under locations specified in the configuration file.

When the Markdown files are in your local clone of the `kubernetes/website`
repository, you can submit them in a
[pull request](https://kubernetes.io/docs/home/contribute/create-pull-request/)
to `kubernetes/website`.

## Customizing the config file

Open `<web-base>/update-imported-docs/reference.yaml` for editing.
Do not change the content for the `generate-command` entry unless you undertand
what it is doing and need to change the specified release branch.

```shell
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-incubator/reference-docs.git
  # This and the generate-command below needs a change when reference-docs has
  # branches properly defined
  branch: master  
  generate-command: |
    cd $GOPATH
    git clone https://github.com/kubernetes/kubernetes.git src/k8s.io/kubernetes
    cd src/k8s.io/kubernetes
    git checkout release-1.11
    make generated_files
    cp -L -R vendor $GOPATH/src
    rm -r vendor
    cd $GOPATH
    go get -v github.com/kubernetes-incubator/reference-docs/gen-compdocs
    cd src/github.com/kubernetes-incubator/reference-docs/
    make comp
```

The `update-imported-docs` tool uses `src` and `dst` fields in a configuration
to decide the source and target location for doc files to be copied.
For example:

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-incubator/reference-docs.git
  files:
  - src: gen-compdocs/build/kube-apiserver.md
    dst: content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
  ...
```

Note that when there are many files to be copied from the same source directory
to the same destination directory, you can use wildcards in the value given to
`src` and you can just provide the directory name as the value for `dst`.
For example:

```shell
  files:
  - src: gen-compdocs/build/kubeadm*.md
    dst: content/en/docs/reference/setup-tools/kubeadm/generated/
```

## Running the update-imported-docs tool

After having reviewed and/or customized the `reference.yaml` file, you can run
the `update-imported-docs` tool:

```shell
cd <web-base>/update-imported-docs
./update-imported-docs reference.yml
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

    modified:   content/en/docs/reference/command-line-tools-reference/cloud-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/federation-apiserver.md
    modified:   content/en/docs/reference/command-line-tools-reference/federation-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-proxy.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
...
```

Run `git add` and `git commit` to commit the files.

## Creating a pull request

Create a pull request to the `kubernetes/website` repository. Monitor your
pull request, and respond to review comments as needed. Continue to monitor
your pull request until it is merged.

A few minutes after your pull request is merged, your updated reference
topics will be visible in the
[published documentation](/docs/home/).

{{% /capture %}}

{{% capture whatsnext %}}

* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/) 
* [Generating Reference Documentation for the Kubernetes API](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)

{{% /capture %}}


