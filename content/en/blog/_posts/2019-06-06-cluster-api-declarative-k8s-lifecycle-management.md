---
layout: blog
title: 'Cluster API Lays the Groundwork for Declarative Kubernetes Lifecycle Management with v1alpha1'
date: 2019-06-06
---

**Author**: Jason DeTiberus (VMware)

_Note: This post was originally published (May 14, 2019) on the [VMware Cloud Native Apps blog](https://blogs.vmware.com/cloudnative/2019/05/14/cluster-api-kubernetes-lifecycle-management/) and republished here with author's permission_

As we approach the four-year anniversary of the Kubernetes [v1.0 release](https://github.com/kubernetes/kubernetes/releases/tag/v1.0.0), one of the most difficult challenges facing organizations continues to be managing the operational lifecycle of their Kubernetes clusters. Within the Kubernetes community, the task of improving this experience belongs to the [Cluster Lifecycle Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle). The objective of the SIG is to simplify the creation, configuration, upgrade, downgrade, and teardown of Kubernetes clusters and their components.

The most well-known subproject of the SIG is kubeadm, which focuses on the bootstrapping of an individual node into a Kubernetes cluster. While kubeadm has seen great adoption by both end users and higher-level installation tooling, there are still many challenges involved with managing the lifecycle of Kubernetes clusters that kubeadm does not address, and this is where the Cluster API comes in.

As Tim St. Clair outlines in [The What and the Why of the Cluster API](https://blogs.vmware.com/cloudnative/2019/03/14/what-and-why-of-cluster-api/), there existed a need for the SIG to provide another composable tool to bring declarative, [Kubernetes-style APIs](../../docs/concepts/overview/kubernetes-api/) to cluster creation, configuration, and management. Cluster API builds on top of the solid base of kubeadm to add additional support for managing the prerequisite infrastructure needed for a Kubernetes cluster as well as the orchestration of cluster lifecycle events across that infrastructure.

On March 29, we hit a very important milestone in the Cluster API project: We cut our first official alpha release. The release is tagged version 0.1.0 and features the v1alpha1 version of the defined API types. With this release, it is now possible to use the Cluster API in a non-production environment or to start building higher-level opinionated tooling on top of Cluster API.

## The Journey to v1alpha1

What is now known as the Cluster API project originated from a small lunch meeting in July of 2017 led by [Kris Nova](https://github.com/kris-nova) and [Robert Bailey](https://github.com/roberthbailey). At that meeting, the group shared ideas around building a declarative API for managing Kubernetes clusters. With the goal of simplifying the challenges involved in deploying and managing the lifecycle of Kubernetes clusters, especially at scale, this group became the start of what later became the Cluster API Working Group. This working group continued to explore the idea of using declarative, [Kubernetes-style APIs](../../docs/concepts/overview/kubernetes-api/) to manage Kubernetes clusters and started prototyping what it should look like in the already existing [kube-deploy repository](https://github.com/kubernetes/kube-deploy). Later development was moved to the [current repository](https://github.com/kubernetes-sigs/cluster-api) and the Cluster API project was officially born.

From there, the journey to v1alpha1 took shape and gathered momentum in much the same way as other open source projects striving to solve a complex technical problem in a rapidly evolving ecosystem: Developers of different perspectives established common goals, addressed changing requirements, narrowed the project’s scope, and implemented an API. The result of their work is delivered as v1alpha1.

## What Exactly is Cluster API?

<img src="/images/blog/2019-06-06-cluster-api-declarative-k8s-lifecycle-management/cluster-api-overview.png" width="80%" alt="Cluster API Overview" />


### Declarative API

First and foremost, Cluster API is a declarative API specification. It is this API specification that helps provide uniform and consistent management for Kubernetes clusters regardless of the underlying infrastructure. For v1alpha1, the API comprises five [CustomResourceDefinitions](../../docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/), or CRDs: Cluster, Machine, MachineSet, MachineDeployment, and MachineClass. Let’s look at each of these in turn.

#### Cluster

Cluster provides a way to define common Kubernetes cluster configurations, such as pod network CIDR and service network CIDR, as well as provider-specific management of shared cluster infrastructure. Creating a Cluster that uses the AWS provider as an example will instantiate a VPC, public and private subnets, an Internet gateway, a NAT gateway, security groups, an elastic load balancer, and a bastion host. A provider-specific configuration is provided through an embedded ProviderSpec that is defined and decoded by the individual provider implementations. There is also an embedded ProviderStatus that may be used by provider implementations for providing end-user viewable status.

Here’s an example of a YAML file for a Cluster that uses AWS as its provider:

```yaml
apiVersion: "cluster.k8s.io/v1alpha1"
kind: Cluster
metadata:
  name: test1
spec:
  clusterNetwork:
    services:
      cidrBlocks: ["10.96.0.0/12"]
    pods:
      cidrBlocks: ["192.168.0.0/16"]
    serviceDomain: "cluster.local"
  providerSpec:
    value:
      apiVersion: "awsprovider/v1alpha1"
      kind: "AWSClusterProviderSpec"
      region: "us-east-1"
      sshKeyName: "default"
```

One thing that may not be obvious at first is that creating a Cluster does not actually result in a fully functioning Kubernetes cluster. To get to that point, you need to instantiate one or more Machines.

#### Machine

The Machine CRD is really the backbone for managing Kubernetes clusters in v1alpha1. It is responsible for describing an individual Kubernetes node. There is only minimal configuration exposed at the common configuration level (mainly Kubernetes version information), and additional configuration is exposed through the embedded ProviderSpec.

Here’s an example of a YAML file that instantiates a Machine:

```yaml
apiVersion: "cluster.k8s.io/v1alpha1"
kind: Machine
metadata:
  name: controlplane-0
  labels:
    cluster.k8s.io/cluster-name: test1
    set: controlplane
spec:
  versions:
    kubelet: v1.13.6
    controlPlane: v1.13.6
  providerSpec:
    value:
      apiVersion: awsprovider/v1alpha1
      kind: AWSMachineProviderSpec
      instanceType: "t2.medium"
      iamInstanceProfile: "control-plane.cluster-api-provider-aws.sigs.k8s.io"
      keyName: "default"
```

Machines are currently responsible for deploying both Control Plane and Worker Nodes and the distinction between each is currently provider-dependent. Support for multiple Control Plane Nodes is also currently provider-dependent in v1alpha1.

#### MachineDeployment

MachineDeployments allow for the managed deployment and rollout of configuration changes to groups of Machines, very much like Deployments work. This allows for rolling out updates to a node configuration or even rolling out version upgrades for worker nodes in the cluster in an orchestrated manner. It also allows for rolling back to the previous configuration. It is important to note that MachineDeployments should not be used for managing Machines that make up the Kubernetes Control Plane for a given managed Cluster, since they do not provide any assurances that the control plane remains healthy when the MachineDeployment is updated or scaled.

Here’s an example YAML file for a MachineDeployment:

```yaml
apiVersion: "cluster.k8s.io/v1alpha1"
kind: MachineDeployment
metadata:
  name: sample-machinedeployment
  labels:
    cluster.k8s.io/cluster-name: test1
spec:
  replicas: 1
  selector:
    matchLabels:
      cluster.k8s.io/cluster-name: test1
      set: node
  template:
    metadata:
      labels:
        cluster.k8s.io/cluster-name: test1
        set: node
    spec:
      versions:
        kubelet: v1.13.6
      providerSpec:
        value:
          apiVersion: awsprovider/v1alpha1
          kind: AWSMachineProviderSpec
          instanceType: "t2.medium"
          iamInstanceProfile: "nodes.cluster-api-provider-aws.sigs.k8s.io"
          keyName: "default"
```

#### MachineSet

MachineSets manage groups of Machines in a way that’s similar to how ReplicaSets manage groups of pods. This allows for simplified scaling of a group of worker nodes in a Cluster. Like MachineDeployments, MachineSets should not be used for managing control plane nodes for a Cluster. Just as with ReplicaSets, most users should not manage MachineSets directly and should instead prefer to use MachineDeployments for managing groups of Machines.

Here’s an example for a MachineSet:

```yaml
apiVersion: "cluster.k8s.io/v1alpha1"
kind: MachineSet
metadata:
  name: sample-machineset
  labels:
    cluster.k8s.io/cluster-name: test1
spec:
  replicas: 1
  selector:
    matchLabels:
      cluster.k8s.io/cluster-name: test1
      set: node
  template:
    metadata:
      labels:
        cluster.k8s.io/cluster-name: test1
        set: node
    spec:
      versions:
        kubelet: v1.13.6
      providerSpec:
        value:
          apiVersion: awsprovider/v1alpha1
          kind: AWSMachineProviderSpec
          instanceType: "t2.medium"
          iamInstanceProfile: "nodes.cluster-api-provider-aws.sigs.k8s.io"
          keyName: "default"
```


#### MachineClass

With all of the previously described Machine objects, you can specify a provider-specific configuration. This can easily get repetitive and tedious if you are defining multiple Machines, MachineSets, or MachineDeployments. To ease this repetitive configuration, a reference to a MachineClass can be used in place of the embedded provider-specific configuration when defining a Machine, MachineSet, or a MachineDeployment.

Here’s an example of a MachineClass:

```yaml
apiVersion: "cluster.k8s.io/v1alpha1"
kind: MachineClass
metadata:
  name: sample-machineclass
providerSpec:
  value:
    apiVersion: awsprovider/v1alpha1
    kind: AWSMachineProviderSpec
    instanceType: "t2.medium"
    iamInstanceProfile: "nodes.cluster-api-provider-aws.sigs.k8s.io"
    keyName: "default"
```


### Common Controllers

In addition to the API specification, the Cluster API project also provides common controllers for MachineSets and MachineDeployments. These controllers do not require any provider-specific logic to operate.

### Provider-Specific Controller Library

The Cluster API project provides a set of extensible controllers that can be used for building provider-specific Machine and Cluster controllers.

## Getting Started

To get started running Cluster API, follow the instructions for the provider you want to run, such as cluster-api-provider-aws, cluster-api-provider-vsphere, or cluster-api-provider-azure.

## What’s Next

Now that we’ve released v1alpha1, we are starting work on defining what will be v1alpha2 and beyond. We are currently focusing our efforts on four different workstreams: Data Model changes, defining an Extension Mechanism, defining common Control Plane Lifecycle Management, and refining Node Lifecycle Management. If you are interested in helping shape the future of the project, feel free to join the weekly Cluster API Office Hours, which take place on Wednesdays at 10 am US Pacific time.
