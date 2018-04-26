---
cn-approvers:
- tianshapjq
title: 词汇和术语
---
<!--
---
title: Glossary and Terminology
---
-->

{% capture overview %}
<!--
This page explains some of the terminology used in deploying Kubernetes with Juju.
-->
本文解释了用 Juju 部署 Kubernetes 时使用的一些术语。
{% endcapture %}

{% capture body %}


<!--
**controller** - The management node of a cloud environment. Typically you have one controller per cloud region, or more in HA environments. The controller is responsible for managing all subsequent models in a given environment. It contains the Juju API server and its underlying database.
-->
**控制器** - 云环境的管理节点。通常，每个云区域有一个控制器，而 HA 环境中有更多的控制器。控制器负责管理给定环境中的所有后续模型。它包含 Juju API 服务器及其底层数据库。

<!--
**model** - A collection of charms and their relationships that define a deployment. This includes machines and units. A controller can host multiple models. It is recommended to separate Kubernetes clusters into individual models for management and isolation reasons.
-->
**模型** - 定义一个部署所需的一系列 charm 及其它们之间的关系。这包括主机及各种单元。一个控制器能够管理多个模型。由于管理和隔离的原因，建议将 Kubernetes 集群分成单独的模型。

<!--
**charm** - The definition of a service, including its metadata, dependencies with other services, required packages, and application management logic. It contains all the operational knowledge of deploying a Kubernetes cluster. Included charm examples are  `kubernetes-core`, `easy-rsa`, `kibana`, and `etcd`.
-->
**charm** - 对服务的定义，包括元数据、与其它服务的依赖关系、所需的包和应用程序管理逻辑。它包含部署 Kubernetes 集群的所有操作知识。charm 的例子包括 `kubernetes-core`、`easy-rsa`、`kibana` 和 `etcd`。

<!--
**unit** - A given instance of a service. These may or may not use up a whole machine, and may be colocated on the same machine. So for example you might have a `kubernetes-worker`, and `filebeat`, and `topbeat` units running on a single machine, but they are three distinct units of different services.
-->
**单元** - 给定的服务实例。这些可能会（也可能不会）耗尽整个机器，并可能位于同一台机器上。例如，您可能在一台机器上运行 `kubernetes-worker`、`filebeat` 和 `topbeat` 单元，但它们是三个不同服务的不同单元。

<!--
**machine** - A physical node, these can either be bare metal nodes, or virtual machines provided by a cloud.
-->
**机器** - 一个物理节点，可以是裸机，也可以是云环境提供的虚拟机。
{% endcapture %}

{% include templates/concept.md %}
