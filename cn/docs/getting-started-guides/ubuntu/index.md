---
title: Kubernetes on Ubuntu
cn-approvers:
- chentao1596
---
<!--
---
title: Ubuntu 上的 Kubernetes
---
-->


{% capture overview %}
<!--
There are multiple ways to run a Kubernetes cluster with Ubuntu. These pages explain how to deploy Kubernetes on Ubuntu on multiple public and private clouds, as well as bare metal.
-->
使用 Ubuntu 运行 Kubernetes 集群有多种方法。本文阐述了如何在多个公有和私有云、以及裸机的 Ubuntu 上部署 Kubernetes。
{% endcapture %}

{% capture body %}
<!--
## Official Ubuntu Guides

- [The Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes)
-->
## Ubuntu 官方指南

- [Kubernetes 官方发布版本](https://www.ubuntu.com/cloud/kubernetes)


<!--
Supports AWS, GCE, Azure, Joyent, OpenStack, VMWare, Bare Metal and localhost deployments.
-->
支持 AWS、GCE、Azure、Joyent、OpenStack、VMWare、Bare Metal 和本地部署。

<!--
### Quick Start
-->
### 快速开始

<!--
[conjure-up](http://conjure-up.io/) provides the quickest way to deploy Kubernetes on Ubuntu for multiple clouds and bare metal. It provides a user-friendly UI that prompts you for cloud credentials and configuration options
-->
[conjure-up](http://conjure-up.io/) 为多种云和裸机提供了在 Ubuntu 上部署 Kubernetes 的最快方式。它提供了一个用户友好的界面，提示您输入云凭证和配置选项。

<!--
Available for Ubuntu 16.04 and newer:
-->
可供 Ubuntu 16.04 及更高版本使用：

<!--
```
sudo snap install conjure-up --classic
# re-login may be required at that point if you just installed snap utility
conjure-up kubernetes
```
-->
```
sudo snap install conjure-up --classic
# 如果您刚刚才安装 Snap，那么可能需要重新登录
conjure-up kubernetes
```

<!--
As well as Homebrew for macOS:
-->
也可以用于 macOS 的 Homebrew：

```
brew install conjure-up
conjure-up kubernetes
```

<!--
### Operational Guides
-->
### 操作指南

<!--
These are more in-depth guides for users choosing to run Kubernetes in production:

  - [Installation](/docs/getting-started-guides/ubuntu/installation)
  - [Validation](/docs/getting-started-guides/ubuntu/validation)
  - [Backups](/docs/getting-started-guides/ubuntu/backups)
  - [Upgrades](/docs/getting-started-guides/ubuntu/upgrades)
  - [Scaling](/docs/getting-started-guides/ubuntu/scaling)
  - [Logging](/docs/getting-started-guides/ubuntu/logging)
  - [Monitoring](/docs/getting-started-guides/ubuntu/monitoring)
  - [Networking](/docs/getting-started-guides/ubuntu/networking)
  - [Security](/docs/getting-started-guides/ubuntu/security)
  - [Storage](/docs/getting-started-guides/ubuntu/storage)
  - [Troubleshooting](/docs/getting-started-guides/ubuntu/troubleshooting)
  - [Decommissioning](/docs/getting-started-guides/ubuntu/decommissioning)
  - [Operational Considerations](/docs/getting-started-guides/ubuntu/operational-considerations)
  - [Glossary](/docs/getting-started-guides/ubuntu/glossary)
-->
以下是为那些在生产中选择运行 Kubernetes 的用户提供的更深入的指南：

  - [安装](/docs/getting-started-guides/ubuntu/installation)
  - [验证](/docs/getting-started-guides/ubuntu/validation)
  - [备份](/docs/getting-started-guides/ubuntu/backups)
  - [升级](/docs/getting-started-guides/ubuntu/upgrades)
  - [伸缩](/docs/getting-started-guides/ubuntu/scaling)
  - [日志](/docs/getting-started-guides/ubuntu/logging)
  - [监控](/docs/getting-started-guides/ubuntu/monitoring)
  - [网络](/docs/getting-started-guides/ubuntu/networking)
  - [安全](/docs/getting-started-guides/ubuntu/security)
  - [存储](/docs/getting-started-guides/ubuntu/storage)
  - [故障排查](/docs/getting-started-guides/ubuntu/troubleshooting)
  - [清理](/docs/getting-started-guides/ubuntu/decommissioning)
  - [操作建议](/docs/getting-started-guides/ubuntu/operational-considerations)
  - [术语](/docs/getting-started-guides/ubuntu/glossary)

<!--
## Developer Guides

  - [Localhost using LXD](/docs/getting-started-guides/ubuntu/local)
-->
## 开发人员指南

  - [本地主机使用 LXD ](/docs/getting-started-guides/ubuntu/local)


<!--
## Where to find us
-->
## 哪里能找到我们

<!--
We're normally following the following Slack channels:
-->
我们通常参与以下 Slack 频道：

- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- [sig-onprem](https://kubernetes.slack.com/messages/sig-onprem/)

<!--
and we monitor the Kubernetes mailing lists.
-->
同时，我们也会关注 Kubernetes 邮件列表。
{% endcapture %}

{% include templates/concept.md %}
