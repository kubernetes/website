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
作爲 Kubernetes v1.31 發佈的一部分，[`kubeadm`](/zh-cn/docs/reference/setup-tools/kubeadm/)
採用了全新版本（[v1beta4](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)）的設定文件格式。
之前 v1beta3 格式的設定現已正式棄用，這意味着儘管之前的格式仍然受支持，但你應遷移到 v1beta4 並停止使用已棄用的格式。
對 v1beta3 設定的支持將在至少 3 次 Kubernetes 次要版本發佈後被移除。

<!--
In this article, I'll walk you through key changes;
I'll explain about the kubeadm v1beta4 configuration format,
and how to migrate from v1beta3 to v1beta4.

You can read the reference for the v1beta4 configuration format:
[kubeadm Configuration (v1beta4)](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
在本文中，我將介紹關鍵的變更；我將解釋 kubeadm v1beta4 設定格式，以及如何從 v1beta3 遷移到 v1beta4。

你可以參閱 v1beta4 設定格式的參考文檔：
[kubeadm 設定 (v1beta4)](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)。

<!--
### A list of changes since v1beta3

This version improves on the [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)
format by fixing some minor issues and adding a few new fields.

To put it simply,
-->
### 自 v1beta3 以來的變更列表

此版本通過修復一些小問題並添加一些新字段來改進
[v1beta3](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/) 格式。

簡單而言，

<!--
- Two new configuration elements: ResetConfiguration and UpgradeConfiguration
- For InitConfiguration and JoinConfiguration, `dryRun` mode and `nodeRegistration.imagePullSerial` are supported
- For ClusterConfiguration, there are new fields including `certificateValidityPeriod`,
`caCertificateValidityPeriod`, `encryptionAlgorithm`, `dns.disabled` and `proxy.disabled`.
- Support `extraEnvs` for all control plan components
- `extraArgs` changed from a map to structured extra arguments for duplicates
- Add a `timeouts` structure for init, join, upgrade and reset.
-->
- 增加了兩個新的設定元素：ResetConfiguration 和 UpgradeConfiguration
- 對於 InitConfiguration 和 JoinConfiguration，支持 `dryRun` 模式和 `nodeRegistration.imagePullSerial`
- 對於 ClusterConfiguration，新增字段包括 `certificateValidityPeriod`、`caCertificateValidityPeriod`、
  `encryptionAlgorithm`、`dns.disabled` 和 `proxy.disabled`
- 所有控制平面組件支持 `extraEnvs`
- `extraArgs` 從映射變更爲支持重複的結構化額外參數
- 爲 init、join、upgrade 和 reset 添加了 `timeouts` 結構

<!--
For details, you can see the [official document](/docs/reference/config-api/kubeadm-config.v1beta4/) below:

- Support custom environment variables in control plane components under `ClusterConfiguration`.
Use `apiServer.extraEnvs`, `controllerManager.extraEnvs`, `scheduler.extraEnvs`, `etcd.local.extraEnvs`.
- The ResetConfiguration API type is now supported in v1beta4. Users are able to reset a node by passing
a `--config` file to `kubeadm reset`.
- `dryRun` mode is now configurable in InitConfiguration and JoinConfiguration.
-->
有關細節請參閱以下[官方文檔](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)：

- 在 `ClusterConfiguration` 下支持控制平面組件的自定義環境變量。
  可以使用 `apiServer.extraEnvs`、`controllerManager.extraEnvs`、`scheduler.extraEnvs`、`etcd.local.extraEnvs`。
- ResetConfiguration API 類型現在在 v1beta4 中得到支持。使用者可以通過將 `--config` 文件傳遞給 `kubeadm reset` 來重置節點。
- `dryRun` 模式現在在 InitConfiguration 和 JoinConfiguration 中可設定。
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
- 用支持重複的結構化額外參數替換現有的 string/string 額外參數映射。
  此變更適用於 `ClusterConfiguration` - `apiServer.extraArgs`、`controllerManager.extraArgs`、
  `scheduler.extraArgs`、`etcd.local.extraArgs`。也適用於 `nodeRegistrationOptions.kubeletExtraArgs`。
- 添加了 `ClusterConfiguration.encryptionAlgorithm`，可用於設置此叢集的密鑰和證書所使用的非對稱加密算法。
  可以是 "RSA-2048"（默認）、"RSA-3072"、"RSA-4096" 或 "ECDSA-P256" 之一。
- 添加了 `ClusterConfiguration.dns.disabled` 和 `ClusterConfiguration.proxy.disabled`，
  可用於在叢集初始化期間禁用 CoreDNS 和 kube-proxy 插件。
  在叢集創建期間跳過相關插件階段將把相同的字段設置爲 `true`。
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
  可用於控制 kubeadm 是順序拉取映像檔還是並行拉取映像檔。
- 當將 `--config` 傳遞給 `kubeadm upgrade` 子命令時，現已在 v1beta4 中支持 UpgradeConfiguration kubeadm API。
  對於升級子命令，kubelet 和 kube-proxy 的組件設定以及 InitConfiguration 和 ClusterConfiguration 的用法現已棄用，
  並將在傳遞 `--config` 時被忽略。
- 在 `InitConfiguration`、`JoinConfiguration`、`ResetConfiguration` 和 `UpgradeConfiguration`
  中添加了 `timeouts` 結構，可用於設定各種超時。
  `ClusterConfiguration.timeoutForControlPlane` 字段被 `timeouts.controlPlaneComponentHealthCheck` 替換。
  `JoinConfiguration.discovery.timeout` 被 `timeouts.discovery` 替換。
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
  這些字段可用於控制 kubeadm 在 `init`、`join`、`upgrade` 和 `certs` 等子命令中生成的證書的有效期。
  默認值繼續爲非 CA 證書 1 年和 CA 證書 10 年。另請注意，只有非 CA 證書可以通過 `kubeadm certs renew` 進行續期。

這些變更簡化了使用 kubeadm 的工具的設定，並提高了 kubeadm 本身的可擴展性。

<!--
### How to migrate v1beta3 configuration to v1beta4?

If your configuration is not using the latest version, it is recommended that you migrate using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-migrate) command.

This command reads an existing configuration file that uses the old format, and writes a new
file that uses the current format.
-->
### 如何將 v1beta3 設定遷移到 v1beta4？

如果你的設定未使用最新版本，建議你使用
[kubeadm config migrate](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-migrate)
命令進行遷移。

此命令讀取使用舊格式的現有設定文件，並寫入一個使用當前格式的新文件。

<!--
#### Example {#example-kubeadm-config-migrate}

Using kubeadm v1.31, run `kubeadm config migrate --old-config old-v1beta3.yaml --new-config new-v1beta4.yaml`

## How do I get involved?

Huge thanks to all the contributors who helped with the design, implementation,
and review of this feature:
-->
#### 示例 {#example-kubeadm-config-migrate}

使用 kubeadm v1.31，運行 `kubeadm config migrate --old-config old-v1beta3.yaml --new-config new-v1beta4.yaml`

## 我該如何參與？

衷心感謝在此特性的設計、實現和評審中提供幫助的所有貢獻者：

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
如果你有興趣參與 kubeadm 設定的後續討論，可以通過多種方式與 kubeadm 或
[SIG-cluster-lifecycle](https://github.com/kubernetes/community/blob/master/sig-cluster-lifecycle/README.md) 聯繫：

- v1beta4 相關事項在 [kubeadm issue #2890](https://github.com/kubernetes/kubeadm/issues/2890) 中跟蹤。
- Slack: [#kubeadm](https://kubernetes.slack.com/messages/kubeadm) 或
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle)
- [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
