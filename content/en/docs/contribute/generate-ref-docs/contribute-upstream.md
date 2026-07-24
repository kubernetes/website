---
title: Contributing to the Upstream Kubernetes Code
content_type: task
weight: 20
---

<!-- overview -->

This page shows how to contribute to the upstream `kubernetes/kubernetes` project.
You can fix bugs found in the Kubernetes API documentation or the content of
the Kubernetes components such as `kubeadm`, `kube-apiserver`, and `kube-controller-manager`.

If you instead want to regenerate the reference documentation for the Kubernetes
API or the `kube-*` components from the upstream code, see the following instructions:

- [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Generating Reference Documentation for the Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## The big picture

The reference documentation for the Kubernetes API and the `kube-*` components
such as `kube-apiserver`, `kube-controller-manager` are automatically generated
from the source code in the [upstream Kubernetes](https://github.com/kubernetes/kubernetes/).

When you see bugs in the generated documentation, you may want to consider
creating a patch to fix it in the upstream project.

## Clone the Kubernetes repository

If you don't already have the 'kubernetes/kubernetes' repository, You need a local clone.

```shell
git clone https://github.com/kubernetes/kubernetes
```

## Edit the Kubernetes source code

The Kubernetes API reference documentation is automatically generated from
an OpenAPI spec, which is generated from the Kubernetes source code. If you
want to change the API reference documentation, the first step is to change one
or more comments in the Kubernetes source code.

The documentation for the `kube-*` components is also generated from the upstream
source code. You must change the code related to the component
you want to fix in order to fix the generated documentation.

### Make changes to the upstream source code

{{< note >}}
The following steps are an example, not a general procedure. Details
will be different in your situation.
{{< /note >}}

Here's an example of editing a comment in the Kubernetes source code.

In your local kubernetes/kubernetes repository, check out the default branch,
and make sure it is up to date:

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

Suppose this source file in that default branch has the typo "atmost":

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

### Commit your edited file

Run `git add` and `git commit` to commit the changes you have made so far. In the next step,
you will do a second commit. It is important to keep your changes separated into two commits.

### Generate the OpenAPI spec and related files

Go to `<k8s-base>` and run these scripts:

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

Run `git status` to see what was generated.

```shell
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/openapi-spec/v3/apis__apps__v1_openapi.json
    modified:   pkg/generated/openapi/zz_generated.openapi.go
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

View the contents of `api/openapi-spec/swagger.json` to make sure the typo is fixed.
For example, you could run `git diff -a api/openapi-spec/swagger.json`.
This is important, because `swagger.json` is the input to the second stage of
the doc generation process.

Run `git add` and `git commit` to commit your changes. Now you have two commits:
one that contains the edited `types.go` file, and one that contains the generated OpenAPI spec
and related files. Keep these two commits separate. That is, do not squash your commits.

Submit your changes as a
[pull request](https://help.github.com/articles/creating-a-pull-request/) to the
master branch of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it is merged.

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758)
is an example of a pull request that fixes a typo in the Kubernetes source code.

{{< note >}}
It can be tricky to determine the correct source file to be changed. In the
preceding example, the authoritative source file is in the `staging` directory
in the `kubernetes/kubernetes` repository. But in your situation,the `staging` directory
might not be the place to find the authoritative source. For guidance, check the
`README` files in
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging)
repository and in related repositories, such as
[kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{{< /note >}}

### Cherry pick your commit into a release branch

Now that your change is merged into master, you may want to backport it to a release branch — say, release-{{< skew prevMinorVersion >}}, while master moves on to {{< skew latestVersion >}}.

Cherry-pick just the `types.go` commit (not the generated-files commit) into the release branch. See [Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md) for the process — you'll need label/milestone permissions, or help from someone who has them.

Once that pull request is open, switch to the release-{{< skew prevMinorVersion >}} branch locally, run the generation scripts again, and add the output as a second commit:

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

Keep in mind the generated files won't match exactly between branches — release-{{< skew prevMinorVersion >}} only reflects its own API surface, while master may already include newer elements still in development for {{< skew latestVersion >}}.

## Generate the published reference docs

The preceding section showed how to edit a source file and then generate
several files, including `api/openapi-spec/swagger.json` in the
`kubernetes/kubernetes` repository.
The `swagger.json` file is the OpenAPI definition file to use for generating
the API reference documentation.

You are now ready to follow the
[Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
guide to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

## {{% heading "whatsnext" %}}

* [Generating Reference Documentation for the Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
