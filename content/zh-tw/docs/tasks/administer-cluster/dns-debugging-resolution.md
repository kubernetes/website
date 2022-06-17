---
title: 除錯 DNS 問題
content_type: task
min-kubernetes-server-version: v1.6
---

<!-- overview -->
<!--
This page provides hints on diagnosing DNS problems.
-->
這篇文章提供了一些關於 DNS 問題診斷的方法。

<!-- steps -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- 
Your cluster must be configured to use the CoreDNS
{{< glossary_tooltip text="addon" term_id="addons" >}} or its precursor,
kube-dns.  
-->

你的叢集必須使用了 CoreDNS {{< glossary_tooltip text="外掛" term_id="addons" >}}
或者其前身，`kube-dns`。

{{< version-check >}}

<!--
### Create a simple Pod to use as a test environment

{{< codenew file="admin/dns/dnsutils.yaml" >}}

{{< note >}}
This example creates a pod in the `default` namespace. DNS name resolution for 
services depends on the namespace of the pod. For more information, review
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names). 
{{< /note >}}

Use that manifest to create a Pod:

```shell
kubectl create -f https://k8s.io/examples/admin/dns/busybox.yaml
pod/busybox created

kubectl get pods busybox
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```
-->
### 建立一個簡單的 Pod 作為測試環境

{{< codenew file="admin/dns/dnsutils.yaml" >}}

{{< note >}}
此示例在 `default` 名稱空間建立 pod。 服務的 DNS 名字解析取決於 pod 的名稱空間。 詳細資訊請查閱
[服務和 Pod 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)。
{{< /note >}}

使用上面的清單來建立一個 Pod：

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
NAME      READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

<!--
Once that pod is running, you can exec `nslookup` in that environment.
If you see something like the following, DNS is working correctly.
-->
一旦 Pod 處於執行狀態，你就可以在該環境裡執行 `nslookup`。
如果你看到類似下列的內容，則表示 DNS 是正常執行的。

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
如果 `nslookup` 命令執行失敗，請檢查下列內容：

<!--
### Check the local DNS configuration first

Take a look inside the resolv.conf file.
(See [Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers) and
[Known issues](#known-issues) below for more information)
-->
### 先檢查本地的 DNS 配置

檢視 resolv.conf 檔案的內容
（閱讀[定製 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-custom-nameservers/) 和
後文的[已知問題](#known-issues) ，獲取更多資訊)

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

<!--
Verify that the search path and name server are set up like the following
(note that search path may vary for different cloud providers):
-->
驗證 search 和 nameserver 的配置是否與下面的內容類似
（注意 search 根據不同的雲提供商可能會有所不同)：

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

<!--
Errors such as the following indicate a problem with the CoreDNS (or kube-dns)
add-on or with associated Services:
-->
下列錯誤表示 CoreDNS （或 kube-dns）外掛或者相關服務出現了問題：

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```

輸出為：

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
### 檢查 DNS Pod 是否執行   {#check-if-the-dns-pod-is-running}

使用 `kubectl get pods` 命令來驗證 DNS Pod 是否執行。

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
對於 CoreDNS 和 kube-dns 部署而言，標籤 `k8s-app` 的值都應該是 `kube-dns`。
{{< /note >}}

<!--
If you see that no CoreDNS pod is running or that the pod has failed/completed,
the DNS add-on may not be deployed by default in your current environment and you
will have to deploy it manually.
-->
如果你發現沒有 CoreDNS Pod 在執行，或者該 Pod 的狀態是 failed 或者 completed，
那可能這個 DNS 外掛在你當前的環境裡並沒有成功部署，你將需要手動去部署它。

<!--
### Check for Errors in the DNS pod

Use `kubectl logs` command to see logs for the DNS containers.
-->
### 檢查 DNS Pod 裡的錯誤    {#check-for-errors-in-the-dns-pod}

使用 `kubectl logs` 命令來檢視 DNS 容器的日誌資訊。

```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

<!--
Here is an example of a healthy CoreDNS log:
-->
下列是一個正常執行的 CoreDNS 日誌資訊：

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
檢視是否日誌中有一些可疑的或者意外的訊息。

<!--
### Is DNS service up?

Verify that the DNS service is up by using the `kubectl get service` command.
-->
### 檢查是否啟用了 DNS 服務   {#is-dns-service-up}

使用 `kubectl get service` 命令來檢查 DNS 服務是否已經啟用。

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
不管是 CoreDNS 還是 kube-dns，這個服務的名字都會是 `kube-dns` 。
{{< /note >}}

<!--
If you have created the Service or in the case it should be created by default
but it does not appear, see
[debugging Services](/docs/tasks/debug/debug-application/debug-service/) for
more information.
-->
如果你已經建立了 DNS 服務，或者該服務應該是預設自動建立的但是它並沒有出現，
請閱讀[除錯服務](/zh-cn/docs/tasks/debug/debug-application/debug-service/)
來獲取更多資訊。

<!--
### Are DNS endpoints exposed?

You can verify that DNS endpoints are exposed by using the `kubectl get endpoints`
command.
-->
### DNS 的端點公開了嗎？    {#are-dns-endpoints-exposed}

你可以使用 `kubectl get endpoints` 命令來驗證 DNS 的端點是否公開了。

```shell
kubectl get ep kube-dns --namespace=kube-system
```

```
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

<!--
If you do not see the endpoints, see endpoints section in the
[debugging services](/docs/tasks/debug/debug-application/debug-service/) documentation.

For additional Kubernetes DNS examples, see the
[cluster-dns examples](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)
in the Kubernetes GitHub repository.
-->
如果你沒看到對應的端點，請閱讀
[除錯服務](/zh-cn/docs/tasks/debug/debug-application/debug-service/)的端點部分。

若需要了解更多的 Kubernetes DNS 例子，請在 Kubernetes GitHub 倉庫裡檢視
[cluster-dns 示例](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)。 

<!--
### Are DNS queries being received/processed?

You can verify if queries are being received by CoreDNS by adding the `log` plugin to the CoreDNS configuration (aka Corefile).
The CoreDNS Corefile is held in a ConfigMap named `coredns`. To edit it, use the command ...
-->
### DNS 查詢有被接收或者執行嗎？   {#are-dns-queries-bing-received-processed}

你可以透過給 CoreDNS 的配置檔案（也叫 Corefile）新增 `log` 外掛來檢查查詢是否被正確接收。
CoreDNS 的 Corefile 被儲存在一個叫 `coredns` 的 ConfigMap 裡，使用下列命令來編輯它：

```shell
kubectl -n kube-system edit configmap coredns
```

<!--
Then add `log` in the Corefile section per the example below.
-->
然後按下面的例子給 Corefile 新增 `log`。

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
儲存這些更改後，你可能會需要等待一到兩分鐘讓 Kubernetes 把這些更改應用到
CoreDNS 的 Pod 裡。

<!--
Next, make some queries and view the logs per the sections above in this document. If CoreDNS pods are receiving the queries, you should see them in the logs.

Here is an example of a query in the log.
-->
接下來，發起一些查詢並依照前文所述檢視日誌資訊，如果 CoreDNS 的 Pod 接收到這些查詢，
你將可以在日誌資訊裡看到它們。

下面是日誌資訊裡的查詢例子：

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
### CoreDNS 是否有足夠的許可權？

CoreDNS 必須能夠列出 {{< glossary_tooltip text="service" term_id="service" >}} 和
{{< glossary_tooltip text="endpoint" term_id="endpoint" >}} 相關的資源來正確解析服務名稱。

示例錯誤訊息：
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
  nodes                            []                 []              [get]
  endpoints                        []                 []              [list watch]
  namespaces                       []                 []              [list watch]
  pods                             []                 []              [list watch]
  services                         []                 []              [list watch]
  endpointslices.discovery.k8s.io  []                 []              [list watch]
```

<!--
If any permissions are missing, edit the ClusterRole to add them:
-->
如果缺少任何許可權，請編輯 ClusterRole 來新增它們：

```shell
kubectl edit clusterrole system:coredns -n kube-system
```

<!--
Example insertion of EndpointSlices permissions:
-->
EndpointSlices 許可權的插入示例：
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
### 你的服務在正確的名稱空間中嗎？

未指定名稱空間的 DNS 查詢僅作用於 pod 所在的名稱空間。

如果 pod 和服務的名稱空間不相同，則 DNS 查詢必須指定服務所在的名稱空間。

該查詢僅限於 pod 所在的名稱空間：
```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>
```

<!--
This query specifies the namespace:
-->
指定名稱空間的查詢：
```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>.<namespace>
```

<!--
To learn more about name resolution, see 
[DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names). 
-->
要進一步瞭解名字解析，請檢視
[服務和 Pod 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)。

<!--
## Known issues

Some Linux distributions (e.g. Ubuntu), use a local DNS resolver by default (systemd-resolved).
Systemd-resolved moves and replaces `/etc/resolv.conf` with a stub file that can cause a fatal forwarding
loop when resolving names in upstream servers. This can be fixed manually by using kubelet's `-resolv-conf` flag
to point to the correct `resolv.conf` (With `systemd-resolved`, this is `/run/systemd/resolve/resolv.conf`).
kubeadm automatically detects `systemd-resolved`, and adjusts the kubelet flags accordingly.
-->
## 已知問題 {#known-issues}

有些 Linux 發行版本（比如 Ubuntu）預設使用一個本地的 DNS 解析器（systemd-resolved）。
`systemd-resolved` 會用一個存根檔案（Stub File）來覆蓋 `/etc/resolv.conf` 內容，
從而可能在上游伺服器中解析域名產生轉發環（forwarding loop）。 這個問題可以透過手動指定
kubelet 的 `--resolv-conf` 標誌為正確的 `resolv.conf`（如果是 `systemd-resolved`，
則這個檔案路徑為 `/run/systemd/resolve/resolv.conf`）來解決。
kubeadm 會自動檢測 `systemd-resolved` 並對應的更改 kubelet 的命令列標誌。

<!--
Kubernetes installs do not configure the nodes' `resolv.conf` files to use the
cluster DNS by default, because that process is inherently distribution-specific.
This should probably be implemented eventually.
-->
Kubernetes 的安裝並不會預設配置節點的 `resolv.conf` 檔案來使用叢集的 DNS 服務，因為這個配置對於不同的發行版本是不一樣的。這個問題應該遲早會被解決的。

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
Linux 的 libc 限制 `nameserver` 只能有三個記錄。不僅如此，對於 glibc-2.17-222
之前的版本（[參見此 Issue 瞭解新版本的更新](https://access.redhat.com/solutions/58028)），`search` 的記錄不能超過 6 個
（ [詳情請查閱這個 2005 年的 bug](https://bugzilla.redhat.com/show_bug.cgi?id=168253)）。
Kubernetes 需要佔用一個 `nameserver` 記錄和三個`search`記錄。
這意味著如果一個本地的安裝已經使用了三個 `nameserver` 或者使用了超過三個
`search` 記錄，而你的 glibc 版本也在有問題的版本列表中，那麼有些配置很可能會丟失。
為了繞過 DNS `nameserver` 個數限制，節點可以執行 `dnsmasq`，以提供更多的
`nameserver` 記錄。你也可以使用kubelet 的 `--resolv-conf` 標誌來解決這個問題。
要想修復 DNS `search` 記錄個數限制問題，可以考慮升級你的 Linux 發行版本，或者
升級 glibc 到一個不再受此困擾的版本。

{{< note >}}
<!--
With [Expanded DNS Configuration](/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration),
Kubernetes allows more DNS `search` records.
-->
使用[擴充套件 DNS 設定](/zh-cn/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration)，
Kubernetes 允許更多的 `search` 記錄。
{{< /note >}}
<!--
If you are using Alpine version 3.3 or earlier as your base image, DNS may not
work properly owing to a known issue with Alpine.
Check [here](https://github.com/kubernetes/kubernetes/issues/30215)
for more information.
-->
如果你使用 Alpine  3.3 或更早版本作為你的基礎映象，DNS 可能會由於 Alpine 中
一個已知的問題導致無法正常工作。
請檢視[這裡](https://github.com/kubernetes/kubernetes/issues/30215)獲取更多資訊。

## {{% heading "whatsnext" %}}

<!--
- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- [DNS for Services and Pods](/docs/concepts/services-networking/dns-pod-service/)
-->
- 參閱[自動擴縮叢集中的 DNS 服務](/zh-cn/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- 閱讀[服務和 Pod 的 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)

