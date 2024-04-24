---
title: Generating Reference Documentation for the Kubernetes API
content_type: task
weight: 50
---

<!-- overview -->

This page shows how to update the Kubernetes API reference documentation.

The Kubernetes API reference documentation is built from the
[Kubernetes OpenAPI spec](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json)
using the [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) generation code.

If you find bugs in the generated documentation, you need to
[fix them upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

If you need only to regenerate the reference documentation from the
[OpenAPI](https://github.com/OAI/OpenAPI-Specification)
spec, continue reading this page.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Set up the local repositories

Create a local workspace and set your `GOPATH`:

```shell
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

Get a local clone of the following repositories:

```shell
go get -u github.com/kubernetes-sigs/reference-docs

go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

If you don't already have the kubernetes/website repository, get it now:

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

Get a clone of the kubernetes/kubernetes repository as k8s.io/kubernetes:

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

* The base directory of your clone of the
  [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository is
  `$GOPATH/src/k8s.io/kubernetes.`
  The remaining steps refer to your base directory as `<k8s-base>`.

* The base directory of your clone of the
  [kubernetes/website](https://github.com/kubernetes/website) repository is
  `$GOPATH/src/github.com/<your username>/website`.
  The remaining steps refer to your base directory as `<web-base>`.

* The base directory of your clone of the
  [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs)
  repository is `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
  The remaining steps refer to your base directory as `<rdocs-base>`.

## Generate the API reference docs

This section shows how to generate the
[published Kubernetes API reference documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

### Set build variables

* Set `K8S_ROOT` to `<k8s-base>`.
* Set `K8S_WEBROOT` to `<web-base>`.
* Set `K8S_RELEASE` to the version of the docs you want to build.
  For example, if you want to build docs for Kubernetes 1.17.0, set `K8S_RELEASE` to 1.17.0.

For example:

```shell
export K8S_WEBROOT=${GOPATH}/src/github.com/<your-username>/website
export K8S_ROOT=${GOPATH}/src/k8s.io/kubernetes
export K8S_RELEASE=1.17.0
```

### Create versioned directory and fetch Open API spec

The `updateapispec` build target creates the versioned build directory.
After the directory is created, the Open API spec is fetched from the
`<k8s-base>` repository. These steps ensure that the version
of the configuration files and Kubernetes Open API spec match the release version.
The versioned directory name follows the pattern of `v<major>_<minor>`.

In the `<rdocs-base>` directory, run the following build target:

```shell
cd <rdocs-base>
make updateapispec
```

### Build the API reference docs

The `copyapi` target builds the API reference and
copies the generated files to directories in `<web-base>`.
Run the following command in `<rdocs-base>`:

```shell
cd <rdocs-base>
make copyapi
```

Verify that these two files have been generated:

```shell
[ -e "<rdocs-base>/gen-apidocs/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

Go to the base of your local `<web-base>`, and
view which files have been modified:

```shell
cd <web-base>
git status
```

The output is similar to:

```
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff2
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/index.html
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/jquery.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/navData.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/scroll.js
```

## Update the API reference index pages

When generating reference documentation for a new release, update the file,
`<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` with the new
version number.

* Open `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` for editing,
  and update the API reference version number. For example:

  ```
  ---
  title: v1.17
  ---

  [Kubernetes API v1.17](/docs/reference/generated/kubernetes-api/v1.17/)
  ```

* Open `<web-base>/content/en/docs/reference/_index.md` for editing, and add a
  new link for the latest API reference. Remove the oldest API reference version.
  There should be five links to the most recent API references.

## Locally test the API reference

Publish a local version of the API reference.
Verify the [local preview](http://localhost:1313/docs/reference/generated/kubernetes-api/{{< param "version">}}/).

```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # if not already done
make container-serve
```

## Commit the changes

In `<web-base>`, run `git add` and `git commit` to commit the change.

Submit your changes as a
[pull request](/docs/contribute/new-content/open-a-pr/) to the
[kubernetes/website](https://github.com/kubernetes/website) repository.
Monitor your pull request, and respond to reviewer comments as needed. Continue
to monitor your pull request until it has been merged.

## {{% heading "whatsnext" %}}

* [Generating Reference Documentation Quickstart](/docs/contribute/generate-ref-docs/quickstart/)
* [Generating Reference Docs for Kubernetes Components and Tools](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Generating Reference Documentation for kubectl Commands](/docs/contribute/generate-ref-docs/kubectl/)
