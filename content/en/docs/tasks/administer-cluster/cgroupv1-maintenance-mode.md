--- title: Moving cgroup v1 support into maintenance mode
min-kubernetes-server-version: 1.31 content_type: task weight: 90 ---

<!-- overview -->

The Linux kernel community has made cgroup v2 the focus for new features,
offering better functionality, a more consistent interface, and improved
scalability. As a result, major Linux distributions and projects like systemd
are phasing out support for cgroup v1. This trend creates an imperative for
Kubernetes to align with these changes.


<!-- steps -->


## Why switch to cgroup v2?

Switching to cgroup v2 offers enhanced functionality, a more consistent
interface, and improved scalability, making it a superior choice for resource
management in Kubernetes. The Linux kernel community and major projects like
systemd are phasing out cgroup v1 in favor of cgroup v2, which is becoming
the industry standard. By aligning with this trend, Kubernetes ensures
better compatibility with the broader ecosystem, benefits from increased
security and efficiency, and stays current with the latest advancements in
Linux kernel resource management.


## What Does Maintenance Mode Mean?

Maintenance mode for cgroup v1 support in Kubernetes implies several key
changes and priorities. Firstly, no new features will be introduced to
the cgroup v1 support code; its existing functionality will be considered
complete and stable. To ensure ongoing validation, a set of end-to-end (e2e)
tests will be maintained for the currently supported features of cgroup
v1. In terms of security, the Kubernetes community may provide fixes for
Critical and Important CVEs related to cgroup v1, as long as the release
is not end-of-life. Best-effort bug fixes will address critical security
vulnerabilities on a priority basis, and major bugs will be evaluated for
potential fixes if feasible solutions exist. However, some bugs in cgroup
v1 support may remain unresolved, particularly those requiring substantial
changes or fixes in the kernel or other dependencies.

Importantly, removing cgroup v1 support is not a goal of this phase;
deprecation and removal, if required, will be addressed in a future Kubernetes
releases.

## How to Determine the cgroup Version Used by Your Nodes

To find out which version of cgroup your cluster nodes are using, refer to
the `kubelet_cgroup_version` metric. For nodes running Linux, this metric
will return either `1` for cgroup v1 or `2` for cgroup v2. For non-Linux
operating systems, it will return `0`.

Additionally, kubelet logs and events will display following warning message
on cgroup v1 hosts: "Cgroup v1 support is in maintenance mode, please migrate
to Cgroup v2."

## Failing on cgroup v1 Nodes

If you want to ensure that your cluster does not use nodes with cgroup v1,
you can use the kubelet flag `--fail-cgroup-v1`. This flag will cause the
kubelet to exit if it detects that the host is using cgroup v1. Note that
this flag is disabled by default. Alternatively, you can set this option in
the kubelet configuration by setting `FailCgroupV1` to `true`.




