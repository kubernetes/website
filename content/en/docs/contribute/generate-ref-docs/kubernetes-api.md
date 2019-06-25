---
title: Generating Reference Documentation for the Kubernetes API
content_template: templates/task
---

{{% capture overview %}}

This page shows how to update the generated reference docs for the Kubernetes API.
The Kubernetes API reference documentation is built from the
[Kubernetes OpenAPI spec](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)
and tools from [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).


If you find bugs in the generated documentation, you need to
[fix them upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

If you need only to regenerate the reference documentation from the [OpenAPI](https://github.com/OAI/OpenAPI-Specification)
spec, continue reading this page.

{{% /capture %}}


{{% capture prerequisites %}}

You need to have these tools installed:

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Golang](https://golang.org/doc/install) version 1.9.1 or later

You need to know how to create a pull request (PR) to a GitHub repository.
Typically, this involves creating a fork of the repository. For more
information, see
[Creating a Documentation Pull Request](/docs/contribute/start/) and
[GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

{{% /capture %}}


{{% capture steps %}}

## Set up the local repositories

```shell
export GOPATH=$HOME/<your-local-dir>

go get -u github.com/kubernetes/website
go get -u github.com/kubernetes/kubernetes
go get -u github.com/kubernetes-incubator/reference-docs

go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

The base directory of your clone of the
[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository is
`$GOPATH/src/github.com/kubernetes/kubernetes.`
The remaining steps refer to your base directory as `<k8s-base>`.

The base directory of your clone of the
[kubernetes/website](https://github.com/kubernetes/website) repository is
`$GOPATH/src/github.com/kubernetes/website.`
The remaining steps refer to your base directory as `<web-base>`.

The base directory of your clone of the
[kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs)
repository is `$GOPATH/src/github.com/kubernetes-incubator/reference-docs.`
The remaining steps refer to your base directory as `<rdocs-base>`.


Clone your fork of the kubernetes/website or create a local branch in `<web-base>`
to submit the generated API reference files.

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```
Or

```shell
cd <web-base>
git checkout -b <new-branch-name> upstream/master
```

## Generate the API reference docs

This section shows how to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

### Modify the Makefile

Go to `<rdocs-base>`, and open the `Makefile` for editing:

* Set `K8SROOT` to the base directory of your local kubernetes/kubernetes
  repository.
* Set `WEBROOT` to the base directory of your local kubernetes/website repository.
* Set `MINOR_VERSION` to the minor version of the docs you want to build. For example,
  if you want to build docs for Kubernetes 1.9, set `MINOR_VERSION` to 9. Save and close the `Makefile`.

For example, update the following variables:

```bash
WEBROOT=$(GOPATH)/src/github.com/kubernetes/website
K8SROOT=$(GOPATH)/src/github.com/kubernetes/kubernetes
MINOR_VERSION=15
```

### Copying the OpenAPI spec

Run the following command in `<rdocs-base>`:

```shell
make updateapispec
```

The output shows that the file was copied:

```shell
cp ~/src/github.com/kubernetes/kubernetes/api/openapi-spec/swagger.json gen-apidocs/generators/openapi-spec/swagger.json
```

### Building the API reference docs

Run the following command in `<rdocs-base>`:

```shell
make api
```

Verify that these two files have been generated:

* [ -e "<rdocs-base>/gen-apidocs/generators/build/index.html" ] && echo "index.html built" || echo "no index.html"
* [ -e "<rdocs-base>/gen-apidocs/generators/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"


### Creating directories for published docs

```shell
mkdir -p <web-base>/static/docs/reference/generated/kubernetes-api/v1.<minor-version>
mkdir -p <web-base>/static/docs/reference/generated/kubernetes-api/v1.<minor-version>/css
mkdir -p <web-base>/static/docs/reference/generated/kubernetes-api/v1.<minor-version>/fonts
```

## Copying the generated docs to the kubernetes/website repository

Run the following command in `<rdocs-base>` to copy the generated files to
your local kubernetes/website repository:

```shell
make copyapi
```

Go to the base of your local kubernetes/website repository, and 
see which files have been modified:

```shell
cd <web-base>
git status
```

The output shows the modified files:

```shell
static/docs/reference/generated/kubernetes-api/v1.15/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/v1.15/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/v1.15/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/v1.15/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/v1.15/fonts/fontawesome-webfont.woff2
static/docs/reference/generated/kubernetes-api/v1.15/index.html
static/docs/reference/generated/kubernetes-api/v1.15/jquery.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/v1.15/navData.js
static/docs/reference/generated/kubernetes-api/v1.15/scroll.js
```

## Updating the API reference index pages


* Open `<web-base>/content/en/docs/reference/kubernetes-api/index.md` for editing, and update the API reference 
  version number. For example:

    ```
    ---
    title: v1.15
    ---

    [Kubernetes API v1.15](/docs/reference/generated/kubernetes-api/v1.15/)
    ```

* Open `<web-base>/content/en/docs/reference/_index.md` for editing, and add a
   new link for the latest API reference. Remove the oldest API reference version.
   There should be five links to the most recent API references.


## Locally test the documentation

Build the Kubernetes documentation and verify the local preview.

```shell
cd <web-base>
make docker-serve
```

## Commit the changes

In `<web-base>` run `git add` and `git commit` to commit the change.

Submit your changes as a
[pull request](/docs/contribute/start/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.

{{% /capture %}}

{{% capture whatsnext %}}

* [Generating Reference Docs for Kubernetes Components and Tools](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/home/contribute/generated-reference/kubectl/)
* [Generating Reference Documentation for the Kubernetes Federation API](/docs/home/contribute/generated-reference/federation-api/)

{{% /capture %}}