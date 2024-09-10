---
layout: blog
title: "Introducing ClusterClass and Managed Topologies in Cluster API"
date: 2021-10-08
slug: capi-clusterclass-and-managed-topologies
author: >
  Fabrizio Pandini (VMware)
---

The [Cluster API community](https://cluster-api.sigs.k8s.io/) is happy to announce the implementation of *ClusterClass and Managed Topologies*, a new feature that will greatly simplify how you can provision, upgrade, and operate multiple Kubernetes clusters in a declarative way.

## A little bit of context…

Before getting into the details, let's take a step back and look at the history of Cluster API.

The [Cluster API project](https://github.com/kubernetes-sigs/cluster-api/) started three years ago, and the first releases focused on extensibility and implementing a declarative API that allows a seamless experience across infrastructure providers. This was a success with many cloud providers: AWS, Azure, Digital Ocean, GCP, Metal3, vSphere and still counting.

With extensibility addressed, the focus shifted to features, like automatic control plane and etcd management, health-based machine remediation, machine rollout strategies and more.

Fast forwarding to 2021, with lots of companies using Cluster API to manage fleets of Kubernetes clusters running workloads in production, the community focused its effort on stabilization of both code, APIs, documentation, and on extensive test signals which inform Kubernetes releases.

With solid foundations in place, and a vibrant and welcoming community that still continues to grow, it was time to plan another iteration on our UX for both new and advanced users.

Enter ClusterClass and Managed Topologies, tada!

## ClusterClass

As the name suggests, ClusterClass and managed topologies are built in two parts.

The idea behind ClusterClass is simple: define the shape of your cluster once, and reuse it many times, abstracting the complexities and the internals of a Kubernetes cluster away.

![Defining a ClusterClass](/images/blog/2021-10-08-clusterclass-and-managed-topologies/clusterclass.svg)

ClusterClass, at its heart, is a collection of Cluster and Machine templates. You can use it as a “stamp” that can be leveraged to create many clusters of a similar shape.

```yaml
---
apiVersion: cluster.x-k8s.io/v1beta1
kind: ClusterClass
metadata:
  name: my-amazing-cluster-class
spec:
  controlPlane:
    ref:
      apiVersion: controlplane.cluster.x-k8s.io/v1beta1
      kind: KubeadmControlPlaneTemplate
      name: high-availability-control-plane
    machineInfrastructure:
      ref:
        apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
        kind: DockerMachineTemplate
        name: control-plane-machine
  workers:
    machineDeployments:
      - class: type1-workers
        template:
          bootstrap:
            ref:
              apiVersion: bootstrap.cluster.x-k8s.io/v1beta1
              kind: KubeadmConfigTemplate
              name: type1-bootstrap
          infrastructure:
            ref:
              apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
              kind: DockerMachineTemplate
              name: type1-machine
      - class: type2-workers
        template:
          bootstrap:
            ref:
              apiVersion: bootstrap.cluster.x-k8s.io/v1beta1
              kind: KubeadmConfigTemplate
              name: type2-bootstrap
          infrastructure:
            ref:
              kind: DockerMachineTemplate
              apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
              name: type2-machine
  infrastructure:
    ref:
      apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
      kind: DockerClusterTemplate
      name: cluster-infrastructure

```

The possibilities are endless; you can get a default ClusterClass from the community, “off-the-shelf” classes from your vendor of choice, “certified” classes from the platform admin in your company, or even create custom ones for advanced scenarios.

## Managed Topologies

Managed Topologies let you put the power of ClusterClass into action.

Given a ClusterClass, you can create many Clusters of a similar shape by providing a single resource, the Cluster.

![Create a Cluster with ClusterClass](/images/blog/2021-10-08-clusterclass-and-managed-topologies/create-cluster.svg)

Here is an example:

```yaml
---
apiVersion: cluster.x-k8s.io/v1beta1
 kind: Cluster
 metadata:
   name: my-amazing-cluster
   namespace: bar
 spec:
   topology: # define a managed topology
     class: my-amazing-cluster-class # use the ClusterClass mentioned earlier
     version: v1.21.2
     controlPlane:
       replicas: 3
     workers:
       machineDeployments:
       - class: type1-workers
         name: big-pool-of-machines
         replicas: 5
       - class: type2-workers
         name: small-pool-of-machines
         replicas: 1
```

But there is more than simplified cluster creation. Now the Cluster acts as a single control point for your entire topology.

All the power of Cluster API, extensibility, lifecycle automation, stability, all the features required for managing an enterprise grade Kubernetes cluster on the infrastructure provider of your choice are now at your fingertips: you can create your Cluster, add new machines, upgrade to the next Kubernetes version, and all from a single place.

It is just as simple as it looks!

## What’s next

While the amazing Cluster API community is working hard to deliver the first version of ClusterClass and managed topologies later this year, we are already looking forward to what comes next for the project and its ecosystem.

There are a lot of great ideas and opportunities ahead!

We want to make managed topologies even more powerful and flexible, allowing users to dynamically change bits of a ClusterClass according to the specific needs of a Cluster; this will ensure the same simple and intuitive UX for solving complex problems like e.g. selecting machine image for a specific Kubernetes version and for a specific region of your infrastructure provider, or injecting proxy configurations in the entire Cluster, and so on.

Stay tuned for what comes next, and if you have any questions, comments or suggestions:

* Chat with us on the Kubernetes [Slack](http://slack.k8s.io/):[#cluster-api](https://kubernetes.slack.com/archives/C8TSNPY4T)
* Join the SIG Cluster Lifecycle [Google Group](https://groups.google.com/g/kubernetes-sig-cluster-lifecycle) to receive calendar invites and gain access to documents
* Join our [Zoom meeting](https://zoom.us/j/861487554), every Wednesday at 10:00 Pacific Time
* Check out the [ClusterClass quick-start](https://cluster-api.sigs.k8s.io/user/quick-start.html) for the Docker provider (CAPD) in the Cluster API book.
* _UPDATE_: Check out the [ClusterClass experimental feature](https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/index.html) documentation in the Cluster API book.
