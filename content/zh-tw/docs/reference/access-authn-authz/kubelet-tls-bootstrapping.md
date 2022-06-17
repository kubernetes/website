---
title: TLS 啟動引導
content_type: concept
---
<!--
reviewers:
- mikedanese
- liggitt
- smarterclayton
- awly
title: TLS bootstrapping
content_type: concept
-->

<!-- overview -->

<!--
In a Kubernetes cluster, the components on the worker nodes - kubelet and kube-proxy - need to communicate with Kubernetes control plane components, specifically kube-apiserver.
In order to ensure that communication is kept private, not interfered with, and ensure that each component of the cluster is talking to another trusted component, we strongly
recommend using client TLS certificates on nodes.
-->
在一個 Kubernetes 叢集中，工作節點上的元件（kubelet 和 kube-proxy）需要與
Kubernetes 控制平面元件通訊，尤其是 kube-apiserver。
為了確保通訊本身是私密的、不被幹擾，並且確保叢集的每個元件都在與另一個
可信的元件通訊，我們強烈建議使用節點上的客戶端 TLS 證書。

<!--
The normal process of bootstrapping these components, especially worker nodes that need certificates so they can communicate safely with kube-apiserver,
can be a challenging process as it is often outside of the scope of Kubernetes and requires significant additional work.
This in turn, can make it challenging to initialize or scale a cluster.
-->
啟動引導這些元件的正常過程，尤其是需要證書來與 kube-apiserver 安全通訊的
工作節點，可能會是一個具有挑戰性的過程，因為這一過程通常不受 Kubernetes 控制，
需要不少額外工作。
這也使得初始化或者擴縮一個叢集的操作變得具有挑戰性。

<!--
In order to simplify the process, beginning in version 1.4, Kubernetes introduced a certificate request and signing API to simplify the process. The proposal can be
found [here](https://github.com/kubernetes/kubernetes/pull/20439).

This document describes the process of node initialization, how to set up TLS client certificate bootstrapping for
kubelets, and how it works.
-->
為了簡化這一過程，從 1.4 版本開始，Kubernetes 引入了一個證書請求和簽名
API 以便簡化此過程。該提案可在
[這裡](https://github.com/kubernetes/kubernetes/pull/20439)看到。

本文件描述節點初始化的過程，如何為 kubelet 配置 TLS 客戶端證書啟動引導，
以及其背後的工作原理。

<!-- body -->

<!--
## Initialization Process

When a worker node starts up, the kubelet does the following:
-->
## 初始化過程   {#initialization-process}

當工作節點啟動時，kubelet 執行以下操作：

<!--
1. Look for its `kubeconfig` file
2. Retrieve the URL of the API server and credentials, normally a TLS key and signed certificate from the `kubeconfig` file
3. Attempt to communicate with the API server using the credentials.
-->
1. 尋找自己的 `kubeconfig` 檔案
2. 檢索 API 伺服器的 URL 和憑據，通常是來自 `kubeconfig` 檔案中的
   TLS 金鑰和已簽名證書
3. 嘗試使用這些憑據來與 API 伺服器通訊

<!--
Assuming that the kube-apiserver successfully validates the kubelet's credentials, it will treat the kubelet as a valid node, and begin to assign pods to it.

Note that the above process depends upon:

* Existence of a key and certificate on the local host in the `kubeconfig`
* The certificate having been signed by a Certificate Authority (CA) trusted by the kube-apiserver
-->
假定 kube-apiserver 成功地認證了 kubelet 的憑據資料，它會將 kubelet 視為
一個合法的節點並開始將 Pods 分派給該節點。

注意，簽名的過程依賴於：

* `kubeconfig` 中包含金鑰和本地主機的證書
* 證書被 kube-apiserver 所信任的一個證書機構（CA）所簽名

<!--
All of the following are responsibilities of whoever sets up and manages the cluster:

1. Creating the CA key and certificate
2. Distributing the CA certificate to the control plane nodes, where kube-apiserver is running
3. Creating a key and certificate for each kubelet; strongly recommended to have a unique one, with a unique CN, for each kubelet
4. Signing the kubelet certificate using the CA key
5. Distributing the kubelet key and signed certificate to the specific node on which the kubelet is running

The TLS Bootstrapping described in this document is intended to simplify, and partially or even completely automate, steps 3 onwards, as these are the most common when initializing or scaling
a cluster.
-->
負責部署和管理叢集的人有以下責任：

1. 建立 CA 金鑰和證書
2. 將 CA 證書釋出到 kube-apiserver 執行所在的控制平面節點上
3. 為每個 kubelet 建立金鑰和證書；強烈建議為每個 kubelet 使用獨一無二的、
   CN 取值與眾不同的金鑰和證書
4. 使用 CA 金鑰對 kubelet 證書籤名
5. 將 kubelet 金鑰和簽名的證書釋出到 kubelet 執行所在的特定節點上

本文中描述的 TLS 啟動引導過程有意簡化甚至完全自動化上述過程，尤其是
第三步之後的操作，因為這些步驟是初始化或者擴縮叢集時最常見的操作。

<!--
### Bootstrap Initialization

In the bootstrap initialization process, the following occurs:
-->
### 啟動引導初始化   {#bootstrap-initialization}

在啟動引導初始化過程中，會發生以下事情：

<!--
1. kubelet begins
2. kubelet sees that it does _not_ have a `kubeconfig` file
3. kubelet searches for and finds a `bootstrap-kubeconfig` file
4. kubelet reads its bootstrap file, retrieving the URL of the API server and a limited usage "token"
5. kubelet connects to the API server, authenticates using the token
6. kubelet now has limited credentials to create and retrieve a certificate signing request (CSR)
7. kubelet creates a CSR for itself with the signerName set to `kubernetes.io/kube-apiserver-client-kubelet`
8. CSR is approved in one of two ways:
  * If configured, kube-controller-manager automatically approves the CSR
  * If configured, an outside process, possibly a person, approves the CSR using the Kubernetes API or via `kubectl`
9. Certificate is created for the kubelet
-->
1. kubelet 啟動
2. kubelet 看到自己 *沒有* 對應的 `kubeconfig` 檔案
3. kubelet 搜尋並發現 `bootstrap-kubeconfig` 檔案
4. kubelet 讀取該啟動引導檔案，從中獲得 API 伺服器的 URL 和用途有限的
   一個“令牌（Token）”
5. kubelet 建立與 API 伺服器的連線，使用上述令牌執行身份認證
6. kubelet 現在擁有受限制的憑據來建立和取回證書籤名請求（CSR）
7. kubelet 為自己建立一個 CSR，並將其 signerName 設定為 `kubernetes.io/kube-apiserver-client-kubelet`
8. CSR 被以如下兩種方式之一批覆：
  * 如果配置了，kube-controller-manager 會自動批覆該 CSR
  * 如果配置了，一個外部程序，或者是人，使用 Kubernetes API 或者使用 `kubectl`
    來批覆該 CSR
9. kubelet 所需要的證書被建立
<!--
10. Certificate is issued to the kubelet
11. kubelet retrieves the certificate
12. kubelet creates a proper `kubeconfig` with the key and signed certificate
13. kubelet begins normal operation
14. Optional: if configured, kubelet automatically requests renewal of the certificate when it is close to expiry
15. The renewed certificate is approved and issued, either automatically or manually, depending on configuration.
-->
10. 證書被髮放給 kubelet
11. kubelet 取回該證書
12. kubelet 建立一個合適的 `kubeconfig`，其中包含金鑰和已簽名的證書
13. kubelet 開始正常操作
14. 可選地，如果配置了，kubelet 在證書接近於過期時自動請求更新證書
15. 更新的證書被批覆併發放；取決於配置，這一過程可能是自動的或者手動完成

<!--
The rest of this document describes the necessary steps to configure TLS Bootstrapping, and its limitations.
-->
本文的其餘部分描述配置 TLS 啟動引導的必要步驟及其侷限性。

<!--
## Configuration

To configure for TLS bootstrapping and optional automatic approval, you must configure options on the following components:

* kube-apiserver
* kube-controller-manager
* kubelet
* in-cluster resources: `ClusterRoleBinding` and potentially `ClusterRole`

In addition, you need your Kubernetes Certificate Authority (CA).
-->
## 配置    {#configuration}

要配置 TLS 啟動引導及可選的自動批覆，你必須配置以下元件的選項：

* kube-apiserver
* kube-controller-manager
* kubelet
* 叢集內的資源：`ClusterRoleBinding` 以及可能需要的 `ClusterRole`

此外，你需要有 Kubernetes 證書機構（Certificate Authority，CA）。

<!--
## Certificate Authority

As without bootstrapping, you will need a Certificate Authority (CA) key and certificate. As without bootstrapping, these will be used
to sign the kubelet certificate. As before, it is your responsibility to distribute them to control plane nodes.
-->
## 證書機構   {#certificate-authority}

就像在沒有啟動引導的情況下，你會需要證書機構（CA）金鑰和證書。
這些資料會被用來對 kubelet 證書進行簽名。
如前所述，將證書機構金鑰和證書釋出到控制平面節點是你的責任。

<!--
For the purposes of this document, we will assume these have been distributed to control plane nodes at `/var/lib/kubernetes/ca.pem` (certificate) and `/var/lib/kubernetes/ca-key.pem` (key).
We will refer to these as "Kubernetes CA certificate and key".

All Kubernetes components that use these certificates - kubelet, kube-apiserver, kube-controller-manager - assume the key and certificate to be PEM-encoded.
-->
就本文而言，我們假定這些資料被髮布到控制平面節點上的
`/var/lib/kubernetes/ca.pem`（證書）和
`/var/lib/kubernetes/ca-key.pem`（金鑰）檔案中。
我們將這兩個檔案稱作“Kubernetes CA 證書和金鑰”。
所有 Kubernetes 元件（kubelet、kube-apiserver、kube-controller-manager）都使用
這些憑據，並假定這裡的金鑰和證書都是 PEM 編碼的。

<!--
## kube-apiserver configuration

The kube-apiserver has several requirements to enable TLS bootstrapping:

* Recognizing CA that signs the client certificate
* Authenticating the bootstrapping kubelet to the `system:bootstrappers` group
* Authorize the bootstrapping kubelet to create a certificate signing request (CSR)
-->
## kube-apiserver 配置   {#kube-apiserver-configuration}

啟用 TLS 啟動引導對 kube-apiserver 有若干需求：

* 能夠識別對客戶端證書進行簽名的 CA
* 能夠對啟動引導的 kubelet 執行身份認證，並將其置入 `system:bootstrappers` 組
* 能夠對啟動引導的 kubelet 執行鑑權操作，允許其建立證書籤名請求（CSR）

<!--
### Recognizing client certificates

This is normal for all client certificate authentication.
If not already set, add the `--client-ca-file=FILENAME` flag to the kube-apiserver command to enable
client certificate authentication, referencing a certificate authority bundle
containing the signing certificate, for example
`--client-ca-file=/var/lib/kubernetes/ca.pem`.
-->
### 識別客戶證書    {#recognizing-client-certificates}

對於所有客戶端證書的認證操作而言，這是很常見的。
如果還沒有設定，要為 kube-apiserver 命令新增 `--client-ca-file=FILENAME`
標誌來啟用客戶端證書認證，在標誌中引用一個包含用來簽名的證書的證書機構包，
例如：`--client-ca-file=/var/lib/kubernetes/ca.pem`。

<!--
### Initial bootstrap authentication

In order for the bootstrapping kubelet to connect to kube-apiserver and request a certificate, it must first authenticate to the server.
You can use any [authenticator](/docs/reference/access-authn-authz/authentication/) that can authenticate the kubelet.
-->
### 初始啟動引導認證     {#initial-bootstrap-authentication}

為了讓啟動引導的 kubelet 能夠連線到 kube-apiserver 並請求證書，
它必須首先在伺服器上認證自身身份。你可以使用任何一種能夠對 kubelet 執行身份認證的
[身份認證元件](/zh-cn/docs/reference/access-authn-authz/authentication/)。

<!--
While any authentication strategy can be used for the kubelet's initial
bootstrap credentials, the following two authenticators are recommended for ease
of provisioning.

1. [Bootstrap Tokens](#bootstrap-tokens)
2. [Token authentication file](#token-authentication-file)
-->
儘管所有身份認證策略都可以用來對 kubelet 的初始啟動憑據來執行認證，
出於容易準備的因素，建議使用如下兩個身份認證元件：

1. [啟動引導令牌（Bootstrap Token）](#bootstrap-tokens)
2. [令牌認證檔案](#token-authentication-file)

<!--
Bootstrap tokens are a simpler and more easily managed method to authenticate kubelets, and do not require any additional flags when starting kube-apiserver.
-->
啟動引導令牌是一種對 kubelet 進行身份認證的方法，相對簡單且容易管理，
且不需要在啟動 kube-apiserver 時設定額外的標誌。

<!--
Whichever method you choose, the requirement is that the kubelet be able to authenticate as a user with the rights to:

1. create and retrieve CSRs
2. be automatically approved to request node client certificates, if automatic approval is enabled.
-->
無論選擇哪種方法，這裡的需求是 kubelet 能夠被身份認證為某個具有如下許可權的使用者：

1. 建立和讀取 CSR
2. 在啟用了自動批覆時，能夠在請求節點客戶端證書時得到自動批覆

<!--
A kubelet authenticating using bootstrap tokens is authenticated as a user in the group `system:bootstrappers`, which is the standard method to use.
-->
使用啟動引導令牌執行身份認證的 kubelet 會被認證為 `system:bootstrappers`
組中的使用者。這是使用啟動引導令牌的一種標準方法。

<!--
As this feature matures, you
should ensure tokens are bound to a Role Based Access Control (RBAC) policy
which limits requests (using the [bootstrap token](/docs/reference/access-authn-authz/bootstrap-tokens/)) strictly to client
requests related to certificate provisioning. With RBAC in place, scoping the
tokens to a group allows for great flexibility. For example, you could disable a
particular bootstrap group's access when you are done provisioning the nodes.
-->
隨著這個功能特性的逐漸成熟，你需要確保令牌繫結到某基於角色的的訪問控制（RBAC）
策略上，從而嚴格限制請求（使用[啟動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)）
僅限於客戶端申請提供證書。當 RBAC 被配置啟用時，可以將令牌限制到某個組，從而
提高靈活性。例如，你可以在準備節點期間禁止某特定啟動引導組的訪問。

<!--
#### Bootstrap tokens

Bootstrap tokens are described in detail [here](/docs/reference/access-authn-authz/bootstrap-tokens/). These are tokens that are stored as secrets in the Kubernetes cluster,
and then issued to the individual kubelet. You can use a single token for an entire cluster, or issue one per worker node.
-->
#### 啟動引導令牌   {#bootstrap-tokens}

啟動引導令牌的細節在[這裡](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
詳述。啟動引導令牌在 Kubernetes 叢集中儲存為 Secret 物件，被髮放給各個 kubelet。
你可以在整個叢集中使用同一個令牌，也可以為每個節點發放單獨的令牌。

<!--
The process is two-fold:

1. Create a Kubernetes secret with the token ID, secret and scope(s).
2. Issue the token to the kubelet
-->
這一過程有兩個方面：

1. 基於令牌 ID、機密資料和範疇資訊建立 Kubernetes Secret
2. 將令牌發放給 kubelet

<!--
From the kubelet's perspective, one token is like another and has no special meaning.
From the kube-apiserver's perspective, however, the bootstrap token is special. Due to its `type`, `namespace` and `name`, kube-apiserver recognizes it as a special token,
and grants anyone authenticating with that token special bootstrap rights, notably treating them as a member of the `system:bootstrappers` group. This fulfills a basic requirement
for TLS bootstrapping.
-->
從 kubelet 的角度，所有令牌看起來都很像，沒有特別的含義。
從 kube-apiserver 伺服器的角度，啟動引導令牌是很特殊的。
根據其 `type`、`namespace` 和 `name`，kube-apiserver 能夠將認作特殊的令牌，
並授予攜帶該令牌的任何人特殊的啟動引導許可權，換言之，將其視為
`system:bootstrappers` 組的成員。這就滿足了 TLS 啟動引導的基本需求。

<!--
The details for creating the secret are available [here](/docs/reference/access-authn-authz/bootstrap-tokens/).

If you want to use bootstrap tokens, you must enable it on kube-apiserver with the flag:
-->
關於建立 Secret 的進一步細節可訪問[這裡](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)。

如果你希望使用啟動引導令牌，你必須在 kube-apiserver 上使用下面的標誌啟用之：

```console
--enable-bootstrap-token-auth=true
```

<!--
#### Token authentication file

kube-apiserver has the ability to accept tokens as authentication.
These tokens are arbitrary but should represent at least 128 bits of entropy derived
from a secure random number generator (such as `/dev/urandom` on most modern Linux
systems). There are multiple ways you can generate a token. For example:
-->
#### 令牌認證檔案    {#token-authentication-file}

kube-apiserver 能夠將令牌視作身份認證依據。
這些令牌可以是任意資料，但必須表示為基於某安全的隨機數生成器而得到的
至少 128 位混沌資料。這裡的隨機數生成器可以是現代 Linux 系統上的
`/dev/urandom`。生成令牌的方式有很多種。例如：

```shell
head -c 16 /dev/urandom | od -An -t x | tr -d ' '
```

<!--
will generate tokens that look like `02b50b05283e98dd0fd71db496ef01e8`.

The token file should look like the following example, where the first three
values can be anything and the quoted group name should be as depicted:
-->
上面的命令會生成類似於 `02b50b05283e98dd0fd71db496ef01e8` 這樣的令牌。 

令牌檔案看起來是下面的例子這樣，其中前面三個值可以是任何值，用引號括起來
的組名稱則只能用例子中給的值。

```console
02b50b05283e98dd0fd71db496ef01e8,kubelet-bootstrap,10001,"system:bootstrappers"
```

<!--
Add the `--token-auth-file=FILENAME` flag to the kube-apiserver command (in your
systemd unit file perhaps) to enable the token file.  See docs
[here](/docs/reference/access-authn-authz/authentication/#static-token-file) for
further details.
-->
向 kube-apiserver 新增 `--token-auth-file=FILENAME` 標誌（或許這要對 systemd
的單元檔案作修改）以啟用令牌檔案。參見
[這裡](/zh-cn/docs/reference/access-authn-authz/authentication/#static-token-file)
的文件以瞭解進一步的細節。

<!--
### Authorize kubelet to create CSR

Now that the bootstrapping node is _authenticated_ as part of the
`system:bootstrappers` group, it needs to be _authorized_ to create a
certificate signing request (CSR) as well as retrieve it when done.
Fortunately, Kubernetes ships with a `ClusterRole` with precisely these (and
only these) permissions, `system:node-bootstrapper`.

To do this, you only need to create a `ClusterRoleBinding` that binds the `system:bootstrappers` group to the cluster role `system:node-bootstrapper`.
-->
### 授權 kubelet 建立 CSR    {#authorize-kubelet-to-create-csr}

現在啟動引導節點被身份認證為 `system:bootstrapping` 組的成員，它需要被 _授權_
建立證書籤名請求（CSR）並在證書被簽名之後將其取回。
幸運的是，Kubernetes 提供了一個 `ClusterRole`，其中精確地封裝了這些許可，
`system:node-bootstrapper`。

為了實現這一點，你只需要建立 `ClusterRoleBinding`，將 `system:bootstrappers`
組繫結到叢集角色 `system:node-bootstrapper`。

```yaml
# 允許啟動引導節點建立 CSR
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: create-csrs-for-bootstrapping
subjects:
- kind: Group
  name: system:bootstrappers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: system:node-bootstrapper
  apiGroup: rbac.authorization.k8s.io
```

<!--
## kube-controller-manager configuration

While the apiserver receives the requests for certificates from the kubelet and authenticates those requests,
the controller-manager is responsible for issuing actual signed certificates.
-->
## kube-controller-manager 配置   {#kube-controller-manager-configuration}

API 伺服器從 kubelet 收到證書請求並對這些請求執行身份認證，但真正負責發放
簽名證書的是控制器管理器。

<!--
The controller-manager performs this function via a certificate-issuing control loop.
This takes the form of a
[cfssl](https://blog.cloudflare.com/introducing-cfssl/) local signer using
assets on disk. Currently, all certificates issued have one year validity and a
default set of key usages.
-->
控制器管理器透過一個證書發放的控制迴路來執行此操作。該操作的執行方式是使用磁碟上
的檔案用 [cfssl](https://blog.cloudflare.com/introducing-cfssl/) 本地簽名元件
來完成。目前，所發放的所有證書都有一年的有效期，並設定了預設的一組金鑰用法。

<!--
In order for the controller-manager to sign certificates, it needs the following:

* access to the "Kubernetes CA key and certificate" that you created and distributed
* enabling CSR signing
-->
為了讓控制器管理器對證書籤名，它需要：

* 能夠訪問你之前所建立並分發的“Kubernetes CA 金鑰和證書”
* 啟用 CSR 簽名

<!--
### Access to key and certificate

As described earlier, you need to create a Kubernetes CA key and certificate, and distribute it to the control plane nodes.
These will be used by the controller-manager to sign the kubelet certificates.
-->
### 訪問金鑰和證書   {#access-to-key-and-certificate}

如前所述，你需要建立一個 Kubernetes CA 金鑰和證書，並將其釋出到控制平面節點。
這些資料會被控制器管理器來對 kubelet 證書進行簽名。

<!--
Since these signed certificates will, in turn, be used by the kubelet to authenticate as a regular kubelet to kube-apiserver, it is important that the CA
provided to the controller-manager at this stage also be trusted by kube-apiserver for authentication. This is provided to kube-apiserver
with the flag `--client-ca-file=FILENAME` (for example, `--client-ca-file=/var/lib/kubernetes/ca.pem`), as described in the kube-apiserver configuration section.

To provide the Kubernetes CA key and certificate to kube-controller-manager, use the following flags:
-->
由於這些被簽名的證書反過來會被 kubelet 用來在 kube-apiserver 執行普通的
kubelet 身份認證，很重要的一點是為控制器管理器所提供的 CA 也被 kube-apiserver
信任用來執行身份認證。CA 金鑰和證書是透過 kube-apiserver 的標誌
`--client-ca-file=FILENAME`（例如，`--client-ca-file=/var/lib/kubernetes/ca.pem`)，
來設定的，正如 kube-apiserver 配置節所述。

要將 Kubernetes CA 金鑰和證書提供給 kube-controller-manager，可使用以下標誌：

```shell
--cluster-signing-cert-file="/etc/path/to/kubernetes/ca/ca.crt" --cluster-signing-key-file="/etc/path/to/kubernetes/ca/ca.key"
```

<!--
For example:
-->
例如：

```shell
--cluster-signing-cert-file="/var/lib/kubernetes/ca.pem" --cluster-signing-key-file="/var/lib/kubernetes/ca-key.pem"
```

<!--
The validity duration of signed certificates can be configured with flag:
-->
所簽名的證書的合法期限可以透過下面的標誌來配置：

```shell
--cluster-signing-duration
```

<!--
### Approval

In order to approve CSRs, you need to tell the controller-manager that it is acceptable to approve them. This is done by granting
RBAC permissions to the correct group.
-->
### 批覆    {#approval}

為了對 CSR 進行批覆，你需要告訴控制器管理器批覆這些 CSR 是可接受的。
這是透過將 RBAC 訪問許可權授予正確的組來實現的。

<!--
There are two distinct sets of permissions:

* `nodeclient`: If a node is creating a new certificate for a node, then it does not have a certificate yet. It is authenticating using one of the tokens listed above, and thus is part of the group `system:bootstrappers`.
* `selfnodeclient`: If a node is renewing its certificate, then it already has a certificate (by definition), which it uses continuously to authenticate as part of the group `system:nodes`.
-->
許可許可權有兩組：

* `nodeclient`：如果節點在為節點建立新的證書，則該節點還沒有證書。該節點
  使用前文所列的令牌之一來執行身份認證，因此是組 `system:bootstrappers` 組
  的成員。
* `selfnodeclient`：如果節點在對證書執行續期操作，則該節點已經擁有一個證書。
  節點持續使用現有的證書將自己認證為 `system:nodes` 組的成員。

<!--
To enable the kubelet to request and receive a new certificate, create a `ClusterRoleBinding` that binds the group in which the bootstrapping node is a member `system:bootstrappers` to the `ClusterRole` that grants it permission, `system:certificates.k8s.io:certificatesigningrequests:nodeclient`:
-->
要允許 kubelet 請求並接收新的證書，可以建立一個 `ClusterRoleBinding` 將啟動
引導節點所處的組 `system:bootstrappers` 繫結到為其賦予訪問許可權的
`ClusterRole` `system:certificates.k8s.io:certificatesigningrequests:nodeclient`：

```yaml
# 批覆 "system:bootstrappers" 組的所有 CSR
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: auto-approve-csrs-for-group
subjects:
- kind: Group
  name: system:bootstrappers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: system:certificates.k8s.io:certificatesigningrequests:nodeclient
  apiGroup: rbac.authorization.k8s.io
```

<!--
To enable the kubelet to renew its own client certificate, create a `ClusterRoleBinding` that binds the group in which the fully functioning node is a member `system:nodes` to the `ClusterRole` that
grants it permission, `system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`:
-->
要允許 kubelet 對其客戶端證書執行續期操作，可以建立一個 `ClusterRoleBinding`
將正常工作的節點所處的組 `system:nodes` 繫結到為其授予訪問許可的 `ClusterRole`
`system:certificates.k8s.io:certificatesigningrequests:selfnodeclient`：

```yaml
# 批覆 "system:nodes" 組的 CSR 續約請求
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: auto-approve-renewals-for-nodes
subjects:
- kind: Group
  name: system:nodes
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: system:certificates.k8s.io:certificatesigningrequests:selfnodeclient
  apiGroup: rbac.authorization.k8s.io
```

<!--
The `csrapproving` controller that ships as part of
[kube-controller-manager](/docs/admin/kube-controller-manager/) and is enabled
by default. The controller uses the [`SubjectAccessReview`
API](/docs/reference/access-authn-authz/authorization/#checking-api-access) to
determine if a given user is authorized to request a CSR, then approves based on
the authorization outcome. To prevent conflicts with other approvers, the
builtin approver doesn't explicitly deny CSRs. It only ignores unauthorized
requests. The controller also prunes expired certificates as part of garbage
collection.
-->
作為 [kube-controller-manager](/zh-cn/docs/reference/generated/kube-controller-manager/)
的一部分的 `csrapproving` 控制器是自動被啟用的。
該控制器使用 [`SubjectAccessReview` API](/zh-cn/docs/reference/access-authn-authz/authorization/#checking-api-access)
來確定是否某給定使用者被授權請求 CSR，之後基於鑑權結果執行批覆操作。
為了避免與其它批覆元件發生衝突，內建的批覆元件不會顯式地拒絕任何 CSRs。
該元件僅是忽略未被授權的請求。
控制器也會作為垃圾收集的一部分清除已過期的證書。

<!--
## kubelet configuration

Finally, with the control plane properly set up and all of the necessary authentication and authorization in place, we can configure the kubelet.
-->
## kubelet 配置   {#kubelet-configuration}

最後，當控制平面節點被正確配置並且所有必要的身份認證和鑑權機制都就緒時，
我們可以配置 kubelet。

<!--
The kubelet requires the following configuration to bootstrap:

* A path to store the key and certificate it generates (optional, can use default)
* A path to a `kubeconfig` file that does not yet exist; it will place the bootstrapped config file here
* A path to a bootstrap `kubeconfig` file to provide the URL for the server and bootstrap credentials, e.g. a bootstrap token
* Optional: instructions to rotate certificates
-->
kubelet 需要以下配置來執行啟動引導：

* 一個用來儲存所生成的金鑰和證書的路徑（可選，可以使用預設配置）
* 一個用來指向尚不存在的 `kubeconfig` 檔案的路徑；kubelet 會將啟動引導
  配置檔案放到這個位置
* 一個指向啟動引導 `kubeconfig` 檔案的路徑，用來提供 API 伺服器的 URL
  和啟動引導憑據，例如，啟動引導令牌
* 可選的：輪換證書的指令

<!--
The bootstrap `kubeconfig` should be in a path available to the kubelet, for example `/var/lib/kubelet/bootstrap-kubeconfig`.

Its format is identical to a normal `kubeconfig` file. A sample file might look as follows:
-->
啟動引導 `kubeconfig` 檔案應該放在一個 kubelet 可訪問的路徑下，例如
`/var/lib/kubelet/bootstrap-kubeconfig`。

其格式與普通的 `kubeconfig` 檔案完全相同。例項檔案可能看起來像這樣：

```yaml
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority: /var/lib/kubernetes/ca.pem
    server: https://my.server.example.com:6443
  name: bootstrap
contexts:
- context:
    cluster: bootstrap
    user: kubelet-bootstrap
  name: bootstrap
current-context: bootstrap
preferences: {}
users:
- name: kubelet-bootstrap
  user:
    token: 07401b.f395accd246ae52d
```

<!--
The important elements to note are:

* `certificate-authority`: path to a CA file, used to validate the server certificate presented by kube-apiserver
* `server`: URL to kube-apiserver
* `token`: the token to use
-->
需要額外注意的一些因素有：

* `certificate-authority`：指向 CA 檔案的路徑，用來對 kube-apiserver 所出示
  的伺服器證書進行驗證
* `server`： 用來訪問 kube-apiserver 的 URL
* `token`：要使用的令牌

<!--
The format of the token does not matter, as long as it matches what kube-apiserver expects. In the above example, we used a bootstrap token.
As stated earlier, _any_ valid authentication method can be used, not only tokens.

Because the bootstrap `kubeconfig` _is_ a standard `kubeconfig`, you can use `kubectl` to generate it. To create the above example file:
-->
令牌的格式並不重要，只要它與 kube-apiserver 的期望匹配即可。
在上面的例子中，我們使用的是啟動引導令牌。
如前所述，任何合法的身份認證方法都可以使用，不限於令牌。

因為啟動引導 `kubeconfig` 檔案是一個標準的 `kubeconfig` 檔案，你可以使用
`kubectl` 來生成該檔案。要生成上面的示例檔案：

```
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig set-cluster bootstrap --server='https://my.server.example.com:6443' --certificate-authority=/var/lib/kubernetes/ca.pem
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig set-credentials kubelet-bootstrap --token=07401b.f395accd246ae52d
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig set-context bootstrap --user=kubelet-bootstrap --cluster=bootstrap
kubectl config --kubeconfig=/var/lib/kubelet/bootstrap-kubeconfig use-context bootstrap
```

<!--
To indicate to the kubelet to use the bootstrap `kubeconfig`, use the following kubelet flag:
-->
要指示 kubelet 使用啟動引導 `kubeconfig` 檔案，可以使用下面的 kubelet 標誌：

```
--bootstrap-kubeconfig="/var/lib/kubelet/bootstrap-kubeconfig" --kubeconfig="/var/lib/kubelet/kubeconfig"
```

<!--
When starting the kubelet, if the file specified via `--kubeconfig` does not
exist, the bootstrap kubeconfig specified via `--bootstrap-kubeconfig` is used
to request a client certificate from the API server. On approval of the
certificate request and receipt back by the kubelet, a kubeconfig file
referencing the generated key and obtained certificate is written to the path
specified by `--kubeconfig`. The certificate and key file will be placed in the
directory specified by `--cert-dir`.
-->
在啟動 kubelet 時，如果 `--kubeconfig` 標誌所指定的檔案並不存在，會使用透過標誌
`--bootstrap-kubeconfig` 所指定的啟動引導 kubeconfig 配置來向 API 伺服器請求
客戶端證書。在證書請求被批覆並被 kubelet 收回時，一個引用所生成的金鑰和所獲得
證書的 kubeconfig 檔案會被寫入到透過 `--kubeconfig` 所指定的檔案路徑下。
證書和金鑰檔案會被放到 `--cert-dir` 所指定的目錄中。

<!--
### Client and Serving Certificates

All of the above relate to kubelet _client_ certificates, specifically, the certificates a kubelet
uses to authenticate to kube-apiserver.
-->
### 客戶和服務證書   {#client-and-serving-certificates}

前文所述的內容都與 kubelet _客戶端_ 證書相關，尤其是 kubelet 用來向
kube-apiserver 認證自身身份的證書。

<!--
A kubelet also can use _serving_ certificates. The kubelet itself exposes an https endpoint for certain features.
To secure these, the kubelet can do one of:

* use provided key and certificate, via the `--tls-private-key-file` and `--tls-cert-file` flags
* create self-signed key and certificate, if a key and certificate are not provided
* request serving certificates from the cluster server, via the CSR API
-->
kubelet 也可以使用 _服務（Serving）_ 證書。kubelet 自身向外提供一個
HTTPS 末端，包含若干功能特性。要保證這些末端的安全性，kubelet 可以執行以下操作
之一：

* 使用透過 `--tls-private-key-file` 和 `--tls-cert-file` 所設定的金鑰和證書
* 如果沒有提供金鑰和證書，則建立自簽名的金鑰和證書
* 透過 CSR API 從叢集伺服器請求服務證書

<!--
The client certificate provided by TLS bootstrapping is signed, by default, for `client auth` only, and thus cannot
be used as serving certificates, or `server auth`.

However, you _can_ enable its server certificate, at least partially, via certificate rotation.
-->
TLS 啟動引導所提供的客戶端證書預設被簽名為僅用於 `client auth`（客戶端認證），
因此不能作為提供服務的證書，或者 `server auth`。

不過，你可以啟用伺服器證書，至少可以部分地透過證書輪換來實現這點。

<!--
### Certificate Rotation

Kubernetes v1.8 and higher kubelet implements __beta__ features for enabling
rotation of its client and/or serving certificates.  These can be enabled through
the respective `RotateKubeletClientCertificate` and
`RotateKubeletServerCertificate` feature flags on the kubelet and are enabled by
default.
-->
### 證書輪換    {#certificate-rotation}

Kubernetes v1.8 和更高版本的 kubelet 實現了對客戶端證書與/或服務證書進行輪換
這一 Beta 特性。這一特性透過 kubelet 對應的 `RotateKubeletClientCertificate` 和
`RotateKubeletServerCertificate` 特性門控標誌來控制，並且是預設啟用的。

<!--
`RotateKubeletClientCertificate` causes the kubelet to rotate its client
certificates by creating new CSRs as its existing credentials expire. To enable
this feature pass the following flag to the kubelet:
-->
`RotateKubeletClientCertificate` 會導致 kubelet 在其現有憑據即將過期時透過
建立新的 CSR 來輪換其客戶端證書。要啟用此功能特性，可將下面的標誌傳遞給
kubelet：

```
--rotate-certificates
```

<!--
`RotateKubeletServerCertificate` causes the kubelet **both** to request a serving
certificate after bootstrapping its client credentials **and** to rotate that
certificate. To enable this feature pass the following flag to the kubelet:
-->
`RotateKubeletServerCertificate` 會讓 kubelet 在啟動引導其客戶端憑據之後請求
一個服務證書 **且** 對該服務證書執行輪換操作。要啟用此功能特性，將下面的標誌
傳遞給 kubelet：

```
--rotate-server-certificates
```

{{< note >}}
<!--
The CSR approving controllers implemented in core Kubernetes do not
approve node _serving_ certificates for [security
reasons](https://github.com/kubernetes/community/pull/1982). To use
`RotateKubeletServerCertificate` operators need to run a custom approving
controller, or manually approve the serving certificate requests.
-->
Kubernetes 核心中所實現的 CSR 批覆控制器出於
[安全原因](https://github.com/kubernetes/community/pull/1982)
並不會自動批覆節點的 _服務_ 證書。
要使用 `RotateKubeletServerCertificate` 功能特性，叢集運維人員需要執行一個
定製的控制器或者手動批覆服務證書的請求。

<!--
A deployment-specific approval process for kubelet serving certificates should typically only approve CSRs which:

1. are requested by nodes (ensure the `spec.username` field is of the form 
   `system:node:<nodeName>` and `spec.groups` contains `system:nodes`) 
2. request usages for a serving certificate (ensure `spec.usages` contains `server auth`, 
   optionally contains `digital signature` and `key encipherment`, and contains no other usages)
3. only have IP and DNS subjectAltNames that belong to the requesting node, 
   and have no URI and Email subjectAltNames (parse the x509 Certificate Signing Request 
   in `spec.request` to verify `subjectAltNames`)
-->
對 kubelet 服務證書的批覆過程因叢集部署而異，通常應該僅批覆如下 CSR：

1. 由節點發出的請求（確保 `spec.username` 欄位形式為 `system:node:<nodeName>`
   且 `spec.groups` 包含 `system:nodes`）
2. 請求中包含服務證書用法（確保 `spec.usages` 中包含 `server auth`，可選地也可 
   包含 `digital signature` 和 `key encipherment`，且不包含其它用法）
3. 僅包含隸屬於請求節點的 IP 和 DNS 的 `subjectAltNames`，沒有 URI 和 Email
   形式的 `subjectAltNames`（解析 `spec.request` 中的 x509 證書籤名請求可以
   檢查 `subjectAltNames`）
{{< /note >}}

<!--
## Other authenticating components

All of TLS bootstrapping described in this document relates to the kubelet. However,
other components may need to communicate directly with kube-apiserver. Notable is kube-proxy, which
is part of the Kubernetes control plane and runs on every node, but may also include other components such as monitoring or networking.
-->
## 其它身份認證元件   {#other-authenticating-components}

本文所描述的所有 TLS 啟動引導內容都與 kubelet 相關。不過，其它元件也可能需要
直接與 kube-apiserver 直接通訊。容易想到的是 kube-proxy，同樣隸屬於
Kubernetes 的控制面並且執行在所有節點之上，不過也可能包含一些其它負責
監控或者聯網的元件。

<!--
Like the kubelet, these other components also require a method of authenticating to kube-apiserver.
You have several options for generating these credentials:
-->
與 kubelet 類似，這些其它元件也需要一種向 kube-apiserver 認證身份的方法。
你可以用幾種方法來生成這類憑據：

<!--
* The old way: Create and distribute certificates the same way you did for kubelet before TLS bootstrapping
* DaemonSet: Since the kubelet itself is loaded on each node, and is sufficient to start base services, you can run kube-proxy and other node-specific services not as a standalone process, but rather as a daemonset in the `kube-system` namespace. Since it will be in-cluster, you can give it a proper service account with appropriate permissions to perform its activities. This may be the simplest way to configure such services.
-->
* 較老的方式：和 kubelet 在 TLS 啟動引導之前所做的一樣，用類似的方式
  建立和分發證書
* DaemonSet：由於 kubelet 自身被載入到所有節點之上，並且有足夠能力來啟動基本服務，
  你可以執行將 kube-proxy 和其它特定節點的服務作為 `kube-system` 名字空間中的
  DaemonSet 來執行，而不是獨立的程序。由於 DaemonSet 位於叢集內部，你可以為其
  指派一個合適的服務賬戶，使之具有適當的訪問許可權來完成其使命。這也許是配置此類
  服務的最簡單的方法。

<!--
## kubectl approval

CSRs can be approved outside of the approval flows builtin to the controller
manager.
-->
## kubectl 批覆    {#kubectl-approval}

CSRs 可以在控制器管理其內建的批覆工作流之外被批覆。

<!--
The signing controller does not immediately sign all certificate requests.
Instead, it waits until they have been flagged with an "Approved" status by an
appropriately-privileged user. This flow is intended to allow for automated
approval handled by an external approval controller or the approval controller
implemented in the core controller-manager. However cluster administrators can
also manually approve certificate requests using kubectl. An administrator can
list CSRs with `kubectl get csr` and describe one in detail with `kubectl
describe csr <name>`. An administrator can approve or deny a CSR with `kubectl
certificate approve <name>` and `kubectl certificate deny <name>`.
-->
簽名控制器並不會立即對所有證書請求執行簽名操作。相反，它會等待這些請求被某
具有適當特權的使用者標記為 “Approved（已批准）”狀態。
這一流程有意允許由外部批覆控制器來自動執行的批覆，或者由控制器管理器內建的
批覆控制器來自動批覆。
不過，叢集管理員也可以使用 `kubectl` 來手動批准證書請求。
管理員可以透過 `kubectl get csr` 來列舉所有的 CSR，使用
`kubectl descsribe csr <name>` 來描述某個 CSR 的細節。
管理員可以使用 `kubectl certificate approve <name` 來批准某 CSR，或者
`kubectl certificate deny <name>` 來拒絕某 CSR。

