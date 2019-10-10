---
title: Ubuntu 上运行 Kubernetes
content_template: templates/concept
---

<!-- ---
title: Kubernetes on Ubuntu
content_template: templates/concept
--- -->
{{% capture overview %}}
<!-- There are multiple ways to run a Kubernetes cluster with Ubuntu. These pages explain how to deploy Kubernetes on Ubuntu on multiple public and private clouds, as well as bare metal. -->

使用 Ubuntu 运行 Kubernetes 集群有多种方法。 这些页面阐释了如何在多种公共云、私有云和裸机的 Ubuntu 上部署 Kubernetes。
{{% /capture %}}

{{% capture body %}}
<!-- ## Official Ubuntu Guides

- [The Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes)

The latest version of Kubernetes with upstream binaries. Supports AWS, GCE, Azure, Joyent, OpenStack, VMware, Bare Metal and localhost deployments.
 -->
## 官方 Ubuntu 指南

- [Kubernetes 的 Canonical 发行版](https://www.ubuntu.com/cloud/kubernetes)

最新版 Kubernetes 上游二进制文件。 支持 AWS、GCE、Azure、Joyent、OpenStack、VMware、裸机和 localhost 部署。

<!-- ### Quick Start

[conjure-up](http://conjure-up.io/) provides the quickest way to deploy Kubernetes on Ubuntu for multiple clouds and bare metal. It provides a user-friendly UI that prompts you for cloud credentials and configuration options

Available for Ubuntu 16.04 and newer: -->
### 快速入门

[conjure-up](http://conjure-up.io/) 提供了在多种云和裸机的 Ubuntu 上部署 Kubernetes 的最快方法。它提供了用户友好的界面，提示您提供云凭据和配置选项

适用于 Ubuntu 16.04 及更高版本:
<!-- 
```
sudo snap install conjure-up --classic
# re-login may be required at that point if you just installed snap utility
conjure-up kubernetes
```
-->
```
sudo snap install conjure-up --classic
# 如果您刚刚安装了 snap 工具，可能需要重新登录。
conjure-up kubernetes
```

<!-- As well as Homebrew for macOS: -->

以及用于 macOS 的 Homebrew：

```
brew install conjure-up
conjure-up kubernetes
```

<!-- ### Operational Guides

These are more in-depth guides for users choosing to run Kubernetes in production:

  - [Installation](/docs/getting-started-guides/ubuntu/installation/)
  - [Validation](/docs/getting-started-guides/ubuntu/validation/)
  - [Backups](/docs/getting-started-guides/ubuntu/backups/)
  - [Upgrades](/docs/getting-started-guides/ubuntu/upgrades/)
  - [Scaling](/docs/getting-started-guides/ubuntu/scaling/)
  - [Logging](/docs/getting-started-guides/ubuntu/logging/)
  - [Monitoring](/docs/getting-started-guides/ubuntu/monitoring/)
  - [Networking](/docs/getting-started-guides/ubuntu/networking/)
  - [Security](/docs/getting-started-guides/ubuntu/security/)
  - [Storage](/docs/getting-started-guides/ubuntu/storage/)
  - [Troubleshooting](/docs/getting-started-guides/ubuntu/troubleshooting/)
  - [Decommissioning](/docs/getting-started-guides/ubuntu/decommissioning/)
  - [Operational Considerations](/docs/getting-started-guides/ubuntu/operational-considerations/)
  - [Glossary](/docs/getting-started-guides/ubuntu/glossary/) -->

### 操作指南

这些是用户在生产中运行 Kubernetes 的更深入的指南：

  - [安装](/docs/getting-started-guides/ubuntu/installation/)
  - [验证](/docs/getting-started-guides/ubuntu/validation/)
  - [备份](/docs/getting-started-guides/ubuntu/backups/)
  - [升级](/docs/getting-started-guides/ubuntu/upgrades/)
  - [缩放](/docs/getting-started-guides/ubuntu/scaling/)
  - [日志](/docs/getting-started-guides/ubuntu/logging/)
  - [监控](/docs/getting-started-guides/ubuntu/monitoring/)
  - [网络](/docs/getting-started-guides/ubuntu/networking/)
  - [安全](/docs/getting-started-guides/ubuntu/security/)
  - [存储](/docs/getting-started-guides/ubuntu/storage/)
  - [故障排除](/docs/getting-started-guides/ubuntu/troubleshooting/)
  - [退役](/docs/getting-started-guides/ubuntu/decommissioning/)
  - [操作因素](/docs/getting-started-guides/ubuntu/operational-considerations/)
  - [词汇表](/docs/getting-started-guides/ubuntu/glossary/)


<!-- ## Third-party Product Integrations

  - [Rancher](/docs/getting-started-guides/ubuntu/rancher/)

## Developer Guides

  - [Localhost using LXD](/docs/getting-started-guides/ubuntu/local/) -->

## 第三方产品集成

  - [Rancher](/docs/getting-started-guides/ubuntu/rancher/)

## 开发者指南

  - [Localhost 使用 LXD](/docs/getting-started-guides/ubuntu/local/)

<!-- ## Where to find us

We're normally following the following Slack channels:

- [kubernetes-users](https://kubernetes.slack.com/messages/kubernetes-users/)
- [kubernetes-novice](https://kubernetes.slack.com/messages/kubernetes-novice/)
- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- [sig-onprem](https://kubernetes.slack.com/messages/sig-onprem/)

and we monitor the Kubernetes mailing lists. -->

## 如何找到我们

我们通常关注以下 Slack 频道：

- [kubernetes-users](https://kubernetes.slack.com/messages/kubernetes-users/)
- [kubernetes-novice](https://kubernetes.slack.com/messages/kubernetes-novice/)
- [sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
- [sig-cluster-ops](https://kubernetes.slack.com/messages/sig-cluster-ops/)
- [sig-onprem](https://kubernetes.slack.com/messages/sig-onprem/)

而且我们会查看 Kubernetes 邮件列表。
{{% /capture %}}

