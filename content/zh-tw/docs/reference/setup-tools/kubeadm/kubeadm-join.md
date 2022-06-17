---
title: kubeadm join
content_type: concept
weight: 30
---
<!--
reviewers:
- luxas
- jbeda
title: kubeadm join
content_type: concept
weight: 30
-->

<!-- overview -->
<!--
This command initializes a Kubernetes worker node and joins it to the cluster.
-->
此命令用來初始化 Kubernetes 工作節點並將其加入叢集。


<!-- body -->
{{< include "generated/kubeadm_join.md" >}}

<!--
### The join workflow {#join-workflow}
-->
### join 工作流 {#join-workflow}

<!--
`kubeadm join` bootstraps a Kubernetes worker node or a control-plane node and adds it to the cluster.
This action consists of the following steps for worker nodes:
-->
`kubeadm join` 初始化 Kubernetes 工作節點或控制平面節點並將其新增到叢集中。
對於工作節點，該操作包括以下步驟：

<!--
1. kubeadm downloads necessary cluster information from the API server.
   By default, it uses the bootstrap token and the CA key hash to verify the
   authenticity of that data. The root CA can also be discovered directly via a
   file or URL.
-->
1. kubeadm 從 API 伺服器下載必要的叢集資訊。
   預設情況下，它使用引導令牌和 CA 金鑰雜湊來驗證資料的真實性。
   也可以透過檔案或 URL 直接發現根 CA。

<!--
1. Once the cluster information is known, kubelet can start the TLS bootstrapping
   process.

   The TLS bootstrap uses the shared token to temporarily authenticate
   with the Kubernetes API server to submit a certificate signing request (CSR); by
   default the control plane signs this CSR request automatically.
-->
2. 一旦知道叢集資訊，kubelet 就可以開始 TLS 引導過程。

   TLS 載入程式使用共享令牌與 Kubernetes API 伺服器進行臨時的身份驗證，以提交證書籤名請求 (CSR)；
   預設情況下，控制平面自動對該 CSR 請求進行簽名。

<!--
1. Finally, kubeadm configures the local kubelet to connect to the API
   server with the definitive identity assigned to the node.
-->
3. 最後，kubeadm 配置本地 kubelet 使用分配給節點的確定標識連線到 API 伺服器。

<!--
For control-plane nodes additional steps are performed:

1. Downloading certificates shared among control-plane nodes from the cluster
  (if explicitly requested by the user).

1. Generating control-plane component manifests, certificates and kubeconfig.

1. Adding new local etcd member.
-->
對於控制平面節點，執行額外的步驟：

1. 從叢集下載控制平面節點之間共享的證書（如果使用者明確要求）。

1. 生成控制平面元件清單、證書和 kubeconfig。

1. 新增新的本地 etcd 成員。

<!--
### Using join phases with kubeadm {#join-phases}
-->
### 使用 kubeadm 的 join phase 命令 {#join-phases}

<!--
Kubeadm allows you join a node to the cluster in phases using `kubeadm join phase`.
-->
Kubeadm 允許你使用 `kubeadm join phase` 分階段將節點加入叢集。

<!--
To view the ordered list of phases and sub-phases you can call `kubeadm join --help`. The list will be located
at the top of the help screen and each phase will have a description next to it.
Note that by calling `kubeadm join` all of the phases and sub-phases will be executed in this exact order.
-->
要檢視階段和子階段的有序列表，可以呼叫 `kubeadm join --help`。
該列表將位於幫助螢幕的頂部，每個階段旁邊都有一個描述。
注意，透過呼叫 `kubeadm join`，所有階段和子階段都將按照此確切順序執行。

<!--
Some phases have unique flags, so if you want to have a look at the list of available options add `--help`, for example:
-->
有些階段具有唯一的標誌，因此，如果要檢視可用選項列表，請新增 `--help`，例如：

```shell
kubeadm join phase kubelet-start --help
```

<!--
Similar to the [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases)
command, `kubeadm join phase` allows you to skip a list of phases using the `--skip-phases` flag.

For example:
-->
類似於 [kubeadm init phase](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases) 命令，
`kubeadm join phase` 允許你使用 `--skip-phases` 標誌跳過階段列表。

例如：

```shell
sudo kubeadm join --skip-phases=preflight --config=config.yaml
```

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Alternatively, you can use the `skipPhases` field in `JoinConfiguration`.
-->
或者，你可以使用 `JoinConfiguration` 中的 `skipPhases` 欄位。

<!--
### Discovering what cluster CA to trust
-->
### 發現要信任的叢集 CA {#discovering-what-cluster-ca-to-trust}

<!--
The kubeadm discovery has several options, each with security tradeoffs.
The right method for your environment depends on how you provision nodes and the
security expectations you have about your network and node lifecycles.
-->
Kubeadm 的發現有幾個選項，每個選項都有安全性上的優缺點。
適合你的環境的正確方法取決於節點是如何準備的以及你對網路的安全性期望
和節點的生命週期特點。

<!--
#### Token-based discovery with CA pinning
-->
#### 帶 CA 鎖定模式的基於令牌的發現 {#token-based-discovery-with-ca-pinning}

<!--
This is the default mode in kubeadm. In this mode, kubeadm downloads
the cluster configuration (including root CA) and validates it using the token
as well as validating that the root CA public key matches the provided hash and
that the API server certificate is valid under the root CA.
-->
這是 kubeadm 的預設模式。
在這種模式下，kubeadm 下載叢集配置（包括根 CA）並使用令牌驗證它，
並且會驗證根 CA 的公鑰與所提供的雜湊是否匹配，
以及 API 伺服器證書在根 CA 下是否有效。

<!--
The CA key hash has the format `sha256:<hex_encoded_hash>`. By default, the hash value is returned in the `kubeadm join` command printed at the end of `kubeadm init` or in the output of `kubeadm token create --print-join-command`. It is in a standard format (see [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)) and can also be calculated by 3rd party tools or provisioning systems. For example, using the OpenSSL CLI:
-->
CA 鍵雜湊格式為 `sha256:<hex_encoded_hash>`。
預設情況下，在 `kubeadm init` 最後列印的 `kubeadm join` 命令
或者 `kubeadm token create --print-join-command` 的輸出資訊中返回雜湊值。
它使用標準格式（請參考 [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4)）
並且也能透過第三方工具或者製備系統進行計算。
例如，使用 OpenSSL CLI：

```shell
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

<!--
**Example `kubeadm join` commands:**
-->
**`kubeadm join` 命令示例**

<!--
For worker nodes:
-->
對於工作節點：

```shell
kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443
```

<!--
For control-plane nodes:
-->
對於控制面節點：

```shell
kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef --control-plane 1.2.3.4:6443
```

<!--
You can also call `join` for a control-plane node with `--certificate-key` to copy certificates to this node,
if the `kubeadm init` command was called with `--upload-certs`.
-->
如果使用 `--upload-certs` 呼叫 `kubeadm init` 命令，
你也可以對控制平面節點呼叫帶 `--certificate-key` 引數的 `join` 命令，
將證書複製到該節點。

<!--
**Advantages:**

- Allows bootstrapping nodes to securely discover a root of trust for the
  control-plane node even if other worker nodes or the network are compromised.

- Convenient to execute manually since all of the information required fits
  into a single `kubeadm join` command.
-->

**優勢：**

- 允許引導節點安全地發現控制平面節點的信任根，即使其他工作節點或網路受到損害。

- 方便手動執行，因為所需的所有資訊都可放到一個 `kubeadm join` 命令中。

<!--
**Disadvantages:**

- The CA hash is not normally known until the control-plane node has been provisioned,
  which can make it more difficult to build automated provisioning tools that
  use kubeadm. By generating your CA in beforehand, you may workaround this
  limitation.
-->

**劣勢：**

- CA 雜湊通常在控制平面節點被提供之前是不知道的，這使得構建使用 kubeadm 的自動化配置工具更加困難。
  透過預先生成 CA，你可以解除這個限制。

<!--
#### Token-based discovery without CA pinning
-->
#### 無 CA 鎖定模式的基於令牌的發現 {#token-based-discovery-without-ca-pinning}

<!--
This mode relies only on the symmetric token to sign
(HMAC-SHA256) the discovery information that establishes the root of trust for
the control-plane. To use the mode the joining nodes must skip the hash validation of the
CA public key, using `--discovery-token-unsafe-skip-ca-verification`. You should consider
using one of the other modes if possible.

**Example `kubeadm join` command:**
-->
此模式僅依靠對稱令牌來簽署 (HMAC-SHA256) 為控制平面建立信任根的發現資訊。
要使用該模式，加入節點必須使用
`--discovery-token-unsafe-skip-ca-verification`
跳過 CA 公鑰的雜湊驗證。
如果可以，你應該考慮使用其他模式。

**`kubeadm join` 命令示例**

```shell
kubeadm join --token abcdef.1234567890abcdef --discovery-token-unsafe-skip-ca-verification 1.2.3.4:6443
```

<!--
**Advantages:**

- Still protects against many network-level attacks.

- The token can be generated ahead of time and shared with the control-plane node and
  worker nodes, which can then bootstrap in parallel without coordination. This
  allows it to be used in many provisioning scenarios.
-->

**優勢**

- 仍然可以防止許多網路級攻擊。

- 可以提前生成令牌並與控制平面節點和工作節點共享，這樣控制平面節點和工作節點就可以並行引導而無需協調。
  這允許它在許多配置場景中使用。

<!--
**Disadvantages:**

- If an attacker is able to steal a bootstrap token via some vulnerability,
  they can use that token (along with network-level access) to impersonate the
  control-plane node to other bootstrapping nodes. This may or may not be an appropriate
  tradeoff in your environment.
-->

**劣勢**

- 如果攻擊者能夠透過某些漏洞竊取引導令牌，那麼他們可以使用該令牌（連同網路級訪問）
  為其它處於引導過程中的節點提供假冒的控制平面節點。
  在你的環境中，這可能是一個適當的折衷方法，也可能不是。

<!--
#### File or HTTPS-based discovery
-->
#### 基於 HTTPS 或檔案發現 {#file-or-https-based-discovery}

<!--
This provides an out-of-band way to establish a root of trust between the control-plane node
and bootstrapping nodes. Consider using this mode if you are building automated provisioning
using kubeadm. The format of the discovery file is a regular Kubernetes
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) file.

In case the discovery file does not contain credentials, the TLS discovery token will be used.
-->
這種方案提供了一種帶外方式在控制平面節點和引導節點之間建立信任根。
如果使用 kubeadm 構建自動配置，請考慮使用此模式。
發現檔案的格式為常規的 Kubernetes
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) 檔案。

如果發現檔案不包含憑據，則將使用 TLS 發現令牌。

<!--
**Example `kubeadm join` commands:**
-->
**`kubeadm join` 命令示例：**

<!--
- `kubeadm join --discovery-file path/to/file.conf` (local file)

- `kubeadm join --discovery-file https://url/file.conf` (remote HTTPS URL)
-->
- `kubeadm join --discovery-file path/to/file.conf`（本地檔案）

- `kubeadm join --discovery-file https://url/file.conf`（遠端 HTTPS URL）

<!--
**Advantages:**

- Allows bootstrapping nodes to securely discover a root of trust for the
  control-plane node even if the network or other worker nodes are compromised.
-->

**優勢：**

- 允許引導節點安全地發現控制平面節點的信任根，即使網路或其他工作節點受到損害。

<!--
**Disadvantages:**

- Requires that you have some way to carry the discovery information from
  the control-plane node to the bootstrapping nodes. If the discovery file contains credentials
  you must keep it secret and transfer it over a secure channel. This might be possible with your
  cloud provider or provisioning tool.
-->

**劣勢：**

- 要求你有某種方法將發現資訊從控制平面節點傳送到引導節點。
  如果發現檔案包含憑據，你必須對其保密並透過安全通道進行傳輸。
  這可能透過你的雲提供商或供應工具來實現。

<!--
### Securing your installation even more {#securing-more}
-->
### 確保你的安裝更加安全 {#securing-more}

<!--
The defaults for kubeadm may not work for everyone. This section documents how to tighten up a kubeadm installation
at the cost of some usability.
-->
Kubeadm 的預設值可能不適用於所有人。
本節說明如何以犧牲可用性為代價來加強 kubeadm 安裝。

<!--
#### Turning off auto-approval of node client certificates
-->
#### 關閉節點客戶端證書的自動批准 {#turning-off-auto-approval-of-node-client-certificates}

<!--
By default, there is a CSR auto-approver enabled that basically approves any client certificate request
for a kubelet when a Bootstrap Token was used when authenticating. If you don't want the cluster to
automatically approve kubelet client certs, you can turn it off by executing this command:
-->
預設情況下，Kubernetes 啟用了 CSR 自動批准器，如果在身份驗證時使用啟動引導令牌，
它會批准對 kubelet 的任何客戶端證書的請求。
如果不希望叢集自動批准kubelet客戶端證書，可以透過執行以下命令關閉它：

```shell
kubectl delete clusterrolebinding kubeadm:node-autoapprove-bootstrap
```

<!--
After that, `kubeadm join` will block until the admin has manually approved the CSR in flight:
-->
關閉後，`kubeadm join` 操作將會被阻塞，直到管理員已經手動批准了在途中的 CSR 才會繼續：

```shell
kubectl get csr
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   18s       system:bootstrap:878f07   Pending
```

```shell
kubectl certificate approve node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ
```

<!--
The output is similar to this:
-->
輸出類似於：

```
certificatesigningrequest "node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ" approved
```

```shell
kubectl get csr
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME                                                   AGE       REQUESTOR                 CONDITION
node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   1m        system:bootstrap:878f07   Approved,Issued
```

<!--
This forces the workflow that `kubeadm join` will only succeed if `kubectl certificate approve` has been run.
-->
這迫使工作流只有在運行了 `kubectl certificate approve` 後，`kubeadm join` 才能成功。

<!--
#### Turning off public access to the cluster-info ConfigMap
-->
#### 關閉對叢集資訊 ConfigMap 的公開訪問 {#turning-off-public-access-to-the-cluster-info-configmap}

<!--
In order to achieve the joining flow using the token as the only piece of validation information, a
 ConfigMap with some data needed for validation of the control-plane node's identity is exposed publicly by
default. While there is no private data in this ConfigMap, some users might wish to turn
it off regardless. Doing so will disable the ability to use the `--discovery-token` flag of the
`kubeadm join` flow. Here are the steps to do so:
-->
為了實現使用令牌作為唯一驗證資訊的加入工作流，預設情況下會公開帶有驗證控制平面節點標識所需資料的 ConfigMap。
雖然此 ConfigMap 中沒有私有資料，但一些使用者可能希望無論如何都關閉它。
這樣做需要禁用 `kubeadm join` 工作流的 `--discovery-token` 引數。
以下是實現步驟：

<!--
* Fetch the `cluster-info` file from the API Server:
-->
* 從 API 伺服器獲取 `cluster-info` 檔案：

```shell
kubectl -n kube-public get cm cluster-info -o yaml | grep "kubeconfig:" -A11 | grep "apiVersion" -A10 | sed "s/    //" | tee cluster-info.yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

```
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: <ca-cert>
    server: https://<ip>:<port>
  name: ""
contexts: []
current-context: ""
preferences: {}
users: []
```

<!--
* Use the `cluster-info.yaml` file as an argument to `kubeadm join --discovery-file`.

* Turn off public access to the `cluster-info` ConfigMap:
-->

* 使用 `cluster-info.yaml` 檔案作為 `kubeadm join --discovery-file` 引數。

* 關閉 `cluster-info` ConfigMap 的公開訪問：

  ```shell
  kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
  ```

<!--
These commands should be run after `kubeadm init` but before `kubeadm join`.
-->
這些命令應該在執行 `kubeadm init` 之後、在 `kubeadm join` 之前執行。

<!--
### Using kubeadm join with a configuration file {#config-file}
-->
### 使用帶有配置檔案的 kubeadm join {#config-file}

{{< caution >}}
<!--
The config file is still considered beta and may change in future versions.
-->
配置檔案目前是 beta 功能，在將來的版本中可能會變動。
{{< /caution >}}

<!--
It's possible to configure `kubeadm join` with a configuration file instead of command
line flags, and some more advanced features may only be available as
configuration file options. This file is passed using the `--config` flag and it must
contain a `JoinConfiguration` structure. Mixing `--config` with others flags may not be
allowed in some cases.
-->
可以用配置檔案替代命令列引數的方法配置 `kubeadm join`，一些進階功能也只有在使用配置檔案時才可選用。
該檔案透過 `--config` 引數來傳遞，並且檔案中必須包含 `JoinConfiguration` 結構。
在某些情況下，不允許將 `--config` 與其他標誌混合使用。

<!--
The default configuration can be printed out using the
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.

If your configuration is not using the latest version it is **recommended** that you migrate using
the [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/) command.
-->
使用 [kubeadm config print](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令可以列印預設配置。

如果你的配置沒有使用最新版本，
**推薦**使用 [kubeadm config migrate](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
命令轉換。

<!--
For more information on the fields and usage of the configuration you can navigate to our
[API reference](/docs/reference/config-api/kubeadm-config.v1beta3/).
-->
有關配置的欄位和用法的更多資訊，你可以導航到我們的
[API 參考頁](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)。


## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token/) to manage tokens for `kubeadm join`
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
  初始化 Kubernetes 控制平面節點
* [kubeadm token](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)
  管理 `kubeadm join` 的令牌
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  將 `kubeadm init` 或 `kubeadm join` 對主機的更改恢復到之前狀態

