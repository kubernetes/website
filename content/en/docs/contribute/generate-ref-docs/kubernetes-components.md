---
title: Generating Reference Pages for Kubernetes Components and Tools
content_template: templates/task
---

{{% capture overview %}}

This page shows how to use the `update-imported-docs` tool to generate
reference documentation for tools and components in the
[Kubernetes](https://github.com/kubernetes/kubernetes) repository.

{{% /capture %}}

{{% capture prerequisites %}}

* You need a machine that is running Linux or macOS.

* You need to have this software installed:

    * [Python 2.7.16](https://www.python.org/downloads/)
    * [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    * [Golang](https://golang.org/doc/install) version 1.12 for Kubernetes 1.14+; Go 1.13 [is not supported](https://github.com/kubernetes/community/blob/master/contributors/devel/development.md#go)
    * [PyYAML](https://pyyaml.org/) v3.13
    * [make](https://www.gnu.org/software/make/)
    * [gcc compiler/linker](https://gcc.gnu.org/)

* The Go binary must be in your path; **do not** set your `$GOPATH`. The `update-imported-docs` tool sets your GOPATH.

* You need to know how to create a pull request to a GitHub repository.
This involves creating your own fork of the repository. For more
information, see [Work from a local clone](/docs/contribute/intermediate/#work_from_a_local_clone).

{{% /capture %}}

{{% capture steps %}}

## Getting the repository

Make sure your `website` fork is up-to-date with the `kubernetes/website` master and then clone your `website` fork.

```shell
mkdir github.com
cd github.com
git clone git@github.com:<your_github_username>/website.git
```

Determine the base directory of your clone. For example, if you followed the
preceding step to get the repository, your base directory is
`$github.com/website.` The remaining steps refer to your base directory as
`<web-base>`.

The reference documentation for the Kubernetes components and tools is generated
from the Kubernetes source code. The `update-imported-docs` tool automatically
clones the `kubernetes/kubernetes` repository. If you want to change the
reference documentation, please follow [this
guide](/docs/contribute/generate-ref-docs/contribute-upstream).

## Overview of update-imported-docs

The `update-imported-docs` tool is located in the `kubernetes/website/update-imported-docs/`
directory. The tool consists of a Python script that reads a YAML configuration file and performs the following steps:

1. Clones the related repositories specified in a configuration file. For the
   purpose of generating reference docs, the repository that is cloned by
   default is `kubernetes-sigs/reference-docs`.
1. Runs commands under the cloned repositories to prepare the docs generator and
   then generates the Markdown files.
1. Copies the generated Markdown files to a local clone of the `kubernetes/website`
   repository under locations specified in the configuration file.
1. Updates `kubectl` command links from `kubectl`.md to the `kubectl` command reference.

When the Markdown files are in your local clone of the `kubernetes/website`
repository, you can submit them in a [pull request](/docs/contribute/start/)
to `kubernetes/website`.

## Configuration file format

Each config file may contain multiple repos that will be imported together.
When necessary, you can customize the configuration file by manually editing
it. You may create new config files for importing other groups of documents. Imported documents must follow these guidelines:

1. Adhere to the [Documentation Style Guide](/docs/contribute/style/style-guide/).

1. Have `title` defined in the front matter. For example:

    ```
    ---
    title: Title Displayed in Table of Contents
    ---

    Rest of the .md file...
    ```
1. Be listed in the `kubernetes/website/data/reference.yml` file

The following is an example of the YAML configuration file:

```yaml
repos:
- name: community
  remote: https://github.com/kubernetes/community.git
  branch: master
  files:
  - src: contributors/devel/README.md
    dst: docs/imported/community/devel.md
  - src: contributors/guide/README.md
    dst: docs/imported/community/guide.md
```

Note: `generate-command` is an optional entry, which can be used to run a
given command or a short script to generate the docs from within a repo.

## Customizing the reference.yml config file

Open `<web-base>/update-imported-docs/reference.yml` for editing.
Do not change the content for the `generate-command` entry unless you understand
what it is doing and need to change the specified release branch.

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-sigs/reference-docs.git
  # This and the generate-command below needs a change when reference-docs has
  # branches properly defined
  branch: master
  generate-command: |
    cd $GOPATH
    git clone https://github.com/kubernetes/kubernetes.git src/k8s.io/kubernetes
    cd src/k8s.io/kubernetes
    git checkout release-1.16
    make generated_files
    cp -L -R vendor $GOPATH/src
    rm -r vendor
    cd $GOPATH
    go get -v github.com/kubernetes-sigs/reference-docs/gen-compdocs
    cd src/github.com/kubernetes-sigs/reference-docs/
    make comp
```

In reference.yml, the `files` field is a list of `src` and `dst` fields. The `src` field
specifies the location of a generated Markdown file, and the `dst` field specifies
where to copy this file in the cloned `kubernetes/website` repository.
For example:

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-sigs/reference-docs.git
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

## Fixing Links

To fix relative links within your imported files, set the repo config's
`gen-absolute-links` property to `true`. You can find an example of this in
[`release.yml`](https://github.com/kubernetes/website/blob/master/update-imported-docs/release.yml).

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
    modified:   content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-proxy.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
    modified:   content/en/docs/reference/setup-tools/kubeadm/generated/kubeadm.md
    modified:   content/en/docs/reference/kubectl/kubectl.md
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

* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Contributing to the Upstream Kubernetes Project for Documentation](/docs/contribute/generate-ref-docs/contribute-upstream/)
{{% /capture %}}
