---
title: 重新配置 kubeadm 叢集
content_type: task
weight: 10
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Reconfiguring a kubeadm cluster
content_type: task
weight: 10
-->

<!-- overview -->
<!--
kubeadm does not support automated ways of reconfiguring components that
were deployed on managed nodes. One way of automating this would be
by using a custom [operator](/docs/concepts/extend-kubernetes/operator/).
-->
kubeadm 不支援自動重新配置部署在託管節點上的元件的方式。 
一種自動化的方法是使用自定義的 
[operator](/zh-cn/docs/concepts/extend-kubernetes/operator/)。

<!--
To modify the components configuration you must manually edit associated cluster
objects and files on disk.

This guide shows the correct sequence of steps that need to be performed
to achieve kubeadm cluster reconfiguration.
-->
要修改元件配置，你必須手動編輯磁碟上關聯的叢集物件和檔案。
本指南展示了實現 kubeadm 叢集重新配置所需執行的正確步驟順序。

## {{% heading "prerequisites" %}}

<!--
- You need a cluster that was deployed using kubeadm
- Have administrator credentials (`/etc/kubernetes/admin.conf`) and network connectivity
to a running kube-apiserver in the cluster from a host that has kubectl installed
- Have a text editor installed on all hosts
-->
- 你需要一個使用 kubeadm 部署的叢集
- 擁有管理員憑據（`/etc/kubernetes/admin.conf`）
  和從安裝了 kubectl 的主機到叢集中正在執行的 kube-apiserver 的網路連線
- 在所有主機上安裝文字編輯器

<!-- steps -->

<!--
## Reconfiguring the cluster
kubeadm writes a set of cluster wide component configuration options in
ConfigMaps and other objects. These objects must be manually edited. The command `kubectl edit`
can be used for that.
-->
## 重新配置叢集

kubeadm 在 ConfigMap 和其他物件中寫入了一組叢集範圍的元件配置選項。 
這些物件必須手動編輯，可以使用命令 `kubectl edit`。

<!--
The `kubectl edit` command will open a text editor where you can edit and save the object directly.

You can use the environment variables `KUBECONFIG` and `KUBE_EDITOR` to specify the location of
the kubectl consumed kubeconfig file and preferred text editor.

For example:
-->
`kubectl edit` 命令將開啟一個文字編輯器，你可以在其中直接編輯和儲存物件。
你可以使用環境變數 `KUBECONFIG` 和 `KUBE_EDITOR` 來指定 kubectl
使用的 kubeconfig 檔案和首選文字編輯器的位置。

例如：
```
KUBECONFIG=/etc/kubernetes/admin.conf KUBE_EDITOR=nano kubectl edit <parameters>
```

{{< note >}}
<!--
Upon saving any changes to these cluster objects, components running on nodes may not be
automatically updated. The steps below instruct you on how to perform that manually.
-->
儲存對這些叢集物件的任何更改後，節點上執行的元件可能不會自動更新。 
以下步驟將指導你如何手動執行該操作。
{{< /note >}}

{{< warning >}}
<!--
Component configuration in ConfigMaps is stored as unstructured data (YAML string).
This means that validation will not be performed upon updating the contents of a ConfigMap.
You have to be careful to follow the documented API format for a particular
component configuration and avoid introducing typos and YAML indentation mistakes.
-->

ConfigMaps 中的元件配置儲存為非結構化資料（YAML 字串）。 這意味著在更新
ConfigMap 的內容時不會執行驗證。 你必須小心遵循特定元件配置的文件化 API 格式， 
並避免引入拼寫錯誤和 YAML 縮排錯誤。
{{< /warning >}}

<!--
### Applying cluster configuration changes

#### Updating the `ClusterConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`ClusterConfiguration`](/docs/reference/config-api/kubeadm-config.v1beta3/)
in a ConfigMap called `kubeadm-config` in the `kube-system` namespace.

To change a particular option in the `ClusterConfiguration` you can edit the ConfigMap with this command:

The configuration is located under the `data.ClusterConfiguration` key.
-->
### 應用叢集配置更改

#### 更新 `ClusterConfiguration`

在叢集建立和升級期間，kubeadm 將其
[`ClusterConfiguration`](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)
寫入 `kube-system` 名稱空間中名為 `kubeadm-config` 的 ConfigMap。

要更改 `ClusterConfiguration` 中的特定選項，你可以使用以下命令編輯 ConfigMap：

```shell
kubectl edit cm -n kube-system kubeadm-config
```

配置位於 `data.ClusterConfiguration` 鍵下。

{{< note >}}
<!--
The `ClusterConfiguration` includes a variety of options that affect the configuration of individual
components such as kube-apiserver, kube-scheduler, kube-controller-manager, CoreDNS, etcd and kube-proxy.
Changes to the configuration must be reflected on node components manually.
-->
`ClusterConfiguration` 包括各種影響單個元件配置的選項， 例如
kube-apiserver、kube-scheduler、kube-controller-manager、
CoreDNS、etcd 和 kube-proxy。 對配置的更改必須手動反映在節點元件上。
{{< /note >}}

<!--
#### Reflecting `ClusterConfiguration` changes on control plane nodes

kubeadm manages the control plane components as static Pod manifests located in
the directory `/etc/kubernetes/manifests`.
Any changes to the `ClusterConfiguration` under the `apiServer`, `controllerManager`, `scheduler` or `etcd`
keys must be reflected in the associated files in the manifests directory on a control plane node.
-->
#### 在控制平面節點上反映 `ClusterConfiguration` 更改

kubeadm 將控制平面元件作為位於 `/etc/kubernetes/manifests`
目錄中的靜態 Pod 清單進行管理。
對 `apiServer`、`controllerManager`、`scheduler` 或 `etcd`鍵下的
`ClusterConfiguration` 的任何更改都必須反映在控制平面節點上清單目錄中的關聯檔案中。

<!--
Such changes may include:
- `extraArgs` - requires updating the list of flags passed to a component container
- `extraMounts` - requires updated the volume mounts for a component container
- `*SANs` - requires writing new certificates with updated Subject Alternative Names.

Before proceeding with these changes, make sure you have backed up the directory `/etc/kubernetes/`.
-->

此類更改可能包括:
- `extraArgs` - 需要更新傳遞給元件容器的標誌列表
- `extraMounts` - 需要更新元件容器的卷掛載
- `*SANs` - 需要使用更新的主題備用名稱編寫新證書

在繼續進行這些更改之前，請確保你已備份目錄 `/etc/kubernetes/`。

<!--
To write new certificates you can use:

To write new manifest files in `/etc/kubernetes/manifests` you can use:
-->

要編寫新證書，你可以使用：

```shell
kubeadm init phase certs <component-name> --config <config-file>
```

要在 `/etc/kubernetes/manifests` 中編寫新的清單檔案，你可以使用：

```shell
kubeadm init phase control-plane <component-name> --config <config-file>
```

<!--
The `<config-file>` contents must match the updated `ClusterConfiguration`.
The `<component-name>` value must be the name of the component.
-->
`<config-file>` 內容必須與更新後的 `ClusterConfiguration` 匹配。
`<component-name>` 值必須是元件的名稱。

{{< note >}}
<!--
Updating a file in `/etc/kubernetes/manifests` will tell the kubelet to restart the static Pod for the corresponding component.
Try doing these changes one node at a time to leave the cluster without downtime.
-->
更新 `/etc/kubernetes/manifests` 中的檔案將告訴 kubelet 重新啟動相應元件的靜態 Pod。
嘗試一次對一個節點進行這些更改，以在不停機的情況下離開叢集。
{{< /note >}}

<!--
### Applying kubelet configuration changes

#### Updating the `KubeletConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
in a ConfigMap called `kubelet-config` in the `kube-system` namespace.

You can edit the ConfigMap with this command:

The configuration is located under the `data.kubelet` key.
-->
### 應用 kubelet 配置更改

#### 更新 `KubeletConfiguration`

在叢集建立和升級期間，kubeadm 將其 
[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 
寫入 `kube-system` 名稱空間中名為 `kubelet-config` 的 ConfigMap。
你可以使用以下命令編輯 ConfigMap：

```shell
kubectl edit cm -n kube-system kubelet-config
```

配置位於 `data.kubelet` 鍵下。

<!--
#### Reflecting the kubelet changes

To reflect the change on kubeadm nodes you must do the following:
- Log in to a kubeadm node
- Run `kubeadm upgrade node phase kubelet-config` to download the latest `kubelet-config`
ConfigMap contents into the local file `/var/lib/kubelet/config.conf`
- Edit the file `/var/lib/kubelet/kubeadm-flags.env` to apply additional configuration with
flags
- Restart the kubelet service with `systemctl restart kubelet`
-->
#### 反映 kubelet 的更改

要反映 kubeadm 節點上的更改，你必須執行以下操作：

- 登入到 kubeadm 節點
- 執行 `kubeadm upgrade node phase kubelet-config` 下載最新的
  `kubelet-config` ConfigMap 內容到本地檔案 `/var/lib/kubelet/config.conf`
- 編輯檔案 `/var/lib/kubelet/kubeadm-flags.env` 以使用標誌來應用額外的配置
- 使用 `systemctl restart kubelet` 重啟 kubelet 服務

{{< note >}}
<!--
Do these changes one node at a time to allow workloads to be rescheduled properly.
-->
一次執行一個節點的這些更改，以允許正確地重新安排工作負載。
{{< /note >}}

{{< note >}}
<!--
During `kubeadm upgrade`, kubeadm downloads the `KubeletConfiguration` from the
`kubelet-config` ConfigMap and overwrite the contents of `/var/lib/kubelet/config.conf`.
This means that node local configuration must be applied either by flags in
`/var/lib/kubelet/kubeadm-flags.env` or by manually updating the contents of
`/var/lib/kubelet/config.conf` after `kubeadm upgrade`, and then restarting the kubelet.
-->
在 `kubeadm upgrade` 期間，kubeadm 從 `kubelet-config` ConfigMap
下載 `KubeletConfiguration` 並覆蓋 `/var/lib/kubelet/config.conf` 的內容。
這意味著節點本地配置必須透過`/var/lib/kubelet/kubeadm-flags.env`中的標誌或在
kubeadm upgrade` 後手動更新`/var/lib/kubelet/config.conf`的內容來應用，然後重新啟動 kubelet。
{{< /note >}}

<!--
### Applying kube-proxy configuration changes

#### Updating the `KubeProxyConfiguration`

During cluster creation and upgrade, kubeadm writes its
[`KubeProxyConfiguration`](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
in a ConfigMap in the `kube-system` namespace called `kube-proxy`.

This ConfigMap is used by the `kube-proxy` DaemonSet in the `kube-system` namespace.

To change a particular option in the `KubeProxyConfiguration`, you can edit the ConfigMap with this command:

The configuration is located under the `data.config.conf` key.
-->
### 應用 kube-proxy 配置更改

#### 更新 `KubeProxyConfiguration`

在叢集建立和升級期間，kubeadm 將其寫入
[`KubeProxyConfiguration`](/zh-cn/docs/reference/config-api/kube-proxy-config.v1alpha1/) 
在名為 `kube-proxy` 的 `kube-system` 名稱空間中的 ConfigMap 中。

此 ConfigMap 由 `kube-system` 名稱空間中的 `kube-proxy` DaemonSet 使用。

要更改 `KubeProxyConfiguration` 中的特定選項，你可以使用以下命令編輯 ConfigMap：

```shell
kubectl edit cm -n kube-system kube-proxy
```

配置位於 `data.config.conf` 鍵下。

<!--
#### Reflecting the kube-proxy changes

Once the `kube-proxy` ConfigMap is updated, you can restart all kube-proxy Pods:

Obtain the Pod names:

Delete a Pod with:

New Pods that use the updated ConfigMap will be created.
-->
#### 反映 kube-proxy 的更改

更新 `kube-proxy` ConfigMap 後，你可以重新啟動所有 kube-proxy Pod：

獲取 Pod 名稱：

```shell
kubectl get po -n kube-system | grep kube-proxy
```

使用以下命令刪除 Pod：

```shell
kubectl delete po -n kube-system <pod-name>
```

將建立使用更新的 ConfigMap 的新 Pod。

{{< note >}}
<!--
Because kubeadm deploys kube-proxy as a DaemonSet, node specific configuration is unsupported.
-->
由於 kubeadm 將 kube-proxy 部署為 DaemonSet，因此不支援特定於節點的配置。
{{< /note >}}

<!--
### Applying CoreDNS configuration changes

#### Updating the CoreDNS Deployment and Service

kubeadm deploys CoreDNS as a Deployment called `coredns` and with a Service `kube-dns`,
both in the `kube-system` namespace.

To update any of the CoreDNS settings, you can edit the Deployment and
Service objects:
-->
### 應用 CoreDNS 配置更改

#### 更新 CoreDNS 的 Deployment 和 Service

kubeadm 將 CoreDNS 部署為名為 `coredns` 的 Deployment，並使用 Service `kube-dns`，
兩者都在 `kube-system` 名稱空間中。

要更新任何 CoreDNS 設定，你可以編輯 Deployment 和 Service：


```shell
kubectl edit deployment -n kube-system coredns
kubectl edit service -n kube-system kube-dns
```

<!--
#### Reflecting the CoreDNS changes

Once the CoreDNS changes are applied you can delete the CoreDNS Pods:

Obtain the Pod names:

Delete a Pod with:
-->
#### 反映 CoreDNS 的更改

應用 CoreDNS 更改後，你可以刪除 CoreDNS Pod。

獲取 Pod 名稱：

```shell
kubectl get po -n kube-system | grep coredns
```

使用以下命令刪除 Pod：

```shell
kubectl delete po -n kube-system <pod-name>
```

<!--
New Pods with the updated CoreDNS configuration will be created.
-->
將建立具有更新的 CoreDNS 配置的新 Pod。

{{< note >}}
<!--
kubeadm does not allow CoreDNS configuration during cluster creation and upgrade.
This means that if you execute `kubeadm upgrade apply`, your changes to the CoreDNS
-->
kubeadm 不允許在叢集建立和升級期間配置 CoreDNS。
這意味著如果執行了 `kubeadm upgrade apply`，你對 
CoreDNS 物件的更改將丟失並且必須重新應用。
{{< /note >}}

<!--
## Persisting the reconfiguration

During the execution of `kubeadm upgrade` on a managed node, kubeadm might overwrite configuration
that was applied after the cluster was created (reconfiguration).
-->
## 持久化重新配置

在受管節點上執行 `kubeadm upgrade` 期間，kubeadm 
可能會覆蓋在建立叢集（重新配置）後應用的配置。

<!--
### Persisting Node object reconfiguration

kubeadm writes Labels, Taints, CRI socket and other information on the Node object for a particular
Kubernetes node. To change any of the contents of this Node object you can use:
-->
### 持久化 Node 物件重新配置

kubeadm 在特定 Kubernetes 節點的 Node 物件上寫入標籤、汙點、CRI 
套接字和其他資訊。要更改此 Node 物件的任何內容，你可以使用：

```shell
kubectl edit no <node-name>
```

<!--
During `kubeadm upgrade` the contents of such a Node might get overwritten.
If you would like to persist your modifications to the Node object after upgrade,
you can prepare a [kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
and apply it to the Node object:
-->
在 `kubeadm upgrade` 期間，此類節點的內容可能會被覆蓋。
如果你想在升級後保留對 Node 物件的修改，你可以準備一個
[kubectl patch](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
並將其應用到 Node 物件：

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
#### 持久化控制平面元件重新配置

控制平面配置的主要來源是儲存在叢集中的 `ClusterConfiguration` 物件。
要擴充套件靜態 Pod 清單配置，可以使用 
[patches](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)。

這些補丁檔案必須作為檔案保留在控制平面節點上，以確保它們可以被 
`kubeadm upgrade ... --patches <directory>` 使用。

如果對 `ClusterConfiguration` 和磁碟上的靜態 Pod 清單進行了重新配置，則必須相應地更新節點特定補丁集。

<!--
#### Persisting kubelet reconfiguration

Any changes to the `KubeletConfiguration` stored in `/var/lib/kubelet/config.conf` will be overwritten on
`kubeadm upgrade` by downloading the contents of the cluster wide `kubelet-config` ConfigMap.
To persist kubelet node specific configuration either the file `/var/lib/kubelet/config.conf`
has to be updated manually post-upgrade or the file `/var/lib/kubelet/kubeadm-flags.env` can include flags.
The kubelet flags override the associated `KubeletConfiguration` options, but note that
some of the flags are deprecated.

A kubelet restart will be required after changing `/var/lib/kubelet/config.conf` or
`/var/lib/kubelet/kubeadm-flags.env`.
-->
#### 持久化 kubelet 重新配置

對儲存在 `/var/lib/kubelet/config.conf` 中的 `KubeletConfiguration` 
所做的任何更改都將在 `kubeadm upgrade` 時因為下載叢集範圍內的 `kubelet-config`
ConfigMap 的內容而被覆蓋。
要持久儲存 kubelet 節點特定的配置，檔案`/var/lib/kubelet/config.conf` 
必須在升級後手動更新，或者檔案`/var/lib/kubelet/kubeadm-flags.env` 可以包含標誌。
kubelet 標誌會覆蓋相關的 `KubeletConfiguration` 選項，但請注意，有些標誌已被棄用。

更改 `/var/lib/kubelet/config.conf` 或 `/var/lib/kubelet/kubeadm-flags.env` 
後需要重啟 kubelet。

{{% heading "whatsnext" %}}

<!--
- [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [Customizing components with the kubeadm API](/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [Certificate management with kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)
-->

- [升級 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)
- [使用 kubeadm API 自定義元件](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags)
- [使用 kubeadm 管理證書](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)