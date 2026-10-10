---
layout: blog
title: "Kubernetes 1.27: 使用 Kubelet API 查询节点日志"
date: 2023-04-21
slug: node-log-query-alpha
---

<!--
layout: blog
title: "Kubernetes 1.27: Query Node Logs Using The Kubelet API"
date: 2023-04-21
slug: node-log-query-alpha
-->

<!--
**Author:** Aravindh Puthiyaparambil (Red Hat)
-->
**作者：** Aravindh Puthiyaparambil (Red Hat)

**译者：** Xin Li (DaoCloud)

<!--
Kubernetes 1.27 introduced a new feature called _Node log query_ that allows
viewing logs of services running on the node.
-->
Kubernetes 1.27 引入了一个名为**节点日志查询**的新功能，
可以查看节点上运行的服务的日志。

<!--
## What problem does it solve?
Cluster administrators face issues when debugging malfunctioning services
running on the node. They usually have to SSH or RDP into the node to view the
logs of the service to debug the issue. The _Node log query_ feature helps with
this scenario by allowing the cluster administrator to view the logs using
_kubectl_. This is especially useful with Windows nodes where you run into the
issue of the node going to the ready state but containers not coming up due to
CNI misconfigurations and other issues that are not easily identifiable by
looking at the Pod status.
-->
## 它解决了什么问题？

集群管理员在调试节点上运行的表现不正常的服务时会遇到问题。
他们通常必须通过 SSH 或 RDP 进入节点以查看服务日志以调试问题。
**节点日志查询**功能通过允许集群管理员使用 **kubectl**
查看日志的方式来帮助解决这种情况。这对于 Windows 节点特别有用，
在 Windows 节点中，你会遇到节点进入就绪状态但由于 CNI
错误配置和其他不易通过查看 Pod 状态来辨别的问题而导致容器无法启动的情况。

<!--
## How does it work?

The kubelet already has a _/var/log/_ viewer that is accessible via the node
proxy endpoint. The feature supplements this endpoint with a shim that shells
out to `journalctl`, on Linux nodes, and the `Get-WinEvent` cmdlet on Windows
nodes. It then uses the existing filters provided by the commands to allow
filtering the logs. The kubelet also uses heuristics to retrieve the logs.
If the user is not aware if a given system services logs to a file or to the
native system logger, the heuristics first checks the native operating system
logger and if that is not available it attempts to retrieve the first logs
from `/var/log/<servicename>` or `/var/log/<servicename>.log` or
`/var/log/<servicename>/<servicename>.log`.
-->
## 它是如何工作的？

kubelet 已经有一个 **/var/log/** 查看器，可以通过节点代理端点访问。
本功能特性通过一个隔离层对这个端点进行增强，在 Linux 节点上通过
`journalctl` Shell 调用获得日志，在 Windows 节点上通过 `Get-WinEvent` CmdLet 获取日志。
然后它使用命令提供的过滤器来过滤日志。kubelet 还使用启发式方法来检索日志。
如果用户不知道给定的系统服务是记录到文件还是本机系统记录器，
启发式方法首先检查本机操作系统记录器，如果不可用，它会尝试先从 `/var/log/<servicename>`
或 `/var/log/<servicename>.log` 或 `/var/log/<servicename>/<servicename>.log` 检索日志。


<!--
On Linux we assume that service logs are available via journald, and that
`journalctl` is installed. On Windows we assume that service logs are available
in the application log provider. Also note that fetching node logs is only
available if you are authorized to do so (in RBAC, that's **get** and
**create** access to `nodes/proxy`). The privileges that you need to fetch node
logs also allow elevation-of-privilege attacks, so be careful about how you
manage them.
-->
在 Linux 上，我们假设服务日志可通过 journald 获得，
并且安装了 `journalctl`。 在 Windows 上，我们假设服务日志在应用程序日志提供程序中可用。
另请注意，只有在你被授权的情况下才能获取节点日志（在 RBAC 中，
这是对 `nodes/proxy` 的 **get** 和 **create** 访问）。
获取节点日志所需的特权也允许特权提升攻击（elevation-of-privilege），
因此请谨慎管理它们。

<!--
## How do I use it?

To use the feature, ensure that the `NodeLogQuery`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is
enabled for that node, and that the kubelet configuration options
`enableSystemLogHandler` and `enableSystemLogQuery` are both set to true. You can
then query the logs from all your nodes or just a subset. Here is an example to
retrieve the kubelet service logs from a node:
-->
## 该如何使用它

要使用该功能，请确保为该节点启用了 `NodeLogQuery`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并且 kubelet 配置选项 `enableSystemLogHandler` 和 `enableSystemLogQuery` 都设置为 true。
然后，你可以查询所有节点或部分节点的日志。下面是一个从节点检索 kubelet 服务日志的示例：

```shell
# Fetch kubelet logs from a node named node-1.example
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

<!--
You can further filter the query to narrow down the results:
-->
你可以进一步过滤查询以缩小结果范围：

```shell
# Fetch kubelet logs from a node named node-1.example that have the word "error"
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

<!--
You can also fetch files from `/var/log/` on a Linux node:
-->
你还可以从 Linux 节点上的 `/var/log/` 获取文件：

```shell
kubectl get --raw "/api/v1/nodes/<insert-node-name-here>/proxy/logs/?query=/<insert-log-file-name-here>"
```

<!--
You can read the
[documentation](/docs/concepts/cluster-administration/system-logs/#log-query)
for all the available options.
-->
你可以阅读[文档](/zh-cn/docs/concepts/cluster-administration/system-logs/#log-query)获取所有可用选项。

<!--
## How do I help?

Please use the feature and provide feedback by opening GitHub issues or
reaching out to us on the
[#sig-windows](https://kubernetes.slack.com/archives/C0SJ4AFB7) channel on the
Kubernetes Slack or the SIG Windows
[mailing list](https://groups.google.com/g/kubernetes-sig-windows).
-->
## 如何提供帮助

请使用该功能并通过在 GitHub 上登记问题或通过 Kubernetes Slack
的 [#sig-windows](https://kubernetes.slack.com/archives/C0SJ4AFB7) 频道
或 SIG Windows [邮件列表](https://groups.google.com/g/kubernetes-sig-windows)
联系我们来提供反馈。
