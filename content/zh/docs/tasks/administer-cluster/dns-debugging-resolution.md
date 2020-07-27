---
title: 调试 DNS 问题
content_type: task
---

<!-- overview -->
<!--
This page provides hints on diagnosing DNS problems.
-->

这篇文章提供了一些关于 DNS 问题诊断的方法。

<!-- steps -->

## {{% heading "prerequisites" %}}

<!-- ZH: The following include shortcode misbehaves even when inside a HTML
comment. This may be a generic problem to be fixed.-->

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
- Kubernetes 1.6 或者以上版本。
- 集群必须使用了 `coredns` (或者 `kube-dns`)插件。
  
<!--
### Create a simple Pod to use as a test environment

Create a file named busybox.yaml with the following contents:

{{< codenew file="admin/dns/busybox.yaml" >}}

Then create a pod using this file and verify its status:

```shell
kubectl create -f https://k8s.io/examples/admin/dns/busybox.yaml
pod/busybox created

kubectl get pods busybox
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```
-->

### 创建一个简单的 Pod 作为测试环境

新建一个名为 busybox.yaml 的文件并填入下列内容：

{{< codenew file="admin/dns/busybox.yaml" >}}

然后使用这个文件创建一个 Pod 并验证其状态：

```shell
kubectl create -f https://k8s.io/examples/admin/dns/busybox.yaml
pod/busybox created

kubectl get pods busybox
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```

<!--

Once that pod is running, you can exec `nslookup` in that environment.
If you see something like the following, DNS is working correctly.

```shell
kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

If the `nslookup` command fails, check the following:

-->

只要 Pod 处于 running 状态，您就可以在环境里执行 `nslookup` 。
如果您看到类似下列的内容，则表示 DNS 是正常运行的。

```shell
kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

如果 `nslookup` 命令执行失败，请检查下列内容：

<!--

### Check the local DNS configuration first

Take a look inside the resolv.conf file.
(See [Inheriting DNS from the node](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node) and
[Known issues](#known-issues) below for more information)

```shell
kubectl exec busybox cat /etc/resolv.conf
```

Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```
-->

### 先检查本地的 DNS 配置

查看 resolv.conf 文件的内容
(阅读下面的 [从节点继承 DNS 配置](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node) 和
[已知问题](#known-issues) ，获取更多信息)

```shell
kubectl exec busybox cat /etc/resolv.conf
```

验证 search 和 name server 的配置是否类似下面的配置
(注意 search 根据不同的云提供商可能会有所不同):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

<!--

Errors such as the following indicate a problem with the coredns/kube-dns add-on or
associated Services:

```
kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

or

```
kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

-->

下列错误表示 coredns/kube-dns 或者相关服务出现了问题：

```
kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

或者

```
kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

<!--

### Check if the DNS pod is running

Use the `kubectl get pods` command to verify that the DNS pod is running.

For CoreDNS:
```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

Or for kube-dns:
```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
NAME                    READY     STATUS    RESTARTS   AGE
...
kube-dns-v19-ezo1y      3/3       Running   0           1h
...
```

If you see that no pod is running or that the pod has failed/completed, the DNS
add-on may not be deployed by default in your current environment and you will
have to deploy it manually.

-->

### 检查 DNS Pod 是否运行

使用 `kubectl get pods` 命令来验证 DNS Pod 是否运行。

对于 CoreDNS 的情况:

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

或者是 kube-dns:

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
NAME                    READY     STATUS    RESTARTS   AGE
...
kube-dns-v19-ezo1y      3/3       Running   0           1h
...
```

如果您发现没有 pod 在运行，或者这些 Pod 的状态是 failed 或者 completed， 那可能这个 DNS 插件在您当前的环境里并没有成功部署，您将需要手动去部署它。

<!--

### Check for Errors in the DNS pod

Use `kubectl logs` command to see logs for the DNS containers.

For CoreDNS:
```shell
for p in $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name); do kubectl logs --namespace=kube-system $p; done
```

Here is an example of a healthy CoreDNS log:

```
.:53
2018/08/15 14:37:17 [INFO] CoreDNS-1.2.2
2018/08/15 14:37:17 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.2
linux/amd64, go1.10.3, 2e322f6
2018/08/15 14:37:17 [INFO] plugin/reload: Running configuration MD5 = 24e6c59e83ce706f07bcc82c31b1ea1c
```

-->

### 检查 DNS pod 里的错误

使用 `kubectl logs` 命令来查看 DNS 容器的日志信息。

对于 CoreDNS:

```shell
for p in $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name); do kubectl logs --namespace=kube-system $p; done
```

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

For kube-dns, there are 3 sets of logs:

```shell
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name | head -1) -c kubedns

kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name | head -1) -c dnsmasq

kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name | head -1) -c sidecar
```

See if there are any suspicious error messages in the logs. In kube-dns, a '`W`', '`E`' or '`F`' at the beginning
of a line represents a Warning, Error or Failure. Please search for entries that have these
as the logging level and use
[kubernetes issues](https://github.com/kubernetes/kubernetes/issues)
to report unexpected errors.

-->

对于 kube-dns, 总共有三种类型的日志需要查看：

```shell
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name | head -1) -c kubedns

kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name | head -1) -c dnsmasq

kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name | head -1) -c sidecar
```

看日志信息里是否有可疑的错误，对于 kube-dns,  一个 '`W`', '`E`' 或者 '`F`' 开头的行表示对应的 Warning（警告）， Error（错误）或者 Failure（失败）。请搜索日志等级是否有这样的关键字的日志信息并使用 [kubernetes issues](https://github.com/kubernetes/kubernetes/issues) 来提交错误报告。

### 检查是否启用了 DNS 服务

使用`kubectl get service` 命令来检查 DNS 服务是否已经启用。

```shell
kubectl get svc --namespace=kube-system
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns     ClusterIP   10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

注意不管是 CoreDNS 还是 kube-dns ， 这个 service 的名字都会是“kube-dns” 。
如果您已经创建了这个 service 或者说在这个例子里它应该是默认自动创建的，但是它并没有出现，请阅读 [services 纠错](/docs/tasks/debug-application-cluster/debug-service/)来获取更多信息。

<!--

### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints`
command.

```shell
kubectl get ep kube-dns --namespace=kube-system
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

If you do not see the endpoints, see endpoints section in the
[debugging services](/docs/tasks/debug-application-cluster/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.

-->

### DNS 的 endpoints 公开了吗？

您可以使用 `kubectl get endpoints`命令来验证 DNS 的 endpoint 是否公开了。

```shell
kubectl get ep kube-dns --namespace=kube-system
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

如果您没看到对应的 endpoints， 请阅读[services 纠错](/docs/tasks/debug-application-cluster/debug-service/)的 endpoints 小节。

若需要更多的 Kubernetes DNS 例子，请在 Kubernetes GitHub 仓库里查看[cluster-dns 例子](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns) 。 

<!--

### Are DNS queries being received/processed?

You can verify if queries are being received by CoreDNS by adding the `log` plugin to the CoreDNS configuration (aka Corefile).
The CoreDNS Corefile is held in a ConfigMap named `coredns`. To edit it, use the command ...

```
kubectl -n kube-system edit configmap coredns
```

-->

### DNS 查询有被接收或者执行吗？

您可以通过给 CoreDNS 的配置文件 (也叫 Corefile)添加`log`插件来判断查询是否被正确接收。
 CoreDNS 的 Corefile 被保存在一个叫 `coredns` 的 ConfigMap 里，使用下列命令来编辑它：

```
kubectl -n kube-system edit configmap coredns
```

<!--

Then add `log` in the Corefile section per the example below.

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
        proxy . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }

```

After saving the changes, it may take up to minute or two for Kubernetes to propagate these changes to the CoreDNS pods.

-->

然后类似下面的例子给 Corefile 添加 `log`。

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
        proxy . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }

```

保存这些更改后，您可能会需要等待一到两分钟让 Kubernetes 把这些更改应用到 CoreDNS 的 pods 里。

<!--

Next, make some queries and view the logs per the sections above in this document. If CoreDNS pods are receiving the queries, you should see them in the logs.

Here is an example of a query in the log.

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

-->

接下来，发起一些查询并依照本文上面章节的内容查看日志信息，如果 CoreDNS 的 pods 接收到这些查询，您将可以在日志信息里看到他们。

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
loop when resolving names in upstream servers. This can be fixed manually by using kubelet's `--resolv-conf` flag
to point to the correct `resolv.conf` (With `systemd-resolved`, this is `/run/systemd/resolve/resolv.conf`).
kubeadm (>= 1.11) automatically detects `systemd-resolved`, and adjusts the kubelet flags accordingly.

-->

## 已知问题

有些 Linux 发行版本 (比如 Ubuntu)， 默认使用一个本地的 DNS 解析器 (systemd-resolved)。
Systemd-resolved 会用一个 stub 文件来覆盖 `/etc/resolv.conf`从而在解析域名的时候导致了重复向 DNS 上游服务器推送请求。 这个问题可以通过手动指定 kubelet 的 `--resolv-conf` 标签为正确的 `resolv.conf` (如果是 `systemd-resolved`，则这个文件路径为 `/run/systemd/resolve/resolv.conf`) 来解决。
kubeadm (>= 1.11) 会自动检测`systemd-resolved`并对应的更改 kubelet 的标签。

<!--
Kubernetes installs do not configure the nodes' `resolv.conf` files to use the
cluster DNS by default, because that process is inherently distribution-specific.
This should probably be implemented eventually.

Linux's libc is impossibly stuck ([see this bug from
2005](https://bugzilla.redhat.com/show_bug.cgi?id=168253)) with limits of just
3 DNS `nameserver` records and 6 DNS `search` records. Kubernetes needs to
consume 1 `nameserver` record and 3 `search` records. This means that if a
local installation already uses 3 `nameserver`s or uses more than 3 `search`es,
some of those settings will be lost. As a partial workaround, the node can run
`dnsmasq` which will provide more `nameserver` entries, but not more `search`
entries. You can also use kubelet's `--resolv-conf` flag.

If you are using Alpine version 3.3 or earlier as your base image, DNS may not
work properly owing to a known issue with Alpine.
Check [here](https://github.com/kubernetes/kubernetes/issues/30215)
for more information.
-->
Kubernetes 的安装并不会默认配置节点的 `resolv.conf` 文件来使用集群的 DNS 服务，因为这个配置对于不同的发行版本是不一样的。这个问题应该迟早会被解决的。

Linux 的 libc 会在仅有三个 DNS 的 `nameserver` 和六个 DNS 的`search` 记录时会不可思议的卡死 ([详情请查阅这个2005年的bug](https://bugzilla.redhat.com/show_bug.cgi?id=168253))。Kubernetes 需要占用一个 `nameserver` 记录和三个`search`记录。这意味着如果一个本地的安装已经使用了三个`nameserver`或者使用了超过三个的 `search`记录，那有些配置很可能会丢失。有一个不完整的解决方案就是在节点上使用`dnsmasq`来提供更多的`nameserver`配置，但是无法提供更多的`search`记录。您也可以使用kubelet 的 `--resolv-conf` 标签来解决这个问题。

如果您是使用 Alpine  3.3 或者更早版本作为您的基础镜像，DNS 可能会由于Alpine 一个已知的问题导致无法正常工作，请查看[这里](https://github.com/kubernetes/kubernetes/issues/30215)获取更多资料。

<!--
## References

- [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
- [Docs for the kube-dns DNS cluster addon](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/README.md)

## What's next
- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
-->

## 参考

- [Services 和 Pods 的 DNS 指南](/docs/concepts/services-networking/dns-pod-service/)
- [kube-dns DNS 插件文档](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/README.md)

## 接下来

- [集群里自动伸缩 DNS Service](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).


