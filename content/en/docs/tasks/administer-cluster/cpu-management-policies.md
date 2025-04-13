---
title: Control CPU Management Policies on the Node
reviewers:
- sjenning
- ConnorDoyle
- balajismaniam

content_type: task
min-kubernetes-server-version: v1.26
weight: 140
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes keeps many aspects of how pods execute on nodes abstracted
from the user. This is by design.  However, some workloads require
stronger guarantees in terms of latency and/or performance in order to operate
acceptably. The kubelet provides methods to enable more complex workload
placement policies while keeping the abstraction free from explicit placement
directives.

For detailed information on resource management, please refer to the
[Resource Management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers)
documentation.

For detailed information on how the kubelet implements resource management, please refer to the
[Node ResourceManagers](/docs/concepts/policy/node-resource-managers) documentation.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

If you are running an older version of Kubernetes, please look at the documentation for the version you are actually running.


<!-- steps -->

## Configuring CPU management policies

By default, the kubelet uses [CFS quota](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler)
to enforce pod CPU limits.  When the node runs many CPU-bound pods,
the workload can move to different CPU cores depending on
whether the pod is throttled and which CPU cores are available at
scheduling time. Many workloads are not sensitive to this migration and thus
work fine without any intervention.

However, in workloads where CPU cache affinity and scheduling latency
significantly affect workload performance, the kubelet allows alternative CPU
management policies to determine some placement preferences on the node.

## Windows Support

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

CPU Manager support can be enabled on Windows by using the `WindowsCPUAndMemoryAffinity` feature gate
and it requires support in the container runtime.
Once the feature gate is enabled, follow the steps below to configure the [CPU manager policy](#configuration).

## Configuration

The CPU Manager policy is set with the `--cpu-manager-policy` kubelet
flag or the `cpuManagerPolicy` field in [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).
There are two supported policies:

* [`none`](#none-policy): the default policy.
* [`static`](#static-policy): allows pods with certain resource characteristics to be
  granted increased CPU affinity and exclusivity on the node.

The CPU manager periodically writes resource updates through the CRI in
order to reconcile in-memory CPU assignments with cgroupfs. The reconcile
frequency is set through a new Kubelet configuration value
`--cpu-manager-reconcile-period`. If not specified, it defaults to the same
duration as `--node-status-update-frequency`.

The behavior of the static policy can be fine-tuned using the `--cpu-manager-policy-options` flag.
The flag takes a comma-separated list of `key=value` policy options.
If you disable the `CPUManagerPolicyOptions`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
then you cannot fine-tune CPU manager policies. In that case, the CPU manager
operates only using its default settings.

In addition to the top-level `CPUManagerPolicyOptions` feature gate, the policy options are split
into two groups: alpha quality (hidden by default) and beta quality (visible by default).
The groups are guarded respectively by the `CPUManagerPolicyAlphaOptions`
and `CPUManagerPolicyBetaOptions` feature gates. Diverging from the Kubernetes standard, these
feature gates guard groups of options, because it would have been too cumbersome to add a feature
gate for each individual option.

## Changing the CPU Manager Policy

Since the CPU manager policy can only be applied when kubelet spawns new pods, simply changing from
"none" to "static" won't apply to existing pods. So in order to properly change the CPU manager
policy on a node, perform the following steps:

1. [Drain](/docs/tasks/administer-cluster/safely-drain-node) the node.
2. Stop kubelet.
3. Remove the old CPU manager state file. The path to this file is
`/var/lib/kubelet/cpu_manager_state` by default. This clears the state maintained by the
CPUManager so that the cpu-sets set up by the new policy won’t conflict with it.
4. Edit the kubelet configuration to change the CPU manager policy to the desired value.
5. Start kubelet.

Repeat this process for every node that needs its CPU manager policy changed. Skipping this
process will result in kubelet crashlooping with the following error:

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```

{{< note >}}
if the set of online CPUs changes on the node, the node must be drained and CPU manager manually reset by deleting the
state file `cpu_manager_state` in the kubelet root directory.
{{< /note >}}

### `none` policy configuration

This policy has no extra configuration items.

### `static` policy configuration

This policy manages a shared pool of CPUs that initially contains all CPUs in the
node. The amount of exclusively allocatable CPUs is equal to the total
number of CPUs in the node minus any CPU reservations by the kubelet `--kube-reserved` or
`--system-reserved` options. From 1.17, the CPU reservation list can be specified
explicitly by kubelet `--reserved-cpus` option. The explicit CPU list specified by
`--reserved-cpus` takes precedence over the CPU reservation specified by
`--kube-reserved` and `--system-reserved`. CPUs reserved by these options are taken, in
integer quantity, from the initial shared pool in ascending order by physical
core ID.  This shared pool is the set of CPUs on which any containers in
`BestEffort` and `Burstable` pods run. Containers in `Guaranteed` pods with fractional
CPU `requests` also run on CPUs in the shared pool. Only containers that are
both part of a `Guaranteed` pod and have integer CPU `requests` are assigned
exclusive CPUs.

{{< note >}}
The kubelet requires a CPU reservation greater than zero be made
using either `--kube-reserved` and/or `--system-reserved` or `--reserved-cpus` when
the static policy is enabled. This is because zero CPU reservation would allow the shared
pool to become empty.
{{< /note >}}

### Static policy options {#cpu-policy-static--options}

You can toggle groups of options on and off based upon their maturity level
using the following feature gates:
* `CPUManagerPolicyBetaOptions` default enabled. Disable to hide beta-level options.
* `CPUManagerPolicyAlphaOptions` default disabled. Enable to show alpha-level options.
You will still have to enable each option using the `CPUManagerPolicyOptions` kubelet option.

The following policy options exist for the static `CPUManager` policy:
* `full-pcpus-only` (beta, visible by default) (1.22 or higher)
* `distribute-cpus-across-numa` (alpha, hidden by default) (1.23 or higher)
* `align-by-socket` (alpha, hidden by default) (1.25 or higher)
* `distribute-cpus-across-cores` (alpha, hidden by default) (1.31 or higher)
* `strict-cpu-reservation` (alpha, hidden by default) (1.32 or higher)
* `prefer-align-cpus-by-uncorecache` (alpha, hidden by default) (1.32 or higher)

The `full-pcpus-only` option can be enabled by adding `full-pcpus-only=true` to
the CPUManager policy options.
Likewise, the `distribute-cpus-across-numa` option can be enabled by adding
`distribute-cpus-across-numa=true` to the CPUManager policy options.
When both are set, they are "additive" in the sense that CPUs will be
distributed across NUMA nodes in chunks of full-pcpus rather than individual
cores.
The `align-by-socket` policy option can be enabled by adding `align-by-socket=true`
to the `CPUManager` policy options. It is also additive to the `full-pcpus-only`
and `distribute-cpus-across-numa` policy options.

The `distribute-cpus-across-cores` option can be enabled by adding
`distribute-cpus-across-cores=true` to the `CPUManager` policy options.
It cannot be used with `full-pcpus-only` or `distribute-cpus-across-numa` policy
options together at this moment.

The `strict-cpu-reservation` option can be enabled by adding `strict-cpu-reservation=true` to
the CPUManager policy options followed by removing the `/var/lib/kubelet/cpu_manager_state` file and restart kubelet.

The `prefer-align-cpus-by-uncorecache` option can be enabled by adding the
`prefer-align-cpus-by-uncorecache` to the `CPUManager` policy options. If 
incompatible options are used, the kubelet will fail to start with the error 
explained in the logs.

For mode detail about the behavior of the individual options you can configure, please refer to the
[Node ResourceManagers](/docs/concepts/policy/node-resource-managers) documentation.
