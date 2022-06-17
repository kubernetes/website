---
title: 使用准入控制器
content_type: concept
weight: 30
---

<!--
reviewers:
- lavalamp
- davidopp
- derekwaynecarr
- erictune
- janetkuo
- thockin
title: Using Admission Controllers
content_type: concept
weight: 30
-->

<!-- overview -->
<!--
This page provides an overview of Admission Controllers.
-->
此頁面提供准入控制器（Admission Controllers）的概述。

<!-- body -->

<!--
## What are they?
-->
## 什麼是准入控制外掛？  {#what-are-they}

<!--
An admission controller is a piece of code that intercepts requests to the
Kubernetes API server prior to persistence of the object, but after the request
is authenticated and authorized.  The controllers consist of the
[list](#what-does-each-admission-controller-do) below, are compiled into the
`kube-apiserver` binary, and may only be configured by the cluster
administrator. In that list, there are two special controllers:
MutatingAdmissionWebhook and ValidatingAdmissionWebhook.  These execute the
mutating and validating (respectively)
[admission control webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
which are configured in the API.
-->
准入控制器是一段程式碼，它會在請求透過認證和授權之後、物件被持久化之前攔截到達 API
伺服器的請求。控制器由下面的[列表](#what-does-each-admission-controller-do)組成，
並編譯進 `kube-apiserver` 可執行檔案，並且只能由叢集管理員配置。
在該列表中，有兩個特殊的控制器：MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook。
它們根據 API 中的配置，分別執行變更和驗證
[准入控制 webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。

<!--
Admission controllers may be "validating", "mutating", or both. Mutating
controllers may modify related objects to the requests they admit; validating controllers may not.

Admission controllers limit requests to create, delete, modify objects or connect to proxy. They do not limit requests to read objects.

The admission control process proceeds in two phases. In the first phase,
mutating admission controllers are run. In the second phase, validating
admission controllers are run. Note again that some of the controllers are
both.

If any of the controllers in either phase reject the request, the entire
request is rejected immediately and an error is returned to the end-user.
-->
准入控制器可以執行 “驗證（Validating）” 和/或 “變更（Mutating）” 操作。
變更（mutating）控制器可以根據被其接受的請求更改相關物件；驗證（validating）控制器則不行。

准入控制器限制建立、刪除、修改物件或連線到代理的請求，不限制讀取物件的請求。

准入控制過程分為兩個階段。第一階段，執行變更准入控制器。第二階段，執行驗證准入控制器。
再次提醒，某些控制器既是變更准入控制器又是驗證准入控制器。

如果兩個階段之一的任何一個控制器拒絕了某請求，則整個請求將立即被拒絕，並向終端使用者返回錯誤。

<!--
Finally, in addition to sometimes mutating the object in question, admission
controllers may sometimes have side effects, that is, mutate related
resources as part of request processing. Incrementing quota usage is the
canonical example of why this is necessary. Any such side-effect needs a
corresponding reclamation or reconciliation process, as a given admission
controller does not know for sure that a given request will pass all of the
other admission controllers.
-->
最後，除了對物件進行變更外，准入控制器還可能有其它副作用：將相關資源作為請求處理的一部分進行變更。
增加配額用量就是一個典型的示例，說明了這樣做的必要性。
此類用法都需要相應的回收或回撥過程，因為任一準入控制器都無法確定某個請求能否透過所有其它准入控制器。

<!--
## Why do I need them?
-->
## 為什麼需要准入控制器？    {#why-do-i-need-them}

<!--
Many advanced features in Kubernetes require an admission controller to be enabled in order
to properly support the feature.  As a result, a Kubernetes API server that is not properly
configured with the right set of admission controllers is an incomplete server and will not
support all the features you expect.
-->
Kubernetes 的許多高階功能都要求啟用一個准入控制器，以便正確地支援該特性。
因此，沒有正確配置准入控制器的 Kubernetes API 伺服器是不完整的，它無法支援你所期望的所有特性。

<!--
## How do I turn on an admission controller?
-->

## 如何啟用一個准入控制器？  {#how-do-i-turn-on-an-admission-controller}

<!--
The Kubernetes API server flag `enable-admission-plugins` takes a comma-delimited list of admission control plugins to invoke prior to modifying objects in the cluster.
For example, the following command line enables the `NamespaceLifecycle` and the `LimitRanger`
admission control plugins:
-->
Kubernetes API 伺服器的 `enable-admission-plugins` 標誌接受一個（以逗號分隔的）准入控制外掛列表，
這些外掛會在叢集修改物件之前被呼叫。

例如，下面的命令啟用 `NamespaceLifecycle` 和 `LimitRanger` 准入控制外掛：

```shell
kube-apiserver --enable-admission-plugins=NamespaceLifecycle,LimitRanger ...
```

{{< note >}}
<!--
Depending on the way your Kubernetes cluster is deployed and how the API server is
started, you may need to apply the settings in different ways. For example, you may
have to modify the systemd unit file if the API server is deployed as a systemd
service, you may modify the manifest file for the API server if Kubernetes is deployed
in a self-hosted way.
-->
根據你 Kubernetes 叢集的部署方式以及 API 伺服器的啟動方式，你可能需要以不同的方式應用設定。
例如，如果將 API 伺服器部署為 systemd 服務，你可能需要修改 systemd 單元檔案；
如果以自託管方式部署 Kubernetes，你可能需要修改 API 伺服器的清單檔案。
{{< /note >}}

<!--
## How do I turn off an admission controller?

The Kubernetes API server flag `disable-admission-plugins` takes a comma-delimited list of admission control plugins to be disabled, even if they are in the list of plugins enabled by default.
-->
## 怎麼關閉准入控制器？   {#how-do-i-turn-off-an-admission-controller}

Kubernetes API 伺服器的 `disable-admission-plugins` 標誌，會將傳入的（以逗號分隔的）
准入控制外掛列表禁用，即使是預設啟用的外掛也會被禁用。

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

<!--
## Which plugins are enabled by default?

To see which admission plugins are enabled:
-->
## 哪些外掛是預設啟用的？  {#which-plugins-are-enabled-by-default}

要檢視哪些外掛是被啟用的：

```shell
kube-apiserver -h | grep enable-admission-plugins
```

<!--
In the current version, the default ones are:
-->

在目前版本中，預設啟用的外掛有：

```
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, LimitRanger, MutatingAdmissionWebhook, NamespaceLifecycle, PersistentVolumeClaimResize, PodSecurity, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionWebhook
```

<!--
## What does each admission controller do?
-->
## 每個准入控制器的作用是什麼？  {#what-does-each-admission-controller-do}

### AlwaysAdmit {#alwaysadmit}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
This admission controller allows all pods into the cluster. It is deprecated because its behavior is the same as if there were no admission controller at all.
-->
該准入控制器允許所有的 Pod 進入叢集。此外掛已被棄用，因其行為與沒有準入控制器一樣。

### AlwaysDeny {#alwaysdeny}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
Rejects all requests. AlwaysDeny is DEPRECATED as it has no real meaning.
-->
拒絕所有的請求。由於它沒有實際意義，已被棄用。

### AlwaysPullImages {#alwayspullimages}

<!--
This admission controller modifies every new Pod to force the image pull policy to Always. This is useful in a
multitenant cluster so that users can be assured that their private images can only be used by those
who have the credentials to pull them. Without this admission controller, once an image has been pulled to a
node, any pod from any user can use it by knowing the image's name (assuming the Pod is
scheduled onto the right node), without any authorization check against the image. When this admission controller
is enabled, images are always pulled prior to starting containers, which means valid credentials are
required.
-->
該准入控制器會修改每個新建立的 Pod，將其映象拉取策略設定為 Always。
這在多租戶叢集中是有用的，這樣使用者就可以放心，他們的私有映象只能被那些有憑證的人使用。
如果沒有這個准入控制器，一旦映象被拉取到節點上，任何使用者的 Pod 都可以透過已瞭解到的映象的名稱
（假設 Pod 被排程到正確的節點上）來使用它，而不需要對映象進行任何鑑權檢查。
啟用這個准入控制器之後，啟動容器之前必須拉取映象，這意味著需要有效的憑證。

### CertificateApproval {#certificateapproval}

<!--
This admission controller observes requests to 'approve' CertificateSigningRequest resources and performs additional
authorization checks to ensure the approving user has permission to `approve` certificate requests with the
`spec.signerName` requested on the CertificateSigningRequest resource.
-->
此准入控制器獲取“審批” CertificateSigningRequest 資源的請求並執行額外的鑑權檢查，
以確保針對設定了 `spec.signerName` 的 CertificateSigningRequest 資源而言，
審批請求的使用者有許可權對證書請求執行 `approve` 操作。

<!--
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/) for more
information on the permissions required to perform different actions on CertificateSigningRequest resources.
-->
有關對 CertificateSigningRequest 資源執行不同操作所需許可權的詳細資訊，
請參閱[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)。

### CertificateSigning  {#certificatesigning}

<!--
This admission controller observes updates to the `status.certificate` field of CertificateSigningRequest resources
and performs an additional authorization checks to ensure the signing user has permission to `sign` certificate
requests with the `spec.signerName` requested on the CertificateSigningRequest resource.
-->
此准入控制器監視對 CertificateSigningRequest 資源的 `status.certificate` 欄位的更新請求，
並執行額外的鑑權檢查，以確保針對設定了 `spec.signerName` 的 CertificateSigningRequest 資源而言，
簽發證書的使用者有許可權對證書請求執行 `sign` 操作。

<!--
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/) for more
information on the permissions required to perform different actions on CertificateSigningRequest resources.
-->
有關對 CertificateSigningRequest 資源執行不同操作所需許可權的詳細資訊，
請參閱[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)。

### CertificateSubjectRestriction {#certificatesubjectrestriction}

<!--
This admission controller observes creation of CertificateSigningRequest resources that have a `spec.signerName`
of `kubernetes.io/kube-apiserver-client`. It rejects any request that specifies a 'group' (or 'organization attribute')
of `system:masters`.
-->
此准入控制器監視 `spec.signerName` 被設定為 `kubernetes.io/kube-apiserver-client` 的
CertificateSigningRequest 資源建立請求，並拒絕所有將 “group”（或 “organization attribute”）
設定為 `system:masters` 的請求。

### DefaultIngressClass {#defaultingressclass}

<!--
This admission controller observes creation of `Ingress` objects that do not request any specific
ingress class and automatically adds a default ingress class to them.  This way, users that do not
request any special ingress class do not need to care about them at all and they will get the
default one.
-->
該准入控制器監測沒有請求任何特定 Ingress 類的 `Ingress` 物件建立請求，並自動向其新增預設 Ingress 類。
這樣，沒有任何特殊 Ingress 類需求的使用者根本不需要關心它們，他們將被設定為預設 Ingress 類。

<!--
This admission controller does not do anything when no default ingress class is configured. When more than one ingress
class is marked as default, it rejects any creation of `Ingress` with an error and an administrator
must revisit their `IngressClass` objects and mark only one as default (with the annotation
"ingressclass.kubernetes.io/is-default-class").  This admission controller ignores any `Ingress`
updates; it acts only on creation.
-->
當未配置預設 Ingress 類時，此准入控制器不執行任何操作。如果有多個 Ingress 類被標記為預設 Ingress 類，
此控制器將拒絕所有建立 `Ingress` 的操作，並返回錯誤資訊。
要修復此錯誤，管理員必須重新檢查其 `IngressClass` 物件，並僅將其中一個標記為預設
（透過註解 "ingressclass.kubernetes.io/is-default-class"）。
此准入控制器會忽略所有 `Ingress` 更新操作，僅處理建立操作。

<!--
See the [ingress](/docs/concepts/services-networking/ingress/) documentation for more about ingress
classes and how to mark one as default.
-->
關於 Ingress 類以及如何將 Ingress 類標記為預設的更多資訊，請參見
[Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 頁面。

### DefaultStorageClass {#defaultstorageclass}

<!--
This admission controller observes creation of `PersistentVolumeClaim` objects that do not request any specific storage class
and automatically adds a default storage class to them.
This way, users that do not request any special storage class do not need to care about them at all and they
will get the default one.
-->
此准入控制器監測沒有請求任何特定儲存類的 `PersistentVolumeClaim` 物件的建立請求，
並自動向其新增預設儲存類。
這樣，沒有任何特殊儲存類需求的使用者根本不需要關心它們，它們將被設定為使用預設儲存類。

<!--
This admission controller does not do anything when no default storage class is configured. When more than one storage
class is marked as default, it rejects any creation of `PersistentVolumeClaim` with an error and an administrator
must revisit their `StorageClass` objects and mark only one as default.
This admission controller ignores any `PersistentVolumeClaim` updates; it acts only on creation.
-->
當未配置預設儲存類時，此准入控制器不執行任何操作。如果將多個儲存類標記為預設儲存類，
此控制器將拒絕所有建立 `PersistentVolumeClaim` 的請求，並返回錯誤資訊。
要修復此錯誤，管理員必須重新檢查其 `StorageClass` 物件，並僅將其中一個標記為預設。
此准入控制器會忽略所有 `PersistentVolumeClaim` 更新操作，僅處理建立操作。

<!--
See [persistent volume](/docs/concepts/storage/persistent-volumes/) documentation about persistent volume claims and
storage classes and how to mark a storage class as default.
-->
關於持久卷申領和儲存類，以及如何將儲存類標記為預設，請參見[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)頁面。

### DefaultTolerationSeconds {#defaulttolerationseconds}

<!--
This admission controller sets the default forgiveness toleration for pods to tolerate
the taints `notready:NoExecute` and `unreachable:NoExecute` based on the k8s-apiserver input parameters
`default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` if the pods don't already 
have toleration for taints `node.kubernetes.io/not-ready:NoExecute` or
`node.kubernetes.io/unreachable:NoExecute`.
The default value for `default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` is 5 minutes.
-->
此准入控制器基於 k8s-apiserver 的輸入引數 `default-not-ready-toleration-seconds` 和
`default-unreachable-toleration-seconds` 為 Pod 設定預設的容忍度，以容忍 `notready:NoExecute` 和
`unreachable:NoExecute` 汙點
（如果 Pod 尚未容忍 `node.kubernetes.io/not-ready：NoExecute` 和
`node.kubernetes.io/unreachable：NoExecute` 汙點的話）。
`default-not-ready-toleration-seconds` 和 `default-unreachable-toleration-seconds`
的預設值是 5 分鐘。

### DenyEscalatingExec {#denyescalatingexec}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
This admission controller will deny exec and attach commands to pods that run with escalated privileges that
allow host access.  This includes pods that run as privileged, have access to the host IPC namespace, and
have access to the host PID namespace.
-->
此准入控制器將拒絕在由於擁有提級特權而具備訪問宿主機能力的 Pod 中執行 exec 和
attach 命令。這類 Pod 包括在特權模式執行的 Pod、可以訪問主機 IPC 名字空間的 Pod、
和訪問主機 PID 名字空間的 Pod。

<!--
The DenyEscalatingExec admission plugin is deprecated.

Use of a policy-based admission plugin (like [PodSecurityPolicy](#podsecuritypolicy) or a custom admission plugin)
which can be targeted at specific users or Namespaces and also protects against creation of overly privileged Pods
is recommended instead.
-->
DenyEscalatingExec 准入外掛已被棄用。

建議使用基於策略的准入外掛（例如 [PodSecurityPolicy](#podsecuritypolicy) 和自定義准入外掛），
這類外掛可以針對特定使用者或名字空間，還可以防止建立許可權過高的 Pod。

### DenyExecOnPrivileged {#denyexeconprivileged} 

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
This admission controller will intercept all requests to exec a command in a pod if that pod has a privileged container.
-->
如果一個 Pod 中存在特權容器，該准入控制器將攔截所有在該 Pod 中執行 exec 命令的請求。

<!--
This functionality has been merged into [DenyEscalatingExec](#denyescalatingexec).
The DenyExecOnPrivileged admission plugin is deprecated.
-->
此功能已合併至 [DenyEscalatingExec](#denyescalatingexec)。
而 DenyExecOnPrivileged 准入外掛已被棄用。

<!--
Use of a policy-based admission plugin (like [PodSecurityPolicy](#podsecuritypolicy) or a custom admission plugin)
which can be targeted at specific users or Namespaces and also protects against creation of overly privileged Pods
is recommended instead.
-->
建議使用基於策略的准入外掛（例如 [PodSecurityPolicy](#podsecuritypolicy) 和自定義准入外掛），
這類外掛可以針對特定使用者或名字空間，還可以防止建立許可權過高的 Pod。

### DenyServiceExternalIPs   {#denyserviceexternalips}

<!--
This admission controller rejects all net-new usage of the `Service` field `externalIPs`.  This
feature is very powerful (allows network traffic interception) and not well
controlled by policy.  When enabled, users of the cluster may not create new
Services which use `externalIPs` and may not add new values to `externalIPs` on
existing `Service` objects.  Existing uses of `externalIPs` are not affected,
and users may remove values from `externalIPs` on existing `Service` objects.
-->
此准入控制器拒絕新的 `Service` 中使用欄位 `externalIPs`。
此功能非常強大（允許網路流量攔截），並且無法很好地受策略控制。
啟用後，叢集使用者將無法建立使用 `externalIPs` 的新 `Service`，也無法在現有
`Service` 物件上為 `externalIPs` 新增新值。
`externalIPs` 的現有使用不受影響，使用者可以在現有 `Service` 物件上從
`externalIPs` 中刪除值。

<!--
Most users do not need this feature at all, and cluster admins should consider disabling it.
Clusters that do need to use this feature should consider using some custom policy to manage usage
of it.
-->
大多數使用者根本不需要此特性，叢集管理員應考慮將其禁用。
確實需要使用此特性的叢集應考慮使用一些自定義策略來管理 `externalIPs` 的使用。

### EventRateLimit {#eventratelimit} 

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

<!--
This admission controller mitigates the problem where the API server gets flooded by
event requests. The cluster admin can specify event rate limits by:
-->
此准入控制器緩解了事件請求淹沒 API 伺服器的問題。叢集管理員可以透過以下方式指定事件速率限制：

<!--
* Enabling the `EventRateLimit` admission controller;
* Referencing an `EventRateLimit` configuration file from the file provided to the API
  server's command line flag `--admission-control-config-file`:
-->
* 啟用 `EventRateLimit` 准入控制器；
* 在透過 API 伺服器的命令列標誌 `--admission-control-config-file` 設定的檔案中，
  引用 `EventRateLimit` 配置檔案：

  ```yaml
  apiVersion: apiserver.config.k8s.io/v1
  kind: AdmissionConfiguration
  plugins:
    - name: EventRateLimit
      path: eventconfig.yaml
  ...
  ```

<!--
There are four types of limits that can be specified in the configuration:
-->
可以在配置中指定的限制有四種類型：

<!--
 * `Server`: All event requests received by the API server share a single bucket.
 * `Namespace`: Each namespace has a dedicated bucket.
 * `User`: Each user is allocated a bucket.
 * `SourceAndObject`: A bucket is assigned by each combination of source and
   involved object of the event.
-->
* `Server`: API 伺服器收到的所有事件請求共享一個桶。
* `Namespace`: 每個名字空間都對應一個專用的桶。
* `User`: 為每個使用者分配一個桶。
* `SourceAndObject`: 根據事件的來源和涉及物件的各種組合分配桶。

<!--
Below is a sample `eventconfig.yaml` for such a configuration:
-->
下面是一個針對此配置的 `eventconfig.yaml` 示例：

```yaml
apiVersion: eventratelimit.admission.k8s.io/v1alpha1
kind: Configuration
limits:
  - type: Namespace
    qps: 50
    burst: 100
    cacheSize: 2000
  - type: User
    qps: 10
    burst: 50
```

<!--
See the [EventRateLimit Config API (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
for more details.
-->
詳情請參見
[EventRateLimit 配置 API 文件（v1alpha1）](/zh-cn/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)。

### ExtendedResourceToleration {#extendedresourcetoleration}

<!--
This plug-in facilitates creation of dedicated nodes with extended resources.
If operators want to create dedicated nodes with extended resources (like GPUs, FPGAs etc.), they are expected to
[taint the node](/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases) with the extended resource
name as the key. This admission controller, if enabled, automatically
adds tolerations for such taints to pods requesting extended resources, so users don't have to manually
add these tolerations.
-->
此外掛有助於建立帶有擴充套件資源的專用節點。
如果運維人員想要建立帶有擴充套件資源（如 GPU、FPGA 等）的專用節點，他們應該以擴充套件資源名稱作為鍵名，
[為節點設定汙點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
如果啟用了此准入控制器，會將此類汙點的容忍度自動新增到請求擴充套件資源的 Pod 中，
使用者不必再手動新增這些容忍度。

### ImagePolicyWebhook {#imagepolicywebhook}

<!--
The ImagePolicyWebhook admission controller allows a backend webhook to make admission decisions.
-->
ImagePolicyWebhook 准入控制器允許使用後端 Webhook 做出准入決策。

<!--
#### Configuration File Format
-->
#### 配置檔案格式  {#configuration-file-format}

<!--
ImagePolicyWebhook uses a configuration file to set options for the behavior of the backend.
This file may be json or yaml and has the following format:
-->
ImagePolicyWebhook 使用配置檔案來為後端行為設定選項。該檔案可以是 JSON 或 YAML，
並具有以下格式:

```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # 以秒計的時長，控制批准請求的快取時間
  allowTTL: 50
  # 以秒計的時長，控制拒絕請求的快取時間
  denyTTL: 50
  # 以毫秒計的時長，控制重試間隔
  retryBackoff: 500
  # 確定 Webhook 後端失效時的行為
  defaultAllow: true
```

<!--
Reference the ImagePolicyWebhook configuration file from the file provided to the API server's command line flag `--admission-control-config-file`:
-->
在透過命令列標誌 `--admission-control-config-file` 為 API 伺服器提供的檔案中，
引用 ImagePolicyWebhook 配置檔案：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  path: imagepolicyconfig.yaml
...
```

<!--
Alternatively, you can embed the configuration directly in the file:
-->
或者，你也可以直接將配置嵌入到該檔案中：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  configuration:
    imagePolicy:
      kubeConfigFile: <kubeconfig 檔案路徑>
      allowTTL: 50
      denyTTL: 50
      retryBackoff: 500
      defaultAllow: true
```

<!--
The ImagePolicyWebhook config file must reference a
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
formatted file which sets up the connection to the backend.
It is required that the backend communicate over TLS.
-->
ImagePolicyWebhook 的配置檔案必須引用
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
格式的檔案；該檔案用來設定與後端的連線。要求後端使用 TLS 進行通訊。

<!--
The kubeconfig file's `cluster` field must point to the remote service, and the `user` field
must contain the returned authorizer.
-->
kubeconfig 檔案的 `clusters` 欄位需要指向遠端服務，`users` 欄位需要包含已返回的授權者。

<!--
```yaml
# clusters refers to the remote service.
clusters:
- name: name-of-remote-imagepolicy-service
  cluster:
    certificate-authority: /path/to/ca.pem    # CA for verifying the remote service.
    server: https://images.example.com/policy # URL of remote service to query. Must use 'https'.

# users refers to the API server's webhook configuration.
users:
- name: name-of-api-server
  user:
    client-certificate: /path/to/cert.pem # cert for the webhook admission controller to use
    client-key: /path/to/key.pem          # key matching the cert
```
-->

```yaml
# clusters 指的是遠端服務。
clusters:
- name: name-of-remote-imagepolicy-service
  cluster:
    certificate-authority: /path/to/ca.pem    # CA 用於驗證遠端服務
    server: https://images.example.com/policy # 要查詢的遠端服務的 URL，必須是 'https'。

# users 指的是 API 伺服器的 Webhook 配置。
users:
- name: name-of-api-server
  user:
    client-certificate: /path/to/cert.pem # Webhook 准入控制器使用的證書
    client-key: /path/to/key.pem          # 證書匹配的金鑰
```

<!--
For additional HTTP configuration, refer to the
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation.
-->
關於 HTTP 配置的更多資訊，請參閱
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
文件。

<!--
#### Request payloads
-->
#### 請求載荷

<!--
When faced with an admission decision, the API Server POSTs a JSON serialized
`imagepolicy.k8s.io/v1alpha1` `ImageReview` object describing the action.
This object contains fields describing the containers being admitted, as well as
any pod annotations that match `*.image-policy.k8s.io/*`.
-->
當面對一個准入決策時，API 伺服器傳送一個描述操作的 JSON 序列化的
`imagepolicy.k8s.io/v1alpha1` `ImageReview` 物件。
該物件包含描述被准入容器的欄位，以及與 `*.image-policy.k8s.io/*` 匹配的所有 Pod 註解。

{{ note }}
<!--
The webhook API objects are subject to the same versioning compatibility rules
as other Kubernetes API objects. Implementers should be aware of looser compatibility
promises for alpha objects and check the `apiVersion` field of the request to
ensure correct deserialization.
Additionally, the API Server must enable the `imagepolicy.k8s.io/v1alpha1` API extensions
group (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).
-->
注意，Webhook API 物件與其他 Kubernetes API 物件一樣受制於相同的版本控制相容性規則。
實現者應該知道對 alpha 物件相容性是相對寬鬆的，並檢查請求的 "apiVersion" 欄位，
以確保正確的反序列化。
此外，API 伺服器必須啟用 `imagepolicy.k8s.io/v1alpha1` API 擴充套件組
（`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`）。
{{ /note }}

<!--
An example request body:
-->
請求載荷示例：

```json
{
  "apiVersion":"imagepolicy.k8s.io/v1alpha1",
  "kind":"ImageReview",
  "spec":{
    "containers":[
      {
        "image":"myrepo/myimage:v1"
      },
      {
        "image":"myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations":{
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace":"mynamespace"
  }
}
```

<!--
The remote service is expected to fill the `ImageReviewStatus` field of the request and
respond to either allow or disallow access. The response body's `spec` field is ignored and
may be omitted. A permissive response would return:
-->
遠端服務將填充請求的 `ImageReviewStatus` 欄位，並返回允許或不允許訪問的響應。
響應體的 `spec` 欄位會被忽略，並且可以被省略。一個允許訪問應答會返回：

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": true
  }
}
```

<!--
To disallow access, the service would return:
-->
若不允許訪問，服務將返回：

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": false,
    "reason": "image currently blacklisted"
  }
}
```

<!--
For further documentation refer to the
[`imagepolicy.v1alpha1` API](/docs/reference/config-api/imagepolicy.v1alpha1/).
-->
更多的文件，請參閱 [`imagepolicy.v1alpha1` API](/zh-cn/docs/reference/config-api/imagepolicy.v1alpha1/)。

<!--
#### Extending with Annotations
-->
#### 使用註解進行擴充套件  {#extending-with-annotations}

<!--
All annotations on a Pod that match `*.image-policy.k8s.io/*` are sent to the webhook.
Sending annotations allows users who are aware of the image policy backend to
send extra information to it, and for different backends implementations to
accept different information.
-->
一個 Pod 中匹配 `*.image-policy.k8s.io/*` 的註解都會被髮送給 Webhook。
這樣做使得了解後端映象策略的使用者可以向它傳送額外的資訊，
並讓不同的後端實現接收不同的資訊。

<!--
Examples of information you might put here are:
-->
你可以在這裡輸入的資訊有：

<!--
* request to "break glass" to override a policy, in case of emergency.
* a ticket number from a ticket system that documents the break-glass request
* provide a hint to the policy server as to the imageID of the image being provided, to save it a lookup
-->
* 在緊急情況下，請求破例覆蓋某個策略。
* 從一個記錄了破例的請求的工單（Ticket）系統得到的一個工單號碼。
* 向策略伺服器提供提示資訊，用於提供映象的 imageID，以方便它進行查詢。

<!--
In any case, the annotations are provided by the user and are not validated by Kubernetes in any way.
-->
在任何情況下，註解都是由使用者提供的，並不會被 Kubernetes 以任何方式進行驗證。

### LimitPodHardAntiAffinityTopology   {#limitpodhardantiaffinitytopology}

<!--
This admission controller denies any pod that defines `AntiAffinity` topology key other than
`kubernetes.io/hostname` in `requiredDuringSchedulingRequiredDuringExecution`.
-->
此准入控制器拒絕定義了 `AntiAffinity` 拓撲鍵的任何 Pod
（`requiredDuringSchedulingRequiredDuringExecution` 中的 `kubernetes.io/hostname` 除外）。

### LimitRanger {#limitranger}

<!--
This admission controller will observe the incoming request and ensure that it does not violate
any of the constraints enumerated in the `LimitRange` object in a `Namespace`.  If you are using
`LimitRange` objects in your Kubernetes deployment, you MUST use this admission controller to
enforce those constraints. LimitRanger can also be used to apply default resource requests to Pods
that don't specify any; currently, the default LimitRanger applies a 0.1 CPU requirement to all
Pods in the `default` namespace.
-->
此准入控制器會監測傳入的請求，並確保請求不會違反 `Namespace` 中 `LimitRange` 物件所設定的任何約束。
如果你在 Kubernetes 部署中使用了 `LimitRange` 物件，則必須使用此准入控制器來執行這些約束。
LimitRanger 還可以用於將預設資源請求應用到沒有設定資源約束的 Pod；
當前，預設的 LimitRanger 對 `default` 名字空間中的所有 Pod 都設定 0.1 CPU 的需求。

<!--
See the [LimitRange API reference](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
and the [example of LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
for more details.
-->
請檢視
[limitRange API 文件](/zh-cn/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)和
[LimitRange 例子](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)以瞭解更多細節。

### MutatingAdmissionWebhook {#mutatingadmissionwebhook}

<!--
This admission controller calls any mutating webhooks which match the request. Matching
webhooks are called in serial; each one may modify the object if it desires.

This admission controller (as implied by the name) only runs in the mutating phase.
-->
此准入控制器呼叫任何與請求匹配的變更（Mutating） Webhook。匹配的 Webhook 將被順序呼叫。
每一個 Webhook 都可以自由修改物件。

`MutatingAdmissionWebhook`，顧名思義，僅在變更階段執行。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or validating admission controllers will permit the request to finish.
-->
如果由此准入控制器呼叫的 Webhook 有副作用（如：減少配額），
則它 **必須** 具有協調系統，因為不能保證後續的 Webhook 和驗證准入控制器都會允許完成請求。

<!--
If you disable the MutatingAdmissionWebhook, you must also disable the
`MutatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag, both are on by default.
-->
如果你禁用了 MutatingAdmissionWebhook，那麼還必須使用 `--runtime-config` 標誌禁止
`admissionregistration.k8s.io/v1` 組/版本中的 `MutatingWebhookConfiguration`，
二者都是預設啟用的。

<!--
#### Use caution when authoring and installing mutating webhooks
-->
#### 謹慎編寫和安裝變更 webhook  {#use-caution-when-authoring-and-installing-mutating-webhooks}

<!--
* Users may be confused when the objects they try to create are different from
  what they get back.
* Built in control loops may break when the objects they try to create are
  different when read back.
  * Setting originally unset fields is less likely to cause problems than
    overwriting fields set in the original request. Avoid doing the latter.
* Future changes to control loops for built-in resources or third-party resources
  may break webhooks that work well today. Even when the webhook installation API
  is finalized, not all possible webhook behaviors will be guaranteed to be supported
  indefinitely.
-->
* 當用戶嘗試建立的物件與返回的物件不同時，使用者可能會感到困惑。
* 當他們讀回的物件與嘗試建立的物件不同，內建的控制迴路可能會出問題。
  * 與覆蓋原始請求中設定的欄位相比，使用原始請求未設定的欄位會引起問題的可能性較小。
    應儘量避免覆蓋原始請求中的欄位設定。
* 內建資源和第三方資源的控制迴路未來可能會出現破壞性的變更，使現在執行良好的 Webhook
  無法再正常執行。即使完成了 Webhook API 安裝，也不代表該 Webhook 會被提供無限期的支援。

### NamespaceAutoProvision {#namespaceautoprovision}

<!--
This admission controller examines all incoming requests on namespaced resources and checks
if the referenced namespace does exist.
It creates a namespace if it cannot be found.
This admission controller is useful in deployments that do not want to restrict creation of
a namespace prior to its usage.
-->
此准入控制器會檢查針對名字空間域資源的所有傳入請求，並檢查所引用的名字空間是否確實存在。
如果找不到所引用的名字空間，控制器將建立一個名字空間。
此准入控制器對於不想要求名字空間必須先建立後使用的叢集部署很有用。

### NamespaceExists {#namespaceexists}

<!--
This admission controller checks all requests on namespaced resources other than `Namespace` itself.
If the namespace referenced from a request doesn't exist, the request is rejected.
-->
此准入控制器檢查針對名字空間作用域的資源（除 `Namespace` 自身）的所有請求。
如果請求引用的名字空間不存在，則拒絕該請求。

### NamespaceLifecycle {#namespacelifecycle}

<!--
This admission controller enforces that a `Namespace` that is undergoing termination cannot have
new objects created in it, and ensures that requests in a non-existent `Namespace` are rejected.
This admission controller also prevents deletion of three system reserved namespaces `default`,
`kube-system`, `kube-public`.
-->
該准入控制器禁止在一個正在被終止的 `Namespace` 中建立新物件，並確保針對不存在的
`Namespace` 的請求被拒絕。
該准入控制器還會禁止刪除三個系統保留的名字空間，即 `default`、
`kube-system` 和 `kube-public`。

<!--
A `Namespace` deletion kicks off a sequence of operations that remove all objects (pods, services,
etc.) in that namespace.  In order to enforce integrity of that process, we strongly recommend
running this admission controller.
-->
`Namespace` 的刪除操作會觸發一系列刪除該名字空間中所有物件（Pod、Service 等）的操作。
為了確保這個過程的完整性，我們強烈建議啟用這個准入控制器。

### NodeRestriction {#noderestriction}

<!--
This admission controller limits the `Node` and `Pod` objects a kubelet can modify. In order to be limited by this admission controller,
kubelets must use credentials in the `system:nodes` group, with a username in the form `system:node:<nodeName>`.
Such kubelets will only be allowed to modify their own `Node` API object, and only modify `Pod` API objects that are bound to their node.
-->
該准入控制器限制了某 kubelet 可以修改的 `Node` 和 `Pod` 物件。
為了受到這個准入控制器的限制，kubelet 必須使用在 `system:nodes` 組中的憑證，
並使用 `system:node:<nodeName>` 形式的使用者名稱。
這樣，kubelet 只可修改自己的 `Node` API 物件，只能修改繫結到自身節點的 Pod 物件。

<!--
kubelets are not allowed to update or remove taints from their `Node` API object.

The `NodeRestriction` admission plugin prevents kubelets from deleting their `Node` API object,
and enforces kubelet modification of labels under the `kubernetes.io/` or `k8s.io/` prefixes as follows:
-->
不允許 kubelet 更新或刪除 `Node` API 物件的汙點。

`NodeRestriction` 准入外掛可防止 kubelet 刪除其 `Node` API 物件，
並對字首為 `kubernetes.io/` 或 `k8s.io/` 的標籤的修改對 kubelet 作如下限制：

<!--
* **Prevents** kubelets from adding/removing/updating labels with a `node-restriction.kubernetes.io/` prefix.
  This label prefix is reserved for administrators to label their `Node` objects for workload isolation purposes,
  and kubelets will not be allowed to modify labels with that prefix.
* **Allows** kubelets to add/remove/update these labels and label prefixes:
-->
* **禁止** kubelet 新增、刪除或更新字首為 `node-restriction.kubernetes.io/` 的標籤。
  這類字首的標籤時保留給管理員的，用以為 `Node` 物件設定標籤以隔離工作負載，而不允許 kubelet
  修改帶有該字首的標籤。
* **允許** kubelet 新增、刪除、更新以下標籤：
  * `kubernetes.io/hostname`
  * `kubernetes.io/arch`
  * `kubernetes.io/os`
  * `beta.kubernetes.io/instance-type`
  * `node.kubernetes.io/instance-type`
  * `failure-domain.beta.kubernetes.io/region` （已棄用）
  * `failure-domain.beta.kubernetes.io/zone` （已棄用）
  * `topology.kubernetes.io/region`
  * `topology.kubernetes.io/zone`
  * `kubelet.kubernetes.io/` 為字首的標籤
  * `node.kubernetes.io/` 為字首的標籤

<!--
Use of any other labels under the `kubernetes.io` or `k8s.io` prefixes by kubelets is reserved,
and may be disallowed or allowed by the `NodeRestriction` admission plugin in the future.

Future versions may add additional restrictions to ensure kubelets have the minimal set of
permissions required to operate correctly.
-->
以 `kubernetes.io` 或 `k8s.io` 為字首的所有其他標籤都限制 kubelet 使用，並且將來可能會被
`NodeRestriction` 准入外掛允許或禁止。

將來的版本可能會增加其他限制，以確保 kubelet 具有正常執行所需的最小許可權集。

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

<!--
This admission controller protects the access to the `metadata.ownerReferences` of an object
so that only users with "delete" permission to the object can change it.
This admission controller also protects the access to `metadata.ownerReferences[x].blockOwnerDeletion`
of an object, so that only users with "update" permission to the `finalizers`
subresource of the referenced *owner* can change it.
-->
此准入控制器保護對物件的 `metadata.ownerReferences` 的訪問，以便只有對該物件具有
“delete” 許可權的使用者才能對其進行更改。
該准入控制器還保護對 `metadata.ownerReferences[x].blockOwnerDeletion` 物件的訪問，
以便只有對所引用的 **屬主（owner）** 的 `finalizers` 子資源具有 “update” 
許可權的使用者才能對其進行更改。

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
This admission controller implements additional validations for checking incoming
`PersistentVolumeClaim` resize requests.
-->
此准入控制器檢查傳入的 `PersistentVolumeClaim` 調整大小請求，對其執行額外的驗證檢查操作。

<!--
Enabling the `PersistentVolumeClaimResize` admission controller is recommended.
This admission controller prevents resizing of all claims by default unless a claim's `StorageClass`
 explicitly enables resizing by setting `allowVolumeExpansion` to `true`.

For example: all `PersistentVolumeClaim`s created from the following `StorageClass` support volume expansion:
-->
建議啟用 `PersistentVolumeClaimResize` 准入控制器。除非 PVC 的 `StorageClass` 明確地將
`allowVolumeExpansion` 設定為 `true` 來顯式啟用調整大小。
否則，預設情況下該准入控制器會阻止所有對 PVC 大小的調整。

例如：由以下 `StorageClass` 建立的所有 `PersistentVolumeClaim` 都支援卷容量擴充：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

<!--
For more information about persistent volume claims, see [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
-->
關於持久化卷申領的更多資訊，請參見
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。

### PersistentVolumeLabel {#persistentvolumelabel} 

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
This admission controller automatically attaches region or zone labels to PersistentVolumes
as defined by the cloud provider (for example, GCE or AWS).
It helps ensure the Pods and the PersistentVolumes mounted are in the same
region and/or zone.
If the admission controller doesn't support automatic labelling your PersistentVolumes, you
may need to add the labels manually to prevent pods from mounting volumes from
a different zone. PersistentVolumeLabel is DEPRECATED and labeling persistent volumes has been taken over by
the {{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}.
Starting from 1.11, this admission controller is disabled by default.
-->
此准入控制器會自動將由雲提供商（如 GCE、AWS）定義的區（region）或區域（zone）
標籤附加到 PersistentVolume 上。這有助於確保 Pod 和 PersistentVolume 位於相同的區或區域。
如果准入控制器不支援為 PersistentVolumes 自動新增標籤，那你可能需要手動新增標籤，
以防止 Pod 掛載其他區域的卷。
PersistentVolumeLabel 已被棄用，為持久卷新增標籤的操作已由
{{< glossary_tooltip text="雲管理控制器" term_id="cloud-controller-manager" >}}接管。
從 1.11 開始，預設情況下禁用此准入控制器。

### PodNodeSelector {#podnodeselector}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

<!--
This admission controller defaults and limits what node selectors may be used within a namespace
by reading a namespace annotation and a global configuration.
-->
此准入控制器透過讀取名字空間註解和全域性配置，來為名字空間中可以使用的節點選擇器設定預設值並實施限制。

<!--
#### Configuration file format

`PodNodeSelector` uses a configuration file to set options for the behavior of the backend.
Note that the configuration file format will move to a versioned file in a future release.
This file may be json or yaml and has the following format:
-->
#### 配置檔案格式    {#configuration-file-format-podnodeselector}

`PodNodeSelector` 使用配置檔案來設定後端行為的選項。請注意，配置檔案格式將在將來某個版本中改為版本化檔案。
該檔案可以是 JSON 或 YAML，格式如下：

```yaml
podNodeSelectorPluginConfig:
  clusterDefaultNodeSelector: name-of-node-selector
  namespace1: name-of-node-selector
  namespace2: name-of-node-selector
```

<!--
Reference the `PodNodeSelector` configuration file from the file provided to the API server's
command line flag `--admission-control-config-file`:
-->
透過 API 伺服器命令列標誌 `--admission-control-config-file` 為 API 伺服器提供的檔案中，
需要引用 `PodNodeSelector` 配置檔案：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: PodNodeSelector
    path: podnodeselector.yaml
...
```

<!--
#### Configuration Annotation Format

`PodNodeSelector` uses the annotation key `scheduler.alpha.kubernetes.io/node-selector` to assign
node selectors to namespaces.
-->
#### 配置註解格式   {#configuration-annotation-format}

`PodNodeSelector` 使用鍵為 `scheduler.alpha.kubernetes.io/node-selector`
的註解為名字空間設定節點選擇算符。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/node-selector: name-of-node-selector
  name: namespace3
```

<!--
#### Internal Behavior

This admission controller has the following behavior:
-->
#### 內部行為   {#internal-behavior}

此准入控制器行為如下：

<!--
1. If the `Namespace` has an annotation with a key `scheduler.alpha.kubernetes.io/node-selector`,
   use its value as the node selector.
2. If the namespace lacks such an annotation, use the `clusterDefaultNodeSelector` defined in the
   `PodNodeSelector` plugin configuration file as the node selector.
3. Evaluate the pod's node selector against the namespace node selector for conflicts. Conflicts
   result in rejection.
4. Evaluate the pod's node selector against the namespace-specific allowed selector defined the
   plugin configuration file. Conflicts result in rejection.
-->
1. 如果 `Namespace` 的註解帶有鍵 `scheduler.alpha.kubernetes.io/node-selector`，
   則將其值用作節點選擇算符。
2. 如果名字空間缺少此類註解，則使用 `PodNodeSelector` 外掛配置檔案中定義的
   `clusterDefaultNodeSelector` 作為節點選擇算符。
3. 評估 Pod 節點選擇算符和名字空間節點選擇算符是否存在衝突。存在衝突將拒絕 Pod。
4. 評估 Pod 節點選擇算符和特定於名字空間的被允許的選擇算符所定義的外掛配置檔案是否存在衝突。
   存在衝突將導致拒絕 Pod。

{{< note >}}
<!--
PodNodeSelector allows forcing pods to run on specifically labeled nodes. Also see the PodTolerationRestriction
admission plugin, which allows preventing pods from running on specifically tainted nodes.
-->
PodNodeSelector 允許 Pod 強制在特定標籤的節點上執行。
另請參閱 PodTolerationRestriction 准入外掛，該外掛可防止 Pod 在特定汙點的節點上執行。
{{< /note >}}

### PodSecurity {#podsecurity}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

<!--
This is the replacement for the deprecated [PodSecurityPolicy](#podsecuritypolicy) admission controller
defined in the next section. This admission controller acts on creation and modification of the pod and
determines if it should be admitted based on the requested security context and the 
[Pod Security Standards](/docs/concepts/security/pod-security-standards/).

See the [Pod Security Admission documentation](/docs/concepts/security/pod-security-admission/)
for more information.
-->
這是下節所討論的已被廢棄的 [PodSecurityPolicy](#podsecuritypolicy) 准入控制器的替代品。
此准入控制器負責在建立和修改 Pod 時，根據請求的安全上下文和
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)
來確定是否可以執行請求。

更多資訊請參閱 [Pod 安全性准入控制器](/zh-cn/docs/concepts/security/pod-security-admission/)。

### PodSecurityPolicy {#podsecuritypolicy}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

<!--
This admission controller acts on creation and modification of the pod and determines if it should be admitted
based on the requested security context and the available Pod Security Policies.
-->
此准入控制器負責在建立和修改 Pod 時根據請求的安全上下文和可用的 Pod
安全策略確定是否可以執行請求。

<!--
See also the [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) documentation
for more information.
-->
檢視 [Pod 安全策略文件](/zh-cn/docs/concepts/security/pod-security-policy/)
進一步瞭解其間細節。

### PodTolerationRestriction {#podtolerationrestriction}

{{< feature-state for_k8s_version="v1.7" state="alpha" >}}

<!--
The PodTolerationRestriction admission controller verifies any conflict between tolerations of a
pod and the tolerations of its namespace.
It rejects the pod request if there is a conflict.
It then merges the tolerations annotated on the namespace into the tolerations of the pod.
The resulting tolerations are checked against a list of allowed tolerations annotated to the namespace.
If the check succeeds, the pod request is admitted otherwise it is rejected.
-->
准入控制器 PodTolerationRestriction 檢查 Pod 的容忍度與其名字空間的容忍度之間是否存在衝突。
如果存在衝突，則拒絕 Pod 請求。
控制器接下來會將名字空間的容忍度合併到 Pod 的容忍度中，
根據名字空間的容忍度白名單檢查所得到的容忍度結果。
如果檢查成功，則將接受 Pod 請求，否則拒絕該請求。

<!--
If the namespace of the pod does not have any associated default tolerations or allowed
tolerations annotated, the cluster-level default tolerations or cluster-level list of allowed tolerations are used
instead if they are specified.
-->
如果 Pod 的名字空間沒有任何關聯的預設容忍度或容忍度白名單，
則使用叢集級別的預設容忍度或容忍度白名單（如果有的話）。

<!--
Tolerations to a namespace are assigned via the `scheduler.alpha.kubernetes.io/defaultTolerations` annotation key.
The list of allowed tolerations can be added via the `scheduler.alpha.kubernetes.io/tolerationsWhitelist` annotation key.

Example for namespace annotations:
-->
名字空間的容忍度透過註解鍵 `scheduler.alpha.kubernetes.io/defaultTolerations`
來設定。可接受的容忍度可以透過 `scheduler.alpha.kubernetes.io/tolerationsWhitelist`
註解鍵來新增。

名字空間註解的示例：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: apps-that-need-nodes-exclusively
  annotations:
    scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
    scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
```

<!--
### Priority {#priority}

The priority admission controller uses the `priorityClassName` field and populates the integer
value of the priority.
If the priority class is not found, the Pod is rejected.
-->
### 優先順序 {#priority}

優先順序准入控制器使用 `priorityClassName` 欄位並用整型值填充優先順序。
如果找不到優先順序，則拒絕 Pod。

### ResourceQuota {#resourcequota}

<!--
This admission controller will observe the incoming request and ensure that it does not violate
any of the constraints enumerated in the `ResourceQuota` object in a `Namespace`.  If you are
using `ResourceQuota` objects in your Kubernetes deployment, you MUST use this admission
controller to enforce quota constraints.
-->
此准入控制器會監測傳入的請求，並確保它不違反任何一個 `Namespace` 中的 `ResourceQuota`
物件中列舉的約束。如果你在 Kubernetes 部署中使用了 `ResourceQuota`，
則必須使用這個准入控制器來強制執行配額限制。

<!--
See the [ResourceQuota API reference](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
and the [example of Resource Quota](/docs/concepts/policy/resource-quotas/) for more details.
-->
請參閱
[resourceQuota API 參考](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
和 [Resource Quota 例子](/zh-cn/docs/concepts/policy/resource-quotas/)瞭解更多細節。


<!--
### RuntimeClass {#runtimeclass}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

If you define a RuntimeClass with [Pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
configured, this admission controller checks incoming Pods.
When enabled, this admission controller rejects any Pod create requests
that have the overhead already set.
For Pods that have a RuntimeClass configured and selected in their `.spec`,
this admission controller sets `.spec.overhead` in the Pod based on the value
defined in the corresponding RuntimeClass.

See also [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
for more information.
-->
### RuntimeClass {#runtimeclass}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

如果你所定義的 RuntimeClass 包含 [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)，
這個准入控制器會檢查新的 Pod。被啟用後，此准入控制器會拒絕所有已經設定了 overhead 欄位的 Pod 建立請求。
對於配置了 RuntimeClass 並在其 `.spec` 中選定 RuntimeClass 的 Pod，
此准入控制器會根據相應 RuntimeClass 中定義的值為 Pod 設定 `.spec.overhead`。

詳情請參見 [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)。

### SecurityContextDeny {#securitycontextdeny}

<!--
This admission controller will deny any Pod that attempts to set certain escalating
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
fields, as shown in the
[Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
task.
If you don't use [Pod Security admission](/docs/concepts/security/pod-security-admission/),
[PodSecurityPolicies](/docs/concepts/security/pod-security-policy/), nor any external enforcement mechanism,
then you could use this admission controller to restrict the set of values a security context can take.

See [Pod Security Standards](/docs/concepts/security/pod-security-standards/) for more context on restricting
pod privileges.
-->
此准入控制器將拒絕任何試圖設定特定提升
[SecurityContext](/zh-cn/docs/tasks/configure-pod-container/security-context/)
中某些欄位的 Pod，正如任務[為 Pod 或 Container 配置安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)
中所展示的那樣。如果叢集沒有使用
[Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)、
[PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)，
也沒有任何外部強制機制，那麼你可以使用此准入控制器來限制安全上下文所能獲取的值集。

有關限制 Pod 許可權的更多內容，請參閱 
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)。

### ServiceAccount {#serviceaccount}

<!--
This admission controller implements automation for
[serviceAccounts](/docs/tasks/configure-pod-container/configure-service-account/).
We strongly recommend using this admission controller if you intend to make use of Kubernetes
`ServiceAccount` objects.
-->
此准入控制器實現了
[ServiceAccount](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
的自動化。
如果你打算使用 Kubernetes 的 ServiceAccount 物件，我們強烈建議你使用這個准入控制器。

### StorageObjectInUseProtection   {#storageobjectinuseprotection}

<!--
The `StorageObjectInUseProtection` plugin adds the `kubernetes.io/pvc-protection` or `kubernetes.io/pv-protection`
finalizers to newly created Persistent Volume Claims (PVCs) or Persistent Volumes (PV).
In case a user deletes a PVC or PV the PVC or PV is not removed until the finalizer is removed
from the PVC or PV by PVC or PV Protection Controller.
Refer to the
[Storage Object in Use Protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)
for more detailed information.
-->
`StorageObjectInUseProtection` 外掛將 `kubernetes.io/pvc-protection` 或
`kubernetes.io/pv-protection` finalizers 新增到新建立的持久卷申領（PVC）
或持久卷（PV）中。如果使用者嘗試刪除 PVC/PV，除非 PVC/PV 的保護控制器移除 finalizers，
否則 PVC/PV 不會被刪除。有關更多詳細資訊，請參考
[保護使用中的儲存物件](/zh-cn/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)。

### TaintNodesByCondition {#taintnodesbycondition}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

<!--
This admission controller {{< glossary_tooltip text="taints" term_id="taint" >}} newly created
Nodes as `NotReady` and `NoSchedule`. That tainting avoids a race condition that could cause Pods
to be scheduled on new Nodes before their taints were updated to accurately reflect their reported
conditions.
-->
該准入控制器為新建立的節點新增 `NotReady` 和 `NoSchedule` {{< glossary_tooltip text="汙點" term_id="taint" >}}。
這些汙點能夠避免一些競態條件的發生，而這類競態條件可能導致 Pod
在更新節點汙點以準確反映其所報告狀況之前，就被排程到新節點上。

### ValidatingAdmissionWebhook {#validatingadmissionwebhook} 

<!--
This admission controller calls any validating webhooks which match the request. Matching
webhooks are called in parallel; if any of them rejects the request, the request
fails. This admission controller only runs in the validation phase; the webhooks it calls may not
mutate the object, as opposed to the webhooks called by the `MutatingAdmissionWebhook` admission controller.
-->
此准入控制器呼叫與請求匹配的所有驗證性 Webhook。
匹配的 Webhook 將被並行呼叫。如果其中任何一個拒絕請求，則整個請求將失敗。
該准入控制器僅在驗證（Validating）階段執行；與 `MutatingAdmissionWebhook`
准入控制器所呼叫的 Webhook 相反，它呼叫的 Webhook 不可以變更物件。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or other validating admission controllers will permit the request to finish.
-->
如果以此方式呼叫的 Webhook 有其它副作用（如：減少配額），則它必須具有協調機制。
這是因為無法保證後續的 Webhook 或其他驗證性准入控制器都允許請求完成。

<!--
If you disable the ValidatingAdmissionWebhook, you must also disable the
`ValidatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag (both are on by default in
versions 1.9 and later).
-->
如果你禁用了 ValidatingAdmissionWebhook，還必須透過 `--runtime-config` 標誌來禁用
`admissionregistration.k8s.io/v1` 組/版本中的 `ValidatingWebhookConfiguration`
物件（預設情況下在 v1.9 和更高版本中均處於啟用狀態）。

<!--
## Is there a recommended set of admission controllers to use?

Yes. The recommended admission controllers are enabled by default
(shown [here](/docs/reference/command-line-tools-reference/kube-apiserver/#options)),
so you do not need to explicitly specify them.
You can enable additional admission controllers beyond the default set using the
`--enable-admission-plugins` flag (**order doesn't matter**).
-->
## 有推薦的准入控制器嗎？

有。推薦使用的准入控制器預設情況下都處於啟用狀態
（請檢視[這裡](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/#options)）。
因此，你無需顯式指定它們。
你可以使用 `--enable-admission-plugins` 標誌（ **順序不重要** ）來啟用預設設定以外的其他准入控制器。

