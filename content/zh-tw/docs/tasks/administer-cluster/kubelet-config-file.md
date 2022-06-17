---
title: 透過配置檔案設定 Kubelet 引數
content_type: task
---
<!--
reviewers:
- mtaufen
- dawnchen
title: Set Kubelet parameters via a config file
content_type: task
--->

<!-- overview -->

<!--
A subset of the Kubelet's configuration parameters may be
set via an on-disk config file, as a substitute for command-line flags.
--->
透過儲存在硬碟的配置檔案設定 kubelet 的部分配置引數，這可以作為命令列引數的替代。

<!--
Providing parameters via a config file is the recommended approach because
it simplifies node deployment and configuration management.
--->
建議透過配置檔案的方式提供引數，因為這樣可以簡化節點部署和配置管理。

<!-- steps -->

<!--
## Create the config file

The subset of the Kubelet's configuration that can be configured via a file
is defined by the
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
struct.
-->
## 建立配置檔案

[`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 結構體定義了可以透過檔案配置的 Kubelet 配置子集，

<!--
The configuration file must be a JSON or YAML representation of the parameters
in this struct. Make sure the Kubelet has read permissions on the file.

Here is an example of what this file might look like:
-->
配置檔案必須是這個結構體中引數的 JSON 或 YAML 表現形式。
確保 kubelet 可以讀取該檔案。

下面是一個 Kubelet 配置檔案示例：
```
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
address: "192.168.0.8",
port: 20250,
serializeImagePulls: false,
evictionHard:
    memory.available:  "200Mi"
```


<!--
In the example, the Kubelet is configured to serve on IP address 192.168.0.8 and port 20250, pull images in parallel,
and evict Pods when available memory drops below 200Mi.
All other Kubelet configuration values are left at their built-in defaults, unless overridden
by flags. Command line flags which target the same value as a config file will override that value.
-->
在這個示例中, Kubelet 被設定為在地址 192.168.0.8 埠 20250 上提供服務，以並行方式拖拽映象，
當可用記憶體低於 200Mi 時, kubelet 將會開始驅逐 Pods。
沒有宣告的其餘配置項都將使用預設值，除非使用命令列引數來過載。 
命令列中的引數將會覆蓋配置檔案中的對應值。

<!--
## Start a Kubelet process configured via the config file

{{< note >}}
If you use kubeadm to initialize your cluster, use the kubelet-config while creating your cluster with `kubeadmin init`.
See [configuring kubelet using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/) for details.
{{< /note >}}

Start the Kubelet with the `--config` flag set to the path of the Kubelet's config file.
The Kubelet will then load its config from this file.
--->

## 啟動透過配置檔案配置的 Kubelet 程序

{{< note >}}
如果你使用 kubeadm 初始化你的叢集，在使用 `kubeadmin init` 建立你的叢集的時候請使用 kubelet-config。
更多細節請閱讀[使用 kubeadm 配置 kubelet](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration/)
{{< /note >}}

啟動 Kubelet 需要將 `--config` 引數設定為 Kubelet 配置檔案的路徑。Kubelet 將從此檔案載入其配置。

<!--
Note that command line flags which target the same value as a config file will override that value.
This helps ensure backwards compatibility with the command-line API.
-->
請注意，命令列引數與配置檔案有相同的值時，就會覆蓋配置檔案中的該值。
這有助於確保命令列 API 的向後相容性。

<!--
Note that relative file paths in the Kubelet config file are resolved relative to the
location of the Kubelet config file, whereas relative paths in command line flags are resolved
relative to the Kubelet's current working directory.
-->
請注意，kubelet 配置檔案中的相對檔案路徑是相對於 kubelet 配置檔案的位置解析的，
而命令列引數中的相對路徑是相對於 kubelet 的當前工作目錄解析的。

<!--
Note that some default values differ between command-line flags and the Kubelet config file.
If `--config` is provided and the values are not specified via the command line, the
defaults for the `KubeletConfiguration` version apply.
In the above example, this version is `kubelet.config.k8s.io/v1beta1`.
--->
請注意，命令列引數和 Kubelet 配置檔案的某些預設值不同。
如果設定了 `--config`，並且沒有透過命令列指定值，則 `KubeletConfiguration`
版本的預設值生效。在上面的例子中，version 是 `kubelet.config.k8s.io/v1beta1`。

<!-- discussion -->

## {{% heading "whatsnext" %}}

<!--
- Learn more about kubelet configuration by checking the
  [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
  reference.
--->
- 參閱 [`KubeletConfiguration`](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/) 
  進一步學習 kubelet 的配置。
