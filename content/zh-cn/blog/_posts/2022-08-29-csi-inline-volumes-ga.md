---
layout: blog
title: "Kubernetes 1.25: CSI Inline Volumes 已升级到 GA"
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
-->
CSI Inline Volumes 是在 Kubernetes 1.15 中作为 alpha 功能推出的，并从 1.16 开始成为 Beta 版。
我们很高兴地宣布，此功能已在 Kubernetes 1.25 中升级为通用可用性 (GA) 状态。


<!--
CSI Inline Volumes are similar to other ephemeral volume types, such as `configMap`, `downwardAPI` and `secret`. The important difference is that the storage is provided by a CSI driver, which allows the use of ephemeral storage provided by third-party vendors. The volume is defined as part of the pod spec and follows the lifecycle of the pod, meaning the volume is created once the pod is scheduled and destroyed when the pod is destroyed.
-->
CSI Inline Volumes 与其他临时卷类型类似，例如 `configMap`、`downwardAPI` 和 `secret`。 
重要的区别在于存储是由 CSI 驱动程序提供，它允许使用第三方供应商提供的临时存储。卷被定义为 Pod 规范的一部分，
并遵循 Pod 的生命周期，这意味着卷在 Pod 被调度后创建，并在 Pod 被销毁时被销毁。

<!--
## What's new in 1.25?

There are a couple of new bug fixes related to this feature in 1.25, and the [CSIInlineVolume feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) has been locked to `True` with the graduation to GA. There are no new API changes, so users of this feature during beta should not notice any significant changes aside from these bug fixes.
-->
## 1.25 有什么新功能？

在 1.25 中有几个与此功能相关的新错误修复，并且 [CSIInlineVolume 特性门控](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) 
已经 在 GA 毕业时锁定为 `True`。 没有新的 API 变化，所以除了这些问题修复外，测试期间使用该功能的用户应该不会注意到其他重大变化。

<!--
- [#89290 - CSI inline volumes should support fsGroup](https://github.com/kubernetes/kubernetes/issues/89290)
- [#79980 - CSI volume reconstruction does not work for ephemeral volumes](https://github.com/kubernetes/kubernetes/issues/79980)
-->
- [#89290 - CSI inline volumes 应支持 fsGroup](https://github.com/kubernetes/kubernetes/issues/89290)
- [#79980 - CSI volume 的重建对临时卷不起作用](https://github.com/kubernetes/kubernetes/issues/79980)

<!--
## When to use this feature

CSI inline volumes are meant for simple local volumes that should follow the lifecycle of the pod. They may be useful for providing secrets, configuration data, or other special-purpose storage to the pod from a CSI driver.
-->
## 何时使用此功能

CSI inline volumes 适用于遵循 Pod 生命周期的简单本地卷。
它们对于从 CSI 驱动程序向 Pod 提供秘密、配置数据或其他特殊用途的存储可能很有用。

<!--
A CSI driver is not suitable for inline use when:
- The volume needs to persist longer than the lifecycle of a pod
- Volume snapshots, cloning, or volume expansion are required
- The CSI driver requires `volumeAttributes` that should be restricted to an administrator
-->
在以下情况下，CSI 驱动不适合内联使用：
- 卷需要比 Pod 的生命周期更长的时间
- 需要卷快照、克隆或卷扩展
- CSI 驱动需要 `volumeAttributes` ，该属性应仅限于管理员使用
- 
<!--
## How to use this feature

In order to use this feature, the `CSIDriver` spec must explicitly list `Ephemeral` as one of the supported `volumeLifecycleModes`. Here is a simple example from the [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).
-->
## 如何使用此功能

为了使用该功能，`CSIDriver` 规范必须明确将 `Ephemeral` 列为受支持的 `volumeLifecycleModes` 之一。
下面是一个来自[Secrets Store CSI 驱动程序](https://github.com/kubernetes-sigs/secrets-store-csi-driver)的简单示例。

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
如果驱动程序支持任何卷的属性，你也可以将这些属性作为Pod的`spec'的一部分：

```
      csi:
        driver: block.csi.vendor.example
        volumeAttributes:
          foo: bar
```

<!--
## Example Use Cases

Two existing CSI drivers that support the `Ephemeral` volume lifecycle mode are the Secrets Store CSI Driver and the Cert-Manager CSI Driver.
-->
## 示例用例

支持 `临时` 卷生命周期模式的两个现有 CSI 驱动程序是 Secrets Store CSI 驱动程序和 Cert-Manager CSI 驱动程序。

<!--
The [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver) allows users to mount secrets from external secret stores into a pod as an inline volume. This can be useful when the secrets are stored in an external managed service or Vault instance.
-->
[Secrets Store CSI 驱动](https://github.com/kubernetes-sigs/secrets-store-csi-driver)
允许用户将来自外部秘密存储的秘密挂载到 Pod 作为内联卷。当秘密存储在外部托管服务或 Vault 实例中时，这可能很有用。

<!--
The [Cert-Manager CSI Driver](https://github.com/cert-manager/csi-driver) works along with [cert-manager](https://cert-manager.io/) to seamlessly request and mount certificate key pairs into a pod. This allows the certificates to be renewed and updated in the application pod automatically.
-->
[Cert-Manager CSI 驱动](https://github.com/cert-manager/csi-driver) 与 [cert-manager](https://cert-manager.io/) 协同工作，
以无缝地请求和挂载将证书密钥对放入一个 Pod。这使得证书可以在应用程序 Pod 中自动更新。

<!--
## Security Considerations

Special consideration should be given to which CSI drivers may be used as inline volumes. `volumeAttributes` are typically controlled through the `StorageClass`, and may contain attributes that should remain restricted to the cluster administrator. Allowing a CSI driver to be used for inline ephmeral volumes means that any user with permission to create pods may also provide `volumeAttributes` to the driver through a pod spec.
-->
## 安全注意事项

应特别考虑哪些 CSI 驱动可用作内联卷。`volumeAttributes` 通常是通过 `StorageClass` 控制的，
并可能包含应限制给集群管理员的属性。允许将 CSI 驱动程序用于内联临时卷意味着任何有权创建 Pod 的用户也可以通过 Pod 规范向驱动程序提供 `volumeAttributes`。


<!--
Cluster administrators may choose to omit (or remove) `Ephemeral` from `volumeLifecycleModes` in the CSIDriver spec to prevent the driver from being used as an inline ephemeral volume, or use an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/) to restrict how the driver is used.
-->
集群管理员可以选择在 CSIDriver 规范的 `volumeLifecycleModes` 中省略（或删除）`Ephemeral`，
以防止驱动被用作内联临时卷，或者使用 [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)
来限制驱动程序的使用。

<!--
## References

For more information on this feature, see:
-->
## 参考

有关此功能的更多信息，请参阅：

<!--
- [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
- [CSI documentation](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [KEP-596](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/596-csi-inline-volumes/README.md)
- [Beta blog post for CSI Inline Volumes](https://kubernetes.io/blog/2020/01/21/csi-ephemeral-inline-volumes/)
-->
- [Kubernetes 文档](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
- [CSI 文档](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [KEP-596](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/596-csi-inline-volumes/README.md)
- [CSI Inline Volumes 的 Beta 版博客文章](https://kubernetes.io/blog/2020/01/21/csi-ephemeral-inline-volumes/)