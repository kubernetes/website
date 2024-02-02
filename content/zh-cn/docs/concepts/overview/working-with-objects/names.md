---
title: 对象名称和 ID
content_type: concept
weight: 30
---
<!--
reviewers:
- mikedanese
- thockin
title: Object Names and IDs
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
Each {{< glossary_tooltip text="object" term_id="object" >}} in your cluster has a [_Name_](#names) that is unique for that type of resource.
Every Kubernetes object also has a [_UID_](#uids) that is unique across your whole cluster.

For example, you can only have one Pod named `myapp-1234` within the same [namespace](/docs/concepts/overview/working-with-objects/namespaces/), but you can have one Pod and one Deployment that are each named `myapp-1234`.
-->

集群中的每一个{{< glossary_tooltip text="对象" term_id="object" >}}都有一个[**名称**](#names)来标识在同类资源中的唯一性。

每个 Kubernetes 对象也有一个 [**UID**](#uids) 来标识在整个集群中的唯一性。

比如，在同一个[名字空间](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
中只能有一个名为 `myapp-1234` 的 Pod，但是可以命名一个 Pod 和一个 Deployment 同为 `myapp-1234`。

<!--
For non-unique user-provided attributes, Kubernetes provides [labels](/docs/concepts/overview/working-with-objects/labels/) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).
-->
对于用户提供的非唯一性的属性，Kubernetes
提供了[标签（Label）](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和
[注解（Annotation）](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)机制。

<!-- body -->

<!--
## Names
-->
## 名称  {#names}

{{< glossary_definition term_id="name" length="all" >}}

<!--
**Names must be unique across all [API versions](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)
of the same resource. API resources are distinguished by their API group, resource type, namespace
(for namespaced resources), and name. In other words, API version is irrelevant in this context.**
-->
**名称在同一资源的所有
[API 版本](/zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)中必须是唯一的。
这些 API 资源通过各自的 API 组、资源类型、名字空间（对于划分名字空间的资源）和名称来区分。
换言之，API 版本在此上下文中是不相关的。**

{{< note >}}
<!--
In cases when objects represent a physical entity, like a Node representing a physical host, when the host is re-created under the same name without deleting and re-creating the Node, Kubernetes treats the new host as the old one, which may lead to inconsistencies.
-->
当对象所代表的是一个物理实体（例如代表一台物理主机的 Node）时，
如果在 Node 对象未被删除并重建的条件下，重新创建了同名的物理主机，
则 Kubernetes 会将新的主机看作是老的主机，这可能会带来某种不一致性。
{{< /note >}}

<!--
Below are four types of commonly used name constraints for resources.
-->
以下是比较常见的四种资源命名约束。

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
### DNS 子域名  {#dns-subdomain-names}

很多资源类型需要可以用作 DNS 子域名的名称。
DNS 子域名的定义可参见 [RFC 1123](https://tools.ietf.org/html/rfc1123)。
这一要求意味着名称必须满足如下规则：

- 不能超过 253 个字符
- 只能包含小写字母、数字，以及 '-' 和 '.'
- 必须以字母数字开头
- 必须以字母数字结尾

<!--
### RFC 1123 Label Names {#dns-label-names}

Some resource types require their names to follow the DNS
label standard as defined in [RFC 1123](https://tools.ietf.org/html/rfc1123).
This means the name must:

- contain at most 63 characters
- contain only lowercase alphanumeric characters or '-'
- start with an alphanumeric character
- end with an alphanumeric character
-->
### RFC 1123 标签名    {#dns-label-names}

某些资源类型需要其名称遵循 [RFC 1123](https://tools.ietf.org/html/rfc1123)
所定义的 DNS 标签标准。也就是命名必须满足如下规则：

- 最多 63 个字符
- 只能包含小写字母、数字，以及 '-'
- 必须以字母数字开头
- 必须以字母数字结尾


<!--
### RFC 1035 Label Names

Some resource types require their names to follow the DNS
label standard as defined in [RFC 1035](https://tools.ietf.org/html/rfc1035).
This means the name must:

- contain at most 63 characters
- contain only lowercase alphanumeric characters or '-'
- start with an alphabetic character
- end with an alphanumeric character
-->
### RFC 1035 标签名   {#rfc-1035-label-names}

某些资源类型需要其名称遵循 [RFC 1035](https://tools.ietf.org/html/rfc1035)
所定义的 DNS 标签标准。也就是命名必须满足如下规则：

- 最多 63 个字符
- 只能包含小写字母、数字，以及 '-'
- 必须以字母开头
- 必须以字母数字结尾

{{< note >}}
<!--
The only difference between the RFC 1035 and RFC 1123
label standards is that RFC 1123 labels are allowed to
start with a digit, whereas RFC 1035 labels can start
with a lowercase alphabetic character only.
-->
RFC 1035 和 RFC 1123 标签标准之间的唯一区别是 RFC 1123
标签允许以数字开头，而 RFC 1035 标签只能以小写字母字符开头。
{{< /note >}}

<!--
### Path Segment Names

Some resource types require their names to be able to be safely encoded as a
path segment. In other words, the name may not be "." or ".." and the name may
not contain "/" or "%".
-->
### 路径分段名称    {#path-segment-names}

某些资源类型要求名称能被安全地用作路径中的片段。
换句话说，其名称不能是 `.`、`..`，也不可以包含 `/` 或 `%` 这些字符。

<!--
Here's an example manifest for a Pod named `nginx-demo`.
-->
下面是一个名为 `nginx-demo` 的 Pod 的配置清单：

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
某些资源类型可能具有额外的命名约束。
{{< /note >}}

## UID

{{< glossary_definition term_id="uid" length="all" >}}

<!--
Kubernetes UIDs are universally unique identifiers (also known as UUIDs).
UUIDs are standardized as ISO/IEC 9834-8 and as ITU-T X.667.
-->
Kubernetes UID 是全局唯一标识符（也叫 UUID）。
UUID 是标准化的，见 ISO/IEC 9834-8 和 ITU-T X.667。

## {{% heading "whatsnext" %}}

<!--
* Read about [labels](/docs/concepts/overview/working-with-objects/labels/) and [annotations](/docs/concepts/overview/working-with-objects/annotations/) in Kubernetes.
* See the [Identifiers and Names in Kubernetes](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md) design document.
-->
* 进一步了解 Kubernetes [标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和[注解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)。
* 参阅 [Kubernetes 标识符和名称](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md)的设计文档。
