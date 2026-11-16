---
content_type: "reference"
title: Standard Device Attributes for Dynamic Resource Allocation
weight: 15
---

Kubernetes defines a set of standard device attributes under the
`resource.kubernetes.io` domain for use with
{{< glossary_tooltip text="Dynamic Resource Allocation (DRA)" term_id="dra" >}}.
These attributes have well-defined semantics so that `matchAttribute` constraints
work across devices from different DRA drivers without requiring driver-specific
knowledge.

DRA drivers are encouraged to publish these attributes when applicable. The
Kubernetes DRA helper library
(`k8s.io/dynamic-resource-allocation/deviceattribute`) provides functions that
drivers can call to derive the correct values from sysfs.

## Standard attributes

### `resource.kubernetes.io/numaNode`

Identifies the NUMA topology of a device. This attribute can be either:

- A scalar integer: the device's physical NUMA node, read from the kernel's
  `numa_node` sysfs entry. This form works without any feature gate.
- An integer list (requires the `DRAListTypeAttributes` feature gate): the
  physical NUMA node followed by same-socket NUMA nodes at the minimum ACPI
  SLIT distance. For example, on an AMD EPYC system with 4 NUMA nodes per
  socket, a device on NUMA node 5 may publish `[5, 4, 6, 7]` to indicate
  that NUMA nodes 4, 6, and 7 are on the same socket and equidistant.

Use `matchAttribute` with this attribute to co-locate devices from different
drivers on the same NUMA node. When list-type values are used, the scheduler
performs set intersection: two devices match as long as their NUMA node
lists share at least one value.

Devices with no NUMA affinity (`numa_node = -1` in sysfs) must not publish
this attribute.

Helper functions for DRA driver authors:

- `GetNUMANodeAttributeByPCIBusID(pciBusID, attrForm)`: for PCI devices
  (GPUs, NICs, NVMe controllers). Reads `numa_node` from sysfs and, when
  `attrForm` is `ListAttribute`, computes the SLIT-based list.
- `GetNUMANodeAttribute(numaNode, attrForm)`: for devices that already
  know their NUMA node (CPUs, memory).
- `GetNUMANodeForCPU(cpuID)`: returns the NUMA node for a CPU core.

### `resource.kubernetes.io/pciBusID`

The PCI bus address of a PCI device in extended BDF notation
(`Domain:Bus:Device.Function`). This attribute uniquely identifies a PCI
device on a node.

### `resource.kubernetes.io/pcieRoot`

The PCIe Root Complex of a PCI device, in the format `pci<domain>:<bus>`.
Devices that share the same PCIe Root Complex are connected to the same PCIe
switch hierarchy. Use `matchAttribute` with this attribute to co-locate
devices under the same PCIe root for lowest-latency communication.
