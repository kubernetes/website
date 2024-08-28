---
layout: blog
title: 'Kubernetes v1.31：kubeadm v1beta4'
date: 2024-08-23
slug: kubernetes-1-31-kubeadm-v1beta4
author: >
  Paco Xu (DaoCloud)
translator: >
  [windsonsea](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.31: kubeadm v1beta4'
date: 2024-08-23
slug: kubernetes-1-31-kubeadm-v1beta4
author: >
   Paco Xu (DaoCloud)
-->

<!--
As part of the Kubernetes v1.31 release, [`kubeadm`](/docs/reference/setup-tools/kubeadm/) is
adopting a new ([v1beta4](/docs/reference/config-api/kubeadm-config.v1beta4/)) version of
its configuration file format. Configuration in the previous v1beta3 format is now formally
deprecated, which means it's supported but you should migrate to v1beta4 and stop using
the deprecated format.
Support for v1beta3 configuration will be removed after a minimum of 3 Kubernetes minor releases.
-->
作为 Kubernetes v1.31 发布的一部分，[`kubeadm`](/zh-cn/docs/reference/setup-tools/kubeadm/)
采用了全新版本（[v1beta4](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)）的配置文件格式。
之前 v1beta3 格式的配置现已正式弃用，这意味着尽管之前的格式仍然受支持，但你应迁移到 v1beta4 并停止使用已弃用的格式。
对 v1beta3 配置的支持将在至少 3 次 Kubernetes 次要版本发布后被移除。

<!--
In this article, I'll walk you through key changes;
I'll explain about the kubeadm v1beta4 configuration format,
and how to migrate from v1beta3 to v1beta4.

You can read the reference for the v1beta4 configuration format:
[kubeadm Configuration (v1beta4)]((/docs/reference/config-api/kubeadm-config.v1beta4/)).
-->
在本文中，我将介绍关键的变更；我将解释 kubeadm v1beta4 配置格式，以及如何从 v1beta3 迁移到 v1beta4。

你可以参阅 v1beta4 配置格式的参考文档：
[kubeadm 配置 (v1beta4)](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
### A list of changes since v1beta3

This version improves on the [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
format by fixing some minor issues and adding a few new fields.

To put it simply,
-->
### 自 v1beta3 以来的变更列表

此版本通过修复一些小问题并添加一些新字段来改进
[v1beta3](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/) 格式。

简单而言，

<!--
- Two new configuration elements: ResetConfiguration and UpgradeConfiguration
- For InitConfiguration and JoinConfiguration, `dryRun` mode and `nodeRegistration.imagePullSerial` are supported
- For ClusterConfiguration, there are new fields including `certificateValidityPeriod`,
`caCertificateValidityPeriod`, `encryptionAlgorithm`, `dns.disabled` and `proxy.disabled`.
- Support `extraEnvs` for all control plan components
- `extraArgs` changed from a map to structured extra arguments for duplicates
- Add a `timeouts` structure for init, join, upgrade and reset.
-->
- 增加了两个新的配置元素：ResetConfiguration 和 UpgradeConfiguration
- 对于 InitConfiguration 和 JoinConfiguration，支持 `dryRun` 模式和 `nodeRegistration.imagePullSerial`
- 对于 ClusterConfiguration，新增字段包括 `certificateValidityPeriod`、`caCertificateValidityPeriod`、
  `encryptionAlgorithm`、`dns.disabled` 和 `proxy.disabled`
- 所有控制平面组件支持 `extraEnvs`
- `extraArgs` 从映射变更为支持重复的结构化额外参数
- 为 init、join、upgrade 和 reset 添加了 `timeouts` 结构

<!--
For details, you can see the [official document](/docs/reference/config-api/kubeadm-config.v1beta4/) below:

- Support custom environment variables in control plane components under `ClusterConfiguration`.
Use `apiServer.extraEnvs`, `controllerManager.extraEnvs`, `scheduler.extraEnvs`, `etcd.local.extraEnvs`.
- The ResetConfiguration API type is now supported in v1beta4. Users are able to reset a node by passing
a `--config` file to `kubeadm reset`.
- `dryRun` mode is now configurable in InitConfiguration and JoinConfiguration.
-->
有关细节请参阅以下[官方文档](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)：

- 在 `ClusterConfiguration` 下支持控制平面组件的自定义环境变量。
  可以使用 `apiServer.extraEnvs`、`controllerManager.extraEnvs`、`scheduler.extraEnvs`、`etcd.local.extraEnvs`。
- ResetConfiguration API 类型现在在 v1beta4 中得到支持。用户可以通过将 `--config` 文件传递给 `kubeadm reset` 来重置节点。
- `dryRun` 模式现在在 InitConfiguration 和 JoinConfiguration 中可配置。
<!--
- Replace the existing string/string extra argument maps with structured extra arguments that support duplicates.
 The change applies to `ClusterConfiguration` - `apiServer.extraArgs`, `controllerManager.extraArgs`,
 `scheduler.extraArgs`, `etcd.local.extraArgs`. Also to `nodeRegistrationOptions.kubeletExtraArgs`.
- Added `ClusterConfiguration.encryptionAlgorithm` that can be used to set the asymmetric encryption
 algorithm used for this cluster's keys and certificates. Can be one of "RSA-2048" (default), "RSA-3072",
  "RSA-4096" or "ECDSA-P256".
- Added `ClusterConfiguration.dns.disabled` and `ClusterConfiguration.proxy.disabled` that can be used
  to disable the CoreDNS and kube-proxy addons during cluster initialization.
  Skipping the related addons phases, during cluster creation will set the same fields to `true`.
-->
- 用支持重复的结构化额外参数替换现有的 string/string 额外参数映射。
  此变更适用于 `ClusterConfiguration` - `apiServer.extraArgs`、`controllerManager.extraArgs`、
  `scheduler.extraArgs`、`etcd.local.extraArgs`。也适用于 `nodeRegistrationOptions.kubeletExtraArgs`。
- 添加了 `ClusterConfiguration.encryptionAlgorithm`，可用于设置此集群的密钥和证书所使用的非对称加密算法。
  可以是 "RSA-2048"（默认）、"RSA-3072"、"RSA-4096" 或 "ECDSA-P256" 之一。
- 添加了 `ClusterConfiguration.dns.disabled` 和 `ClusterConfiguration.proxy.disabled`，
  可用于在集群初始化期间禁用 CoreDNS 和 kube-proxy 插件。
  在集群创建期间跳过相关插件阶段将把相同的字段设置为 `true`。
<!--
- Added the `nodeRegistration.imagePullSerial` field in `InitConfiguration` and `JoinConfiguration`,
  which can be used to control if kubeadm pulls images serially or in parallel.
- The UpgradeConfiguration kubeadm API is now supported in v1beta4 when passing `--config` to
  `kubeadm upgrade` subcommands.
  For upgrade subcommands, the usage of component configuration for kubelet and kube-proxy, as well as
  InitConfiguration and ClusterConfiguration, is now deprecated and will be ignored when passing `--config`.
- Added a `timeouts` structure to `InitConfiguration`, `JoinConfiguration`, `ResetConfiguration` and
  `UpgradeConfiguration` that can be used to configure various timeouts.
  The `ClusterConfiguration.timeoutForControlPlane` field is replaced by `timeouts.controlPlaneComponentHealthCheck`.
  The `JoinConfiguration.discovery.timeout` is replaced by `timeouts.discovery`.
-->
- 在 `InitConfiguration` 和 `JoinConfiguration` 中添加了 `nodeRegistration.imagePullSerial` 字段，
  可用于控制 kubeadm 是顺序拉取镜像还是并行拉取镜像。
- 当将 `--config` 传递给 `kubeadm upgrade` 子命令时，现已在 v1beta4 中支持 UpgradeConfiguration kubeadm API。
  对于升级子命令，kubelet 和 kube-proxy 的组件配置以及 InitConfiguration 和 ClusterConfiguration 的用法现已弃用，
  并将在传递 `--config` 时被忽略。
- 在 `InitConfiguration`、`JoinConfiguration`、`ResetConfiguration` 和 `UpgradeConfiguration`
  中添加了 `timeouts` 结构，可用于配置各种超时。
  `ClusterConfiguration.timeoutForControlPlane` 字段被 `timeouts.controlPlaneComponentHealthCheck` 替换。
  `JoinConfiguration.discovery.timeout` 被 `timeouts.discovery` 替换。
<!--
- Added a `certificateValidityPeriod` and `caCertificateValidityPeriod` fields to `ClusterConfiguration`.
  These fields can be used to control the validity period of certificates generated by kubeadm during
  sub-commands such as `init`, `join`, `upgrade` and `certs`.
  Default values continue to be 1 year for non-CA certificates and 10 years for CA certificates.
  Also note that only non-CA certificates are renewable by `kubeadm certs renew`.

These changes simplify the configuration of tools that use kubeadm
and improve the extensibility of kubeadm itself.
-->
- 向 `ClusterConfiguration` 添加了 `certificateValidityPeriod` 和 `caCertificateValidityPeriod` 字段。
  这些字段可用于控制 kubeadm 在 `init`、`join`、`upgrade` 和 `certs` 等子命令中生成的证书的有效期。
  默认值继续为非 CA 证书 1 年和 CA 证书 10 年。另请注意，只有非 CA 证书可以通过 `kubeadm certs renew` 进行续期。

这些变更简化了使用 kubeadm 的工具的配置，并提高了 kubeadm 本身的可扩展性。

<!--
### How to migrate v1beta3 configuration to v1beta4?

If your configuration is not using the latest version, it is recommended that you migrate using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-migrate) command.

This command reads an existing configuration file that uses the old format, and writes a new
file that uses the current format.
-->
### 如何将 v1beta3 配置迁移到 v1beta4？

如果你的配置未使用最新版本，建议你使用
[kubeadm config migrate](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-migrate)
命令进行迁移。

此命令读取使用旧格式的现有配置文件，并写入一个使用当前格式的新文件。

<!--
#### Example {#example-kubeadm-config-migrate}

Using kubeadm v1.31, run `kubeadm config migrate --old-config old-v1beta3.yaml --new-config new-v1beta4.yaml`

## How do I get involved?

Huge thanks to all the contributors who helped with the design, implementation,
and review of this feature:
-->
#### 示例 {#example-kubeadm-config-migrate}

使用 kubeadm v1.31，运行 `kubeadm config migrate --old-config old-v1beta3.yaml --new-config new-v1beta4.yaml`

## 我该如何参与？

衷心感谢在此特性的设计、实现和评审中提供帮助的所有贡献者：

<!--
- Lubomir I. Ivanov ([neolit123](https://github.com/neolit123))
- Dave Chen([chendave](https://github.com/chendave))
- Paco Xu ([pacoxu](https://github.com/pacoxu))
- Sata Qiu([sataqiu](https://github.com/sataqiu))
- Baofa Fan([carlory](https://github.com/carlory))
- Calvin Chen([calvin0327](https://github.com/calvin0327))
- Ruquan Zhao([ruquanzhao](https://github.com/ruquanzhao))
-->
- Lubomir I. Ivanov ([neolit123](https://github.com/neolit123))
- Dave Chen ([chendave](https://github.com/chendave))
- Paco Xu ([pacoxu](https://github.com/pacoxu))
- Sata Qiu ([sataqiu](https://github.com/sataqiu))
- Baofa Fan ([carlory](https://github.com/carlory))
- Calvin Chen ([calvin0327](https://github.com/calvin0327))
- Ruquan Zhao ([ruquanzhao](https://github.com/ruquanzhao))

<!--
For those interested in getting involved in future discussions on kubeadm configuration,
you can reach out kubeadm or [SIG-cluster-lifecycle](https://github.com/kubernetes/community/blob/master/sig-cluster-lifecycle/README.md) by several means:

- v1beta4 related items are tracked in [kubeadm issue #2890](https://github.com/kubernetes/kubeadm/issues/2890).
- Slack: [#kubeadm](https://kubernetes.slack.com/messages/kubeadm) or [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
-->
如果你有兴趣参与 kubeadm 配置的后续讨论，可以通过多种方式与 kubeadm 或
[SIG-cluster-lifecycle](https://github.com/kubernetes/community/blob/master/sig-cluster-lifecycle/README.md) 联系：

- v1beta4 相关事项在 [kubeadm issue #2890](https://github.com/kubernetes/kubeadm/issues/2890) 中跟踪。
- Slack: [#kubeadm](https://kubernetes.slack.com/messages/kubeadm) 或
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
