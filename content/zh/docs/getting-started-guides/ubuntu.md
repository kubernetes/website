---
title: 在 Ubuntu 上运行 Kubernetes
content_template: templates/concept
---
<!--
---
title: Kubernetes on Ubuntu
content_template: templates/concept
---
-->

{{% capture overview %}}
<!--
There are multiple ways to run a Kubernetes cluster with Ubuntu on public and private clouds, as well as bare metal.
-->
有多种方法可以在公有云、私有云以及裸金属上运行基于 Ubuntu 的 Kubernetes 集群。
{{% /capture %}}

{{% capture body %}}
<!--
## The Charmed Distribution of Kubernetes(CDK)
-->
## Kubernetes Charmed 发行版（CDK）

<!--
[CDK](https://www.ubuntu.com/cloud/kubernetes) is a distribution of Kubernetes packaged as a bundle of *charms* for Juju, the open source application modeller.
-->
[CDK](https://www.ubuntu.com/cloud/kubernetes) 是 Kubernetes 的一个发行版，作为开源应用程序建模器 Juju 的一组 *charms*。

<!--
CDK is the latest version of Kubernetes with upstream binaries, packaged in a format which makes it fast and easy to deploy. It supports various public and private clouds including AWS, GCE, Azure, Joyent, OpenStack, VMware, Bare Metaland localhost deployments.
-->
CDK 是附带了上游二进制文件的 Kubernetes 最新发行版，采用了一种支持快速简单部署的打包格式。它支持各种公有云和私有云，包括 AWS，GCE，Azure，Joyent，OpenStack，VMware 以及 Bare Metaland 本地部署。

<!--
See the [Official documentation](https://www.ubuntu.com/kubernetes/docs) for more information.
-->
请参阅[官方文档](https://www.ubuntu.com/kubernetes/docs)获取详细信息。

<!--
## MicroK8s
-->
## MicroK8s

<!--
[MicroK8s](https://microk8s.io) is a minimal install of Kubernetes designed to run locally.
-->
[MicroK8s](https://microk8s.io) 是 Kubernetes 的最小安装，旨在在本地运行。
<!--
It can be installed on Ubuntu (or any snap enabled operating system) with the command:
-->
它可以使用以下命令安装在 Ubuntu（或任何支持 snap 的操作系统）上：

```shell
snap install microk8s --classic
```

<!--
Full documentation is available on the [MicroK8s website](https://microk8s.io/docs)
-->
[MicroK8s 网站](https://microk8s.io/docs)上提供了完整的文档。

{{% /capture %}}
