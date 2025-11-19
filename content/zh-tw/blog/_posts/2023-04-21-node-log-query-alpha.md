---
layout: blog
title: "Kubernetes 1.27: 使用 Kubelet API 查詢節點日誌"
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

**譯者：** Xin Li (DaoCloud)

<!--
Kubernetes 1.27 introduced a new feature called _Node log query_ that allows
viewing logs of services running on the node.
-->
Kubernetes 1.27 引入了一個名爲**節點日誌查詢**的新功能，
可以查看節點上運行的服務的日誌。

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
## 它解決了什麼問題？

集羣管理員在調試節點上運行的表現不正常的服務時會遇到問題。
他們通常必須通過 SSH 或 RDP 進入節點以查看服務日誌以調試問題。
**節點日誌查詢**功能通過允許集羣管理員使用 **kubectl**
查看日誌的方式來幫助解決這種情況。這對於 Windows 節點特別有用，
在 Windows 節點中，你會遇到節點進入就緒狀態但由於 CNI
錯誤配置和其他不易通過查看 Pod 狀態來辨別的問題而導致容器無法啓動的情況。

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

kubelet 已經有一個 **/var/log/** 查看器，可以通過節點代理端點訪問。
本功能特性通過一個隔離層對這個端點進行增強，在 Linux 節點上通過
`journalctl` Shell 調用獲得日誌，在 Windows 節點上通過 `Get-WinEvent` CmdLet 獲取日誌。
然後它使用命令提供的過濾器來過濾日誌。kubelet 還使用啓發式方法來檢索日誌。
如果用戶不知道給定的系統服務是記錄到文件還是本機系統記錄器，
啓發式方法首先檢查本機操作系統記錄器，如果不可用，它會嘗試先從 `/var/log/<servicename>`
或 `/var/log/<servicename>.log` 或 `/var/log/<servicename>/<servicename>.log` 檢索日誌。


<!--
On Linux we assume that service logs are available via journald, and that
`journalctl` is installed. On Windows we assume that service logs are available
in the application log provider. Also note that fetching node logs is only
available if you are authorized to do so (in RBAC, that's **get** and
**create** access to `nodes/proxy`). The privileges that you need to fetch node
logs also allow elevation-of-privilege attacks, so be careful about how you
manage them.
-->
在 Linux 上，我們假設服務日誌可通過 journald 獲得，
並且安裝了 `journalctl`。 在 Windows 上，我們假設服務日誌在應用程序日誌提供程序中可用。
另請注意，只有在你被授權的情況下才能獲取節點日誌（在 RBAC 中，
這是對 `nodes/proxy` 的 **get** 和 **create** 訪問）。
獲取節點日誌所需的特權也允許特權提升攻擊（elevation-of-privilege），
因此請謹慎管理它們。

<!--
## How do I use it?

To use the feature, ensure that the `NodeLogQuery`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is
enabled for that node, and that the kubelet configuration options
`enableSystemLogHandler` and `enableSystemLogQuery` are both set to true. You can
then query the logs from all your nodes or just a subset. Here is an example to
retrieve the kubelet service logs from a node:
-->
## 該如何使用它

要使用該功能，請確保爲該節點啓用了 `NodeLogQuery`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
並且 kubelet 配置選項 `enableSystemLogHandler` 和 `enableSystemLogQuery` 都設置爲 true。
然後，你可以查詢所有節點或部分節點的日誌。下面是一個從節點檢索 kubelet 服務日誌的示例：

```shell
# Fetch kubelet logs from a node named node-1.example
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

<!--
You can further filter the query to narrow down the results:
-->
你可以進一步過濾查詢以縮小結果範圍：

```shell
# Fetch kubelet logs from a node named node-1.example that have the word "error"
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

<!--
You can also fetch files from `/var/log/` on a Linux node:
-->
你還可以從 Linux 節點上的 `/var/log/` 獲取文件：

```shell
kubectl get --raw "/api/v1/nodes/<insert-node-name-here>/proxy/logs/?query=/<insert-log-file-name-here>"
```

<!--
You can read the
[documentation](/docs/concepts/cluster-administration/system-logs/#log-query)
for all the available options.
-->
你可以閱讀[文檔](/zh-cn/docs/concepts/cluster-administration/system-logs/#log-query)獲取所有可用選項。

<!--
## How do I help?

Please use the feature and provide feedback by opening GitHub issues or
reaching out to us on the
[#sig-windows](https://kubernetes.slack.com/archives/C0SJ4AFB7) channel on the
Kubernetes Slack or the SIG Windows
[mailing list](https://groups.google.com/g/kubernetes-sig-windows).
-->
## 如何提供幫助

請使用該功能並通過在 GitHub 上登記問題或通過 Kubernetes Slack
的 [#sig-windows](https://kubernetes.slack.com/archives/C0SJ4AFB7) 頻道
或 SIG Windows [郵件列表](https://groups.google.com/g/kubernetes-sig-windows)
聯繫我們來提供反饋。
