---
layout: blog
title: "GSoC 2020 - Building operators for cluster addons"
date: 2020-09-16
slug: gsoc20-building-operators-for-cluster-addons
author: >
  Somtochi Onyekwere
---

# Introduction

[Google Summer of Code](https://summerofcode.withgoogle.com/) is a global program that is geared towards introducing students to open source. Students are matched with open-source organizations to work with them for three months during the summer.

My name is Somtochi Onyekwere from the Federal University of Technology, Owerri (Nigeria) and this year, I was given the opportunity to work with Kubernetes (under the CNCF organization) and this led to an amazing summer spent learning, contributing and interacting with the community.

Specifically, I worked on the _Cluster Addons: Package all the things!_ project. The project focused on building operators for better management of various cluster addons, extending the tooling for building these operators and making the creation of these operators a smooth process.

# Background

Kubernetes has progressed greatly in the past few years with a flourishing community and a large number of contributors. The codebase is gradually moving away from the monolith structure where all the code resides in the [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository to being split into multiple sub-projects. Part of the focus of cluster-addons is to make some of these sub-projects work together in an easy to assemble, self-monitoring, self-healing and Kubernetes-native way. It enables them to work seamlessly without human intervention.

The community is exploring the use of operators as a mechanism to monitor various resources in the cluster and properly manage these resources. In addition to this, it provides self-healing and it is a kubernetes-native pattern that can encode how best these addons work and manage them properly.

What are cluster addons? Cluster addons are a collection of resources (like Services and deployment) that are used to give a Kubernetes cluster additional functionalities. They range from things as simple as the Kubernetes dashboards (for visualization) to more complex ones like Calico (for networking). These addons are essential to different applications running in the cluster and the cluster itself. The addon operator provides a nicer way of managing these addons and understanding the health and status of the various resources that comprise the addon. You can get a deeper overview in this [article](https://kubernetes.io/docs/concepts/overview/components/#addons).

Operators are custom controllers with custom resource definitions that encode application-specific knowledge and are used for managing complex stateful applications. It is a widely accepted pattern. Managing addons via operators, with these operators encoding knowledge of how best the addons work, introduces a lot of advantages while setting standards that will be easy to follow and scale. This [article](https://kubernetes.io/docs/concepts/extend-kubernetes/operator) does a good job of explaining operators.

The addon operators can solve a lot of problems, but they have their challenges. Those under the [cluster-addons project](https://github.com/kubernetes-sigs/cluster-addons) had missing pieces and were still a proof of concept. Generating the RBAC configuration for the operators was a pain and sometimes the operators were given too much privilege. The operators weren’t very extensible as it only pulled manifests from local filesystems or HTTP(s) servers and a lot of simple addons were generating the same code.
I spent the summer working on these issues, looking at them with fresh eyes and coming up with solutions for both the known and unknown issues.

# Various additions to kubebuilder-declarative-pattern

The [kubebuilder-declarative-pattern](https://github.com/kubernetes-sigs/kubebuilder-declarative-pattern) (from here on referred to as KDP) repo is an extra layer of addon specific tooling on top of the [kubebuilder](https://github.com/kubernetes-sigs/kubebuilder) SDK that is enabled by passing the experimental `--pattern=addon` flag to `kubebuilder create` command. Together, they create the base code for the addon operator. During the internship, I worked on a couple of features in KDP and cluster-addons.

## Operator version checking
Enabling version checks for operators helped in making upgrades/downgrades safer to different versions of the addon, even though the operator had complex logic. It is a way of matching the version of an addon to the version of the operator that knows how to manage it well. Most addons have different versions and these versions might need to be managed differently. This feature checks the custom resource for the `addons.k8s.io/min-operator-version` annotation which states the minimum operator version that is needed to manage the version against the version of the operator. If the operator version is below the minimum version required, the operator pauses with an error telling the user that the version of the operator is too low. This helps to ensure that the correct operator is being used for the addon.

## Git repository for storing the manifests
Previously, there was support for only local file directories and HTTPS repositories for storing manifests. Giving creators of addon operators the ability to store manifest in GitHub repository enables faster development and version control.  When starting the controller, you can pass a flag to specify the location of your channels directory. The channels directory contains the manifests for different versions, the controller pulls the manifest from this directory and applies it to the cluster. During the internship period, I extended it to include Git repositories.

## Annotations to temporarily disable reconciliation
The reconciliation loop that ensures that the desired state matches the actual state prevents modification of objects in the cluster. This makes it hard to experiment or investigate what might be wrong in the cluster as any changes made are promptly reverted. I resolved this by allowing users to place an `addons.k8s.io/ignore` annotation on the resource that they don’t want the controller to reconcile. The controller checks for this annotation and doesn’t reconcile that object. To resume reconciliation, the annotation can be removed from the resource.

## Unstructured support in kubebuilder-declarative-pattern
One of the operators that I worked on is a generic controller that could manage more than one cluster addon that did not require extra configuration. To do this, the operator couldn’t use a particular type and needed the kubebuilder-declarative-repo to support using the [unstructured.Unstructured](https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1/unstructured#Unstructured) type. There were various functions in the kubebuilder-declarative-pattern that couldn’t handle this type and returned an error if the object passed in was not of type `addonsv1alpha1.CommonObject`. The functions were modified to handle both `unstructured.Unstructured` and `addonsv1alpha.CommonObject`.

# Tools and CLI programs
There were also some command-line programs I wrote that could be used to make working with addon operators easier. Most of them have uses outside the addon operators as they try to solve a specific problem that could surface anywhere while working with Kubernetes. I encourage you to [check them out](https://github.com/kubernetes-sigs/cluster-addons/tree/master/tools) when you have the chance!

## RBAC Generator
One of the biggest concerns with the operator was RBAC. You had to manually look through the manifest and add the RBAC rule for each resource as it needs to have RBAC permissions to create, get, update and delete the resources in the manifest when running in-cluster. Building the [RBAC generator](https://github.com/kubernetes-sigs/cluster-addons/blob/master/tools/rbac-gen) automated the process of writing the RBAC roles and role bindings. The function of the RBAC generator is simple. It accepts the file name of the manifest as a flag. Then, it parses the manifest and gets the API group and resource name of the resources and adds it to a role. It outputs the role and role binding to stdout or a file if the `--out` flag is parsed.

Additionally, the tool enables you to split the RBAC by separating the cluster roles in the manifest. This lessened the security concern of an operator being over-privileged as it needed to have all the permissions that the clusterrole has. If you want to apply the clusterrole yourself and not give the operator these permissions, you can pass in a `--supervisory` boolean flag so that the generator does not add these permissions to the role. The CLI program resides [here](https://github.com/kubernetes-sigs/cluster-addons/blob/master/tools/rbac-gen).

## Kubectl Ownerref
It is hard to find out at a glance which objects were created by an addon custom resource. This kubectl plugin alleviates that pain by displaying all the objects in the cluster that a resource has ownerrefs on. You simply pass the kind and the name of the resource as arguments to the program and it checks the cluster for the objects and gives the kind, name, the namespace of such an object. It could be useful to get a general overview of all the objects that the controller is reconciling by passing in the name and kind of custom resource. The CLI program resides [here](https://github.com/kubernetes-sigs/cluster-addons/tree/master/tools/kubectl-ownerref).

# Addon Operators
To fully understand addons operators and make changes to how they are being created, you have to try creating and using them. Part of the summer was spent building operators for some popular addons like the Kubernetes dashboard, flannel, NodeLocalDNS and so on. Please check the [cluster-addons](https://github.com/kubernetes-sigs/cluster-addons) repository for the different addon operators. In this section, I will just highlight one that is a little different from the others.

## Generic Controller
The generic controller can be shared between addons that don’t require much configuration. This minimizes resource consumption on the cluster as it reduces the number of controllers that need to be run. Also instead of building your own operator, you can just use the generic controller and whenever you feel that your needs have grown and you need a more complex operator, you can always scaffold the code with kubebuilder and continue from where the generic operator stopped. To use the generic controller, you can generate the CustomResourceDefinition(CRD) using this tool ([generic-addon](https://github.com/kubernetes-sigs/cluster-addons/blob/master/tools/generic-addon/README.md)). You pass in the kind, group, and the location of your channels directory (it could be a Git repository too!). The tool generates the - CRD, RBAC manifest and two custom resources for you.

The process is as follows:
- Create the Generic CRD
- Generate all the manifests needed with the [`generic-addon tool`](https://github.com/kubernetes-sigs/cluster-addons/blob/master/tools/generic-addon/README.md).

This tool creates:
1. The CRD for your addon
2. The RBAC rules for the CustomResourceDefinitions
3. The RBAC rules for applying the manifests
4. The custom resource for your addon
5. A Generic custom resource

The Generic custom resource looks like this:

```yaml
apiVersion: addons.x-k8s.io/v1alpha1
kind: Generic
metadata:
 	name: generic-sample
spec:
  objectKind:
  kind: NodeLocalDNS
  version: "v1alpha1"
  group: addons.x-k8s.io
channel: "../nodelocaldns/channels"
```

Apply these manifests but ensure to apply the CRD before the CR.
Then, run the Generic controller, either on your machine or in-cluster.


If you are interested in building an operator, Please check out [this guide](https://github.com/kubernetes-sigs/cluster-addons/blob/master/dashboard/README.md).

# Relevant Links
- [Detailed breakdown of work done during the internship](https://github.com/SomtochiAma/gsoc-2020-meta-k8s)
- [Addon Operator (KEP)](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cluster-lifecycle/addons/0035-20190128-addons-via-operators.md)
- [Original GSoC Issue](https://github.com/kubernetes-sigs/cluster-addons/issues/39)
- [Proposal Submitted for GSoC](https://github.com/SomtochiAma/gsoc-2020-meta-k8s/blob/master/GSoC%202020%20PROPOSAL%20-%20PACKAGE%20ALL%20THINGS.pdf)
- [All commits to kubernetes-sigs/cluster-addons](https://github.com/kubernetes-sigs/cluster-addons/commits?author=SomtochiAma)
- [All commits to kubernetes-sigs/kubebuidler-declarative-pattern](https://github.com/kubernetes-sigs/kubebuilder-declarative-pattern/commits?author=SomtochiAma)

# Further Work
A lot of work was definitely done on the cluster addons during the GSoC period. But we need more people building operators and using them in the cluster. We need wider adoption in the community. Build operators for your favourite addons and tell us how it went and if you had any issues. Check out this [README.md](https://github.com/kubernetes-sigs/cluster-addons/blob/master/dashboard/README.md) to get started.

# Appreciation
I really want to appreciate my mentors [Justin Santa Barbara](https://github.com/justinsb) (Google) and [Leigh Capili](https://github.com/stealthybox) (Weaveworks). My internship was awesome because they were awesome. They set a golden standard for what mentorship should be. They were accessible and always available to clear any confusion. I think what I liked best was that they didn’t just dish out tasks, instead, we had open discussions about what was wrong and what could be improved. They are really the best and I hope I get to work with them again!
  Also, I want to say a huge thanks to [Lubomir I. Ivanov](https://github.com/neolit123) for reviewing this blog post!

# Conclusion
So far I have learnt a lot about Go, the internals of Kubernetes, and operators. I want to conclude by encouraging people to contribute to open-source (especially Kubernetes :)) regardless of your level of experience. It has been a well-rounded experience for me and I have come to love the community. It is a great initiative and it is a great way to learn and meet awesome people. Special shoutout to Google for organizing this program.

If you are interested in cluster addons and finding out more on addon operators, you are welcome to join our slack channel on the Kubernetes [#cluster-addons](https://kubernetes.slack.com/messages/cluster-addons).

---

_[Somtochi Onyekwere](https://twitter.com/SomtochiAma) is a software engineer that loves contributing to open-source and exploring cloud native solutions._
