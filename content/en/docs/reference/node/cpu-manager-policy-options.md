---
title: CPU Manager Policy Options
content_type: reference
weight: 45
---

The kubelet's `static` CPU Manager policy supports the options below. Each
option defaults to `false`. To enable an option, set its value to the string
`"true"` in the `cpuManagerPolicyOptions` field of the
[kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).

{{< table caption="Static CPU Manager policy options and their Kubernetes release stages" >}}
| Option | First available | Current stage | Effect |
| --- | --- | --- | --- |
| `align-by-socket` | v1.25 | Alpha since v1.25 | Aligns CPU allocations to socket boundaries. |
| `distribute-cpus-across-cores` | v1.31 | Alpha since v1.31 | Spreads hardware threads across physical cores. |
| `distribute-cpus-across-numa` | v1.23 | Beta since v1.33 | Spreads CPUs evenly across NUMA nodes when an allocation needs more than one node. |
| `full-pcpus-only` | v1.22 | Stable since v1.33 | Allocates whole physical cores to containers that qualify for exclusive CPUs. |
| `prefer-align-cpus-by-uncorecache` | v1.32 | Stable since v1.36 | Prefers CPUs that share a last-level cache. |
| `strict-cpu-reservation` | v1.32 | Stable since v1.35 | Keeps Pods of all quality of service classes off CPUs reserved for the system. |
{{< /table >}}

Alpha options require the `CPUManagerPolicyAlphaOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), which is disabled by default.
Beta options require `CPUManagerPolicyBetaOptions`, which is enabled by default.
Stable options are always available. Enabling a feature gate makes its options
available for configuration.

## Combining options

With `full-pcpus-only` and `distribute-cpus-across-numa` enabled together,
the CPU Manager spreads whole physical cores across NUMA nodes. You can also
enable `align-by-socket` with either or both options.

The kubelet rejects the following combinations.

- `distribute-cpus-across-cores` with `full-pcpus-only`, `distribute-cpus-across-numa`, or `prefer-align-cpus-by-uncorecache`.
- `prefer-align-cpus-by-uncorecache` with `distribute-cpus-across-numa`.
- `align-by-socket` with the Topology Manager's `single-numa-node` policy.

The kubelet also rejects `align-by-socket` on nodes that have more sockets than NUMA nodes.

## {{% heading "whatsnext" %}}

- [Configure the static CPU Manager policy](/docs/tasks/administer-cluster/cpu-management-policies/#cpu-policy-static--options).
- [Learn how each option affects CPU placement](/docs/concepts/resource-management/resource-managers/#cpu-policy-static--options).
