---
reviewers:
- sig-cluster-lifecycle
title: Configuring each kubelet in your cluster using kubeadm
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

The kubeadm CLI tool has a lifecycle that is decoupled from the lifecycle
of the kubelet daemon - the [Kubernetes Node Agent](/docs/reference/command-line-tools-reference/kubelet).
The kubeadm CLI tool is executed by the user at initialization or upgrade time, while the kubelet is always
running on any given master or Node that is running Kubernetes.

Given the kubelet is a daemon, it needs to be maintained by some kind of a init system or process manager.
In the deb and rpm packages that are shipped with Kubernetes releases, the kubelet is by default maintained
as a systemd service. Please note that _any type_ of init system or process manager can be used for running the kubelet.

The default kubeadm deb/rpm packages ship a systemd drop-in file for the kubelet populated with
some CLI flags so that the kubelet is functional.

{{% /capture %}}

{{% capture body %}}

## Problem 1: Cluster-level information propagated to the kubelets

There is a need for different configuration values to be propagated to the kubelet from the
`kubeadm init` and/or `kubeadm join` commands. Common scenarios include customizing the Service
Subnet and using a different CRI runtime.

Let's say that you have a default service subnet defined as `10.96.0.0/12` and you pass this parameter to kubeadm:
```bash
kubeadm init --service-cidr 10.96.0.0/12
```

In this example, the modified value is the subnet used for allocating the Service Virtual IPs.
This means that the `--cluster-dns` kubelet flag also has to be set, to `10.96.0.10` following this example.
This has to happen **for every kubelet in the cluster** and it imposes a need for some sort of a way to propagate
global cluster-specific configuration to the Nodes (kubelets) in the cluster.

Luckily, the kubelet has a versioned, structured API object that can be used for configuring most of the
parameters in the kubelet. This object is called **the kubelet's ComponentConfig**. The API reference for the
kubelet ComponentConfig can be found [here](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/kubeletconfig#KubeletConfiguration).
The ComponentConfig allows the user to specify flags such as the cluster DNS IP with the following configuration format:
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

## Problem 2: There should be a way to apply instance-specific configuration

There are cases where each kubelet has to be configured individually, due to heterogeneous operating systems,
machine types, and surrounding environments. Here are some examples of instance-specific flags that need to be dynamically
set depending on the environment:
- The value of `--resolv-conf` can vary depending on what OS is running on a particular Node. If you are using
`systemd-resolved` the path should be `/run/systemd/resolve/resolv.conf`, otherwise it can be `/etc/resolv.conf`.
If this path is wrong, DNS resolution might not work on your Node.

- By default, the kubelet uses the hostname of the machine as the Node API object `.metadata.name` and unless
a cloud provider is used. You can specify a value for `--hostname-override` in a case where the Node name should differ
from the machine hostname.

- Currently there is no good way to detect the cgroup driver being used either by docker or any other CRI runtime.
However, matching the kubelet flag `--cgroup-driver` with what the container runtime is using is vital to the health
of the kubelet.

- Different kubelet parameters need to be passed depending on what CRI runtime is used. In the case of docker,
you need to specify flags like `--network-plugin=cni` for it to work, but if you are using some external runtime
you should set `--container-runtime=remote` and specify the CRI endpoint with `--container-runtime-endpoint=<path>`.

## kubeadm's solution (available since v1.11)

In kubeadm v1.11, the kubeadm config API type `MasterConfiguration` embeds the kubelet's ComponentConfig under
the `.kubeletConfiguration.baseConfig` key. This makes it possible for any user writing a `MasterConfiguration`
file to also set all kubelets' base-level configuration.

When `kubeadm init` is called, the `.kubeletConfiguration.baseConfig`  structure is marshalled to disk, to the
following path - `/var/lib/kubelet/config.yaml`. This marshalled content is also uploaded to a ConfigMap in the cluster
named `kubelet-config-1.X`, where `X` is the minor version of the Kubernetes version initialized. `kubeadm init` also
generates the `/etc/kubernetes/kubelet.conf` KubeConfig file with credentials (client certificates) so that the kubelet
can talk to the API server.

In order to address _Problem 2_, `kubeadm init` writes an environment file looking like this, in the path
`/var/lib/kubelet/kubeadm-flags.env`:
```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

kubeadm also writes to the file dynamic parameters like what cgroup driver that is used, or whether a non-docker
`--cri-socket` is used. Then kubeadm attempts a `systemctl daemon-reload && systemctl restart kubelet` in order
to make the kubelet pick up the latest dynamic flags which were previously written. After that the rest of the regular
`kubeadm init` workflow continues.

On the other hand, `kubeadm join` uses the Bootstrap Token credential to download the `kubelet-config-1.X` ConfigMap
and write it to `/var/lib/kubelet/config.yaml`.

The dynamic environment file is generated in exactly the same way as `kubeadm init`.

After these files are written, `kubeadm` attempts a `systemctl daemon-reload && systemctl restart kubelet` in order
to make the kubelet pick up the latest dynamic flags written.

Then `kubeadm join` performs the discovery, which yields the `/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig
file consisting of a CA certificate and Bootstrap Token.

At that point the Bootstrap Token is used by the kubelet to perform the TLS Bootstrap and to get the unique credential which
is stored in `/etc/kubernetes/kubelet.conf`. As of kubeadm v1.11, `kubeadm join` waits for the `/etc/kubernetes/kubelet.conf`
file to appear on disk, which means that the kubelet has performed the TLS Bootstrap.

##  The kubelet drop-in file that kubeadm uses
Here are the contents of the the drop-in file the kubeadm _deb/rpm package_ ships for the kubelet. It is installed in
the path `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`.

```
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf
--kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generates at runtime, populating
the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
#the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Notes:

- The KubeConfig file to use for the TLS Bootstrap is specified as `/etc/kubernetes/bootstrap-kubelet.conf`,
but it is not used if `/etc/kubernetes/kubelet.conf` already exists.
- The KubeConfig file with the unique kubelet identity is `/etc/kubernetes/kubelet.conf`.
- The file containing the kubelet's ComponentConfig is `/var/lib/kubelet/config.yaml`.
- The dynamic environment file that contains `KUBELET_KUBEADM_ARGS` is sourced from `/var/lib/kubelet/kubeadm-flags.env`.
- The file that can contain user specified flag overrides with `KUBELET_EXTRA_ARGS` is sourced from `/etc/default/kubelet`
(for debs), or `/etc/systconfig/kubelet` (for rpms). Note that `KUBELET_EXTRA_ARGS` is last in the flag chain,
therefore it has the highest priority.

## Kubernetes binaries and package contents

The deb/rpm packages shipped with the Kubernetes releases are the following:

- `kubeadm` - ships the `/usr/bin/kubeadm` CLI tool and the systemd drop-in for the kubelet described above
(in `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`).
- `kubelet` - ships the `/usr/bin/kubelet` binary.
- `kubectl` - ships the `/usr/bin/kubectl` binary.
- `kubernetes-cni` - ships the official CNI binaries under the `/opt/cni/bin` directory.
- `cri-tools` - ships the `/usr/bin/crictl` binary from https://github.com/kubernetes-incubator/cri-tools

{{% /capture %}}
