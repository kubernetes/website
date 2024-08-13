---
reviewers:
- sig-cluster-lifecycle
title: Reconfiguring a kubeadm cluster
content_type: task
weight: 30
---

<!-- overview -->

kubeadm does not support automated ways of reconfiguring components that
were deployed on managed nodes. One way of automating this would be
by using a custom [operator](/docs/concepts/extend-kubernetes/operator/).

To modify the components configuration you must manually edit associated cluster
objects and files on disk.

This guide shows the correct sequence of steps that need to be performed
to achieve kubeadm cluster reconfiguration.

## {{% heading "prerequisites" %}}

- You need a cluster that was deployed using kubeadm
- Have administrator credentials (`/etc/kubernetes/admin.conf`) and network connectivity
to a running kube-apiserver in the cluster from a host that has kubectl installed
- Have a text editor installed on all hosts

<!-- steps -->

## Reconfiguring the cluster

kubeadm writes a set of cluster wide component configuration options in
ConfigMaps and other objects. These objects must be manually edited. The command `kubectl edit`
can be used for that.

The `kubectl edit` command will open a text editor where you can edit and save the object directly.

You can use the environment variables `KUBECONFIG` and `KUBE_EDITOR` to specify the location of
the kubectl consumed kubeconfig file and preferred text editor.

For example:
```
KUBECONFIG=/etc/kubernetes/admin.conf KUBE_EDITOR=nano kubectl edit <parameters>
```

{{< note >}}
Upon saving any changes to these cluster objects, components running on nodes may not be
automatically updated. The steps below instruct you on how to perform that manually.
{{< /note >}}

{{< warning >}}
Component configuration in ConfigMaps is stored as unstructured data (YAML string).
This means that validation will not be performed upon updating the contents of a ConfigMap.
You have to be careful to follow the documented API format for a particular
component configuration and avoid introducing typos and YAML indentation mistakes.
{{< /warning >}}

### Applying cluster configuration changes

#### Updating the `ClusterConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`ClusterConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4/)
in a ConfigMap called `kubeadm-config` in the `kube-system` namespace.

To change a particular option in the `ClusterConfiguration` you can edit the ConfigMap with this command:

```shell
kubectl edit cm -n kube-system kubeadm-config
```

The configuration is located under the `data.ClusterConfiguration` key.

{{< note >}}
The `ClusterConfiguration` includes a variety of options that affect the configuration of individual
components such as kube-apiserver, kube-scheduler, kube-controller-manager, CoreDNS, etcd and kube-proxy.
Changes to the configuration must be reflected on node components manually.
{{< /note >}}

#### Reflecting `ClusterConfiguration` changes on control plane nodes

kubeadm manages the control plane components as static Pod manifests located in
the directory `/etc/kubernetes/manifests`.
Any changes to the `ClusterConfiguration` under the `apiServer`, `controllerManager`, `scheduler` or `etcd`
keys must be reflected in the associated files in the manifests directory on a control plane node.

Such changes may include:
- `extraArgs` - requires updating the list of flags passed to a component container
- `extraVolumes` - requires updating the volume mounts for a component container
- `*SANs` - requires writing new certificates with updated Subject Alternative Names

Before proceeding with these changes, make sure you have backed up the directory `/etc/kubernetes/`.

To write new certificates you can use:
```shell
kubeadm init phase certs <component-name> --config <config-file>
```

To write new manifest files in `/etc/kubernetes/manifests` you can use:

```shell
# For Kubernetes control plane components
kubeadm init phase control-plane <component-name> --config <config-file>
# For local etcd
kubeadm init phase etcd local --config <config-file>
```

The `<config-file>` contents must match the updated `ClusterConfiguration`.
The `<component-name>` value must be a name of a Kubernetes control plane component (`apiserver`, `controller-manager` or `scheduler`).

{{< note >}}
Updating a file in `/etc/kubernetes/manifests` will tell the kubelet to restart the static Pod for the corresponding component.
Try doing these changes one node at a time to leave the cluster without downtime.
{{< /note >}}

### Applying kubelet configuration changes

#### Updating the `KubeletConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
in a ConfigMap called `kubelet-config` in the `kube-system` namespace.

You can edit the ConfigMap with this command:

```shell
kubectl edit cm -n kube-system kubelet-config
```

The configuration is located under the `data.kubelet` key.

#### Reflecting the kubelet changes

To reflect the change on kubeadm nodes you must do the following:
- Log in to a kubeadm node
- Run `kubeadm upgrade node phase kubelet-config` to download the latest `kubelet-config`
ConfigMap contents into the local file `/var/lib/kubelet/config.yaml`
- Edit the file `/var/lib/kubelet/kubeadm-flags.env` to apply additional configuration with
flags
- Restart the kubelet service with `systemctl restart kubelet`

{{< note >}}
Do these changes one node at a time to allow workloads to be rescheduled properly.
{{< /note >}}

{{< note >}}
During `kubeadm upgrade`, kubeadm downloads the `KubeletConfiguration` from the
`kubelet-config` ConfigMap and overwrite the contents of `/var/lib/kubelet/config.yaml`.
This means that node local configuration must be applied either by flags in
`/var/lib/kubelet/kubeadm-flags.env` or by manually updating the contents of
`/var/lib/kubelet/config.yaml` after `kubeadm upgrade`, and then restarting the kubelet.
{{< /note >}}

### Applying kube-proxy configuration changes

#### Updating the `KubeProxyConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`KubeProxyConfiguration`](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
in a ConfigMap in the `kube-system` namespace called `kube-proxy`.

This ConfigMap is used by the `kube-proxy` DaemonSet in the `kube-system` namespace.

To change a particular option in the `KubeProxyConfiguration`, you can edit the ConfigMap with this command:

```shell
kubectl edit cm -n kube-system kube-proxy
```

The configuration is located under the `data.config.conf` key.

#### Reflecting the kube-proxy changes

Once the `kube-proxy` ConfigMap is updated, you can restart all kube-proxy Pods:

Obtain the Pod names:

```shell
kubectl get po -n kube-system | grep kube-proxy
```

Delete a Pod with:

```shell
kubectl delete po -n kube-system <pod-name>
```

New Pods that use the updated ConfigMap will be created.

{{< note >}}
Because kubeadm deploys kube-proxy as a DaemonSet, node specific configuration is unsupported.
{{< /note >}}

### Applying CoreDNS configuration changes

#### Updating the CoreDNS Deployment and Service

kubeadm deploys CoreDNS as a Deployment called `coredns` and with a Service `kube-dns`,
both in the `kube-system` namespace.

To update any of the CoreDNS settings, you can edit the Deployment and
Service objects:

```shell
kubectl edit deployment -n kube-system coredns
kubectl edit service -n kube-system kube-dns
```

#### Reflecting the CoreDNS changes

Once the CoreDNS changes are applied you can delete the CoreDNS Pods:

Obtain the Pod names:

```shell
kubectl get po -n kube-system | grep coredns
```

Delete a Pod with:

```shell
kubectl delete po -n kube-system <pod-name>
```

New Pods with the updated CoreDNS configuration will be created.

{{< note >}}
kubeadm does not allow CoreDNS configuration during cluster creation and upgrade.
This means that if you execute `kubeadm upgrade apply`, your changes to the CoreDNS
objects will be lost and must be reapplied.
{{< /note >}}

## Persisting the reconfiguration

During the execution of `kubeadm upgrade` on a managed node, kubeadm might overwrite configuration
that was applied after the cluster was created (reconfiguration).

### Persisting Node object reconfiguration

kubeadm writes Labels, Taints, CRI socket and other information on the Node object for a particular
Kubernetes node. To change any of the contents of this Node object you can use:

```shell
kubectl edit no <node-name>
```

During `kubeadm upgrade` the contents of such a Node might get overwritten.
If you would like to persist your modifications to the Node object after upgrade,
you can prepare a [kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
and apply it to the Node object:

```shell
kubectl patch no <node-name> --patch-file <patch-file>
```

#### Persisting control plane component reconfiguration

The main source of control plane configuration is the `ClusterConfiguration`
object stored in the cluster. To extend the static Pod manifests configuration,
[patches](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches) can be used.

These patch files must remain as files on the control plane nodes to ensure that
they can be used by the `kubeadm upgrade ... --patches <directory>`.

If reconfiguration is done to the `ClusterConfiguration` and static Pod manifests on disk,
the set of node specific patches must be updated accordingly.

#### Persisting kubelet reconfiguration

Any changes to the `KubeletConfiguration` stored in `/var/lib/kubelet/config.yaml` will be overwritten on
`kubeadm upgrade` by downloading the contents of the cluster wide `kubelet-config` ConfigMap.
To persist kubelet node specific configuration either the file `/var/lib/kubelet/config.yaml`
has to be updated manually post-upgrade or the file `/var/lib/kubelet/kubeadm-flags.env` can include flags.
The kubelet flags override the associated `KubeletConfiguration` options, but note that
some of the flags are deprecated.

A kubelet restart will be required after changing `/var/lib/kubelet/config.yaml` or
`/var/lib/kubelet/kubeadm-flags.env`.

## {{% heading "whatsnext" %}}

- [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [Certificate management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)
- [Find more about kubeadm set-up](/docs/reference/setup-tools/kubeadm/)
