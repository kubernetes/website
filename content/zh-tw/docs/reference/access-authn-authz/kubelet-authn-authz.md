---
title: kubelet 認證/鑑權
weight: 110
---
<!--
reviewers:
- liggitt
title: Kubelet authentication/authorization
weight: 110
-->

<!--
## Overview
-->
## 概述  {#overview}

<!--
A kubelet's HTTPS endpoint exposes APIs which give access to data of varying sensitivity,
and allow you to perform operations with varying levels of power on the node and within containers.
-->
kubelet 的 HTTPS 端點公開了一些 API，這些 API 可以訪問敏感度不同的數據，
並允許你在節點上和容器內以不同級別的權限執行操作。

<!--
This document describes how to authenticate and authorize access to the kubelet's HTTPS endpoint.
-->
本文檔介紹瞭如何對 kubelet 的 HTTPS 端點的訪問進行認證和鑑權。

<!--
## Kubelet authentication
-->
## kubelet 身份認證   {#kubelet-authentication}

<!--
By default, requests to the kubelet's HTTPS endpoint that are not rejected by other configured
authentication methods are treated as anonymous requests, and given a username of `system:anonymous`
and a group of `system:unauthenticated`.
-->
默認情況下，未被已設定的其他身份認證方法拒絕的對 kubelet 的 HTTPS 端點的請求會被視爲匿名請求，
並被賦予 `system:anonymous` 使用者名和 `system:unauthenticated` 組。

<!--
To disable anonymous access and send `401 Unauthorized` responses to unauthenticated requests:
-->
要禁用匿名訪問並向未經身份認證的請求發送 `401 Unauthorized` 響應，請執行以下操作：

<!--
* start the kubelet with the `--anonymous-auth=false` flag
-->
* 帶 `--anonymous-auth=false` 標誌啓動 kubelet

<!--
To enable X509 client certificate authentication to the kubelet's HTTPS endpoint:
-->
要對 kubelet 的 HTTPS 端點啓用 X509 客戶端證書認證：

<!--
* start the kubelet with the `--client-ca-file` flag, providing a CA bundle to verify client certificates with
* start the apiserver with `--kubelet-client-certificate` and `--kubelet-client-key` flags
* see the [apiserver authentication documentation](/docs/reference/access-authn-authz/authentication/#x509-client-certificates) for more details
-->
* 帶 `--client-ca-file` 標誌啓動 kubelet，提供一個 CA 證書包以供驗證客戶端證書
* 帶 `--kubelet-client-certificate` 和 `--kubelet-client-key` 標誌啓動 API 伺服器
* 有關更多詳細信息，請參見
  [API 伺服器身份認證文檔](/zh-cn/docs/reference/access-authn-authz/authentication/#x509-client-certificates)

<!--
To enable API bearer tokens (including service account tokens) to be used to authenticate to the kubelet's HTTPS endpoint:
-->
要啓用 API 持有者令牌（包括服務賬號令牌）以對 kubelet 的 HTTPS 端點進行身份認證，請執行以下操作：

<!--
* ensure the `authentication.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authentication-token-webhook` and `--kubeconfig` flags
* the kubelet calls the `TokenReview` API on the configured API server to determine user information from bearer tokens
-->
* 確保在 API 伺服器中啓用了 `authentication.k8s.io/v1beta1` API 組
* 帶 `--authentication-token-webhook` 和 `--kubeconfig` 標誌啓動 kubelet
* kubelet 調用已設定的 API 伺服器上的 `TokenReview` API，以根據持有者令牌確定使用者信息

<!--
## Kubelet authorization
-->
## kubelet 鑑權   {#kubelet-authorization}

<!--
Any request that is successfully authenticated (including an anonymous request) is then authorized. The default authorization mode is `AlwaysAllow`, which allows all requests.
-->
任何成功通過身份認證的請求（包括匿名請求）之後都會被鑑權。
默認的鑑權模式爲 `AlwaysAllow`，它允許所有請求。

<!--
There are many possible reasons to subdivide access to the kubelet API:
-->
細分對 kubelet API 的訪問權限可能有多種原因：

<!--
* anonymous auth is enabled, but anonymous users' ability to call the kubelet API should be limited
* bearer token auth is enabled, but arbitrary API users' (like service accounts) ability to call the kubelet API should be limited
* client certificate auth is enabled, but only some of the client certificates signed by the configured CA should be allowed to use the kubelet API
-->
* 啓用了匿名身份認證，但是應限制匿名使用者調用 kubelet API 的能力
* 啓用了持有者令牌認證，但應限制任意 API 使用者（如服務賬號）調用 kubelet API 的能力
* 啓用了客戶端證書身份認證，但僅應允許已設定的 CA 簽名的某些客戶端證書使用 kubelet API

<!--
To subdivide access to the kubelet API, delegate authorization to the API server:
-->
要細分對 kubelet API 的訪問權限，請將鑑權委派給 API 伺服器：

<!--
* ensure the `authorization.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authorization-mode=Webhook` and the `--kubeconfig` flags
* the kubelet calls the `SubjectAccessReview` API on the configured API server to determine whether each request is authorized
-->
* 確保在 API 伺服器中啓用了 `authorization.k8s.io/v1beta1` API 組
* 帶 `--authorization-mode=Webhook` 和 `--kubeconfig` 標誌啓動 kubelet
* kubelet 調用已設定的 API 伺服器上的 `SubjectAccessReview` API，
  以確定每個請求是否得到鑑權

<!--
The kubelet authorizes API requests using the same [request attributes](/docs/reference/access-authn-authz/authorization/#review-your-request-attributes) approach as the apiserver.
-->
kubelet 使用與 API
伺服器相同的[請求屬性](/zh-cn/docs/reference/access-authn-authz/authorization/#review-your-request-attributes)方法對
API 請求執行鑑權。

<!--
The verb is determined from the incoming request's HTTP verb:
-->
請求的動詞根據傳入請求的 HTTP 動詞確定：

<!--
HTTP verb | request verb
-->
HTTP 動詞 | 請求動詞
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

<!--
The resource and subresource is determined from the incoming request's path:
-->
資源和子資源是根據傳入請求的路徑確定的：

<!--
Kubelet API         | resource | subresource
--------------------|----------|------------
/stats/\*           | nodes    | stats
/metrics/\*         | nodes    | metrics
/logs/\*            | nodes    | log
/spec/\*            | nodes    | spec
/checkpoint/\*      | nodes    | checkpoint
*all others*        | nodes    | proxy
-->
kubelet API  | 資源 | 子資源
-------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/spec/\*      | nodes    | spec
/checkpoint/\* | nodes   | checkpoint
**其它所有**  | nodes    | proxy

<!--
The namespace and API group attributes are always an empty string, and
the resource name is always the name of the kubelet's `Node` API object.
-->
名字空間和 API 組屬性始終是空字符串，
資源名稱始終是 kubelet 的 `Node` API 對象的名稱。

<!--
When running in this mode, ensure the user identified by the `--kubelet-client-certificate` and `--kubelet-client-key`
flags passed to the apiserver is authorized for the following attributes:
-->
在此模式下運行時，請確保傳遞給 API 伺服器的由 `--kubelet-client-certificate` 和
`--kubelet-client-key` 標誌標識的使用者具有以下屬性的鑑權：

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics

<!--
### Fine-grained authorization
-->
### 細粒度鑑權   {#fine-grained-authorization}

{{< feature-state feature_gate_name="KubeletFineGrainedAuthz" >}}

<!--
When the feature gate `KubeletFineGrainedAuthz` is enabled kubelet performs a
fine-grained check before falling back to the `proxy` subresource for the `/pods`,
`/runningPods`, `/configz` and `/healthz` endpoints. The resource and subresource 
are determined from the incoming request's path:
-->
當特性門控 `KubeletFineGrainedAuthz` 被啓用時，kubelet 處理對
`/pods`、`/runningPods`、`/configz` 和 `/healthz` 等端點的請求時，在回退到 `proxy` 子資源之前，
會執行一次細粒度的檢查。資源和子資源是根據傳入請求的路徑確定的：

<!--
Kubelet API   | resource | subresource
--------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/pods         | nodes    | pods, proxy
/runningPods/ | nodes    | pods, proxy
/healthz      | nodes    | healthz, proxy
/configz      | nodes    | configz, proxy
*all others*  | nodes    | proxy
-->
kubelet API   | 資源      | 子資源
--------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/pods         | nodes    | pods, proxy
/runningPods/ | nodes    | pods, proxy
/healthz      | nodes    | healthz, proxy
/configz      | nodes    | configz, proxy
**其他所有**   | nodes    | proxy

<!--
When the feature-gate `KubeletFineGrainedAuthz` is enabled, ensure the user
identified by the `--kubelet-client-certificate` and `--kubelet-client-key`
flags passed to the API server is authorized for the following attributes:
-->
當特性門控 `KubeletFineGrainedAuthz` 被啓用時，請確保經傳遞給 API 伺服器的
`--kubelet-client-certificate` 和 `--kubelet-client-key` 標誌所鑑別的使用者被授權了以下屬性：

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=metrics
* verb=\*, resource=nodes, subresource=configz
* verb=\*, resource=nodes, subresource=healthz
* verb=\*, resource=nodes, subresource=pods

<!--
If [RBAC authorization](/docs/reference/access-authn-authz/rbac/) is used,
enabling this gate also ensure that the builtin `system:kubelet-api-admin` ClusterRole
is updated with permissions to access all the above mentioned subresources.
-->
如果使用的是 [RBAC 鑑權](/zh-cn/docs/reference/access-authn-authz/rbac/)，
那麼啓用此特性門控時，系統還會自動更新內置的 `system:kubelet-api-admin ClusterRole`，
確保其具備訪問上述所有子資源的權限。