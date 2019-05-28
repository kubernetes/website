---
layout: blog
title: 'The What and the Why of the Cluster API'
date: 2019-06-05
---

**Author**: Tim St. Clair, Senior Staff Engineer at VMware

_Note: This post was originally published (March 14, 2019) on the [VMware Cloud Native Apps blog](https://blogs.vmware.com/cloudnative/2019/03/14/what-and-why-of-cluster-api/) and republished here with author's permission_

Throughout the evolution of software tools there exists a tension between generalization and partial specialization. A tool’s broader adoption is a form of natural selection, where its evolution is predicated on filling a given need, or role, better than its competition. This premise is imbued in the central tenets of Unix philosophy:

* **Make each program do one thing well. To do a new job, build afresh rather than complicate old programs by adding new features.**
* **Expect the output of every program to become the input to another, as yet unknown, program.**


The domain of configuration management tooling is rife with examples of not heeding this lesson (i.e. Terraform, Puppet, Chef, Ansible, Juju, Saltstack, etc), where expanse in generality has given way to partial specialization of different tools, causing fragmentation of an ecosystem. This pattern has not gone unnoticed by those in the Kubernetes cluster lifecycle special interest group, or SIG, whose objective is to simplify the creation, configuration, upgrade, downgrade, and teardown of Kubernetes clusters and their components. Therefore, one of the primary design principles for any subproject that the SIG endorses is: **Where possible, tools should be composable to solve a higher order set of problems.**

## Background

Early in the evolution of the Kubernetes project, there was a desire for configurability, as different environments had varying constraints. This flexibility gave way to a myriad of assertions, and opinions, that initially fragmented the community around installation paths. However, it was clear to the community that there were a set of common overlapping concerns, or a lowest common denominator. In order to address these specific concerns, [kubeadm](../../docs/setup/independent/install-kubeadm/) was born as a composable bootstrapping tool for Kubernetes clusters.

<img src="/images/blog/2019-06-05-what-and-the-why-of-cluster-api/background.png" width="80%" alt="Cluster API background stack" />

Kubeadm was designed to be a focused tool used to bootstrap a best-practices Kubernetes cluster. The core tenet behind kubeadm was for it to become a tool that could be leveraged by other installers. Everything outside of basic control plane bootstrapping was considered out of scope for kubeadm. Approaching the problem in this manner provides the community with a highly leveraged tool that alleviates the amount of configuration that installers need to maintain.

Kubeadm has received a large amount of uptake from the community and has become the central bootstrapping tool for a number of other applications, including Kubespray, Minikube, kind, etc. Where kubeadm’s functionality ends, however, a new set of problems begins.

## Enter Cluster API

Kubeadm provided only one tool required to bootstrap a control plane, but there are a set of other questions that still exist, for example:

* “How do I provision all the other infrastructure I need for a Kubernetes cluster (load balancers, VPC, etc.)?”
* “How do I manage other lifecycle events across that infrastructure (upgrades, deletions, etc.)?”
* “How can I manage any number of clusters in a similar fashion to how I manage deployments in Kubernetes?”
* “How can we control all of this via an API?”

When we surveyed the ecosystem of tools that existed, we often found existing tools solved a subset of the problems above. On introspection we viewed Kubernetes as the gold standard for managing fleets of applications, so why not use similar patterns for managing fleets of Kubernetes clusters in a similar fashion?

## The What

The Cluster API is a Kubernetes project to bring declarative, [Kubernetes-style APIs](../../docs/concepts/overview/kubernetes-api/) to cluster creation, configuration, and management. It provides optional, additive functionality on top of core Kubernetes. By making use of the structured nature of Kubernetes APIs, it is possible to build higher-level cloud agnostic tools that improve user experience by allowing for greater ease of use and more sophisticated automation.

## The Why

Kubernetes has a common set of APIs (see [the Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md)) to orchestrate containers regardless of deployment mechanism or cloud provider. Kubernetes also has APIs for handling some infrastructure, like load balancers, ingress rules, or persistent volumes, but not for creating new machines. As a result, the various deployment mechanisms to manage Kubernetes clusters each have unique APIs and implementations for how to handle lifecycle events like cluster creation or deletion, master upgrades, and node upgrades. Additionally, the cluster autoscaler is responsible not only for determining when the cluster should be scaled, but also for adding capacity to the cluster by interacting directly with the cloud provider to perform the scaling. When another component needs to create or destroy virtual machines, like the node auto-provisioner, it would similarly need to reimplement the logic for interacting with the supported cloud providers (or reuse the same code to prevent duplication).

### Goals


* The cluster management APIs should be declarative, Kubernetes-style APIs that follow our existing API Conventions.
* To the extent possible, we should separate state that is environment-specific from environment-agnostic. However, we still want the design to be able to utilize environment-specific functionality, or else it likely won’t gain traction in favor of other tooling that is more powerful.

### Non-goals

* To add these cluster management APIs to Kubernetes core.
* To support infrastructure that is irrelevant to Kubernetes clusters. We are not aiming to create Terraform-like capabilities of creating any arbitrary cloud resources, nor are we interested in supporting infrastructure used solely by applications deployed on Kubernetes. The goal is to support the infrastructure necessary for the cluster itself.
* To convince every Kubernetes lifecycle product (kops, Kubespray, Amazon Elastic Container Service for Kubernetes, Azure Kubernetes Service, Google Kubernetes Engine, VMware Cloud PKS, VMware Enterprise PKS, VMware Essential PKS, etc.) to support these APIs. There is value in having consistency between installers and broad support for the cluster management APIs and in having common infrastructure reconcilers used post-installation, but 100% adoption isn’t an immediate goal.
* To model state that is purely internal to a deployer. Many Kubernetes deployment tools have intermediate representations of resources and other internal state to keep track of. They should continue to use their existing methods to track internal state, rather than attempting to model it in these APIs.

## State of Cluster API

We are planning an initial v1alpha1 release of Cluster API near the end of March 2019. This will be our first release, and fully expect there to be several iterations before we find a solution that the community is happy with. That said, the community is vibrant and growing, and for those who are interested in cluster management, there are [ample opportunities to engage with the community](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle). Come join our [mailing lists](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle) and [Slack channels](https://kubernetes.slack.com/messages/sig-cluster-lifecycle) for more information.
