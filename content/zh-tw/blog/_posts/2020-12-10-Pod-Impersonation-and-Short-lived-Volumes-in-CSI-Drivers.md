---
layout: blog
title: 'Kubernetes 1.20：CSI 驅動程序中的 Pod 身份假扮和短時卷'
date: 2020-12-18
slug: kubernetes-1.20-pod-impersonation-short-lived-volumes-in-csi
---
<!--
layout: blog
title: 'Kubernetes 1.20: Pod Impersonation and Short-lived Volumes in CSI Drivers'
date: 2020-12-18
slug: kubernetes-1.20-pod-impersonation-short-lived-volumes-in-csi
-->

<!--
**Author**: Shihang Zhang (Google)
-->
**作者**: Shihang Zhang（谷歌）

<!--
Typically when a [CSI](https://github.com/container-storage-interface/spec/blob/baa71a34651e5ee6cb983b39c03097d7aa384278/spec.md) driver mounts credentials such as secrets and certificates, it has to authenticate against storage providers to access the credentials. However, the access to those credentials are controlled on the basis of the pods' identities rather than the CSI driver's identity. CSI drivers, therefore, need some way to retrieve pod's service account token. 
-->
通常，當 [CSI](https://github.com/container-storage-interface/spec/blob/baa71a34651e5ee6cb983b39c03097d7aa384278/spec.md) 驅動程序掛載
諸如 Secret 和證書之類的憑據時，它必須通過存儲提供者的身份認證才能訪問這些憑據。
然而，對這些憑據的訪問是根據 Pod 的身份而不是 CSI 驅動程序的身份來控制的。 
因此，CSI 驅動程序需要某種方法來取得 Pod 的服務帳戶令牌。

<!--
Currently there are two suboptimal approaches to achieve this, either by granting CSI drivers the permission to use TokenRequest API or by reading tokens directly from the host filesystem. 
-->
當前，有兩種不是那麼理想的方法來實現這一目的，要麼通過授予 CSI 驅動程序使用 TokenRequest API 的權限，要麼直接從主機文件系統中讀取令牌。

<!--
Both of them exhibit the following drawbacks:
-->
兩者都存在以下缺點：

<!--
- Violating the principle of least privilege
- Every CSI driver needs to re-implement the logic of getting the pod’s service account token
-->
- 違反最少特權原則
- 每個 CSI 驅動程序都需要重新實現獲取 Pod 的服務帳戶令牌的邏輯

<!--
The second approach is more problematic due to:
-->
第二種方式問題更多，因爲：

<!--
- The audience of the token defaults to the kube-apiserver
- The token is not guaranteed to be available (e.g. `AutomountServiceAccountToken=false`)
- The approach does not work for CSI drivers that run as a different (non-root) user from the pods. See [file permission section for service account token](https://github.com/kubernetes/enhancements/blob/f40c24a5da09390bd521be535b38a4dbab09380c/keps/sig-storage/20180515-svcacct-token-volumes.md#file-permission)
- The token might be legacy Kubernetes service account token which doesn’t expire if `BoundServiceAccountTokenVolume=false`
-->
- 令牌的受衆默認爲 kube-apiserver
- 該令牌不能保證可用（例如，`AutomountServiceAccountToken=false`）
- 該方法不適用於以與 Pod 不同的（非 root 使用者）使用者身份運行的 CSI 驅動程序。請參見
  [服務帳戶令牌的文件許可權部分](https://github.com/kubernetes/enhancements/blob/f40c24a5da09390bd521be535b38a4dbab09380c/keps/sig-storage/20180515-svcacct-token-volumes.md#file-permission)
- 該令牌可能是舊的 Kubernetes 服務帳戶令牌，如果 `BoundServiceAccountTokenVolume=false`，該令牌不會過期。

<!--
Kubernetes 1.20 introduces an alpha feature, `CSIServiceAccountToken`, to improve the security posture. The new feature allows CSI drivers to receive pods' [bound service account tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md).
-->
Kubernetes 1.20 引入了一個內測功能 `CSIServiceAccountToken` 以改善安全狀況。這項新功能允許 CSI 驅動程序接收 Pod 的[綁定服務帳戶令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)。

<!--
This feature also provides a knob to re-publish volumes so that short-lived volumes can be refreshed.
-->
此功能還提供了一個重新發布卷的能力，以便可以刷新短時卷。

<!--
## Pod Impersonation

### Using GCP APIs
-->
## Pod 身份假扮

### 使用 GCP APIs

<!--
Using [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity), a Kubernetes service account can authenticate as a Google service account when accessing Google Cloud APIs. If a CSI driver needs to access GCP APIs on behalf of the pods that it is mounting volumes for, it can use the pod's service account token to [exchange for GCP tokens](https://cloud.google.com/iam/docs/reference/sts/rest). The pod's service account token is plumbed through the volume context in `NodePublishVolume` RPC calls when the feature `CSIServiceAccountToken` is enabled. For example: accessing [Google Secret Manager](https://cloud.google.com/secret-manager/) via a [secret store CSI driver](https://github.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp).
-->
使用 [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)，Kubernetes 服務帳戶可以在訪問 Google Cloud API 時驗證爲 Google 服務帳戶。
如果 CSI 驅動程序要代表其爲掛載卷的 Pod 訪問 GCP API，則可以使用 Pod 的服務帳戶令牌來
[交換 GCP 令牌](https://cloud.google.com/iam/docs/reference/sts/rest)。啓用功能 `CSIServiceAccountToken` 後，
可通過 `NodePublishVolume` RPC 調用中的捲上下文來訪問 Pod 的服務帳戶令牌。例如：通過 [Secret 存儲 CSI 驅動](https://github.com/GoogleCloudPlatform/secrets-store-csi-driver-provider-gcp)
訪問 [Google Secret Manager](https://cloud.google.com/secret-manager/)。

<!--
### Using Vault

If users configure [Kubernetes as an auth method](https://www.vaultproject.io/docs/auth/kubernetes), Vault uses the `TokenReview` API to validate the Kubernetes service account token. For CSI drivers using Vault as resources provider, they need to present the pod's service account to Vault. For example, [secrets store CSI driver](https://github.com/hashicorp/secrets-store-csi-driver-provider-vault) and [cert manager CSI driver](https://github.com/jetstack/cert-manager-csi).
-->
### 使用Vault

如果使用者將 [Kubernetes 作爲身份驗證方法](https://www.vaultproject.io/docs/auth/kubernetes)設定，
則 Vault 使用 `TokenReview` API 來驗證 Kubernetes 服務帳戶令牌。
對於使用 Vault 作爲資源提供者的 CSI 驅動程序，它們需要將 Pod 的服務帳戶提供給 Vault。
例如，[Secret 存儲 CSI 驅動](https://github.com/hashicorp/secrets-store-csi-driver-provider-vault)和
[證書管理器 CSI 驅動](https://github.com/jetstack/cert-manager-csi)。

<!--
## Short-lived Volumes

To keep short-lived volumes such as certificates effective, CSI drivers can specify `RequiresRepublish=true` in their`CSIDriver` object to have the kubelet periodically call `NodePublishVolume` on mounted volumes. These republishes allow CSI drivers to ensure that the volume content is up-to-date.
-->
## 短時卷

爲了使諸如證書之類的短時卷保持有效，CSI 驅動程序可以在其 `CSIDriver` 對象中指定 `RequiresRepublish=true`，
以使 kubelet 定期針對已掛載的卷調用 `NodePublishVolume`。
這些重新發布操作使 CSI 驅動程序可以確保卷內容是最新的。

<!--
## Next steps

This feature is alpha and projected to move to beta in 1.21. See more in the following KEP and CSI documentation:
-->
## 下一步

此功能是 Alpha 版，預計將在 1.21 版中移至 Beta 版。 請參閱以下 KEP 和 CSI 文檔中的更多內容：

<!--
- [KEP-1855: Service Account Token for CSI Driver](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1855-csi-driver-service-account-token/README.md)
- [Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html)
-->
- [KEP-1855: CSI 驅動程序的服務帳戶令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1855-csi-driver-service-account-token/README.md)
- [令牌請求](https://kubernetes-csi.github.io/docs/token-requests.html)

<!--
Your feedback is always welcome!
- SIG-Auth [meets regularly](https://github.com/kubernetes/community/tree/master/sig-auth#meetings) and can be reached via [Slack and the mailing list](https://github.com/kubernetes/community/tree/master/sig-auth#contact)
- SIG-Storage [meets regularly](https://github.com/kubernetes/community/tree/master/sig-storage#meetings) and can be reached via [Slack and the mailing list](https://github.com/kubernetes/community/tree/master/sig-storage#contact).
-->
隨時歡迎您提供反饋!
- SIG-Auth [定期開會](https://github.com/kubernetes/community/tree/master/sig-auth#meetings)，可以通過 [Slack 和郵件列表](https://github.com/kubernetes/community/tree/master/sig-auth#contact)加入
- SIG-Storage [定期開會](https://github.com/kubernetes/community/tree/master/sig-storage#meetings)，可以通過 [Slack 和郵件列表](https://github.com/kubernetes/community/tree/master/sig-storage#contact)加入

