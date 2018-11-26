<!--
---
title: Glossary and Terminology
content_template: templates/concept
---
-->

---
题目: 词汇与术语
---

<!--
{{% capture overview %}}
This page explains some of the terminology used in deploying Kubernetes with Juju.
{{% /capture %}}

{{% capture body %}}
-->

{{％capture overview％}}
本页介绍了用 Juju 部署 Kubernetes 时使用的一些术语。
{{％/ capture％}}

{{％capture body％}}

<!--
**controller** - The management node of a cloud environment. Typically you have one controller per cloud region, or more in HA environments. The controller is responsible for managing all subsequent models in a given environment. It contains the Juju API server and its underlying database.

**model** - A collection of charms and their relationships that define a deployment. This includes machines and units. A controller can host multiple models. It is recommended to separate Kubernetes clusters into individual models for management and isolation reasons.

**charm** - The definition of a service, including its metadata, dependencies with other services, required packages, and application management logic. It contains all the operational knowledge of deploying a Kubernetes cluster. Included charm examples are  `kubernetes-core`, `easyrsa`, `flannel`, and `etcd`.

**unit** - A given instance of a service. These may or may not use up a whole machine, and may be colocated on the same machine. So for example you might have a `kubernetes-worker`, and `etcd`, and `easyrsa` units running on a single machine, but they are three distinct units of different services.

**machine** - A physical node, these can either be bare metal nodes, or virtual machines provided by a cloud.
{{% /capture %}}
-->

**controller** - 云环境的管理节点。通常，每个域都有一个控制器，在高可用环境中有更多控制器。控制器负责管理给定环境中的所有后续模型。它包含 Juju API 服务器及其底层数据库。

**model** - 定义deploymets 的一系列 charms 及其关系的集合。这包括机器和更小的单元。控制器可以托管多个模型。出于管理和隔离原因，建议将 Kubernetes 集群分成单独的模型。

**charm** - 服务的定义，包括其元数据，与其他服务的依赖关系，所需的包和应用程序管理逻辑。它包含部署 Kubernetes 集群的所有操作知识。包含的 charms 例子是`kubernetes-core`，`easyrsa`，`flannel`和`etcd`。

**unit** - 服务的给定实例。这些可能会或可能不会耗尽整个机器，并且可能位于同一台机器上。因此，例如，您可能在一台机器上运行 `kubernetes-worker` 和 `etcd`，以及`easyrsa`单元，但它们是不同服务的三个不同单元。

**machine** - 物理节点，可以是裸机节点，也可以是云提供商提供的虚拟机。
{{％/ capture％}}
