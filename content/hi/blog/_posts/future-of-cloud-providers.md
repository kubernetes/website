---
title: 'The Future of Cloud Providers in Kubernetes'
date: 2019-04-17
---

**Authors:** Andrew Sy Kim (VMware), Mike Crute (AWS), Walter Fender (Google)

Approximately 9 months ago, the Kubernetes community agreed to form the Cloud Provider Special Interest Group (SIG). The justification was to have a single governing SIG to own and shape the integration points between Kubernetes and the many cloud providers it supported. A lot has been in motion since then and we’re here to share with you what has been accomplished so far and what we hope to see in the future.

## The Mission

First and foremost, I want to share what the mission of the SIG is, because we use it to guide our present & future work. Taken straight from our [charter](https://github.com/kubernetes/community/blob/master/sig-cloud-provider/CHARTER.md), the mission of the SIG is to simplify, develop and maintain cloud provider integrations as extensions, or add-ons, to Kubernetes clusters. The motivation behind this is two-fold: to ensure Kubernetes remains extensible and cloud agnostic.

## The Current State of Cloud Providers

In order to gain a forward looking perspective to our work, I think it’s important to take a step back to look at the current state of cloud providers. Today, each core Kubernetes component (except the scheduler and kube-proxy) has a --cloud-provider flag you can configure to enable a set of functionalities that integrate with the underlying infrastructure provider, a.k.a the cloud provider. Enabling this integration unlocks a wide set of features for your clusters such as: node address & zone discovery, cloud load balancers for Services with Type=LoadBalancer, IP address management, and cluster networking via VPC routing tables. Today, the cloud provider integrations can be done either in-tree or out-of-tree.

## In-Tree & Out-of-Tree Providers

In-tree cloud providers are the providers we develop & release in the [main Kubernetes repository](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers). This results in embedding the knowledge and context of each cloud provider into most of the Kubernetes components. This enables more native integrations such as the kubelet requesting information about itself via a metadata service from the cloud provider.

<center>{{<figure width="600" src="/images/docs/pre-ccm-arch.png" caption="In-Tree Cloud Provider Architecture (source: kubernetes.io)">}}</center>

Out-of-tree cloud providers are providers that can be developed, built, and released independent of Kubernetes core. This requires deploying a new component called the cloud-controller-manager which is responsible for running all the cloud specific controllers that were previously run in the kube-controller-manager.

<center>{{<figure width="600" src="/images/docs/post-ccm-arch.png" caption="Out-of-Tree Cloud Provider Architecture (source: kubernetes.io)">}}</center>


When cloud provider integrations were initially developed, they were developed natively (in-tree). We integrated each provider close to the core of Kubernetes and within the monolithic repository that is k8s.io/kubernetes today. As Kubernetes became more ubiquitous and more infrastructure providers wanted to support Kubernetes natively, we realized that this model was not going to scale. Each provider brings along a large set of dependencies which increases potential vulnerabilities in our code base and significantly increases the binary size of each component. In addition to this, more of the Kubernetes release notes started to focus on provider specific changes rather than core changes that impacted all Kubernetes users.

In late 2017, we developed a way for cloud providers to build integrations without adding them to the main Kubernetes tree (out-of-tree). This became the de-facto way for new infrastructure providers in the ecosystem to integrate with Kubernetes.  Since then, we’ve been actively working towards migrating all cloud providers to use the out-of-tree architecture as most clusters today are still using the in-tree cloud providers.

## Looking Ahead

Looking ahead, the goal of the SIG is to remove all existing in-tree cloud providers in favor of their out-of-tree equivalents with minimal impact to users. In addition to the core cloud provider integration mentioned above, there are more extension points for cloud integrations like CSI and the image credential provider that are actively being worked on for v1.15. Getting to this point would mean that Kubernetes is truly cloud-agnostic with no native integrations for any cloud provider. By doing this work we empower each cloud provider to develop and release new versions at their own cadence independent of Kubernetes.  We’ve learned by now that this is a large feat with a unique set of challenges. Migrating workloads is never easy, especially when it’s an essential part of the control plane. Providing a safe and easy migration path between in-tree and out-of-tree cloud providers is of the highest priority for our SIG in the upcoming releases. If any of this sounds interesting to you, I encourage you to check out of some of our [KEPs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-cloud-provider) and get in touch with our SIG by joining the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-cloud-provider) or our slack channel (#sig-cloud-provider in Kubernetes slack).

