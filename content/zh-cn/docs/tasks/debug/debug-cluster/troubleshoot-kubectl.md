---
title: "kubectl 故障排查"
content_type: task
weight: 10
---
<!--
title: "Troubleshooting kubectl"
content_type: task
weight: 10
-->

<!-- overview -->

<!--
This documentation is about investigating and diagnosing
{{<glossary_tooltip text="kubectl" term_id="kubectl">}} related issues.
If you encounter issues accessing `kubectl` or connecting to your cluster, this
document outlines various common scenarios and potential solutions to help
identify and address the likely cause.
-->
本文讲述研判和诊断 {{<glossary_tooltip text="kubectl" term_id="kubectl">}} 相关的问题。
如果你在访问 `kubectl` 或连接到集群时遇到问题，本文概述了各种常见的情况和可能的解决方案，
以帮助确定和解决可能的原因。

<!-- body -->

## {{% heading "prerequisites" %}}

<!--
* You need to have a Kubernetes cluster.
* You also need to have `kubectl` installed - see [install tools](/docs/tasks/tools/#kubectl)
-->
* 你需要有一个 Kubernetes 集群。
* 你还需要安装好 `kubectl`，参见[安装工具](/zh-cn/docs/tasks/tools/#kubectl)。

<!--
## Verify kubectl setup

Make sure you have installed and configured `kubectl` correctly on your local machine.
Check the `kubectl` version to ensure it is up-to-date and compatible with your cluster.

Check kubectl version:
-->
## 验证 kubectl 设置   {#verify-kubectl-setup}

确保你已在本机上正确安装和配置了 `kubectl`。
检查 `kubectl` 版本以确保其是最新的，并与你的集群兼容。

检查 kubectl 版本：

```shell
kubectl version
```

<!--
You'll see a similar output:
-->
你将看到类似的输出：

```console
Client Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.4",GitCommit:"fa3d7990104d7c1f16943a67f11b154b71f6a132", GitTreeState:"clean",BuildDate:"2023-07-19T12:20:54Z", GoVersion:"go1.20.6", Compiler:"gc", Platform:"linux/amd64"}
Kustomize Version: v5.0.1
Server Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.3",GitCommit:"25b4e43193bcda6c7328a6d147b1fb73a33f1598", GitTreeState:"clean",BuildDate:"2023-06-14T09:47:40Z", GoVersion:"go1.20.5", Compiler:"gc", Platform:"linux/amd64"}
```

<!--
If you see `Unable to connect to the server: dial tcp <server-ip>:8443: i/o timeout`,
instead of `Server Version`, you need to troubleshoot kubectl connectivity with your cluster.

Make sure you have installed the kubectl by following the
[official documentation for installing kubectl](/docs/tasks/tools/#kubectl), and you have
properly configured the `$PATH` environment variable.
-->
如果你看到 `Unable to connect to the server: dial tcp <server-ip>:8443: i/o timeout`，
而不是 `Server Version`，则需要解决 kubectl 与你集群的连接问题。

确保按照 [kubectl 官方安装文档](/zh-cn/docs/tasks/tools/#kubectl)安装了 kubectl，
并正确配置了 `$PATH` 环境变量。

<!--
## Check kubeconfig

The `kubectl` requires a `kubeconfig` file to connect to a Kubernetes cluster. The
`kubeconfig` file is usually located under the `~/.kube/config` directory. Make sure
that you have a valid `kubeconfig` file. If you don't have a `kubeconfig` file, you can
obtain it from your Kubernetes administrator, or you can copy it from your Kubernetes
control plane's `/etc/kubernetes/admin.conf` directory. If you have deployed your
Kubernetes cluster on a cloud platform and lost your `kubeconfig` file, you can
re-generate it using your cloud provider's tools. Refer the cloud provider's
documentation for re-generating a `kubeconfig` file.
-->
## 检查 kubeconfig   {#check-kubeconfig}

`kubectl` 需要一个 `kubeconfig` 文件来连接到 Kubernetes 集群。
`kubeconfig` 文件通常位于 `~/.kube/config` 目录下。确保你有一个有效的 `kubeconfig` 文件。
如果你没有 `kubeconfig` 文件，可以从 Kubernetes 管理员那里获取，或者可以从 Kubernetes 控制平面的
`/etc/kubernetes/admin.conf` 目录复制这个文件。如果你在云平台上部署了 Kubernetes 集群并且丢失了你的
`kubeconfig` 文件，则可以使用云厂商的工具重新生成它。参考云厂商的文档以重新生成 `kubeconfig` 文件。

<!--
Check if the `$KUBECONFIG` environment variable is configured correctly. You can set
`$KUBECONFIG`environment variable or use the `--kubeconfig` parameter with the kubectl
to specify the directory of a `kubeconfig` file.

## Check VPN connectivity

If you are using a Virtual Private Network (VPN) to access your Kubernetes cluster,
make sure that your VPN connection is active and stable. Sometimes, VPN disconnections
can lead to connection issues with the cluster. Reconnect to the VPN and try accessing
the cluster again.
-->
检查 `$KUBECONFIG` 环境变量是否配置正确。你可以设置 `$KUBECONFIG` 环境变量，或者在
kubectl 中使用 `--kubeconfig` 参数来指定 `kubeconfig` 文件的目录。

## 检查 VPN 连接   {#check-vpn-connectivity}

如果你正在使用虚拟专用网络（VPN）访问 Kubernetes 集群，请确保你的 VPN 连接是可用且稳定的。
有时，VPN 断开连接可能会导致与集群的连接问题。重新连接到 VPN，并尝试再次访问集群。

<!--
## Authentication and authorization

If you are using the token based authentication and the kubectl is returning an error
regarding the authentication token or authentication server address, validate the
Kubernetes authentication token and the authentication server address are configured
properly.

If kubectl is returning an error regarding the authorization, make sure that you are
using the valid user credentials. And you have the permission to access the resource
that you have requested.
-->
## 身份认证和鉴权   {#authentication-and-authorization}

如果你正在使用基于令牌的身份认证，并且 kubectl 返回有关身份认证令牌或身份认证服务器地址的错误，
校验 Kubernetes 身份认证令牌和身份认证服务器地址是否被配置正确。

如果 kubectl 返回有关鉴权的错误，确保你正在使用有效的用户凭据，并且你具有访问所请求资源的权限。

<!--
## Verify contexts

Kubernetes supports [multiple clusters and contexts](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
Ensure that you are using the correct context to interact with your cluster.

List available contexts:
-->
## 验证上下文   {#verify-contexts}

Kubernetes 支持[多个集群和上下文](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。
确保你正在使用正确的上下文与集群进行交互。

列出可用的上下文：

```shell
kubectl config get-contexts
```

<!--
Switch to the appropriate context:
-->
切换到合适的上下文：

```shell
kubectl config use-context <context-name>
```

<!--
## API server and load balancer

The {{<glossary_tooltip text="kube-apiserver" term_id="kube-apiserver">}} server is the
central component of a Kubernetes cluster. If the API server or the load balancer that
runs in front of your API servers is not reachable or not responding, you won't be able
to interact with the cluster.
-->
## API 服务器和负载均衡器   {#api-server-and-load-balancer}

{{<glossary_tooltip text="kube-apiserver" term_id="kube-apiserver">}} 服务器是 Kubernetes
集群的核心组件。如果 API 服务器或运行在 API 服务器前面的负载均衡器不可达或没有响应，你将无法与集群进行交互。

<!--
Check the if the API server's host is reachable by using `ping` command. Check cluster's
network connectivity and firewall. If your are using a cloud provider for deploying
the cluster, check your cloud provider's health check status for the cluster's
API server.

Verify the status of the load balancer (if used) to ensure it is healthy and forwarding
traffic to the API server.
-->
通过使用 `ping` 命令检查 API 服务器的主机是否可达。检查集群的网络连接和防火墙。
如果你使用云厂商部署集群，请检查云厂商对集群的 API 服务器的健康检查状态。

验证负载均衡器（如果使用）的状态，确保其健康且转发流量到 API 服务器。

<!--
## TLS problems
* Additional tools required - `base64` and `openssl` version 3.0 or above.

The Kubernetes API server only serves HTTPS requests by default. In that case TLS problems
may occur due to various reasons, such as certificate expiry or chain of trust validity.
-->
## TLS 问题   {#tls-problems}
* 需要额外的工具 - `base64` 和 `openssl` v3.0 或更高版本。

Kubernetes API 服务器默认只为 HTTPS 请求提供服务。在这种情况下，
TLS 问题可能会因各种原因而出现，例如证书过期或信任链有效性。

<!--
You can find the TLS certificate in the kubeconfig file, located in the `~/.kube/config`
directory. The `certificate-authority` attribute contains the CA certificate and the
`client-certificate` attribute contains the client certificate.

Verify the expiry of these certificates:
-->
你可以在 kubeconfig 文件中找到 TLS 证书，此文件位于 `~/.kube/config` 目录下。
`certificate-authority` 属性包含 CA 证书，而 `client-certificate` 属性则包含客户端证书。

验证这些证书的到期时间：

```shell
kubectl config view --flatten --output 'jsonpath={.clusters[0].cluster.certificate-authority-data}' | base64 -d | openssl x509 -noout -dates
```

<!--
output:
-->
输出为：

```console
notBefore=Feb 13 05:57:47 2024 GMT
notAfter=Feb 10 06:02:47 2034 GMT
```

```shell
kubectl config view --flatten --output 'jsonpath={.users[0].user.client-certificate-data}'| base64 -d | openssl x509 -noout -dates
```

<!--
output:
-->
输出为：

```console
notBefore=Feb 13 05:57:47 2024 GMT
notAfter=Feb 12 06:02:50 2025 GMT
```

<!--
## Verify kubectl helpers

Some kubectl authentication helpers provide easy access to Kubernetes clusters. If you
have used such helpers and are facing connectivity issues, ensure that the necessary
configurations are still present.

Check kubectl configuration for authentication details:
-->
## 验证 kubectl 助手   {#verify-kubectl-helpers}

某些 kubectl 身份认证助手提供了便捷访问 Kubernetes 集群的方式。
如果你使用了这些助手并且遇到连接问题，确保必要的配置仍然存在。

查看 kubectl 配置以了解身份认证细节：

```shell
kubectl config view
```

<!--
If you previously used a helper tool (for example, `kubectl-oidc-login`), ensure that it is still
installed and configured correctly. 
-->
如果你之前使用了辅助工具（例如 `kubectl-oidc-login`），确保它仍然安装和配置正确。
