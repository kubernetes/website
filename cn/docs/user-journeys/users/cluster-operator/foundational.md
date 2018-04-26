---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: 基础
track: "USERS › CLUSTER OPERATOR › FOUNDATIONAL"
---

<!--
---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Foundational
track: "USERS › CLUSTER OPERATOR › FOUNDATIONAL"
---
-->

<!--
{% capture overview %}

If you want to learn how to get started managing and operating a Kubernetes cluster, this page and the linked topics introduce you to the foundational concepts and tasks.
This page introduces you to a Kubernetes cluster and key concepts to understand and manage it. The content focuses primarily on the cluster itself rather than the software running within the cluster.

{% endcapture %}
-->

{% capture overview %}

如果您想了解如何开始管理和运营 Kubernetes 集群，本页面和链接的主题向您介绍基础概念和任务。
本页面向您介绍 Kubernetes 集群和关键概念，以便了解和管理它。内容主要集中在集群本身，而不是在集群内运行的软件。

{% endcapture %}


<!-- Foundational
Nodes, Pods, Networks, Deployments, Services, ConfigMaps, Secrets
Labels, Selectors, Annotations
Metrics
-->

<!--
{% capture body %}

## Get an overview of Kubernetes

If you have not already done so, start your understanding by reading through [What is Kubernetes?](/docs/concepts/overview/what-is-kubernetes/), which introduces a number of basic concepts and terms.
-->

{% capture body %}

## 认识 Kubernetes

如果您还没有这样做，通过阅读 [什么是Kubernetes？](/docs/concepts/overview/what-is-kubernetes/) 作为开始，它介绍了一些基本概念和术语。

<!--
Kubernetes is quite flexible, and a cluster can be run in a wide variety of places. You can interact with Kubernetes entirely on your own laptop or local development machine with it running within a virtual machine. Kubernetes can also run on virtual machines hosted either locally or in a cloud provider, and you can run a Kubernetes cluster on bare metal.
-->

Kubernetes 非常灵活，集群可以在各种各样的地方运行。您可以完全在您自己的笔记本电脑或本地开发机器上与 Kubernetes 进行交互，并在虚拟机中运行它。Kubernetes 还可以在本地或云提供商托管的虚拟机上运行，您也可以在裸机上运行 Kubernetes 集群。

<!--
A cluster is made up of one or more [Nodes](/docs/concepts/architecture/nodes/); where a node is a physical or virtual machine.
If there is more than one node in your cluster then the nodes are connected with a [cluster network](/docs/concepts/cluster-administration/networking/).
Regardless of how many nodes, all Kubernetes clusters generally have the same components, which are described in [Kubernetes Components](/docs/concepts/overview/components).
-->

一个集群由一个或多个 [节点](/docs/concepts/architecture/nodes/) 组成；如果集群中有多个节点，则节点通过 [集群网络](/docs/concepts/cluster-administration/networking/) 连接。
无论有多少个节点，所有 Kubernetes 集群通常都具有相同的组件，在 [Kubernetes组件](/docs/concepts/overview/components) 中对此进行了描述。

<!--
## Learn about Kubernetes basics

A good way to become familiar with how to manage and operate a Kubernetes cluster is by setting one up.
One of the most compact ways to experiment with a cluster is [Installing and using Minikube](/docs/tasks/tools/install-minikube/).
Minikube is a command line tool for setting up and running a single-node cluster within a virtual machine on your local laptop or development computer. Minikube is even available through your browser at the [Katacoda Kubernetes Playground](https://www.katacoda.com/courses/kubernetes/playground).
Katacoda provides a browser-based connection to a single-node cluster, using minikube behind the scenes, to support a number of tutorials to explore Kubernetes. You can also leverage the web-based [Play with Kubernetes](http://labs.play-with-k8s.com/) to the same ends - a temporary cluster to play with on the web.
-->

## 了解 Kubernetes 基础知识

熟悉如何管理和操作 Kubernetes 好办法就是启动一套集群。
试验集群最简洁凝练的方法之一就是 [安装和使用Minikube](/docs/tasks/tools/install-minikube/)。
Minikube 是一个命令行工具，用于在本地笔记本电脑或开发计算机上的虚拟机中设置和运行单节点集群。Minikube 甚至可以通过您的浏览器在 [Katacoda Kubernetes Playground](https://www.katacoda.com/courses/kubernetes/playground) 上使用。
Katacoda 提供基于浏览器的连接到单节点集群的功能，在后台使用 minikube，以此支持大量教程来探索 Kubernetes。您也可以使用基于网络的 [与Kubernetes一起](http://labs.play-with-k8s.com/) 来达到同样的目的 - 一个可以在网上玩的临时集群。

<!--
You interact with Kubernetes either through a dashboard, an API, or using a command-line tool (such as `kubectl`) that interacts with the Kubernetes API.
Be familiar with [Organizing Cluster Access](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) by using configuration files.
The Kubernetes API exposes a number of resources that provide the building blocks and abstractions that are used to run software on Kubernetes.
Learn more about these resources at [Understanding Kubernetes Objects](/docs/concepts/overview/kubernetes-objects).
These resources are covered in a number of articles within the Kubernetes documentation.
-->

您可以通过 dashboard，API 或使用与 Kubernetes API 交互的命令行工具（例如`kubectl`）与 Kubernetes 进行交互。
通过使用配置文件来熟悉 [组织集群访问](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)。
Kubernetes API 公开了许多资源，这些资源提供用于在 Kubernetes 上运行软件的构建块和抽象。
在 [了解Kubernetes对象](/docs/concepts/overview/kubernetes-objects) 中了解关于这些资源的更多信息。
Kubernetes 文档中的许多文章都涵盖了这些资源。

<!--
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
-->

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

<!--
As a cluster operator you may not need to use all these resources, although you should be familiar with them to understand how the cluster is being used.
There are a number of additional resources that you should be aware of, some listed under [Intermediate Resources](/docs/user-journeys/users/cluster-operator/intermediate#section-1).
You should also be familiar with [how to manage kubernetes resources](/docs/concepts/cluster-administration/manage-deployment/).
-->

作为集群管理员，您可能不需要使用这些资源，但您应该熟悉它们以便能了解集群的使用方式。
您应该了解一些附加资源，其中一些被列在 [中间资源](/docs/user-journeys/users/cluster-operator/intermediate#section-1) 下。
您也应该熟悉 [怎样管理 kubernetes 集群](/docs/concepts/cluster-administration/manage-deployment/)。

<!--
## Get information about your cluster

You can [access clusters using the Kubernetes API](/docs/tasks/administer-cluster/access-cluster-api/).
If you are not already familiar with how to do this, you can review the [introductory tutorial](/docs/tutorials/kubernetes-basics/explore-intro/).
Using `kubectl`, you can retrieve information about your Kubernetes cluster very quickly.
To get basic information about the nodes in your cluster run the command `kubectl get nodes`.
You can get more detailed information for the same nodes with the command `kubectl describe nodes`.
You can see the status of the core of kubernetes with the command `kubectl get componentstatuses`.
-->

## 获取集群的有关信息

您可以 [使用 Kubernetes API 访问集群](/docs/tasks/administer-cluster/access-cluster-api/)。
如果您还不熟悉如何操作，可以查看 [入门教程](/docs/tutorials/kubernetes-basics/explore-intro/)。
使用 `kubectl`，您可以非常快速地检索 Kubernetes 集群的有关信息。
要获得有关集群中节点的基本信息，请运行命令 `kubectl get nodes`。
您可以使用命令 `kubectl describe nodes` 获取更多相同节点的详细信息。
您可以使用命令 `kubectl get componentstatuses` 来查看 kubernetes 核心的状态。

<!--
Some additional resources for getting information about your cluster and how it is operating include:

* [Tools for Monitoring Compute, Storage, and Network Resources](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [Core metrics pipeline](/docs/tasks/debug-application-cluster/core-metrics-pipeline/)
  * [Metrics](/docs/concepts/cluster-administration/controller-metrics/)
-->

获取有关集群信息及其运行方式的其他一些资源包括：

* [监控计算，存储和网络资源的工具](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [核心指标管道](/docs/tasks/debug-application-cluster/core-metrics-pipeline/)
  * [指标](/docs/concepts/cluster-administration/controller-metrics/)

<!--
## Explore additional resources

### Tutorials

* [Kubernetes Basics](/docs/tutorials/kubernetes-basics/)
* [Kubernetes 101](/docs/user-guide/walkthrough/) - kubectl command line interface and Pods
* [Kubernetes 201](/docs/user-guide/walkthrough/k8s201/) - labels, deployments, services, and health checking
* [Configuring Redis with a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)
* Stateless Applications
  * [Deploying PHP Guestbook with Redis](/docs/tutorials/stateless-application/guestbook/)
  * [Expose an External IP address to access an application](/docs/tutorials/stateless-application/expose-external-ip-address/)

{% endcapture %}

{% include templates/user-journey-content.md %}
-->

## 获取更多资源

### 教程

* [Kubernetes 基础](/docs/tutorials/kubernetes-basics/)
* [Kubernetes 101](/docs/user-guide/walkthrough/) - kubectl 命令行和 Pods
* [Kubernetes 201](/docs/user-guide/walkthrough/k8s201/) - labels, deployments, services, 和 health checking
* [使用 ConfigMap 配置 Redis](/docs/tutorials/configuration/configure-redis-using-configmap/)
* 无状态应用程序
  * [使用 Redis 部署 PHP 留言簿](/docs/tutorials/stateless-application/guestbook/)
  * [公开外部 IP 地址以访问应用程序](/docs/tutorials/stateless-application/expose-external-ip-address/)

{% endcapture %}

{% include templates/user-journey-content.md %}
