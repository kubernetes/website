---
linktitle: 发行版本历史
title: 发行版本
type: docs
layout: release-info
notoc: true
---
<!-- 
linktitle: Release History
title: Releases
type: docs
layout: release-info
notoc: true
-->

<!-- overview -->

<!-- 
The Kubernetes project maintains release branches for the most recent three minor releases
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 and newer receive
[approximately 1 year of patch support](/releases/patch-releases/#support-period).
Kubernetes 1.18 and older received approximately 9 months of patch support.
-->
Kubernetes 项目维护最近三个次要版本（{{< skew latestVersion >}}、{{< skew prevMinorVersion >}}、
{{< skew oldestMinorVersion >}}）的发布分支。
Kubernetes 1.19 和更新版本获得[大约 1 年的补丁支持](/zh-cn/releases/patch-releases/#support-period)。
Kubernetes 1.18 及更早版本获得了大约 9 个月的补丁支持周期。

<!-- 
Kubernetes versions are expressed as **x.y.z**,
where **x** is the major version, **y** is the minor version, and **z** is the patch version,
following [Semantic Versioning](https://semver.org/) terminology.

More information in the [version skew policy](/releases/version-skew-policy/) document.
-->
Kubernetes 版本表示为 **x.y.z**，
其中 **x** 是主要版本，**y** 是次要版本，**z** 是补丁版本，遵循[语义版本控制](https://semver.org/)术语。

更多信息在[版本偏差策略](/zh-cn/releases/version-skew-policy/)文档中。

<!-- body -->

<!--
## Release History
-->
## 发行版本历史   {#release-history}

{{< release-data >}}

<!--
## Upcoming Release
-->
## 未来的发行版本   {#upcoming-release}

<!-- 
Check out the [schedule](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
for the upcoming **{{< skew nextMinorVersion >}}** Kubernetes release!
-->
查看即将发布的 Kubernetes **{{< skew nextMinorVersion >}}**
[时间表](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})！

<!--
## Helpful Resources
-->
## 有用的资源   {#helpful-resources}

<!--
Refer to the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team) resources 
for key information on roles and the release process.
-->
有关角色和发布流程的重要信息，
请参阅 [Kubernetes 发布团队](https://github.com/kubernetes/sig-release/tree/master/release-team) 资源。
