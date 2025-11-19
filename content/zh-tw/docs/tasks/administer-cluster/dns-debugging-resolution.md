---
title: 調試 DNS 問題
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
這篇文章提供了一些關於 DNS 問題診斷的方法。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
Your cluster must be configured to use the CoreDNS
{{< glossary_tooltip text="addon" term_id="addons" >}} or its precursor,
kube-dns.  
-->
你的叢集必須使用了 CoreDNS {{< glossary_tooltip text="插件" term_id="addons" >}}
或者其前身，`kube-dns`。

{{< version-check >}}

<!-- steps -->

<!--
### Create a simple Pod to use as a test environment
-->
### 創建一個簡單的 Pod 作爲測試環境   {#create-a-simple-pod-to-use-as-a-test-environment}

{{< codenew file="admin/dns/dnsutils.yaml" >}}

{{< note >}}
<!--
This example creates a pod in the `default` namespace. DNS name resolution for 
services depends on the namespace of the pod. For more information, review
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names).
-->
此示例在 `default` 名字空間創建 Pod。
服務的 DNS 名字解析取決於 Pod 的名字空間。
詳細信息請查閱 [Pod 與 Service 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)。
{{< /note >}}

<!--
Use that manifest to create a Pod:
-->
使用上面的清單來創建一個 Pod：

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```

```
pod/dnsutils created
```

<!--
…and verify its status:
-->
驗證其狀態：

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
一旦 Pod 處於運行狀態，你就可以在該環境裏執行 `nslookup`。
如果你看到類似下列的內容，則表示 DNS 是正常運行的。

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

輸出爲：

```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

<!--
If the `nslookup` command fails, check the following:
-->
如果 `nslookup` 命令執行失敗，請檢查下列內容：

<!--
### Check the local DNS configuration first

Take a look inside the resolv.conf file.
(See [Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers) and
[Known issues](#known-issues) below for more information)
-->
### 先檢查本地的 DNS 設定   {#check-the-local-dns-configuration-first}

查看 resolv.conf 文件的內容
（閱讀[定製 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/) 和
後文的[已知問題](#known-issues) ，獲取更多信息）

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

<!--
Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):
-->
驗證 search 和 nameserver 的設定是否與下面的內容類似
（注意 search 根據不同的雲提供商可能會有所不同）：

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

<!--
Errors such as the following indicate a problem with the CoreDNS (or kube-dns)
add-on or with associated Services:
-->
下列錯誤表示 CoreDNS （或 kube-dns）插件或者相關服務出現了問題：

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

輸出爲：

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

輸出爲：

```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

<!--
### Check if the DNS pod is running

Use the `kubectl get pods` command to verify that the DNS pod is running.
-->
### 檢查 DNS Pod 是否運行   {#check-if-the-dns-pod-is-running}

使用 `kubectl get pods` 命令來驗證 DNS Pod 是否運行。

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```

輸出爲：

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
對於 CoreDNS 和 kube-dns 部署而言，標籤 `k8s-app` 的值都應該是 `kube-dns`。
{{< /note >}}

<!--
If you see that no CoreDNS Pod is running or that the Pod has failed/completed,
the DNS add-on may not be deployed by default in your current environment and you
will have to deploy it manually.
-->
如果你發現沒有 CoreDNS Pod 在運行，或者該 Pod 的狀態是 failed 或者 completed，
那可能這個 DNS 插件在你當前的環境裏並沒有成功部署，你將需要手動去部署它。

<!--
### Check for errors in the DNS pod

Use the `kubectl logs` command to see logs for the DNS containers.
-->
### 檢查 DNS Pod 裏的錯誤    {#check-for-errors-in-the-dns-pod}

使用 `kubectl logs` 命令來查看 DNS 容器的日誌信息。

<!--
For CoreDNS:
-->
如查看 CoreDNS 的日誌信息：

```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

<!--
Here is an example of a healthy CoreDNS log:
-->
下列是一個正常運行的 CoreDNS 日誌信息：

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
查看是否日誌中有一些可疑的或者意外的消息。

<!--
### Is DNS service up?

Verify that the DNS service is up by using the `kubectl get service` command.
-->
### 檢查是否啓用了 DNS 服務   {#is-dns-service-up}

使用 `kubectl get service` 命令來檢查 DNS 服務是否已經啓用。

```shell
kubectl get svc --namespace=kube-system
```

輸出爲：

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
不管是 CoreDNS 還是 kube-dns，這個服務的名字都會是 `kube-dns`。
{{< /note >}}

<!--
If you have created the Service or in the case it should be created by default
but it does not appear, see
[debugging Services](/docs/tasks/debug/debug-application/debug-service/) for
more information.
-->
如果你已經創建了 DNS 服務，或者該服務應該是默認自動創建的但是它並沒有出現，
請閱讀[調試服務](/zh-cn/docs/tasks/debug/debug-application/debug-service/)來獲取更多信息。

<!--
### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpointslice`
command.
-->
### DNS 的端點公開了嗎？    {#are-dns-endpoints-exposed}

你可以使用 `kubectl get endpointslice` 命令來驗證 DNS 的端點是否公開了。

```shell
kubectl get endpointslice -l k8s.io/service-name=kube-dns --namespace=kube-system
```

```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS                  AGE
kube-dns-zxoja   IPv4          53      10.180.3.17,10.180.3.17    1h
```

<!--
If you do not see the endpoints, see the endpoints section in the
[debugging Services](/docs/tasks/debug/debug-application/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.
-->
如果你沒看到對應的端點，
請閱讀[調試服務](/zh-cn/docs/tasks/debug/debug-application/debug-service/)的端點部分。

若需要了解更多的 Kubernetes DNS 例子，請在 Kubernetes GitHub 倉庫裏查看
[cluster-dns 示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。

<!--
### Are DNS queries being received/processed?

You can verify if queries are being received by CoreDNS by adding the `log` plugin to the CoreDNS configuration (aka Corefile).
The CoreDNS Corefile is held in a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} named `coredns`. To edit it, use the command:
-->
### DNS 查詢有被接收或者執行嗎？   {#are-dns-queries-bing-received-processed}

你可以通過給 CoreDNS 的設定文件（也叫 Corefile）添加 `log` 插件來檢查查詢是否被正確接收。
CoreDNS 的 Corefile 被保存在一個叫 `coredns` 的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 裏，使用下列命令來編輯它：

```shell
kubectl -n kube-system edit configmap coredns
```

<!--
Then add `log` in the Corefile section per the example below:
-->
然後按下面的例子給 Corefile 添加 `log`。

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
保存這些更改後，你可能會需要等待一到兩分鐘讓 Kubernetes 把這些更改應用到
CoreDNS 的 Pod 裏。

<!--
Next, make some queries and view the logs per the sections above in this document. If CoreDNS pods are receiving the queries, you should see them in the logs.

Here is an example of a query in the log:
-->
接下來，發起一些查詢並依照前文所述查看日誌信息，如果 CoreDNS 的 Pod 接收到這些查詢，
你將可以在日誌信息裏看到它們。

下面是日誌信息裏的查詢例子：

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
term_id="service" >}} and {{< glossary_tooltip text="endpointslice"
term_id="endpoint-slice" >}} related resources to properly resolve service names.

Sample error message:
-->
### CoreDNS 是否有足夠的權限？   {#does-coredns-have-sufficient-permissions}

CoreDNS 必須能夠列出 {{< glossary_tooltip text="service" term_id="service" >}} 和
{{< glossary_tooltip text="endpointslice" term_id="endpoint-slice" >}} 相關的資源來正確解析服務名稱。

示例錯誤消息：

```
2022-03-18T07:12:15.699431183Z [INFO] 10.96.144.227:52299 - 3686 "A IN serverproxy.contoso.net.cluster.local. udp 52 false 512" SERVFAIL qr,aa,rd 145 0.000091221s
```

<!--
First, get the current ClusterRole of `system:coredns`:
-->
首先，獲取當前的 ClusterRole `system:coredns`：

```shell
kubectl describe clusterrole system:coredns -n kube-system
```

<!--
Expected output:
-->
預期輸出：

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
如果缺少任何權限，請編輯 ClusterRole 來添加它們：

```shell
kubectl edit clusterrole system:coredns -n kube-system
```

<!--
Example insertion of EndpointSlices permissions:
-->
EndpointSlices 權限的插入示例：

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
### 你的服務在正確的名字空間中嗎？   {#are-you-in-the-right-namespace-for-the-service}

未指定名字空間的 DNS 查詢僅作用於 Pod 所在的名字空間。

如果 Pod 和服務的名字空間不相同，則 DNS 查詢必須指定服務所在的名字空間。

該查詢僅限於 Pod 所在的名字空間：

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>
```

<!--
This query specifies the namespace:
-->
指定名字空間的查詢：

```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>.<namespace>
```

<!--
To learn more about name resolution, see 
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names). 
-->
要進一步瞭解名字解析，請查看
[Pod 與 Service 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)。

<!--
## Known issues

Some Linux distributions (e.g. Ubuntu) use a local DNS resolver by default (systemd-resolved).
Systemd-resolved moves and replaces `/etc/resolv.conf` with a stub file that can cause a fatal forwarding
loop when resolving names in upstream servers. This can be fixed manually by using kubelet's `--resolv-conf` flag
to point to the correct `resolv.conf` (With `systemd-resolved`, this is `/run/systemd/resolve/resolv.conf`).
kubeadm automatically detects `systemd-resolved`, and adjusts the kubelet flags accordingly.
-->
## 已知問題 {#known-issues}

有些 Linux 發行版本（比如 Ubuntu）默認使用一個本地的 DNS 解析器（systemd-resolved）。
`systemd-resolved` 會用一個存根文件（Stub File）來覆蓋 `/etc/resolv.conf` 內容，
從而可能在上游伺服器中解析域名產生轉發環（forwarding loop）。 這個問題可以通過手動指定
kubelet 的 `--resolv-conf` 標誌爲正確的 `resolv.conf`（如果是 `systemd-resolved`，
則這個文件路徑爲 `/run/systemd/resolve/resolv.conf`）來解決。
kubeadm 會自動檢測 `systemd-resolved` 並對應的更改 kubelet 的命令列標誌。

<!--
Kubernetes installs do not configure the nodes' `resolv.conf` files to use the
cluster DNS by default, because that process is inherently distribution-specific.
This should probably be implemented eventually.
-->
Kubernetes 的安裝並不會默認設定節點的 `resolv.conf` 文件來使用叢集的 DNS 服務，
因爲這個設定對於不同的發行版本是不一樣的。這個問題應該遲早會被解決的。

<!--
Linux's libc (a.k.a. glibc) has a limit for the DNS `nameserver` records to 3 by
default and Kubernetes needs to consume 1 `nameserver` record. This means that
if a local installation already uses 3 `nameserver`s, some of those entries will
be lost. To work around this limit, the node can run `dnsmasq`, which will
provide more `nameserver` entries. You can also use kubelet's `--resolv-conf`
flag.
-->
Linux 的 libc（又名 glibc）默認將 DNS `nameserver` 記錄限制爲 3，
而 Kubernetes 需要使用 1 條 `nameserver` 記錄。
這意味着如果本地的安裝已經使用了 3 個 `nameserver`，那麼其中有些條目將會丟失。
要解決此限制，節點可以運行 `dnsmasq`，以提供更多 `nameserver` 條目。
你也可以使用 kubelet 的 `--resolv-conf` 標誌來解決這個問題。

<!--
If you are using Alpine version 3.17 or earlier as your base image, DNS may not
work properly due to a design issue with Alpine. 
Until musl version 1.24 didn't include TCP fallback to the DNS stub resolver meaning any DNS call above 512 bytes would fail.
Please upgrade your images to Alpine version 3.18 or above.
-->
如果你使用 Alpine 3.17 或更早版本作爲你的基礎映像檔，DNS 可能會由於 Alpine 的設計問題而無法工作。
在 musl 1.24 版本之前，DNS 存根解析器都沒有包括 TCP 回退，
這意味着任何超過 512 字節的 DNS 調用都會失敗。請將你的映像檔升級到 Alpine 3.18 或更高版本。

## {{% heading "whatsnext" %}}

<!--
- See [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- Read [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
-->
- 參閱[自動擴縮叢集中的 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- 閱讀 [Pod 與 Service 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)
