---
title: Kubernetes 中的准入控制
linkTitle: 准入控制
content_type: concept
weight: 40
---
<!--
reviewers:
- lavalamp
- davidopp
- derekwaynecarr
- erictune
- janetkuo
- thockin
title: Admission Control in Kubernetes
linkTitle: Admission Control
content_type: concept
weight: 40
-->

<!-- overview -->
<!--
This page provides an overview of _admission controllers_.
-->
此頁面提供**准入控制器（Admission Controller）** 的概述。

<!--
An admission controller is a piece of code that intercepts requests to the
Kubernetes API server prior to persistence of the resource, but after the request
is authenticated and authorized.

Several important features of Kubernetes require an admission controller to be enabled in order
to properly support the feature.  As a result, a Kubernetes API server that is not properly
configured with the right set of admission controllers is an incomplete server that will not
support all the features you expect.
-->
准入控制器是一段代碼，它會在請求通過認證和鑑權之後、對象被持久化之前攔截到達 API 伺服器的請求。

Kubernetes 的若干重要功能都要求啓用一個准入控制器，以便正確地支持該特性。
因此，沒有正確設定准入控制器的 Kubernetes API 伺服器是不完整的，它無法支持你所期望的所有特性。

<!-- body -->

<!--
## What are they?
-->
## 什麼是准入控制插件？  {#what-are-they}

<!--
Admission controllers are code within the Kubernetes
{{< glossary_tooltip term_id="kube-apiserver" text="API server" >}} that check the
data arriving in a request to modify a resource.

Admission controllers apply to requests that create, delete, or modify objects.
Admission controllers can also block custom verbs, such as a request to connect to a
pod via an API server proxy. Admission controllers do _not_ (and cannot) block requests
to read (**get**, **watch** or **list**) objects, because reads bypass the admission
control layer.
-->
准入控制器是 Kubernetes
{{< glossary_tooltip term_id="kube-apiserver" text="API 伺服器" >}}中的代碼，
用於檢查請求中到達的數據，以修改資源。

准入控制器適用於創建、刪除或修改對象的請求。
准入控制器也可以阻止自定義動作，例如通過 API 伺服器代理連接到 Pod 的請求。
准入控制器**不會**（也不能）阻止讀取（**get**、**watch** 或 **list**）對象的請求，
這是因爲讀取操作會繞過准入控制層。

<!--
Admission control mechanisms may be _validating_, _mutating_, or both. Mutating
controllers may modify the data for the resource being modified; validating controllers may not.

The admission controllers in Kubernetes {{< skew currentVersion >}} consist of the
[list](#what-does-each-admission-controller-do) below, are compiled into the
`kube-apiserver` binary, and may only be configured by the cluster
administrator.
-->
准入控制器機制可以執行**驗證（Validating）** 和/或**變更（Mutating）** 操作。
變更（Mutating）控制器可以爲正在修改的資源修改數據；驗證（Validating）控制器則不行。

Kubernetes {{< skew currentVersion >}}
中的准入控制器由下面的[列表](#what-does-each-admission-controller-do)組成，
並編譯進 `kube-apiserver` 可執行文件，並且只能由叢集管理員設定。

<!--
### Admission control extension points

Within the full [list](#what-does-each-admission-controller-do), there are three
special controllers:
[MutatingAdmissionWebhook](#mutatingadmissionwebhook),
[ValidatingAdmissionWebhook](#validatingadmissionwebhook), and
[ValidatingAdmissionPolicy](#validatingadmissionpolicy).
The two webhook controllers execute the mutating and validating (respectively)
[admission control webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
which are configured in the API. ValidatingAdmissionPolicy provides a way to embed
declarative validation code within the API, without relying on any external HTTP
callouts.
-->
### 准入控制擴展點   {#admission-control-extension-points}

在完整的[列表](#what-does-each-admission-controller-do)中，有三個特殊的控制器：
[MutatingAdmissionWebhook](#mutatingadmissionwebhook)、
[ValidatingAdmissionWebhook](#validatingadmissionwebhook)
和 [ValidatingAdmissionPolicy](#validatingadmissionpolicy)。
前兩個 Webhook 控制器分別執行在 API
中所設定的變更和驗證[准入控制 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。
而 ValidatingAdmissionPolicy 提供了一種在 API 中嵌入聲明式驗證代碼的方式，無需依賴任何外部 HTTP 調用。

<!--
You can use these three admission controllers to customize cluster behavior at
admission time.
-->
你可以使用這三個准入控制器來定製准入時的叢集行爲。

<!--
## Admission control phases

The admission control process proceeds in two phases. In the first phase,
mutating admission controllers are run. In the second phase, validating
admission controllers are run. Note again that some of the controllers are
both.

If any of the controllers in either phase reject the request, the entire
request is rejected immediately and an error is returned to the end-user.
-->
## 准入控制階段   {#admission-control-phases}

准入控制過程分爲兩個階段。第一階段，運行變更准入控制器。第二階段，運行驗證准入控制器。
再次提醒，某些控制器既是變更准入控制器又是驗證准入控制器。

如果兩個階段之一的任何一個控制器拒絕了某請求，則整個請求將立即被拒絕，並向最終使用者返回錯誤。

<!--
Finally, in addition to sometimes mutating the object in question, admission
controllers may sometimes have side effects, that is, mutate related
resources as part of request processing. Incrementing quota usage is the
canonical example of why this is necessary. Any such side-effect needs a
corresponding reclamation or reconciliation process, as a given admission
controller does not know for sure that a given request will pass all of the
other admission controllers.
-->
最後，除了對對象進行變更外，准入控制器還可能有其它副作用：將相關資源作爲請求處理的一部分進行變更。
增加配額用量就是一個典型的示例，說明了這樣做的必要性。
此類用法都需要相應的回收或回調過程，因爲任一準入控制器都無法確定某個請求能否通過所有其它准入控制器。

<!--
The ordering of these calls can be seen below.
-->
這些調用的順序如下所示。

<!--
Sequence diagram for kube-apiserver handling requests during the admission phase
showing mutation webhooks, followed by validatingadmissionpolicies and finally
validating webhooks. It shows that the continue until the first rejection,
or being accepted by all of them. It also shows that mutations by mutating
webhooks cause all previously called webhooks to be called again.
-->
{{< figure src="/zh-cn/docs/reference/access-authn-authz/admission-control-phases.svg" alt="kube-apiserver 在准入階段處理請求的時序圖，展示了變更性 Webhook，隨後是驗證准入策略（ValidatingAdmissionPolicies），最後是驗證性 Webhook。此時序圖表明，請求會持續經過這些步驟，直到遇到第一個被拒絕的情況，或者被所有檢查接受。此外，此圖還顯示，變更性 Webhook 所做的變更會導致所有之前調用過的 Webhook 被重新調用。" class="diagram-large" link="[https://mermaid.live/edit#pako:eNqtVm1r3DgQ_iuDj9CUc3aPlBa6HIFeSu_CEQhNr4XiL7I9a6srSz5J3mQb9r93RrK9jjcp9-H8xdZoXh7N80jyQ1KYEpNV4vDfDnWB76WorGgynemTE_hLbBG8AYce1kb7W_kdoVImF0rtQDjwtXQgnX7hwaJrsfBYQtmFoNr71q2Wy0r6ussXhWmWDdpGyPLsmxs-l9K5Dt3y1du3v3HJB6mlXz1kia-xwSxZZYnGzluhsiTNkgEETUCWnJ-392SmrwE-2ym4kdYa-67wxjoyedvhPs000NNn_iysFLlCFyPCVJwWHPXHpgq1f3l1_qbA11x77vIJ7_2lUcYGx7taepy5KWPaqRc8l08bj1Rx4ldZ3M2cnlp6pvf7_ckJsxVdibNPkRKiBkEof-YJAZFnQRQFOidzqaTfpSB0Ca42nSohR-jaUjB3uEW7Ay8bDAnKKAfKt4gFKMl7dIWd9uy2b_7ozdU2XY5nopUOLaWEmsopqSuSCTk770gllscBZtmQDKTR0NbCIcO647mm88Kz-Q7z2piNSym1UuaOgOY72AolCTV5jglao2Qh0YXVraUOOj34jYkWcIB_5UNB7pjwAU9BrZaaVNzRWwXTWlrHGv9GEqc6KdASc-SU3NbWR0RUDsyaA5pZBaGcmZYZluY4LA4m8KAQncOQrrW4laZztI6CxlRndKI9Rsz1VlEJqXuS9oMcWmE99aMV2sM_xARv2fA-nn53c8WzfxNtVqOnFrLlNrD3hHfna3bnN1KTisjTr8FgrPwexqMmH4WWzaW3KkSPvF9Sx61RMSA39_Anrcblxho49oLfc3txGZcdGZqxc4z3uu_wl9g7Lj6YoLedupfHcZ9H6dyYAPlgmOC66VX3s_hJ5UmOeW3U5WEzB6bOLi4CEyv4GHcOnOKiWqRQWKQdCwJaU77sCWXHEEAsrKbkkJQD_bQruHlFjcUmmlo6h-My3FCXzy34wCcG6W_eJneQdRABl5t1dwVXems2-LPYOSEH1NemlOsd76_IJ5g8vE7lGjRiieW0V0d4J819TMuI9hGnI9Zn4x5L4IDz439ER3J4CtzQEpCaXVjN6lmg88Y-kef_ATvWJiWRgPisnTDRn92DToLa2JmFyjVcSypCGBTqunDjcALk-5iKJWnSX_z0zxGukMNNT5-lsJtwq5Gf6Ly53ekiXt9pYk1X1clqTScpjeJ91f-tjFYsJd3M1_GXJvzZpAntw6_GDD77H6uICLI](https://mermaid.live/edit#pako:eNqtVm1r3DgQ_iuDj9CUc3aPlBa6HIFeSu_CEQhNr4XiL7I9a6srSz5J3mQb9r93RrK9jjcp9-H8xdZoXh7N80jyQ1KYEpNV4vDfDnWB76WorGgynemTE_hLbBG8AYce1kb7W_kdoVImF0rtQDjwtXQgnX7hwaJrsfBYQtmFoNr71q2Wy0r6ussXhWmWDdpGyPLsmxs-l9K5Dt3y1du3v3HJB6mlXz1kia-xwSxZZYnGzluhsiTNkgEETUCWnJ-392SmrwE-2ym4kdYa-67wxjoyedvhPs000NNn_iysFLlCFyPCVJwWHPXHpgq1f3l1_qbA11x77vIJ7_2lUcYGx7taepy5KWPaqRc8l08bj1Rx4ldZ3M2cnlp6pvf7_ckJsxVdibNPkRKiBkEof-YJAZFnQRQFOidzqaTfpSB0Ca42nSohR-jaUjB3uEW7Ay8bDAnKKAfKt4gFKMl7dIWd9uy2b_7ozdU2XY5nopUOLaWEmsopqSuSCTk770gllscBZtmQDKTR0NbCIcO647mm88Kz-Q7z2piNSym1UuaOgOY72AolCTV5jglao2Qh0YXVraUOOj34jYkWcIB_5UNB7pjwAU9BrZaaVNzRWwXTWlrHGv9GEqc6KdASc-SU3NbWR0RUDsyaA5pZBaGcmZYZluY4LA4m8KAQncOQrrW4laZztI6CxlRndKI9Rsz1VlEJqXuS9oMcWmE99aMV2sM_xARv2fA-nn53c8WzfxNtVqOnFrLlNrD3hHfna3bnN1KTisjTr8FgrPwexqMmH4WWzaW3KkSPvF9Sx61RMSA39_Anrcblxho49oLfc3txGZcdGZqxc4z3uu_wl9g7Lj6YoLedupfHcZ9H6dyYAPlgmOC66VX3s_hJ5UmOeW3U5WEzB6bOLi4CEyv4GHcOnOKiWqRQWKQdCwJaU77sCWXHEEAsrKbkkJQD_bQruHlFjcUmmlo6h-My3FCXzy34wCcG6W_eJneQdRABl5t1dwVXems2-LPYOSEH1NemlOsd76_IJ5g8vE7lGjRiieW0V0d4J819TMuI9hGnI9Zn4x5L4IDz439ER3J4CtzQEpCaXVjN6lmg88Y-kef_ATvWJiWRgPisnTDRn92DToLa2JmFyjVcSypCGBTqunDjcALk-5iKJWnSX_z0zxGukMNNT5-lsJtwq5Gf6Ly53ekiXt9pYk1X1clqTScpjeJ91f-tjFYsJd3M1_GXJvzZpAntw6_GDD77H6uICLI)" >}}

<!--
## Why do I need them?

Several important features of Kubernetes require an admission controller to be enabled in order
to properly support the feature. As a result, a Kubernetes API server that is not properly
configured with the right set of admission controllers is an incomplete server and will not
support all the features you expect.
-->
## 爲什麼需要准入控制器？  {#why-do-i-need-them}

Kubernetes 的多個重要特性需要按順序啓用某個准入控制器才能正確支持對應的特性。
因此，如果 Kubernetes API 伺服器未正確設定相應的准入控制器集，
那麼這種 API 伺服器將是不完整的，並且無法支持你所期望的所有特性。

<!--
## How do I turn on an admission controller?

The Kubernetes API server flag `enable-admission-plugins` takes a comma-delimited list of admission control plugins to invoke prior to modifying objects in the cluster.
For example, the following command line enables the `NamespaceLifecycle` and the `LimitRanger`
admission control plugins:
-->
## 如何啓用一個准入控制器？  {#how-do-i-turn-on-an-admission-controller}

Kubernetes API 伺服器的 `enable-admission-plugins` 標誌接受一個（以逗號分隔的）准入控制插件列表，
這些插件會在叢集修改對象之前被調用。

例如，下面的命令啓用 `NamespaceLifecycle` 和 `LimitRanger` 准入控制插件：

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
根據你 Kubernetes 叢集的部署方式以及 API 伺服器的啓動方式，你可能需要以不同的方式應用設置。
例如，如果將 API 伺服器部署爲 systemd 服務，你可能需要修改 systemd 單元文件；
如果以自託管方式部署 Kubernetes，你可能需要修改 API 伺服器的清單文件。
{{< /note >}}

<!--
## How do I turn off an admission controller?

The Kubernetes API server flag `disable-admission-plugins` takes a comma-delimited list of admission control plugins to be disabled, even if they are in the list of plugins enabled by default.
-->
## 怎麼關閉准入控制器？   {#how-do-i-turn-off-an-admission-controller}

Kubernetes API 伺服器的 `disable-admission-plugins` 標誌，會將傳入的（以逗號分隔的）
准入控制插件列表禁用，即使是默認啓用的插件也會被禁用。

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

<!--
## Which plugins are enabled by default?

To see which admission plugins are enabled:
-->
## 哪些插件是默認啓用的？  {#which-plugins-are-enabled-by-default}

要查看哪些插件是被啓用的：

```shell
kube-apiserver -h | grep enable-admission-plugins
```

<!--
In Kubernetes {{< skew currentVersion >}}, the default ones are:
-->
在 Kubernetes {{< skew currentVersion >}} 中，默認啓用的插件有：

```shell
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, LimitRanger, MutatingAdmissionWebhook, NamespaceLifecycle, PersistentVolumeClaimResize, PodSecurity, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook
```

<!--
## What does each admission controller do?
-->
## 每個准入控制器的作用是什麼？  {#what-does-each-admission-controller-do}

### AlwaysAdmit {#alwaysadmit}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller allows all pods into the cluster. It is **deprecated** because
its behavior is the same as if there were no admission controller at all.
-->
該准入控制器允許所有的 Pod 進入叢集。此插件**已被棄用**，因其行爲與沒有準入控制器一樣。

### AlwaysDeny {#alwaysdeny}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
Rejects all requests. AlwaysDeny is **deprecated** as it has no real meaning.
-->
拒絕所有的請求。由於它沒有實際意義，**已被棄用**。

### AlwaysPullImages {#alwayspullimages}

<!--
This admission controller modifies every new Pod to force the image pull policy to `Always`. This is useful in a
multitenant cluster so that users can be assured that their private images can only be used by those
who have the credentials to pull them. Without this admission controller, once an image has been pulled to a
node, any pod from any user can use it by knowing the image's name (assuming the Pod is
scheduled onto the right node), without any authorization check against the image. When this admission controller
is enabled, images are always pulled prior to starting containers, which means valid credentials are
required.
-->
該准入控制器會修改每個新創建的 Pod，將其映像檔拉取策略設置爲 `Always`。
這在多租戶叢集中是有用的，這樣使用者就可以放心，他們的私有映像檔只能被那些有憑證的人使用。
如果沒有這個准入控制器，一旦映像檔被拉取到節點上，任何使用者的 Pod 都可以通過已瞭解到的映像檔的名稱
（假設 Pod 被調度到正確的節點上）來使用它，而不需要對映像檔進行任何鑑權檢查。
啓用這個准入控制器之後，啓動容器之前必須拉取映像檔，這意味着需要有效的憑證。

### CertificateApproval {#certificateapproval}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller observes requests to approve CertificateSigningRequest resources and performs additional
authorization checks to ensure the approving user has permission to **approve** certificate requests with the
`spec.signerName` requested on the CertificateSigningRequest resource.
-->
此准入控制器獲取審批 CertificateSigningRequest 資源的請求並執行額外的鑑權檢查，
以確保針對設置了 `spec.signerName` 的 CertificateSigningRequest 資源而言，
審批請求的使用者有權限對證書請求執行 **審批** 操作。

<!--
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/) for more
information on the permissions required to perform different actions on CertificateSigningRequest resources.
-->
有關對 CertificateSigningRequest 資源執行不同操作所需權限的詳細信息，
請參閱[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)。

### CertificateSigning  {#certificatesigning}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller observes updates to the `status.certificate` field of CertificateSigningRequest resources
and performs an additional authorization checks to ensure the signing user has permission to **sign** certificate
requests with the `spec.signerName` requested on the CertificateSigningRequest resource.
-->
此准入控制器監視對 CertificateSigningRequest 資源的 `status.certificate` 字段的更新請求，
並執行額外的鑑權檢查，以確保針對設置了 `spec.signerName` 的 CertificateSigningRequest 資源而言，
簽發證書的使用者有權限對證書請求執行 **簽發** 操作。

<!--
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/) for more
information on the permissions required to perform different actions on CertificateSigningRequest resources.
-->
有關對 CertificateSigningRequest 資源執行不同操作所需權限的詳細信息，
請參閱[證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)。

### CertificateSubjectRestriction {#certificatesubjectrestriction}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller observes creation of CertificateSigningRequest resources that have a `spec.signerName`
of `kubernetes.io/kube-apiserver-client`. It rejects any request that specifies a 'group' (or 'organization attribute')
of `system:masters`.
-->
此准入控制器監視 `spec.signerName` 被設置爲 `kubernetes.io/kube-apiserver-client` 的
CertificateSigningRequest 資源創建請求，並拒絕所有將 “group”（或 “organization attribute”）
設置爲 `system:masters` 的請求。

### DefaultIngressClass {#defaultingressclass}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
This admission controller observes creation of `Ingress` objects that do not request any specific
ingress class and automatically adds a default ingress class to them.  This way, users that do not
request any special ingress class do not need to care about them at all and they will get the
default one.
-->
該准入控制器監測沒有請求任何特定 Ingress 類的 `Ingress` 對象創建請求，並自動向其添加默認 Ingress 類。
這樣，沒有任何特殊 Ingress 類需求的使用者根本不需要關心它們，他們將被設置爲默認 Ingress 類。

<!--
This admission controller does not do anything when no default ingress class is configured. When more than one ingress
class is marked as default, it rejects any creation of `Ingress` with an error and an administrator
must revisit their `IngressClass` objects and mark only one as default (with the annotation
"ingressclass.kubernetes.io/is-default-class").  This admission controller ignores any `Ingress`
updates; it acts only on creation.
-->
當未設定默認 Ingress 類時，此准入控制器不執行任何操作。如果有多個 Ingress 類被標記爲默認 Ingress 類，
此控制器將拒絕所有創建 `Ingress` 的操作，並返回錯誤信息。
要修復此錯誤，管理員必須重新檢查其 `IngressClass` 對象，並僅將其中一個標記爲默認
（通過註解 "ingressclass.kubernetes.io/is-default-class"）。
此准入控制器會忽略所有 `Ingress` 更新操作，僅處理創建操作。

<!--
See the [Ingress](/docs/concepts/services-networking/ingress/) documentation for more about ingress
classes and how to mark one as default.
-->
關於 Ingress 類以及如何將 Ingress 類標記爲默認的更多信息，請參見
[Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 頁面。

### DefaultStorageClass {#defaultstorageclass}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
This admission controller observes creation of `PersistentVolumeClaim` objects that do not request any specific storage class
and automatically adds a default storage class to them.
This way, users that do not request any special storage class do not need to care about them at all and they
will get the default one.
-->
此准入控制器監測沒有請求任何特定存儲類的 `PersistentVolumeClaim` 對象的創建請求，
並自動向其添加默認存儲類。
這樣，沒有任何特殊存儲類需求的使用者根本不需要關心它們，它們將被設置爲使用默認存儲類。

<!--
This admission controller does nothing when no default `StorageClass` exists. When more than one storage
class is marked as default, and you then create a `PersistentVolumeClaim` with no `storageClassName` set, 
Kubernetes uses the most recently created default `StorageClass`.
When a `PersistentVolumeClaim` is created with a specified `volumeName`, it remains in a pending state 
if the static volume's `storageClassName` does not match the `storageClassName` on the `PersistentVolumeClaim`
after any default StorageClass is applied to it.
This admission controller ignores any `PersistentVolumeClaim` updates; it acts only on creation.
-->
當默認的 `StorageClass` 不存在時，此准入控制器不執行任何操作。如果將多個存儲類標記爲默認存儲類，
而且你之後在未設置 `storageClassName` 的情況下創建 `PersistentVolumeClaim`，
Kubernetes 將使用最近創建的默認 `StorageClass`。
當使用指定的 `volumeName` 創建 `PersistentVolumeClaim` 時，如果在應用任意默認的 StorageClass 之後，
靜態卷的 `storageClassName` 與 `PersistentVolumeClaim` 上的 `storageClassName` 不匹配，
則 `PersistentVolumeClaim` 保持在 Pending 狀態。
此准入控制器會忽略所有 `PersistentVolumeClaim` 更新操作，僅處理創建操作。

<!--
See [persistent volume](/docs/concepts/storage/persistent-volumes/) documentation about persistent volume claims and
storage classes and how to mark a storage class as default.
-->
關於持久卷申領和存儲類，以及如何將存儲類標記爲默認，
請參見[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)頁面。

### DefaultTolerationSeconds {#defaulttolerationseconds}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
This admission controller sets the default forgiveness toleration for pods to tolerate
the taints `notready:NoExecute` and `unreachable:NoExecute` based on the k8s-apiserver input parameters
`default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` if the pods don't already
have toleration for taints `node.kubernetes.io/not-ready:NoExecute` or
`node.kubernetes.io/unreachable:NoExecute`.
The default value for `default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` is 5 minutes.
-->
此准入控制器基於 k8s-apiserver 的輸入參數 `default-not-ready-toleration-seconds` 和
`default-unreachable-toleration-seconds` 爲 Pod 設置默認的容忍度，以容忍 `notready:NoExecute` 和
`unreachable:NoExecute` 污點
（如果 Pod 尚未容忍 `node.kubernetes.io/not-ready：NoExecute` 和
`node.kubernetes.io/unreachable：NoExecute` 污點的話）。
`default-not-ready-toleration-seconds` 和 `default-unreachable-toleration-seconds`
的默認值是 5 分鐘。

### DenyServiceExternalIPs   {#denyserviceexternalips}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller rejects all net-new usage of the `Service` field `externalIPs`.  This
feature is very powerful (allows network traffic interception) and not well
controlled by policy.  When enabled, users of the cluster may not create new
Services which use `externalIPs` and may not add new values to `externalIPs` on
existing `Service` objects.  Existing uses of `externalIPs` are not affected,
and users may remove values from `externalIPs` on existing `Service` objects.
-->
此准入控制器拒絕新的 `Service` 中使用字段 `externalIPs`。
此功能非常強大（允許網路流量攔截），並且無法很好地受策略控制。
啓用後，叢集使用者將無法創建使用 `externalIPs` 的新 `Service`，也無法在現有
`Service` 對象上爲 `externalIPs` 添加新值。
`externalIPs` 的現有使用不受影響，使用者可以在現有 `Service` 對象上從
`externalIPs` 中刪除值。

<!--
Most users do not need this feature at all, and cluster admins should consider disabling it.
Clusters that do need to use this feature should consider using some custom policy to manage usage
of it.
This admission controller is disabled by default.
-->
大多數使用者根本不需要此特性，叢集管理員應考慮將其禁用。
確實需要使用此特性的叢集應考慮使用一些自定義策略來管理 `externalIPs` 的使用。
此准入控制器默認被禁用。

### PodTopologyLabels {#podtopologylabels}

{{< feature-state feature_gate="PodTopologyLabelsAdmission" >}}

<!--
**Type**: Mutating

The PodTopologyLabels admission controller mutates the `pods/binding` subresources
for all pods bound to a Node, adding topology labels matching those of the bound Node.
This allows Node topology labels to be available as pod labels,
which can be surfaced to running containers using the
[Downward API](docs/concepts/workloads/pods/downward-api/).
The labels available as a result of this controller are the
[topology.kubernetes.io/region](docs/reference/labels-annotations-taints/#topologykubernetesioregion) and
[topology.kuberentes.io/zone](docs/reference/labels-annotations-taints/#topologykubernetesiozone) labels.
-->
**類型**：變更

PodTopologyLabels 准入控制器變更所有綁定到節點的 pod 的 `pods/binding` 子資源，
添加與所綁定節點相匹配的拓撲標籤。
這使得節點拓撲標籤可以作爲 Pod 標籤使用，並且可以通過
[Downward API](/zh-cn/docs/concepts/workloads/pods/downward-api/) 提供給運行中的容器。
由於此控制器而可用的標籤是
[topology.kubernetes.io/region](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesioregion) 和
[topology.kubernetes.io/zone](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesiozone) 標籤。

{{< note >}}
<!--
If any mutating admission webhook adds or modifies labels of the `pods/binding` subresource,
these changes will propagate to pod labels as a result of this controller,
overwriting labels with conflicting keys.
-->
如果有任何變更的准入 Webhook 添加或修改了 `pods/binding` 子資源的標籤，
這些變更將由於此控制器傳播到 Pod 標籤，覆蓋具有衝突鍵的標籤。
{{< /note >}}

<!--
This admission controller is enabled when the `PodTopologyLabelsAdmission` feature gate is enabled.
-->
當 `PodTopologyLabelsAdmission` 特性門控被啓用時，才能啓用此准入控制器。

### EventRateLimit {#eventratelimit}

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller mitigates the problem where the API server gets flooded by
requests to store new Events. The cluster admin can specify event rate limits by:
-->
此准入控制器緩解了請求存儲新事件時淹沒 API 伺服器的問題。叢集管理員可以通過以下方式指定事件速率限制：

<!--
* Enabling the `EventRateLimit` admission controller;
* Referencing an `EventRateLimit` configuration file from the file provided to the API
  server's command line flag `--admission-control-config-file`:
-->
* 啓用 `EventRateLimit` 准入控制器；
* 在通過 API 伺服器的命令列標誌 `--admission-control-config-file` 設置的文件中，
  引用 `EventRateLimit` 設定文件：

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
可以在設定中指定的限制有四種類型：

<!--
 * `Server`: All Event requests (creation or modifications) received by the API server share a single bucket.
 * `Namespace`: Each namespace has a dedicated bucket.
 * `User`: Each user is allocated a bucket.
 * `SourceAndObject`: A bucket is assigned by each combination of source and
   involved object of the event.
-->
* `Server`：API 伺服器收到的所有（創建或修改）Event 請求共享一個桶。
* `Namespace`：每個名字空間都對應一個專用的桶。
* `User`：爲每個使用者分配一個桶。
* `SourceAndObject`：根據事件的來源和涉及對象的各種組合分配桶。

<!--
Below is a sample `eventconfig.yaml` for such a configuration:
-->
下面是一個針對此設定的 `eventconfig.yaml` 示例：

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

This admission controller is disabled by default.
-->
詳情請參見
[EventRateLimit 設定 API 文檔（v1alpha1）](/zh-cn/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)。

此准入控制器默認被禁用。

### ExtendedResourceToleration {#extendedresourcetoleration}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
This plug-in facilitates creation of dedicated nodes with extended resources.
If operators want to create dedicated nodes with extended resources (like GPUs, FPGAs etc.), they are expected to
[taint the node](/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases) with the extended resource
name as the key. This admission controller, if enabled, automatically
adds tolerations for such taints to pods requesting extended resources, so users don't have to manually
add these tolerations.

This admission controller is disabled by default.
-->
此插件有助於創建帶有擴展資源的專用節點。
如果運維人員想要創建帶有擴展資源（如 GPU、FPGA 等）的專用節點，他們應該以擴展資源名稱作爲鍵名，
[爲節點設置污點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
如果啓用了此准入控制器，會將此類污點的容忍度自動添加到請求擴展資源的 Pod 中，
使用者不必再手動添加這些容忍度。

此准入控制器默認被禁用。

### ImagePolicyWebhook {#imagepolicywebhook}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
The ImagePolicyWebhook admission controller allows a backend webhook to make admission decisions.

This admission controller is disabled by default.
-->
ImagePolicyWebhook 准入控制器允許使用後端 Webhook 做出准入決策。

此准入控制器默認被禁用。

<!--
#### Configuration file format {#imagereview-config-file-format}

ImagePolicyWebhook uses a configuration file to set options for the behavior of the backend.
This file may be json or yaml and has the following format:
-->
#### 設定文件格式  {#imagereview-config-file-format}

ImagePolicyWebhook 使用設定文件來爲後端行爲設置選項。該文件可以是 JSON 或 YAML，
並具有以下格式:

<!--
```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # time in s to cache approval
  allowTTL: 50
  # time in s to cache denial
  denyTTL: 50
  # time in ms to wait between retries
  retryBackoff: 500
  # determines behavior if the webhook backend fails
  defaultAllow: true
```
-->
```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # 以秒計的時長，控制批准請求的緩存時間
  allowTTL: 50
  # 以秒計的時長，控制拒絕請求的緩存時間
  denyTTL: 50
  # 以毫秒計的時長，控制重試間隔
  retryBackoff: 500
  # 確定 Webhook 後端失效時的行爲
  defaultAllow: true
```

<!--
Reference the ImagePolicyWebhook configuration file from the file provided to the API server's command line flag `--admission-control-config-file`:
-->
在通過命令列標誌 `--admission-control-config-file` 爲 API 伺服器提供的文件中，
引用 ImagePolicyWebhook 設定文件：

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
或者，你也可以直接將設定嵌入到該文件中：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    configuration:
      imagePolicy:
        kubeConfigFile: <kubeconfig 文件路徑>
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
ImagePolicyWebhook 的設定文件必須引用
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
格式的文件；該文件用來設置與後端的連接。要求後端使用 TLS 進行通信。

<!--
The kubeconfig file's `cluster` field must point to the remote service, and the `user` field
must contain the returned authorizer.
-->
kubeconfig 文件的 `clusters` 字段需要指向遠端服務，`users` 字段需要包含已返回的授權者。

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
# clusters 指的是遠程服務。
clusters:
  - name: name-of-remote-imagepolicy-service
    cluster:
      certificate-authority: /path/to/ca.pem    # CA 用於驗證遠程服務
      server: https://images.example.com/policy # 要查詢的遠程服務的 URL，必須是 'https'。

# users 指的是 API 伺服器的 Webhook 配置。
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # Webhook 准入控制器使用的證書
      client-key: /path/to/key.pem          # 證書匹配的密鑰
```

<!--
For additional HTTP configuration, refer to the
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation.
-->
關於 HTTP 設定的更多信息，請參閱
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
文檔。

<!--
#### Request payloads

When faced with an admission decision, the API Server POSTs a JSON serialized
`imagepolicy.k8s.io/v1alpha1` `ImageReview` object describing the action.
This object contains fields describing the containers being admitted, as well as
any pod annotations that match `*.image-policy.k8s.io/*`.
-->
#### 請求載荷  {#request-payloads}

當面對一個准入決策時，API 伺服器發送一個描述操作的 JSON 序列化的
`imagepolicy.k8s.io/v1alpha1` `ImageReview` 對象。
該對象包含描述被准入容器的字段，以及與 `*.image-policy.k8s.io/*` 匹配的所有 Pod 註解。

{{< note >}}
<!--
The webhook API objects are subject to the same versioning compatibility rules
as other Kubernetes API objects. Implementers should be aware of looser compatibility
promises for alpha objects and check the `apiVersion` field of the request to
ensure correct deserialization.
Additionally, the API Server must enable the `imagepolicy.k8s.io/v1alpha1` API extensions
group (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).
-->
注意，Webhook API 對象與其他 Kubernetes API 對象一樣受制於相同的版本控制兼容性規則。
實現者應該知道對 alpha 對象兼容性是相對寬鬆的，並檢查請求的 "apiVersion" 字段，
以確保正確的反序列化。此外，API 伺服器必須啓用 `imagepolicy.k8s.io/v1alpha1` API 擴展組
（`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`）。
{{< /note >}}

<!--
An example request body:
-->
請求體示例：

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "spec": {
    "containers": [
      {
        "image": "myrepo/myimage:v1"
      },
      {
        "image": "myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations": {
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace": "mynamespace"
  }
}
```

<!--
The remote service is expected to fill the `status` field of the request and
respond to either allow or disallow access. The response body's `spec` field is ignored, and
may be omitted. A permissive response would return:
-->
遠程服務將填充請求的 `status` 字段，並返回允許或不允許訪問的響應。
響應體的 `spec` 字段會被忽略，並且可以被省略。一個允許訪問應答會返回：

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
更多的文檔，請參閱 [`imagepolicy.v1alpha1` API](/zh-cn/docs/reference/config-api/imagepolicy.v1alpha1/)。

<!--
#### Extending with Annotations

All annotations on a Pod that match `*.image-policy.k8s.io/*` are sent to the webhook.
Sending annotations allows users who are aware of the image policy backend to
send extra information to it, and for different backends implementations to
accept different information.
-->
#### 使用註解進行擴展  {#extending-with-annotations}

一個 Pod 中匹配 `*.image-policy.k8s.io/*` 的註解都會被髮送給 Webhook。
這樣做使得了解後端映像檔策略的使用者可以向它發送額外的信息，
並讓不同的後端實現接收不同的信息。

<!--
Examples of information you might put here are:

* request to "break glass" to override a policy, in case of emergency.
* a ticket number from a ticket system that documents the break-glass request
* provide a hint to the policy server as to the imageID of the image being provided, to save it a lookup
-->
你可以在這裏輸入的信息有：

* 在緊急情況下，請求破例覆蓋某個策略。
* 從一個記錄了破例的請求的工單（Ticket）系統得到的一個工單號碼。
* 向策略伺服器提供提示信息，用於提供映像檔的 imageID，以方便它進行查找。

<!--
In any case, the annotations are provided by the user and are not validated by Kubernetes in any way.
-->
在任何情況下，註解都是由使用者提供的，並不會被 Kubernetes 以任何方式進行驗證。

### LimitPodHardAntiAffinityTopology   {#limitpodhardantiaffinitytopology}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller denies any pod that defines `AntiAffinity` topology key other than
`kubernetes.io/hostname` in `requiredDuringSchedulingRequiredDuringExecution`.

This admission controller is disabled by default.
-->
此准入控制器拒絕定義了 `AntiAffinity` 拓撲鍵的任何 Pod
（`requiredDuringSchedulingRequiredDuringExecution` 中的 `kubernetes.io/hostname` 除外）。

此准入控制器默認被禁用。

### LimitRanger {#limitranger}

<!--
**Type**: Mutating and Validating.
-->
**類別**：變更和驗證。

<!--
This admission controller will observe the incoming request and ensure that it does not violate
any of the constraints enumerated in the `LimitRange` object in a `Namespace`.  If you are using
`LimitRange` objects in your Kubernetes deployment, you MUST use this admission controller to
enforce those constraints. LimitRanger can also be used to apply default resource requests to Pods
that don't specify any; currently, the default LimitRanger applies a 0.1 CPU requirement to all
Pods in the `default` namespace.
-->
此准入控制器會監測傳入的請求，並確保請求不會違反 `Namespace` 中 `LimitRange` 對象所設置的任何約束。
如果你在 Kubernetes 部署中使用了 `LimitRange` 對象，則必須使用此准入控制器來執行這些約束。
LimitRanger 還可以用於將默認資源請求應用到沒有設定資源約束的 Pod；
當前，默認的 LimitRanger 對 `default` 名字空間中的所有 Pod 都設置 0.1 CPU 的需求。

<!--
See the [LimitRange API reference](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
and the [example of LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
for more details.
-->
請查看
[limitRange API 文檔](/zh-cn/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)和
[LimitRange 例子](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)以瞭解更多細節。

### MutatingAdmissionWebhook {#mutatingadmissionwebhook}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
This admission controller calls any mutating webhooks which match the request. Matching
webhooks are called in serial; each one may modify the object if it desires.

This admission controller (as implied by the name) only runs in the mutating phase.
-->
此准入控制器調用任何與請求匹配的變更（Mutating） Webhook。匹配的 Webhook 將被順序調用。
每一個 Webhook 都可以自由修改對象。

`MutatingAdmissionWebhook`，顧名思義，僅在變更階段運行。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or validating admission controllers will permit the request to finish.
-->
如果由此准入控制器調用的 Webhook 有副作用（如：減少配額），
則它 **必須** 具有協調系統，因爲不能保證後續的 Webhook 和驗證准入控制器都會允許完成請求。

<!--
If you disable the MutatingAdmissionWebhook, you must also disable the
`MutatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag, both are on by default.
-->
如果你禁用了 MutatingAdmissionWebhook，那麼還必須使用 `--runtime-config` 標誌禁止
`admissionregistration.k8s.io/v1` 組/版本中的 `MutatingWebhookConfiguration`，
二者都是默認啓用的。

<!--
#### Use caution when authoring and installing mutating webhooks
-->
#### 謹慎編寫和安裝變更 Webhook  {#use-caution-when-authoring-and-installing-mutating-webhooks}

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
* 當使用者嘗試創建的對象與返回的對象不同時，使用者可能會感到困惑。
* 當他們讀回的對象與嘗試創建的對象不同，內建的控制迴路可能會出問題。
  * 與覆蓋原始請求中設置的字段相比，使用原始請求未設置的字段會引起問題的可能性較小。
    應儘量避免覆蓋原始請求中的字段設置。
* 內建資源和第三方資源的控制迴路未來可能會出現破壞性的變更，使現在運行良好的 Webhook
  無法再正常運行。即使完成了 Webhook API 安裝，也不代表該 Webhook 會被提供無限期的支持。

### NamespaceAutoProvision {#namespaceautoprovision}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
This admission controller examines all incoming requests on namespaced resources and checks
if the referenced namespace does exist.
It creates a namespace if it cannot be found.
This admission controller is useful in deployments that do not want to restrict creation of
a namespace prior to its usage.
-->
此准入控制器會檢查針對名字空間域資源的所有傳入請求，並檢查所引用的名字空間是否確實存在。
如果找不到所引用的名字空間，控制器將創建一個名字空間。
此准入控制器對於不想要求名字空間必須先創建後使用的叢集部署很有用。

### NamespaceExists {#namespaceexists}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller checks all requests on namespaced resources other than `Namespace` itself.
If the namespace referenced from a request doesn't exist, the request is rejected.
-->
此准入控制器檢查針對名字空間作用域的資源（除 `Namespace` 自身）的所有請求。
如果請求引用的名字空間不存在，則拒絕該請求。

### NamespaceLifecycle {#namespacelifecycle}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller enforces that a `Namespace` that is undergoing termination cannot have
new objects created in it, and ensures that requests in a non-existent `Namespace` are rejected.
This admission controller also prevents deletion of three system reserved namespaces `default`,
`kube-system`, `kube-public`.
-->
該准入控制器禁止在一個正在被終止的 `Namespace` 中創建新對象，並確保針對不存在的
`Namespace` 的請求被拒絕。該准入控制器還會禁止刪除三個系統保留的名字空間，即 `default`、
`kube-system` 和 `kube-public`。

<!--
A `Namespace` deletion kicks off a sequence of operations that remove all objects (pods, services,
etc.) in that namespace.  In order to enforce integrity of that process, we strongly recommend
running this admission controller.
-->
`Namespace` 的刪除操作會觸發一系列刪除該名字空間中所有對象（Pod、Service 等）的操作。
爲了確保這個過程的完整性，我們強烈建議啓用這個准入控制器。

### NodeRestriction {#noderestriction}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller limits the `Node` and `Pod` objects a kubelet can modify. In order to be limited by this admission controller,
kubelets must use credentials in the `system:nodes` group, with a username in the form `system:node:<nodeName>`.
Such kubelets will only be allowed to modify their own `Node` API object, and only modify `Pod` API objects that are bound to their node.
-->
該准入控制器限制了某 kubelet 可以修改的 `Node` 和 `Pod` 對象。
爲了受到這個准入控制器的限制，kubelet 必須使用在 `system:nodes` 組中的憑證，
並使用 `system:node:<nodeName>` 形式的使用者名。
這樣，kubelet 只可修改自己的 `Node` API 對象，只能修改綁定到自身節點的 Pod 對象。

<!--
kubelets are not allowed to update or remove taints from their `Node` API object.

The `NodeRestriction` admission plugin prevents kubelets from deleting their `Node` API object,
and enforces kubelet modification of labels under the `kubernetes.io/` or `k8s.io/` prefixes as follows:
-->
不允許 kubelet 更新或刪除 `Node` API 對象的污點。

`NodeRestriction` 准入插件可防止 kubelet 刪除其 `Node` API 對象，
並對前綴爲 `kubernetes.io/` 或 `k8s.io/` 的標籤的修改對 kubelet 作如下限制：

<!--
* **Prevents** kubelets from adding/removing/updating labels with a `node-restriction.kubernetes.io/` prefix.
  This label prefix is reserved for administrators to label their `Node` objects for workload isolation purposes,
  and kubelets will not be allowed to modify labels with that prefix.
* **Allows** kubelets to add/remove/update these labels and label prefixes:
-->
* **禁止** kubelet 添加、刪除或更新前綴爲 `node-restriction.kubernetes.io/` 的標籤。
  這類前綴的標籤是保留給管理員的，用於爲 `Node` 對象設置標籤以隔離工作負載，而不允許 kubelet
  修改帶有該前綴的標籤。
* **允許** kubelet 添加、刪除、更新以下標籤：
  * `kubernetes.io/hostname`
  * `kubernetes.io/arch`
  * `kubernetes.io/os`
  * `beta.kubernetes.io/instance-type`
  * `node.kubernetes.io/instance-type`
  * `failure-domain.beta.kubernetes.io/region`（已棄用）
  * `failure-domain.beta.kubernetes.io/zone`（已棄用）
  * `topology.kubernetes.io/region`
  * `topology.kubernetes.io/zone`
  * `kubelet.kubernetes.io/` 爲前綴的標籤
  * `node.kubernetes.io/` 爲前綴的標籤

<!--
Use of any other labels under the `kubernetes.io` or `k8s.io` prefixes by kubelets is reserved,
and may be disallowed or allowed by the `NodeRestriction` admission plugin in the future.

Future versions may add additional restrictions to ensure kubelets have the minimal set of
permissions required to operate correctly.
-->
以 `kubernetes.io` 或 `k8s.io` 爲前綴的所有其他標籤都限制 kubelet 使用，並且將來可能會被
`NodeRestriction` 准入插件允許或禁止。

將來的版本可能會增加其他限制，以確保 kubelet 具有正常運行所需的最小權限集。

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller protects the access to the `metadata.ownerReferences` of an object
so that only users with **delete** permission to the object can change it.
This admission controller also protects the access to `metadata.ownerReferences[x].blockOwnerDeletion`
of an object, so that only users with **update** permission to the `finalizers`
subresource of the referenced *owner* can change it.
-->
此准入控制器保護對對象的 `metadata.ownerReferences` 的訪問，以便只有對該對象具有
**delete** 權限的使用者才能對其進行更改。
該准入控制器還保護對 `metadata.ownerReferences[x].blockOwnerDeletion` 對象的訪問，
以便只有對所引用的 **屬主（owner）** 的 `finalizers` 子資源具有 **update**
權限的使用者才能對其進行更改。

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
**Type**: Validating.
-->
**類別**：驗證。

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
建議啓用 `PersistentVolumeClaimResize` 准入控制器。除非 PVC 的 `StorageClass` 明確地將
`allowVolumeExpansion` 設置爲 `true` 來顯式啓用調整大小。
否則，默認情況下該准入控制器會阻止所有對 PVC 大小的調整。

例如：由以下 `StorageClass` 創建的所有 `PersistentVolumeClaim` 都支持卷容量擴充：

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
關於持久化卷申領的更多信息，請參見
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。

### PodNodeSelector {#podnodeselector}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller defaults and limits what node selectors may be used within a namespace
by reading a namespace annotation and a global configuration.

This admission controller is disabled by default.
-->
此准入控制器通過讀取名字空間註解和全局設定，來爲名字空間中可以使用的節點選擇器設置默認值並實施限制。

此准入控制器默認被禁用。

<!--
#### Configuration file format

`PodNodeSelector` uses a configuration file to set options for the behavior of the backend.
Note that the configuration file format will move to a versioned file in a future release.
This file may be json or yaml and has the following format:
-->
#### 設定文件格式    {#configuration-file-format-podnodeselector}

`PodNodeSelector` 使用設定文件來設置後端行爲的選項。
請注意，設定文件格式將在將來某個版本中改爲版本化文件。
該文件可以是 JSON 或 YAML，格式如下：

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
通過 API 伺服器命令列標誌 `--admission-control-config-file` 爲 API 伺服器提供的文件中，
需要引用 `PodNodeSelector` 設定文件：

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
#### 設定註解格式   {#configuration-annotation-format}

`PodNodeSelector` 使用鍵爲 `scheduler.alpha.kubernetes.io/node-selector`
的註解爲名字空間設置節點選擇算符。

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
#### 內部行爲   {#internal-behavior}

此准入控制器行爲如下：

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
2. 如果名字空間缺少此類註解，則使用 `PodNodeSelector` 插件設定文件中定義的
   `clusterDefaultNodeSelector` 作爲節點選擇算符。
3. 評估 Pod 節點選擇算符和名字空間節點選擇算符是否存在衝突。存在衝突將拒絕 Pod。
4. 評估 Pod 節點選擇算符和特定於名字空間的被允許的選擇算符所定義的插件設定文件是否存在衝突。
   存在衝突將導致拒絕 Pod。

{{< note >}}
<!--
PodNodeSelector allows forcing pods to run on specifically labeled nodes. Also see the PodTolerationRestriction
admission plugin, which allows preventing pods from running on specifically tainted nodes.
-->
PodNodeSelector 允許 Pod 強制在特定標籤的節點上運行。
另請參閱 PodTolerationRestriction 准入插件，該插件可防止 Pod 在特定污點的節點上運行。
{{< /note >}}

### PodSecurity {#podsecurity}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
The PodSecurity admission controller checks new Pods before they are
admitted, determines if it should be admitted based on the requested security context and the restrictions on permitted
[Pod Security Standards](/docs/concepts/security/pod-security-standards/)
for the namespace that the Pod would be in.
-->
PodSecurity 准入控制器在新 Pod 被准入之前對其進行檢查，
根據請求的安全上下文和 Pod 所在名字空間允許的
[Pod 安全性標準](/zh/docs/concepts/security/pod-security-standards/)的限制來確定新 Pod
是否應該被准入。

<!--
See the [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
documentation for more information.
-->
更多信息請參閱 [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)。

<!--
PodSecurity replaced an older admission controller named PodSecurityPolicy.
-->
PodSecurity 取代了一個名爲 PodSecurityPolicy 的舊准入控制器。

### PodTolerationRestriction {#podtolerationrestriction}

{{< feature-state for_k8s_version="v1.7" state="alpha" >}}

<!--
**Type**: Mutating and Validating.
-->
**類別**：變更和驗證。

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
如果 Pod 的名字空間沒有任何關聯的默認容忍度或容忍度白名單，
則使用叢集級別的默認容忍度或容忍度白名單（如果有的話）。

<!--
Tolerations to a namespace are assigned via the `scheduler.alpha.kubernetes.io/defaultTolerations` annotation key.
The list of allowed tolerations can be added via the `scheduler.alpha.kubernetes.io/tolerationsWhitelist` annotation key.

Example for namespace annotations:
-->
名字空間的容忍度通過註解鍵 `scheduler.alpha.kubernetes.io/defaultTolerations`
來設置。可接受的容忍度可以通過 `scheduler.alpha.kubernetes.io/tolerationsWhitelist`
註解鍵來添加。

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
This admission controller is disabled by default.
-->
此准入控制器默認被禁用。

<!--
### Priority {#priority}

**Type**: Mutating and Validating.

The priority admission controller uses the `priorityClassName` field and populates the integer
value of the priority.
If the priority class is not found, the Pod is rejected.
-->
### 優先級 {#priority}

**類別**：變更和驗證。

優先級准入控制器使用 `priorityClassName` 字段並用整型值填充優先級。
如果找不到優先級，則拒絕 Pod。

### ResourceQuota {#resourcequota}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller will observe the incoming request and ensure that it does not violate
any of the constraints enumerated in the `ResourceQuota` object in a `Namespace`.  If you are
using `ResourceQuota` objects in your Kubernetes deployment, you MUST use this admission
controller to enforce quota constraints.
-->
此准入控制器會監測傳入的請求，並確保它不違反任何一個 `Namespace` 中的 `ResourceQuota`
對象中列舉的約束。如果你在 Kubernetes 部署中使用了 `ResourceQuota`，
則必須使用這個准入控制器來強制執行配額限制。

<!--
See the [ResourceQuota API reference](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
and the [example of Resource Quota](/docs/concepts/policy/resource-quotas/) for more details.
-->
請參閱
[resourceQuota API 參考](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
和 [Resource Quota 例子](/zh-cn/docs/concepts/policy/resource-quotas/)瞭解更多細節。

### RuntimeClass {#runtimeclass}

<!--
**Type**: Mutating and Validating.
-->
**類別**：變更和驗證。

<!--
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
如果你所定義的 RuntimeClass 包含 [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)，
這個准入控制器會檢查新的 Pod。
被啓用後，此准入控制器會拒絕所有已經設置了 overhead 字段的 Pod 創建請求。
對於設定了 RuntimeClass 並在其 `.spec` 中選定 RuntimeClass 的 Pod，
此准入控制器會根據相應 RuntimeClass 中定義的值爲 Pod 設置 `.spec.overhead`。

詳情請參見 [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)。

### ServiceAccount {#serviceaccount}

<!--
**Type**: Mutating and Validating.
-->
**類別**：變更和驗證。

<!--
This admission controller implements automation for
[serviceAccounts](/docs/tasks/configure-pod-container/configure-service-account/).
The Kubernetes project strongly recommends enabling this admission controller.
You should enable this admission controller if you intend to make any use of Kubernetes
`ServiceAccount` objects.
-->
此准入控制器實現了
[ServiceAccount](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
的自動化。強烈推薦爲 Kubernetes 項目啓用此准入控制器。
如果你打算使用 Kubernetes 的 `ServiceAccount` 對象，你應啓用這個准入控制器。

<!--
Regarding the annotation `kubernetes.io/enforce-mountable-secrets`: While the annotation's name suggests it only concerns the mounting of Secrets,
its enforcement also extends to other ways Secrets are used in the context of a Pod.
Therefore, it is crucial to ensure that all the referenced secrets are correctly specified in the ServiceAccount.
-->
關於 `kubernetes.io/enforce-mountable-secrets` 註解：儘管註解的名稱表明它只涉及 Secret 的掛載，
但其執行範圍也擴展到 Pod 上下文中 Secret 的其他使用方式。
因此，確保所有引用的 Secret 在 ServiceAccount 中被正確指定是至關重要的。


### StorageObjectInUseProtection   {#storageobjectinuseprotection}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
The `StorageObjectInUseProtection` plugin adds the `kubernetes.io/pvc-protection` or `kubernetes.io/pv-protection`
finalizers to newly created Persistent Volume Claims (PVCs) or Persistent Volumes (PV).
In case a user deletes a PVC or PV the PVC or PV is not removed until the finalizer is removed
from the PVC or PV by PVC or PV Protection Controller.
Refer to the
[Storage Object in Use Protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)
for more detailed information.
-->
`StorageObjectInUseProtection` 插件將 `kubernetes.io/pvc-protection` 或
`kubernetes.io/pv-protection` 終結器（finalizers）添加到新創建的持久卷申領（PVC）
或持久卷（PV）中。如果使用者嘗試刪除 PVC/PV，除非 PVC/PV 的保護控制器移除終結器，
否則 PVC/PV 不會被刪除。有關更多詳細信息，
請參考[保護使用中的存儲對象](/zh-cn/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)。

### TaintNodesByCondition {#taintnodesbycondition}

<!--
**Type**: Mutating.
-->
**類別**：變更。

<!--
This admission controller {{< glossary_tooltip text="taints" term_id="taint" >}} newly created
Nodes as `NotReady` and `NoSchedule`. That tainting avoids a race condition that could cause Pods
to be scheduled on new Nodes before their taints were updated to accurately reflect their reported
conditions.
-->
該准入控制器爲新創建的節點添加 `NotReady` 和 `NoSchedule`
{{< glossary_tooltip text="污點" term_id="taint" >}}。
這些污點能夠避免一些競態條件的發生，而這類競態條件可能導致 Pod
在更新節點污點以準確反映其所報告狀況之前，就被調度到新節點上。

### ValidatingAdmissionPolicy {#validatingadmissionpolicy}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
[This admission controller](/docs/reference/access-authn-authz/validating-admission-policy/) implements the CEL validation for incoming matched requests.
It is enabled when both feature gate `validatingadmissionpolicy` and `admissionregistration.k8s.io/v1alpha1` group/version are enabled.
If any of the ValidatingAdmissionPolicy fails, the request fails.
-->
[此准入控制器](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)針對傳入的匹配請求實現
CEL 校驗。當 `validatingadmissionpolicy` 和 `admissionregistration.k8s.io/v1alpha1` 特性門控組/版本被啓用時，
此特性被啓用。如果任意 ValidatingAdmissionPolicy 失敗，則請求失敗。

### ValidatingAdmissionWebhook {#validatingadmissionwebhook}

<!--
**Type**: Validating.
-->
**類別**：驗證。

<!--
This admission controller calls any validating webhooks which match the request. Matching
webhooks are called in parallel; if any of them rejects the request, the request
fails. This admission controller only runs in the validation phase; the webhooks it calls may not
mutate the object, as opposed to the webhooks called by the `MutatingAdmissionWebhook` admission controller.
-->
此准入控制器調用與請求匹配的所有驗證性 Webhook。
匹配的 Webhook 將被並行調用。如果其中任何一個拒絕請求，則整個請求將失敗。
該准入控制器僅在驗證（Validating）階段運行；與 `MutatingAdmissionWebhook`
准入控制器所調用的 Webhook 相反，它調用的 Webhook 不可以變更對象。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or other validating admission controllers will permit the request to finish.
-->
如果以此方式調用的 Webhook 有其它副作用（如：減少配額），則它**必須**具有協調機制。
這是因爲無法保證後續的 Webhook 或其他驗證性准入控制器都允許請求完成。

<!--
If you disable the ValidatingAdmissionWebhook, you must also disable the
`ValidatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag.
-->
如果你禁用了 ValidatingAdmissionWebhook，還必須通過 `--runtime-config` 標誌來禁用
`admissionregistration.k8s.io/v1` 組/版本中的 `ValidatingWebhookConfiguration` 對象。

<!--
## Is there a recommended set of admission controllers to use?

Yes. The recommended admission controllers are enabled by default
(shown [here](/docs/reference/command-line-tools-reference/kube-apiserver/#options)),
so you do not need to explicitly specify them.
You can enable additional admission controllers beyond the default set using the
`--enable-admission-plugins` flag (**order doesn't matter**).
-->
## 有推薦的准入控制器嗎？   {#is-there-a-recommended-set-of-admission-controllers-to-use}

有。推薦使用的准入控制器默認情況下都處於啓用狀態
（請查看[這裏](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/#options)）。
因此，你無需顯式指定它們。
你可以使用 `--enable-admission-plugins` 標誌（**順序不重要**）來啓用默認設置以外的其他准入控制器。
