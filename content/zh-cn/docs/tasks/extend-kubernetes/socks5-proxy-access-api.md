---
title: 使用 SOCKS5 代理访问 Kubernetes API
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
本文展示了如何使用 SOCKS5 代理访问远程 Kubernetes 集群的 API。
当你要访问的集群不直接在公共 Internet 上公开其 API 时，这很有用。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need SSH client software (the `ssh` tool), and an SSH service running on the remote server.
You must be able to log in to the SSH service on the remote server.
-->
你需要 SSH 客户端软件（`ssh` 工具），并在远程服务器上运行 SSH 服务。
你必须能够登录到远程服务器上的 SSH 服务。

<!-- steps -->

<!--
## Task context
-->
## 任务上下文  {#task-context}

{{< note >}}
<!--
This example tunnels traffic using SSH, with the SSH client and server acting as a SOCKS proxy.
You can instead use any other kind of [SOCKS5](https://en.wikipedia.org/wiki/SOCKS#SOCKS5) proxies.
-->
此示例使用 SSH 隧道传输流量，SSH 客户端和服务器充当 SOCKS 代理。
你可以使用其他任意类型的 [SOCKS5](https://zh.wikipedia.org/wiki/SOCKS#SOCKS5) 代理代替。
{{</ note >}}

<!--
Figure 1 represents what you're going to achieve in this task.

* You have a client computer, referred to as local in the steps ahead, from where you're going to create requests to talk to the Kubernetes API.
* The Kubernetes server/API is hosted on a remote server.
* You will use SSH client and server software to create a secure SOCKS5 tunnel between the local and
  the remote server. The HTTPS traffic between the client and the Kubernetes API will flow over the SOCKS5
  tunnel, which is itself tunnelled over SSH.
-->
图 1 表示你将在此任务中实现的目标。

* 你有一台在后面的步骤中被称为本地计算机的客户端计算机，你将在这台计算机上创建与
  Kubernetes API 对话的请求。
* Kubernetes 服务器/API 托管在远程服务器上。
* 你将使用 SSH 客户端和服务器软件在本地和远程服务器之间创建安全的 SOCKS5 隧道。
  客户端和 Kubernetes API 之间的 HTTPS 流量将流经 SOCKS5 隧道，该隧道本身通过
  SSH 进行隧道传输。

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

  subgraph local[本地客户端机器]
  client([客户端])-- 本地 <br> 流量.->  local_ssh[本地 SSH <br> SOCKS5 代理];
  end
  ocal_ssh[SSH <br>SOCKS5 <br> 代理]-- SSH 隧道 -->sshd
  
  subgraph remote[远程服务器]
  sshd[SSH <br> 服务器]-- 本地流量 -->service1;
  end
  client([客户端])-. 通过代理传递的 <br> HTTPS 流量 .->service1[Kubernetes API];

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
图 1. SOCKS5 教程组件

<!--
## Using ssh to create a SOCKS5 proxy

This command starts a SOCKS5 proxy between your client machine and the remote server.
The SOCKS5 proxy lets you connect to your cluster's API server.
-->
## 使用 SSH 创建 SOCKS5 代理

此命令在你的客户端计算机和远程服务器之间启动一个 SOCKS5 代理。
SOCKS5 代理允许你连接到集群的 API 服务器。

```shell
# 运行此命令后，SSH 隧道继续在前台运行
ssh -D 1080 -q -N username@kubernetes-remote-server.example
```

<!--
* `-D 1080`: opens a SOCKS proxy on local port :1080.
* `-q`: quiet mode. Causes most warning and diagnostic messages to be suppressed.
* `-N`: Do not execute a remote command. Useful for just forwarding ports.
* `username@kubernetes-remote-server.example`: the remote SSH server where the Kubernetes cluster is running.
-->
* `-D 1080`: 在本地端口 1080 上打开一个 SOCKS 代理。
* `-q`: 静音模式。导致大多数警告和诊断消息被抑制。
* `-N`: 不执行远程命令。仅用于转发端口。
* `username@kubernetes-remote-server.example`: 运行 Kubernetes 集群的远程 SSH 服务器。

<!--
## Client configuration

To explore the Kubernetes API you'll first need to instruct your clients to send their queries through
the SOCKS5 proxy we created earlier.

For command-line tools, set the `https_proxy` environment variable and pass it to commands that you run.
-->
## 客户端配置

要探索 Kubernetes API，你首先需要指示你的客户端通过我们之前创建的 SOCKS5
代理发送他们的查询。
对于命令行工具，设置 `https_proxy` 环境变量并将其传递给你运行的命令。

```shell
export https_proxy=socks5h://localhost:1080
```

<!--
When you set the `https_proxy` variable, tools such as `curl` route HTTPS traffic through the proxy
you configured. For this to work, the tool must support SOCKS5 proxying.
-->
当你设置 `https_proxy` 变量时，`curl` 等工具会通过你配置的代理路由 HTTPS 流量。
为此，该工具必须支持 SOCKS5 代理。

{{< note >}}
<!--
In the URL https://localhost/api, `localhost` does not refer to your local client computer.
Instead, it refers to the endpoint on the remote server known as `localhost`.
The `curl` tool sends the hostname from the HTTPS URL over SOCKS, and the remote server
resolves that locally (to an address that belongs to its loopback interface).
-->
在 URL https://localhost/api 中，`localhost` 不是指你的本地客户端计算机。
它指的是远程服务器上称为 “localhost” 的端点。
`curl` 工具通过 SOCKS 从 HTTPS URL 发送主机名，远程服务器在本地解析（到属于其环回接口的地址）。
{{< /note >}}

```shell
curl -k -v https://localhost/api
```

<!--
To use the official Kubernetes client `kubectl` with a proxy, set the `proxy-url` element
for the relevant `cluster` entry within  your `~/.kube/config` file. For example:
-->
要将官方 Kubernetes 客户端 `kubectl` 与代理一起使用，请在 `~/.kube/config` 文件中为相关的
`cluster` 条目设置 `proxy-url` 元素。 例如：

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LRMEMMW2 # 简化以便阅读
    # “Kubernetes API”服务器，换言之，kubernetes-remote-server.example 的 IP 地址
    server: https://<API_SERVER_IP_ADRESS>:6443  
    # 上图中的“SSH SOCKS5代理”（内置 DNS 解析）
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
    client-certificate-data: LS0tLS1CR== # 节略，为了便于阅读
    client-key-data: LS0tLS1CRUdJT=      # 节略，为了便于阅读
```

<!--
If the tunnel is operating and you use `kubectl` with a context that uses this cluster, you can interact with your cluster through that proxy. For example:
-->
如果隧道能够正常工作，并且你调用 `kubectl` 时使用此集群的上下文，
则可以通过该代理与你的集群交互。 例如：

```shell
kubectl get pods
```

```console
NAMESPACE     NAME                                     READY   STATUS      RESTARTS   AGE
kube-system   coredns-85cb69466-klwq8                  1/1     Running     0          5m46s
```

<!--
## Clean up

Stop the ssh port-forwarding process by pressing `CTRL+C` on the terminal where it is running.

Type `unset https_proxy` in a terminal to stop forwarding http traffic through the proxy.
-->
## 清理

通过在运行它的终端上按 “CTRL+C” 来停止 SSH 端口转发进程。

在终端中键入 `unset https_proxy` 以停止通过代理转发 http 流量。

<!--
## Further reading

* [OpenSSH remote login client](https://man.openbsd.org/ssh)
-->
## 进一步阅读

* [OpenSSH远程登录客户端](https://man.openbsd.org/ssh)

