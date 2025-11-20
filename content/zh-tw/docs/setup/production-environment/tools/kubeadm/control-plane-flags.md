---
title: 使用 kubeadm API 定製組件
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
本頁面介紹瞭如何自定義 kubeadm 部署的組件。
你可以使用 `ClusterConfiguration` 結構中定義的參數，或者在每個節點上應用補丁來定製控制平面組件。
你可以使用 `KubeletConfiguration` 和 `KubeProxyConfiguration` 結構分別定製 kubelet 和 kube-proxy 組件。

所有這些選項都可以通過 kubeadm 設定 API 實現。
有關設定中的每個字段的詳細資訊，你可以導航到我們的
[API 參考頁面](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/) 。

{{< note >}}
<!--
To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
-->

要重新設定已創建的叢集，請參閱[重新設定 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)。
{{< /note >}}

<!-- body -->

<!--
## Customizing the control plane with flags in `ClusterConfiguration`

The kubeadm `ClusterConfiguration` object exposes a way for users to override the default
flags passed to control plane components such as the APIServer, ControllerManager, Scheduler and Etcd.
The components are defined using the following structures:
-->
## 使用 `ClusterConfiguration` 中的標誌自定義控制平面   {#customizing-the-control-plane-with-flags-in-clusterconfiguration}

kubeadm `ClusterConfiguration` 對象爲使用者提供了一種方法，
用以覆蓋傳遞給控制平面組件（如 APIServer、ControllerManager、Scheduler 和 Etcd）的預設參數。
各組件設定使用如下字段定義：

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

<!--
These structures contain a common `extraArgs` field, that consists of `name` / `value` pairs.
To override a flag for a control plane component:
-->
這些結構包含一個通用的 `extraArgs` 字段，該字段由 `name` / `value` 組成。
要覆蓋控制平面組件的參數：

<!--
1. Add the appropriate `extraArgs` to your configuration.
2. Add flags to the `extraArgs` field.
3. Run `kubeadm init` with `--config <YOUR CONFIG YAML>`.
-->
1. 將適當的字段 `extraArgs` 添加到設定中。
2. 向字段 `extraArgs` 添加要覆蓋的參數值。
3. 用 `--config <YOUR CONFIG YAML>` 運行 `kubeadm init`。

{{< note >}}
<!-- 
You can generate a `ClusterConfiguration` object with default values by running `kubeadm config print init-defaults`
and saving the output to a file of your choice.
-->
你可以通過運行 `kubeadm config print init-defaults` 並將輸出保存到你所選的檔案中，
以預設值形式生成 `ClusterConfiguration` 對象。
{{< /note >}}

{{< note >}}
<!-- 
The `ClusterConfiguration` object is currently global in kubeadm clusters. This means that any flags that you add,
will apply to all instances of the same component on different nodes. To apply individual configuration per component
on different nodes you can use [patches](#patches).
-->
`ClusterConfiguration` 對象目前在 kubeadm 叢集中是全局的。
這意味着你添加的任何標誌都將應用於同一組件在不同節點上的所有實例。
要在不同節點上爲每個組件應用單獨的設定，你可以使用[補丁](#patches)。
{{< /note >}}

{{< note >}}
<!-- 
Duplicate flags (keys), or passing the same flag `--foo` multiple times, is currently not supported.
To workaround that you must use [patches](#patches).
-->
當前不支持重複的參數（keys）或多次傳遞相同的參數 `--foo`。
要解決此問題，你必須使用[補丁](#patches)。
{{< /note >}}

<!--
### APIServer flags
-->
### APIServer 參數   {#apiserver-flags}

<!--
For details, see the [reference documentation for kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).
-->
有關詳細資訊，請參閱 [kube-apiserver 參考文檔](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)。

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
### ControllerManager 參數   {#controllermanager-flags}

<!--
For details, see the [reference documentation for kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).
-->
有關詳細資訊，請參閱 [kube-controller-manager 參考文檔](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)。

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
## Scheduler 參數   {#scheduler-flags}

<!--
For details, see the [reference documentation for kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
-->
有關詳細資訊，請參閱 [kube-scheduler 參考文檔](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)。

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
### Etcd 參數   {#etcd-flags} 

有關詳細資訊，請參閱 [Etcd 服務文檔](https://etcd.io/docs/)。

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
## 使用補丁定製   {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm 允許將包含補丁檔案的目錄傳遞給各個節點上的 `InitConfiguration` 和 `JoinConfiguration`。
這些補丁可被用作組件設定寫入磁盤之前的最後一個自定義步驟。

可以使用 `--config <你的 YAML 格式控制文件>` 將設定檔案傳遞給 `kubeadm init`：

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
對於 `kubeadm init`，你可以傳遞一個包含 `ClusterConfiguration` 和
`InitConfiguration` 的檔案，以 `---` 分隔。
{{< /note >}}

<!--
You can pass this file to `kubeadm join` with `--config <YOUR CONFIG YAML>`:
-->
你可以使用 `--config <你的 YAML 格式配置文件>` 將設定檔案傳遞給 `kubeadm join`：

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
補丁目錄必須包含名爲 `target[suffix][+patchtype].extension` 的檔案。
例如，`kube-apiserver0+merge.yaml` 或只是 `etcd.json`。

<!--
- `target` can be one of `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`,
`kubeletconfiguration` and `kubeletconfiguration`.
- `suffix` is an optional string that can be used to determine which patches are applied first
alpha-numerically.
- `patchtype` can be one of `strategic`, `merge` or `json` and these must match the patching formats
[supported by kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch).
The default `patchtype` is `strategic`.
- `extension` must be either `json` or `yaml`.
-->
- `target` 可以是 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler`、`etcd`、
  `kubeletconfiguration` 和 `kubeletconfiguration` 之一。
- `suffix` 是一個可選字符串，可用於確定首先按字母數字應用哪些補丁。
- `patchtype` 可以是 `strategy`、`merge` 或 `json` 之一，並且這些必須匹配
  [kubectl 支持](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch)
  的補丁格式。預設補丁類型是 `strategic` 的。
- `extension` 必須是 `json` 或 `yaml`。

{{< note >}}
<!--
If you are using `kubeadm upgrade` to upgrade your kubeadm nodes you must again provide the same
patches, so that the customization is preserved after upgrade. To do that you can use the `--patches`
flag, which must point to the same directory. `kubeadm upgrade` currently does not support a configuration
API structure that can be used for the same purpose.
-->
如果你使用 `kubeadm upgrade` 升級 kubeadm 節點，你必須再次提供相同的補丁，
以便在升級後保留自定義設定。爲此，你可以使用 `--patches` 參數，該參數必須指向同一目錄。
`kubeadm upgrade` 目前不支持用於相同目的的 API 結構設定。
{{< /note >}}

<!--
## Customizing the kubelet {#kubelet}

To customize the kubelet you can add a [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
next to the `ClusterConfiguration` or `InitConfiguration` separated by `---` within the same configuration file.
This file can then be passed to `kubeadm init` and kubeadm will apply the same base `KubeletConfiguration`
to all nodes in the cluster.
-->
## 自定義 kubelet  {#kubelet}

要自定義 kubelet，你可以在同一設定檔案中的 `ClusterConfiguration` 或 `InitConfiguration`
之外添加一個 [`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)，
用 `---` 分隔。然後可以將此檔案傳遞給 `kubeadm init`，kubeadm 會將相同的
`KubeletConfiguration` 設定應用於叢集中的所有節點。

<!--
For applying instance-specific configuration over the base `KubeletConfiguration` you can use the
[`kubeletconfiguration` patch target](#patches).

Alternatively, you can use kubelet flags as overrides by passing them in the
`nodeRegistration.kubeletExtraArgs` field supported by both `InitConfiguration` and `JoinConfiguration`.
Some kubelet flags are deprecated, so check their status in the
[kubelet reference documentation](/docs/reference/command-line-tools-reference/kubelet) before using them.
-->
要在基礎 `KubeletConfiguration` 上應用特定節點的設定，你可以使用
[`kubeletconfiguration` 補丁定製](#patches)。

或者你可以使用 `kubelet` 參數進行覆蓋，方法是將它們傳遞到 `InitConfiguration` 和 `JoinConfiguration` 
支持的 `nodeRegistration.kubeletExtraArgs` 字段中。一些 kubelet 參數已被棄用，
因此在使用這些參數之前，請在
[kubelet 參考文檔](/zh-cn/docs/reference/command-line-tools-reference/kubelet)中檢查它們的狀態。


<!--
For additional details see [Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)
-->
更多詳情，請參閱[使用 kubeadm 設定叢集中的每個 kubelet](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

<!--
## Customizing kube-proxy

To customize kube-proxy you can pass a `KubeProxyConfiguration` next your `ClusterConfiguration` or
`InitConfiguration` to `kubeadm init` separated by `---`.

For more details you can navigate to our [API reference pages](/docs/reference/config-api/kubeadm-config.v1beta4/).
-->
## 自定義 kube-proxy   {#customizing-kube-proxy}

要自定義 kube-proxy，你可以在 `ClusterConfiguration` 或 `InitConfiguration`
之外添加一個由 `---` 分隔的 `KubeProxyConfiguration`，傳遞給 `kubeadm init`。

可以導航到 [API 參考頁面](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)查看更多詳情，

{{< note >}}
<!--
kubeadm deploys kube-proxy as a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, which means
that the `KubeProxyConfiguration` would apply to all instances of kube-proxy in the cluster.
-->
kubeadm 將 kube-proxy 部署爲 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}，
這意味着 `KubeProxyConfiguration` 將應用於叢集中的所有 kube-proxy 實例。
{{< /note >}}

<!--
## Customizing CoreDNS

kubeadm allows you to customize the CoreDNS Deployment with patches against the
[`corednsdeployment` patch target](#patches).
-->
## 自定義 CoreDNS

kubeadm 允許你通過針對
[`corednsdeployment` 補丁目標](#patches)的補丁來定製 CoreDNS Deployment。

<!--
Patches for other CoreDNS related API objects like the `kube-system/coredns`
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} are currently not supported.
You must manually patch any of these objects using kubectl and recreate the CoreDNS
{{< glossary_tooltip text="Pods" term_id="pod" >}} after that.

Alternatively, you can disable the kubeadm CoreDNS deployment by including the following
option in your `ClusterConfiguration`:
-->
目前不支持對其他 CoreDNS 相關 API 對象（如 `kube-system/coredns`
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}）的補丁。
你需要使用 kubectl 手動修補這些對象，
並在之後重新創建 CoreDNS {{< glossary_tooltip text="Pod" term_id="pod" >}}。

或者，你可以通過在 `ClusterConfiguration` 中包含以下選項來禁用 kubeadm CoreDNS 部署：

```yaml
dns:
  disabled: true
```

<!--
Also, by executing the following command:
-->
另外，通過執行以下命令：

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml`
```

<!--
you can obtain the manifest file kubeadm would create for CoreDNS on your setup.
-->
你可以獲取 kubeadm 在你的設置中爲 CoreDNS 創建的清單檔案。
