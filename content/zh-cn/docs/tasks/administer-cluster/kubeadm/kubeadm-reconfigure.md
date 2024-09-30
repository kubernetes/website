---
title: 重新配置 kubeadm 集群
content_type: task
weight: 30
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Reconfiguring a kubeadm cluster
content_type: task
weight: 30
-->

<!-- overview -->
<!--
kubeadm does not support automated ways of reconfiguring components that
were deployed on managed nodes. One way of automating this would be
by using a custom [operator](/docs/concepts/extend-kubernetes/operator/).
-->
kubeadm 不支持自动重新配置部署在托管节点上的组件的方式。 
一种自动化的方法是使用自定义的 
[operator](/zh-cn/docs/concepts/extend-kubernetes/operator/)。

<!--
To modify the components configuration you must manually edit associated cluster
objects and files on disk.

This guide shows the correct sequence of steps that need to be performed
to achieve kubeadm cluster reconfiguration.
-->
要修改组件配置，你必须手动编辑磁盘上关联的集群对象和文件。
本指南展示了实现 kubeadm 集群重新配置所需执行的正确步骤顺序。

## {{% heading "prerequisites" %}}

<!--
- You need a cluster that was deployed using kubeadm
- Have administrator credentials (`/etc/kubernetes/admin.conf`) and network connectivity
to a running kube-apiserver in the cluster from a host that has kubectl installed
- Have a text editor installed on all hosts
-->
- 你需要一个使用 kubeadm 部署的集群
- 拥有管理员凭据（`/etc/kubernetes/admin.conf`）
  和从安装了 kubectl 的主机到集群中正在运行的 kube-apiserver 的网络连接
- 在所有主机上安装文本编辑器

<!-- steps -->

<!--
## Reconfiguring the cluster
kubeadm writes a set of cluster wide component configuration options in
ConfigMaps and other objects. These objects must be manually edited. The command `kubectl edit`
can be used for that.
-->
## 重新配置集群

kubeadm 在 ConfigMap 和其他对象中写入了一组集群范围的组件配置选项。 
这些对象必须手动编辑，可以使用命令 `kubectl edit`。

<!--
The `kubectl edit` command will open a text editor where you can edit and save the object directly.

You can use the environment variables `KUBECONFIG` and `KUBE_EDITOR` to specify the location of
the kubectl consumed kubeconfig file and preferred text editor.

For example:
-->
`kubectl edit` 命令将打开一个文本编辑器，你可以在其中直接编辑和保存对象。
你可以使用环境变量 `KUBECONFIG` 和 `KUBE_EDITOR` 来指定 kubectl
使用的 kubeconfig 文件和首选文本编辑器的位置。

例如：
```
KUBECONFIG=/etc/kubernetes/admin.conf KUBE_EDITOR=nano kubectl edit <parameters>
```

{{< note >}}
<!--
Upon saving any changes to these cluster objects, components running on nodes may not be
automatically updated. The steps below instruct you on how to perform that manually.
-->
保存对这些集群对象的任何更改后，节点上运行的组件可能不会自动更新。 
以下步骤将指导你如何手动执行该操作。
{{< /note >}}

{{< warning >}}
<!--
Component configuration in ConfigMaps is stored as unstructured data (YAML string).
This means that validation will not be performed upon updating the contents of a ConfigMap.
You have to be careful to follow the documented API format for a particular
component configuration and avoid introducing typos and YAML indentation mistakes.
-->

ConfigMaps 中的组件配置存储为非结构化数据（YAML 字符串）。 这意味着在更新
ConfigMap 的内容时不会执行验证。 你必须小心遵循特定组件配置的文档化 API 格式， 
并避免引入拼写错误和 YAML 缩进错误。
{{< /warning >}}

<!--
### Applying cluster configuration changes

#### Updating the `ClusterConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`ClusterConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta4/)
in a ConfigMap called `kubeadm-config` in the `kube-system` namespace.

To change a particular option in the `ClusterConfiguration` you can edit the ConfigMap with this command:

-->
### 应用集群配置更改

#### 更新 `ClusterConfiguration`

在集群创建和升级期间，kubeadm 将其
[`ClusterConfiguration`](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)
写入 `kube-system` 命名空间中名为 `kubeadm-config` 的 ConfigMap。

要更改 `ClusterConfiguration` 中的特定选项，你可以使用以下命令编辑 ConfigMap：

```shell
kubectl edit cm -n kube-system kubeadm-config
```

<!--
The configuration is located under the `data.ClusterConfiguration` key.
-->
配置位于 `data.ClusterConfiguration` 键下。

{{< note >}}
<!--
The `ClusterConfiguration` includes a variety of options that affect the configuration of individual
components such as kube-apiserver, kube-scheduler, kube-controller-manager, CoreDNS, etcd and kube-proxy.
Changes to the configuration must be reflected on node components manually.
-->
`ClusterConfiguration` 包括各种影响单个组件配置的选项， 例如
kube-apiserver、kube-scheduler、kube-controller-manager、
CoreDNS、etcd 和 kube-proxy。 对配置的更改必须手动反映在节点组件上。
{{< /note >}}

<!--
#### Reflecting `ClusterConfiguration` changes on control plane nodes

kubeadm manages the control plane components as static Pod manifests located in
the directory `/etc/kubernetes/manifests`.
Any changes to the `ClusterConfiguration` under the `apiServer`, `controllerManager`, `scheduler` or `etcd`
keys must be reflected in the associated files in the manifests directory on a control plane node.
-->
#### 在控制平面节点上反映 `ClusterConfiguration` 更改

kubeadm 将控制平面组件作为位于 `/etc/kubernetes/manifests`
目录中的静态 Pod 清单进行管理。
对 `apiServer`、`controllerManager`、`scheduler` 或 `etcd`键下的
`ClusterConfiguration` 的任何更改都必须反映在控制平面节点上清单目录中的关联文件中。

<!--
Such changes may include:
- `extraArgs` - requires updating the list of flags passed to a component container
- `extraVolumes` - requires updating the volume mounts for a component container
- `*SANs` - requires writing new certificates with updated Subject Alternative Names

Before proceeding with these changes, make sure you have backed up the directory `/etc/kubernetes/`.
-->

此类更改可能包括:
- `extraArgs` - 需要更新传递给组件容器的标志列表
- `extraVolumes` - 需要更新组件容器的卷挂载
- `*SANs` - 需要使用更新的主题备用名称编写新证书

在继续进行这些更改之前，请确保你已备份目录 `/etc/kubernetes/`。

<!--
To write new certificates you can use:

-->

要编写新证书，你可以使用：

```shell
kubeadm init phase certs <component-name> --config <config-file>
```

<!--
To write new manifest files in `/etc/kubernetes/manifests` you can use:
-->
要在 `/etc/kubernetes/manifests` 中编写新的清单文件，你可以使用以下命令：

<!--
# For Kubernetes control plane components
# For local etcd
-->
```shell
# Kubernetes 控制平面组件
kubeadm init phase control-plane <component-name> --config <config-file>
# 本地 etcd
kubeadm init phase etcd local --config <config-file>
```

<!--
The `<config-file>` contents must match the updated `ClusterConfiguration`.
The `<component-name>` value must be a name of a Kubernetes control plane component (`apiserver`, `controller-manager` or `scheduler`).
-->
`<config-file>` 内容必须与更新后的 `ClusterConfiguration` 匹配。
`<component-name>` 值必须是一个控制平面组件（`apiserver`、`controller-manager` 或 `scheduler`）的名称。

{{< note >}}
<!--
Updating a file in `/etc/kubernetes/manifests` will tell the kubelet to restart the static Pod for the corresponding component.
Try doing these changes one node at a time to leave the cluster without downtime.
-->
更新 `/etc/kubernetes/manifests` 中的文件将告诉 kubelet 重新启动相应组件的静态 Pod。
尝试一次对一个节点进行这些更改，以在不停机的情况下离开集群。
{{< /note >}}

<!--
### Applying kubelet configuration changes

#### Updating the `KubeletConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
in a ConfigMap called `kubelet-config` in the `kube-system` namespace.

You can edit the ConfigMap with this command:

-->
### 应用 kubelet 配置更改

#### 更新 `KubeletConfiguration`

在集群创建和升级期间，kubeadm 将其 
[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 
写入 `kube-system` 命名空间中名为 `kubelet-config` 的 ConfigMap。
你可以使用以下命令编辑 ConfigMap：

```shell
kubectl edit cm -n kube-system kubelet-config
```

<!--
The configuration is located under the `data.kubelet` key.
-->
配置位于 `data.kubelet` 键下。

<!--
#### Reflecting the kubelet changes

To reflect the change on kubeadm nodes you must do the following:
- Log in to a kubeadm node
- Run `kubeadm upgrade node phase kubelet-config` to download the latest `kubelet-config`
ConfigMap contents into the local file `/var/lib/kubelet/config.yaml`
- Edit the file `/var/lib/kubelet/kubeadm-flags.env` to apply additional configuration with
flags
- Restart the kubelet service with `systemctl restart kubelet`
-->
#### 反映 kubelet 的更改

要反映 kubeadm 节点上的更改，你必须执行以下操作：

- 登录到 kubeadm 节点
- 运行 `kubeadm upgrade node phase kubelet-config` 下载最新的
  `kubelet-config` ConfigMap 内容到本地文件 `/var/lib/kubelet/config.yaml`
- 编辑文件 `/var/lib/kubelet/kubeadm-flags.env` 以使用标志来应用额外的配置
- 使用 `systemctl restart kubelet` 重启 kubelet 服务

{{< note >}}
<!--
Do these changes one node at a time to allow workloads to be rescheduled properly.
-->
一次执行一个节点的这些更改，以允许正确地重新安排工作负载。
{{< /note >}}

{{< note >}}
<!--
During `kubeadm upgrade`, kubeadm downloads the `KubeletConfiguration` from the
`kubelet-config` ConfigMap and overwrite the contents of `/var/lib/kubelet/config.yaml`.
This means that node local configuration must be applied either by flags in
`/var/lib/kubelet/kubeadm-flags.env` or by manually updating the contents of
`/var/lib/kubelet/config.yaml` after `kubeadm upgrade`, and then restarting the kubelet.
-->
在 `kubeadm upgrade` 期间，kubeadm 从 `kubelet-config` ConfigMap
下载 `KubeletConfiguration` 并覆盖 `/var/lib/kubelet/config.yaml` 的内容。
这意味着节点本地配置必须通过`/var/lib/kubelet/kubeadm-flags.env`中的标志或在
kubeadm upgrade` 后手动更新 `/var/lib/kubelet/config.yaml` 的内容来应用，
然后重新启动 kubelet。
{{< /note >}}

<!--
### Applying kube-proxy configuration changes

#### Updating the `KubeProxyConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`KubeProxyConfiguration`](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
in a ConfigMap in the `kube-system` namespace called `kube-proxy`.

This ConfigMap is used by the `kube-proxy` DaemonSet in the `kube-system` namespace.

To change a particular option in the `KubeProxyConfiguration`, you can edit the ConfigMap with this command:

-->
### 应用 kube-proxy 配置更改

#### 更新 `KubeProxyConfiguration`

在集群创建和升级期间，kubeadm 将其写入
[`KubeProxyConfiguration`](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/) 
在名为 `kube-proxy` 的 `kube-system` 命名空间中的 ConfigMap 中。

此 ConfigMap 由 `kube-system` 命名空间中的 `kube-proxy` DaemonSet 使用。

要更改 `KubeProxyConfiguration` 中的特定选项，你可以使用以下命令编辑 ConfigMap：

```shell
kubectl edit cm -n kube-system kube-proxy
```

<!--
The configuration is located under the `data.config.conf` key.
-->
配置位于 `data.config.conf` 键下。

<!--
#### Reflecting the kube-proxy changes

Once the `kube-proxy` ConfigMap is updated, you can restart all kube-proxy Pods:

Obtain the Pod names:

-->
#### 反映 kube-proxy 的更改

更新 `kube-proxy` ConfigMap 后，你可以重新启动所有 kube-proxy Pod：

获取 Pod 名称：

```shell
kubectl get po -n kube-system | grep kube-proxy
```

<!--
Delete a Pod with:
-->
使用以下命令删除 Pod：

```shell
kubectl delete po -n kube-system <pod-name>
```

<!--
New Pods that use the updated ConfigMap will be created.
-->
将创建使用更新的 ConfigMap 的新 Pod。

{{< note >}}
<!--
Because kubeadm deploys kube-proxy as a DaemonSet, node specific configuration is unsupported.
-->
由于 kubeadm 将 kube-proxy 部署为 DaemonSet，因此不支持特定于节点的配置。
{{< /note >}}

<!--
### Applying CoreDNS configuration changes

#### Updating the CoreDNS Deployment and Service

kubeadm deploys CoreDNS as a Deployment called `coredns` and with a Service `kube-dns`,
both in the `kube-system` namespace.

To update any of the CoreDNS settings, you can edit the Deployment and
Service objects:
-->
### 应用 CoreDNS 配置更改

#### 更新 CoreDNS 的 Deployment 和 Service

kubeadm 将 CoreDNS 部署为名为 `coredns` 的 Deployment，并使用 Service `kube-dns`，
两者都在 `kube-system` 命名空间中。

要更新任何 CoreDNS 设置，你可以编辑 Deployment 和 Service：


```shell
kubectl edit deployment -n kube-system coredns
kubectl edit service -n kube-system kube-dns
```

<!--
#### Reflecting the CoreDNS changes

Once the CoreDNS changes are applied you can delete the CoreDNS Pods:

Obtain the Pod names:

-->
#### 反映 CoreDNS 的更改

应用 CoreDNS 更改后，你可以删除 CoreDNS Pod。

获取 Pod 名称：

```shell
kubectl get po -n kube-system | grep coredns
```

<!--
Delete a Pod with:
-->
使用以下命令删除 Pod：

```shell
kubectl delete po -n kube-system <pod-name>
```

<!--
New Pods with the updated CoreDNS configuration will be created.
-->
将创建具有更新的 CoreDNS 配置的新 Pod。

{{< note >}}
<!--
kubeadm does not allow CoreDNS configuration during cluster creation and upgrade.
This means that if you execute `kubeadm upgrade apply`, your changes to the CoreDNS
objects will be lost and must be reapplied.
-->
kubeadm 不允许在集群创建和升级期间配置 CoreDNS。
这意味着如果执行了 `kubeadm upgrade apply`，你对 
CoreDNS 对象的更改将丢失并且必须重新应用。
{{< /note >}}

<!--
## Persisting the reconfiguration

During the execution of `kubeadm upgrade` on a managed node, kubeadm might overwrite configuration
that was applied after the cluster was created (reconfiguration).
-->
## 持久化重新配置

在受管节点上执行 `kubeadm upgrade` 期间，kubeadm 
可能会覆盖在创建集群（重新配置）后应用的配置。

<!--
### Persisting Node object reconfiguration

kubeadm writes Labels, Taints, CRI socket and other information on the Node object for a particular
Kubernetes node. To change any of the contents of this Node object you can use:
-->
### 持久化 Node 对象重新配置

kubeadm 在特定 Kubernetes 节点的 Node 对象上写入标签、污点、CRI 
套接字和其他信息。要更改此 Node 对象的任何内容，你可以使用：

```shell
kubectl edit no <node-name>
```

<!--
During `kubeadm upgrade` the contents of such a Node might get overwritten.
If you would like to persist your modifications to the Node object after upgrade,
you can prepare a [kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
and apply it to the Node object:
-->
在 `kubeadm upgrade` 期间，此类节点的内容可能会被覆盖。
如果你想在升级后保留对 Node 对象的修改，你可以准备一个
[kubectl patch](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
并将其应用到 Node 对象：

```shell
kubectl patch no <node-name> --patch-file <patch-file>
```

<!--
#### Persisting control plane component reconfiguration

The main source of control plane configuration is the `ClusterConfiguration`
object stored in the cluster. To extend the static Pod manifests configuration,
[patches](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches) can be used.

These patch files must remain as files on the control plane nodes to ensure that
they can be used by the `kubeadm upgrade ... --patches <directory>`.

If reconfiguration is done to the `ClusterConfiguration` and static Pod manifests on disk,
the set of node specific patches must be updated accordingly.
-->
#### 持久化控制平面组件重新配置

控制平面配置的主要来源是存储在集群中的 `ClusterConfiguration` 对象。
要扩展静态 Pod 清单配置，可以使用 
[patches](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)。

这些补丁文件必须作为文件保留在控制平面节点上，以确保它们可以被 
`kubeadm upgrade ... --patches <directory>` 使用。

如果对 `ClusterConfiguration` 和磁盘上的静态 Pod 清单进行了重新配置，则必须相应地更新节点特定补丁集。

<!--
#### Persisting kubelet reconfiguration

Any changes to the `KubeletConfiguration` stored in `/var/lib/kubelet/config.yaml` will be overwritten on
`kubeadm upgrade` by downloading the contents of the cluster wide `kubelet-config` ConfigMap.
To persist kubelet node specific configuration either the file `/var/lib/kubelet/config.yaml`
has to be updated manually post-upgrade or the file `/var/lib/kubelet/kubeadm-flags.env` can include flags.
The kubelet flags override the associated `KubeletConfiguration` options, but note that
some of the flags are deprecated.

A kubelet restart will be required after changing `/var/lib/kubelet/config.yaml` or
`/var/lib/kubelet/kubeadm-flags.env`.
-->
#### 持久化 kubelet 重新配置

对存储在 `/var/lib/kubelet/config.yaml` 中的 `KubeletConfiguration` 
所做的任何更改都将在 `kubeadm upgrade` 时因为下载集群范围内的 `kubelet-config`
ConfigMap 的内容而被覆盖。
要持久保存 kubelet 节点特定的配置，文件 `/var/lib/kubelet/config.yaml` 
必须在升级后手动更新，或者文件 `/var/lib/kubelet/kubeadm-flags.env` 可以包含标志。
kubelet 标志会覆盖相关的 `KubeletConfiguration` 选项，但请注意，有些标志已被弃用。

更改 `/var/lib/kubelet/config.yaml` 或 `/var/lib/kubelet/kubeadm-flags.env` 
后需要重启 kubelet。


## {{% heading "whatsnext" %}}
<!--
- [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [Certificate management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)
- [Find more about kubeadm set-up](/docs/reference/setup-tools/kubeadm/)
-->

- [升级 kubeadm 集群](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [使用 kubeadm API 自定义组件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [使用 kubeadm 管理证书](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)
- [进一步了解 kubeadm 设置](/zh-cn/docs/reference/setup-tools/kubeadm/)
