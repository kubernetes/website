---
title: Kubernetes 控制平面組件的兼容版本
content_type: concept
weight: 70
---
<!--
title: Compatibility Version For Kubernetes Control Plane Components
reviewers:
- jpbetz
- siyuanfoundation
content_type: concept
weight: 70
-->

<!-- overview -->

<!--
Since release v1.32, we introduced configurable version compatibility and
emulation options to Kubernetes control plane components to make upgrades
safer by providing more control and increasing the granularity of steps
available to cluster administrators.
-->
自 v1.32 版本發佈以來，我們爲 Kubernetes 控制平面組件引入了可設定的版本兼容性和仿真選項，
爲叢集管理員提供更多控制選項並增加可用的細粒度步驟來讓升級更加安全。

<!-- body -->

<!--
## Emulated Version

The emulation option is set by the `--emulated-version` flag of control plane components.
It allows the component to emulate the behavior (APIs, features, ...) of an earlier version
of Kubernetes.
-->
## 仿真版本   {#emulated-version}

仿真選項通過控制平面組件的 `--emulated-version` 參數來設置。
此選項允許控制平面組件仿真 Kubernetes 早期版本的行爲（API、特性等）。

<!--
When used, the capabilities available will match the emulated version: 

* Any capabilities present in the binary version that were introduced
  after the emulation version will be unavailable. 
* Any capabilities removed after the emulation version will be available.
-->
使用時，可用的功能將與仿真版本相匹配：

* 在仿真版本之後引入的所有功能在二進制版本中將不可用。
* 在仿真版本之後移除的所有功能將可用。

<!--
This enables a binary from a particular Kubernetes release to emulate the
behavior of a previous version with sufficient fidelity that interoperability
with other system components can be defined in terms of the emulated version.
-->
這使得特定 Kubernetes 版本的二進制文件能夠以足夠的精確度仿真之前某個版本的行爲，
與其他系統組件的互操作性可以在仿真版本中進行定義。

<!--
The `--emulated-version` must be <= `binaryVersion`. See the help message of
the `--emulated-version` flag for supported range of emulated versions.
-->
`--emulated-version` 必須小於或等於 `binaryVersion`。
有關支持的仿真版本範圍，參閱 `--emulated-version` 參數的幫助信息。
