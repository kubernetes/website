---
content_type: task
title: 節點健康監測
weight: 20
---
<!-- 
title: Monitor Node Health
content_type: task
reviewers:
- Random-Liu
- dchen1107
weight: 20
-->

<!-- overview -->
<!-- 
*Node Problem Detector* is a daemon for monitoring and reporting about a node's health.
You can run Node Problem Detector as a `DaemonSet` or as a standalone daemon.
Node Problem Detector collects information about node problems from various daemons
and reports these conditions to the API server as [NodeCondition](/docs/concepts/architecture/nodes/#condition)
and [Event](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core). 

To learn how to install and use Node Problem Detector, see
[Node Problem Detector project documentation](https://github.com/kubernetes/node-problem-detector).
-->

*節點問題檢測器（Node Problem Detector）* 是一個守護程式，用於監視和報告節點的健康狀況。
你可以將節點問題探測器以 `DaemonSet` 或獨立守護程式執行。
節點問題檢測器從各種守護程序收集節點問題，並以
[NodeCondition](/zh-cn/docs/concepts/architecture/nodes/#condition) 和
[Event](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core)
的形式報告給 API 伺服器。 

要了解如何安裝和使用節點問題檢測器，請參閱
[節點問題探測器專案文件](https://github.com/kubernetes/node-problem-detector)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!-- 
## Limitations 

* Node Problem Detector only supports file based kernel log.
  Log tools such as `journald` are not supported.

* Node Problem Detector uses the kernel log format for reporting kernel issues.
  To learn how to extend the kernel log format, see [Add support for another log format](#support-other-log-format).
-->
## 侷限性  {#limitations}

* 節點問題檢測器只支援基於檔案型別的核心日誌。
  它不支援像 journald 這樣的命令列日誌工具。
* 節點問題檢測器使用核心日誌格式來報告核心問題。
  要了解如何擴充套件核心日誌格式，請參閱[新增對另一個日誌格式的支援](#support-other-log-format)。

<!-- 
## Enabling Node Problem Detector

Some cloud providers enable Node Problem Detector as an {{< glossary_tooltip text="Addon" term_id="addons" >}}.
You can also enable Node Problem Detector with `kubectl` or by creating an Addon pod.
-->
## 啟用節點問題檢測器

一些雲供應商將節點問題檢測器以{{< glossary_tooltip text="外掛" term_id="addons" >}}形式啟用。
你還可以使用 `kubectl` 或建立外掛 Pod 來啟用節點問題探測器。

<!-- 
## Using kubectl to enable Node Problem Detector {#using-kubectl}

`kubectl` provides the most flexible management of Node Problem Detector.
You can overwrite the default configuration to fit it into your environment or
to detect customized node problems. For example:
-->
## 使用 kubectl 啟用節點問題檢測器 {#using-kubectl}

`kubectl` 提供了節點問題探測器最靈活的管理。
你可以覆蓋預設配置使其適合你的環境或檢測自定義節點問題。例如：

<!-- 
1. Create a Node Problem Detector configuration similar to `node-problem-detector.yaml`:

   {{< codenew file="debug/node-problem-detector.yaml" >}}

   {{< note >}}
   You should verify that the system log directory is right for your operating system distribution.
   {{< /note >}}

1. Start node problem detector with `kubectl`:

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```
-->
1. 建立類似於 `node-strought-detector.yaml` 的節點問題檢測器配置：
   {{< codenew file="debug/node-problem-detector.yaml" >}}

   {{< note >}}
   你應該檢查系統日誌目錄是否適用於作業系統發行版本。
   {{< /note >}}

1. 使用 `kubectl` 啟動節點問題檢測器：

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```

<!-- 
### Using an Addon pod to enable Node Problem Detector {#using-addon-pod}

If you are using a custom cluster bootstrap solution and don't need
to overwrite the default configuration, you can leverage the Addon pod to
further automate the deployment.

Create `node-problem-detector.yaml`, and save the configuration in the Addon pod's
directory `/etc/kubernetes/addons/node-problem-detector` on a control plane node.
-->
### 使用外掛 pod 啟用節點問題檢測器 {#using-addon-pod}

如果你使用的是自定義叢集引導解決方案，不需要覆蓋預設配置，
可以利用外掛 Pod 進一步自動化部署。

建立 `node-strick-detector.yaml`，並在控制平面節點上儲存配置到外掛 Pod 的目錄
`/etc/kubernetes/addons/node-problem-detector`。

<!-- 
## Overwrite the Configuration 

The [default configuration](https://github.com/kubernetes/node-problem-detector/tree/v0.1/config)
is embedded when building the Docker image of Node Problem Detector.
-->
## 覆蓋配置檔案

構建節點問題檢測器的 docker 映象時，會嵌入
[預設配置](https://github.com/kubernetes/node-problem-detector/tree/v0.1/config)。

<!-- 
However, you can use a [`ConfigMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/)
to overwrite the configuration:
-->
不過，你可以像下面這樣使用 [`ConfigMap`](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
將其覆蓋：

<!-- 
1. Change the configuration files in `config/`
1. Create the `ConfigMap` `node-problem-detector-config`:

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. Change the `node-problem-detector.yaml` to use the `ConfigMap`:

   {{< codenew file="debug/node-problem-detector-configmap.yaml" >}}

1. Recreate the Node Problem Detector with the new configuration file:

   ```shell
   # If you have a node-problem-detector running, delete before recreating
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```
 -->
1. 更改 `config/` 中的配置檔案
1. 建立 `ConfigMap` `node-strick-detector-config`：
   
   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. 更改 `node-problem-detector.yaml` 以使用 ConfigMap:
   
   {{< codenew file="debug/node-problem-detector-configmap.yaml" >}}

1. 使用新的配置檔案重新建立節點問題檢測器：

    ```shell
   # 如果你正在執行節點問題檢測器，請先刪除，然後再重新建立
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

<!--  
{{< note >}}
This approach only applies to a Node Problem Detector started with `kubectl`.
{{< /note >}}

Overwriting a configuration is not supported if a Node Problem Detector runs as a cluster Addon.
The Addon manager does not support `ConfigMap`.
-->
{{< note >}}
此方法僅適用於透過 `kubectl` 啟動的節點問題檢測器。
{{< /note >}}

如果節點問題檢測器作為叢集外掛執行，則不支援覆蓋配置。
外掛管理器不支援 `ConfigMap`。

<!-- 
## Kernel Monitor 

*Kernel Monitor* is a system log monitor daemon supported in the Node Problem Detector.
Kernel monitor watches the kernel log and detects known kernel issues following predefined rules.
-->
## 核心監視器

*核心監視器（Kernel Monitor）* 是節點問題檢測器中支援的系統日誌監視器守護程序。
核心監視器觀察核心日誌並根據預定義規則檢測已知的核心問題。

<!-- 
The Kernel Monitor matches kernel issues according to a set of predefined rule list in
[`config/kernel-monitor.json`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/config/kernel-monitor.json). The rule list is extensible. You can expand the rule list by overwriting the
configuration.
-->
核心監視器根據 [`config/kernel-monitor.json`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/config/kernel-monitor.json)
中的一組預定義規則列表匹配核心問題。
規則列表是可擴充套件的，你始終可以透過覆蓋配置來擴充套件它。

<!-- 
### Add new NodeConditions 

To support a new `NodeCondition`, create a condition definition within the `conditions` field in
`config/kernel-monitor.json`, for example:
```
-->
### 新增新的 NodeCondition

要支援新的 `NodeCondition`，請在 `config/kernel-monitor.json` 中的
`conditions` 欄位中建立一個條件定義：

```json
{
  "type": "NodeConditionType",
  "reason": "CamelCaseDefaultNodeConditionReason",
  "message": "arbitrary default node condition message"
}
```

<!-- 
### Detect new problems 

To detect new problems, you can extend the `rules` field in `config/kernel-monitor.json`
with a new rule definition:
-->
### 檢測新的問題

你可以使用新的規則描述來擴充套件 `config/kernel-monitor.json` 中的 `rules` 欄位以檢測新問題：

```json
{
  "type": "temporary/permanent",
  "condition": "NodeConditionOfPermanentIssue",
  "reason": "CamelCaseShortReason",
  "message": "regexp matching the issue in the kernel log"
}
```

<!-- 
### Configure path for the kernel log device {#kernel-log-device-path}

Check your kernel log path location in your operating system (OS) distribution.
The Linux kernel [log device](https://www.kernel.org/doc/Documentation/ABI/testing/dev-kmsg) is usually presented as `/dev/kmsg`. However, the log path location varies by OS distribution.
The `log` field in `config/kernel-monitor.json` represents the log path inside the container.
You can configure the `log` field to match the device path as seen by the Node Problem Detector.
-->
### 配置核心日誌裝置的路徑 {#kernel-log-device-path}

檢查你的作業系統（OS）發行版本中的核心日誌路徑位置。
Linux 核心[日誌裝置](https://www.kernel.org/doc/documentation/abi/testing/dev-kmsg)
通常呈現為 `/dev/kmsg`。
但是，日誌路徑位置因 OS 發行版本而異。
`config/kernel-monitor.json` 中的 `log` 欄位表示容器內的日誌路徑。
你可以配置 `log` 欄位以匹配節點問題檢測器所示的裝置路徑。

<!-- 
### Add support for another log format {#support-other-log-format}

Kernel monitor uses the
[`Translator`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/pkg/kernelmonitor/translator/translator.go) plugin to translate the internal data structure of the kernel log.
You can implement a new translator for a new log format.
-->
### 新增對其它日誌格式的支援  {#support-other-log-format}

核心監視器使用 
[`Translator`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/pkg/kernelmonitor/translator.go)
外掛轉換核心日誌的內部資料結構。
你可以為新的日誌格式實現新的轉換器。

<!-- discussion -->

<!-- 
## Recommendations and restrictions

It is recommended to run the Node Problem Detector in your cluster to monitor node health.
When running the Node Problem Detector, you can expect extra resource overhead on each node.
Usually this is fine, because:

* The kernel log grows relatively slowly.
* A resource limit is set for the Node Problem Detector.
* Even under high load, the resource usage is acceptable. For more information, see the Node Problem Detector
[benchmark result](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629).
-->
## 建議和限制

建議在叢集中執行節點問題檢測器以監控節點執行狀況。
執行節點問題檢測器時，你可以預期每個節點上的額外資源開銷。
通常這是可接受的，因為：

* 核心日誌增長相對緩慢。
* 已經為節點問題檢測器設定了資源限制。
* 即使在高負載下，資源使用也是可接受的。有關更多資訊，請參閱節點問題檢測器
  [基準結果](https://github.com/kubernetes/node-problem-detector/issues/2.suecomment-220255629)。
