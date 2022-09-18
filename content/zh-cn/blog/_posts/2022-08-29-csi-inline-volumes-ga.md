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

CSI Inline Volumes are similar to other ephemeral volume types, such as `configMap`, `downwardAPI` and `secret`. The important difference is that the storage is provided by a CSI driver, which allows the use of ephemeral storage provided by third-party vendors. The volume is defined as part of the pod spec and follows the lifecycle of the pod, meaning the volume is created once the pod is scheduled and destroyed when the pod is destroyed.
-->
CSI 内联卷（Inline Volume）是在 Kubernetes 1.15 中作为 Alpha 特性引入的，并且自 1.16 以来一直是 Beta 版。
我们很高兴地宣布，此特性已在 Kubernetes 1.25 中进入正式发布（GA）。

CSI 内联卷类似于其他临时卷类型，例如 `configMap`、`downwardAPI` 和 `secret`。 
重要的区别在于其存储由 CSI 驱动程序提供，允许使用第三方供应商提供的临时存储。
卷被定义为 Pod 规约的一部分，并遵循 Pod 的生命周期，这意味着卷在 Pod 被调度后创建，
在 Pod 被销毁时被销毁。

<!--
## What's new in 1.25?

There are a couple of new bug fixes related to this feature in 1.25, and the [CSIInlineVolume feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) has been locked to `True` with the graduation to GA. There are no new API changes, so users of this feature during beta should not notice any significant changes aside from these bug fixes.

- [#89290 - CSI inline volumes should support fsGroup](https://github.com/kubernetes/kubernetes/issues/89290)
- [#79980 - CSI volume reconstruction does not work for ephemeral volumes](https://github.com/kubernetes/kubernetes/issues/79980)
-->
## 1.25 中的新变化

在 1.25 中有几个与此特性相关的新错误修复，
并且 [CSIInlineVolume 特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
已经在 GA 毕业时锁定为 "True" 值。因为没有发生新的 API 变更，因此对于在测试期间使用了此特性的用户，
应该不会注意到除了这些错误修复之外的任何重大变更。

- [#89290 - CSI 内联卷应支持 fsGroup](https://github.com/kubernetes/kubernetes/issues/89290)
- [#79980 - CSI 卷重建不适用于临时卷](https://github.com/kubernetes/kubernetes/issues/79980)

<!--
## When to use this feature

CSI inline volumes are meant for simple local volumes that should follow the lifecycle of the pod. They may be useful for providing secrets, configuration data, or other special-purpose storage to the pod from a CSI driver.

A CSI driver is not suitable for inline use when:
- The volume needs to persist longer than the lifecycle of a pod
- Volume snapshots, cloning, or volume expansion are required
- The CSI driver requires `volumeAttributes` that should be restricted to an administrator
-->
## 何时使用此特性

CSI 内联卷适用于应该遵循 Pod 生命周期的简单本地卷。 
它们对于使用 CSI 驱动来向 Pod 提供 Secret、配置数据或其他专用存储可能很有用。

在以下情况下，CSI 驱动程序不适合内联使用：

- 卷需要持续的时间比 Pod 的生命周期长
- 卷需要快照、克隆或扩容
- CSI 驱动程序需要应仅限于管理员的 `volumeAttributes`

<!--
## How to use this feature

In order to use this feature, the `CSIDriver` spec must explicitly list `Ephemeral` as one of the supported `volumeLifecycleModes`. Here is a simple example from the [Secrets Store CSI Driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).
-->
## 如何使用此特性

为了使用此特性，`CSIDriver` 规范必须明确将 `Ephemeral` 列为受支持的 `volumeLifecycleModes` 之一。
下面是 [Secrets Store CSI 驱动](https://github.com/kubernetes-sigs/secrets-store-csi-driver)中的一个简单示例。

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
所有 Pod 规约都可以引用该 CSI 驱动来创建内联卷，如本例所示。

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
如果驱动程序支持任何卷属性，你也可以在 Pod 的 `spec` 中提供这些属性：

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
## 示例用例

支持 `Ephemeral` 卷生命周期模式的两个现有 CSI 驱动是 Secrets Store CSI 驱动和 Cert-Manager CSI 驱动。

[Secrets Store CSI 驱动](https://github.com/kubernetes-sigs/secrets-store-csi-driver)允许用户将来自外部
Secret 存储的 Secret 作为内联卷挂载到 Pod 中。
当 Secret 存储在外部托管服务或 Vault 实例中时，这可能很有用。

[Cert-Manager CSI 驱动程序](https://github.com/cert-manager/csi-driver) 与 [cert-manager](https://cert-manager.io/)
协同工作以无缝请求和挂载将证书密钥对放入一个 Pod，这允许证书在应用程序 Pod 中自动更新。

<!--
## Security Considerations

Special consideration should be given to which CSI drivers may be used as inline volumes. `volumeAttributes` are typically controlled through the `StorageClass`, and may contain attributes that should remain restricted to the cluster administrator. Allowing a CSI driver to be used for inline ephmeral volumes means that any user with permission to create pods may also provide `volumeAttributes` to the driver through a pod spec.

Cluster administrators may choose to omit (or remove) `Ephemeral` from `volumeLifecycleModes` in the CSIDriver spec to prevent the driver from being used as an inline ephemeral volume, or use an [admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/) to restrict how the driver is used.
-->
## 安全性注意事项

你需要特别注意哪些 CSI 驱动可用作内联卷。`volumeAttributes` 通常是通过 `StorageClass` 控制的，
并且可能包含仍应仅限于集群管理员的属性。允许将 CSI 驱动用于内联临时卷意味着任何有权创建
Pod 的用户也可以通过 Pod 规范向驱动程序提供 `volumeAttributes`。

<!--
## References

For more information on this feature, see:

- [Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
- [CSI documentation](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [KEP-596](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/596-csi-inline-volumes/README.md)
- [Beta blog post for CSI Inline Volumes](https://kubernetes.io/blog/2020/01/21/csi-ephemeral-inline-volumes/)
-->
## 参考

有关此特性的更多信息，请参阅：

- [Kubernetes 文档](/zh-cn/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes)
- [CSI 文档](https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html)
- [KEP-596](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/596-csi-inline-volumes/README.md)
- [CSI Inline Volumes 的 Beta 版博客文章](https://kubernetes.io/blog/2020/01/21/csi-ephemeral-inline-volumes/)