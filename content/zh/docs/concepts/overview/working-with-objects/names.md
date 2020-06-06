---
title: 对象名称和IDs
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

<!--
Each object in your cluster has a [_Name_](#names) that is unique for that type of resource.
Every Kubernetes object also has a [_UID_](#uids) that is unique across your whole cluster.

For example, you can only have one Pod named `myapp-1234` within the same [namespace](/docs/concepts/overview/working-with-objects/namespaces/), but you can have one Pod and one Deployment that are each named `myapp-1234`.
-->

集群中的每一个对象都一个[_名称_](#名称) 来标识在同类资源中的唯一性。

每个 Kubernetes 对象也有一个[_UID_](#uids) 来标识在整个集群中的唯一性。

比如，在同一个[namespace](/docs/concepts/overview/working-with-objects/namespaces/)中只能命名一个名为 `myapp-1234` 的 Pod, 但是可以命名一个 Pod 和一个 Deployment 同为 `myapp-1234`.

<!--
For non-unique user-provided attributes, Kubernetes provides [labels](/docs/user-guide/labels) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).

See the [identifiers design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) for the precise syntax rules for Names and 






.
-->

对于非唯一的用户提供的属性，Kubernetes 提供了[标签](/docs/user-guide/labels)和[注释](/docs/concepts/overview/working-with-objects/annotations/)。

有关名称和 UID 的精确语法规则，请参见[标识符设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md)。

{{% /capture %}}


{{% capture body %}}

<!--
## Names
-->

## 名称

{{< glossary_definition term_id="name" length="all" >}}

<!--
Below are three types of commonly used name constraints for resources.
-->

以下是比较常见的三种资源命名约束。

<!--
### DNS Subdomain Names

Most resource types require a name that can be used as a DNS subdomain name
as defined in [RFC 1123](https://tools.ietf.org/html/rfc1123).
This means the name must:

- contain no more than 253 characters
- contain only lowercase alphanumeric characters, '-' or '.'
- start with an alphanumeric character
- end with an alphanumeric character
-->

### DNS 子域名

某些资源类型需要一个 name 来作为一个 DNS 子域名，见定义 [RFC 1123](https://tools.ietf.org/html/rfc1123)。也就是命名必须满足如下规则：

- 不能超过253个字符
- 只能包含字母数字，以及'-' 和 '.'
- 须以字母数字开头
- 须以字母数字结尾

<!--
### DNS Label Names

Some resource types require their names to follow the DNS
label standard as defined in [RFC 1123](https://tools.ietf.org/html/rfc1123).
This means the name must:

- contain at most 63 characters
- contain only lowercase alphanumeric characters or '-'
- start with an alphanumeric character
- end with an alphanumeric character
-->

### DNS 标签名称

某些资源类型需要其名称遵循 DNS 标签的标准，见[RFC 1123](https://tools.ietf.org/html/rfc1123)。也就是命名必须满足如下规则：

- 最多63个字符
- 只能包含字母数字，以及'-'
- 须以字母数字开头
- 须以字母数字结尾

<!--
Some resource types require their names to be able to be safely encoded as a
path segment. In other words, the name may not be "." or ".." and the name may
not contain "/" or "%".
-->

### Path 部分名称

一些用与 Path 部分的资源类型要求名称能被安全的 encode。换句话说，其名称不能含有这些字符 "."、".."、"/"或"%"。

<!--
Here’s an example manifest for a Pod named `nginx-demo`.
-->

下面是一个名为`nginx-demo`的 Pod 的配置清单：

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
<!--
Some resource types have additional restrictions on their names.
-->

某些资源类型可能有其相应的附加命名约束。

{{< /note >}}


## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

<!--
Kubernetes UIDs are universally unique identifiers (also known as UUIDs).
UUIDs are standardized as ISO/IEC 9834-8 and as ITU-T X.667.
-->
Kubernetes UIDs 是通用的唯一标识符 (也叫 UUIDs).  
UUIDs 是标准化的，见 ISO/IEC 9834-8 和 ITU-T X.667.  

{{% /capture %}}

{{% capture whatsnext %}}
<!--
* Read about [labels](/docs/concepts/overview/working-with-objects/labels/) in Kubernetes.
* See the [Identifiers and Names in Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) design document.
-->
* 阅读关于 Kubernetes [labels](/docs/concepts/overview/working-with-objects/labels/)。  
* 更多参见 [Kubernetes 标识符和名称设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md).

{{% /capture %}}
