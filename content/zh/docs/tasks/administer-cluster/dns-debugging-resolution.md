---
title: 调试 DNS 问题
content_type: task
min-kubernetes-server-version: v1.6
---

<!-- overview -->
<!--
This page provides hints on diagnosing DNS problems.
-->
这篇文章提供了一些关于 DNS 问题诊断的方法。

<!-- steps -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
Your cluster must be configured to use the CoreDNS
{{< glossary_tooltip text="addon" term_id="addons" >}} or its precursor,
kube-dns.  
-->

你的集群必须使用了 CoreDNS {{< glossary_tooltip text="插件" term_id="addons" >}}
或者其前身，`kube-dns`。

{{< version-check >}}

<!--
### Create a simple Pod to use as a test environment


Use that manifest to create a Pod:

```shell
kubectl create -f https://k8s.io/examples/admin/dns/busybox.yaml
pod/busybox created

kubectl get pods busybox
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```
-->
### 创建一个简单的 Pod 作为测试环境

{{< codenew file="admin/dns/dnsutils.yaml" >}}

使用上面的清单来创建一个 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```

```
pod/dnsutils created
```

<!--
…and verify its status:
-->
验证其状态：

```shell
kubectl get pods dnsutils
```

```
NAME      READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

<!--
Once that pod is running, you can exec `nslookup` in that environment.
If you see something like the following, DNS is working correctly.
-->
一旦 Pod 处于运行状态，你就可以在该环境里执行 `nslookup`。
如果你看到类似下列的内容，则表示 DNS 是正常运行的。

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

<!--
If the `nslookup` command fails, check the following:
-->
如果 `nslookup` 命令执行失败，请检查下列内容：

<!--
### Check the local DNS configuration first

Take a look inside the resolv.conf file.
(See [Inheriting DNS from the node](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node) and
[Known issues](#known-issues) below for more information)
-->
### 先检查本地的 DNS 配置

查看 resolv.conf 文件的内容
（阅读[从节点继承 DNS 配置](/zh/docs/tasks/administer-cluster/dns-custom-nameservers/) 和
后文的[已知问题](#known-issues) ，获取更多信息)

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

<!--
Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):
-->
验证 search 和 nameserver 的配置是否与下面的内容类似
（注意 search 根据不同的云提供商可能会有所不同)：

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

<!--
Errors such as the following indicate a problem with the CoreDNS (or kube-dns)
add-on or with associated Services:
-->
下列错误表示 CoreDNS （或 kube-dns）插件或者相关服务出现了问题：

```
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

输出为：

```
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

或者

```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

<!--
### Check if the DNS pod is running

Use the `kubectl get pods` command to verify that the DNS pod is running.
-->
### 检查 DNS Pod 是否运行

使用 `kubectl get pods` 命令来验证 DNS Pod 是否运行。

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```

```
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

<!--
The value for label `k8s-app` is `kube-dns` for both CoreDNS and kube-dns deployments.
-->
{{< note >}}
对于 CoreDNS 和 kube-dns 部署而言，标签 `k8s-app` 的值都应该是 `kube-dns`。
{{< /note >}}

<!--
If you see that no CoreDNS pod is running or that the pod has failed/completed,
the DNS add-on may not be deployed by default in your current environment and you
will have to deploy it manually.
-->
如果你发现没有 CoreDNS Pod 在运行，或者该 Pod 的状态是 failed 或者 completed，
那可能这个 DNS 插件在您当前的环境里并没有成功部署，你将需要手动去部署它。

<!--
### Check for Errors in the DNS pod

Use `kubectl logs` command to see logs for the DNS containers.
-->
### 检查 DNS Pod 里的错误

使用 `kubectl logs` 命令来查看 DNS 容器的日志信息。

```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

<!--
Here is an example of a healthy CoreDNS log:
-->
下列是一个正常运行的 CoreDNS 日志信息：

```
.:53
2018/08/15 14:37:17 [INFO] CoreDNS-1.2.2
2018/08/15 14:37:17 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.2
linux/amd64, go1.10.3, 2e322f6
2018/08/15 14:37:17 [INFO] plugin/reload: Running configuration MD5 = 24e6c59e83ce706f07bcc82c31b1ea1c
```

<!--
See if there are any suspicious or unexpected messages in the logs.
-->
查看是否日志中有一些可疑的或者意外的消息。

<!--
### Is DNS service up?

Verify that the DNS service is up by using the `kubectl get service` command.
-->
### 检查是否启用了 DNS 服务

使用 `kubectl get service` 命令来检查 DNS 服务是否已经启用。

```shell
kubectl get svc --namespace=kube-system
```

```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns     ClusterIP   10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

<!--
The service name is `kube-dns` for both CoreDNS and kube-dns deployments.
-->

{{< note >}}
不管是 CoreDNS 还是 kube-dns，这个服务的名字都会是 `kube-dns` 。
{{< /note >}}

<!--
If you have created the Service or in the case it should be created by default
but it does not appear, see
[debugging Services](/docs/tasks/debug-application-cluster/debug-service/) for
more information.
-->
如果你已经创建了 DNS 服务，或者该服务应该是默认自动创建的但是它并没有出现，
请阅读[调试服务](/zh/docs/tasks/debug-application-cluster/debug-service/)
来获取更多信息。

<!--
### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints`
command.
-->
### DNS 的末端公开了吗？

你可以使用 `kubectl get endpoints` 命令来验证 DNS 的末端是否公开了。

```shell
kubectl get ep kube-dns --namespace=kube-system
```
```
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

<!--
If you do not see the endpoints, see endpoints section in the
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.
-->
如果你没看到对应的末端，请阅读
[调试服务](/zh/docs/tasks/debug-application-cluster/debug-service/)的末端部分。

若需要了解更多的 Kubernetes DNS 例子，请在 Kubernetes GitHub 仓库里查看
[cluster-dns 示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。 

<!--
### Are DNS queries being received/processed?

You can verify if queries are being received by CoreDNS by adding the `log` plugin to the CoreDNS configuration (aka Corefile).
The CoreDNS Corefile is held in a ConfigMap named `coredns`. To edit it, use the command ...
-->
### DNS 查询有被接收或者执行吗？

你可以通过给 CoreDNS 的配置文件（也叫 Corefile）添加 `log` 插件来检查查询是否被正确接收。
CoreDNS 的 Corefile 被保存在一个叫 `coredns` 的 ConfigMap 里，使用下列命令来编辑它：

```
kubectl -n kube-system edit configmap coredns
```

<!--
Then add `log` in the Corefile section per the example below.
-->
然后按下面的例子给 Corefile 添加 `log`。

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        log
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          upstream
          fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

<!--
After saving the changes, it may take up to minute or two for Kubernetes to propagate these changes to the CoreDNS pods.
-->
保存这些更改后，你可能会需要等待一到两分钟让 Kubernetes 把这些更改应用到
CoreDNS 的 Pod 里。

<!--
Next, make some queries and view the logs per the sections above in this document. If CoreDNS pods are receiving the queries, you should see them in the logs.

Here is an example of a query in the log.
-->
接下来，发起一些查询并依照前文所述查看日志信息，如果 CoreDNS 的 Pod 接收到这些查询，
你将可以在日志信息里看到它们。

下面是日志信息里的查询例子：

```
.:53
2018/08/15 14:37:15 [INFO] CoreDNS-1.2.0
2018/08/15 14:37:15 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.0
linux/amd64, go1.10.3, 2e322f6
2018/09/07 15:29:04 [INFO] plugin/reload: Running configuration MD5 = 162475cdf272d8aa601e6fe67a6ad42f
2018/09/07 15:29:04 [INFO] Reloading complete
172.17.0.18:41675 - [07/Sep/2018:15:29:11 +0000] 59925 "A IN kubernetes.default.svc.cluster.local. udp 54 false 512" NOERROR qr,aa,rd,ra 106 0.000066649s

```

<!--
## Known issues

Some Linux distributions (e.g. Ubuntu), use a local DNS resolver by default (systemd-resolved).
Systemd-resolved moves and replaces `/etc/resolv.conf` with a stub file that can cause a fatal forwarding
loop when resolving names in upstream servers. This can be fixed manually by using kubelet's `-resolv-conf` flag
to point to the correct `resolv.conf` (With `systemd-resolved`, this is `/run/systemd/resolve/resolv.conf`).
kubeadm automatically detects `systemd-resolved`, and adjusts the kubelet flags accordingly.
-->
## 已知问题 {#known-issues}

有些 Linux 发行版本（比如 Ubuntu）默认使用一个本地的 DNS 解析器（systemd-resolved）。
`systemd-resolved` 会用一个存根文件（Stub File）来覆盖 `/etc/resolv.conf` 内容，
从而可能在上游服务器中解析域名产生转发环（forwarding loop）。 这个问题可以通过手动指定
kubelet 的 `--resolv-conf` 标志为正确的 `resolv.conf`（如果是 `systemd-resolved`，
则这个文件路径为 `/run/systemd/resolve/resolv.conf`）来解决。
kubeadm 会自动检测 `systemd-resolved` 并对应的更改 kubelet 的命令行标志。

<!--
Kubernetes installs do not configure the nodes' `resolv.conf` files to use the
cluster DNS by default, because that process is inherently distribution-specific.
This should probably be implemented eventually.
-->
Kubernetes 的安装并不会默认配置节点的 `resolv.conf` 文件来使用集群的 DNS 服务，因为这个配置对于不同的发行版本是不一样的。这个问题应该迟早会被解决的。

<!--
Linux's libc (a.k.a. glibc) has a limit for the DNS `nameserver` records to 3
by default. What's more, for the glibc versions which are older than
glibc-2.17-222 ([the new versions update see this
issue](https://access.redhat.com/solutions/58028)), the allowed number of DNS
`search` records has been limited to 6 ([see this bug from
2005](https://bugzilla.redhat.com/show_bug.cgi?id=168253)). Kubernetes needs
to consume 1 `nameserver` record and 3 `search` records. This means that if a
local installation already uses 3 `nameserver`s or uses more than 3 `search`es
while your glibc version is in the affected list, some of those settings will
be lost. To work around the DNS `nameserver` records limit, the node can run
`dnsmasq`, which will provide more `nameserver` entries. You can also use
kubelet's `--resolv-conf` flag. To fix the DNS `search` records limit,
consider upgrading your linux distribution or upgrading to an unaffected
version of glibc.
-->
Linux 的 libc 限制 `nameserver` 只能有三个记录。不仅如此，对于 glibc-2.17-222
之前的版本（[参见此 Issue 了解新版本的更新](https://access.redhat.com/solutions/58028)），`search` 的记录不能超过 6 个
（ [详情请查阅这个 2005 年的 bug](https://bugzilla.redhat.com/show_bug.cgi?id=168253)）。
Kubernetes 需要占用一个 `nameserver` 记录和三个`search`记录。
这意味着如果一个本地的安装已经使用了三个 `nameserver` 或者使用了超过三个
`search` 记录，而你的 glibc 版本也在有问题的版本列表中，那么有些配置很可能会丢失。
为了绕过 DNS `nameserver` 个数限制，节点可以运行 `dnsmasq`，以提供更多的
`nameserver` 记录。你也可以使用kubelet 的 `--resolv-conf` 标志来解决这个问题。
要想修复 DNS `search` 记录个数限制问题，可以考虑升级你的 Linux 发行版本，或者
升级 glibc 到一个不再受此困扰的版本。

<!--
If you are using Alpine version 3.3 or earlier as your base image, DNS may not
work properly owing to a known issue with Alpine.
Check [here](https://github.com/kubernetes/kubernetes/issues/30215)
for more information.
-->
如果你使用 Alpine  3.3 或更早版本作为你的基础镜像，DNS 可能会由于 Alpine 中
一个已知的问题导致无法正常工作。
请查看[这里](https://github.com/kubernetes/kubernetes/issues/30215)获取更多信息。

## {{% heading "whatsnext" %}}

<!--
- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
-->
- 参阅[自动扩缩集群中的 DNS 服务](/zh/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- 阅读[服务和 Pod 的 DNS](/zh/docs/concepts/services-networking/dns-pod-service/)

