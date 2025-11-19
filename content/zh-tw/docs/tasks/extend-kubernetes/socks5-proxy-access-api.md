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
本文展示瞭如何使用 SOCKS5 代理訪問遠程 Kubernetes 集羣的 API。
當你要訪問的集羣不直接在公共 Internet 上公開其 API 時，這很有用。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need SSH client software (the `ssh` tool), and an SSH service running on the remote server.
You must be able to log in to the SSH service on the remote server.
-->
你需要 SSH 客戶端軟件（`ssh` 工具），並在遠程服務器上運行 SSH 服務。
你必須能夠登錄到遠程服務器上的 SSH 服務。

<!-- steps -->

<!--
## Task context
-->
## 任務上下文  {#task-context}

{{< note >}}
<!--
This example tunnels traffic using SSH, with the SSH client and server acting as a SOCKS proxy.
You can instead use any other kind of [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) proxies.
-->
此示例使用 SSH 隧道傳輸流量，SSH 客戶端和服務器充當 SOCKS 代理。
你可以使用其他任意類型的 [SOCKS5](https://zh.wikipedia.org/wiki/SOCKS#SOCKS5) 代理代替。
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

* 你有一臺在後面的步驟中被稱爲本地計算機的客戶端計算機，你將在這臺計算機上創建與
  Kubernetes API 對話的請求。
* Kubernetes 服務器/API 託管在遠程服務器上。
* 你將使用 SSH 客戶端和服務器軟件在本地和遠程服務器之間創建安全的 SOCKS5 隧道。
  客戶端和 Kubernetes API 之間的 HTTPS 流量將流經 SOCKS5 隧道，該隧道本身通過
  SSH 進行隧道傳輸。

<!--
graph LR;

  subgraph local[Local client machine]
  client([client])-. local <br> traffic .->  local_ssh[Local SSH <br> SOCKS5 proxy];
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
  client([客戶端])-. 本地 <br> 流量.->  local_ssh[本地 SSH <br> SOCKS5 代理];
  end
  local_ssh[SSH <br>SOCKS5 <br> 代理]-- SSH 隧道 -->sshd
  
  subgraph remote[遠程服務器]
  sshd[SSH <br> 服務器]-- 本地流量 -->service1;
  end
  client([客戶端])-. 通過代理傳遞的 <br> HTTPS 流量 .->service1[Kubernetes API];

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
圖 1. SOCKS5 教程組件

<!--
## Using ssh to create a SOCKS5 proxy

The following command starts a SOCKS5 proxy between your client machine and the remote SOCKS server:
-->
## 使用 SSH 創建 SOCKS5 代理

下面的命令在你的客戶端計算機和遠程 SOCKS 服務器之間啓動一個 SOCKS5 代理：

```shell
# 運行此命令後，SSH 隧道繼續在前臺運行
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

<!--
The SOCKS5 proxy lets you connect to your cluster's API server based on the following configuration:
* `-D 1080`: opens a SOCKS proxy on local port :1080.
* `-q`: quiet mode. Causes most warning and diagnostic messages to be suppressed.
* `-N`: Do not execute a remote command. Useful for just forwarding ports.
* `username@kubernetes-remote-server.example`: the remote SSH server behind which the Kubernetes cluster
  is running (eg: a bastion host).
-->
* `-D 1080`: 在本地端口 1080 上打開一個 SOCKS 代理。
* `-q`: 靜音模式。導致大多數警告和診斷消息被抑制。
* `-N`: 不執行遠程命令。僅用於轉發端口。
* `username@kubernetes-remote-server.example`：運行 Kubernetes 集羣的遠程 SSH 服務器（例如：堡壘主機）。

<!--
## Client configuration

To access the Kubernetes API server through the proxy you must instruct `kubectl` to send queries through
the `SOCKS` proxy we created earlier. Do this by either setting the appropriate environment variable,
or via the `proxy-url` attribute in the kubeconfig file. Using an environment variable:
-->
## 客戶端配置

要通過代理訪問 Kubernetes API 服務器，你必須指示 `kubectl` 通過我們之前創建的 SOCKS5
代理發送查詢。
這可以通過設置適當的環境變量或通過 kubeconfig 文件中的 `proxy-url` 屬性來實現。
使用環境變量：

```shell
export HTTPS_PROXY=socks5://localhost:1080
```

<!--
To always use this setting on a specific `kubectl` context, specify the `proxy-url` attribute in the relevant
`cluster` entry within the `~/.kube/config` file. For example:
-->
要始終在特定的 `kubectl` 上下文中使用此設置，請在 `~/.kube/config` 文件中爲相關的
`cluster` 條目設置 `proxy-url` 屬性。例如：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # 簡化以便閱讀
    # “Kubernetes API”服務器，換言之，kubernetes-remote-server.example 的 IP 地址
    server: https://<API_SERVER_IP_ADDRESS>:6443
    # 上圖中的 “SSH SOCKS5代理”（內置 DNS 解析）
    proxy-url: socks5://localhost:1080
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
    client-certificate-data: LS0tLS1CR== # 節略，爲了便於閱讀
    client-key-data: LS0tLS1CRUdJT=      # 節略，爲了便於閱讀
```

<!--
Once you have created the tunnel via the ssh command mentioned earlier, and defined either the environment variable or
the `proxy-url` attribute, you can interact with your cluster through that proxy. For example:
-->
一旦你通過前面提到的 SSH 命令創建了隧道，並定義了環境變量或 `proxy-url` 屬性，
你就可以通過該代理與你的集羣交互。例如：

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

{{< note >}}
<!--
- Before `kubectl` 1.24, most `kubectl` commands worked when using a socks proxy, except `kubectl exec`.
- `kubectl` supports both `HTTPS_PROXY` and `https_proxy` environment variables. These are used by other
  programs that support SOCKS, such as `curl`. Therefore in some cases it
  will be better to define the environment variable on the command line:
-->
- 在 `kubectl` 1.24 之前，大多數 `kubectl` 命令在使用 socks 代理時都有效，除了 `kubectl exec`。
- `kubectl` 支持讀取 `HTTPS_PROXY` 和 `https_proxy` 環境變量。 這些被其他支持 SOCKS 的程序使用，例如 `curl`。
  因此在某些情況下，在命令行上定義環境變量會更好：
  ```shell
  HTTPS_PROXY=socks5://localhost:1080 kubectl get pods
  ```
<!--
- When using `proxy-url`, the proxy is used only for the relevant `kubectl` context,
  whereas the environment variable will affect all contexts.
-->
- 使用 `proxy-url` 時，代理僅用於相關的 `kubectl` 上下文，而環境變量將影響所有上下文。
<!--
- The k8s API server hostname can be further protected from DNS leakage by using the `socks5h` protocol name
  instead of the more commonly known `socks5` protocol shown above. In this case, `kubectl` will ask the proxy server
  (such as an ssh bastion) to resolve the k8s API server domain name, instead of resolving it on the system running
  `kubectl`. Note also that with `socks5h`, a k8s API server URL like `https://localhost:6443/api` does not refer
  to your local client computer. Instead, it refers to `localhost` as known on the proxy server (eg the ssh bastion).
-->
- 通過使用 `socks5h` 協議名稱而不是上面顯示的更廣爲人知的 `socks5` 協議，
  可以進一步保護 k8s API 服務器主機名免受 DNS 泄漏影響。
  這種情況下，`kubectl` 將要求代理服務器（例如 SSH 堡壘機）解析 k8s API 服務器域名，
  而不是在運行 `kubectl` 的系統上進行解析。
  另外還要注意，使用 `socks5h` 時，像 `https://localhost:6443/api` 這樣的 k8s API 服務器 URL 並不是指你的本地客戶端計算機。
  相反，它指向的是代理服務器（例如 SSH 堡壘機）上已知的 `localhost`。
{{</ note >}}

<!--
## Clean up

Stop the ssh port-forwarding process by pressing `CTRL+C` on the terminal where it is running.

Type `unset https_proxy` in a terminal to stop forwarding http traffic through the proxy.
-->
## 清理

通過在運行它的終端上按 `CTRL+C` 來停止 SSH 端口轉發進程。

在終端中鍵入 `unset https_proxy` 以停止通過代理轉發 http 流量。

<!--
## Further reading

* [OpenSSH remote login client](https://man.openbsd.org/ssh)
-->
## 進一步閱讀

* [OpenSSH 遠程登錄客戶端](https://man.openbsd.org/ssh)
