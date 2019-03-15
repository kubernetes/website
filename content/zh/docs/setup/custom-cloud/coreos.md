---
title: CoreOS 在 AWS 或者 GCE 上
reviewers:
- errordeveloper
content_template: templates/concept
---

<!--
---
title: CoreOS on AWS or GCE
reviewers:
- errordeveloper
content_template: templates/concept
---
-->

{{% capture overview %}}

<!--
There are multiple guides on running Kubernetes with [CoreOS](https://coreos.com/kubernetes/docs/latest/).
-->
有很多关于使用 [CoreOS](https://coreos.com/kubernetes/docs/latest/) 运行 Kubernetes 的指南。

{{% /capture %}}

{{% capture body %}}

<!--
## Official CoreOS Guides
-->

## CoreOS 官方指南

<!--
These guides are maintained by CoreOS and deploy Kubernetes the "CoreOS Way" with full TLS, the DNS add-on, and more. These guides pass Kubernetes conformance testing and we encourage you to [test this yourself](https://coreos.com/kubernetes/docs/latest/conformance-tests.html).
-->
这些指南由 CoreOS 维护，并以 "CoreOS 方式" 部署 Kubernetes 包括完整的 TLS、DNS 附加组件等等。这些指南通过了 Kubernete s一致性测试，我们鼓励您[自己测试](https://coreos.com/kubernetes/docs/latest/conformance-tests.html)

<!--
* [**AWS Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)
-->
* [**AWS 多节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)

<!--
    Guide and CLI tool for setting up a multi-node cluster on AWS.
    CloudFormation is used to set up a master and multiple workers in auto-scaling groups.
-->
    用于在 AWS 上设置多节点群集的指南和 CLI 工具。
    CloudFormation 用于在自动扩缩组中设置一个 master 和多个工作节点。

<!--
* [**Bare Metal Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-baremetal.html#automated-provisioning)

    Guide and HTTP/API service for PXE booting and provisioning a multi-node cluster on bare metal.
    [Ignition](https://coreos.com/ignition/docs/latest/) is used to provision a master and multiple workers on the first boot from disk.
-->

* [**Bare Metal 多节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-baremetal.html#automated-provisioning)

    用于 PXE 引导和配置裸机上的多节点群集的指南和 HTTP/API 服务。
    [Ignition](https://coreos.com/ignition/docs/latest/) 用于在第一个磁盘引导上提供一个主进程和多个工作。
    
<!--    
* [**Vagrant Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)

    Guide to setting up a multi-node cluster on Vagrant.
    The deployer can independently configure the number of etcd nodes, master nodes, and worker nodes to bring up a fully HA control plane.
-->

* [**Vagrant 多节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)

    在 Vagrant 上设置多节点群集的指南。
    部署人员可以独立配置 etcd 节点、主节点和工作节点的数量，从而生成一个完整的 HA 控制平面。

<!--
* [**Vagrant Single-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant-single.html)

    The quickest way to set up a Kubernetes development environment locally.
    As easy as `git clone`, `vagrant up` and configuring `kubectl`.
-->

* [**Vagrant 单节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant-single.html)

    在本地设置 Kubernetes 开发环境的最快方法。
    就像 `git clone`、`vagrant up` 和 配置 `kubectl` 一样简单。

<!--
* [**Full Step by Step Guide**](https://coreos.com/kubernetes/docs/latest/getting-started.html)

    A generic guide to setting up an HA cluster on any cloud or bare metal, with full TLS.
    Repeat the master or worker steps to configure more machines of that role.
-->
* [**完整的一步一步的指导**](https://coreos.com/kubernetes/docs/latest/getting-started.html)

    使用完整 TLS 在任何云或裸机上设置 HA 群集的通用指南。
    重复主步骤或工作节点步骤以配置该更多该角色的机器。

<!--
## Community Guides
-->

## 社区指南

<!--
These guides are maintained by community members, cover specific platforms and use cases, and experiment with different ways of configuring Kubernetes on CoreOS.
-->
这些指南由社区成员维护，涵盖特定平台和用例，并尝试在 CoreOS 上配置 Kubernetes 的不同方法。

<!--
* [**Easy Multi-node Cluster on Google Compute Engine**](https://github.com/rimusz/coreos-multi-node-k8s-gce/blob/master/README.md)

    Scripted installation of a single master, multi-worker cluster on GCE.
    Kubernetes components are managed by [fleet](https://github.com/coreos/fleet).
-->

* [**Google Compute Engine 上的简易多节点群集**](https://github.com/rimusz/coreos-multi-node-k8s-gce/blob/master/README.md)

    在 GCE 上脚本安装单个主、多个工作节点集群。
    Kubernetes 组件由 [fleet](https://github.com/coreos/fleet) 管理。

<!--
* [**Multi-node cluster using cloud-config and Weave on Vagrant**](https://github.com/errordeveloper/weave-demos/blob/master/poseidon/README.md)

    Configure a Vagrant-based cluster of 3 machines with networking provided by Weave.
-->

* [**使用 cloud-config 和 Weave on Vagrant 的多节点集群**](https://github.com/errordeveloper/weave-demos/blob/master/poseidon/README.md)

    使用 Weave 提供的网络配置基于 Vagrant 的 3 台计算机集群。

<!--
* [**Multi-node cluster using cloud-config and Vagrant**](https://github.com/pires/kubernetes-vagrant-coreos-cluster/blob/master/README.md)

    Configure a single master, multi-worker cluster locally, running on your choice of hypervisor: VirtualBox, Parallels, or VMware
-->

* [**使用 cloud-config 和 Vagrant 的多节点集群**](https://github.com/pires/kubernetes-vagrant-coreos-cluster/blob/master/README.md)

   在本地配置单个主，多工作集群，在您选择的虚拟机管理程序上运行：VirtualBox、Parallels 或 VMware
    

<!--
* [**Single-node cluster using a small macOS App**](https://github.com/rimusz/kube-solo-osx/blob/master/README.md)

    Guide to running a solo cluster (master + worker) controlled by an macOS menubar application.
    Uses xhyve + CoreOS under the hood.
-->

* [**使用一个小型 macOS 应用程序的单节点集群**](https://github.com/rimusz/kube-solo-osx/blob/master/README.md)

    运行由 macO S菜单栏应用程序控制的单独集群(主 + 工作节点)指南。
    在引擎盖下使用 xhyve + CoreOS。

<!--
* [**Multi-node cluster with Vagrant and fleet units using a small macOS App**](https://github.com/rimusz/coreos-osx-gui-kubernetes-cluster/blob/master/README.md)

    Guide to running a single master, multi-worker cluster controlled by an macOS menubar application.
    Uses Vagrant under the hood.
-->

* [**使用一个小型 macOS 应用程序并具有 Vagrant 和 fleet 单元的多节点集群**](https://github.com/rimusz/coreos-osx-gui-kubernetes-cluster/blob/master/README.md)

    运行由 macOS 菜单栏应用程序控制的单个主，多工作集群的指南。
    在引擎盖下使用 Vagrant。

<!--
* [**Multi-node cluster using cloud-config, CoreOS and VMware ESXi**](https://github.com/xavierbaude/VMware-coreos-multi-nodes-Kubernetes)

    Configure a single master, single worker cluster on VMware ESXi.
-->

* [**使用 cloud-config，CoreOS 和 VMware ESXi 的多节点群集**](https://github.com/xavierbaude/VMware-coreos-multi-nodes-Kubernetes)

    在 VMware ESXi 上配置单个主，单个工作集群。

<!--
* [**Single/Multi-node cluster using cloud-config, CoreOS and Foreman**](https://github.com/johscheuer/theforeman-coreos-kubernetes)

    Configure a standalone Kubernetes or a Kubernetes cluster with [Foreman](https://theforeman.org).
-->

* [**使用 cloud-config，CoreOS 和 Foreman 的单/多节点集群**](https://github.com/johscheuer/theforeman-coreos-kubernetes)

    使用 [Foreman](https://theforeman.org) 配置独立的 Kubernetes 或 Kubernetes 集群。

<!--
## Support Level
-->

## 支持级别

<!--
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |          | Community ([@pires](https://github.com/pires))
Vagrant              | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos)                                 |          | Community ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))
-->

IaaS 供应商           | 配置 管理    | 系统    |   网络      | 文档                                              |    标准   | 支持级别
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | CoreOS       | CoreOS | flannel     | [文档](/docs/getting-started-guides/coreos)                                 |          | 社区 ([@pires](https://github.com/pires))
Vagrant              | CoreOS       | CoreOS | flannel     | [文档](/docs/getting-started-guides/coreos)                                 |          | 社区 ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))

<!--
For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
-->
有关所有解决方案的支持级别信息，请参阅[解决方案表](/docs/getting-started-guides/#table-of-solutions)。

{{% /capture %}}
