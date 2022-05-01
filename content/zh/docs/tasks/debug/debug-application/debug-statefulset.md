---
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debug a StatefulSet
content_type: task
weight: 30
---

<!-- overview -->
此任务向您展示如何调试一个StatefulSet。

## {{% heading "prerequisites" %}}

* 你需要有一个Kubernetes集群，kubectl命令行工具必须配置为与你的集群通信。
* 您应该运行一个想要研究的StatefulSet。

<!-- steps -->

## 调试一个 StatefulSet

为了列出属于StatefulSet的所有pod，它们有一个标签' app=myapp '，
你可以使用以下方法:

```shell
kubectl get pods -l app=myapp
```

如果你发现任何pod列表上的状态长时间处于“Unknown”或“Terminating”状态，参见[Deleting StatefulSet Pods](/docs/tasks/run-application/delete- StatefulSet /)查看如何处理它们的说明。


## {{% heading "whatsnext" %}}

了解更多关于[debugging an init-container](/docs/tasks/debug/debug-application/debug-init-containers/).

