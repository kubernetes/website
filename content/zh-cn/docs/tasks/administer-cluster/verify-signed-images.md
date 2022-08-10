---
title: 验证已签名容器镜像
content_type: task
min-kubernetes-server-version: v1.24
---
<!--
title: Verify Signed Container Images
content_type: task
min-kubernetes-server-version: v1.24
-->

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.24" >}}

## {{% heading "prerequisites" %}}

<!--
These instructions are for Kubernetes {{< skew currentVersion >}}. If you want
to check the integrity of components for a different version of Kubernetes,
check the documentation for that Kubernetes release.

You will need to have the following tools installed:

- `cosign` ([install guide](https://docs.sigstore.dev/cosign/installation/))
- `curl` (often provided by your operating system)
-->
这些说明适用于 Kubernetes {{< skew currentVersion >}}。如果你想要检查其他版本的 Kubernetes 组件的完整性，
请查看对应 Kubernetes 版本的文档。

你需要安装以下工具:

- `cosign` ([安装指南](https://docs.sigstore.dev/cosign/installation/))
- `curl` (通常由你的操作系统提供)

<!--
## Verifying image signatures

For a complete list of images that are signed please refer
to [Releases](/releases/download/).

Let's pick one image from this list and verify its signature using
the `cosign verify` command:
-->
## 验证镜像签名 {#verifying-image-signatures}

完整的镜像签名列表请参见[发行版本](/releases/download/)。

我们从这个列表中选择一个镜像，并使用 `cosign verify` 命令来验证它的签名：

```shell
COSIGN_EXPERIMENTAL=1 cosign verify k8s.gcr.io/kube-apiserver-amd64:v1.24.0
```

{{< note >}}
<!--
`COSIGN_EXPERIMENTAL=1` is used to allow verification of images signed
in `KEYLESS` mode. To learn more about keyless signing, please refer to
[Keyless Signatures](https://github.com/sigstore/cosign/blob/main/KEYLESS.md#keyless-signatures)
-->
`COSIGN_EXPERIMENTAL=1` 用于对以 `KEYLESS` 模式签名的镜像进行验证。想要进一步了解 `KEYLESS`，请参考
[Keyless Signatures](https://github.com/sigstore/cosign/blob/main/KEYLESS.md#keyless-signatures)。
{{< /note >}}

<!--
### Verifying images for all control plane components

To verify all signed control plane images, please run this command:
-->
### 验证所有控制平面组件镜像  {#verifying-images-for-all-control-plane-components}

验证所有已签名的控制平面组件镜像，请运行以下命令：

```shell
curl -Ls https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/latest.txt)/release | grep 'PackageName: k8s.gcr.io/' | awk '{print $2}' > images.txt
input=images.txt
while IFS= read -r image
do
  COSIGN_EXPERIMENTAL=1 cosign verify "$image"
done < "$input"
```

<!--
Once you have verified an image, specify that image by its digest in your Pod
manifests as per this
example: `registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`.

For more information, please refer
to [Image Pull Policy](/docs/concepts/containers/images/#image-pull-policy)
section.
-->
当你完成某个镜像的验证时，可以在你的 Pod 清单通过摘要值来指定该镜像，例如：
`registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`。

要了解更多信息，请参考[镜像拉取策略](/zh-cn/docs/concepts/containers/images/#image-pull-policy)章节。

<!--
## Verifying Image Signatures with Admission Controller

For non-control plane images (
e.g. [conformance image](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md))
, signatures can also be verified at deploy time using
[sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview)
admission controller. To get started with `policy-controller` here are a few helpful
resources:

* [Installation](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
* [Configuration Options](https://github.com/sigstore/policy-controller/tree/main/config)
-->
## 使用准入控制器验证镜像签名   {#verifying-image-signatures-with-admission-controller}

有一些非控制平面镜像
（例如 [conformance 镜像](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md)），
也可以在部署时使用
[sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview)
控制器验证其签名。如要使用 `policy-controller`，下面是一些有帮助的资源：

* [安装](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
* [配置选项](https://github.com/sigstore/policy-controller/tree/main/config)

