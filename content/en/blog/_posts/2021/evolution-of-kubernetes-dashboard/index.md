---
layout: blog
title: "The Evolution of Kubernetes Dashboard"
date: 2021-03-09
slug: the-evolution-of-kubernetes-dashboard
author: >
  Marcin Maciaszczyk (Kubermatic),
  Sebastian Florek (Kubermatic)
---

In October 2020, the Kubernetes Dashboard officially turned five. As main project maintainers, we can barely believe that so much time has passed since our very first commits to the project. However, looking back with a bit of nostalgia, we realize that quite a lot has happened since then. Now it’s due time to celebrate “our baby” with a short recap.

## How It All Began

The initial idea behind the Kubernetes Dashboard project was to provide a web interface for Kubernetes. We wanted to reflect the kubectl functionality through an intuitive web UI. The main benefit from using the UI is to be able to quickly see things that do not work as expected (monitoring and troubleshooting). Also, the Kubernetes Dashboard is a great starting point for users that are new to the Kubernetes ecosystem.

The very [first commit](https://github.com/kubernetes/dashboard/commit/5861187fa807ac1cc2d9b2ac786afeced065076c) to the Kubernetes Dashboard was made by Filip Grządkowski from Google on 16th October 2015 – just a few months from the initial commit to the Kubernetes repository. Our initial commits go back to November 2015 ([Sebastian committed on 16 November 2015](https://github.com/kubernetes/dashboard/commit/09e65b6bb08c49b926253de3621a73da05e400fd); [Marcin committed on 23 November 2015](https://github.com/kubernetes/dashboard/commit/1da4b1c25ef040818072c734f71333f9b4733f55)). Since that time, we’ve become regular contributors to the project. For the next two years, we worked closely with the Googlers, eventually becoming main project maintainers ourselves.

{{< figure src="first-ui.png" caption="The First Version of the User Interface" >}}

{{< figure src="along-the-way-ui.png" caption="Prototype of the New User Interface" >}}

{{< figure src="current-ui.png" caption="The Current User Interface" >}}

As you can see, the initial look and feel of the project were completely different from the current one. We have changed the design multiple times. The same has happened with the code itself.

## Growing Up - The Big Migration

At [the beginning of 2018](https://github.com/kubernetes/dashboard/pull/2727), we reached a point where AngularJS was getting closer to the end of its life, while the new Angular versions were published quite often. A lot of the libraries and the modules that we were using were following the trend. That forced us to spend a lot of the time rewriting the frontend part of the project to make it work with newer technologies.

The migration came with many benefits like being able to refactor a lot of the code, introduce design patterns, reduce code complexity, and benefit from the new modules. However, you can imagine that the scale of the migration was huge. Luckily, there were a number of contributions from the community helping us with the resource support, new Kubernetes version support, i18n, and much more. After many long days and nights, we finally released the [first beta version](https://github.com/kubernetes/dashboard/releases/tag/v2.0.0-beta1) in July 2019, followed by the [2.0 release](https://github.com/kubernetes/dashboard/releases/tag/v2.0.0) in April 2020 — our baby had grown up.

## Where Are We Standing in 2021?

Due to limited resources, unfortunately, we were not able to offer extensive support for many different Kubernetes versions. So, we’ve decided to always try and support the latest Kubernetes version available at the time of the Kubernetes Dashboard release. The latest release, [Dashboard v2.2.0](https://github.com/kubernetes/dashboard/releases/tag/v2.2.0) provides support for Kubernetes v1.20.

On top of that, we put in a great deal of effort into [improving resource support](https://github.com/kubernetes/dashboard/issues/5232). Meanwhile, we do offer support for most of the Kubernetes resources. Also, the Kubernetes Dashboard supports multiple languages: English, German, French, Japanese, Korean, Chinese (Traditional, Simplified, Traditional Hong Kong). Persian and Russian localizations are currently in progress. Moreover, we are working on the support for 3rd party themes and the design of the app in general. As you can see, quite a lot of things are going on.

Luckily, we do have regular contributors with domain knowledge who are taking care of the project, updating the Helm charts, translations, Go modules, and more. But as always, there could be many more hands on deck. So if you are thinking about contributing to Kubernetes, keep us in mind ;)

## What’s Next

The Kubernetes Dashboard has been growing and prospering for more than 5 years now. It provides the community with an intuitive Web UI, thereby decreasing the complexity of Kubernetes and increasing its accessibility to new community members. We are proud of what the project has achieved so far, but this is by far not the end. These are our priorities for the future:

*   Keep providing support for the new Kubernetes versions
*   Keep improving the support for the existing resources
*   Keep working on auth system improvements
*   [Rewrite the API to use gRPC and shared informers](https://github.com/kubernetes/dashboard/pull/5449): This will allow us to improve the performance of the application but, most importantly, to support live updates coming from the Kubernetes project. It is one of the most requested features from the community.
*   Split the application into two containers, one with the UI and the second with the API running inside.

## The Kubernetes Dashboard in Numbers

* Initial commit made on October 16, 2015
* Over 100 million pulls from Dockerhub since the v2 release
* 8 supported languages and the next 2 in progress
* Over 3360 closed PRs
* Over 2260 closed issues
* 100% coverage of the supported core Kubernetes resources
* Over 9000 stars on GitHub
* Over 237 000 lines of code

## Join Us

As mentioned earlier, we are currently looking for more people to help us further develop and grow the project. We are open to contributions in multiple areas, i.e., [issues with help wanted label](https://github.com/kubernetes/dashboard/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22). Please feel free to reach out via GitHub or the #sig-ui channel in the [Kubernetes Slack](https://slack.k8s.io/).
