---
layout: blog
title: "Introducing SIG etcd"
slug: introducing-sig-etcd
date: 2023-11-07
canonicalUrl: https://etcd.io/blog/2023/introducing-sig-etcd/
author: >
  Han Kang (Google),
  Marek Siarkowicz (Google),
  Frederico Muñoz (SAS Institute)
---
 
Special Interest Groups (SIGs) are a fundamental part of the Kubernetes project, with a substantial share of the community activity happening within them. When the need arises, [new SIGs can be created](https://github.com/kubernetes/community/blob/master/sig-wg-lifecycle.md), and that was precisely what happened recently.

[SIG etcd](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md) is the most recent addition to the list of Kubernetes SIGs. In this article we will get to know it a bit better, understand its origins, scope, and plans.

## The critical role of etcd

If we look inside the control plane of a Kubernetes cluster, we will find [etcd](https://kubernetes.io/docs/concepts/architecture/#etcd), a consistent and highly-available key value store used as Kubernetes' backing store for all cluster data -- this description alone highlights the critical role that etcd plays, and the importance of it within the Kubernetes ecosystem.

This critical role makes the health of the etcd project and community an important consideration, and [concerns about the state of the project](https://groups.google.com/a/kubernetes.io/g/steering/c/e-O-tVSCJOk/m/N9IkiWLEAgAJ) in early 2022 did not go unnoticed. The changes in the maintainer team, amongst other factors, contributed to a situation that needed to be addressed.

## Why a special interest group

With the critical role of etcd in mind, it was proposed that the way forward would be to create a new special interest group. If etcd was already at the heart of Kubernetes, creating a dedicated SIG not only recognises that role, it would make etcd a first-class citizen of the Kubernetes community.

Establishing SIG etcd creates a dedicated space to make explicit the contract between etcd and Kubernetes api machinery and to prevent, on the etcd level, changes which violate this contract. Additionally, etcd will be able to adopt the processes that Kubernetes offers its SIGs ([KEPs](https://www.kubernetes.dev/resources/keps/), [PRR](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md), [phased feature gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/), amongst others) in order to improve the consistency and reliability of the codebase. Being able to use these processes will be a substantial benefit to the etcd community.

As a SIG, etcd will also be able to draw contributor support from Kubernetes proper: active contributions to etcd from Kubernetes maintainers would decrease the likelihood of breaking Kubernetes changes, through the increased number of potential reviewers and the integration with existing testing framework. This will not only benefit Kubernetes, which will be able to better participate and shape the direction of etcd in terms of the critical role it plays, but also etcd as a whole.

## About SIG etcd

The recently created SIG is already working towards its goals, defined in its [Charter](https://github.com/kubernetes/community/blob/master/sig-etcd/charter.md) and [Vision](https://github.com/kubernetes/community/blob/master/sig-etcd/vision.md). The purpose is clear: to ensure etcd is a reliable, simple, and scalable production-ready store for building cloud-native distributed systems and managing cloud-native infrastructure via orchestrators like Kubernetes.

The scope of SIG etcd is not exclusively about etcd as a Kubernetes component, it also covers etcd as a standard solution. Our goal is to make etcd the most reliable key-value storage to be used anywhere, unconstrained by any Kubernetes-specific limits and scaling to meet the requirements of many diverse use-cases.

We are confident that the creation of SIG etcd constitutes an important milestone in the lifecycle of the project, simultaneously improving etcd itself, and also the integration of etcd with Kubernetes. We invite everyone interested in etcd to [visit our page](https://github.com/kubernetes/community/blob/master/sig-etcd/README.md), [join us at our Slack channel](https://kubernetes.slack.com/messages/etcd), and get involved in this new stage of etcd's life.
