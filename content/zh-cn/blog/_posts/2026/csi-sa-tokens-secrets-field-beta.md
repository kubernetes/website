---
layout: blog
title: "Kubernetes v1.35：向 CSI 驱动程序传递服务账号令牌的最佳方式"
date: 2026-01-07T10:30:00-08:00
slug: kubernetes-v1-35-csi-sa-tokens-secrets-field-beta
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.35: A Better Way to Pass Service Account Tokens to CSI Drivers"
date: 2026-01-07T10:30:00-08:00
slug: kubernetes-v1-35-csi-sa-tokens-secrets-field-beta
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft)
-->

<!--
If you maintain a CSI driver that uses service account tokens,
Kubernetes v1.35 brings a refinement you'll want to know about.
Since the introduction of the [TokenRequests feature](https://kubernetes-csi.github.io/docs/token-requests.html),
service account tokens requested by CSI drivers have been passed to them through the `volume_context` field.
While this has worked, it's not the ideal place for sensitive information,
and we've seen instances where tokens were accidentally logged in CSI drivers.
-->
如果你维护使用服务账号令牌的 CSI 驱动程序，
Kubernetes v1.35 带来了一项你希望了解的改进。
自从引入 [TokenRequests 特性](https://kubernetes-csi.github.io/docs/token-requests.html)以来，
CSI 驱动程序请求的服务账号令牌一直通过 `volume_context` 字段传递给他们。
虽然这可以工作，但它不是存储敏感信息的理想位置，
我们已经看到过在 CSI 驱动程序中意外记录令牌的情况。

<!--
Kubernetes v1.35 introduces a beta solution to address this:
*CSI Driver Opt-in for Service Account Tokens via Secrets Field*.
This allows CSI drivers to receive service account tokens
through the `secrets` field in `NodePublishVolumeRequest`,
which is the appropriate place for sensitive data in the CSI specification.
-->
Kubernetes v1.35 引入了一个 Beta 解决方案来解决这个问题：
**通过 Secret 字段实现服务账号令牌的 CSI 驱动程序选择加入**。
这允许 CSI 驱动程序通过 `NodePublishVolumeRequest` 中的 `secrets` 字段接收服务账号令牌，
这是 CSI 规范中存储敏感数据的适当位置。

<!--
## Understanding the existing approach
-->
## 理解现有方法

<!--
When CSI drivers use the [TokenRequests feature](https://kubernetes-csi.github.io/docs/token-requests.html),
they can request service account tokens for workload identity
by configuring the `TokenRequests` field in the CSIDriver spec.
These tokens are passed to drivers as part of the volume attributes map,
using the key `csi.storage.k8s.io/serviceAccount.tokens`.
-->
当 CSI 驱动程序使用 [TokenRequests 特性](https://kubernetes-csi.github.io/docs/token-requests.html)时，
它们可以通过在 CSIDriver spec 中配置 `TokenRequests` 字段来请求工作负载身份的服务账号令牌。
这些令牌作为卷属性映射的一部分传递给驱动程序，
使用密钥 `csi.storage.k8s.io/serviceAccount.tokens`。

<!--
The `volume_context` field works, but it's not designed for sensitive data.
Because of this, there are a few challenges:
-->
`volume_context` 字段可以工作，但它不是为敏感数据设计的。
正因为如此，存在一些挑战：

<!--
First, the [`protosanitizer`](https://github.com/kubernetes-csi/csi-lib-utils/tree/master/protosanitizer) tool that CSI drivers use doesn't treat volume context as sensitive,
so service account tokens can end up in logs when gRPC requests are logged.
This happened with [CVE-2023-2878](https://github.com/kubernetes-sigs/secrets-store-csi-driver/security/advisories/GHSA-g82w-58jf-gcxx) in the Secrets Store CSI Driver
and [CVE-2024-3744](https://github.com/kubernetes/kubernetes/issues/124759) in the Azure File CSI Driver.
-->
首先，CSI 驱动程序使用的
[`protosanitizer`](https://github.com/kubernetes-csi/csi-lib-utils/tree/master/protosanitizer)
工具不会将卷上下文视为敏感数据，
因此服务账号令牌可能会在记录 gRPC 请求时出现在日志中。
这在 Secret Store CSI 驱动程序的
[CVE-2023-2878](https://github.com/kubernetes-sigs/secrets-store-csi-driver/security/advisories/GHSA-g82w-58jf-gcxx)
和 Azure File CSI 驱动程序的
[CCVE-2024-3744](https://github.com/kubernetes/kubernetes/issues/124759) 中都发生过。

<!--
Second, each CSI driver that wants to avoid this issue needs to implement its own sanitization logic,
which leads to inconsistency across drivers.
-->
其次，每个想避免此问题的 CSI 驱动程序都需要实现自己的清理逻辑，
这导致了驱动程序之间的不一致。

<!--
The CSI specification already has a `secrets` field in `NodePublishVolumeRequest`
that's designed exactly for this kind of sensitive information.
The challenge is that we can't just change where we put the tokens
without breaking existing CSI drivers that expect them in volume context.
-->
CSI 规范在 `NodePublishVolumeRequest` 中已经有一个 `secrets` 字段，
这正是为这类敏感信息设计的。
挑战在于，我们不能仅仅改变令牌放置的位置，
而不破坏期望在卷上下文中获取令牌的现有 CSI 驱动程序。

<!--
## How the opt-in mechanism works
-->
## 选择加入机制如何工作

<!--
Kubernetes v1.35 introduces an opt-in mechanism that lets CSI drivers choose
how they receive service account tokens.
This way, existing drivers continue working as they do today,
and drivers can move to the more appropriate secrets field when they're ready.
-->
Kubernetes v1.35 引入了一个选择加入机制，让 CSI 驱动程序选择如何接收服务账号令牌。
这样，现有的驱动程序继续按当前方式工作，而驱动程序可以在准备好时迁移到更合适的 Secret 字段。

<!--
CSI drivers can set a new field in their CSIDriver spec:
-->
CSI 驱动程序可以在其 CSIDriver `spec` 中设置一个新字段：

<!--
```yaml
#
# CAUTION: this is an example configuration.
#          Do not use this for your own cluster!
#
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example-csi-driver
spec:
  # ... existing fields ...
  tokenRequests:
  - audience: "example.com"
    expirationSeconds: 3600
  # New field for opting into secrets delivery
  serviceAccountTokenInSecrets: true  # defaults to false
```
-->
```yaml
#
# 注意：这只是一个配置示例。
#      请勿将此配置用于你自己的集群！
#
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example-csi-driver
spec:
  # ... 现有字段...
  tokenRequests:
  - audience: "example.com"
    expirationSeconds: 3600
  # 新增 Secret 传递选项
  serviceAccountTokenInSecrets: true  # 默认为 false
```


<!--
The behavior depends on the `serviceAccountTokenInSecrets` field:
-->
行为取决于 `serviceAccountTokenInSecrets` 字段：

<!--
When set to `false` (the default), tokens are placed in `VolumeContext` with the key `csi.storage.k8s.io/serviceAccount.tokens`, just like today.
When set to `true`, tokens are placed only in the `Secrets` field with the same key.
-->
当设置为 `false`（默认）时，令牌会被放置在 `VolumeContext` 中，
密钥为 `csi.storage.k8s.io/serviceAccount.tokens`，与今天相同。
当设置为 `true` 时，令牌仅被放置在 `Secrets` 字段中，使用相同的密钥。

<!--
## About the beta release
-->
## 关于 Beta 发布

<!--
The `CSIServiceAccountTokenSecrets` feature gate is enabled by default
on both kubelet and kube-apiserver.
Since the `serviceAccountTokenInSecrets` field defaults to `false`,
enabling the feature gate doesn't change any existing behavior.
All drivers continue receiving tokens via volume context unless they explicitly opt in.
This is why we felt comfortable starting at beta rather than alpha.
-->
`CSIServiceAccountTokenSecrets` 特性门控在 kubelet 和 kube-apiserver 上默认启用。
由于 `serviceAccountTokenInSecrets` 字段默认为 `false`，
启用特性门控不会改变任何现有行为。
所有驱动程序继续通过卷上下文接收令牌，除非它们明确选择加入。
这就是为什么我们觉得从 Beta 开始而不是 Alpha 会更安心。

<!--
## Guide for CSI driver authors
-->
## CSI 驱动程序作者指南

<!--
If you maintain a CSI driver that uses service account tokens, here's how to adopt this feature.
-->
如果你维护使用服务账号令牌的 CSI 驱动程序，以下是采用此特性的方法。

<!--
### Adding fallback logic
-->
### 添加回退逻辑

<!--
First, update your driver code to check both locations for tokens.
This makes your driver compatible with both the old and new approaches:
-->
首先，更新驱动程序代码以检查两个位置的令牌。
这使你的驱动程序与新旧方法都兼容：

```go
const serviceAccountTokenKey = "csi.storage.k8s.io/serviceAccount.tokens"

func getServiceAccountTokens(req *csi.NodePublishVolumeRequest) (string, error) {
    // Check secrets field first (new behavior when driver opts in)
    if tokens, ok := req.Secrets[serviceAccountTokenKey]; ok {
        return tokens, nil
    }

    // Fall back to volume context (existing behavior)
    if tokens, ok := req.VolumeContext[serviceAccountTokenKey]; ok {
        return tokens, nil
    }

    return "", fmt.Errorf("service account tokens not found")
}
```

<!--
This fallback logic is backward compatible and safe to ship in any driver version,
even before clusters upgrade to v1.35.
-->
此回退逻辑向后兼容，可以安全地包含在任何驱动程序版本中，
即使在集群升级到 v1.35 之前也是如此。

<!--
### Rollout sequence
-->
### 推出顺序

<!--
CSI driver authors need to follow a specific sequence when adopting this feature to avoid breaking existing volumes.
-->
CSI 驱动程序作者在采用此特性时需要遵循特定顺序，以避免破坏现有卷。

<!--
**Driver preparation** (can happen anytime)
-->
**驱动程序准备**（可以随时进行）

<!--
You can start preparing your driver right away by adding fallback logic that checks both the secrets field and volume context for tokens.
This code change is backward compatible and safe to ship in any driver version, even before clusters upgrade to v1.35.
We encourage you to add this fallback logic early, cut releases, and even backport to maintenance branches where feasible.
-->
你可以立即通过添加检查 Secret 字段和卷上下文中令牌的回退逻辑来准备驱动程序。
此代码更改向后兼容，可以安全地包含在任何驱动程序版本中，即使在集群升级到 v1.35 之前也是如此。
我们鼓励你尽早添加此回退逻辑、发布版本，并在可行的情况下甚至 backport 到维护分支。

<!--
**Cluster upgrade and feature enablement**
-->
**集群升级和特性启用**

<!--
Once your driver has the fallback logic deployed, here's the safe rollout order for enabling the feature in a cluster:
-->
一旦你的驱动程序部署了回退逻辑，以下是在集群中启用该特性的安全推出顺序：

<!--
1. Complete the kube-apiserver upgrade to 1.35 or later
1. Complete kubelet upgrade to 1.35 or later on all nodes
1. Ensure CSI driver version with fallback logic is deployed (if not already done in preparation phase)
1. Fully complete CSI driver DaemonSet rollout across all nodes
1. Update your CSIDriver manifest to set `serviceAccountTokenInSecrets: true`
-->
1. 完成 kube-apiserver 升级到 1.35 或更高版本
1. 完成所有节点上 kubelet 升级到 1.35 或更高版本
1. 确保部署了具有回退逻辑的 CSI 驱动程序版本（如果尚未在准备阶段完成）
1. 在所有节点上完全完成 CSI 驱动程序 DaemonSet 推出
1. 更新你的 CSIDriver 清单以设置 `serviceAccountTokenInSecrets: true`

<!--
### Important constraints
-->
### 重要约束

<!--
The most important thing to remember is timing.
If your CSI driver DaemonSet and CSIDriver object are in the same manifest or Helm chart,
you need two separate updates.
Deploy the new driver version with fallback logic first,
wait for the DaemonSet rollout to complete,
then update the CSIDriver spec to set `serviceAccountTokenInSecrets: true`.
-->
最重要需要记住的是时机。
如果你的 CSI 驱动程序 DaemonSet 和 CSIDriver 对象在同一个清单或 Helm Chart 中，
你需要两次单独的更新。
首先部署带有回退逻辑的新驱动程序版本，等待 DaemonSet 推出完成，
然后更新 CSIDriver 以设置 `serviceAccountTokenInSecrets: true`。

<!--
Also, don't update the CSIDriver before all driver pods have rolled out.
If you do, volume mounts will fail on nodes still running the old driver version,
since those pods only check volume context.
-->
此外，在所有驱动程序 Pod 推出完成之前不要更新 CSIDriver。
如果你这样做了，在仍在运行旧驱动程序版本的节点上，卷挂载将失败，
因为那些 Pod 只检查卷上下文。

<!--
## Why this matters
-->
## 为什么这很重要

<!--
Adopting this feature helps in a few ways:
-->
采用此特性有助于以下几方面：

<!--
- It eliminates the risk of accidentally logging service account tokens as part of volume context in gRPC requests
- It uses the CSI specification's designated field for sensitive data, which feels right
- The `protosanitizer` tool automatically handles the secrets field correctly, so you don't need driver-specific workarounds
- It's opt-in, so you can migrate at your own pace without breaking existing deployments
-->
- 消除了在 gRPC 请求中作为卷上下文的一部分意外记录服务账号令牌的风险
- 使用 CSI 规范指定用于敏感数据的字段，这是正确的
- `protosanitizer` 工具自动正确处理 Secret 字段，因此你不需要特定于驱动程序的变通方法
- 这是选择加入的，因此你可以按自己的节奏迁移，而不会破坏现有部署

<!--
## Call to action
-->
## 号召行动

<!--
We (Kubernetes SIG Storage) encourage CSI driver authors to adopt this feature and provide feedback
on the migration experience.
If you have thoughts on the API design or run into any issues during adoption,
please reach out to us on the
[#csi](https://kubernetes.slack.com/archives/C8EJ01Z46) channel on Kubernetes Slack
(for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
-->
我们（Kubernetes SIG Storage）鼓励 CSI 驱动程序作者采用此特性并提供关于迁移体验的反馈。
如果你对 API 设计有想法或在采用过程中遇到任何问题，
请在 Kubernetes Slack 的 [#csi](https://kubernetes.slack.com/archives/C8EJ01Z46) 频道联系我们
（获取邀请，请访问 [https://slack.k8s.io/](https://slack.k8s.io/)）。

<!--
You can follow along on
[KEP-5538](https://kep.k8s.io/5538)
to track progress across the coming Kubernetes releases.
-->
你可以在 [KEP-5538](https://kep.k8s.io/5538) 上跟踪后续 Kubernetes 版本的进度。
