---
title: 排查 CNI 外掛相關的錯誤
content_type: task
weight: 10
---
<!--
title: Troubleshooting CNI plugin-related errors
content_type: task
reviewers:
- mikebrow
- divya-mohan0209
weight: 10
-->

<!-- overview -->

<!--
To avoid CNI plugin-related errors, verify that you are using or upgrading to a
container runtime that has been tested to work correctly with your version of
Kubernetes.
-->

為了避免 CNI 外掛相關的錯誤，需要驗證你正在使用或升級到一個經過測試的容器執行時，
該容器執行時能夠在你的 Kubernetes 版本上正常工作。

<!--
For example, the following container runtimes are being prepared, or have already been prepared, for Kubernetes v1.24:

* containerd v1.6.4 and later, v1.5.11 and later
* The CRI-O v1.24.0 and later
-->

例如，針對 Kubernetes v1.24 而言，以下容器執行時正在準備或已經就緒：

* containerd v1.6.4 及更新版本、v1.5.11 及更新版本
* CRI-O v1.24.0 及更新版本

<!--
## About the "Incompatible CNI versions" and "Failed to destroy network for sandbox" errors
-->

## 關於 "Incompatible CNI versions" 和 "Failed to destroy network for sandbox" 錯誤   {#about-the-incompatible-cni-versions-and-failed-to-destroy-network-for-sandbox-errors} 

<!--
Service issues exist for pod CNI network setup and tear down in containerd
v1.6.0-v1.6.3 when the CNI plugins have not been upgraded and/or the CNI config
version is not declared in the CNI config files. The containerd team reports, "these issues are resolved in containerd v1.6.4."
With containerd v1.6.0-v1.6.3, if you do not upgrade the CNI plugins and/or
declare the CNI config version, you might encounter the following "Incompatible
CNI versions" or "Failed to destroy network for sandbox" error conditions.
-->

在 containerd v1.6.0-v1.6.3 中，當配置或清除 Pod CNI 網路時，如果 CNI 外掛沒有升級和/或
CNI 配置檔案中沒有宣告 CNI 配置版本時，會出現服務問題。containerd 團隊報告說：
“這些問題在 containerd v1.6.4 中得到了解決。”

在使用 containerd v1.6.0-v1.6.3 時，如果你不升級 CNI 外掛和/或宣告 CNI 配置版本，
你可能會遇到以下 "Incompatible CNI versions" 或 "Failed to destroy network for sandbox"
錯誤狀況。

<!--
### Incompatible CNI versions error
-->

### Incompatible CNI versions 錯誤   {#incompatible-cni-versions-error}

<!--
If the version of your CNI plugin does not correctly match the plugin version in
the config because the config version is later than the plugin version, the
containerd log will likely show an error message on startup of a pod similar
to:
-->

如果因為配置版本比外掛版本新，導致你的 CNI 外掛版本與配置中的外掛版本無法正確匹配時，
在啟動 Pod 時，containerd 日誌可能會顯示類似的錯誤資訊：

```
incompatible CNI versions; config is \"1.0.0\", plugin supports [\"0.1.0\" \"0.2.0\" \"0.3.0\" \"0.3.1\" \"0.4.0\"]"
```

<!--
To fix this issue, [update your CNI plugins and CNI config files](#updating-your-cni-plugins-and-cni-config-files).
-->

為了解決這個問題，需要[更新你的 CNI 外掛和 CNI 配置檔案](#updating-your-cni-plugins-and-cni-config-files)。

<!--
### Failed to destroy network for sandbox error
-->

### Failed to destroy network for sandbox 錯誤   {#failed-to-destroy-network-for-sandbox-error} 

<!--
If the version of the plugin is missing in the CNI plugin config, the pod may
run. However, stopping the pod generates an error similar to:
-->

如果 CNI 外掛配置中未給出外掛的版本，
Pod 可能可以執行。但是，停止 Pod 時會產生類似於以下錯誤：

```
ERRO[2022-04-26T00:43:24.518165483Z] StopPodSandbox for "b" failed
error="failed to destroy network for sandbox \"bbc85f891eaf060c5a879e27bba9b6b06450210161dfdecfbb2732959fb6500a\": invalid version \"\": the version is empty"
```

<!--
This error leaves the pod in the not-ready state with a network namespace still
attached. To recover from this problem, [edit the CNI config file](#updating-your-cni-plugins-and-cni-config-files) to add
the missing version information. The next attempt to stop the pod should
be successful.
-->

此錯誤使 Pod 處於未就緒狀態，且仍然掛接到某網路名字空間上。
為修復這一問題，[編輯 CNI 配置檔案](#updating-your-cni-plugins-and-cni-config-files)以新增缺失的版本資訊。
下一次嘗試停止 Pod 應該會成功。

<!--
### Updating your CNI plugins and CNI config files
-->

### 更新你的 CNI 外掛和 CNI 配置檔案   {#updating-your-cni-plugins-and-cni-config-files}

<!--
If you're using containerd v1.6.0-v1.6.3 and encountered "Incompatible CNI
versions" or "Failed to destroy network for sandbox" errors, consider updating
your CNI plugins and editing the CNI config files.

Here's an overview of the typical steps for each node:
-->

如果你使用 containerd v1.6.0-v1.6.3 並遇到 "Incompatible CNI versions" 或者
"Failed to destroy network for sandbox" 錯誤，考慮更新你的 CNI 外掛並編輯 CNI 配置檔案。

以下是針對各節點要執行的典型步驟的概述：

<!--
1. [Safely drain and cordon the
node](/docs/tasks/administer-cluster/safely-drain-node/).
-->

1. [安全地騰空並隔離節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。

<!--
2. After stopping your container runtime and kubelet services, perform the
following upgrade operations:
  - If you're running CNI plugins, upgrade them to the latest version.
  - If you're using non-CNI plugins, replace them with CNI plugins. Use the
  latest version of the plugins.
  - Update the plugin configuration file to specify or match a version of the
  CNI specification that the plugin supports, as shown in the following ["An
  example containerd configuration
  file"](#an-example-containerd-configuration-file) section.
  - For `containerd`, ensure that you have installed the latest version (v1.0.0
  or later) of the CNI loopback plugin.
  - Upgrade node components (for example, the kubelet) to Kubernetes v1.24
  - Upgrade to or install the most current version of the container runtime.
-->

2. 停止容器執行時和 kubelet 服務後，執行以下升級操作：
  - 如果你正在執行 CNI 外掛，請將它們升級到最新版本。
  - 如果你使用的是非 CNI 外掛，請將它們替換為 CNI 外掛，並使用最新版本的外掛。
  - 更新外掛配置檔案以指定或匹配 CNI 規範支援的外掛版本，
    如後文["containerd 配置檔案示例"](#an-example-containerd-configuration-file)章節所示。
  - 對於 `containerd`，請確保你已安裝 CNI loopback 外掛的最新版本（v1.0.0 或更高版本）。
  - 將節點元件（例如 kubelet）升級到 Kubernetes v1.24
  - 升級到或安裝最新版本的容器執行時。

<!--
3. Bring the node back into your cluster by restarting your container runtime
and kubelet. Uncordon the node (`kubectl uncordon <nodename>`).
-->

3. 透過重新啟動容器執行時和 kubelet 將節點重新加入到叢集。取消節點隔離（`kubectl uncordon <nodename>`）。

<!--
## An example containerd configuration file
-->

## containerd 配置檔案示例   {#an-example-containerd-configuration-file}

<!--
The following example shows a configuration for `containerd` runtime v1.6.x,
which supports a recent version of the CNI specification (v1.0.0).
Please see the documentation from your plugin and networking provider for
further instructions on configuring your system.
-->

以下示例顯示了 `containerd` 執行時 v1.6.x 的配置，
它支援最新版本的 CNI 規範（v1.0.0）。
請參閱你的外掛和網路提供商的文件，以獲取有關你係統配置的進一步說明。

<!--
On Kubernetes, containerd runtime adds a loopback interface, `lo`, to pods as a
default behavior. The containerd runtime configures the loopback interface via a
CNI plugin, `loopback`. The `loopback` plugin is distributed as part of the
`containerd` release packages that have the `cni` designation. `containerd`
v1.6.0 and later includes a CNI v1.0.0-compatible loopback plugin as well as
other default CNI plugins. The configuration for the loopback plugin is done
internally by containerd, and is set to use CNI v1.0.0. This also means that the
version of the `loopback` plugin must be v1.0.0 or later when this newer version
`containerd` is started.
-->

在 Kubernetes 中，作為其預設行為，containerd 執行時為 Pod 新增一個本地迴路介面，`lo`。
containerd 執行時透過 CNI 外掛 `loopback` 配置本地迴路介面。  
`loopback` 外掛作為 `containerd` 釋出包的一部分，扮演 `cni` 角色。
`containerd` v1.6.0 及更高版本包括與 CNI v1.0.0 相容的 loopback 外掛以及其他預設 CNI 外掛。
loopback 外掛的配置由 containerd 內部完成， 並被設定為使用 CNI v1.0.0。
這也意味著當這個更新版本的 `containerd` 啟動時，`loopback` 外掛的版本必然是 v1.0.0 或更高版本。

<!--
The following bash command generates an example CNI config. Here, the 1.0.0
value for the config version is assigned to the `cniVersion` field for use when
`containerd` invokes the CNI bridge plugin.
-->

以下 Bash 命令生成一個 CNI 配置示例。這裡，`cniVersion` 欄位被設定為配置版本值 1.0.0，
以供 `containerd` 呼叫 CNI 橋接外掛時使用。

```bash
cat << EOF | tee /etc/cni/net.d/10-containerd-net.conflist
{
 "cniVersion": "1.0.0",
 "name": "containerd-net",
 "plugins": [
   {
     "type": "bridge",
     "bridge": "cni0",
     "isGateway": true,
     "ipMasq": true,
     "promiscMode": true,
     "ipam": {
       "type": "host-local",
       "ranges": [
         [{
           "subnet": "10.88.0.0/16"
         }],
         [{
           "subnet": "2001:db8:4860::/64"
         }]
       ],
       "routes": [
         { "dst": "0.0.0.0/0" },
         { "dst": "::/0" }
       ]
     }
   },
   {
     "type": "portmap",
     "capabilities": {"portMappings": true}
   }
 ]
}
EOF
```

<!--
Update the IP address ranges in the preceding example with ones that are based
on your use case and network addressing plan.
-->

基於你的用例和網路地址規劃，將前面示例中的 IP 地址範圍更新為合適的值。

