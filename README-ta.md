# குபெர்னெட்ஸ் ஆவணங்கள்

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

வரவேற்பு! இந்த களஞ்சியத்தில் [குபெர்னெட்ஸ் வலைத்தளம் மற்றும் ஆவணங்களை](https://kubernetes.io/) உருவாக்க தேவையான அனைத்து சொத்துக்களும் உள்ளன. நீங்கள் பங்களிக்க விரும்புவதில் நாங்கள் மகிழ்ச்சியடைகிறோம்!

## அவங்களுக்கு பங்களிக்க

உங்கள் கிட்ஹப் கணக்கில் இந்த களஞ்சியத்தின் நகலை உருவாக்க திரையின் மேல்-வலது பகுதியில் உள்ள **ஃபோர்க்** பொத்தானைக் கிளிக் செய்யலாம். இந்த நகலை **ஃபோர்க்** என்று அழைக்கப்படுகிறது. உங்கள் ஃபோர்க் நீங்கள் விரும்பும் எந்த மாற்றங்களையும் செய்யுங்கள், அந்த மாற்றங்களை எங்களுக்கு அனுப்ப நீங்கள் தயாராக இருக்கும்போது, உங்கள் ஃபோர்க் சென்று புதிய புல் கோரிக்கையை உருவாக்கி அதைப் பற்றி எங்களுக்குத் தெரியப்படுத்துங்கள்.

Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.  As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**  Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback. Furthermore, in some cases, one of your reviewers might ask for a technical review from a [Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers) when needed.  Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.

For more information about contributing to the Kubernetes documentation, see:

* [Start contributing](https://kubernetes.io/docs/contribute/start/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Using Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Documentation Style Guide](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)

## Localization `README.md`'s
|  |  |
|---|---|
|[French README](README-fr.md)|[Korean README](README-ko.md)|
|[German README](README-de.md)|[Portuguese README](README-pt.md)|
|[Hindi README](README-hi.md)|[Spanish README](README-es.md)|
|[Indonesian README](README-id.md)|[Chinese README](README-zh.md)|
|[Japanese README](README-ja.md)|[Vietnamese README](README-vi.md)|
|[Russian README](README-ru.md)|[Italian README](README-it.md)|
|[Polish README](README-pl.md)||
|||

## Running the website locally using Docker

The recommended way to run the Kubernetes website locally is to run a specialized [Docker](https://docker.com) image that includes the [Hugo](https://gohugo.io) static website generator.

> If you are running on Windows, you'll need a few more tools which you can install with [Chocolatey](https://chocolatey.org). `choco install make`

> If you'd prefer to run the website locally without Docker, see [Running the website locally using Hugo](#running-the-website-locally-using-hugo) below.

If you have Docker [up and running](https://www.docker.com/get-started), build the `kubernetes-hugo` Docker image locally:

```bash
make docker-image
```

Once the image has been built, you can run the website locally:

```bash
make docker-serve
```

Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.

## Running the website locally using Hugo

See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions. Make sure to install the Hugo extended version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L9) file.

To run the website locally when you have Hugo installed:

```bash
make serve
```

This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.

## Community, discussion, contribution, and support

Learn how to engage with the Kubernetes community on the [community page](http://kubernetes.io/community/).

You can reach the maintainers of this project at:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Code of conduct

Participation in the Kubernetes community is governed by the [Kubernetes Code of Conduct](code-of-conduct.md).

## Thank you!

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
