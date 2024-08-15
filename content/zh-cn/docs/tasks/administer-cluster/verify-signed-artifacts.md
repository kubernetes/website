---
title: 验证已签名容器镜像
content_type: task
min-kubernetes-server-version: v1.24
weight: 420
---
<!--
title: Verify Signed Container Images
content_type: task
min-kubernetes-server-version: v1.24
weight: 420
-->

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.24" >}}

## {{% heading "prerequisites" %}}

<!--
You will need to have the following tools installed:

- `cosign` ([install guide](https://docs.sigstore.dev/cosign/installation/))
- `curl` (often provided by your operating system)
- `jq` ([download jq](https://jqlang.github.io/jq/download/))
-->
你需要安装以下工具：

- `cosign`（[安装指南](https://docs.sigstore.dev/cosign/installation/)）
- `curl`（通常由你的操作系统提供）
- `jq`（[下载 jq](https://jqlang.github.io/jq/download/)）


<!-- 
## Verifying binary signatures

The Kubernetes release process signs all binary artifacts (tarballs, SPDX files,
standalone binaries) by using cosign's keyless signing. To verify a particular
binary, retrieve it together with its signature and certificate: 
-->

## 验证二进制签名 {#verifying-binary-signatures}

Kubernetes 发布过程使用 cosign 的无密钥签名对所有二进制工件（压缩包、
SPDX 文件、 独立的二进制文件）签名。要验证一个特定的二进制文件，
获取组件时要包含其签名和证书：

```bash
URL=https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64
BINARY=kubectl

FILES=(
    "$BINARY"
    "$BINARY.sig"
    "$BINARY.cert"
)

for FILE in "${FILES[@]}"; do
    curl -sSfL --retry 3 --retry-delay 3 "$URL/$FILE" -o "$FILE"
done
```

<!--
Then verify the blob by using `cosign verify-blob`:
-->
然后使用 `cosign verify-blob` 验证二进制文件：

```shell
cosign verify-blob "$BINARY" \
  --signature "$BINARY".sig \
  --certificate "$BINARY".cert \
  --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com
```

{{< note >}}
<!-- 
Cosign 2.0 requires the `--certificate-identity` and `--certificate-oidc-issuer` options.

To learn more about keyless signing, please refer to [Keyless Signatures](https://docs.sigstore.dev/signing/overview/).

Previous versions of Cosign required that you set `COSIGN_EXPERIMENTAL=1`.

For additional information, please refer to the [sigstore Blog](https://blog.sigstore.dev/cosign-2-0-released/)
-->
Cosign 2.0 需要指定 `--certificate-identity` 和 `--certificate-oidc-issuer` 选项。

想要进一步了解无密钥签名，请参考
[Keyless Signatures](https://docs.sigstore.dev/signing/overview/)。

Cosign 的早期版本还需要设置 `COSIGN_EXPERIMENTAL=1`。

如需更多信息，请参考
[sigstore Blog](https://blog.sigstore.dev/cosign-2-0-released/)
{{< /note >}}

<!--
## Verifying image signatures

For a complete list of images that are signed please refer
to [Releases](/releases/download/).

Pick one image from this list and verify its signature using
the `cosign verify` command:
-->
## 验证镜像签名 {#verifying-image-signatures}

完整的镜像签名列表请参见[发行版本](/zh-cn/releases/download/)。

从这个列表中选择一个镜像，并使用 `cosign verify` 命令来验证它的签名：

```shell
cosign verify registry.k8s.io/kube-apiserver-amd64:v{{< skew currentPatchVersion >}} \
  --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com \
  | jq .
```

<!--
### Verifying images for all control plane components

To verify all signed control plane images for the latest stable version
(v{{< skew currentPatchVersion >}}), please run the following commands:
-->
### 验证所有控制平面组件镜像  {#verifying-images-for-all-control-plane-components}

验证最新稳定版（v{{< skew currentPatchVersion >}}）所有已签名的控制平面组件镜像，
请运行以下命令：

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" \
  | grep "SPDXID: SPDXRef-Package-registry.k8s.io" \
  | grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/' \
  | sort > images.txt
input=images.txt
while IFS= read -r image
do
  cosign verify "$image" \
    --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    | jq .
done < "$input"
```

<!--
Once you have verified an image, you can specify that image by its digest in your Pod
manifests as per this example:

For more information, please refer
to the [Image Pull Policy](/docs/concepts/containers/images/#image-pull-policy)
section.
-->
当你完成某个镜像的验证时，可以在你的 Pod 清单通过摘要值来指定该镜像，例如：

```console
registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2
```

要了解更多信息，请参考[镜像拉取策略](/zh-cn/docs/concepts/containers/images/#image-pull-policy)章节。

<!--
## Verifying Image Signatures with Admission Controller

For non-control plane images (for example
[conformance image](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md)),
signatures can also be verified at deploy time using
[sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview)
admission controller. 

Here are some helpful resources to get started with `policy-controller`:

* [Installation](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
* [Configuration Options](https://github.com/sigstore/policy-controller/tree/main/config)
-->
## 使用准入控制器验证镜像签名   {#verifying-image-signatures-with-admission-controller}

有一些非控制平面镜像
（例如 [conformance 镜像](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md)），
也可以在部署时使用
[sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview)
控制器验证其签名。以下是一些有助于你开始使用 `policy-controller` 的资源：

- [安装](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
- [配置选项](https://github.com/sigstore/policy-controller/tree/main/config)

<!--
## Verify the Software Bill Of Materials

You can verify the Kubernetes Software Bill of Materials (SBOM) by using the
sigstore certificate and signature, or the corresponding SHA files:
-->
## 验证软件物料清单   {#verify-the-software-bill-of-materials}

你可以使用 sigstore 证书和签名或相应的 SHA 文件来验证 Kubernetes 软件物料清单（SBOM）：

<!--
# Retrieve the latest available Kubernetes release version

# Verify the SHA512 sum

# Verify the SHA256 sum

# Retrieve sigstore signature and certificate

# Verify the sigstore signature
-->

```shell
# 检索最新可用的 Kubernetes 发行版本
VERSION=$(curl -Ls https://dl.k8s.io/release/stable.txt)

# 验证 SHA512 sum
curl -Ls "https://sbom.k8s.io/$VERSION/release" -o "$VERSION.spdx"
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha512") $VERSION.spdx" | sha512sum --check

# 验证 SHA256 sum
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha256") $VERSION.spdx" | sha256sum --check

# 检索 sigstore 签名和证书
curl -Ls "https://sbom.k8s.io/$VERSION/release.sig" -o "$VERSION.spdx.sig"
curl -Ls "https://sbom.k8s.io/$VERSION/release.cert" -o "$VERSION.spdx.cert"

# 验证 sigstore 签名
cosign verify-blob \
    --certificate "$VERSION.spdx.cert" \
    --signature "$VERSION.spdx.sig" \
    --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    "$VERSION.spdx"
```
