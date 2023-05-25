---
reviewers:
title: オブジェクトの名前とID
content_type: concept
weight: 30
---

<!-- overview -->

クラスター内の各オブジェクトには、そのタイプのリソースに固有の[_名前_](#names)があります。すべてのKubernetesオブジェクトには、クラスター全体で一意の[_UID_](#uids)もあります。

たとえば、同じ[名前空間](/ja/docs/concepts/overview/working-with-objects/namespaces/)内に`myapp-1234`という名前のPodは1つしか含められませんが、`myapp-1234`という名前の1つのPodと1つのDeploymentを含めることができます。

ユーザーが一意ではない属性を付与するために、Kubernetesは[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)と[アノテーション](/ja/docs/concepts/overview/working-with-objects/annotations/)を提供しています。



<!-- body -->

## 名前 {#names}

{{< glossary_definition term_id="name" length="all" >}}

次の3つの命名規則がよく使われます。

### DNSサブドメイン名 {#dns-subdomain-names}

ほとんどのリソースタイプには、[RFC 1123](https://tools.ietf.org/html/rfc1123)で定義されているDNSサブドメイン名として使用できる名前が必要です。
つまり、名前は次のとおりでなければなりません:

- 253文字以内
- 英小文字、数字、「-」または「.」のみを含む
- 英数字で始まる
- 英数字で終わる

### DNSラベル名 {#dns-label-names}

一部のリソースタイプでは、[RFC 1123](https://tools.ietf.org/html/rfc1123)で定義されているDNSラベル標準に従う名前が必要です。
つまり、名前は次のとおりでなければなりません:

- 63文字以内
- 英小文字、数字または「-」のみを含む
- 英数字で始まる
- 英数字で終わる

### パスセグメント名 {#path-segment-names}

一部のリソースタイプでは、名前をパスセグメントとして安全にエンコードできるようにする必要があります。
つまり、名前を「.」や「..」にすることはできず、名前に「/」または「%」を含めることはできません。

以下は、`nginx-demo`という名前のPodのマニフェストの例です。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

{{< note >}}
一部のリソースタイプには、名前に追加の制限があります。
{{< /note >}}

## UID {#uids}

{{< glossary_definition term_id="uid" length="all" >}}

Kubernetes UIDは、UUIDのことを指します。
UUIDは、ISO/IEC 9834-8およびITU-T X.667として標準化されています。

## {{% heading "whatsnext" %}}
* Kubernetesの[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)についてお読みください。
* [Kubernetesの識別子と名前](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md)デザインドキュメントをご覧ください。
