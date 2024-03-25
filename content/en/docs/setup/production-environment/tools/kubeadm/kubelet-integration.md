---
reviewers:
- sig-cluster-lifecycle
title: Configuring each kubelet in your cluster using kubeadm
content_type: concept
weight: 80
---

<!-- overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

The lifecycle of the kubeadm CLI tool is decoupled from the
[kubelet](/docs/reference/command-line-tools-reference/kubelet), which is a daemon that runs
on each node within the Kubernetes cluster. The kubeadm CLI tool is executed by the user when Kubernetes is
initialized or upgraded, whereas the kubelet is always running in the background.

Since the kubelet is a daemon, it needs to be maintained by some kind of an init
system or service manager. When the kubelet is installed using DEBs or RPMs,
systemd is configured to manage the kubelet. You can use a different service
manager instead, but you need to configure it manually.

Some kubelet configuration details need to be the same across all kubelets involved in the cluster, while
other configuration aspects need to be set on a per-kubelet basis to accommodate the different
characteristics of a given machine (such as OS, storage, and networking). You can manage the configuration
of your kubelets manually, but kubeadm now provides a `KubeletConfiguration` API type for
[managing your kubelet configurations centrally](#configure-kubelets-using-kubeadm).

<!-- body -->

## Kubelet configuration patterns

The following sections describe patterns to kubelet configuration that are simplified by
using kubeadm, rather than managing the kubelet configuration for each Node manually.

### Propagating cluster-level configuration to each kubelet

You can provide the kubelet with default values to be used by `kubeadm init` and `kubeadm join`
commands. Interesting examples include using a different container runtime or setting the default subnet
used by services.

If you want your services to use the subnet `10.96.0.0/12` as the default for services, you can pass
the `--service-cidr` parameter to kubeadm:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Virtual IPs for services are now allocated from this subnet. You also need to set the DNS address used
by the kubelet, using the `--cluster-dns` flag. This setting needs to be the same for every kubelet
on every manager and Node in the cluster. The kubelet provides a versioned, structured API object
that can configure most parameters in the kubelet and push out this configuration to each running
kubelet in the cluster. This object is called
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).
The `KubeletConfiguration` allows the user to specify flags such as the cluster DNS IP addresses expressed as
a list of values to a camelCased key, illustrated by the following example:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

For more details on the `KubeletConfiguration` have a look at [this section](#configure-kubelets-using-kubeadm).

### Providing instance-specific configuration details

Some hosts require specific kubelet configurations due to differences in hardware, operating system,
networking, or other host-specific parameters. The following list provides a few examples.

- The path to the DNS resolution file, as specified by the `--resolv-conf` kubelet
  configuration flag, may differ among operating systems, or depending on whether you are using
  `systemd-resolved`. If this path is wrong, DNS resolution will fail on the Node whose kubelet
  is configured incorrectly.

- The Node API object `.metadata.name` is set to the machine's hostname by default,
  unless you are using a cloud provider. You can use the `--hostname-override` flag to override the
  default behavior if you need to specify a Node name different from the machine's hostname.

- Currently, the kubelet cannot automatically detect the cgroup driver used by the container runtime,
  but the value of `--cgroup-driver` must match the cgroup driver used by the container runtime to ensure
  the health of the kubelet.

- To specify the container runtime you must set its endpoint with the
`--container-runtime-endpoint=<path>` flag.

The recommended way of applying such instance-specific configuration is by using
[`KubeletConfiguration` patches](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches).

## Configure kubelets using kubeadm

It is possible to configure the kubelet that kubeadm will start if a custom
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
API object is passed with a configuration file like so `kubeadm ... --config some-config-file.yaml`.

By calling `kubeadm config print init-defaults --component-configs KubeletConfiguration` you can
see all the default values for this structure.

It is also possible to apply instance-specific patches over the base `KubeletConfiguration`.
Have a look at [Customizing the kubelet](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet)
for more details.

### Workflow when using `kubeadm init`

When you call `kubeadm init`, the kubelet configuration is marshalled to disk
at `/var/lib/kubelet/config.yaml`, and also uploaded to a `kubelet-config` ConfigMap in the `kube-system`
namespace of the cluster. A kubelet configuration file is also written to `/etc/kubernetes/kubelet.conf`
with the baseline cluster-wide configuration for all kubelets in the cluster. This configuration file
points to the client certificates that allow the kubelet to communicate with the API server. This
addresses the need to
[propagate cluster-level configuration to each kubelet](#propagating-cluster-level-configuration-to-each-kubelet).

To address the second pattern of
[providing instance-specific configuration details](#providing-instance-specific-configuration-details),
kubeadm writes an environment file to `/var/lib/kubelet/kubeadm-flags.env`, which contains a list of
flags to pass to the kubelet when it starts. The flags are presented in the file like this:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

In addition to the flags used when starting the kubelet, the file also contains dynamic
parameters such as the cgroup driver and whether to use a different container runtime socket
(`--cri-socket`).

After marshalling these two files to disk, kubeadm attempts to run the following two
commands, if you are using systemd:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

If the reload and restart are successful, the normal `kubeadm init` workflow continues.

### Workflow when using `kubeadm join`

When you run `kubeadm join`, kubeadm uses the Bootstrap Token credential to perform
a TLS bootstrap, which fetches the credential needed to download the
`kubelet-config` ConfigMap and writes it to `/var/lib/kubelet/config.yaml`. The dynamic
environment file is generated in exactly the same way as `kubeadm init`.

Next, `kubeadm` runs the following two commands to load the new configuration into the kubelet:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

After the kubelet loads the new configuration, kubeadm writes the
`/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig file, which contains a CA certificate and Bootstrap
Token. These are used by the kubelet to perform the TLS Bootstrap and obtain a unique
credential, which is stored in `/etc/kubernetes/kubelet.conf`.

When the `/etc/kubernetes/kubelet.conf` file is written, the kubelet has finished performing the TLS Bootstrap.
Kubeadm deletes the `/etc/kubernetes/bootstrap-kubelet.conf` file after completing the TLS Bootstrap.

##  The kubelet drop-in file for systemd

`kubeadm` ships with configuration for how systemd should run the kubelet.
Note that the kubeadm CLI command never touches this drop-in file.

This configuration file installed by the `kubeadm`
[package](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf) is written to
`/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` and is used by systemd.
It augments the basic
[`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service).

If you want to override that further, you can make a directory `/etc/systemd/system/kubelet.service.d/`
(not `/usr/lib/systemd/system/kubelet.service.d/`) and put your own customizations into a file there.
For example, you might add a new local file `/etc/systemd/system/kubelet.service.d/local-overrides.conf`
to override the unit settings configured by `kubeadm`.

Here is what you are likely to find in `/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf`:

{{< note >}}
The contents below are just an example. If you don't want to use a package manager
follow the guide outlined in the ([Without a package manager](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2))
section.
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
# the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

This file specifies the default locations for all of the files managed by kubeadm for the kubelet.

- The KubeConfig file to use for the TLS Bootstrap is `/etc/kubernetes/bootstrap-kubelet.conf`,
  but it is only used if `/etc/kubernetes/kubelet.conf` does not exist.
- The KubeConfig file with the unique kubelet identity is `/etc/kubernetes/kubelet.conf`.
- The file containing the kubelet's ComponentConfig is `/var/lib/kubelet/config.yaml`.
- The dynamic environment file that contains `KUBELET_KUBEADM_ARGS` is sourced from `/var/lib/kubelet/kubeadm-flags.env`.
- The file that can contain user-specified flag overrides with `KUBELET_EXTRA_ARGS` is sourced from
  `/etc/default/kubelet` (for DEBs), or `/etc/sysconfig/kubelet` (for RPMs). `KUBELET_EXTRA_ARGS`
  is last in the flag chain and has the highest priority in the event of conflicting settings.

## Kubernetes binaries and package contents

The DEB and RPM packages shipped with the Kubernetes releases are:

| Package name | Description |
|--------------|-------------|
| `kubeadm`    | Installs the `/usr/bin/kubeadm` CLI tool and the [kubelet drop-in file](#the-kubelet-drop-in-file-for-systemd) for the kubelet. |
| `kubelet`    | Installs the `/usr/bin/kubelet` binary. |
| `kubectl`    | Installs the `/usr/bin/kubectl` binary. |
| `cri-tools` | Installs the `/usr/bin/crictl` binary from the [cri-tools git repository](https://github.com/kubernetes-sigs/cri-tools). |
| `kubernetes-cni` | Installs the `/opt/cni/bin` binaries from the [plugins git repository](https://github.com/containernetworking/plugins). |
