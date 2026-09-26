---
layout: blog
title: "Kubernetes v1.37: KubeletInUserNamespace (aka Rootless mode) Graduates to Beta"
slug: kubernetes-v1-37-rootless-beta
date: 2026-09-04T10:30:00-08:00
author: >
  [Akihiro Suda](https://github.com/AkihiroSuda) (NTT)
---

Kubernetes v1.37 promotes the `KubeletInUserNamespace` feature gate to beta.
With this feature enabled, all of the node components (kubelet, CRI and OCI runtimes,
CNI plugins, and kube-proxy) can run as a non-root user on the host, using a
[Linux user namespace](https://man7.org/linux/man-pages/man7/user_namespaces.7.html).
This technique is also known as _rootless mode_.
The work started as an experiment in 2018, and was merged into Kubernetes v1.22 (2021)
as an alpha feature (Kubernetes Enhancement Proposal [KEP-2033](https://www.kubernetes.dev/resources/keps/2033/)).

This feature should not be confused with [user namespaces for pods](/docs/concepts/workloads/pods/user-namespaces/)
(`hostUsers: false` with the `UserNamespacesSupport` feature gate, GA since v1.36),
which puts pods in user namespaces but still runs the node components as root.
These two features do not conflict.
Moreover, they can be combined to nest Kubernetes inside Kubernetes without resorting to
the full `privileged: true`.

## Why run the node components in a user namespace?

Because the node components have historically had container-breakout vulnerabilities
that could compromise full root privileges on the host.

Examples of such vulnerabilities include:
- [CVE-2022-0811](https://nvd.nist.gov/vuln/detail/CVE-2022-0811)
  ("cr8escape"): CRI-O could be tricked into setting arbitrary sysctls, such as
  `kernel.core_pattern`, resulting in arbitrary code execution as root on the host
- [CVE-2023-27561](https://nvd.nist.gov/vuln/detail/CVE-2023-27561):
  runc could be tricked into bypassing the masked paths of a container via a volume
  mount race, exposing the host's procfs files (a regression of CVE-2019-19921)
- [CVE-2024-10220](https://nvd.nist.gov/vuln/detail/CVE-2024-10220):
  the kubelet could be made to execute arbitrary commands as root via `gitRepo` volumes
  (`gitRepo` volumes had a similar vulnerability,
  [CVE-2018-11235](https://nvd.nist.gov/vuln/detail/CVE-2018-11235), back in 2018 too)
- [CVE-2025-31133](https://nvd.nist.gov/vuln/detail/CVE-2025-31133):
  runc could be tricked into bind-mounting attacker-controlled paths and writing to the
  host's procfs files, such as `/proc/sysrq-trigger` and
  `/proc/sys/kernel/core_pattern`
- [CVE-2026-53488](https://nvd.nist.gov/vuln/detail/CVE-2026-53488):
  containerd could be tricked into executing arbitrary commands on the host, via
  crafted labels in a container image

By running the node components in a user namespace, the potential damage is confined to
the non-root user's account.
Notably, an attacker cannot conceal their intrusion by modifying the kernel, the boot
loader, or the firmware.

It should still be noted that user namespaces are not effective for mitigating
vulnerabilities in the kernel itself.
User namespaces should be used in conjunction with traditional hardening measures such as
[seccomp](/docs/tutorials/security/seccomp/) to prevent containers from invoking
unnecessary system calls.

### Use cases

- **Production clusters**: mitigate potential container-breakout vulnerabilities.
- **Shared machines (e.g., HPC)**: users can deploy Kubernetes without asking the machine
  administrator for root privileges, and without the risk of accidentally breaking
  other users' environments.
- **Laptops**: prevent a local cluster from accidentally breaking the host system configuration,
  e.g., the host iptables rules used for VPNs.
- **AI sandbox**: a Kubernetes application developer may create a dedicated local user account for
  running an AI coding agent and a test Kubernetes cluster.
  This setup is useful for preventing the AI agent from breaking the host when it is deceived by
  malicious information on the Internet.
- **Kubernetes-in-Kubernetes**: a nested cluster can run inside a parent cluster as a user-namespaced
  pod (`hostUsers: false`), isolating workloads more strictly than Kubernetes API namespaces do.
- **Bootstrapping**: a temporary unprivileged cluster can be used to bootstrap an actual
  cluster, e.g., with Cluster API.

## How does it work?

A Linux kernel _user namespace_ maps a host level non-root user (e.g., UID 1000) to a _fake root_ user inside the namespace. The UID 0
privileges are limited to the inside of the namespace.
The fake root is enough for most of the node components' tasks: mounting volumes,
creating cgroups, and configuring the network namespaces of pods.
It still comes with some [caveats](https://www.kubernetes.dev/resources/keps/2033/#notesconstraintscaveats-optional) that may break compatibility with specific CNI and CSI drivers, though.

The user namespace has to be created outside of Kubernetes.
For example, [Rootless](https://docs.docker.com/engine/security/rootless/) Docker can be used to prepare the user namespace in which Kubernetes runs.

The `KubeletInUserNamespace` feature gate itself is quite "boring": basically it just lets the kubelet
ignore permission errors that occur when [setting some sysctl values](https://github.com/kubernetes/kubernetes/blob/v1.37.0-beta.0/pkg/kubelet/cm/container_manager_linux.go#L499-L517)
(e.g., `vm.overcommit_memory` and `kernel.panic`)
and when [watching kernel messages via `/dev/kmsg`](https://github.com/kubernetes/kubernetes/blob/v1.37.0-beta.0/pkg/kubelet/kubelet.go#L586-L601).

See [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/)
for further information.

## What changed from Alpha to Beta?

- The `KubeletInUserNamespace` feature gate is now enabled by default.
  Enabling the gate does not put the kubelet into a user namespace automatically, so nothing
  changes for existing "rootful" clusters.
- `kubectl get nodes -o yaml` now reports whether nodes are running in a user namespace via
  the [`runningInUserNamespace`](https://pkg.go.dev/k8s.io/api/core/v1#NodeSystemInfo) property.
  A cluster administrator can use this property to set node labels or taints, to avoid scheduling workloads
  that need real root privileges (e.g., some CNI plugin installers) onto rootless nodes.
- For Kubernetes' own CI/CD testing, the node conformance end to end tests now run on a rootless cluster
  ([ci-kubernetes-e2e-kind-rootless](https://prow.k8s.io/job-history/gs/kubernetes-ci-logs/logs/ci-kubernetes-e2e-kind-rootless)).

Several related improvements have also happened outside the promotion of the feature gate itself:

- **Linux kernel v6.3 (2023)**: added support for [idmapped tmpfs](https://kernelnewbies.org/Linux_6.3).
- **Kubernetes v1.33 (2025)**: enabled the [`UserNamespacesSupport`](/docs/concepts/workloads/pods/user-namespaces/) feature gate
  by default, allowing user-namespaced pods (`hostUsers: false`) to be created without extra configuration.
- **containerd v2.1 (2025)**: added support for [writable cgroups](https://github.com/containerd/containerd/releases/tag/v2.1.0).

With these improvements, a Kubernetes cluster with `KubeletInUserNamespace` can now also be nested
inside Kubernetes pods with `hostUsers: false` (`UserNamespacesSupport`).

## How to use it

### kind

The easiest way is to use [kind](https://kind.sigs.k8s.io/) (a Kubernetes SIG Testing project)
to run a Kubernetes cluster in rootless Docker, rootless nerdctl, or rootless Podman:

```bash
# Example using Docker
dockerd-rootless-setuptool.sh install
kind create cluster
```

Depending on the host configuration, you may need additional configuration for
systemd, kernel modules, sysctl, etc.

See the [Docker documentation](https://docs.docker.com/engine/security/rootless/) and
the [kind documentation](https://kind.sigs.k8s.io/docs/user/rootless/) for further information.

### minikube

[minikube](https://minikube.sigs.k8s.io/docs/) (a Kubernetes SIG Cluster Lifecycle project)
also supports running a Kubernetes cluster in rootless Docker or rootless Podman:

```bash
dockerd-rootless-setuptool.sh install
minikube start --driver=docker
```

See the [minikube documentation](https://minikube.sigs.k8s.io/docs/drivers/docker/)
for further information.

### Usernetes

[Usernetes](https://github.com/rootless-containers/usernetes) (a third-party project)
is a distribution of rootless Kubernetes, maintained by the author of this article.
The project began in 2018, and it is where the `KubeletInUserNamespace` feature gate
originally came from.

Unlike kind and minikube, Usernetes supports creating a cluster with multiple rootless
Docker / Podman / nerdctl nodes, connected using VXLAN via the Flannel CNI plugin.

Usernetes also experimentally supports a [Kubernetes-in-Kubernetes](https://github.com/rootless-containers/usernetes/tree/master/kubernetes) mode.

### k3s

[k3s](https://k3s.io) (a CNCF Sandbox project) also supports [rootless mode](https://docs.k3s.io/advanced#running-rootless-servers-experimental).
Unlike kind, minikube, and the current generation of Usernetes, rootless k3s does not rely on an external runtime such as rootless Docker.

## What's next?

Depending on feedback and adoption, the Kubernetes project plans to graduate this feature to
General Availability (GA) in a future release. If you have feedback on this feature, please
open an issue in the [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repository.

The project is also discussing several Kubernetes Enhancement Proposals that may contribute to
simplifying Kubernetes-in-Kubernetes with this feature:
- [KEP-5474: Enable Writable cgroups for unprivileged containers](https://www.kubernetes.dev/resources/keps/5474/)
- [KEP-5714: Allow specifying whether to unshare cgroup namespaces](https://www.kubernetes.dev/resources/keps/5714)

## Getting involved

We always welcome new contributors. If you would like to get involved, you can join the
[Node Special Interest Group](https://www.kubernetes.dev/community/community-groups/sigs/node/)
(SIG Node).

If you would like to share feedback, you can do so on our
[public Slack channel](https://kubernetes.slack.com/messages/sig-node)
(visit https://slack.k8s.io/ for an invitation if you need one).

Special thanks to everyone who helped design and implement this feature,
including but not limited to (in alphabetical order):
- Bing Hongtao ([HirazawaUi](https://github.com/HirazawaUi))
- Jordan Liggitt ([liggitt](https://github.com/liggitt))
- Sergey Kanzhelev ([SergeyKanzhelev](https://github.com/SergeyKanzhelev))
- Tim Hockin ([thockin](https://github.com/thockin))
