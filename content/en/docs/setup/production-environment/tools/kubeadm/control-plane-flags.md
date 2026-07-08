---
reviewers:
- sig-cluster-lifecycle
title: Customizing components with the kubeadm API
content_type: concept
weight: 40
---

<!-- overview -->

This page covers how to customize the components that kubeadm deploys. For control plane components
you can use flags in the `ClusterConfiguration` structure or patches per-node. For the kubelet
and kube-proxy you can use `KubeletConfiguration` and `KubeProxyConfiguration`, accordingly.

All of these options are possible via the kubeadm configuration API.
For more details on each field in the configuration you can navigate to our
[API reference pages](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
{{< /note >}}

<!-- body -->

## Customizing the control plane with flags in `ClusterConfiguration`

The kubeadm `ClusterConfiguration` object exposes a way for users to override the default
flags passed to control plane components such as the APIServer, ControllerManager, Scheduler and Etcd.
The components are defined using the following structures:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

These structures contain a common `extraArgs` field, that consists of `name` / `value` pairs.
To override a flag for a control plane component:

1.  Add the appropriate `extraArgs` to your configuration.
2.  Add flags to the `extraArgs` field.
3.  Run `kubeadm init` with `--config <YOUR CONFIG YAML>`.

{{< note >}}
You can generate a `ClusterConfiguration` object with default values by running `kubeadm config print init-defaults`
and saving the output to a file of your choice.
{{< /note >}}

{{< note >}}
The `ClusterConfiguration` object is currently global in kubeadm clusters. This means that any flags that you add,
will apply to all instances of the same component on different nodes. To apply individual configuration per component
on different nodes you can use [patches](#patches).
{{< /note >}}

{{< note >}}
Duplicate flags (keys), or passing the same flag `--foo` multiple times, is currently not supported.
To workaround that you must use [patches](#patches).
{{< /note >}}

### APIServer flags

For details, see the [reference documentation for kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Example usage:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

### ControllerManager flags

For details, see the [reference documentation for kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Example usage:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

### Scheduler flags

For details, see the [reference documentation for kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Example usage:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### Etcd flags

For details, see the [etcd server documentation](https://etcd.io/docs/).

Example usage:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## Customizing with patches {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm allows you to pass a directory with patch files to `InitConfiguration`,
`JoinConfiguration` and `UpgradeConfiguration`.
on individual nodes. These patches can be used as the last customization step before component configuration
is written to disk.

You can pass this file to `kubeadm init` with `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
For `kubeadm init` you can pass a file containing both a `ClusterConfiguration` and `InitConfiguration`
separated by `---`.
{{< /note >}}

You can pass this file to `kubeadm join` with `--config <YOUR CONFIG YAML>`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

If you are using `kubeadm upgrade apply` and `kubeadm upgrade node` to upgrade your kubeadm
nodes, you must again provide the same patches, so that the customization is preserved after upgrade.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  patches:
    directory: /home/user/somedir
```

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
node:
  patches:
    directory: /home/user/somedir
```

The directory must contain files named `target[suffix][+patchtype].extension`.
For example, `kube-apiserver0+merge.yaml` or just `etcd.json`.

- `target` can be one of `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`,
`kubeletconfiguration` and `corednsdeployment`.
- `suffix` is an optional string that can be used to determine which patches are applied first
alpha-numerically.
- `patchtype` can be one of `strategic`, `merge` or `json` and these must match the patching formats
[supported by kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch).
The default `patchtype` is `strategic`.
- `extension` must be either `json` or `yaml`.

## Customizing the kubelet {#kubelet}

To customize the kubelet you can add a [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
next to the `ClusterConfiguration` or `InitConfiguration` separated by `---` within the same configuration file.
This file can then be passed to `kubeadm init` and kubeadm will apply the same base `KubeletConfiguration`
to all nodes in the cluster.

For applying instance-specific configuration over the base `KubeletConfiguration` you can use the
[`kubeletconfiguration` patch target](#patches).

Alternatively, you can use kubelet flags as overrides by passing them in the
`nodeRegistration.kubeletExtraArgs` field supported by both `InitConfiguration` and `JoinConfiguration`.
Some kubelet flags are deprecated, so check their status in the
[kubelet reference documentation](/docs/reference/command-line-tools-reference/kubelet) before using them.

For additional details see [Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

## Customizing kube-proxy

To customize kube-proxy you can pass a `KubeProxyConfiguration` next your `ClusterConfiguration` or
`InitConfiguration` to `kubeadm init` separated by `---`.

For more details you can navigate to our [API reference pages](/docs/reference/config-api/kubeadm-config.v1beta4/).

{{< note >}}
kubeadm deploys kube-proxy as a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, which means
that the `KubeProxyConfiguration` would apply to all instances of kube-proxy in the cluster.
{{< /note >}}

## Customizing CoreDNS

kubeadm allows you to customize the CoreDNS Deployment with patches against the
[`corednsdeployment` patch target](#patches).

Patches for other CoreDNS related API objects like the `kube-system/coredns`
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} are currently not supported.
You must manually patch any of these objects using kubectl and recreate the CoreDNS
{{< glossary_tooltip text="Pods" term_id="pod" >}} after that.

Alternatively, you can disable the kubeadm CoreDNS deployment by including the following
option in your `ClusterConfiguration`:

```yaml
dns:
  disabled: true
```

Also, by executing the following command:

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml`
```

you can obtain the manifest file kubeadm would create for CoreDNS on your setup.
