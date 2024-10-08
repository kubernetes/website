---
content_type: "reference"
title: Local Files And Paths Used By The Kubelet
weight: 42
---

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} is mostly a stateless
process running on a Kubernetes {{< glossary_tooltip text="node" term_id="node" >}}.
This document outlines files that kubelet reads and writes.

{{< note >}}

This document is for informational purpose and not describing any guaranteed behaviors or APIs.
It lists resources used by the kubelet, which is an implementation detail and a subject to change at any release.

{{< /note >}}

The kubelet typically uses the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} as
the source of truth on what needs to run on the Node, and the
{{<glossary_tooltip text="container runtime" term_id="container-runtime">}} to retrieve
the current state of containers. So long as you provide a _kubeconfig_ (API client configuration)
to the kubelet, the kubelet does connect to your control plane; otherwise the node operates in
_standalone mode_.

On Linux nodes, the kubelet also relies on reading cgroups and various system files to collect metrics.

On Windows nodes, the kubelet collects metrics via a different mechanism that does not rely on
paths.

There are also a few other files that are used by the kubelet as well as kubelet communicates using local Unix-domain sockets. Some are sockets that the
kubelet listens on, and for other sockets the kubelet discovers them and then connects
as a client.

{{< note >}}

This page lists paths as Linux paths, which map to the Windows paths by adding a root disk
`C:\` in place of `/` (unless specified otherwise). For example, `/var/lib/kubelet/device-plugins` maps to `C:\var\lib\kubelet\device-plugins`.

{{< /note >}}

## Configuration

### Kubelet configuration files

The path to the kubelet configuration file can be configured
using the command line argument `--config`. The kubelet also supports
[drop-in configuration files](/docs/tasks/administer-cluster/kubelet-config-file/#kubelet-conf-d)
to enhance configuration.

### Certificates

Certificates and private keys are typically located at `/var/lib/kubelet/pki`,
but can be configured using the `--cert-dir` kubelet command line argument.
Names of certificate files are also configurable.

### Manifests

Manifests for static pods are typically located in `/etc/kubernetes/manifests`.
Location can be configured using the `staticPodPath` kubelet configuration option.

### Systemd unit settings

When kubelet is running as a systemd unit, some kubelet configuration may be declared
in systemd unit settings file. Typically it includes:

- command line arguments to [run kubelet](/docs/reference/command-line-tools-reference/kubelet/)
- environment variables, used by kubelet or [configuring golang runtime](https://pkg.go.dev/runtime#hdr-Environment_Variables)

## State

### Checkpoint files for resource managers {#resource-managers-state}

All resource managers keep the mapping of Pods to allocated resources in state files.
State files are located in the kubelet's base directory, also termed the _root directory_
(but not the same as `/`, the node root directory). You can configure the base directory
for the kubelet
using the kubelet command line argument `--root-dir`.

Names of files:

- `memory_manager_state` for the [Memory Manager](/docs/tasks/administer-cluster/memory-manager/)
- `cpu_manager_state` for the [CPU Manager](/docs/tasks/administer-cluster/cpu-management-policies/)
- `dra_manager_state` for [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)

### Checkpoint file for device manager {#device-manager-state}

Device manager creates checkpoints in the same directory with socket files: `/var/lib/kubelet/device-plugins/`.
The name of a checkpoint file is `kubelet_internal_checkpoint` for [Device Manager](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)

### Pod status checkpoint storage {#pod-status-manager-state}

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

If your cluster has  
[in-place Pod vertical scaling](/docs/concepts/workloads/autoscaling/#in-place-resizing)  
enabled ([feature gate](/docs/reference/command-line-tools-reference/feature-gates/)  
name `InPlacePodVerticalScaling`), then the kubelet stores a local record of Pod status.  

The file name is `pod_status_manager_state` within the kubelet base directory
(`/var/lib/kubelet` by default on Linux; configurable using `--root-dir`).

### Container runtime

Kubelet communicates with the container runtime using socket configured via the
configuration parameters:

- `containerRuntimeEndpoint` for runtime operations
- `imageServiceEndpoint` for image management operations

The actual values of those endpoints depend on the container runtime being used.

### Device plugins

The kubelet exposes a socket at the path `/var/lib/kubelet/device-plugins/kubelet.sock` for
various [Device Plugins to register](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-implementation).

When a device plugin registers itself, it provides its socket path for the kubelet to connect.

The device plugin socket should be in the directory `device-plugins` within the kubelet base
directory. On a typical Linux node, this means `/var/lib/kubelet/device-plugins`.

### Pod resources API

[Pod Resources API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
will be exposed at the path `/var/lib/kubelet/pod-resources`.

### DRA, CSI, and Device plugins

The kubelet looks for socket files created by device plugins managed via [DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/),
device manager, or storage plugins, and then attempts to connect
to these sockets. The directory that the kubelet looks in is `plugins_registry` within the kubelet base
directory, so on a typical Linux node this means `/var/lib/kubelet/plugins_registry`.

Note, for the device plugins there are two alternative registration mechanisms. Only one should be used for a given plugin.

The types of plugins that can place socket files into that directory are:

- CSI plugins
- DRA plugins
- Device Manager plugins

(typically `/var/lib/kubelet/plugins_registry`).

## Security profiles & configuration

### Seccomp

Seccomp profile files referenced from Pods should be placed in `/var/lib/kubelet/seccomp`.
See the [seccomp reference](/docs/reference/node/seccomp/) for details.

### AppArmor

The kubelet does not load or refer to AppArmor profiles by a Kubernetes-specific path.
AppArmor profiles are loaded via the node operating system rather then referenced by their path.

## Locking

{{< feature-state state="alpha" for_k8s_version="v1.2" >}}


A lock file for the kubelet; typically `/var/run/kubelet.lock`. The kubelet uses this to ensure
that two different kubelets don't try to run in conflict with each other.
You can configure the path to the lock file using the the `--lock-file` kubelet command line argument.

If two kubelets on the same node use a different value for the lock file path, they will not be able to
detect a conflict when both are running.


## {{% heading "whatsnext" %}}

- Learn about the kubelet [command line arguments](/docs/reference/command-line-tools-reference/kubelet/).
- Review the [Kubelet Configuration (v1beta1) reference](/docs/reference/config-api/kubelet-config.v1beta1/)
