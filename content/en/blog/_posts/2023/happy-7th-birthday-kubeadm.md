---
layout: blog
title: 'Happy 7th Birthday kubeadm!'
date: 2023-09-26
slug: happy-7th-birthday-kubeadm
author: >
  Fabrizio Pandini (VMware)
---

What a journey so far!

Starting from the initial blog post [“How we made Kubernetes insanely easy to install”](/blog/2016/09/how-we-made-kubernetes-easy-to-install/) in September 2016, followed by an exciting growth that lead to general availability / [“Production-Ready Kubernetes Cluster Creation with kubeadm”](/blog/2018/12/04/production-ready-kubernetes-cluster-creation-with-kubeadm/) two years later.

And later on a continuous, steady and reliable flow of small improvements that is still going on as of today. 

## What is kubeadm? (quick refresher)

kubeadm is focused on bootstrapping Kubernetes clusters on existing infrastructure and performing an essential set of maintenance tasks. The core of the kubeadm interface is quite simple: new control plane nodes
are created by running [`kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init/) and
worker nodes are joined to the control plane by running
[`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/).
Also included are utilities for managing already bootstrapped clusters, such as control plane upgrades
and token and certificate renewal.

To keep kubeadm lean, focused, and vendor/infrastructure agnostic, the following tasks are out of its scope:
- Infrastructure provisioning
- Third-party networking
- Non-critical add-ons, e.g. for monitoring, logging, and visualization
- Specific cloud provider integrations

Infrastructure provisioning, for example, is left to other SIG Cluster Lifecycle projects, such as the
[Cluster API](https://cluster-api.sigs.k8s.io/). Instead, kubeadm covers only the common denominator
in every Kubernetes cluster: the
[control plane](/docs/concepts/architecture/#control-plane-components).
The user may install their preferred networking solution and other add-ons on top of Kubernetes
*after* cluster creation.

Behind the scenes, kubeadm does a lot. The tool makes sure you have all the key components:
etcd, the API server, the scheduler, the controller manager. You can join more control plane nodes
for improving resiliency or join worker nodes for running your workloads. You get cluster DNS
and kube-proxy set up for you. TLS between components is enabled and used for encryption in transit.

## Let's celebrate! Past, present and future of kubeadm

In all and for all kubeadm's story is tightly coupled with Kubernetes' story, and with this amazing community.

Therefore celebrating kubeadm is first of all celebrating this community, a set of people, who joined forces in finding a common ground, a minimum viable tool, for bootstrapping Kubernetes clusters.

This tool, was instrumental to the Kubernetes success back in time as well as it is today, and the silver line of kubeadm's value proposition can be summarized in two points

- An obsession in making things deadly simple for the majority of the users: kubeadm init & kubeadm join, that's all you need! 

- A sharp focus on a well-defined problem scope: bootstrapping Kubernetes clusters on existing infrastructure. As our slogan says: *keep it simple, keep it extensible!*

This silver line, this clear contract, is the foundation the entire kubeadm user base relies on, and this post is a celebration for kubeadm's users as well.

We are deeply thankful for any feedback from our users, for the enthusiasm that they are continuously showing for this tool via Slack, GitHub, social media, blogs, in person at every KubeCon or at the various meet ups around the world. Keep going!

What continues to amaze me after all those years is the great things people are building on top of kubeadm, and as of today there is a strong and very active list of projects doing so:
- [minikube](https://minikube.sigs.k8s.io/)
- [kind](https://kind.sigs.k8s.io/)
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Kubespray](https://kubespray.io/)
- and many more; if you are using Kubernetes today, there is a good chance that you are using kubeadm even without knowing it 😜

This community, the kubeadm’s users, the projects building on top of kubeadm are the highlights of kubeadm’s 7th birthday celebration and the foundation for what will come next!

Stay tuned, and feel free to reach out to us!
- Try [kubeadm](/docs/setup/) to install Kubernetes today
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates

