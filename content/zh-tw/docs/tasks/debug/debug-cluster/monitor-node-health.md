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
and reports these conditions to the API server as Node [Condition](/docs/concepts/architecture/nodes/#condition)s
or as [Event](/docs/reference/kubernetes-api/cluster-resources/event-v1)s.

To learn how to install and use Node Problem Detector, see
[Node Problem Detector project documentation](https://github.com/kubernetes/node-problem-detector).
-->

**節點問題檢測器（Node Problem Detector）** 是一個守護程序，用於監視和報告節點的健康狀況。
你可以將節點問題探測器以 `DaemonSet` 或獨立守護程序運行。
節點問題檢測器從各種守護進程收集節點問題，並以節點
[Condition](/zh-cn/docs/concepts/architecture/nodes/#condition) 和
[Event](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1)
的形式報告給 API 服務器。

要了解如何安裝和使用節點問題檢測器，請參閱
[節點問題探測器項目文檔](https://github.com/kubernetes/node-problem-detector)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Limitations

* Node Problem Detector uses the kernel log format for reporting kernel issues.
  To learn how to extend the kernel log format, see [Add support for another log format](#support-other-log-format).
-->
## 侷限性  {#limitations}

* 節點問題檢測器使用內核日誌格式來報告內核問題。
  要了解如何擴展內核日誌格式，請參閱[添加對另一個日誌格式的支持](#support-other-log-format)。

<!--
## Enabling Node Problem Detector

Some cloud providers enable Node Problem Detector as an {{< glossary_tooltip text="Addon" term_id="addons" >}}.
You can also enable Node Problem Detector with `kubectl` or by creating an Addon DaemonSet.
-->
## 啓用節點問題檢測器

一些雲供應商將節點問題檢測器以{{< glossary_tooltip text="插件" term_id="addons" >}}形式啓用。
你還可以使用 `kubectl` 或創建插件 DaemonSet 來啓用節點問題探測器。

<!--
### Using kubectl to enable Node Problem Detector {#using-kubectl}

`kubectl` provides the most flexible management of Node Problem Detector.
You can overwrite the default configuration to fit it into your environment or
to detect customized node problems. For example:
-->
### 使用 kubectl 啓用節點問題檢測器 {#using-kubectl}

`kubectl` 提供了節點問題探測器最靈活的管理。
你可以覆蓋默認配置使其適合你的環境或檢測自定義節點問題。例如：

<!--
1. Create a Node Problem Detector configuration similar to `node-problem-detector.yaml`:

   {{% code_sample file="debug/node-problem-detector.yaml" %}}

   {{< note >}}
   You should verify that the system log directory is right for your operating system distribution.
   {{< /note >}}

1. Start node problem detector with `kubectl`:

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```
-->
1. 創建類似於 `node-strought-detector.yaml` 的節點問題檢測器配置：
   {{% code_sample file="debug/node-problem-detector.yaml" %}}

   {{< note >}}
   你應該檢查系統日誌目錄是否適用於操作系統發行版本。
   {{< /note >}}

1. 使用 `kubectl` 啓動節點問題檢測器：

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
### 使用插件 Pod 啓用節點問題檢測器 {#using-addon-pod}

如果你使用的是自定義集羣引導解決方案，不需要覆蓋默認配置，
可以利用插件 Pod 進一步自動化部署。

創建 `node-strick-detector.yaml`，並在控制平面節點上保存配置到插件 Pod 的目錄
`/etc/kubernetes/addons/node-problem-detector`。

<!--
## Overwrite the configuration

The [default configuration](https://github.com/kubernetes/node-problem-detector/tree/v0.8.12/config)
is embedded when building the Docker image of Node Problem Detector.
-->
## 覆蓋配置文件

構建節點問題檢測器的 docker 鏡像時，會嵌入
[默認配置](https://github.com/kubernetes/node-problem-detector/tree/v0.8.12/config)。

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

   {{% code_sample file="debug/node-problem-detector-configmap.yaml" %}}

1. Recreate the Node Problem Detector with the new configuration file:

   ```shell
   # If you have a node-problem-detector running, delete before recreating
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```
 -->
1. 更改 `config/` 中的配置文件
1. 創建 `ConfigMap` `node-strick-detector-config`：

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. 更改 `node-problem-detector.yaml` 以使用 ConfigMap：

      {{% code_sample file="debug/node-problem-detector-configmap.yaml" %}}

1. 使用新的配置文件重新創建節點問題檢測器：

   ```shell
   # 如果你正在運行節點問題檢測器，請先刪除，然後再重新創建
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
此方法僅適用於通過 `kubectl` 啓動的節點問題檢測器。
{{< /note >}}

如果節點問題檢測器作爲集羣插件運行，則不支持覆蓋配置。
插件管理器不支持 `ConfigMap`。

<!--
## Problem Daemons

A problem daemon is a sub-daemon of the Node Problem Detector. It monitors specific kinds of node
problems and reports them to the Node Problem Detector.
There are several types of supported problem daemons.
-->

## 問題守護程序

問題守護程序是節點問題檢測器的子守護程序。
它監視特定類型的節點問題並報告給節點問題檢測器。
支持下面幾種類型的問題守護程序。

<!--
- A `SystemLogMonitor` type of daemon monitors the system logs and reports problems and metrics
  according to predefined rules. You can customize the configurations for different log sources
  such as [filelog](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-filelog.json),
  [kmsg](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor.json),
  [kernel](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-counter.json),
  [abrt](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/abrt-adaptor.json),
  and [systemd](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/systemd-monitor-counter.json).
-->
- `SystemLogMonitor` 類型的守護程序根據預定義的規則監視系統日誌並報告問題和指標。
  你可以針對不同的日誌源自定義配置如
[filelog](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-filelog.json)、
[kmsg](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor.json)、
[kernel](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-counter.json)、
[abrt](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/abrt-adaptor.json)
和 [systemd](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/systemd-monitor-counter.json)。

<!--
- A `SystemStatsMonitor` type of daemon collects various health-related system stats as metrics.
  You can customize its behavior by updating its
  [configuration file](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/system-stats-monitor.json).
-->

- `SystemStatsMonitor` 類型的守護程序收集各種與健康相關的系統統計數據作爲指標。
  你可以通過更新其[配置文件](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/system-stats-monitor.json)來自定義其行爲。

<!--
- A `CustomPluginMonitor` type of daemon invokes and checks various node problems by running
  user-defined scripts. You can use different custom plugin monitors to monitor different
  problems and customize the daemon behavior by updating the
  [configuration file](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/custom-plugin-monitor.json).
-->

- `CustomPluginMonitor` 類型的守護程序通過運行用戶定義的腳本來調用和檢查各種節點問題。
  你可以使用不同的自定義插件監視器來監視不同的問題，並通過更新
  [配置文件](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/custom-plugin-monitor.json)
  來定製守護程序行爲。

<!--
- A `HealthChecker` type of daemon checks the health of the kubelet and container runtime on a node.
-->
- `HealthChecker` 類型的守護程序檢查節點上的 kubelet 和容器運行時的健康狀況。

<!--
### Adding support for other log format {#support-other-log-format}

The system log monitor currently supports file-based logs, journald, and kmsg.
Additional sources can be added by implementing a new
[log watcher](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/pkg/systemlogmonitor/logwatchers/types/log_watcher.go).
-->

### 增加對其他日誌格式的支持 {#support-other-log-format}

系統日誌監視器目前支持基於文件的日誌、journald 和 kmsg。
可以通過實現一個新的
[log watcher](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/pkg/systemlogmonitor/logwatchers/types/log_watcher.go)
來添加額外的日誌源。

<!--
### Adding custom plugin monitors

You can extend the Node Problem Detector to execute any monitor scripts written in any language by
developing a custom plugin. The monitor scripts must conform to the plugin protocol in exit code
and standard output. For more information, please refer to the
[plugin interface proposal](https://docs.google.com/document/d/1jK_5YloSYtboj-DtfjmYKxfNnUxCAvohLnsH5aGCAYQ/edit#).
-->

### 添加自定義插件監視器

你可以通過開發自定義插件來擴展節點問題檢測器，以執行以任何語言編寫的任何監控腳本。
監控腳本必須符合退出碼和標準輸出的插件協議。
有關更多信息，請參閱
[插件接口提案](https://docs.google.com/document/d/1jK_5YloSYtboj-DtfjmYKxfNnUxCAvohLnsH5aGCAYQ/edit#).

<!--
## Exporter

An exporter reports the node problems and/or metrics to certain backends.
The following exporters are supported:

- **Kubernetes exporter**: this exporter reports node problems to the Kubernetes API server.
  Temporary problems are reported as Events and permanent problems are reported as Node Conditions.

- **Prometheus exporter**: this exporter reports node problems and metrics locally as Prometheus
  (or OpenMetrics) metrics. You can specify the IP address and port for the exporter using command
  line arguments.

- **Stackdriver exporter**: this exporter reports node problems and metrics to the Stackdriver
  Monitoring API. The exporting behavior can be customized using a
  [configuration file](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/exporter/stackdriver-exporter.json).
-->

## 導出器

導出器（Exporter）向特定後端報告節點問題和/或指標。
支持下列導出器：

- **Kubernetes exporter**：此導出器向 Kubernetes API 服務器報告節點問題。
  臨時問題報告爲事件，永久性問題報告爲節點狀況。

- **Prometheus exporter**：此導出器在本地將節點問題和指標報告爲 Prometheus（或 OpenMetrics）指標。
  你可以使用命令行參數指定導出器的 IP 地址和端口。

- **Stackdriver exporter**：此導出器向 Stackdriver Monitoring API 報告節點問題和指標。
  可以使用[配置文件](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/exporter/stackdriver-exporter.json)自定義導出行爲。

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

建議在集羣中運行節點問題檢測器以監控節點運行狀況。
運行節點問題檢測器時，你可以預期每個節點上的額外資源開銷。
通常這是可接受的，因爲：

* 內核日誌增長相對緩慢。
* 已經爲節點問題檢測器設置了資源限制。
* 即使在高負載下，資源使用也是可接受的。有關更多信息，請參閱節點問題檢測器
  [基準結果](https://github.com/kubernetes/node-problem-detector/issues/2.suecomment-220255629)。
