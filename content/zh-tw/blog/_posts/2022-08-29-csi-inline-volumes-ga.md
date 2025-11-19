---
layout: blog
title: "Kubernetes 1.25：CSI 內聯存儲卷正式發佈"
date: 2022-08-29
slug: csi-inline-volumes-ga
---
<!--
layout: blog
title: "Kubernetes 1.25: CSI Inline Volumes have graduated to GA"
date: 2022-08-29
slug: csi-inline-volumes-ga
-->

<!--
**Author:** Jonathan Dobson (Red Hat)
-->
**作者：** Jonathan Dobson (Red Hat)

<!--
CSI Inline Volumes were introduced as an alpha feature in Kubernetes 1.15 and have been beta since 1.16. We are happy to announce that this feature has graduated to General Availability (GA) status in Kubernetes 1.25.

CSI Inline Volumes are similar to other ephemeral volume types, such as `configMap`, `downwardAPI` and `secret`. The important difference is that the storage is provided by a CSI driver, which allows the use of ephemeral storage provided by third-party vendors. The volume is defined as part of the pod spec and follows the lifecycle of the pod, meaning the volume is created once the pod is scheduled and destroyed when the pod is destroyed.
-->
CSI 內聯存儲卷是在 Kubernetes 1.15 中作爲 Alpha 功能推出的，並從 1.16 開始成爲 Beta 版本。
我們很高興地宣佈，這項功能在 Kubernetes 1.25 版本中正式發佈（GA）。

CSI 內聯存儲卷與其他類型的臨時卷相似，如 `configMap`、`downwardAPI` 和 `secret`。
重要的區別是，存儲是由 CSI 驅動提供的，它允許使用第三方供應商提供的臨時存儲。
卷被定義爲 Pod 規約的一部分，並遵循 Pod 的生命週期，這意味着卷隨着 Pod 的調度而創建，並隨着 Pod 的銷燬而銷燬。

<!--
## What's new in 1.25?

There are a couple of new bug fixes related to this feature in 1.25, and the [CSIInlineVolume feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) has been locked to `True` with the graduation to GA. There are no new API changes, so users of this feature during beta should not notice any significant changes aside from these bug fixes.

- [#89290 - CSI inline volumes should support fsGroup](https://github.com/kubernetes/kubernetes/issues/89290)
- [#79980 - CSI volume reconstruction does not work for ephemeral volumes](https://github.com/kubernetes/kubernetes/issues/79980)
-->

## 1.25 版本有什麼新內容？

1.25 版本修復了幾個與 CSI 內聯存儲卷相關的漏洞，
並且 [CSIInlineVolume 特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
已正式發佈，鎖定爲 `True`。
因爲沒有新的 API 變化，所以除了這些錯誤修復外，使用該功能 Beta 版本的用戶應該不會注意到任何重大變化。

- [#89290 - CSI inline volumes should support fsGroup](https://github.com/kubernetes/kubernetes/issues/89290)
- [#79980 - CSI volume reconstruction does not work for ephemeral volumes](https://github.com/kubernetes/kubernetes/issues/79980)

<!--
## When to use this feature

CSI inline volumes are meant for simple local volumes that should follow the lifecycle of the pod. They may be useful for providing secrets, configuration data, or other special-purpose storage to the pod from a CSI driver.

A CSI driver is not suitable for inline use when:
- The volume needs to persist longer than the lifecycle of a pod
- Volume snapshots, cloning, or volume expansion are required
- The CSI driver requires `volumeAttributes` that should be restricted to an administrator
-->
## 何時使用此功能

CSI 內聯存儲卷是爲簡單的本地卷準備的，這種本地卷應該跟隨 Pod 的生命週期。
它們對於使用 CSI 驅動爲 Pod 提供 Secret、配置數據或其他特殊用途的存儲可能很有用。

在以下情況下，CSI 驅動不適合內聯使用：
- 卷需要持續的時間超過 Pod 的生命週期
- 卷快照、克隆或卷擴展是必需的
- CSI 驅動需要 `volumeAttributes` 字段，此字段應該限制給管理員使用

<!--
## How to use this feature

In order to use this feature, the `CSIDriver` spec must explicitly list `Ephemeral` as one of the supported `volumeLifecycleModes`. Here is a simple example from the [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).
-->
## 如何使用此功能

爲了使用這個功能，`CSIDriver` 規約必須明確將 `Ephemeral` 列舉爲 `volumeLifecycleModes` 的參數之一。
下面是一個來自 [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver) 的簡單例子。

```
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: secrets-store.csi.k8s.io
spec:
  podInfoOnMount: true
  attachRequired: false
  volumeLifecycleModes:
  - Ephemeral
```

<!--
Any pod spec may then reference that CSI driver to create an inline volume, as in this example.
-->
所有 Pod 規約都可以引用該 CSI 驅動來創建一個內聯卷，如下例所示。

```
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app-inline
spec:
  containers:
    - name: my-frontend
      image: busybox
      volumeMounts:
      - name: secrets-store-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
      command: [ "sleep", "1000000" ]
  volumes:
    - name: secrets-store-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "my-provider"
```

<!--
If the driver supports any volume attributes, you can provide these as part of the `spec` for the Pod as well:
-->
如果驅動程序支持一些卷屬性，你也可以將這些屬性作爲 Pod `spec` 的一部分。

```
      csi:
        driver: block.csi.vendor.example
        volumeAttributes:
          foo: bar
```

<!--
## Example Use Cases

Two existing CSI drivers that support the `Ephemeral` volume lifecycle mode are the Secrets Store CSI Driver and the Cert-Manager CSI Driver.

The [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver) allows users to mount secrets from external secret stores into a pod as an inline volume. This can be useful when the secrets are stored in an external managed service or Vault instance.

The [Cert-Manager CSI Driver](https://github.com/cert-manager/csi-driver) works along with [cert-manager](https://cert-manager.io/) to seamlessly request and mount certificate key pairs into a pod. This allows the certificates to be renewed and updated in the application pod automatically.
-->
## 使用案例示例

支持 `Ephemeral` 卷生命週期模式的兩個現有 CSI 驅動是 Secrets Store CSI 驅動和 Cert-Manager CSI 驅動。

[Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver)
允許用戶將 Secret 作爲內聯卷從外部掛載到一個 Pod 中。
當密鑰存儲在外部管理服務或 Vault 實例中時，這可能很有用。

[Cert-Manager CSI Driver](https://github.com/cert-manager/csi-driver) 與 [cert-manager](https://cert-manager.io/) 協同工作，
無縫地請求和掛載證書密鑰對到一個 Pod 中。這使得證書可以在應用 Pod 中自動更新。

<!--
## Security Considerations

Special consideration should be given to which CSI drivers may be used as inline volumes. `volumeAttributes` are typically controlled through the `StorageClass`, and may contain attributes that should remain restricted to the cluster administrator. Allowing a CSI driver to be used for inline ephmeral volumes means that any user with permission to create pods may also provide `volumeAttributes` to the driver through a pod spec.

Cluster administrators may choose to omit (or remove) `Ephemeral` from `volumeLifecycleModes` in the CSIDriver spec to prevent the driver from being used as an inline ephemeral volume, or use an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/) to restrict how the driver is used.
-->

## 安全考慮因素

應特別考慮哪些 CSI 驅動可作爲內聯卷使用。
`volumeAttributes` 通常通過 `StorageClass` 控制，並可能包含應限制給集羣管理員的屬性。
允許 CSI 驅動用於內聯臨時卷意味着任何有權限創建 Pod 的用戶也可以通過 Pod 規約向驅動提供 `volumeAttributes` 字段。

集羣管理員可以選擇從 CSIDriver 規約中的 `volumeLifecycleModes` 中省略（或刪除） `Ephemeral`，
以防止驅動被用作內聯臨時卷，或者使用[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/) 來限制驅動的使用。

<!--
## References

For more information on this feature, see:

- [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
- [CSI documentation](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [KEP-596](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/596-csi-inline-volumes/README.md)
- [Beta blog post for CSI Inline Volumes](https://kubernetes.io/blog/2020/01/21/csi-ephemeral-inline-volumes/)
-->
## 參考資料

關於此功能的更多信息，請參閱：

- [Kubernetes 文檔](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
- [CSI 文檔](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [KEP-596](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/596-csi-inline-volumes/README.md)
- [CSI 內聯存儲卷的 Beta 階段博客文章](https://kubernetes.io/blog/2020/01/21/csi-ephemeral-inline-volumes/)

