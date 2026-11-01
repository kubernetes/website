---
layout: blog
title: "结构化日志介绍"
date: 2020-09-04
slug: kubernetes-1-19-Introducing-Structured-Logs
---
<!--
layout: blog
title: 'Introducing Structured Logs'
date: 2020-09-04
slug: kubernetes-1-19-Introducing-Structured-Logs
-->

<!--
**Authors:** Marek Siarkowicz (Google), Nathan Beach (Google)
-->
**作者：** Marek Siarkowicz（谷歌），Nathan Beach（谷歌）

<!--
Logs are an essential aspect of observability and a critical tool for debugging. But Kubernetes logs have traditionally been unstructured strings, making any automated parsing difficult and any downstream processing, analysis, or querying challenging to do reliably.
-->
日志是可观察性的一个重要方面，也是调试的重要工具。 但是Kubernetes日志传统上是非结构化的字符串，因此很难进行自动解析，以及任何可靠的后续处理、分析或查询。
<!--
In Kubernetes 1.19, we are adding support for structured logs, which natively support (key, value) pairs and object references. We have also updated many logging calls such that over 99% of logging volume in a typical deployment are now migrated to the structured format.
-->
在Kubernetes 1.19中，我们添加结构化日志的支持，该日志本身支持（键，值）对和对象引用。 我们还更新了许多日志记录调用，以便现在将典型部署中超过99％的日志记录量迁移为结构化格式。
<!--
To maintain backwards compatibility, structured logs will still be outputted as a string where the string contains representations of those "key"="value" pairs. Starting in alpha in 1.19, logs can also be outputted in JSON format using the `--logging-format=json` flag.
-->
为了保持向后兼容性，结构化日志仍将作为字符串输出，其中该字符串包含这些“键” =“值”对的表示。 从1.19的Alpha版本开始，日志也可以使用`--logging-format = json`标志以JSON格式输出。

## 使用结构化日志

<!--
We've added two new methods to the klog library: InfoS and ErrorS. For example, this invocation of InfoS:
-->
我们在klog库中添加了两个新方法：InfoS和ErrorS。 例如，InfoS的此调用：

```golang
klog.InfoS("Pod status updated", "pod", klog.KObj(pod), "status", status)
```

<!--
will result in this log:
-->
将得到下面的日志输出：

```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

<!--
Or, if the --logging-format=json flag is set, it will result in this output:
-->
或者, 如果 --logging-format=json 模式被设置, 将会产生如下结果:

```json
{
  "ts": 1580306777.04728,
  "msg": "Pod status updated",
  "pod": {
    "name": "coredns",
    "namespace": "kube-system"
  },
  "status": "ready"
}
```

<!--
This means downstream logging tools can easily ingest structured logging data and instead of using regular expressions to parse unstructured strings. This also makes processing logs easier, querying logs more robust, and analyzing logs much faster.
-->
这意味着下游日志记录工具可以轻松地获取结构化日志数据，而无需使用正则表达式来解析非结构化字符串。这也使处理日志更容易，查询日志更健壮，并且分析日志更快。
<!--
With structured logs, all references to Kubernetes objects are structured the same way, so you can filter the output and only log entries referencing the particular pod. You can also find logs indicating how the scheduler was scheduling the pod, how the pod was created, the health probes of the pod, and all other changes in the lifecycle of the pod.
-->
使用结构化日志，所有对Kubernetes对象的引用都以相同的方式进行结构化，因此您可以过滤输出并且仅引用特定Pod的日志条目。您还可以发现指示调度程序如何调度Pod，如何创建Pod，监测Pod的运行状况以及Pod生命周期中的所有其他更改的日志。
<!--
Suppose you are debugging an issue with a pod. With structured logs, you can filter to only those log entries referencing the pod of interest, rather than needing to scan through potentially thousands of log lines to find the relevant ones.
-->
假设您正在调试Pod的问题。使用结构化日志，您可以只过滤查看感兴趣的Pod的日志条目，而无需扫描可能成千上万条日志行以找到相关的日志行。
<!--
Not only are structured logs more useful when manual debugging of issues, they also enable richer features like automated pattern recognition within logs or tighter correlation of log and trace data.
-->
结构化日志不仅在手动调试问题时更有用，而且还启用了更丰富的功能，例如日志的自动模式识别或日志和所跟踪数据的更紧密关联性（分析）。
<!--
Finally, structured logs can help reduce storage costs for logs because most storage systems are more efficiently able to compress structured key=value data than unstructured strings.
-->
最后，结构化日志可以帮助降低日志的存储成本，因为大多数存储系统比非结构化字符串更有效地压缩结构化键值数据。

## 参与其中

<!--
While we have updated over 99% of the log entries by log volume in a typical deployment, there are still thousands of logs to be updated. Pick a file or directory that you would like to improve and [migrate existing log calls to use structured logs](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md). It's a great and easy way to make your first contribution to Kubernetes!
-->
虽然在典型部署中，我们已按日志量更新了99％以上的日志条目，但仍有数千个日志需要更新。 选择一个您要改进的文件或目录，然后[迁移现有的日志调用以使用结构化日志](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md)。这是对Kubernetes做出第一笔贡献的好方法!
