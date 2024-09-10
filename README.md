# The Kubernetes documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad that you want to contribute!

- [Contributing to the docs](#contributing-to-the-docs)
- [Localization READMEs](#localization-readmes)

## Using this repository

You can run the website locally using [Hugo (Extended version)](https://gohugo.io/), or you can run it in a container runtime. We strongly recommend using the container runtime, as it gives deployment consistency with the live website.

## Prerequisites

To use this repository, you need the following installed locally:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- A container runtime, like [Docker](https://www.docker.com/).

> [!NOTE]
Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L11) file.

Before you start, install the dependencies. Clone the repository and navigate to the directory:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

The Kubernetes website uses the [Docsy Hugo theme](https://github.com/google/docsy#readme). Even if you plan to run the website in a container, we strongly recommend pulling in the submodule and other development dependencies by running the following:

### Windows

```powershell
# fetch submodule dependencies
git submodule update --init --recursive --depth 1
```

### Linux / other Unix

```bash
# fetch submodule dependencies
make module-init
```

## Running the website using a container

To build the site in a container, run the following:

```bash
# You can set $CONTAINER_ENGINE to the name of any Docker-like container tool
make container-serve
```

If you see errors, it probably means that the hugo container did not have enough computing resources available. To solve it, increase the amount of allowed CPU and memory usage for Docker on your machine ([MacOS](https://docs.docker.com/desktop/settings/mac/) and [Windows](https://docs.docker.com/desktop/settings/windows/)).

Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.

## Running the website locally using Hugo

To install dependencies, deploy and test the site locally, run:

- For macOS and Linux

  ```bash
  npm ci
  make serve
  ```

- For Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

This will start the local Hugo server on port 1313. Open up your browser to <http://localhost:1313> to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.

## Building the API reference pages

The API reference pages located in `content/en/docs/reference/kubernetes-api` are built from the Swagger specification, also known as OpenAPI specification, using <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

To update the reference pages for a new Kubernetes release follow these steps:

1. Pull in the `api-ref-generator` submodule:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Update the Swagger specification:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. In `api-ref-assets/config/`, adapt the files `toc.yaml` and `fields.yaml` to reflect the changes of the new release.

4. Next, build the pages:

   ```bash
   make api-reference
   ```

   You can test the results locally by building and serving the site from a container:

   ```bash
   make container-serve
   ```

   In a web browser, go to <http://localhost:1313/docs/reference/kubernetes-api/> to view the API reference.

5. When all changes of the new contract are reflected into the configuration files `toc.yaml` and `fields.yaml`, create a Pull Request with the newly generated API reference pages.

## Troubleshooting

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo is shipped in two set of binaries for technical reasons. The current website runs based on the **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases) look for archives with `extended` in the name. To confirm, run `hugo version` and look for the word `extended`.

### Troubleshooting macOS for too many open files

If you run `make serve` on macOS and receive the following error:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Try checking the current limit for open files:

`launchctl limit maxfiles`

Then run the following commands (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

This works for Catalina as well as Mojave macOS.

## Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a _fork_. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback. As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**

Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed. Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

For more information about contributing to the Kubernetes documentation, see:

- [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
- [Introduction to Kubernetes Docs](https://www.youtube.com/watch?v=pprMgmNzDcw)

### New contributor ambassadors

If you need help at any point when contributing, the [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) are a good point of contact. These are SIG Docs approvers whose responsibilities include mentoring new contributors and helping them through their first few pull requests. The best place to contact the New Contributors Ambassadors would be on the [Kubernetes Slack](https://slack.k8s.io/). Current New Contributors Ambassadors for SIG Docs:

| Name                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |

## Localization READMEs

| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Bengali](README-bn.md)    | [Korean](README-ko.md)     |
| [Chinese](README-zh.md)    | [Polish](README-pl.md)     |
| [French](README-fr.md)     | [Portuguese](README-pt.md) |
| [German](README-de.md)     | [Russian](README-ru.md)    |
| [Hindi](README-hi.md)      | [Spanish](README-es.md)    |
| [Indonesian](README-id.md) | [Ukrainian](README-uk.md)  |
| [Italian](README-it.md)    | [Vietnamese](README-vi.md) |
| [Japanese](README-ja.md)   | |

## Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).

## Thank you

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
