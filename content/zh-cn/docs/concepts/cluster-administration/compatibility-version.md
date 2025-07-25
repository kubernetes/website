---
title: Kubernetes 控制平面组件的兼容版本
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
自 v1.32 版本发布以来，我们为 Kubernetes 控制平面组件引入了可配置的版本兼容性和仿真选项，
为集群管理员提供更多控制选项并增加可用的细粒度步骤来让升级更加安全。

<!-- body -->

<!--
## Emulated Version

The emulation option is set by the `--emulated-version` flag of control plane components.
It allows the component to emulate the behavior (APIs, features, ...) of an earlier version
of Kubernetes.
-->
## 仿真版本   {#emulated-version}

仿真选项通过控制平面组件的 `--emulated-version` 参数来设置。
此选项允许控制平面组件仿真 Kubernetes 早期版本的行为（API、特性等）。

<!--
When used, the capabilities available will match the emulated version: 

* Any capabilities present in the binary version that were introduced
  after the emulation version will be unavailable. 
* Any capabilities removed after the emulation version will be available.
-->
使用时，可用的功能将与仿真版本相匹配：

* 在仿真版本之后引入的所有功能在二进制版本中将不可用。
* 在仿真版本之后移除的所有功能将可用。

<!--
This enables a binary from a particular Kubernetes release to emulate the
behavior of a previous version with sufficient fidelity that interoperability
with other system components can be defined in terms of the emulated version.
-->
这使得特定 Kubernetes 版本的二进制文件能够以足够的精确度仿真之前某个版本的行为，
与其他系统组件的互操作性可以在仿真版本中进行定义。

<!--
The `--emulated-version` must be <= `binaryVersion`. See the help message of
the `--emulated-version` flag for supported range of emulated versions.
-->
`--emulated-version` 必须小于或等于 `binaryVersion`。
有关支持的仿真版本范围，参阅 `--emulated-version` 参数的帮助信息。
