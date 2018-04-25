---
title: AWS 或 GCE 上的 CoreOS
cn-approvers:
- chentao1596
---
<!--
---
title: CoreOS on AWS or GCE
---
-->

* TOC
{:toc}

<!--
There are multiple guides on running Kubernetes with [CoreOS](https://coreos.com/kubernetes/docs/latest/):
-->
关于如何使用 CoreOS 运行 Kubernetes，有多个指南可供参考。

<!--
### Official CoreOS Guides
-->
### 官方 CoreOS 指南

<!--
These guides are maintained by CoreOS and deploy Kubernetes the "CoreOS Way" with full TLS, the DNS add-on, and more. These guides pass Kubernetes conformance testing and we encourage you to [test this yourself](https://coreos.com/kubernetes/docs/latest/conformance-tests.html).
-->
这些指南由 CoreOS 维护，描述以 “CoreOS 方式” 部署 Kubernetes，包括完整的 TLS、DNS 插件（add-on）等等。这些指南通过了 Kubernetes 的一致性测试，我们也鼓励您 [亲自测试](https://coreos.com/kubernetes/docs/latest/conformance-tests.html)。

<!--
[**AWS Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)
-->
[**AWS 多节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-aws.html)

<!--
Guide and CLI tool for setting up a multi-node cluster on AWS. CloudFormation is used to set up a master and multiple workers in auto-scaling groups.
-->
在 AWS 上建立多节点集群的指南和 CLI 工具。CloudFormation 用于在自动缩放组中设置一个 master 和多个 worker。

<hr/>

<!--
[**Bare Metal Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-baremetal.html#automated-provisioning)
-->
[**裸机多节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-baremetal.html#automated-provisioning)

<!--
Guide and HTTP/API service for PXE booting and provisioning a multi-node cluster on bare metal. [Ignition](https://coreos.com/ignition/docs/latest/) is used to provision a master and multiple workers on the first boot from disk.
-->
PXE 引导和 HTTP/API 服务，用于在裸机上启动和提供多节点集群。[Ignition](https://coreos.com/ignition/docs/latest/) 用于在第一次从磁盘启动时提供一个 master 和多个 worker。

<!--
[**Vagrant Multi-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)
-->
[**Vagrant 多节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant.html)

<!--
Guide to setting up a multi-node cluster on Vagrant. The deployer can independently configure the number of etcd nodes, master nodes, and worker nodes to bring up a fully HA control plane.
-->
在 Vagrant 上建立多节点集群的指南和 CLI 工具。部署人员可以独立地配置 etcd 节点、master 和 worker 的数量，以生成完全的 HA（高可用） 控制平面。

<hr/>

<!--
[**Vagrant Single-Node**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant-single.html)
-->
[**Vagrant 单节点**](https://coreos.com/kubernetes/docs/latest/kubernetes-on-vagrant-single.html)

<!--
The quickest way to set up a Kubernetes development environment locally. As easy as `git clone`, `vagrant up` and configuring `kubectl`.
-->
在本地设置 Kubernetes 开发环境的最快方法。就像 `git clone`、`vagrant up` 以及配置 `kubectl` 一样简单。

<hr/>

<!--
[**Full Step by Step Guide**](https://coreos.com/kubernetes/docs/latest/getting-started.html)
-->
[**一步一步的指南**](https://coreos.com/kubernetes/docs/latest/getting-started.html)

<!--
A generic guide to setting up an HA cluster on any cloud or bare metal, with full TLS. Repeat the master or worker steps to configure more machines of that role.
-->
在任何云或裸机上设置带有完整 TLS 的 HA 集群的通用指南。重复 master 步骤或 worker 步骤，以配置该角色的更多机器。

<!--
### Community Guides
-->
### 社区指南

<!--
These guides are maintained by community members, cover specific platforms and use cases, and experiment with different ways of configuring Kubernetes on CoreOS.
-->
这些指南由社区成员维护，涵盖特定的平台和用例，并尝试在 CoreOS 上配置 Kubernetes 的不同方法。

<!--
[**Easy Multi-node Cluster on Google Compute Engine**](https://github.com/rimusz/coreos-multi-node-k8s-gce/blob/master/README.md)
-->
[**GCE（Google Compute Engine 谷歌计算引擎）上的简单多节点集群**](https://github.com/rimusz/coreos-multi-node-k8s-gce/blob/master/README.md)

<!--
Scripted installation of a single master, multi-worker cluster on GCE. Kubernetes components are managed by [fleet](https://github.com/coreos/fleet).
-->
在 GCE 上按脚本安装单个master、多个 worker 的集群。Kubernetes 组件通过 [fleet](https://github.com/coreos/fleet) 管理。

<hr/>

<!--
[**Multi-node cluster using cloud-config and Weave on Vagrant**](https://github.com/errordeveloper/weave-demos/blob/master/poseidon/README.md)
-->
[**在 Vagrant 上基于云配置和 Weave 的多节点集群**](https://github.com/errordeveloper/weave-demos/blob/master/poseidon/README.md)

<!--
Configure a Vagrant-based cluster of 3 machines with networking provided by Weave.
-->
配置一个基于 Vagant 的 3 台机器的集群，并使用 Weave 提供的网络。

<hr/>

<!--
[**Multi-node cluster using cloud-config and Vagrant**](https://github.com/pires/kubernetes-vagrant-coreos-cluster/blob/master/README.md)
-->
[**使用 cloud-config 和 Vagrant 的多节点集群**](https://github.com/pires/kubernetes-vagrant-coreos-cluster/blob/master/README.md)

<!--
Configure a single master, multi-worker cluster locally, running on your choice of hypervisor: VirtualBox, Parallels, or VMware
-->
在本地配置单个 master、多个 worker 的集群，运行在您选择的 hypervisor 上：VirtualBox、Parallels 或 VMware

<hr/>

<!--
[**Single-node cluster using a small OS X App**](https://github.com/rimusz/kube-solo-osx/blob/master/README.md)
-->
[**使用小型 OS X App 的单节点集群**](https://github.com/rimusz/kube-solo-osx/blob/master/README.md)

<!--
Guide to running a solo cluster (master + worker) controlled by an OS X menubar application. Uses xhyve + CoreOS under the hood.
-->
运行由 OS X 菜单应用控制的 solo 集群（master + worker）的指南。底层使用 xhyve + CoreOS。

<hr/>

<!--
[**Multi-node cluster with Vagrant and fleet units using a small OS X App**](https://github.com/rimusz/coreos-osx-gui-kubernetes-cluster/blob/master/README.md)
-->
[**使用小型 OS X App 基于 Vagrant 和 fleet 单元的多节点集群**](https://github.com/rimusz/coreos-osx-gui-kubernetes-cluster/blob/master/README.md)

<!--
Guide to running a single master, multi-worker cluster controlled by an OS X menubar application. Uses Vagrant under the hood.
-->
运行由 OS X 菜单应用控制的单个 master、多个 worker 的集群的指南。底层使用 Vagrant。

<hr/>

<!--
[**Multi-node cluster using cloud-config, CoreOS and VMware ESXi**](https://github.com/xavierbaude/VMware-coreos-multi-nodes-Kubernetes)
-->
[**使用云配置、CoreOS 和 VMware ESXi 的多节点集群**](https://github.com/xavierbaude/VMware-coreos-multi-nodes-Kubernetes)

<!--
Configure a single master, single worker cluster on VMware ESXi.
-->
在 VMware ESXi 上配置单个 master、多个 worker 的集群。

<hr/>

<!--
[**Single/Multi-node cluster using cloud-config, CoreOS and Foreman**](https://github.com/johscheuer/theforeman-coreos-kubernetes)
-->
[**使用云配置、CoreOS 和 Foreman 的 单/多节点集群**](https://github.com/johscheuer/theforeman-coreos-kubernetes)

<!--
Configure a standalone Kubernetes or a Kubernetes cluster with [Foreman](https://theforeman.org).
-->
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
IaaS 提供商          | 配置管理     | OS     | 网络        | 文档                                              | 符合     | 支持级别
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
GCE                  | CoreOS       | CoreOS | flannel     | [文档](/docs/getting-started-guides/coreos)                                 |          | 社区 ([@pires](https://github.com/pires))
Vagrant              | CoreOS       | CoreOS | flannel     | [文档](/docs/getting-started-guides/coreos)                                 |          | 社区 ([@pires](https://github.com/pires), [@AntonioMeireles](https://github.com/AntonioMeireles))

<!--
For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
-->
有关所有解决方案的支持级别信息，请查看 [解决方案表](/docs/getting-started-guides/#table-of-solutions)。
