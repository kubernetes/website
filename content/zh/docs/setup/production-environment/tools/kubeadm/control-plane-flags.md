---
title: 使用 kubeadm API 定制控制平面配置
content_type: concept
weight: 40
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Customizing control plane configuration with kubeadm API
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This page covers how to customize the components that kubeadm deploys. For control plane components
you can use flags in the `ClusteConfiguration` structure or patches per-node. For the kubelet
and kube-proxy you can use `KubeletConfiguration` and `KubeProxyConfiguration`, accordingly.
-->
本页讨论如何定制 kubeadm 所部署的组件。对于控制面组件，你可以使用
`ClusterConfiguration` 结构中定义的标志，或者逐个节点地执行 patch 操作。
对于 kubelet 和 kube-proxy，你可以使用对应的 `KubeletConfiguration` 和
`KubeProxyConfiguration` 结构。

<!--
All of these options are possible via the kubeadm configuration API.
For more details on each field in the configuration you can navigate to our
[API reference pages](/docs/reference/config-api/kubeadm-config.v1beta3/).
-->
所有这些选项都可以通过 kubeadm 配置 API 来设置。
关于配置结构中各个字段的细节，你可以导航到我们的
[API 参考页面](/docs/reference/config-api/kubeadm-config.v1beta3/)。

{{< note >}}
<!--
Customizing the CoreDNS deployment of kubeadm is currently not supported. You must manually
patch the `kube-system/coredns` {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
and recreate the CoreDNS {{< glossary_tooltip text="Pods" term_id="pod" >}} after that. Alternatively,
-->
kubeadm 目前还不支持定制 CoreDNS 部署。你必须手动地对 `kube-system/coredns`
这一 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 执行 patch
操作，之后重新创建 CoreDNS {{< glossary_tooltip text="Pods" term_id="pod" >}}。
另一种方式是，你可以略过默认的 CoreDNS 部署，自行部署该组件。
进一步的相关细节可参阅[使用 kubeadm 的 init 阶段](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases)。
{{< /note >}}


<!-- body -->

{{< feature-state for_k8s_version="1.12" state="stable" >}}

<!--
## Customizing the control plane with flags in `ClusterConfiguration`
-->
## 使用 `ClusterConfiguration` 中的字段定制控制面

<!--
The kubeadm `ClusterConfiguration` object exposes a way for users to override the default
flags passed to control plane components such as the APIServer, ControllerManager, Scheduler and Etcd.
The components are defined using the following fields:
-->
kubeadm `ClusterConfiguration` 对象公开了一种方式让用户覆盖传递给控制平面
组件（如 API 服务器、控制器管理器、调度器和 etcd）的默认参数。
各组件配置使用如下字段定义：

- `apiServer`
- `controllerManager`
- `scheduler`

<!--
These structures contain a common `extraArgs` field, that consists of `key: value` pairs.
To override a flag for a control plane component:
-->
这些结构都包含一个 `extraArgs` 字段，由 `key: value` 对组成。
要覆盖某控制平面组件的参数:

<!--
1.  Add the appropriate `extraArgs` to your configuration.
2.  Add flags to the `extraArgs` field.
3.  Run `kubeadm init` with `--config <YOUR CONFIG YAML>`.
-->
1.  将适当的 `extraArgs` 字段添加到配置中
2.  向 `extraArgs` 字段添加配置标志
3.  用 `--config <你的配置 YAML>` 运行 `kubeadm init`。

{{< note >}}
<!-- 
You can generate a `ClusterConfiguration` object with default values by running `kubeadm config print init-defaults`
and saving the output to a file of your choice. 
-->
你可以通过运行 `kubeadm config print init-defaults` 并将输出保存到
你选择的文件中，生成带有默认值设置的 `ClusterConfiguration` 对象。
{{< /note >}}

{{< note >}}
<!--
The `ClusterConfiguration` object is currently global in kubeadm clusters. This means that any flags that you add,
will apply to all instances of the same component on different nodes. To apply individual configuration per component
on different nodes you can use [patches](#patches).
-->
`ClusterConfiguration` 对象目前在 kubeadm 集群中是全局配置。这意味着
你所添加的任何标志都会应用到同一组件在不同节点上的所有实例之上。
要针对不同节点上某组件来应用独立的配置，你可以使用[补丁](#patches)。
{{< /note >}}

{{< note >}}
<!--
Duplicate flags (keys), or passing the same flag `--foo` multiple times, is currently not supported.
To workaround that you must use [patches](#patches).
-->
重复的标志（主键），或者多次传递同一标志 `--foo` 都是现在所不支持的。
要实现这一效果，你必须使用[补丁](#patches)。
{{< /note >}}

<!--
## APIServer flags

For details, see the [reference documentation for kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Example usage:
-->
## APIServer 参数

有关详细信息，请参阅
[kube-apiserver 参考文档](/zh/docs/reference/command-line-tools-reference/kube-apiserver/)。

使用示例：

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
    anonymous-auth: "false"
    enable-admission-plugins: AlwaysPullImages,DefaultStorageClass
    audit-log-path: /home/johndoe/audit.log
```

<!--
## ControllerManager flags

For details, see the [reference documentation for kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Example usage:
-->
## 控制器管理器参数

有关详细信息，请参阅
[kube-controller-manager 参考文档](/zh/docs/reference/command-line-tools-reference/kube-controller-manager/)。

使用示例：

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
    cluster-signing-key-file: /home/johndoe/keys/ca.key
    deployment-controller-sync-period: "50"
```

<!--
## Scheduler flags

For details, see the [reference documentation for kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Example usage:
-->
## Scheduler 参数  {#scheduler-flags}

有关详细信息，请参阅
[kube-scheduler 参考文档](/zh/docs/reference/command-line-tools-reference/kube-scheduler/)。

使用示例：

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
    config: /etc/kubernetes/scheduler-config.yaml
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

<!--
### Etcd flags

For details, see the [etcd server documentation](https://etcd.io/docs/).

Example usage:
-->
### Etcd 标志   {#etcd-flags}

有关详细信息，参阅 [etcd 服务器文档](https://etcd.io/docs/)。

用法示例：

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
      election-timeout: 1000
```

<!--
## Customizing the control plane with patches {#patches}
-->
## 使用补丁定制控制面 {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Kubeadm allows you to pass a directory with patch files to `InitConfiguration` and `JoinConfiguration`
on individual nodes. These patches can be used as the last customization step before the control
plane component manifests are written to disk.

You can pass this file to `kubeadm init` with `--config <YOUR CONFIG YAML>`:
-->
kubeadm 允许用户将一个包含补丁文件的目录传递给各个节点的 `InitConfiguration` 和
`JoinConfiguration`。这些补丁文件可以作为最后一个定制步骤，之后控制面组件的
清单就会被写入到磁盘。

你可以使用 `--config <你的 YAML 配置文件>` 将此文件传递给 `kubeadm init`。

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
nodeRegistration:
  patches:
    directory: /home/user/somedir
```

{{< note >}}
<!--
For `kubeadm init` you can pass a file containing both a `ClusterConfiguration` and `InitConfiguration`
separated by `---`.
-->
对于 `kubeadm init`，你可以传递一个同时包含 `ClusterConfiguration` 和
`InitConfiguration` 的文件，二者用 `---` 隔开。
{{< /note >}}

<!--
You can pass this file to `kubeadm join` with `--config <YOUR CONFIG YAML>`:
-->
你可以将此文件用 `--config <你的 YAML 配置文件>` 传递给 `kubeadm join`。

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: JoinConfiguration
nodeRegistration:
  patches:
    directory: /home/user/somedir
```

<!--
The directory must contain files named `target[suffix][+patchtype].extension`.
For example, `kube-apiserver0+merge.yaml` or just `etcd.json`.
-->
目录中必须包含名为 `target[suffix][+patchtype].extension` 的文件。
例如，`kube-apiserver0+merge.yaml` 或 `etcd.json`。

<!--
- `target` can be one of `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `etcd`.
- `patchtype` can be one of `strategic`, `merge` or `json` and these must match the patching formats
[supported by kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch).
The default `patchtype` is `strategic`.
- `extension` must be either `json` or `yaml`.
- `suffix` is an optional string that can be used to determine which patches are applied first
alpha-numerically.
-->
- `target` 可以是 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler`
  和 `etcd` 之一。
- `patchtype` 可以是 `strategic`、`merge` 或 `json` 之一，而且其取值必须与
  [kubectl 所支持的](/zh/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch)
  的补丁格式匹配。
  默认的 `patchtype` 是 `strategic`。
- `extension` 必须是 `json` 或 `yaml`。
- `suffix` 是一个可选的字符串，可用来根据字母数字顺序确定哪些补丁要先应用。
 
{{< note >}}
<!--
If you are using `kubeadm upgrade` to upgrade your kubeadm nodes you must again provide the same
patches, so that the customization is preserved after upgrade. To do that you can use the `--patches`
flag, which must point to the same directory. `kubeadm upgrade` currently does not support a configuration
API structure that can be used for the same purpose.
-->
如果你在使用 `kubeadm upgrade` 来升级你的 kubeadm 节点，你必须再次提供
相同的补丁，这样在升级操作之后所定制的内容会被保留。
要实现这一点，你可以使用 `--patches` 标志，并令其指向相同的目录。
`kubeadm upgrade` 当前不支持可用于相同目的的 API 配置结构。
{{< /note >}}

<!--
## Customizing the kubelet

To customize the kubelet you can add a `KubeletConfiguration` next to the `ClusterConfiguration` or
`InitConfiguration` separated by `---` within the same configuration file. This file can then be passed to `kubeadm init`.
-->
## 定制 kubelet   {#customizing-the-kubelet}

要定制 kubelet，你可以在 `ClusterConfiguration` 或 `InitConfiguration` 之后
添加一个用 `---` 隔开的 `KubeletConfiguration`，都放在同一配置文件内。
此文件可以被传递给 `kubeadm init`。

{{< note >}}
<!--
kubeadm applies the same `KubeletConfiguration` to all nodes in the cluster. To apply node
specific settings you can use kubelet flags as overrides by passing them in the `nodeRegistration.kubeletExtraArgs`
field supported by both `InitConfiguration` and `JoinConfiguration`. Some kubelet flags are deprecated,
so check their status in the [kubelet reference documentation](/docs/reference/command-line-tools-reference/kubelet)
before using them.
-->
kubeadm 命令会将同一 `KubeletConfiguration` 应用到集群中的所有节点之上。
要应用特定于某些节点的配置，你可以使用 kubelet 标志来实现覆盖，
方法是将这些标志在 `InitConfiguration` 和 `JoinConfiguration` 都支持的
`nodeRegistration.kubeletExtraArgs` 中传递。
某些 kubelet 标志已被废弃，所以在使用它们之前需要参阅
[kubelet 参考文档](/zh/docs/reference/command-line-tools-reference/kubelet/)。
{{< /note >}}

<!--
For more details see [Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)
-->
要进一步了解详细信息，参阅
[使用 kubeadm 来配置集群中每个 kubelet](/zh/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)。

<!--
## Customizing kube-proxy

To customize kube-proxy you can pass a `KubeProxyConfiguration` next your `ClusterConfiguration` or
`InitConfiguration` to `kubeadm init` separated by `---`.
-->
## 定制 kube-proxy  {#customizing-kube-proxy}

要定制 kube-proxy，你可以在传递给 `kubeadm init` 命令
`ClusterConfiguration` 或 `InitConfiguration` 时，用 `---` 分隔
的形式同时传递 `KubeProxyConfiguration`。

<!--
For more details you can navigate to our [API reference pages](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta3).
-->
进一步的详细信息，可参阅[API 参考页面](/docs/reference/config-api/kubeadm-config.v1beta3/)。

{{< note >}}
<!--
kubeadm deploys kube-proxy as a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, which means
that the `KubeProxyConfiguration` would apply to all instances of kube-proxy in the cluster.
-->
kubeadm 用 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}
的形式部署 kube-proxy，这意味着 `KubeProxyConfiguration` 会被应用到集群中
每个 kube-proxy 实例之上。
{{< /note >}}

