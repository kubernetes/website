---
title: 使用 kubeadm API 定製元件
content_type: concept
weight: 40
---
<!--
---
reviewers:
- sig-cluster-lifecycle
title: Customizing components with the kubeadm API
content_type: concept
weight: 40
---
-->

<!-- overview -->

<!--
This page covers how to customize the components that kubeadm deploys. For control plane components
you can use flags in the `ClusterConfiguration` structure or patches per-node. For the kubelet
and kube-proxy you can use `KubeletConfiguration` and `KubeProxyConfiguration`, accordingly.

All of these options are possible via the kubeadm configuration API.
For more details on each field in the configuration you can navigate to our
[API reference pages](/docs/reference/config-api/kubeadm-config.v1beta3/).
-->
本頁面介紹瞭如何自定義 kubeadm 部署的元件。
你可以使用 `ClusterConfiguration` 結構中定義的引數，或者在每個節點上應用補丁來定製控制平面元件。
你可以使用 `KubeletConfiguration` 和 `KubeProxyConfiguration` 結構分別定製 kubelet 和 kube-proxy 元件。

所有這些選項都可以透過 kubeadm 配置 API 實現。
有關配置中的每個欄位的詳細資訊，你可以導航到我們的 
[API 參考頁面](/docs/reference/config-api/kubeadm-config.v1beta3/) 。

{{< note >}}
<!--
Customizing the CoreDNS deployment of kubeadm is currently not supported. You must manually
patch the `kube-system/coredns` {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
and recreate the CoreDNS {{< glossary_tooltip text="Pods" term_id="pod" >}} after that. Alternatively,
you can skip the default CoreDNS deployment and deploy your own variant.
For more details on that see [Using init phases with kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases).
-->
kubeadm 目前不支援對 CoreDNS 部署進行定製。
你必須手動更新 `kube-system/coredns` {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 
並在更新後重新建立 CoreDNS {{< glossary_tooltip text="Pods" term_id="pod" >}}。
或者，你可以跳過預設的 CoreDNS 部署並部署你自己的 CoreDNS 變種。
有關更多詳細資訊，請參閱[在 kubeadm 中使用 init phases](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases).
{{< /note >}}

{{< note >}}
<!--
To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
-->

要重新配置已建立的叢集，請參閱[重新配置 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)。
{{< /note >}}

<!-- body -->

<!--
## Customizing the control plane with flags in `ClusterConfiguration`

The kubeadm `ClusterConfiguration` object exposes a way for users to override the default
flags passed to control plane components such as the APIServer, ControllerManager, Scheduler and Etcd.
The components are defined using the following structures:
-->
## 使用 `ClusterConfiguration` 中的標誌自定義控制平面   {#customizing-the-control-plane-with-flags-in-clusterconfiguration}

kubeadm `ClusterConfiguration` 物件為使用者提供了一種方法，
用以覆蓋傳遞給控制平面元件（如 APIServer、ControllerManager、Scheduler 和 Etcd）的預設引數。
各元件配置使用如下欄位定義：

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

<!--
These structures contain a common `extraArgs` field, that consists of `key: value` pairs.
To override a flag for a control plane component:
-->
這些結構包含一個通用的 `extraArgs` 欄位，該欄位由 `key: value` 組成。
要覆蓋控制平面元件的引數：

<!--
1.  Add the appropriate `extraArgs` to your configuration.
2.  Add flags to the `extraArgs` field.
3.  Run `kubeadm init` with `--config <YOUR CONFIG YAML>`.
-->
1.  將適當的欄位 `extraArgs` 新增到配置中。
2.  向欄位 `extraArgs` 新增要覆蓋的引數值。
3.  用 `--config <YOUR CONFIG YAML>` 執行 `kubeadm init`。

{{< note >}}
<!-- 
You can generate a `ClusterConfiguration` object with default values by running `kubeadm config print init-defaults` 
and saving the output to a file of your choice. 
-->
你可以透過執行 `kubeadm config print init-defaults` 並將輸出儲存到你所選的檔案中，
以預設值形式生成 `ClusterConfiguration` 物件。
{{< /note >}}

{{< note >}}
<!-- 
The `ClusterConfiguration` object is currently global in kubeadm clusters. This means that any flags that you add,
will apply to all instances of the same component on different nodes. To apply individual configuration per component
on different nodes you can use [patches](#patches).
-->
`ClusterConfiguration` 物件目前在 kubeadm 叢集中是全域性的。
這意味著你新增的任何標誌都將應用於同一組件在不同節點上的所有例項。
要在不同節點上為每個元件應用單獨的配置，你可以使用[補丁](#patches)。
{{< /note >}}

{{< note >}}
<!-- 
Duplicate flags (keys), or passing the same flag `--foo` multiple times, is currently not supported.
To workaround that you must use [patches](#patches).
-->
當前不支援重複的引數（keys）或多次傳遞相同的引數 `--foo`。
要解決此問題，你必須使用[補丁](#patches)。
{{< /note >}}

<!--
## APIServer flags
-->
### APIServer 引數   {#apiserver-flags}

<!--
For details, see the [reference documentation for kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).
-->
有關詳細資訊，請參閱 [kube-apiserver 參考文件](/docs/reference/command-line-tools-reference/kube-apiserver/)。

<!--
Example usage:
-->
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
-->
### ControllerManager 引數   {#controllermanager-flags}

<!--
For details, see the [reference documentation for kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).
-->
有關詳細資訊，請參閱 [kube-controller-manager 參考文件](/docs/reference/command-line-tools-reference/kube-controller-manager/)。

<!--
Example usage:
-->
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
### Scheduler flags
-->
## Scheduler 引數   {#scheduler-flags}

<!--
For details, see the [reference documentation for kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).
-->
有關詳細資訊，請參閱 [kube-scheduler 參考文件](/docs/reference/command-line-tools-reference/kube-scheduler/)。

<!--
Example usage:
-->
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
### Etcd 引數   {#etcd-flags} 

有關詳細資訊，請參閱 [etcd 服務文件](https://etcd.io/docs/).

使用示例：

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

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm allows you to pass a directory with patch files to `InitConfiguration` and `JoinConfiguration`
on individual nodes. These patches can be used as the last customization step before the control
plane component manifests are written to disk.

You can pass this file to `kubeadm init` with `--config <YOUR CONFIG YAML>`:
-->
## 使用補丁定製控制平面   {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm 允許將包含補丁檔案的目錄傳遞給各個節點上的 `InitConfiguration` 和 `JoinConfiguration`。
這些補丁可被用作控制平面元件清單寫入磁碟之前的最後一個自定義步驟。

可以使用 `--config <你的 YAML 格式控制檔案>` 將配置檔案傳遞給 `kubeadm init`：

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
<!--
For `kubeadm init` you can pass a file containing both a `ClusterConfiguration` and `InitConfiguration`
separated by `---`.
-->
對於 `kubeadm init`，你可以傳遞一個包含 `ClusterConfiguration` 和 `InitConfiguration` 的檔案，以 `---` 分隔。
{{< /note >}}

<!--
You can pass this file to `kubeadm join` with `--config <YOUR CONFIG YAML>`:
-->
你可以使用 `--config <你的 YAML 格式配置檔案>` 將配置檔案傳遞給 `kubeadm join`：

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

<!--
The directory must contain files named `target[suffix][+patchtype].extension`.
For example, `kube-apiserver0+merge.yaml` or just `etcd.json`.
-->
補丁目錄必須包含名為 `target[suffix][+patchtype].extension` 的檔案。
例如，`kube-apiserver0+merge.yaml`  或只是 `etcd.json`。

<!--
- `target` can be one of `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` and `etcd`.
- `patchtype` can be one of `strategic`, `merge` or `json` and these must match the patching formats
[supported by kubectl](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch).
The default `patchtype` is `strategic`.
- `extension` must be either `json` or `yaml`.
- `suffix` is an optional string that can be used to determine which patches are applied first
alpha-numerically.
-->
- `target` 可以是 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `etcd` 之一。
- `patchtype` 可以是 `strategy`、`merge` 或 `json` 之一，並且這些必須匹配 
  [kubectl 支援](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch) 的補丁格式。
  預設補丁型別是 `strategic` 的。
- `extension` 必須是 `json` 或 `yaml`。
- `suffix` 是一個可選字串，可用於確定首先按字母數字應用哪些補丁。

{{< note >}}
<!--
If you are using `kubeadm upgrade` to upgrade your kubeadm nodes you must again provide the same
patches, so that the customization is preserved after upgrade. To do that you can use the `--patches`
flag, which must point to the same directory. `kubeadm upgrade` currently does not support a configuration
API structure that can be used for the same purpose.
-->
如果你使用 `kubeadm upgrade` 升級 kubeadm 節點，你必須再次提供相同的補丁，以便在升級後保留自定義配置。
為此，你可以使用 `--patches` 引數，該引數必須指向同一目錄。 `kubeadm upgrade` 目前不支援用於相同目的的 API 結構配置。
{{< /note >}}

<!--
## Customizing the kubelet

To customize the kubelet you can add a `KubeletConfiguration` next to the `ClusterConfiguration` or
`InitConfiguration` separated by `---` within the same configuration file. This file can then be passed to `kubeadm init`.
-->
## 自定義 kubelet   {#customizing-the-kubelet}

要自定義 kubelet，你可以在同一配置檔案中的 `ClusterConfiguration` 或 `InitConfiguration` 
之外新增一個 `KubeletConfiguration`，用 `---` 分隔。
然後可以將此檔案傳遞給 `kubeadm init`。

{{< note >}}
<!--
kubeadm applies the same `KubeletConfiguration` to all nodes in the cluster. To apply node
specific settings you can use kubelet flags as overrides by passing them in the `nodeRegistration.kubeletExtraArgs`
field supported by both `InitConfiguration` and `JoinConfiguration`. Some kubelet flags are deprecated,
so check their status in the [kubelet reference documentation](/docs/reference/command-line-tools-reference/kubelet)
before using them.
-->
kubeadm 將相同的 `KubeletConfiguration` 配置應用於叢集中的所有節點。
要應用節點特定設定，你可以使用 `kubelet` 引數進行覆蓋，方法是將它們傳遞到 `InitConfiguration` 和 `JoinConfiguration` 
支援的 `nodeRegistration.kubeletExtraArgs` 欄位中。一些 kubelet 引數已被棄用，
因此在使用這些引數之前，請在 [kubelet 參考文件](/zh-cn/docs/reference/command-line-tools-reference/kubelet) 中檢查它們的狀態。
{{< /note >}}

<!--
For more details see [Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration)
-->
更多詳情，請參閱[使用 kubeadm 配置叢集中的每個 kubelet](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration)

<!--
## Customizing kube-proxy

To customize kube-proxy you can pass a `KubeProxyConfiguration` next your `ClusterConfiguration` or
`InitConfiguration` to `kubeadm init` separated by `---`.

For more details you can navigate to our [API reference pages](/docs/reference/config-api/kubeadm-config.v1beta3/).
-->
## 自定義 kube-proxy   {#customizing-kube-proxy}

要自定義 kube-proxy，你可以在 `ClusterConfiguration` 或 `InitConfiguration` 之外新增一個
由 `---` 分隔的 `KubeProxyConfiguration`， 傳遞給 `kubeadm init`。

可以導航到 [API 參考頁面](/docs/reference/config-api/kubeadm-config.v1beta3/) 檢視更多詳情，

{{< note >}}
<!--
kubeadm deploys kube-proxy as a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}, which means
that the `KubeProxyConfiguration` would apply to all instances of kube-proxy in the cluster.
-->
kubeadm 將 kube-proxy 部署為 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}，
這意味著 `KubeProxyConfiguration` 將應用於叢集中的所有 kube-proxy 例項。
{{< /note >}}


