---
title: 使用 SOCKS5 代理訪問 Kubernetes API
content_type: task
weight: 42
min-kubernetes-server-version: v1.24
---
<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
This page shows how to use a SOCKS5 proxy to access the API of a remote Kubernetes cluster.
This is useful when the cluster you want to access does not expose its API directly on the public internet.
-->
本文展示瞭如何使用 SOCKS5 代理訪問遠端 Kubernetes 叢集的 API。
當你要訪問的叢集不直接在公共 Internet 上公開其 API 時，這很有用。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need SSH client software (the `ssh` tool), and an SSH service running on the remote server.
You must be able to log in to the SSH service on the remote server.
-->
你需要 SSH 客戶端軟體（`ssh` 工具），並在遠端伺服器上執行 SSH 服務。
你必須能夠登入到遠端伺服器上的 SSH 服務。

<!-- steps -->

<!--
## Task context
-->
## 任務上下文

<!--
This example tunnels traffic using SSH, with the SSH client and server acting as a SOCKS proxy.
You can instead use any other kind of [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) proxies.
-->
{{< note >}}
此示例使用 SSH 隧道傳輸流量，SSH 客戶端和伺服器充當 SOCKS 代理。
你可以使用其他任意型別的 [SOCKS5](https://zh.wikipedia.org/wiki/SOCKS#SOCKS5) 代理代替。
{{</ note >}}

<!--
Figure 1 represents what you're going to achieve in this task.

* You have a client computer, referred to as local in the steps ahead, from where you're going to create requests to talk to the Kubernetes API.
* The Kubernetes server/API is hosted on a remote server.
* You will use SSH client and server software to create a secure SOCKS5 tunnel between the local and
  the remote server. The HTTPS traffic between the client and the Kubernetes API will flow over the SOCKS5
  tunnel, which is itself tunnelled over SSH.
-->
圖 1 表示你將在此任務中實現的目標。

* 你有一臺在後面的步驟中被稱為本地計算機的客戶端計算機，你將在這臺計算機上建立與 Kubernetes API 對話的請求。
* Kubernetes 伺服器/API 託管在遠端伺服器上。
* 你將使用 SSH 客戶端和伺服器軟體在本地和遠端伺服器之間建立安全的 SOCKS5 隧道。
  客戶端和 Kubernetes API 之間的 HTTPS 流量將流經 SOCKS5 隧道，該隧道本身透過 SSH 進行隧道傳輸。


<!--
graph LR;

  subgraph local[Local client machine]
  client([client])-- local <br> traffic .->  local_ssh[Local SSH <br> SOCKS5 proxy];
  end
  local_ssh[SSH <br>SOCKS5 <br> proxy]-- SSH Tunnel --\>sshd
  
  subgraph remote[Remote server]
  sshd[SSH <br> server]-- local traffic --\>service1;
  end
  client([client])-. proxied HTTPs traffic <br> going through the proxy .->service1[Kubernetes API];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;

-->

{{< mermaid >}}
graph LR;

  subgraph local[本地客戶端機器]
  client([客戶端])-- 本地 <br> 流量.->  local_ssh[本地 SSH <br> SOCKS5 代理];
  end
  ocal_ssh[SSH <br>SOCKS5 <br> 代理]-- SSH 隧道 -->sshd
  
  subgraph remote[遠端伺服器]
  sshd[SSH <br> 伺服器]-- 本地流量 -->service1;
  end
  client([客戶端])-. 透過代理傳遞的 <br> HTTPS 流量 .->service1[Kubernetes API];

  classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
  classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
  classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
  class ingress,service1,service2,pod1,pod2,pod3,pod4 k8s;
  class client plain;
  class cluster cluster;
{{</ mermaid >}}
<!--
Figure 1. SOCKS5 tutorial components
-->
圖 1. SOCKS5 教程元件

<!--
## Using ssh to create a SOCKS5 proxy
-->
## 使用 ssh 建立 SOCKS5 代理

<!--
This command starts a SOCKS5 proxy between your client machine and the remote server.
The SOCKS5 proxy lets you connect to your cluster's API server.
-->
此命令在你的客戶端計算機和遠端伺服器之間啟動一個 SOCKS5 代理。
SOCKS5 代理允許你連線到叢集的 API 伺服器。

```shell
# 執行此命令後，SSH 隧道繼續在前臺執行
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

<!--
* `-D 1080`: opens a SOCKS proxy on local port :1080.
* `-q`: quiet mode. Causes most warning and diagnostic messages to be suppressed.
* `-N`: Do not execute a remote command. Useful for just forwarding ports.
* `username@kubernetes-remote-server.example`: the remote SSH server where the Kubernetes cluster is running.
-->
* `-D 1080`: 在本地埠 1080 上開啟一個 SOCKS 代理。
* `-q`: 靜音模式。導致大多數警告和診斷訊息被抑制。
* `-N`: 不執行遠端命令。僅用於轉發埠。
* `username@kubernetes-remote-server.example`: 執行 Kubernetes 叢集的遠端 SSH 伺服器。

<!--
## Client configuration
-->
## 客戶端配置

<!--
To explore the Kubernetes API you'll first need to instruct your clients to send their queries through
the SOCKS5 proxy we created earlier.

For command-line tools, set the `https_proxy` environment variable and pass it to commands that you run.
-->
要探索 Kubernetes API，你首先需要指示你的客戶端透過我們之前建立的 SOCKS5 代理傳送他們的查詢。
對於命令列工具，設定 `https_proxy` 環境變數並將其傳遞給你執行的命令。

```shell
export https_proxy=socks5h://localhost:1080
```

<!--
When you set the `https_proxy` variable, tools such as `curl` route HTTPS traffic through the proxy
you configured. For this to work, the tool must support SOCKS5 proxying.

{{< note >}}
In the URL https://localhost/api, `localhost` does not refer to your local client computer.
Instead, it refers to the endpoint on the remote server knows as `localhost`.
The `curl` tool sends the hostname from the HTTPS URL over SOCKS, and the remote server
resolves that locally (to an address that belongs to its loopback interface).
{{</ note >}}
-->
當你設定 `https_proxy` 變數時，`curl` 等工具會透過你配置的代理路由 HTTPS 流量。
為此，該工具必須支援 SOCKS5 代理。

{{< note >}}
在 URL https://localhost/api 中，`localhost` 不是指你的本地客戶端計算機。
它指的是遠端伺服器上稱為 “localhost” 的端點。
`curl` 工具透過 SOCKS 從 HTTPS URL 傳送主機名，遠端伺服器在本地解析（到屬於其環回介面的地址）。
{{</ note >}}

```shell
curl -k -v https://localhost/api
```

<!--
To use the official Kubernetes client `kubectl` with a proxy, set the `proxy-url` element
for the relevant `cluster` entry within  your `~/.kube/config` file. For example:
-->
要將官方 Kubernetes 客戶端 `kubectl` 與代理一起使用，請在 `~/.kube/config` 檔案中為相關的
`cluster` 條目設定 `proxy-url` 元素。 例如：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # 為了便於閱讀縮短
    server: https://localhost            # 上圖中的“Kubernetes API”
    proxy-url: socks5://localhost:1080   # 上圖中的“SSH SOCKS5代理”（內建DNS解析）
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: LS0tLS1CR== # 為了便於閱讀縮短
    client-key-data: LS0tLS1CRUdJT=      # 為了便於閱讀縮短
```

<!--
If the tunnel is operating and you use `kubectl` with a context that uses this cluster, you can interact with your cluster through that proxy. For example:
-->
如果隧道能夠正常工作，並且你呼叫 `kubectl` 時使用此叢集的上下文，
則可以透過該代理與你的叢集互動。 例如：

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

<!--
## Clean up
-->
## 清理

<!--
Stop the ssh port-forwarding process by pressing `CTRL+C` on the terminal where it is running.

Type `unset https_proxy` in a terminal to stop forwarding http traffic through the proxy.
-->
透過在執行它的終端上按“CTRL+C”來停止 ssh 埠轉發程序。

在終端中鍵入 `unset https_proxy` 以停止透過代理轉發 http 流量。

<!--
## Further reading
-->
## 進一步閱讀

<!--
* [OpenSSH remote login client](https://man.openbsd.org/ssh)
-->
* [OpenSSH遠端登入客戶端](https://man.openbsd.org/ssh)