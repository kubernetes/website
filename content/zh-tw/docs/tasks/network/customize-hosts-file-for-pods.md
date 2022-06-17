---
title: 使用 HostAliases 向 Pod /etc/hosts 檔案新增條目
content_type: concept
weight: 60
min-kubernetes-server-version: 1.7
---

<!--
reviewers:
- rickypai
- thockin
title: Adding entries to Pod /etc/hosts with HostAliases
content_type: task
weight: 60
min-kubernetes-server-version: 1.7
-->

<!-- overview -->

<!--
Adding entries to a Pod's /etc/hosts file provides Pod-level override of hostname resolution when DNS and other options are not applicable. You can add these custom entries with the HostAliases field in PodSpec.

Modification not using HostAliases is not suggested because the file is managed by Kubelet and can be overwritten on during Pod creation/restart.
-->
當 DNS 配置以及其它選項不合理的時候，透過向 Pod 的 /etc/hosts 檔案中新增條目，
可以在 Pod 級別覆蓋對主機名的解析。你可以透過 PodSpec 的 HostAliases
欄位來新增這些自定義條目。

建議透過使用 HostAliases 來進行修改，因為該檔案由 Kubelet 管理，並且
可以在 Pod 建立/重啟過程中被重寫。

<!-- steps -->

<!--
## Default Hosts File Content

Start an Nginx Pod which is assigned a Pod IP:
-->
## 預設 hosts 檔案內容

讓我們從一個 Nginx Pod 開始，該 Pod 被分配一個 IP：

```shell
kubectl run nginx --image nginx
```

```
pod/nginx created
```

<!--
Examine a Pod IP:
-->
檢查 Pod IP：

```shell
kubectl get pods --output=wide
```

```
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

<!--
The hosts file content would look like this:
-->
主機檔案的內容如下所示：

```shell
kubectl exec nginx -- cat /etc/hosts
```

```
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

<!--
By default, the `hosts` file only includes IPv4 and IPv6 boilerplates like
`localhost` and its own hostname.
-->
預設情況下，hosts 檔案只包含 IPv4 和 IPv6 的樣板內容，像 `localhost` 和主機名稱。

<!--
## Adding Additional Entries with HostAliases

In addition to the default boilerplate, we can add additional entries to the
`hosts` file.
For example: to resolve `foo.local`, `bar.local` to `127.0.0.1` and `foo.remote`,
`bar.remote` to `10.1.2.3`, we can configure HostAliases for a Pod under
`.spec.hostAliases`:
-->
## 透過 HostAliases 增加額外條目

除了預設的樣板內容，我們可以向 hosts 檔案新增額外的條目。
例如，要將 `foo.local`、`bar.local` 解析為 `127.0.0.1`，
將 `foo.remote`、 `bar.remote` 解析為 `10.1.2.3`，我們可以在
`.spec.hostAliases` 下為 Pod 配置 HostAliases。

{{< codenew file="service/networking/hostaliases-pod.yaml" >}}

<!--
You can start a Pod with that configuration by running:
-->
你可以使用以下命令用此配置啟動 Pod：

```shell
kubectl apply -f https://k8s.io/examples/service/networking/hostaliases-pod.yaml
```

```
pod/hostaliases-pod created
```

<!--
Examine a Pod's details to see its IPv4 address and its status:
-->
檢查 Pod 詳情，檢視其 IPv4 地址和狀態：

```shell
kubectl get pod --output=wide
```

```
NAME                READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod     0/1       Completed   0          6s        10.200.0.5      worker0
```

<!--
The `hosts` file content looks like this:
-->
hosts 檔案的內容看起來類似如下這樣：

```shell
kubectl logs hostaliases-pod
```

```
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

<!--
With the additional entries specified at the bottom.
-->
在最下面額外添加了一些條目。

<!-- 
## Why does the kubelet manage the hosts file? {#why-does-kubelet-manage-the-hosts-file}

The kubelet manages the
`hosts` file for each container of the Pod to prevent the container runtime from
modifying the file after the containers have already been started.
Historically, Kubernetes always used Docker Engine as its container runtime, and Docker Engine would
then modify the `/etc/hosts` file after each container had started.

Current Kubernetes can use a variety of container runtimes; even so, the kubelet manages the
hosts file within each container so that the outcome is as intended regardless of which
container runtime you use.
-->
## 為什麼 kubelet 管理 hosts 檔案？{#why-does-kubelet-manage-the-hosts-file}

kubelet 管理每個Pod 容器的 `hosts` 檔案，以防止容器執行時在容器已經啟動後修改檔案。
由於歷史原因，Kubernetes 總是使用 Docker Engine 作為其容器執行時，而 Docker Engine 
將在容器啟動後修改 `/etc/hosts` 檔案。

當前的 Kubernetes 可以使用多種容器執行時；即便如此，kubelet 管理在每個容器中建立 hosts檔案，
以便你使用任何容器執行時執行容器時，結果都符合預期。

{{< caution >}}
<!--
Avoid making manual changes to the hosts file inside a container.

If you make manual changes to the hosts file,
those changes are lost when the container exits.
-->
請避免手工更改容器內的 hosts 檔案內容。

如果你對 hosts 檔案做了手工修改，這些修改都會在容器退出時丟失。
{{< /caution >}}

