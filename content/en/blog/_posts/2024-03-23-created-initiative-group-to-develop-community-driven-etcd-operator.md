---
layout: blog
title: "Created initiative group to develop community-driven etcd-operator"
slug: created-initiative-group-to-develop-community-driven-etcd-operator
date: 2024-03-23
---

**Author**: Andrei Kvapil (Ænix)

I want to report the success of the organization people to create an initiative group to write a free and community-driven etcd-operator.

The essence of the experiment is to create a project from scratch that will be developed by the community. The choice of etcd is due to the fact that it is both simple and, at the same time, a sought-after technology used in many projects. Among the main adopters are [Cozystack](https://cozystack.io/) and [Kamaji](https://kamaji.clastix.io/) projects, which are focused on launching Kubernetes clusters in a native Kubernetes ecosystem.

Surprisingly, a significant number of enthusiasts were found, and currently, the project has a separate community of 100 members and around 10 regular contributors, most of whom were discovered within the [Russian-speaking Kubernetes community](https://t.me/kubernetes_ru). With the power of the community, we developed a basic spec, designed logic for bootstrapping cluster, and started writing the implementation. We have a website, tests, and a pipeline. This would not have been possible without you and your enthusiasm.

A [long path](https://github.com/orgs/aenix-io/projects/1) awaits us ahead. But the main thing is that we have assembled a team and established the process. I am confident that together we will go through it very quickly!

The project pursues two main objectives:

- We want to create a standard solution that will not be controlled by any company (even ours).
- We want to help the Russian-speaking community learn to work together with our Western colleagues to achieve common goals and to adopt their best practices for organizing free development.

For this reason, we sent [request](https://github.com/kubernetes/community/pull/7796) to join the project to Kubernetes-SIGs.

We are very pleased that our project has been warmly received in the international Kubernetes community, and at the moment, there is [active discussion](https://kubernetes.slack.com/archives/C3HD8ARJ5/p1711138820558879) about the possibility of adopting the operator under the main etcd-io project organization.
