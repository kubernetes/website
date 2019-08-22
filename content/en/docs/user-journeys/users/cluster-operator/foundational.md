---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Foundational
track: "USERS › CLUSTER OPERATOR › FOUNDATIONAL"
content_template: templates/user-journey-content
---

{{% capture overview %}}

If you want to learn how to get started managing and operating a Kubernetes cluster, this page and the linked topics introduce you to the foundational concepts and tasks.
This page introduces you to a Kubernetes cluster and key concepts to understand and manage it. The content focuses primarily on the cluster itself rather than the software running within the cluster.

{{% /capture %}}

<!-- Foundational
Nodes, Pods, Networks, Deployments, Services, ConfigMaps, Secrets
Labels, Selectors, Annotations
Metrics
-->

{{% capture body %}}

## Get an overview of Kubernetes

If you have not already done so, start your understanding by reading through [What is Kubernetes?](/docs/concepts/overview/what-is-kubernetes/), which introduces a number of basic concepts and terms.

Kubernetes is quite flexible, and a cluster can be run in a wide variety of places. You can interact with Kubernetes entirely on your own laptop or local development machine with it running within a virtual machine. Kubernetes can also run on virtual machines hosted either locally or in a cloud provider, and you can run a Kubernetes cluster on bare metal.

A cluster is made up of one or more [Nodes](/docs/concepts/architecture/nodes/); where a node is a physical or virtual machine.
If there is more than one node in your cluster then the nodes are connected with a [cluster network](/docs/concepts/cluster-administration/networking/).
Regardless of how many nodes, all Kubernetes clusters generally have the same components, which are described in [Kubernetes Components](/docs/concepts/overview/components).


## Learn about Kubernetes basics

A good way to become familiar with how to manage and operate a Kubernetes cluster is by setting one up.
One of the most compact ways to experiment with a cluster is [Installing and using Minikube](/docs/tasks/tools/install-minikube/).
Minikube is a command line tool for setting up and running a single-node cluster within a virtual machine on your local laptop or development computer. Minikube is even available through your browser at the [Katacoda Kubernetes Playground](https://www.katacoda.com/courses/kubernetes/playground).
Katacoda provides a browser-based connection to a single-node cluster, using minikube behind the scenes, to support a number of tutorials to explore Kubernetes. You can also leverage the web-based [Play with Kubernetes](http://labs.play-with-k8s.com/) to the same ends - a temporary cluster to play with on the web.

You interact with Kubernetes either through a dashboard, an API, or using a command-line tool (such as `kubectl`) that interacts with the Kubernetes API.
Be familiar with [Organizing Cluster Access](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) by using configuration files.
The Kubernetes API exposes a number of resources that provide the building blocks and abstractions that are used to run software on Kubernetes.
Learn more about these resources at [Understanding Kubernetes Objects](/docs/concepts/overview/working-with-objects/kubernetes-objects).
These resources are covered in a number of articles within the Kubernetes documentation.

* [Pod Overview](/docs/concepts/workloads/pods/pod-overview/)
  * [Pods](/docs/concepts/workloads/pods/pod/)
  * [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/)
  * [Deployments](/docs/concepts/workloads/controllers/deployment/)
  * [Garbage Collection](/docs/concepts/workloads/controllers/garbage-collection/)
  * [Container Images](/docs/concepts/containers/images/)
  * [Container Environment Variables](/docs/concepts/containers/container-environment-variables/)
* [Labels and Selectors](/docs/concepts/overview/working-with-objects/labels/)
* [Namespaces](/docs/concepts/overview/working-with-objects/namespaces/)
  * [Namespaces Walkthrough](/docs/tasks/administer-cluster/namespaces-walkthrough/)
* [Services](/docs/concepts/services-networking/service/)
* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)
* [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
* [Secrets](/docs/concepts/configuration/secret/)

As a cluster operator you may not need to use all these resources, although you should be familiar with them to understand how the cluster is being used.
There are a number of additional resources that you should be aware of, some listed under [Intermediate Resources](/docs/user-journeys/users/cluster-operator/intermediate#section-1).
You should also be familiar with [how to manage kubernetes resources](/docs/concepts/cluster-administration/manage-deployment/)
and [supported versions and version skew between cluster components](/docs/setup/release/version-skew-policy/).

## Get information about your cluster

You can [access clusters using the Kubernetes API](/docs/tasks/administer-cluster/access-cluster-api/).
If you are not already familiar with how to do this, you can review the [introductory tutorial](/docs/tutorials/kubernetes-basics/explore-intro/).
Using `kubectl`, you can retrieve information about your Kubernetes cluster very quickly.
To get basic information about the nodes in your cluster run the command `kubectl get nodes`.
You can get more detailed information for the same nodes with the command `kubectl describe nodes`.
You can see the status of the core of kubernetes with the command `kubectl get componentstatuses`.

Some additional resources for getting information about your cluster and how it is operating include:

* [Tools for Monitoring Compute, Storage, and Network Resources](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [Resource metrics pipeline](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)
  * [Metrics](/docs/concepts/cluster-administration/controller-metrics/)

## Explore additional resources

### Tutorials

* [Kubernetes Basics](/docs/tutorials/kubernetes-basics/)
* [Configuring Redis with a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)
* Stateless Applications
  * [Deploying PHP Guestbook with Redis](/docs/tutorials/stateless-application/guestbook/)
  * [Expose an External IP address to access an application](/docs/tutorials/stateless-application/expose-external-ip-address/)

{{% /capture %}}
