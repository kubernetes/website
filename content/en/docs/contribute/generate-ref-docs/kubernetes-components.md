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
information, see [Creating a Documentation Pull Request](/docs/contribute/start/).

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

The reference documentation for the Kubernetes components and tools is automatically
generated from the Kubernetes source code. If you want to change the reference documentation,
please follow [this guide](/docs/contribute/gen-ref-docs/contribute-upstream).

{{< note >}}
If you only need to generate, but not change, the reference docs, you don't need to
manually get the `kubernetes/kubernetes` repository. When you run the `update-imported-docs`
tool, it automatically clones the `kubernetes/kubernetes` repository.
{{< /note >}}

## Overview of update-imported-docs

The `update-imported-docs` tool is located in the `kubernetes/website/update-imported-docs/`
directory. The tool performs the following steps:

1. Clones the related repositories specified in a configuration file. For the
   purpose of generating reference docs, the repositories that are cloned by
   default are `kubernetes-incubator/reference-docs` and `kubernetes/federation`.
1. Runs commands under the cloned repositories to prepare the docs generator and
   then generates the Markdown files.
1. Copies the generated Markdown files to a local clone of the `kubernetes/website`
   repository under locations specified in the configuration file.

When the Markdown files are in your local clone of the `kubernetes/website`
repository, you can submit them in a [pull request](/docs/contribute/start/)
to `kubernetes/website`.

## Customizing the config file

Open `<web-base>/update-imported-docs/reference.yml` for editing.
Do not change the content for the `generate-command` entry unless you understand
what it is doing and need to change the specified release branch.

```yaml
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

In reference.yml, the `files` field is a list of `src` and `dst` fields. The `src` field
specifies the location of a generated Markdown file, and the `dst` field specifies
where to copy this file in the cloned `kubernetes/website` repository.
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

```yaml
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
* [Contributing to the Upstream Kubernetes Project for Documentation](/docs/contribute/gen-ref-docs/contribute-upstream)
{{% /capture %}}
