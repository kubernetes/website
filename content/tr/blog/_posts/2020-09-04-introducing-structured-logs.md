---
layout: blog
title: 'Introducing Structured Logs'
date: 2020-09-04
slug: kubernetes-1-19-Introducing-Structured-Logs
author: >
  Marek Siarkowicz (Google),
  Nathan Beach (Google) 
---

Logs are an essential aspect of observability and a critical tool for debugging. But Kubernetes logs have traditionally been unstructured strings, making any automated parsing difficult and any downstream processing, analysis, or querying challenging to do reliably.

In Kubernetes 1.19, we are adding support for structured logs, which natively support (key, value) pairs and object references. We have also updated many logging calls such that over 99% of logging volume in a typical deployment are now migrated to the structured format.

To maintain backwards compatibility, structured logs will still be outputted as a string where the string contains representations of those "key"="value" pairs. Starting in alpha in 1.19, logs can also be outputted in JSON format using the `--logging-format=json` flag.

## Using Structured Logs

We've added two new methods to the klog library: InfoS and ErrorS. For example, this invocation of InfoS:

```golang
klog.InfoS("Pod status updated", "pod", klog.KObj(pod), "status", status)
```

will result in this log:

```
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

Or, if the --logging-format=json flag is set, it will result in this output:

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

This means downstream logging tools can easily ingest structured logging data and instead of using regular expressions to parse unstructured strings. This also makes processing logs easier, querying logs more robust, and analyzing logs much faster.

With structured logs, all references to Kubernetes objects are structured the same way, so you can filter the output and only log entries referencing the particular pod. You can also find logs indicating how the scheduler was scheduling the pod, how the pod was created, the health probes of the pod, and all other changes in the lifecycle of the pod.

Suppose you are debugging an issue with a pod. With structured logs, you can filter to only those log entries referencing the pod of interest, rather than needing to scan through potentially thousands of log lines to find the relevant ones.

Not only are structured logs more useful when manual debugging of issues, they also enable richer features like automated pattern recognition within logs or tighter correlation of log and trace data.

Finally, structured logs can help reduce storage costs for logs because most storage systems are more efficiently able to compress structured key=value data than unstructured strings.

## Get Involved

While we have updated over 99% of the log entries by log volume in a typical deployment, there are still thousands of logs to be updated. Pick a file or directory that you would like to improve and [migrate existing log calls to use structured logs](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/migration-to-structured-logging.md). It's a great and easy way to make your first contribution to Kubernetes!
