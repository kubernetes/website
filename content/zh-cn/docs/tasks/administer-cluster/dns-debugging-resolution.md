---
title: 调试 DNS 问题
content_type: task
min-kubernetes-server-version: v1.6
weight: 170
---
<!--
reviewers:
- bowei
- zihongz
title:  Debugging DNS Resolution
content_type: task
min-kubernetes-server-version: v1.6
weight: 170
-->

<!-- overview -->
<!--
This page provides hints on diagnosing DNS problems.
-->
这篇文章提供了一些关于 DNS 问题诊断的方法。

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

<!-- steps -->

<!--
### Create a simple Pod to use as a test environment
-->
### 创建一个简单的 Pod 作为测试环境   {#create-a-simple-pod-to-use-as-a-test-environment}

{{< codenew file="admin/dns/dnsutils.yaml" >}}

{{< note >}}
<!--
This example creates a pod in the `default` namespace. DNS name resolution for 
services depends on the namespace of the pod. For more information, review
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names).
-->
此示例在 `default` 名字空间创建 Pod。
服务的 DNS 名字解析取决于 Pod 的名字空间。
详细信息请查阅 [Pod 与 Service 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)。
{{< /note >}}

<!--
Use that manifest to create a Pod:
-->
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
NAME       READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

<!--
Once that Pod is running, you can exec `nslookup` in that environment.
If you see something like the following, DNS is working correctly.
-->
一旦 Pod 处于运行状态，你就可以在该环境里执行 `nslookup`。
如果你看到类似下列的内容，则表示 DNS 是正常运行的。

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

输出为：

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
(See [Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers) and
[Known issues](#known-issues) below for more information)
-->
### 先检查本地的 DNS 配置   {#check-the-local-dns-configuration-first}

查看 resolv.conf 文件的内容
（阅读[定制 DNS 服务](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/) 和
后文的[已知问题](#known-issues) ，获取更多信息）

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

<!--
Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):
-->
验证 search 和 nameserver 的配置是否与下面的内容类似
（注意 search 根据不同的云提供商可能会有所不同）：

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

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

输出为：

```
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

<!--
or
-->
或者

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

输出为：

```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

<!--
### Check if the DNS pod is running

Use the `kubectl get pods` command to verify that the DNS pod is running.
-->
### 检查 DNS Pod 是否运行   {#check-if-the-dns-pod-is-running}

使用 `kubectl get pods` 命令来验证 DNS Pod 是否运行。

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```

输出为：

```
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

{{< note >}}
<!--
The value for label `k8s-app` is `kube-dns` for both CoreDNS and kube-dns deployments.
-->
对于 CoreDNS 和 kube-dns 部署而言，标签 `k8s-app` 的值都应该是 `kube-dns`。
{{< /note >}}

<!--
If you see that no CoreDNS Pod is running or that the Pod has failed/completed,
the DNS add-on may not be deployed by default in your current environment and you
will have to deploy it manually.
-->
如果你发现没有 CoreDNS Pod 在运行，或者该 Pod 的状态是 failed 或者 completed，
那可能这个 DNS 插件在你当前的环境里并没有成功部署，你将需要手动去部署它。

<!--
### Check for errors in the DNS pod

Use the `kubectl logs` command to see logs for the DNS containers.
-->
### 检查 DNS Pod 里的错误    {#check-for-errors-in-the-dns-pod}

使用 `kubectl logs` 命令来查看 DNS 容器的日志信息。

<!--
For CoreDNS:
-->
如查看 CoreDNS 的日志信息：

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
### 检查是否启用了 DNS 服务   {#is-dns-service-up}

使用 `kubectl get service` 命令来检查 DNS 服务是否已经启用。

```shell
kubectl get svc --namespace=kube-system
```

输出为：

```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns     ClusterIP   10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

{{< note >}}
<!--
The service name is `kube-dns` for both CoreDNS and kube-dns deployments.
-->
不管是 CoreDNS 还是 kube-dns，这个服务的名字都会是 `kube-dns`。
{{< /note >}}

<!--
If you have created the Service or in the case it should be created by default
but it does not appear, see
[debugging Services](/docs/tasks/debug/debug-application/debug-service/) for
more information.
-->
如果你已经创建了 DNS 服务，或者该服务应该是默认自动创建的但是它并没有出现，
请阅读[调试服务](/zh-cn/docs/tasks/debug/debug-application/debug-service/)来获取更多信息。

<!--
### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints`
command.
-->
### DNS 的端点公开了吗？    {#are-dns-endpoints-exposed}

你可以使用 `kubectl get endpoints` 命令来验证 DNS 的端点是否公开了。

```shell
kubectl get endpoints kube-dns --namespace=kube-system
```

```
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

<!--
If you do not see the endpoints, see the endpoints section in the
[debugging Services](/docs/tasks/debug/debug-application/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.
-->
如果你没看到对应的端点，
请阅读[调试服务](/zh-cn/docs/tasks/debug/debug-application/debug-service/)的端点部分。

若需要了解更多的 Kubernetes DNS 例子，请在 Kubernetes GitHub 仓库里查看
[cluster-dns 示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。

<!--
### Are DNS queries being received/processed?

You can verify if queries are being received by CoreDNS by adding the `log` plugin to the CoreDNS configuration (aka Corefile).
The CoreDNS Corefile is held in a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} named `coredns`. To edit it, use the command:
-->
### DNS 查询有被接收或者执行吗？   {#are-dns-queries-bing-received-processed}

你可以通过给 CoreDNS 的配置文件（也叫 Corefile）添加 `log` 插件来检查查询是否被正确接收。
CoreDNS 的 Corefile 被保存在一个叫 `coredns` 的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 里，使用下列命令来编辑它：

```shell
kubectl -n kube-system edit configmap coredns
```

<!--
Then add `log` in the Corefile section per the example below:
-->
然后按下面的例子给 Corefile 添加 `log`。

```yaml
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

Here is an example of a query in the log:
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
### Does CoreDNS have sufficient permissions?

CoreDNS must be able to list {{< glossary_tooltip text="service"
term_id="service" >}} and {{< glossary_tooltip text="endpoint"
term_id="endpoint" >}} related resources to properly resolve service names.

Sample error message:
-->
### CoreDNS 是否有足够的权限？   {#does-coredns-have-sufficient-permissions}

CoreDNS 必须能够列出 {{< glossary_tooltip text="service" term_id="service" >}} 和
{{< glossary_tooltip text="endpoint" term_id="endpoint" >}} 相关的资源来正确解析服务名称。

示例错误消息：

```
2022-03-18T07:12:15.699431183Z [INFO] 10.96.144.227:52299 - 3686 "A IN serverproxy.contoso.net.cluster.local. udp 52 false 512" SERVFAIL qr,aa,rd 145 0.000091221s
```

<!--
First, get the current ClusterRole of `system:coredns`:
-->
首先，获取当前的 ClusterRole `system:coredns`：

```shell
kubectl describe clusterrole system:coredns -n kube-system
```

<!--
Expected output:
-->
预期输出：

```
PolicyRule:
  Resources                        Non-Resource URLs  Resource Names  Verbs
  ---------                        -----------------  --------------  -----
  endpoints                        []                 []              [list watch]
  namespaces                       []                 []              [list watch]
  pods                             []                 []              [list watch]
  services                         []                 []              [list watch]
  endpointslices.discovery.k8s.io  []                 []              [list watch]
```

<!--
If any permissions are missing, edit the ClusterRole to add them:
-->
如果缺少任何权限，请编辑 ClusterRole 来添加它们：

```shell
kubectl edit clusterrole system:coredns -n kube-system
```

<!--
Example insertion of EndpointSlices permissions:
-->
EndpointSlices 权限的插入示例：

```
...
- apiGroups:
  - discovery.k8s.io
  resources:
  - endpointslices
  verbs:
  - list
  - watch
...
```

<!--
### Are you in the right namespace for the service?

DNS queries that don't specify a namespace are limited to the pod's 
namespace. 

If the namespace of the pod and service differ, the DNS query must include 
the namespace of the service.

This query is limited to the pod's namespace:
-->
### 你的服务在正确的名字空间中吗？   {#are-you-in-the-right-namespace-for-the-service}

未指定名字空间的 DNS 查询仅作用于 Pod 所在的名字空间。

如果 Pod 和服务的名字空间不相同，则 DNS 查询必须指定服务所在的名字空间。

该查询仅限于 Pod 所在的名字空间：

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>
```

<!--
This query specifies the namespace:
-->
指定名字空间的查询：

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>.<namespace>
```

<!--
To learn more about name resolution, see 
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names). 
-->
要进一步了解名字解析，请查看
[Pod 与 Service 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)。

<!--
## Known issues

Some Linux distributions (e.g. Ubuntu) use a local DNS resolver by default (systemd-resolved).
Systemd-resolved moves and replaces `/etc/resolv.conf` with a stub file that can cause a fatal forwarding
loop when resolving names in upstream servers. This can be fixed manually by using kubelet's `--resolv-conf` flag
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
Kubernetes 的安装并不会默认配置节点的 `resolv.conf` 文件来使用集群的 DNS 服务，
因为这个配置对于不同的发行版本是不一样的。这个问题应该迟早会被解决的。

<!--
Linux's libc (a.k.a. glibc) has a limit for the DNS `nameserver` records to 3 by
default and Kubernetes needs to consume 1 `nameserver` record. This means that
if a local installation already uses 3 `nameserver`s, some of those entries will
be lost. To work around this limit, the node can run `dnsmasq`, which will
provide more `nameserver` entries. You can also use kubelet's `--resolv-conf`
flag.
-->
Linux 的 libc（又名 glibc）默认将 DNS `nameserver` 记录限制为 3，
而 Kubernetes 需要使用 1 条 `nameserver` 记录。
这意味着如果本地的安装已经使用了 3 个 `nameserver`，那么其中有些条目将会丢失。
要解决此限制，节点可以运行 `dnsmasq`，以提供更多 `nameserver` 条目。
你也可以使用 kubelet 的 `--resolv-conf` 标志来解决这个问题。

<!--
If you are using Alpine version 3.17 or earlier as your base image, DNS may not
work properly due to a design issue with Alpine. 
Until musl version 1.24 didn't include TCP fallback to the DNS stub resolver meaning any DNS call above 512 bytes would fail.
Please upgrade your images to Alpine version 3.18 or above.
-->
如果你使用 Alpine 3.17 或更早版本作为你的基础镜像，DNS 可能会由于 Alpine 的设计问题而无法工作。
在 musl 1.24 版本之前，DNS 存根解析器都没有包括 TCP 回退，
这意味着任何超过 512 字节的 DNS 调用都会失败。请将你的镜像升级到 Alpine 3.18 或更高版本。

## {{% heading "whatsnext" %}}

<!--
- See [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- Read [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
-->
- 参阅[自动扩缩集群中的 DNS 服务](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- 阅读 [Pod 与 Service 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)
