---
title: 使用 kubeadm API 定制组件
content_type: concept
weight: 40
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Customizing components with the kubeadm API
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This page covers how to customize the components that kubeadm deploys. For control plane components
you can use flags in the `ClusterConfiguration` structure or patches per-node. For the kubelet
and kube-proxy you can use `KubeletConfiguration` and `KubeProxyConfiguration`, accordingly.

All of these options are possible via the kubeadm configuration API.
For more details on each field in the configuration you can navigate to our
[API reference pages](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
本页面介绍了如何自定义 kubeadm 部署的组件。
你可以使用 `ClusterConfiguration` 结构中定义的参数，或者在每个节点上应用补丁来定制控制平面组件。
你可以使用 `KubeletConfiguration` 和 `KubeProxyConfiguration` 结构分别定制 kubelet 和 kube-proxy 组件。

所有这些选项都可以通过 kubeadm 配置 API 实现。
有关配置中的每个字段的详细信息，你可以导航到我们的
[API 参考页面](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/) 。

{{< note >}}
<!--
Customizing the CoreDNS deployment of kubeadm is currently not supported. You must manually
patch the `kube-system/coredns` {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
and recreate the CoreDNS {{< glossary_tooltip text="Pods" term_id="pod" >}} after that. Alternatively,
you can skip the default CoreDNS deployment and deploy your own variant.
For more details on that see [Using init phases with kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases).
-->
kubeadm 目前不支持对 CoreDNS 部署进行定制。
你必须手动更新 `kube-system/coredns` {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
并在更新后重新创建 CoreDNS {{< glossary_tooltip text="Pod" term_id="pod" >}}。
或者，你可以跳过默认的 CoreDNS 部署并部署你自己的 CoreDNS 变种。
有关更多详细信息，请参阅[在 kubeadm 中使用 init phase](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases).
{{< /note >}}

{{< note >}}
<!--
To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
-->

要重新配置已创建的集群，请参阅[重新配置 kubeadm 集群](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)。
{{< /note >}}

<!-- body -->

<!--
## Customizing the control plane with flags in `ClusterConfiguration`

The kubeadm `ClusterConfiguration` object exposes a way for users to override the default
flags passed to control plane components such as the APIServer, ControllerManager, Scheduler and Etcd.
The components are defined using the following structures:
-->
## 使用 `ClusterConfiguration` 中的标志自定义控制平面   {#customizing-the-control-plane-with-flags-in-clusterconfiguration}

kubeadm `ClusterConfiguration` 对象为用户提供了一种方法，
用以覆盖传递给控制平面组件（如 APIServer、ControllerManager、Scheduler 和 Etcd）的默认参数。
各组件配置使用如下字段定义：

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

<!--
These structures contain a common `extraArgs` field, that consists of `name` / `value` pairs.
To override a flag for a control plane component:
-->
这些结构包含一个通用的 `extraArgs` 字段，该字段由 `name` / `value` 组成。
要覆盖控制平面组件的参数：

<!--
1.  Add the appropriate `extraArgs` to your configuration.
2.  Add flags to the `extraArgs` field.
3.  Run `kubeadm init` with `--config <YOUR CONFIG YAML>`.
-->
1.  将适当的字段 `extraArgs` 添加到配置中。
2.  向字段 `extraArgs` 添加要覆盖的参数值。
3.  用 `--config <YOUR CONFIG YAML>` 运行 `kubeadm init`。

{{< note >}}
<!-- 
You can generate a `ClusterConfiguration` object with default values by running `kubeadm config print init-defaults`
and saving the output to a file of your choice.
-->
你可以通过运行 `kubeadm config print init-defaults` 并将输出保存到你所选的文件中，
以默认值形式生成 `ClusterConfiguration` 对象。
{{< /note >}}

{{< note >}}
<!-- 
The `ClusterConfiguration` object is currently global in kubeadm clusters. This means that any flags that you add,
will apply to all instances of the same component on different nodes. To apply individual configuration per component
on different nodes you can use [patches](#patches).
-->
`ClusterConfiguration` 对象目前在 kubeadm 集群中是全局的。
这意味着你添加的任何标志都将应用于同一组件在不同节点上的所有实例。
要在不同节点上为每个组件应用单独的配置，你可以使用[补丁](#patches)。
{{< /note >}}

{{< note >}}
<!-- 
Duplicate flags (keys), or passing the same flag `--foo` multiple times, is currently not supported.
To workaround that you must use [patches](#patches).
-->
当前不支持重复的参数（keys）或多次传递相同的参数 `--foo`。
要解决此问题，你必须使用[补丁](#patches)。
{{< /note >}}

<!--
### APIServer flags
-->
### APIServer 参数   {#apiserver-flags}

<!--
For details, see the [reference documentation for kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).
-->
有关详细信息，请参阅 [kube-apiserver 参考文档](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。

<!--
Example usage:
-->
使用示例：

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

<!--
### ControllerManager flags
-->
### ControllerManager 参数   {#controllermanager-flags}

<!--
For details, see the [reference documentation for kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).
-->
有关详细信息，请参阅 [kube-controller-manager 参考文档](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)。

<!--
Example usage:
-->
使用示例：

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

<!--
### Scheduler flags
-->
## Scheduler 参数   {#scheduler-flags}

<!--
For details, see the [reference documentation for kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
-->
有关详细信息，请参阅 [kube-scheduler 参考文档](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)。

<!--
Example usage:
-->
使用示例：

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
<!--
### Etcd flags

For details, see the [etcd server documentation](https://etcd.io/docs/).

Example usage:
-->
### Etcd 参数   {#etcd-flags} 

有关详细信息，请参阅 [etcd 服务文档](https://etcd.io/docs/).

使用示例：

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```
<!--
## Customizing with patches {#patches}

Kubeadm allows you to pass a directory with patch files to `InitConfiguration` and `JoinConfiguration`
on individual nodes. These patches can be used as the last customization step before component configuration
is written to disk.

You can pass this file to `kubeadm init` with `--config <YOUR CONFIG YAML>`:
-->
## 使用补丁定制   {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm 允许将包含补丁文件的目录传递给各个节点上的 `InitConfiguration` 和 `JoinConfiguration`。
这些补丁可被用作组件配置写入磁盘之前的最后一个自定义步骤。

可以使用 `--config <你的 YAML 格式控制文件>` 将配置文件传递给 `kubeadm init`：

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
<!--
For `kubeadm init` you can pass a file containing both a `ClusterConfiguration` and `InitConfiguration`
separated by `---`.
-->
对于 `kubeadm init`，你可以传递一个包含 `ClusterConfiguration` 和 `InitConfiguration` 的文件，以 `---` 分隔。
{{< /note >}}

<!--
You can pass this file to `kubeadm join` with `--config <YOUR CONFIG YAML>`:
-->
你可以使用 `--config <你的 YAML 格式配置文件>` 将配置文件传递给 `kubeadm join`：

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

<!--
The directory must contain files named `target[suffix][+patchtype].extension`.
For example, `kube-apiserver0+merge.yaml` or just `etcd.json`.
-->
补丁目录必须包含名为 `target[suffix][+patchtype].extension` 的文件。
例如，`kube-apiserver0+merge.yaml` 或只是 `etcd.json`。

<!--
- `target` can be one of `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`
and `kubeletconfiguration`.
- `suffix` is an optional string that can be used to determine which patches are applied first
alpha-numerically.
- `patchtype` can be one of `strategic`, `merge` or `json` and these must match the patching formats
[supported by kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch).
The default `patchtype` is `strategic`.
- `extension` must be either `json` or `yaml`.
-->
- `target` 可以是 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler`、`etcd` 和 `kubeletconfiguration` 之一。
- `suffix` 是一个可选字符串，可用于确定首先按字母数字应用哪些补丁。
- `patchtype` 可以是 `strategy`、`merge` 或 `json` 之一，并且这些必须匹配
  [kubectl 支持](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch) 的补丁格式。
  默认补丁类型是 `strategic` 的。
- `extension` 必须是 `json` 或 `yaml`。

{{< note >}}
<!--
If you are using `kubeadm upgrade` to upgrade your kubeadm nodes you must again provide the same
patches, so that the customization is preserved after upgrade. To do that you can use the `--patches`
flag, which must point to the same directory. `kubeadm upgrade` currently does not support a configuration
API structure that can be used for the same purpose.
-->
如果你使用 `kubeadm upgrade` 升级 kubeadm 节点，你必须再次提供相同的补丁，以便在升级后保留自定义配置。
为此，你可以使用 `--patches` 参数，该参数必须指向同一目录。 `kubeadm upgrade` 目前不支持用于相同目的的 API 结构配置。
{{< /note >}}

<!--
## Customizing the kubelet {#kubelet}

To customize the kubelet you can add a [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
next to the `ClusterConfiguration` or `InitConfiguration` separated by `---` within the same configuration file.
This file can then be passed to `kubeadm init` and kubeadm will apply the same base `KubeletConfiguration`
to all nodes in the cluster.
-->
## 自定义 kubelet  {#kubelet}

要自定义 kubelet，你可以在同一配置文件中的 `ClusterConfiguration` 或 `InitConfiguration`
之外添加一个 [`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)，用 `---` 分隔。
然后可以将此文件传递给 `kubeadm init`，kubeadm 会将相同的
`KubeletConfiguration` 配置应用于集群中的所有节点。

<!--
For applying instance-specific configuration over the base `KubeletConfiguration` you can use the
[`kubeletconfiguration` patch target](#patches).

Alternatively, you can use kubelet flags as overrides by passing them in the
`nodeRegistration.kubeletExtraArgs` field supported by both `InitConfiguration` and `JoinConfiguration`.
Some kubelet flags are deprecated, so check their status in the
[kubelet reference documentation](/docs/reference/command-line-tools-reference/kubelet) before using them.
-->
要在基础 `KubeletConfiguration` 上应用特定节点的配置，你可以使用
[`kubeletconfiguration` 补丁定制](#patches)。

或者你可以使用 `kubelet` 参数进行覆盖，方法是将它们传递到 `InitConfiguration` 和 `JoinConfiguration` 
支持的 `nodeRegistration.kubeletExtraArgs` 字段中。一些 kubelet 参数已被弃用，
因此在使用这些参数之前，请在 [kubelet 参考文档](/zh-cn/docs/reference/command-line-tools-reference/kubelet) 中检查它们的状态。


<!--
For additional details see [Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)
-->
更多详情，请参阅[使用 kubeadm 配置集群中的每个 kubelet](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

<!--
## Customizing kube-proxy

To customize kube-proxy you can pass a `KubeProxyConfiguration` next your `ClusterConfiguration` or
`InitConfiguration` to `kubeadm init` separated by `---`.

For more details you can navigate to our [API reference pages](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
## 自定义 kube-proxy   {#customizing-kube-proxy}

要自定义 kube-proxy，你可以在 `ClusterConfiguration` 或 `InitConfiguration`
之外添加一个由 `---` 分隔的 `KubeProxyConfiguration`， 传递给 `kubeadm init`。

可以导航到 [API 参考页面](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)查看更多详情，

{{< note >}}
<!--
kubeadm deploys kube-proxy as a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, which means
that the `KubeProxyConfiguration` would apply to all instances of kube-proxy in the cluster.
-->
kubeadm 将 kube-proxy 部署为 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}，
这意味着 `KubeProxyConfiguration` 将应用于集群中的所有 kube-proxy 实例。
{{< /note >}}


