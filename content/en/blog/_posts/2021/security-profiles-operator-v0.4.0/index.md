---
layout: blog
title: "What's new in Security Profiles Operator v0.4.0"
date: 2021-12-17
slug: security-profiles-operator
author: >
   Jakub Hrozek,
   Juan Antonio Osorio,
   Paulo Gomes,
   Sascha Grunert
---

The [Security Profiles Operator (SPO)](https://sigs.k8s.io/security-profiles-operator)
is an out-of-tree Kubernetes enhancement to make the management of
[seccomp](https://en.wikipedia.org/wiki/Seccomp),
[SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) and
[AppArmor](https://en.wikipedia.org/wiki/AppArmor) profiles easier and more
convenient. We're happy to announce that we recently [released
v0.4.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.4.0)
of the operator, which contains a ton of new features, fixes and usability
improvements.

## What's new

It has been a while since the last
[v0.3.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.3.0)
release of the operator. We added new features, fine-tuned existing ones and
reworked our documentation in 290 commits over the past half year.

One of the highlights is that we're now able to record seccomp and SELinux
profiles using the operators [log enricher](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#log-enricher-based-recording).
This allows us to reduce the dependencies required for profile recording to have
[auditd](https://linux.die.net/man/8/auditd) or
[syslog](https://en.wikipedia.org/wiki/Syslog) (as fallback) running on the
nodes. All profile recordings in the operator work in the same way by using the
`ProfileRecording` CRD as well as their corresponding [label
selectors](/docs/concepts/overview/working-with-objects/labels). The log
enricher itself can be also used to gather meaningful insights about seccomp and
SELinux messages of a node. Checkout the [official
documentation](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-the-log-enricher)
to learn more about it.

### seccomp related improvements

Beside the log enricher based recording we now offer an alternative to record
seccomp profiles by utilizing [ebpf](https://ebpf.io). This optional feature can
be enabled by setting `enableBpfRecorder` to `true`. This results in running a
dedicated container, which ships a custom bpf module on every node to collect
the syscalls for containers. It even supports older Kernel versions which do not
expose the [BPF Type Format (BTF)](https://www.kernel.org/doc/html/latest/bpf/btf.html) per
default as well as the `amd64` and `arm64` architectures. Checkout
[our documentation](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#ebpf-based-recording)
to see it in action. By the way, we now add the seccomp profile architecture of
the recorder host to the recorded profile as well.

We also graduated the seccomp profile API from `v1alpha1` to `v1beta1`. This
aligns with our overall goal to stabilize the CRD APIs over time. The only thing
which has changed is that the seccomp profile type `Architectures` now points to
`[]Arch` instead of `[]*Arch`.

### SELinux enhancements

Managing SELinux policies (an equivalent to using `semodule` that
you would normally call on a single server) is not done by SPO
itself, but by another container called selinuxd to provide better
isolation. This release switched to using selinuxd containers from
a personal repository to images located under [our team's quay.io
repository](https://quay.io/organization/security-profiles-operator).
The selinuxd repository has moved as well to [the containers GitHub
organization](https://github.com/containers/selinuxd).

Please note that selinuxd links dynamically to `libsemanage` and mounts the
SELinux directories from the nodes, which means that the selinuxd container
must be running the same distribution as the cluster nodes. SPO defaults
to using CentOS-8 based containers, but we also build Fedora based ones.
If you are using another distribution and would like us to add support for
it, please file [an issue against selinuxd](https://github.com/containers/selinuxd/issues).

#### Profile Recording

This release adds support for recording of SELinux profiles.
The recording itself is managed via an instance of a `ProfileRecording` Custom
Resource as seen in an
[example](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/profilerecording-selinux-logs.yaml)
in our repository. From the user's point of view it works pretty much the same
as recording of seccomp profiles.

Under the hood, to know what the workload is doing SPO installs a special
permissive policy called [selinuxrecording](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base/profiles/selinuxrecording.cil)
on startup which allows everything and logs all AVCs to `audit.log`.
These AVC messages are scraped by the log enricher component and when
the recorded workload exits, the policy is created.

#### `SELinuxProfile` CRD graduation

An `v1alpha2` version of the `SelinuxProfile` object has been introduced. This
removes the raw Common Intermediate Language (CIL) from the object itself and
instead adds a simple policy language to ease the writing and parsing
experience.

Alongside, a `RawSelinuxProfile` object was also introduced. This contains a
wrapped and raw representation of the policy. This was intended for folks to be
able to take their existing policies into use as soon as possible. However, on
validations are done here.

### AppArmor support

This version introduces the initial support for AppArmor, allowing users to load and 
unload AppArmor profiles into cluster nodes by using the new [AppArmorProfile](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base-crds/crds/apparmorprofile.yaml) CRD.

To enable AppArmor support use the [enableAppArmor feature gate](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/config.yaml#L10) switch of your SPO configuration.
Then use our [apparmor example](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/apparmorprofile.yaml) to deploy your first profile across your cluster.

### Metrics

The operator now exposes metrics, which are described in detail in
our new [metrics documentation](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-metrics).
We decided to secure the metrics retrieval process by using
[kube-rbac-proxy](https://github.com/brancz/kube-rbac-proxy), while we ship an
additional `spo-metrics-client` cluster role (and binding) to retrieve the
metrics from within the cluster. If you're using
[OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift),
then we provide an out of the box working
[`ServiceMonitor`](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#automatic-servicemonitor-deployment)
to access the metrics.

#### Debuggability and robustness

Beside all those new features, we decided to restructure parts of the Security
Profiles Operator internally to make it better to debug and more robust. For
example, we now maintain an internal [gRPC](https://grpc.io) API to communicate
within the operator across different features. We also improved the performance
of the log enricher, which now caches results for faster retrieval of the log
data. The operator can be put into a more [verbose log mode](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#set-logging-verbosity)
by setting `verbosity` from `0` to `1`.

We also print the used `libseccomp` and `libbpf` versions on startup, as well as
expose CPU and memory profiling endpoints for each container via the
[`enableProfiling` option](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#enable-cpu-and-memory-profiling).
Dedicated liveness and startup probes inside of the operator daemon will now
additionally improve the life cycle of the operator.

## Conclusion

Thank you for reading this update. We're looking forward to future enhancements
of the operator and would love to get your feedback about the latest release.
Feel free to reach out to us via the Kubernetes slack
[#security-profiles-operator](https://kubernetes.slack.com/messages/security-profiles-operator)
for any feedback or question.
