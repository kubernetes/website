---
layout: blog
title: "Spotlight on SIG Docs"
date: 2022-08-02
slug: sig-docs-spotlight-2022
canonicalUrl: https://kubernetes.dev/blog/2022/08/02/sig-docs-spotlight-2022/
author: >
   Purneswar Prasad
---

## Introduction

The official documentation is the go-to source for any open source project. For Kubernetes, 
it's an ever-evolving Special Interest Group (SIG) with people constantly putting in their efforts
to make details about the project easier to consume for new contributors and users. SIG Docs publishes 
the official documentation on [kubernetes.io](https://kubernetes.io) which includes, 
but is not limited to, documentation of the core APIs, core architectural details, and CLI tools 
shipped with the Kubernetes release. 

To learn more about the work of SIG Docs and its future ahead in shaping the community, I have summarised 
my conversation with the co-chairs, [Divya Mohan](https://twitter.com/Divya_Mohan02) (DM), 
[Rey Lejano](https://twitter.com/reylejano) (RL) and Natali Vlatko (NV), who ran through the
SIG's goals and how fellow contributors can help.

## A summary of the conversation

### Could you tell us a little bit about what SIG Docs does?

SIG Docs is the special interest group for documentation for the Kubernetes project on kubernetes.io, 
generating reference guides for the Kubernetes API, kubeadm and kubectl as well as maintaining the official 
website’s infrastructure and analytics. The remit of their work also extends to docs releases, translation of docs, 
improvement and adding new features to existing documentation, pushing and reviewing content for the official 
Kubernetes blog and engaging with the Release Team for each cycle to get docs and blogs reviewed.


### There are 2 subprojects under Docs: blogs and localization. How has the community benefited from it and are there some interesting contributions by those teams you want to highlight?

**Blogs**: This subproject highlights new or graduated Kubernetes enhancements, community reports, SIG updates 
or any relevant news to the Kubernetes community such as thought leadership, tutorials and project updates, 
such as the Dockershim removal and removal of PodSecurityPolicy, which is upcoming in the 1.25 release.
Tim Bannister, one of the SIG Docs tech leads, does awesome work and is a major force when pushing contributions 
through to the docs and blogs.

**Localization**: With this subproject, the Kubernetes community has been able to achieve greater inclusivity 
and diversity among both users and contributors. This has also helped the project gain more contributors, 
especially students, since a couple of years ago.
One of the major highlights and up-and-coming localizations are Hindi and Bengali. The efforts for Hindi 
localization are currently being spearheaded by students in India.

In addition to that, there are two other subprojects: [reference-docs](https://github.com/kubernetes-sigs/reference-docs) and the [website](https://github.com/kubernetes/website), which is built with Hugo and is an important ownership area.

### Recently there has been a lot of buzz around the Kubernetes ecosystem as well as the industry regarding the removal of dockershim in the latest 1.24 release. How has SIG Docs helped the project to ensure a smooth change among the end-users? {#dockershim-removal}

Documenting the removal of Dockershim was a mammoth task, requiring the revamping of existing documentation 
and communicating to the various stakeholders regarding the deprecation efforts. It needed a community effort, 
so ahead of the 1.24 release, SIG Docs partnered with Docs and Comms verticals, the Release Lead from the 
Release Team, and also the CNCF to help put the word out. Weekly meetings and a GitHub project board were 
set up to track progress, review issues and approve PRs and keep the Kubernetes website updated. This has 
also helped new contributors know about the depreciation, so that if any good-first-issue pops up, they could chip in. 
A dedicated Slack channel was used to communicate meeting updates, invite feedback or to solicit help on 
outstanding issues and PRs. The weekly meeting also continued for a month after the 1.24 release to review related issues and fix them.
A huge shoutout to [Celeste Horgan](https://twitter.com/celeste_horgan), who kept the ball rolling on this 
conversation throughout the deprecation process.

### Why should new and existing contributors consider joining this SIG?

Kubernetes is a vast project and can be intimidating at first for a lot of folks to find a place to start. 
Any open source project is defined by its quality of documentation and SIG Docs aims to be a welcoming, 
helpful place for new contributors to get onboard. One gets the perks of working with the project docs 
as well as learning by reading it. They can also bring their own, new perspective to create and improve 
the documentation. In the long run if they stick to SIG Docs, they can rise up the ladder to be maintainers. 
This will help make a big project like Kubernetes easier to parse and navigate. 

### How do you help new contributors get started? Are there any prerequisites to join?

There are no such prerequisites to get started with contributing to Docs. But there is certainly a fantastic 
Contribution to Docs guide which is always kept as updated and relevant as possible and new contributors 
are urged to read it and keep it handy. Also, there are a lot of useful pins and bookmarks in the 
community Slack channel [#sig-docs](https://kubernetes.slack.com/archives/C1J0BPD2M). GitHub issues with 
the good-first-issue labels in the kubernetes/website repo is a great place to create your first PR.
Now, SIG Docs has a monthly New Contributor Meet and Greet on the first Tuesday of the month with the 
first occupant of the New Contributor Ambassador role, [Arsh Sharma](https://twitter.com/RinkiyaKeDad). 
This has helped in making a more accessible point of contact within the SIG for new contributors.

### Any SIG related accomplishment that you’re really proud of?

**DM & RL** : The formalization of the localization subproject in the last few months has been a big win 
for SIG Docs, given all the great work put in by contributors from different countries. Earlier the 
localization efforts didn’t have any streamlined process and focus was given to provide a structure by 
drafting a KEP over the past couple of months for localization to be formalized as a subproject, which 
is planned to be pushed through by the end of third quarter.

**DM** : Another area where there has been a lot of success is the New Contributor Ambassador role, 
which has helped in making a more accessible point of contact for the onboarding of new contributors into the project.

**NV** : For each release cycle, SIG Docs have to review release docs and feature blogs highlighting 
release updates within a short window. This is always a big effort for the docs and blogs reviewers. 

### Is there something exciting coming up for the future of SIG Docs that you want the community to know?

SIG Docs is now looking forward to establishing a roadmap, having a steady pipeline of folks being able 
to push improvements to the documentation and streamlining community involvement in triaging issues and 
reviewing PRs being filed. To build one such contributor and reviewership base, a mentorship program is 
being set up to help current contributors become reviewers. This definitely is a space to watch out for more!


## Wrap Up

SIG Docs hosted a [deep dive talk](https://www.youtube.com/watch?v=GDfcBF5et3Q) 
during  on KubeCon + CloudNativeCon North America 2021, covering their awesome SIG. 
They are very welcoming and have been the starting ground into Kubernetes 
for a lot of new folks who want to contribute to the project. 
Join the [SIG's meetings](https://github.com/kubernetes/community/blob/master/sig-docs/README.md) to find out 
about the most recent research results, their plans for the forthcoming year, and how to get involved in the upstream Docs team as a contributor!
