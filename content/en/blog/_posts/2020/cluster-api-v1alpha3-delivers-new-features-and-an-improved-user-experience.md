---
layout: blog
title: "Cluster API v1alpha3 Delivers New Features and an Improved User Experience"
date: 2020-04-21
slug: cluster-api-v1alpha3-delivers-new-features-and-an-improved-user-experience
author: >
  Daniel Lipovetsky (D2IQ)
---

<img src="/images/blog/2020-04-21-Cluster-API-v1alpha3-Delivers-New-Features-and-an-Improved-User-Experience/kubernetes-cluster-logos_final-02.svg" align="right" width="25%" alt="Cluster API Logo: Turtles All The Way Down">

The Cluster API is a Kubernetes project to bring declarative, Kubernetes-style APIs to cluster creation, configuration, and management. It provides optional, additive functionality on top of core Kubernetes to manage the lifecycle of a Kubernetes cluster.

Following the v1alpha2 release in October 2019, many members of the Cluster API community met in San Francisco, California, to plan the next release. The project had just gone through a major transformation, delivering a new architecture that promised to make the project easier for users to adopt, and faster for the community to build. Over the course of those two days, we found our common goals: To implement the features critical to managing production clusters, to make its user experience more intuitive, and to make it a joy to develop.

The v1alpha3 release of Cluster API brings significant features for anyone running Kubernetes in production and at scale. Among the highlights:

* [Declarative Control Plane Management](#declarative-control-plane-management)
* [Support for Distributing Control Plane Nodes Across Failure Domains To Reduce Risk](#distributing-control-plane-nodes-to-reduce-risk)
* [Automated Replacement of Unhealthy Nodes](#automated-replacement-of-unhealthy-nodes)
* [Support for Infrastructure-Managed Node Groups](#infrastructure-managed-node-groups)

For anyone who wants to understand the API, or prizes a simple, but powerful, command-line interface, the new release brings:

* [Redesigned clusterctl, a command-line tool (and go library) for installing and managing the lifecycle of Cluster API](#clusterctl)
* [Extensive and up-to-date documentation in The Cluster API Book](#the-cluster-api-book)

Finally, for anyone extending the Cluster API for their custom infrastructure or software needs:

* [New End-to-End (e2e) Test Framework](#end-to-end-test-framework)
* [Documentation for integrating Cluster API into your cluster lifecycle stack](#provider-implementer-s-guide)

All this was possible thanks to the hard work of many contributors.

## Declarative Control Plane Management
_Special thanks to [Jason DeTiberus](https://github.com/detiber/), [Naadir Jeewa](https://github.com/randomvariable), and [Chuck Ha](https://github.com/chuckha)_

The Kubeadm-based Control Plane (KCP) provides a declarative API to deploy and scale the Kubernetes control plane, including etcd. This is the feature many Cluster API users have been waiting for! Until now, to deploy and scale up the control plane, users had to create specially-crafted Machine resources. To scale down the control plane, they had to manually remove members from the etcd cluster. KCP automates deployment, scaling, and upgrades.

> **What is the Kubernetes Control Plane?**
> The Kubernetes control plane is, at its core, kube-apiserver and etcd. If either of these are unavailable, no API requests can be handled. This impacts not only core Kubernetes APIs, but APIs implemented with CRDs. Other components, like kube-scheduler and kube-controller-manager, are also important, but do not have the same impact on availability.
>
> The control plane was important in the beginning because it scheduled workloads. However, some workloads could continue to run during a control plane outage. Today, workloads depend on operators, service meshes, and API gateways, which all use the control plane as a platform. Therefore, the control plane's availability is more important than ever.
>
> Managing the control plane  is one of the most complex parts of cluster operation. Because the typical control plane includes etcd, it is stateful, and operations must be done in the correct sequence. Control plane replicas can and do fail, and maintaining control plane availability means being able to replace failed nodes.
>
> The control plane can suffer a complete outage (e.g. permanent loss of quorum in etcd), and recovery (along with regular backups) is sometimes the only feasible option.
>
> For more details, read about [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/) in the Kubernetes documentation.

Here's an example of a 3-replica control plane for the Cluster API Docker Infrastructure, which the project maintains for testing and development. For brevity, other required resources, like Cluster, and Infrastructure Template, referenced by its name and namespace, are not shown.

```yaml
apiVersion: controlplane.cluster.x-k8s.io/v1alpha3
kind: KubeadmControlPlane
metadata:
  name: example
spec:
  infrastructureTemplate:
    apiVersion: infrastructure.cluster.x-k8s.io/v1alpha3
    kind: DockerMachineTemplate
    name: example
    namespace: default
  kubeadmConfigSpec:
    clusterConfiguration:
  replicas: 3
  version: 1.16.3
```

Deploy this control plane with kubectl:
```shell
kubectl apply -f example-docker-control-plane.yaml
```

Scale the control plane the same way you scale other Kubernetes resources:
```shell
kubectl scale kubeadmcontrolplane example  --replicas=5
```
```
kubeadmcontrolplane.controlplane.cluster.x-k8s.io/example scaled
```

Upgrade the control plane to a newer patch of the Kubernetes release:
```shell
kubectl patch kubeadmcontrolplane example --type=json -p '[{"op": "replace", "path": "/spec/version", "value": "1.16.4"}]'
```

> **Number of Control Plane Replicas**
> By default, KCP is configured to manage etcd, and requires an odd number of replicas. If KCP is configured to not manage etcd, an odd number is recommended, but not required. An odd number of replicas ensures optimal etcd configuration. To learn why your etcd cluster should have an odd number of members, see the [etcd FAQ](https://etcd.io/docs/v3.4.0/faq/#why-an-odd-number-of-cluster-members).

Because it is a core Cluster API component, KCP can be used with any v1alpha3-compatible Infrastructure Provider that provides a fixed control plane endpoint, i.e., a load balancer or virtual IP. This endpoint enables requests to reach multiple control plane replicas.

> **What is an Infrastructure Provider?**
> A source of computational resources (e.g. machines, networking, etc.). The community maintains providers for AWS, Azure, Google Cloud, and VMWare. For details, see the [list of providers](https://cluster-api.sigs.k8s.io/reference/providers.html) in the Cluster API Book.

## Distributing Control Plane Nodes To Reduce Risk
_Special thanks to [Vince Prignano](https://github.com/vincepri/), and [Chuck Ha](https://github.com/chuckha)_

Cluster API users can now deploy nodes in different failure domains, reducing the risk of a cluster failing due to a domain outage. This is especially important for the control plane: If nodes in one domain fail, the cluster can continue to operate as long as the control plane is available to nodes in other domains.

> **What is a Failure Domain?**
> A failure domain is a way to group the resources that would be made unavailable by some failure. For example, in many public clouds, an "availability zone" is the default failure domain. A zone corresponds to a data center. So, if a specific data center is brought down by a power outage or natural disaster, all resources in that zone become unavailable. If you run Kubernetes on your own hardware, your failure domain might be a rack, a network switch, or power distribution unit.

The Kubeadm-based ControlPlane distributes nodes across failure domains. To minimize the chance of losing multiple nodes in the event of a domain outage, it tries to distribute them evenly: it deploys a new node in the failure domain with the fewest existing nodes, and it removes an existing node in the failure domain with the most existing nodes.

MachineDeployments and MachineSets do not distribute nodes across failure domains. To deploy your worker nodes across multiple failure domains, create a MachineDeployment or MachineSet for each failure domain.

The Failure Domain API works on any infrastructure. That's because every Infrastructure Provider maps failure domains in its own way. The API is optional, so if your infrastructure is not complex enough to need failure domains, you do not need to support it. This example is for the Cluster API Docker Infrastructure Provider. Note that two of the domains are marked as suitable for control plane nodes, while a third is not. The Kubeadm-based ControlPlane will only deploy nodes to domains marked suitable.

```yaml
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha3
kind: DockerCluster
metadata:
  name: example
spec:
  controlPlaneEndpoint:
    host: 172.17.0.4
    port: 6443
  failureDomains:
    domain-one:
      controlPlane: true
    domain-two:
      controlPlane: true
    domain-three:
      controlPlane: false
```

The [AWS Infrastructure Provider](https://github.com/kubernetes-sigs/cluster-api-provider-aws) (CAPA), maintained by the Cluster API project, maps failure domains to AWS Availability Zones. Using CAPA, you can deploy a cluster across multiple Availability Zones. First, define subnets for multiple Availability Zones. The CAPA controller will define a failure domain for each Availability Zone. Deploy the control plane with the KubeadmControlPlane: it will distribute replicas across the failure domains. Finally, create a separate MachineDeployment for each failure domain.

## Automated Replacement of Unhealthy Nodes
_Special thanks to [Alberto García Lamela](https://github.com/enxebre), and [Joel Speed](http://github.com/joelspeed)_

There are many reasons why a node might be unhealthy. The kubelet process may stop. The container runtime might have a bug. The kernel might have a memory leak. The disk may run out of space. CPU, disk, or memory hardware may fail. A power outage may happen. Failures like these are especially common in larger clusters.

Kubernetes is designed to tolerate them, and to help your applications tolerate them as well. Nevertheless, only a finite number of nodes can be unhealthy before the cluster runs out of resources, and Pods are evicted or not scheduled in the first place. Unhealthy nodes should be repaired or replaced at the earliest opportunity.

The Cluster API now includes a MachineHealthCheck resource, and a controller that monitors node health. When it detects an unhealthy node, it removes it. (Another Cluster API controller detects the node has been removed and replaces it.) You can configure the controller to suit your needs. You can configure how long to wait before removing the node. You can also set a threshold for the number of unhealthy nodes. When the threshold is reached, no more nodes are removed. The wait can be used to tolerate short-lived outages, and the threshold to prevent too many nodes from being replaced at the same time.

The controller will remove only nodes managed by a Cluster API MachineSet. The controller does not remove control plane nodes, whether managed by the Kubeadm-based Control Plane, or by the user, as in v1alpha2. For more, see [Limits and Caveats of a MachineHealthCheck](https://cluster-api.sigs.k8s.io/tasks/healthcheck.html#limitations-and-caveats-of-a-machinehealthcheck).

Here is an example of a MachineHealthCheck. For more details, see [Configure a MachineHealthCheck](https://cluster-api.sigs.k8s.io/tasks/healthcheck.html) in the Cluster API book.

```yaml
apiVersion: cluster.x-k8s.io/v1alpha3
kind: MachineHealthCheck
metadata:
  name: example-node-unhealthy-5m
spec:
  clusterName: example
  maxUnhealthy: 33%
  nodeStartupTimeout: 10m
  selector:
    matchLabels:
      nodepool: nodepool-0
  unhealthyConditions:
  - type: Ready
    status: Unknown
    timeout: 300s
  - type: Ready
    status: "False"
    timeout: 300s
```

## Infrastructure-Managed Node Groups
_Special thanks to [Juan-Lee Pang](https://github.com/juan-lee) and [Cecile Robert-Michon](https://github.com/CecileRobertMichon)_

If you run large clusters, you need to create and destroy hundreds of nodes, sometimes in minutes. Although public clouds make it possible to work with large numbers of nodes, having to make a separate API request to create or delete every node may scale poorly. For example, API requests may have to be delayed to stay within rate limits.

Some public clouds offer APIs to manage groups of nodes as one single entity. For example, AWS has AutoScaling Groups, Azure has  Virtual Machine Scale Sets, and GCP has Managed Instance Groups. With this release of Cluster API, Infrastructure Providers can add support for these APIs, and users can deploy groups of Cluster API Machines by using the MachinePool Resource. For more information, see the [proposal](https://github.com/kubernetes-sigs/cluster-api/blob/bf51a2502f9007b531f6a9a2c1a4eae1586fb8ca/docs/proposals/20190919-machinepool-api.md) in the Cluster API repository.

> **Experimental Feature**
> The MachinePool API is an experimental feature that is not enabled by default. Users are encouraged to try it and report on how well it meets their needs.

## The Cluster API User Experience, Reimagined

### clusterctl
_Special thanks to [Fabrizio Pandini](https://github.com/fabriziopandini)_

If you are new to Cluster API, your first experience will probably be with the project's command-line tool, clusterctl. And with the new Cluster API release, it has been re-designed to be more pleasing to use than before. The tool is all you need to deploy your first [workload cluster](https://cluster-api.sigs.k8s.io/reference/glossary.html?highlight=pool#workload-cluster) in just a few steps.

First, use `clusterctl init` to [fetch the configuration](https://cluster-api.sigs.k8s.io/clusterctl/commands/init.html) for your Infrastructure and Bootstrap Providers and deploy all of the components that make up the Cluster API. Second, use `clusterctl config cluster` to [create the workload cluster manifest](https://cluster-api.sigs.k8s.io/clusterctl/commands/config-cluster.html). This manifest is just a collection of Kubernetes objects. To create the workload cluster, just `kubectl apply` the manifest. Don't be surprised if this workflow looks familiar: Deploying a workload cluster with Cluster API is just like deploying an application workload with Kubernetes!

Clusterctl also helps with the "day 2" operations. Use `clusterctl move` to [migrate Cluster API custom resources](https://cluster-api.sigs.k8s.io/clusterctl/commands/move.html), such as Clusters, and Machines, from one [Management Cluster](https://cluster-api.sigs.k8s.io/reference/glossary.html#management-cluster) to another. This step--also known as a [pivot](https://cluster-api.sigs.k8s.io/reference/glossary.html#pivot)--is necessary to create a workload cluster that manages itself with Cluster API. Finally, use `clusterctl upgrade` to [upgrade all of the installed components](https://cluster-api.sigs.k8s.io/clusterctl/commands/upgrade.html) when a new Cluster API release becomes available.

One more thing! Clusterctl is not only a command-line tool. It is also a Go library! Think of the library as an integration point for projects that build on top of Cluster API. All of clusterctl's command-line functionality is available in the library, making it easy to integrate into your stack. To get started with the library, please read its [documentation](https://pkg.go.dev/sigs.k8s.io/cluster-api@v0.3.1/cmd/clusterctl/client?tab=doc).

### The Cluster API Book
_Thanks to many contributors!_

The [project's documentation](https://cluster-api.sigs.k8s.io/) is extensive. New users should get some background on the  [architecture](https://cluster-api.sigs.k8s.io/user/concepts.html), and then create a cluster of their own with the [Quick Start](https://cluster-api.sigs.k8s.io/user/quick-start.html). The clusterctl tool has its own [reference](https://cluster-api.sigs.k8s.io/clusterctl/overview.html). The [Developer Guide](https://cluster-api.sigs.k8s.io/developer/guide.html) has plenty of information for anyone interested in contributing to the project.

Above and beyond the content itself, the project's documentation site is a pleasure to use. It is searchable, has an outline, and even supports different color themes. If you think the site a lot like the documentation for a different community project, [Kubebuilder](https://book.kubebuilder.io/), that is no coincidence! Many thanks to Kubebuilder authors for creating a great example of documentation. And many thanks to the [mdBook](https://github.com/rust-lang/mdBook) authors for creating a great tool for building documentation.

## Integrate & Customize

### End-to-End Test Framework
_Special thanks to [Chuck Ha](https://github.com/chuckha)_

The Cluster API project is designed to be extensible. For example, anyone can develop their own Infrastructure and Bootstrap Providers. However, it's important that Providers work in a uniform way. And, because the project is still evolving, it takes work to make sure that Providers are up-to-date with new releases of the core.

The End-to-End Test Framework provides a set of standard tests for developers to verify that their Providers integrate correctly with the current release of Cluster API, and help identify any regressions that happen after a new release of the Cluster API, or the Provider.

For more details on the Framework, see [Testing](https://cluster-api.sigs.k8s.io/developer/testing.html?highlight=e2e#running-the-end-to-end-tests) in the Cluster API Book, and the [README](https://github.com/kubernetes-sigs/cluster-api/tree/master/test/framework) in the repository.

### Provider Implementer's Guide
_Thanks to many contributors!_

The community maintains [Infrastructure Providers](https://cluster-api.sigs.k8s.io/reference/providers.html) for a many popular infrastructures. However, if you want to build your own Infrastructure or Bootstrap Provider, the [Provider Implementer's](https://cluster-api.sigs.k8s.io/developer/providers/implementers-guide/overview.html) guide explains the entire process, from creating a git repository, to creating CustomResourceDefinitions for your Providers, to designing, implementing, and testing the controllers.

> **Under Active Development**
> The Provider Implementer's Guide is actively under development, and may not yet reflect all of the changes in the v1alpha3 release.

## Join Us!

The Cluster API project is a very active project, and covers many areas of interest. If you are an infrastructure expert, you can contribute to one of the Infrastructure Providers. If you like building controllers, you will find opportunities to innovate. If you're curious about testing distributed systems, you can help develop the project's end-to-end test framework. Whatever your interests and background, you can make a real impact on the project.

Come introduce yourself to the community at our weekly meeting, where we dedicate a block of time for a Q&A session. You can also find maintainers and users on the Kubernetes Slack, and in the Kubernetes forum. Please check out the links below. We look forward to seeing you!

*   Chat with us on the Kubernetes [Slack](http://slack.k8s.io/):[ #cluster-api](https://kubernetes.slack.com/archives/C8TSNPY4T)
*   Join the [sig-cluster-lifecycle](https://groups.google.com/forum/) Google Group to receive calendar invites and gain access to documents
*   Join our [Zoom meeting](https://zoom.us/j/861487554), every Wednesday at 10:00 Pacific Time
*   Post to the [Cluster API community forum](https://discuss.kubernetes.io/c/contributors/cluster-api)
