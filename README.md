# The Kubernetes documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys)&nbsp;[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Welcome! This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad you're interested in contributing.

## Table of Contents
 - [Using This Repository](#using-this-repository)
 - [Prerequisites](#prerequisites)
 - [Running the Website](#running-the-website)
 - [Building the API Reference Pages](#building-the-api-reference-pages)
 - [Troubleshooting](#troubleshooting)
 - [Get Involved with SIG Docs](#get-involved-with-sig-docs)
 - [Contributing to the Docs](#contributing-to-the-docs)
 - [Localization READMEs](#localization-readmes)
 - [Code of Conduct](#code-of-conduct)
 - [Thank You!](#thank-you)



## Using this repository

You can run the website locally using [Hugo (Extended version)](https://gohugo.io/), or in a container runtime (recommended for deployment consistency with the live site).

## Prerequisites

To use this repository, you will need:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- A container runtime, like [Docker](https://www.docker.com/).

>  [!NOTE]
  Ensure you install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L11).

## Running the Website

### Initial Setup

1. **Clone the Repository**:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

>[!Note]
The Kubernetes website uses the [Docsy Hugo theme](https://github.com/google/docsy#readme).So, pulling in submodule is strongly recommended.

2. **Initialize Submodules and Dependencies**:

- **Windows**:

```bash
git submodule update --init --recursive --depth 1
```

- **Linux / Unix**:

```bash
make module-init
```

### Running using a container

1. **Build the site**:

```bash
# You can set $CONTAINER_ENGINE to the name of any Docker-like container tool
make container-serve
```
2. Open <http://localhost:1313> in a browser to view the website.

>[!Note]
If you see errors, increase the amount of allowed CPU and memory usage for Docker on your machine ([MacOS](https://docs.docker.com/desktop/settings/mac/) and [Windows](https://docs.docker.com/desktop/settings/windows/)).

### Running Locally using Hugo

To install dependencies, deploy and test the site:

- **macOS/Linux**:

```bash
npm ci
make serve
```

- **Windows (PowerShell)**:

```powershell
npm ci
hugo.exe server --buildFuture --environment development
```

Visit <http://localhost:1313> to see your changes.


## Updating API Reference Pages

The API reference pages are built from the Swagger (OpenAPI) specification using [gen-resourcesdocs](https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs).

### Steps to Update for a New Kubernetes Release:

1. **Pull in the api-ref-generator submodule**:
```bash
git submodule update --init --recursive --depth 1
```

2. **Update the Swagger specification**:

```bash
curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
```

3. **Update the configuration files** (`toc.yaml` and `fields.yaml`) in `api-ref-assets/config/` to reflect the new release.

4. **Build the pages**:

```bash
make api-reference
```

5. **Test locally by serving the site**:

```bash
make container-serve
```

View at:<http://localhost:1313/docs/reference/kubernetes-api/>

6. Once everything is updated, create a Pull Request with the new API reference pages.


## Troubleshooting

### TOCSS Error  
-This issue occurs if the Hugo Extended version isn’t installed. Verify it shows `extended` by running:

```bash
hugo version
```

-In the [release page](https://github.com/gohugoio/hugo/releases) look for archives with `extended` in the name.

### Too Many Open Files(macOS)
-Check the open file limit:
```bash
launchctl limit maxfiles
```

-Follow the [gist instructions](https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c) to increase the limit.



## Get involved with SIG Docs

Learn more about [SIG Doc](https://github.com/kubernetes/community/blob/master/sig-docs/README.md) and join the Kubernetes community on Slack.

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)


## Contributing to the Docs
Click the **Fork** button to create a copy of this repository in your GitHub account. Make any changes in your fork and, when ready, create a pull request.

Once submitted, a Kubernetes reviewer will provide feedback. As the PR owner, you are responsible for modifying the PR as needed.

> [!Note]: Multiple reviewers may provide feedback. Reviewers will try to respond promptly, but response time may vary.


For more information about contributing to the Kubernetes documentation, see:

- [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
- [Introduction to Kubernetes Docs](https://www.youtube.com/watch?v=pprMgmNzDcw)


**New contributor ambassadors**

If you need help while contributing, the [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) are SIG Docs approvers who mentor new contributors. Contact them via [Kubernetes Slack](https://slack.k8s.io/). Current Ambassadors for SIG Docs:

| Name                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |

---

## Localization READMEs

| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Bengali](./content/bn/README.md)    | [Korean](./content/ko/README.md)    |
| [Chinese](./content/zh-cn/README.md)    | [Polish](./content/pl/README.md)    |
| [French](./content/fr/README.md)     | [Portuguese](./content/pt-br/README.md)    |
| [German](./content/de/README.md)     | [Russian](./content/ru/README.md)    |
| [Hindi](./content/hi/README.md)      | [Spanish](./content/es/README.md)    |
| [Indonesian](./content/id/README.md) | [Ukrainian](./content/uk/README.md) |
| [Italian](./content/it/README.md)    | [Vietnamese](./content/vi/README.md) |
| [Japanese](./content/ja/README.md)   | |



## Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).


## Thank you!

Thank you for contributing to Kubernetes! Your support and participation make a difference.
