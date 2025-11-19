---
layout: blog
title: "結構化日誌介紹"
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
日誌是可觀察性的一個重要方面，也是調試的重要工具。 但是Kubernetes日誌傳統上是非結構化的字符串，因此很難進行自動解析，以及任何可靠的後續處理、分析或查詢。
<!--
In Kubernetes 1.19, we are adding support for structured logs, which natively support (key, value) pairs and object references. We have also updated many logging calls such that over 99% of logging volume in a typical deployment are now migrated to the structured format.
-->
在Kubernetes 1.19中，我們添加結構化日誌的支持，該日誌本身支持（鍵，值）對和對象引用。 我們還更新了許多日誌記錄調用，以便現在將典型部署中超過99％的日誌記錄量遷移爲結構化格式。
<!--
To maintain backwards compatibility, structured logs will still be outputted as a string where the string contains representations of those "key"="value" pairs. Starting in alpha in 1.19, logs can also be outputted in JSON format using the `--logging-format=json` flag.
-->
爲了保持向後兼容性，結構化日誌仍將作爲字符串輸出，其中該字符串包含這些“鍵” =“值”對的表示。 從1.19的Alpha版本開始，日誌也可以使用`--logging-format = json`標誌以JSON格式輸出。

## 使用結構化日誌

<!--
We've added two new methods to the klog library: InfoS and ErrorS. For example, this invocation of InfoS:
-->
我們在klog庫中添加了兩個新方法：InfoS和ErrorS。 例如，InfoS的此調用：

```golang
klog.InfoS("Pod status updated", "pod", klog.KObj(pod), "status", status)
```

<!--
will result in this log:
-->
將得到下面的日誌輸出：

```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

<!--
Or, if the --logging-format=json flag is set, it will result in this output:
-->
或者, 如果 --logging-format=json 模式被設置, 將會產生如下結果:

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
這意味着下游日誌記錄工具可以輕鬆地獲取結構化日誌數據，而無需使用正則表達式來解析非結構化字符串。這也使處理日誌更容易，查詢日誌更健壯，並且分析日誌更快。
<!--
With structured logs, all references to Kubernetes objects are structured the same way, so you can filter the output and only log entries referencing the particular pod. You can also find logs indicating how the scheduler was scheduling the pod, how the pod was created, the health probes of the pod, and all other changes in the lifecycle of the pod.
-->
使用結構化日誌，所有對Kubernetes對象的引用都以相同的方式進行結構化，因此您可以過濾輸出並且僅引用特定Pod的日誌條目。您還可以發現指示調度程序如何調度Pod，如何創建Pod，監測Pod的運行狀況以及Pod生命週期中的所有其他更改的日誌。
<!--
Suppose you are debugging an issue with a pod. With structured logs, you can filter to only those log entries referencing the pod of interest, rather than needing to scan through potentially thousands of log lines to find the relevant ones.
-->
假設您正在調試Pod的問題。使用結構化日誌，您可以只過濾查看感興趣的Pod的日誌條目，而無需掃描可能成千上萬條日誌行以找到相關的日誌行。
<!--
Not only are structured logs more useful when manual debugging of issues, they also enable richer features like automated pattern recognition within logs or tighter correlation of log and trace data.
-->
結構化日誌不僅在手動調試問題時更有用，而且還啓用了更豐富的功能，例如日誌的自動模式識別或日誌和所跟蹤數據的更緊密關聯性（分析）。
<!--
Finally, structured logs can help reduce storage costs for logs because most storage systems are more efficiently able to compress structured key=value data than unstructured strings.
-->
最後，結構化日誌可以幫助降低日誌的存儲成本，因爲大多數存儲系統比非結構化字符串更有效地壓縮結構化鍵值數據。

## 參與其中

<!--
While we have updated over 99% of the log entries by log volume in a typical deployment, there are still thousands of logs to be updated. Pick a file or directory that you would like to improve and [migrate existing log calls to use structured logs](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md). It's a great and easy way to make your first contribution to Kubernetes!
-->
雖然在典型部署中，我們已按日誌量更新了99％以上的日誌條目，但仍有數千個日誌需要更新。 選擇一個您要改進的文件或目錄，然後[遷移現有的日誌調用以使用結構化日誌](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md)。這是對Kubernetes做出第一筆貢獻的好方法!
