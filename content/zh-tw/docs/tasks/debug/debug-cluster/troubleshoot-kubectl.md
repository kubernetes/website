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
本文講述研判和診斷 {{<glossary_tooltip text="kubectl" term_id="kubectl">}} 相關的問題。
如果你在訪問 `kubectl` 或連接到叢集時遇到問題，本文概述了各種常見的情況和可能的解決方案，
以幫助確定和解決可能的原因。

<!-- body -->

## {{% heading "prerequisites" %}}

<!--
* You need to have a Kubernetes cluster.
* You also need to have `kubectl` installed - see [install tools](/docs/tasks/tools/#kubectl)
-->
* 你需要有一個 Kubernetes 叢集。
* 你還需要安裝好 `kubectl`，參見[安裝工具](/zh-cn/docs/tasks/tools/#kubectl)。

<!--
## Verify kubectl setup

Make sure you have installed and configured `kubectl` correctly on your local machine.
Check the `kubectl` version to ensure it is up-to-date and compatible with your cluster.

Check kubectl version:
-->
## 驗證 kubectl 設置   {#verify-kubectl-setup}

確保你已在本機上正確安裝和設定了 `kubectl`。
檢查 `kubectl` 版本以確保其是最新的，並與你的叢集兼容。

檢查 kubectl 版本：

```shell
kubectl version
```

<!--
You'll see a similar output:
-->
你將看到類似的輸出：

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
而不是 `Server Version`，則需要解決 kubectl 與你叢集的連接問題。

確保按照 [kubectl 官方安裝文檔](/zh-cn/docs/tasks/tools/#kubectl)安裝了 kubectl，
並正確設定了 `$PATH` 環境變量。

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
## 檢查 kubeconfig   {#check-kubeconfig}

`kubectl` 需要一個 `kubeconfig` 文件來連接到 Kubernetes 叢集。
`kubeconfig` 文件通常位於 `~/.kube/config` 目錄下。確保你有一個有效的 `kubeconfig` 文件。
如果你沒有 `kubeconfig` 文件，可以從 Kubernetes 管理員那裏獲取，或者可以從 Kubernetes 控制平面的
`/etc/kubernetes/admin.conf` 目錄複製這個文件。如果你在雲平臺上部署了 Kubernetes 叢集並且丟失了你的
`kubeconfig` 文件，則可以使用雲廠商的工具重新生成它。參考雲廠商的文檔以重新生成 `kubeconfig` 文件。

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
檢查 `$KUBECONFIG` 環境變量是否設定正確。你可以設置 `$KUBECONFIG` 環境變量，或者在
kubectl 中使用 `--kubeconfig` 參數來指定 `kubeconfig` 文件的目錄。

## 檢查 VPN 連接   {#check-vpn-connectivity}

如果你正在使用虛擬專用網路（VPN）訪問 Kubernetes 叢集，請確保你的 VPN 連接是可用且穩定的。
有時，VPN 斷開連接可能會導致與叢集的連接問題。重新連接到 VPN，並嘗試再次訪問叢集。

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
## 身份認證和鑑權   {#authentication-and-authorization}

如果你正在使用基於令牌的身份認證，並且 kubectl 返回有關身份認證令牌或身份認證伺服器地址的錯誤，
校驗 Kubernetes 身份認證令牌和身份認證伺服器地址是否被設定正確。

如果 kubectl 返回有關鑑權的錯誤，確保你正在使用有效的使用者憑據，並且你具有訪問所請求資源的權限。

<!--
## Verify contexts

Kubernetes supports [multiple clusters and contexts](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
Ensure that you are using the correct context to interact with your cluster.

List available contexts:
-->
## 驗證上下文   {#verify-contexts}

Kubernetes 支持[多個叢集和上下文](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)。
確保你正在使用正確的上下文與叢集進行交互。

列出可用的上下文：

```shell
kubectl config get-contexts
```

<!--
Switch to the appropriate context:
-->
切換到合適的上下文：

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
## API 伺服器和負載均衡器   {#api-server-and-load-balancer}

{{<glossary_tooltip text="kube-apiserver" term_id="kube-apiserver">}} 伺服器是 Kubernetes
叢集的核心組件。如果 API 伺服器或運行在 API 伺服器前面的負載均衡器不可達或沒有響應，你將無法與叢集進行交互。

<!--
Check the if the API server's host is reachable by using `ping` command. Check cluster's
network connectivity and firewall. If your are using a cloud provider for deploying
the cluster, check your cloud provider's health check status for the cluster's
API server.

Verify the status of the load balancer (if used) to ensure it is healthy and forwarding
traffic to the API server.
-->
通過使用 `ping` 命令檢查 API 伺服器的主機是否可達。檢查叢集的網路連接和防火牆。
如果你使用雲廠商部署叢集，請檢查雲廠商對叢集的 API 伺服器的健康檢查狀態。

驗證負載均衡器（如果使用）的狀態，確保其健康且轉發流量到 API 伺服器。

<!--
## TLS problems
* Additional tools required - `base64` and `openssl` version 3.0 or above.

The Kubernetes API server only serves HTTPS requests by default. In that case TLS problems
may occur due to various reasons, such as certificate expiry or chain of trust validity.
-->
## TLS 問題   {#tls-problems}
* 需要額外的工具 - `base64` 和 `openssl` v3.0 或更高版本。

Kubernetes API 伺服器默認只爲 HTTPS 請求提供服務。在這種情況下，
TLS 問題可能會因各種原因而出現，例如證書過期或信任鏈有效性。

<!--
You can find the TLS certificate in the kubeconfig file, located in the `~/.kube/config`
directory. The `certificate-authority` attribute contains the CA certificate and the
`client-certificate` attribute contains the client certificate.

Verify the expiry of these certificates:
-->
你可以在 kubeconfig 文件中找到 TLS 證書，此文件位於 `~/.kube/config` 目錄下。
`certificate-authority` 屬性包含 CA 證書，而 `client-certificate` 屬性則包含客戶端證書。

驗證這些證書的到期時間：

```shell
kubectl config view --flatten --output 'jsonpath={.clusters[0].cluster.certificate-authority-data}' | base64 -d | openssl x509 -noout -dates
```

<!--
output:
-->
輸出爲：

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
輸出爲：

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
## 驗證 kubectl 助手   {#verify-kubectl-helpers}

某些 kubectl 身份認證助手提供了便捷訪問 Kubernetes 叢集的方式。
如果你使用了這些助手並且遇到連接問題，確保必要的設定仍然存在。

查看 kubectl 設定以瞭解身份認證細節：

```shell
kubectl config view
```

<!--
If you previously used a helper tool (for example, `kubectl-oidc-login`), ensure that it is still
installed and configured correctly. 
-->
如果你之前使用了輔助工具（例如 `kubectl-oidc-login`），確保它仍然安裝和設定正確。
