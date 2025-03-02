---
layout: blog
title: Production-Ready Kubernetes Cluster Creation with kubeadm
date: 2018-12-04
evergreen: true
author: >
   Lucas Käldström (CNCF),
   Luc Perkins (CNCF) 
---

[kubeadm](/docs/setup/independent/create-cluster-kubeadm/) is a tool that enables Kubernetes administrators to quickly and easily bootstrap minimum viable clusters that are fully compliant with [Certified Kubernetes](https://github.com/cncf/k8s-conformance/blob/master/terms-conditions/Certified_Kubernetes_Terms.md) guidelines. It's been under active development by [SIG Cluster Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle) since 2016 and we're excited to announce that it has now graduated from beta to stable and generally available (GA)!

This GA release of kubeadm is an important event in the progression of the Kubernetes ecosystem, bringing stability to an area where stability is paramount.

The goal of kubeadm is to provide a foundational implementation for Kubernetes cluster setup and administration. kubeadm ships with best-practice defaults but can also be customized to support other ecosystem requirements or vendor-specific approaches. kubeadm is designed to be easy to integrate into larger deployment systems and tools.

### The scope of kubeadm

kubeadm is focused on bootstrapping Kubernetes clusters on existing infrastructure and performing an essential set of maintenance tasks. The core of the kubeadm interface is quite simple: new control plane nodes are created by running [`kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init/) and worker nodes are joined to the control plane by running [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/). Also included are utilities for managing already bootstrapped clusters, such as control plane upgrades and token and certificate renewal.

To keep kubeadm lean, focused, and vendor/infrastructure agnostic, the following tasks are out of its scope:

- Infrastructure provisioning
- Third-party networking
- Non-critical add-ons, e.g. for monitoring, logging, and visualization
- Specific cloud provider integrations

Infrastructure provisioning, for example, is left to other SIG Cluster Lifecycle projects, such as the [Cluster API](https://github.com/kubernetes-sigs/cluster-api). Instead, kubeadm covers only the common denominator in every Kubernetes cluster: the [control plane](/docs/concepts/overview/components/#control-plane-components). The user may install their preferred networking solution and other add-ons on top of Kubernetes *after* cluster creation.

### What kubeadm's GA release means

General Availability means different things for different projects. For kubeadm, going GA means not only that the process of creating a conformant Kubernetes cluster is now stable, but also that kubeadm is flexible enough to support a wide variety of deployment options.

We now consider kubeadm to have achieved GA-level maturity in each of these important domains:

 * **Stable command-line UX** --- The kubeadm CLI conforms to [#5a GA rule of the Kubernetes Deprecation Policy](/docs/reference/using-api/deprecation-policy/#deprecating-a-flag-or-cli), which states that a command or flag that exists in a GA version must be kept for at least 12 months after deprecation.
 * **Stable underlying implementation** --- kubeadm now creates a new Kubernetes cluster using methods that shouldn't change any time soon. The control plane, for example, is run as a set of static Pods, bootstrap tokens are used for the [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join/) flow, and [ComponentConfig](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cluster-lifecycle/wgs/115-componentconfig) is used for configuring the [kubelet](/docs/reference/command-line-tools-reference/kubelet/).
 * **Configuration file schema** --- With the new **v1beta1** API version, you can now tune almost every part of the cluster declaratively and thus build a "GitOps" flow around kubeadm-built clusters. In future versions, we plan to graduate the API to version **v1** with minimal changes (and perhaps none).
 * **The "toolbox" interface of kubeadm** --- Also known as **phases**. If you don't want to perform all [`kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init/) tasks, you can instead apply more fine-grained actions using the `kubeadm init phase` command (for example generating certificates or control plane [Static Pod](/docs/tasks/administer-cluster/static-pod/) manifests).
 * **Upgrades between minor versions** --- The [`kubeadm upgrade`](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) command is now fully GA. It handles control plane upgrades for you, which includes upgrades to [etcd](https://etcd.io), the [API Server](/docs/reference/using-api/api-overview/), the [Controller Manager](/docs/reference/command-line-tools-reference/kube-controller-manager/), and the [Scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/). You can seamlessly upgrade your cluster between minor or patch versions (e.g. v1.12.2 -> v1.13.1 or v1.13.1 -> v1.13.3).
 * **etcd setup** --- [etcd](https://etcd.io) is now set up in a way that is secure by default, with TLS communication everywhere, and allows for expanding to a highly available cluster when needed.

### Who will benefit from a stable kubeadm

SIG Cluster Lifecycle has identified a handful of likely kubeadm user profiles, although we expect that kubeadm at GA can satisfy many other scenarios as well.

Here's our list:

- You're a **new user** who wants to take Kubernetes for a spin. kubeadm is the fastest way to get up and running on [Linux machines](/docs/setup/independent/create-cluster-kubeadm/). If you're using [Minikube](https://github.com/kubernetes/minikube) on a Mac or Windows workstation, you're actually already running kubeadm inside the Minikube VM!
- You're a **system administrator** responsible for setting up Kubernetes on bare metal machines and you want to quickly create Kubernetes clusters that are secure and in conformance with best practices but also highly configurable.
- You're a **cloud provider** who wants to add a Kubernetes offering to your suite of cloud services. kubeadm is the go-to tool for creating clusters at a low level.
- You're an **organization that requires highly customized Kubernetes clusters**. Existing public cloud offerings like [Amazon EKS](https://aws.amazon.com/eks/) and [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) won't cut it for you; you need customized Kubernetes clusters tailored to your hardware, security, policy, and other needs.
- You're creating a **higher-level cluster creation tool** than kubeadm, building the cluster experience from the ground up, but you don't want to reinvent the wheel. You can "rebase" on top of kubeadm and utilize the common bootstrapping tools kubeadm provides for you. Several community tools have adopted kubeadm, and it's a perfect match for [Cluster API](https://github.com/kubernetes-sigs/cluster-api) implementations.

All these users can benefit from kubeadm graduating to a stable GA state.

### kubeadm survey

Although kubeadm is GA, the SIG Cluster Lifecycle will continue to be committed to improving the user experience in managing Kubernetes clusters. We're launching a survey to collect community feedback about kubeadm for the sake of future improvement.

The survey is available at [https://bit.ly/2FPfRiZ](https://bit.ly/2FPfRiZ). Your participation would be highly valued!

### Thanks to the community!

This release wouldn't have been possible without the help of the great people that have been contributing to the SIG. SIG Cluster Lifecycle would like to thank a few key kubeadm contributors:

| **Name** | **Organization** | **Role** |
| --- | --- | --- |
| [Tim St. Clair](https://github.com/timothysc) | Heptio | SIG co-chair |
| [Robert Bailey](https://github.com/roberthbailey) | Google | SIG co-chair |
| [Fabrizio Pandini](https://github.com/fabriziopandini) | Independent | Approver |
| [Lubomir Ivanov](https://github.com/neolit123) | VMware | Approver |
| [Mike Danese](https://github.com/mikedanese) | Google | Emeritus approver |
| [Ilya Dmitrichenko](https://github.com/errordeveloper) | Weaveworks | Emeritus  approver |
| [Peter Zhao](https://github.com/xiangpengzhao) | ZTE | Reviewer |
| [Di Xu](https://github.com/dixudx) | Ant Financial | Reviewer |
| [Chuck Ha](https://github.com/chuckha) | Heptio | Reviewer |
| [Liz Frost](https://github.com/liztio) | Heptio | Reviewer |
| [Jason DeTiberus](https://github.com/detiber) | Heptio | Reviewer |
| [Alexander Kanievsky](https://github.com/kad) | Intel | Reviewer |
| [Ross Georgiev](https://github.com/rosti) | VMware | Reviewer |
| [Yago Nobre](https://github.com/yagonobre) | Nubank | Reviewer |

We also want to thank all the companies making it possible for their developers to work on Kubernetes, and all the other people that have contributed in various ways towards making kubeadm as stable as it is today!

### About the authors

#### Lucas Käldström

* kubeadm subproject owner and SIG Cluster Lifecycle co-chair
* Kubernetes upstream contractor, last two years contracting for [Weaveworks](https://weave.works)
* CNCF Ambassador
* GitHub: [luxas](https://github.com/luxas)

#### Luc Perkins

* [CNCF](https://cncf.io) Developer Advocate
* Kubernetes SIG Docs contributor and SIG Docs tooling WG chair
* GitHub: [lucperkins](https://github.com/lucperkins)
