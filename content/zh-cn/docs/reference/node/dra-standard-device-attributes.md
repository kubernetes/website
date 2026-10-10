---
content_type: "reference"
title: 动态资源分配的标准设备属性
weight: 15
---
<!--
content_type: "reference"
title: Standard Device Attributes for Dynamic Resource Allocation
weight: 15
-->

<!--
Kubernetes defines a set of standard device attributes under the
`resource.kubernetes.io` domain for use with
{{< glossary_tooltip text="Dynamic Resource Allocation (DRA)" term_id="dra" >}}.
These attributes have well-defined semantics so that `matchAttribute` constraints
work across devices from different DRA drivers without requiring driver-specific
knowledge.
-->
Kubernetes 在 `resource.kubernetes.io` 域下定义了一组标准设备属性，
供{{< glossary_tooltip text="动态资源分配（DRA）" term_id="dra" >}}使用。
这些属性具有明确定义的语义，因此 `matchAttribute` 约束可以作用于来自不同
DRA 驱动的设备，而不需要了解具体驱动的实现细节。

<!--
DRA drivers are encouraged to publish these attributes when applicable. The
Kubernetes DRA helper library
(`k8s.io/dynamic-resource-allocation/deviceattribute`) provides functions that
drivers can call to derive the correct values from sysfs.
-->
我们鼓励 DRA 驱动在适用时发布这些属性。
Kubernetes 的 DRA 辅助库（`k8s.io/dynamic-resource-allocation/deviceattribute`）
提供了驱动可调用的若干函数，用于从 sysfs 推导出正确的值。

<!--
## Standard attributes
-->
## 标准属性 {#standard-attributes}

### `resource.kubernetes.io/numaNode`

<!--
Identifies the NUMA topology of a device. This attribute can be either:
-->
用于标识设备的 NUMA 拓扑。此属性可以是以下两种形式之一：

<!--
- A scalar integer: the device's physical NUMA node, read from the kernel's
  `numa_node` sysfs entry. This form works without any feature gate.
- An integer list (requires the `DRAListTypeAttributes` feature gate): the
  physical NUMA node followed by same-socket NUMA nodes at the minimum ACPI
  SLIT distance. For example, on an AMD EPYC system with 4 NUMA nodes per
  socket, a device on NUMA node 5 may publish `[5, 4, 6, 7]` to indicate
  that NUMA nodes 4, 6, and 7 are on the same socket and equidistant.
-->
- 标量整数：设备的物理 NUMA 节点，读取自内核的 `numa_node` sysfs 条目。
  这种形式不需要任何特性门控。
- 整数列表（需要 `DRAListTypeAttributes` 特性门控）：先是物理 NUMA 节点，
  随后是处于最小 ACPI SLIT 距离的同插槽 NUMA 节点。例如，在一个每插槽有
  4 个 NUMA 节点的 AMD EPYC 系统上，位于 NUMA 节点 5 上的设备可以发布
  `[5, 4, 6, 7]`，表示 NUMA 节点 4、6 和 7 位于同一插槽且相互等距。

<!--
Use `matchAttribute` with this attribute to co-locate devices from different
drivers on the same NUMA node. When list-type values are used, the scheduler
performs set intersection: two devices match as long as their NUMA node
lists share at least one value.
-->
将此属性与 `matchAttribute` 一起使用，可以把来自不同驱动的设备共置在同一个
NUMA 节点上。当使用列表类型的值时，调度器执行集合求交：
只要两个设备的 NUMA 节点列表至少共享一个值，二者即匹配。

<!--
Devices with no NUMA affinity (`numa_node = -1` in sysfs) must not publish
this attribute.
-->
不具备 NUMA 亲和性的设备（sysfs 中 `numa_node = -1`）不得发布此属性。

<!--
Helper functions for DRA driver authors:
-->
面向 DRA 驱动编写者的辅助函数：

<!--
- `GetNUMANodeAttributeByPCIBusID(pciBusID, attrForm)`: for PCI devices
  (GPUs, NICs, NVMe controllers). Reads `numa_node` from sysfs and, when
  `attrForm` is `ListAttribute`, computes the SLIT-based list.
- `GetNUMANodeAttribute(numaNode, attrForm)`: for devices that already
  know their NUMA node (CPUs, memory).
- `GetNUMANodeForCPU(cpuID)`: returns the NUMA node for a CPU core.
-->
- `GetNUMANodeAttributeByPCIBusID(pciBusID, attrForm)`：用于 PCI 设备
  （GPU、NIC、NVMe 控制器）。它从 sysfs 读取 `numa_node`，并且当
  `attrForm` 为 `ListAttribute` 时，计算出基于 SLIT 的列表。
- `GetNUMANodeAttribute(numaNode, attrForm)`：用于已经知道自身 NUMA 节点的设备（CPU、内存）。
- `GetNUMANodeForCPU(cpuID)`：返回某个 CPU 核心所属的 NUMA 节点。

### `resource.kubernetes.io/pciBusID`

<!--
The PCI bus address of a PCI device in extended BDF notation
(`Domain:Bus:Device.Function`). This attribute uniquely identifies a PCI
device on a node.
-->
PCI 设备的 PCI 总线地址，采用扩展 BDF 表示法
（`Domain:Bus:Device.Function`）。此属性唯一标识节点上的某个 PCI 设备。

### `resource.kubernetes.io/pcieRoot`

<!--
The PCIe Root Complex of a PCI device, in the format `pci<domain>:<bus>`.
Devices that share the same PCIe Root Complex are connected to the same PCIe
switch hierarchy. Use `matchAttribute` with this attribute to co-locate
devices under the same PCIe root for lowest-latency communication.
-->
PCI 设备的 PCIe 根复合体，格式为 `pci<domain>:<bus>`。
共享同一个 PCIe 根复合体的设备连接在同一个 PCIe 交换层级之下。
将此属性与 `matchAttribute` 一起使用，可以把设备共置在同一个 PCIe 根之下，
从而实现延迟最低的通信。
