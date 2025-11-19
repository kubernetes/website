---
title: 通過配置文件設置 kubelet 參數
content_type: task
weight: 330
---
<!--
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet Parameters Via A Configuration File
content_type: task
weight: 330
--->

## {{% heading "prerequisites" %}}

<!--
Some steps in this page use the `jq` tool. If you don't have `jq`, you can
install it via your operating system's software sources, or fetch it from
[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/).

Some steps also involve installing `curl`, which can be installed via your
operating system's software sources.
-->
此頁面中的某些步驟使用 `jq` 工具。如果你沒有 `jq`，你可以通過操作系統的軟件源安裝它，或者從
[https://jqlang.github.io/jq/](https://jqlang.github.io/jq/) 中獲取它。

某些步驟還涉及安裝 `curl`，它可以通過操作系統的軟件源安裝。

<!-- overview -->

<!--
A subset of the kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.
--->
通過保存在硬盤的配置文件設置 kubelet 的部分配置參數，這可以作爲命令行參數的替代。

<!--
Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.
--->
建議通過配置文件的方式提供參數，因爲這樣可以簡化節點部署和配置管理。

<!-- steps -->

<!--
## Create the config file

The subset of the kubelet's configuration that can be configured via a file
is defined by the
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
struct.
-->
## 創建配置文件   {#create-config-file}

[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
結構體定義了可以通過文件配置的 kubelet 配置子集，

<!--
The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the kubelet has read permissions on the file.

Here is an example of what this file might look like:
-->
配置文件必須是這個結構體中參數的 JSON 或 YAML 表現形式。
確保 kubelet 可以讀取該文件。

下面是一個 kubelet 配置文件示例：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8"
port: 20250
serializeImagePulls: false
evictionHard:
    memory.available:  "100Mi"
    nodefs.available:  "10%"
    nodefs.inodesFree: "5%"
    imagefs.available: "15%"
    imagefs.inodesFree: "5%"
```

<!--
In this example, the kubelet is configured with the following settings:
-->
在此示例中，kubelet 配置爲以下設置：

<!--
1. `address`: The kubelet will serve on IP address `192.168.0.8`.
1. `port`: The kubelet will serve on port `20250`.
1. `serializeImagePulls`: Image pulls will be done in parallel.
1. `evictionHard`: The kubelet will evict Pods under one of the following conditions:

   - When the node's available memory drops below 100MiB.
   - When the node's main filesystem's available space is less than 10%.
   - When the image filesystem's available space is less than 15%.
   - When more than 95% of the node's main filesystem's inodes are in use.
-->
1. `address`：kubelet 將在 `192.168.0.8` IP 地址上提供服務。
2. `port`：kubelet 將在 `20250` 端口上提供服務。
3. `serializeImagePulls`：並行拉取鏡像。
4. `evictionHard`：kubelet 將在以下情況之一驅逐 Pod：

   - 當節點的可用內存降至 100MiB 以下時。
   - 當節點主文件系統的可用空間小於 10% 時。
   - 當鏡像文件系統的可用空間小於 15% 時。
   - 當節點主文件系統的 inode 超過 95% 正在使用時。

{{< note >}}
<!--
In the example, by changing the default value of only one parameter for
evictionHard, the default values of other parameters will not be inherited and
will be set to zero. In order to provide custom values, you should provide all
the threshold values respectively.
Alternatively, you can set the MergeDefaultEvictionSettings to true in the kubelet
configuration file, if any parameter is changed then the other parameters will inherit
their default values instead of 0.
-->
在此示例中，只更改 evictionHard 的一個參數的默認值，
這樣其他參數的默認值將不會被繼承，其他參數會被設置爲零。如果要提供自定義值，你應該分別設置所有閾值。
或者，你也可以在 kubelet 配置文件中將 MergeDefaultEvictionSettings 設置爲 true，
這樣如果修改了其中某個參數，其他參數將繼承其默認值，而不是被設爲 0。
{{< /note >}}

<!--
The `imagefs` is an optional filesystem that container runtimes use to store container
images and container writable layers.
-->
`imagefs` 是一個可選的文件系統，容器運行時使用它來存儲容器鏡像和容器可寫層。

<!--
## Start a kubelet process configured via the config file
--->
## 啓動通過配置文件配置的 kubelet 進程   {#start-kubelet-via-config-file}

{{< note >}}
<!--
If you use kubeadm to initialize your cluster, use the kubelet-config while creating your cluster with `kubeadm init`.
See [configuring kubelet using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/) for details.
-->
如果你使用 kubeadm 初始化你的集羣，在使用 `kubeadm init` 創建你的集羣的時候請使用 kubelet-config。
更多細節請閱讀[使用 kubeadm 配置 kubelet](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)。
{{< /note >}}

<!--
Start the kubelet with the `--config` flag set to the path of the kubelet's config file.
The kubelet will then load its config from this file.
-->
啓動 kubelet 需要將 `--config` 參數設置爲 kubelet 配置文件的路徑。kubelet 將從此文件加載其配置。

<!--
Note that command line flags which target the same value as a config file will override that value.
This helps ensure backwards compatibility with the command-line API.
-->
請注意，命令行參數與配置文件有相同的值時，就會覆蓋配置文件中的該值。
這有助於確保命令行 API 的向後兼容性。

<!--
Note that relative file paths in the kubelet config file are resolved relative to the
location of the kubelet config file, whereas relative paths in command line flags are resolved
relative to the kubelet's current working directory.
-->
請注意，kubelet 配置文件中的相對文件路徑是相對於 kubelet 配置文件的位置解析的，
而命令行參數中的相對路徑是相對於 kubelet 的當前工作目錄解析的。

<!--
Note that some default values differ between command-line flags and the kubelet config file.
If `--config` is provided and the values are not specified via the command line, the
defaults for the `KubeletConfiguration` version apply.
In the above example, this version is `kubelet.config.k8s.io/v1beta1`.
--->
請注意，命令行參數和 kubelet 配置文件的某些默認值不同。
如果設置了 `--config`，並且沒有通過命令行指定值，則 `KubeletConfiguration`
版本的默認值生效。在上面的例子中，version 是 `kubelet.config.k8s.io/v1beta1`。

<!--
## Drop-in directory for kubelet configuration files {#kubelet-conf-d}
-->
## kubelet 配置文件的插件目錄   {#kubelet-conf-d}

{{<feature-state for_k8s_version="v1.30" state="beta" >}}

<!--
You can specify a drop-in configuration directory for the kubelet. By default, the kubelet does not look
for drop-in configuration files anywhere - you must specify a path.
For example: `--config-dir=/etc/kubernetes/kubelet.conf.d`
-->
你可以爲 kubelet 指定一個插件配置目錄。默認情況下，kubelet
不會在任何地方查找插件配置文件 - 你必須指定路徑。
例如：`--config-dir=/etc/kubernetes/kubelet.conf.d`

<!--
For Kubernetes v1.28 to v1.29, you can only specify `--config-dir` if you also set
the environment variable `KUBELET_CONFIG_DROPIN_DIR_ALPHA` for the kubelet process (the value
of that variable does not matter).
-->
對於 Kubernetes v1.28 到 v1.29，如果你還爲 kubelet
進程設置了環境變量 `KUBELET_CONFIG_DROPIN_DIR_ALPHA`（該變量的值無關緊要），
則只能指定 `--config-dir`。

{{< note >}}
<!--
The suffix of a valid kubelet drop-in configuration file **must** be `.conf`. For instance: `99-kubelet-address.conf`
-->
合法的 kubelet 插件配置文件的後綴**必須**爲 `.conf`。例如 `99-kubelet-address.conf`。
{{< /note >}}

<!--
The kubelet processes files in its config drop-in directory by sorting the **entire file name** alphanumerically.
For instance, `00-kubelet.conf` is processed first, and then overridden with a file named `01-kubelet.conf`.
-->
kubelet 通過按字母數字順序對**整個文件名**進行排序來處理其配置插件目錄中的文件。
例如，首先處理 `00-kubelet.conf`，然後用名爲 `01-kubelet.conf` 的文件覆蓋。

<!--
These files may contain partial configurations but should not be invalid and must include type metadata, specifically `apiVersion` and `kind`.
Validation is only performed on the final resulting configuration structure stored internally in the kubelet.
This offers flexibility in managing and merging kubelet configurations from different sources while preventing undesirable configurations. 
However, it is important to note that behavior varies based on the data type of the configuration fields.
-->
這些文件可能包含部分配置，但不應無效，並且必須包含類型元數據，特別是 `apiVersion` 和 `kind`。
僅對 kubelet 內部存儲的、最終生成的配置結構執行驗證。
這爲管理和合並來自不同來源的 kubelet 配置提供了靈活性，同時防止了不需要的配置。
但是，請務必注意，產生的行爲會根據配置字段的數據類型而有所不同。

<!--
Different data types in the kubelet configuration structure merge differently. See the
[reference document](/docs/reference/node/kubelet-config-directory-merging)
for more information.
-->
kubelet 配置結構中不同數據類型的合併方式不同。
有關詳細信息，請參閱[參考文檔](/zh-cn/docs/reference/node/kubelet-config-directory-merging)。

<!--
### Kubelet configuration merging order
-->
### kubelet 配置合併順序    {#kubelet-configuration-merging-order}

<!--
On startup, the kubelet merges configuration from:

* Feature gates specified over the command line (lowest precedence).
* The kubelet configuration.
* Drop-in configuration files, according to sort order.
* Command line arguments excluding feature gates (highest precedence).
-->
在啓動時，kubelet 會合並來自以下幾部分的配置：

* 在命令行中指定的特性門控（優先級最低）。
* kubelet 配置文件。
* 排序的插件配置文件。
* 不包括特性門控的命令行參數（優先級最高）。

{{< note >}}
<!--
The config drop-in dir mechanism for the kubelet is similar but different from how the `kubeadm` tool allows you to patch configuration.
The `kubeadm` tool uses a specific [patching strategy](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)
for its configuration, whereas the only patch strategy for kubelet configuration drop-in files is `replace`.
The kubelet determines the order of merges based on sorting the **suffixes** alphanumerically,
and replaces every field present in a higher priority file.
-->
kubelet 的配置插件目錄機制類似，但與 `kubeadm` 工具允許 patch 配置的方式不同。
`kubeadm` 工具使用特定的[補丁策略](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#patches)，
而 kubelet 配置插件文件的唯一補丁策略是 `replace`。kubelet 根據字母數字對**後綴**進行排序來確定合併順序，
並替換更高優先級文件中存在的每個字段。
{{< /note >}}

<!--
## Viewing the kubelet configuration
-->
## 查看 kubelet 配置   {#viewing-the-kubelet-configuration}

<!--
Since the configuration could now be spread over multiple files with this feature, if someone wants to inspect the final actuated configuration,
they can follow these steps to inspect the kubelet configuration:
-->
由於現在可以使用此特性將配置分佈在多個文件中，因此如果有人想要檢查最終啓動的配置，
他們可以按照以下步驟檢查 kubelet 配置：

<!--
1. Start a proxy server using [`kubectl proxy`](/docs/reference/kubectl/generated/kubectl_proxy/) in your terminal.
-->
1. 在終端中使用 [`kubectl proxy`](/zh-cn/docs/reference/kubectl/generated/kubectl_proxy/) 啓動代理服務器。

   ```bash
   kubectl proxy
   ```

   <!--
   Which gives output like:
   -->
   其輸出如下：

   ```none
   Starting to serve on 127.0.0.1:8001
   ```

<!--
1. Open another terminal window and use `curl` to fetch the kubelet configuration.
   Replace `<node-name>` with the actual name of your node:
-->
2. 打開另一個終端窗口並使用 `curl` 來獲取 kubelet 配置。
   將 `<node-name>` 替換爲節點的實際名稱：

   ```bash
   curl -X GET http://127.0.0.1:8001/api/v1/nodes/<node-name>/proxy/configz | jq .
   ```

   ```json
   {
     "kubeletconfig": {
       "enableServer": true,
       "staticPodPath": "/var/run/kubernetes/static-pods",
       "syncFrequency": "1m0s",
       "fileCheckFrequency": "20s",
       "httpCheckFrequency": "20s",
       "address": "192.168.1.16",
       "port": 10250,
       "readOnlyPort": 10255,
       "tlsCertFile": "/var/lib/kubelet/pki/kubelet.crt",
       "tlsPrivateKeyFile": "/var/lib/kubelet/pki/kubelet.key",
       "rotateCertificates": true,
       "authentication": {
         "x509": {
           "clientCAFile": "/var/run/kubernetes/client-ca.crt"
         },
         "webhook": {
           "enabled": true,
           "cacheTTL": "2m0s"
         },
         "anonymous": {
           "enabled": true
         }
       },
       "authorization": {
         "mode": "AlwaysAllow",
         "webhook": {
           "cacheAuthorizedTTL": "5m0s",
           "cacheUnauthorizedTTL": "30s"
         }
       },
       "registryPullQPS": 5,
       "registryBurst": 10,
       "eventRecordQPS": 50,
       "eventBurst": 100,
       "enableDebuggingHandlers": true,
       "healthzPort": 10248,
       "healthzBindAddress": "127.0.0.1",
       "oomScoreAdj": -999,
       "clusterDomain": "cluster.local",
       "clusterDNS": [
         "10.0.0.10"
       ],
       "streamingConnectionIdleTimeout": "4h0m0s",
       "nodeStatusUpdateFrequency": "10s",
       "nodeStatusReportFrequency": "5m0s",
       "nodeLeaseDurationSeconds": 40,
       "imageMinimumGCAge": "2m0s",
       "imageMaximumGCAge": "0s",
       "imageGCHighThresholdPercent": 85,
       "imageGCLowThresholdPercent": 80,
       "volumeStatsAggPeriod": "1m0s",
       "cgroupsPerQOS": true,
       "cgroupDriver": "systemd",
       "cpuManagerPolicy": "none",
       "cpuManagerReconcilePeriod": "10s",
       "memoryManagerPolicy": "None",
       "topologyManagerPolicy": "none",
       "topologyManagerScope": "container",
       "runtimeRequestTimeout": "2m0s",
       "hairpinMode": "promiscuous-bridge",
       "maxPods": 110,
       "podPidsLimit": -1,
       "resolvConf": "/run/systemd/resolve/resolv.conf",
       "cpuCFSQuota": true,
       "cpuCFSQuotaPeriod": "100ms",
       "nodeStatusMaxImages": 50,
       "maxOpenFiles": 1000000,
       "contentType": "application/vnd.kubernetes.protobuf",
       "kubeAPIQPS": 50,
       "kubeAPIBurst": 100,
       "serializeImagePulls": true,
       "evictionHard": {
         "imagefs.available": "15%",
         "memory.available": "100Mi",
         "nodefs.available": "10%",
         "nodefs.inodesFree": "5%",
         "imagefs.inodesFree": "5%"
       },
       "evictionPressureTransitionPeriod": "1m0s",
       "mergeDefaultEvictionSettings": false,
       "enableControllerAttachDetach": true,
       "makeIPTablesUtilChains": true,
       "iptablesMasqueradeBit": 14,
       "iptablesDropBit": 15,
       "featureGates": {
         "AllAlpha": false
       },
       "failSwapOn": false,
       "memorySwap": {},
       "containerLogMaxSize": "10Mi",
       "containerLogMaxFiles": 5,
       "configMapAndSecretChangeDetectionStrategy": "Watch",
       "enforceNodeAllocatable": [
         "pods"
       ],
       "volumePluginDir": "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/",
       "logging": {
         "format": "text",
         "flushFrequency": "5s",
         "verbosity": 3,
         "options": {
           "json": {
             "infoBufferSize": "0"
           }
         }
       },
       "enableSystemLogHandler": true,
       "enableSystemLogQuery": false,
       "shutdownGracePeriod": "0s",
       "shutdownGracePeriodCriticalPods": "0s",
       "enableProfilingHandler": true,
       "enableDebugFlagsHandler": true,
       "seccompDefault": false,
       "memoryThrottlingFactor": 0.9,
       "registerNode": true,
       "localStorageCapacityIsolation": true,
       "containerRuntimeEndpoint": "unix:///var/run/crio/crio.sock"
     }
   }
   ```

<!-- discussion -->

## {{% heading "whatsnext" %}}

<!--
- Learn more about kubelet configuration by checking the
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  reference.
- Learn more about kubelet configuration merging in the
  [reference document](/docs/reference/node/kubelet-config-directory-merging).
--->
- 參閱 [`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)
  進一步學習 kubelet 的配置。
- 在[參考文檔](/zh-cn/docs/reference/node/kubelet-config-directory-merging)中瞭解有關
  kubelet 配置合併的更多信息。
