---
content_type: task
title: 节点健康监测
---
<!-- 
reviewers:
- Random-Liu
- dchen1107
content_type: task
title: Monitor Node Health
-->

<!-- overview -->
<!-- 
*Node Problem Detector* is a daemon for monitoring and reporting about a node's health.
You can run Node Problem Detector as a `DaemonSet` or as a standalone daemon.
Node Problem Detector collects information about node problems from various daemons
and reports these conditions to the API server as [NodeCondition](/docs/concepts/architecture/nodes/#condition)
and [Event](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core).
-->
*Node Problem Detector（节点问题探测器）* 是一个用来监视和报告节点健康
状态的守护任务。你可以用 `DaemonSet` 或者独立的守护进程的形式来运行
Node Problem Detector。 Node Problem Detector 从各种守护进程收集节点问题
相关的信息，并以 [NodeCondition](/zh/docs/concepts/architecture/nodes/#condition)
和 [Event](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core)
的形式报告给 API 服务器。 

<!-- 
To learn how to install and use Node Problem Detector, see
[Node Problem Detector project documentation](https://github.com/kubernetes/node-problem-detector).
-->
要了解如何安装和使用 Node Problem Detector，请参考
[Node Problem Detector 项目文档](https://github.com/kubernetes/node-problem-detector)。

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
## 局限性

* Node Problem Detector 目前仅支持基于文件的内核日志。
  类似 `journald` 这类日志工具还不被支持。

* Node Problem Detector 使用内核日志格式来报告内核相关的问题。
  要了解如何扩展内核日志格式，可参考
  [添加对其他日志形式的支持](#support-other-log-format)。

<!-- 
## Enabling Node Problem Detector

Some cloud providers enable Node Problem Detector as an {{< glossary_tooltip text="Addon" term_id="addons" >}}.
You can also enable Node Problem Detector with `kubectl` or by creating an Addon pod.
-->
## 启用 Node Problem Detector

某些云提供商将 Node Problem Detector 作为一种
{{< glossary_tooltip text="插件" term_id="addons" >}} 来启用。
你也可以使用 `kubectl` 来启用 Node Problem Detector，或者创建一个
Addon（插件）Pod。

<!--
### Using kubectl to enable Node Problem Detector {#using-kubectl}

`kubectl` provides the most flexible management of Node Problem Detector.
You can overwrite the default configuration to fit it into your environment or
to detect customized node problems. For example:
-->
### 使用 kubectl 来启用 Node Problem Detector {#using-kubectl}

`kubectl` 提供对 Node Problem Detector 的最灵活的方式。
你可以根据你的环境需要重载默认的配置信息，或者令其检测定制的节点问题。
例如：

<!--
1. Create a Node Problem Detector configuration similar to `node-problem-detector.yaml`:
-->
1. 创建类似于 `node-problem-detector.yaml` 的 Node Problem Detector 配置：

   {{< codenew file="debug/node-problem-detector.yaml" >}}

   {{< note >}}
   <!--
   You should verify that the system log directory is right for your operating system distribution.
   -->
   你需要验证对你的操作系统版本而言，系统日志目录是否正确。
   {{< /note >}}

<!--
1. Start node problem detector with `kubectl`:
-->
2. 使用 `kubectl` 启动 Node Problem Detector：

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
### 使用插件 Pod 来启用 Node Problem Detector {#addon-pod}

如果你在使用自己的集群引导解决方案，并且不需要覆盖默认配置，
你可以利用插件 Pod 进一步自动化部署。

创建 `node-problem-detector.yaml`，并将其放在控制面节点上的插件 Pod 目录
`/etc/kubernetes/addons/node-problem-detector` 下。

<!-- 
## Overwrite the Configuration 

The [default configuration](https://github.com/kubernetes/node-problem-detector/tree/v0.1/config)
is embedded when building the docker image of node problem detector. 
-->
## 覆盖配置文件   {#overwrite-the-configuration}

构建节点问题检测器的 docker 镜像时，会嵌入
[默认配置](https://github.com/kubernetes/node-problem-detector/tree/v0.1/config)。

<!-- 
However, you can use a [`ConfigMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/)
to overwrite the configuration: 
-->
不过，你可以使用一个 [ConfigMap](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)
来覆盖其默认配置：

<!-- 
1. Change the configuration files in `config/`
1. Create the `ConfigMap` `node-problem-detector-config`:
-->
1. 更改 `config/` 下的配置文件
1. 创建名为 `node-problem-detector-config` 的 `ConfigMap`

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

<!--
1. Change the `node-problem-detector.yaml` to use the `ConfigMap`:
 -->
3. 更改 `node-problem-detector.yaml` 以使用 `ConfigMap`：

   {{< codenew file="debug/node-problem-detector-configmap.yaml" >}}

<!--
1. Recreate the Node Problem Detector with the new configuration file:
-->
4. 使用新的配置文件重新创建 Node Problem Detector：

   ```shell
   # 如果你有一个 node-problem-detector 正在运行，在重新创建之前先将其删除
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

{{< note >}}
<!--
This approach only applies to a Node Problem Detector started with `kubectl`.
-->
此方法仅适用于通过 `kubectl` 启动的 Node Problem Detector。
{{< /note >}}

<!--
Overwriting a configuration is not supported if a Node Problem Detector runs as a cluster Addon.
The Addon manager does not support `ConfigMap`.
-->
对于以集群插件形式运行的 Node Problem Detector，
现在不支持的配置进行覆盖。插件管理器不支持ConfigMap。

<!-- 
## Kernel Monitor 

*Kernel Monitor* is a system log monitor daemon supported in the Node Problem Detector.
Kernel monitor watches the kernel log and detects known kernel issues following predefined rules.
-->
## 内核监视器  {#kernel-monitor}

*Kernel Monitor（内核监视器）* 是 Node Problem Detector 中所支持的系统日志监视
守护进程。Kernel Monitor 监视内核日志并按照预定义规则检测已知内核问题。

<!-- 
The Kernel Monitor matches kernel issues according to a set of predefined rule list in
[`config/kernel-monitor.json`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/config/kernel-monitor.json).
The rule list is extensible. You can expand the rule list by overwriting the
configuration. 
-->
内核监视器根据 [`config/kernel-monitor.json`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/config/kernel-monitor.json) 中的一组预定义规则列表匹配内核问题。
规则列表是可扩展的，你可以通过覆盖配置来扩展其规则列表。

<!-- 
### Add New NodeConditions 

To support a new `NodeCondition`, create a condition definition within the `conditions` field in
`config/kernel-monitor.json`, for example:
-->
### 添加新的 NodeCondition

要支持新的 `NodeCondition`，你可以创建新的状况定义来扩展 `config/kernel-monitor.json`
中的 `conditions` 字段，例如：

```json
{
  "type": "NodeConditionType",
  "reason": "CamelCaseDefaultNodeConditionReason",
  "message": "arbitrary default node condition message"
}
```

<!-- 
### Detect New Problems 

To detect new problems, you can extend the `rules` field in `config/kernel-monitor.json`
with new rule definition: 
-->
### 检测新的问题

你可以使用新的规则描述来扩展 `config/kernel-monitor.json` 中的 `rules` 字段以检测新问题。

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
### 更改系统日志设备的路径   {#kernel-log-device-path}

你需要检查你所使用的操作系统发行版本中的内核日志路径位置。
Linux 内核的 [log 设备](https://www.kernel.org/doc/Documentation/ABI/testing/dev-kmsg)
通常呈现为 `/dev/kmsg`。不过，不同 OS 发行版本中日志路径的位置可能不同。
`config/kernel-monitor.json` 文件中的 `log` 字段代表的是容器内的日志路径。
你可以配置 `log` 字段使之匹配 Node Problem Detector 所看到的设备路径。

<!-- 
### Add support for another log format {#support-other-log-format}

Kernel monitor uses
[`Translator`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/pkg/kernelmonitor/translator/translator.go) plugin to translate the internal data structure of the kernel log.
You can implement a new translator for a new log format. 
-->
### 添加对其他日志格式的支持  {#support-other-log-format}

内核监视器使用 [`Translator`] 插件将转换内核日志的内部数据结构。
你可以为新的日志格式实现新的翻译器。

<!-- discussion -->

<!-- 
## Recommendations and restrictions

It is recommended to run the node problem detector in your cluster to monitor the node health.
When running the Node Problem Detector, you can expect extra resource overhead on each node.
Usually this is fine, because: 
-->
## 建议与约束事项   {#caveats}

我们建议在集群中运行节点问题检测器来监视节点运行状况。
但是，你应该知道这将在每个节点上引入额外的资源开销。
一般情况下这一开销问题不大，因为：

<!-- 
* The kernel log is generated relatively slowly.
* A resource limit is set for the Node Problem Detector.
* Even under high load, the resource usage is acceptable. For more information, see the Node Problem Detector
[benchmark result](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629).
-->
* 内核日志生成相对较慢。
* Node Problem Detector 有资源限制。
* 即使在高负载下，资源使用也是可以接受的。
  更多的相关信息，可参阅
  [基准测试结果](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629)。 

