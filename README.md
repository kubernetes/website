# The Kubernetes documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-master-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

This repository contains the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/). We're glad that you want to contribute!

## Running the website locally using Hugo

See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions. Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L10) file.

To run the website locally when you have Hugo installed:

```bash
git clone https://github.com/kubernetes/website.git
cd website
hugo server --buildFuture
```

This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.

## Get involved with SIG Docs

Learn more about SIG Docs Kubernetes community and meetings on the [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

You can also reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Contributing to the docs

You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account. This copy is called a *fork*. Make any changes you want in your fork, and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**

Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.

Furthermore, in some cases, one of your reviewers might ask for a technical review from a Kubernetes tech reviewer when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

For more information about contributing to the Kubernetes documentation, see:

* [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
* [Using Page Templates](https://kubernetes.io/docs/contribute/style/page-templates/)
* [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)

## Localization `README.md`'s

| Language  | Language |
|---|---|
|[French](README-fr.md)|[Korean](README-ko.md)|
|[German](README-de.md)|[Portuguese](README-pt.md)|
|[Hindi](README-hi.md)|[Spanish](README-es.md)|
|[Indonesian](README-id.md)|[Chinese](README-zh.md)|
|[Japanese](README-ja.md)|[Vietnamese](README-vi.md)|
|[Russian](README-ru.md)|[Italian](README-it.md)|
|[Polish](README-pl.md)|[Ukrainian](README-uk.md)|

## Code of conduct

Participation in the Kubernetes community is governed by the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).

## Thank you!

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!