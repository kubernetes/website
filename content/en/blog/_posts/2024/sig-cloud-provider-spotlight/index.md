---
layout: blog
title: "Spotlight on SIG Cloud Provider"
slug: sig-cloud-provider-spotlight-2024
date: 2024-03-01
canonicalUrl: https://www.k8s.dev/blog/2024/03/01/sig-cloud-provider-spotlight-2024/
author: >
  Arujjwal Negi
---

One of the most popular ways developers use Kubernetes-related services is via cloud providers, but
have you ever wondered how cloud providers can do that? How does this whole process of integration
of Kubernetes to various cloud providers happen? To answer that, let's put the spotlight on [SIG
Cloud Provider](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md).

SIG Cloud Provider works to create seamless integrations between Kubernetes and various cloud
providers. Their mission? Keeping the Kubernetes ecosystem fair and open for all. By setting clear
standards and requirements, they ensure every cloud provider plays nicely with Kubernetes. It is
their responsibility to configure cluster components to enable cloud provider integrations.

In this blog of the SIG Spotlight series, [Arujjwal Negi](https://twitter.com/arujjval) interviews
[Michael McCune](https://github.com/elmiko) (Red Hat), also known as _elmiko_, co-chair of SIG Cloud
Provider, to give us an insight into the workings of this group.

## Introduction

**Arujjwal**: Let's start by getting to know you. Can you give us a small intro about yourself and
how you got into Kubernetes?

**Michael**: Hi, I’m Michael McCune, most people around the community call me by my handle,
_elmiko_. I’ve been a software developer for a long time now (Windows 3.1 was popular when I
started!), and I’ve been involved with open-source software for most of my career. I first got
involved with Kubernetes as a developer of machine learning and data science applications; the team
I was on at the time was creating tutorials and examples to demonstrate the use of technologies like
Apache Spark on Kubernetes. That said, I’ve been interested in distributed systems for many years
and when an opportunity arose to join a team working directly on Kubernetes, I jumped at it!

## Functioning and working

**Arujjwal**: Can you give us an insight into what SIG Cloud Provider does and how it functions?

**Michael**: SIG Cloud Provider was formed to help ensure that Kubernetes provides a neutral
integration point for all infrastructure providers. Our largest task to date has been the extraction
and migration of in-tree cloud controllers to out-of-tree components. The SIG meets regularly to
discuss progress and upcoming tasks and also to answer questions and bugs that
arise. Additionally, we act as a coordination point for cloud provider subprojects such as the cloud
provider framework, specific cloud controller implementations, and the [Konnectivity proxy
project](https://kubernetes.io/docs/tasks/extend-kubernetes/setup-konnectivity/).


**Arujjwal:** After going through the project
[README](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md), I
learned that SIG Cloud Provider works with the integration of Kubernetes with cloud providers. How
does this whole process go?

**Michael:** One of the most common ways to run Kubernetes is by deploying it to a cloud environment
(AWS, Azure, GCP, etc). Frequently, the cloud infrastructures have features that enhance the
performance of Kubernetes, for example, by providing elastic load balancing for Service objects. To
ensure that cloud-specific services can be consistently consumed by Kubernetes, the Kubernetes
community has created cloud controllers to address these integration points. Cloud providers can
create their own controllers either by using the framework maintained by the SIG or by following
the API guides defined in the Kubernetes code and documentation. One thing I would like to point out
is that SIG Cloud Provider does not deal with the lifecycle of nodes in a Kubernetes cluster;
for those types of topics, SIG Cluster Lifecycle and the Cluster API project are more appropriate
venues.

## Important subprojects

**Arujjwal:** There are a lot of subprojects within this SIG. Can you highlight some of the most
important ones and what job they do?

**Michael:** I think the two most important subprojects today are the [cloud provider
framework](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md#kubernetes-cloud-provider)
and the [extraction/migration
project](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md#cloud-provider-extraction-migration). The
cloud provider framework is a common library to help infrastructure integrators build a cloud
controller for their infrastructure. This project is most frequently the starting point for new
people coming to the SIG. The extraction and migration project is the other big subproject and a
large part of why the framework exists. A little history might help explain further: for a long
time, Kubernetes needed some integration with the underlying infrastructure, not
necessarily to add features but to be aware of cloud events like instance termination. The cloud
provider integrations were built into the Kubernetes code tree, and thus the term "in-tree" was
created (check out this [article on the topic](https://kaslin.rocks/out-of-tree/) for more
info). The activity of maintaining provider-specific code in the main Kubernetes source tree was
considered undesirable by the community. The community’s decision inspired the creation of the
extraction and migration project to remove the "in-tree" cloud controllers in favor of
"out-of-tree" components.


**Arujjwal:** What makes [the cloud provider framework] a good place to start? Does it have consistent good beginner work? What
kind?

**Michael:** I feel that the cloud provider framework is a good place to start as it encodes the
community’s preferred practices for cloud controller managers and, as such, will give a newcomer a
strong understanding of how and what the managers do. Unfortunately, there is not a consistent
stream of beginner work on this component; this is due in part to the mature nature of the framework
and that of the individual providers as well. For folks who are interested in getting more involved,
having some [Go language](https://go.dev/) knowledge is good and also having an understanding of
how at least one cloud API (e.g., AWS, Azure, GCP) works is also beneficial. In my personal opinion,
being a newcomer to SIG Cloud Provider can be challenging as most of the code around this project
deals directly with specific cloud provider interactions. My best advice to people wanting to do
more work on cloud providers is to grow your familiarity with one or two cloud APIs, then look
for open issues on the controller managers for those clouds, and always communicate with the other
contributors as much as possible.

## Accomplishments

**Arujjwal:** Can you share about an accomplishment(s) of the SIG that you are proud of?

**Michael:** Since I joined the SIG, more than a year ago, we have made great progress in advancing
the extraction and migration subproject. We have moved from an alpha status on the defining
[KEP](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) to a beta status and
are inching ever closer to removing the old provider code from the Kubernetes source tree. I've been
really proud to see the active engagement from our community members and to see the progress we have
made towards extraction. I have a feeling that, within the next few releases, we will see the final
removal of the in-tree cloud controllers and the completion of the subproject.

## Advice for new contributors

**Arujjwal:** Is there any suggestion or advice for new contributors on how they can start at SIG
Cloud Provider?

**Michael:** This is a tricky question in my opinion. SIG Cloud Provider is focused on the code
pieces that integrate between Kubernetes and an underlying infrastructure. It is very common, but
not necessary, for members of the SIG to be representing a cloud provider in an official capacity. I
recommend that anyone interested in this part of Kubernetes should come to an SIG meeting to see how
we operate and also to study the cloud provider framework project. We have some interesting ideas
for future work, such as a common testing framework, that will cut across all cloud providers and
will be a great opportunity for anyone looking to expand their Kubernetes involvement.

**Arujjwal:** Are there any specific skills you're looking for that we should highlight? To give you
an example from our own [SIG ContribEx]
(https://github.com/kubernetes/community/blob/master/sig-contributor-experience/README.md):
if you're an expert in [Hugo](https://gohugo.io/), we can always use some help with k8s.dev!

**Michael:** The SIG is currently working through the final phases of our extraction and migration
process, but we are looking toward the future and starting to plan what will come next. One of the
big topics that the SIG has discussed is testing. Currently, we do not have a generic common set of
tests that can be exercised by each cloud provider to confirm the behaviour of their controller
manager. If you are an expert in Ginkgo and the Kubetest framework, we could probably use your help
in designing and implementing the new tests.

---

This is where the conversation ends. I hope this gave you some insights about SIG Cloud Provider's
aim and working. This is just the tip of the iceberg. To know more and get involved with SIG Cloud
Provider, try attending their meetings
[here](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md#meetings).
