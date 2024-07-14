---
layout: blog
title: "Introducing KWOK: Kubernetes WithOut Kubelet"
date: 2023-03-01
slug: introducing-kwok
canonicalUrl: https://kubernetes.dev/blog/2023/03/01/introducing-kwok/
author: >
  Shiming Zhang (DaoCloud),
  Wei Huang (Apple),
  Yibo Zhuang (Apple)
---

<img style="float: right; display: inline-block; margin-left: 2em; max-width: 15em;" src="/blog/2023/03/01/introducing-kwok/kwok.svg" alt="KWOK logo" />

Have you ever wondered how to set up a cluster of thousands of nodes just in seconds, how to simulate real nodes with a low resource footprint, and how to test your Kubernetes controller at scale without spending much on infrastructure?

If you answered "yes" to any of these questions, then you might be interested in KWOK, a toolkit that enables you to create a cluster of thousands of nodes in seconds.

## What is KWOK?

KWOK stands for Kubernetes WithOut Kubelet. So far, it provides two tools:

`kwok`
: `kwok` is the cornerstone of this project, responsible for simulating the lifecycle of fake nodes, pods, and other Kubernetes API resources.

`kwokctl`
: `kwokctl` is a CLI tool designed to streamline the creation and management of clusters, with nodes simulated by `kwok`.

## Why use KWOK?

KWOK has several advantages:

- **Speed**: You can create and delete clusters and nodes almost instantly, without waiting for boot or provisioning.
- **Compatibility**: KWOK works with any tools or clients that are compliant with Kubernetes APIs, such as kubectl, helm, kui, etc.
- **Portability**: KWOK has no specific hardware or software requirements. You can run it using pre-built images, once Docker or Nerdctl is installed. Alternatively, binaries are also available for all platforms and can be easily installed.
- **Flexibility**: You can configure different node types, labels, taints, capacities, conditions, etc., and you can configure different pod behaviors, status, etc. to test different scenarios and edge cases.
- **Performance**: You can simulate thousands of nodes on your laptop without significant consumption of CPU or memory resources.

## What are the use cases?

KWOK can be used for various purposes:

- **Learning**: You can use KWOK to learn about Kubernetes concepts and features without worrying about resource waste or other consequences. 
- **Development**: You can use KWOK to develop new features or tools for Kubernetes without accessing to a real cluster or requiring other components.
- **Testing**:
  - You can measure how well your application or controller scales with different numbers of nodes and(or) pods.
  - You can generate high loads on your cluster by creating many pods or services with different resource requests or limits.
  - You can simulate node failures or network partitions by changing node conditions or randomly deleting nodes.
  - You can test how your controller interacts with other components or features of Kubernetes by enabling different feature gates or API versions.

## What are the limitations?

KWOK is not intended to replace others completely. It has some limitations that you should be aware of:

- **Functionality**: KWOK is not a kubelet and may exhibit different behaviors in areas such as pod lifecycle management, volume mounting, and device plugins. Its primary function is to simulate updates of node and pod status.
- **Accuracy**: It's important to note that KWOK doesn't accurately reflect the performance or behavior of real nodes under various workloads or environments. Instead, it approximates some behaviors using simple formulas.
- **Security**: KWOK does not enforce any security policies or mechanisms on simulated nodes. It assumes that all requests from the kube-apiserver are authorized and valid.

## Getting started

If you are interested in trying out KWOK, please check its [documents] for more details.

{{< figure src="/blog/2023/03/01/introducing-kwok/manage-clusters.svg" alt="Animation of a terminal showing kwokctl in use" caption="Using kwokctl to manage simulated clusters" >}}

## Getting Involved

If you're interested in participating in future discussions or development related to KWOK, there are several ways to get involved:

- Slack: [#kwok] for general usage discussion, [#kwok-dev] for development discussion. (visit [slack.k8s.io] for a workspace invitation)
- Open Issues/PRs/Discussions in [sigs.k8s.io/kwok]

We welcome feedback and contributions from anyone who wants to join us in this exciting project.

[documents]: https://kwok.sigs.k8s.io/
[sigs.k8s.io/kwok]: https://sigs.k8s.io/kwok/
[#kwok]: https://kubernetes.slack.com/messages/kwok/
[#kwok-dev]: https://kubernetes.slack.com/messages/kwok-dev/
[slack.k8s.io]: https://slack.k8s.io/
