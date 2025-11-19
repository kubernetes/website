---
title: 對象名稱和 ID
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

集羣中的每一個{{< glossary_tooltip text="對象" term_id="object" >}}都有一個[**名稱**](#names)來標識在同類資源中的唯一性。

每個 Kubernetes 對象也有一個 [**UID**](#uids) 來標識在整個集羣中的唯一性。

比如，在同一個[名字空間](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
中只能有一個名爲 `myapp-1234` 的 Pod，但是可以命名一個 Pod 和一個 Deployment 同爲 `myapp-1234`。

<!--
For non-unique user-provided attributes, Kubernetes provides [labels](/docs/concepts/overview/working-with-objects/labels/) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).
-->
對於用戶提供的非唯一性的屬性，Kubernetes
提供了[標籤（Label）](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和
[註解（Annotation）](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)機制。

<!-- body -->

<!--
## Names
-->
## 名稱  {#names}

{{< glossary_definition term_id="name" length="all" >}}

<!--
**Names must be unique across all [API versions](/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)
of the same resource. API resources are distinguished by their API group, resource type, namespace
(for namespaced resources), and name. In other words, API version is irrelevant in this context.**
-->
**名稱在同一資源的所有
[API 版本](/zh-cn/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning)中必須是唯一的。
這些 API 資源通過各自的 API 組、資源類型、名字空間（對於劃分名字空間的資源）和名稱來區分。
換言之，API 版本在此上下文中是不相關的。**

{{< note >}}
<!--
In cases when objects represent a physical entity, like a Node representing a physical host, when the host is re-created under the same name without deleting and re-creating the Node, Kubernetes treats the new host as the old one, which may lead to inconsistencies.
-->
當對象所代表的是一個物理實體（例如代表一臺物理主機的 Node）時，
如果在 Node 對象未被刪除並重建的條件下，重新創建了同名的物理主機，
則 Kubernetes 會將新的主機看作是老的主機，這可能會帶來某種不一致性。
{{< /note >}}

<!--
The server may generate a name when `generateName` is provided instead of `name` in a resource create request.
When `generateName` is used, the provided value is used as a name prefix, which server appends a generated suffix
to. Even though the name is generated, it may conflict with existing names resulting in an HTTP 409 response. This
became far less likely to happen in Kubernetes v1.31 and later, since the server will make up to 8 attempts to generate a
unique name before returning an HTTP 409 response.
-->
當在資源創建請求中提供 `generateName` 而不是 `name` 時，服務器可能會生成一個名稱。
使用 `generateName` 時，所提供的值將作爲名稱前綴，服務器會在其後附加一個生成的後綴。
即使名稱是自動生成的，它仍可能與現有名稱衝突，從而導致 HTTP 409 響應。
從 Kubernetes v1.31 及更高版本開始，這種情況發生的概率大大降低，
因爲服務器會嘗試最多 8 次生成唯一名稱，然後才返回 HTTP 409 響應。

<!--
Below are four types of commonly used name constraints for resources.
-->
以下是比較常見的四種資源命名約束。

<!--
### DNS Subdomain Names

Most resource types require a name that can be used as a DNS subdomain name
as defined in [RFC 1123](https://tools.ietf.org/html/rfc1123).
This means the name must:

- contain no more than 253 characters
- contain only lowercase alphanumeric characters, '-' or '.'
- start with an alphabetic character
- end with an alphanumeric character
-->
### DNS 子域名  {#dns-subdomain-names}

很多資源類型需要可以用作 DNS 子域名的名稱。
DNS 子域名的定義可參見 [RFC 1123](https://tools.ietf.org/html/rfc1123)。
這一要求意味着名稱必須滿足如下規則：

- 不能超過 253 個字符
- 只能包含小寫字母、數字，以及 '-' 和 '.'
- 必須以字母開頭
- 必須以字母數字結尾

{{< note >}}
<!--
When the `RelaxedServiceNameValidation` feature gate is enabled,
Service object names are allowed to start with a digit.
-->
當啓用 `RelaxedServiceNameValidation` 特性門控時，
Service 對象名稱可以以數字開頭。
{{< /note >}}

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
### RFC 1123 標籤名    {#dns-label-names}

某些資源類型需要其名稱遵循 [RFC 1123](https://tools.ietf.org/html/rfc1123)
所定義的 DNS 標籤標準。也就是命名必須滿足如下規則：

- 最多 63 個字符
- 只能包含小寫字母、數字，以及 '-'
- 必須以字母數字開頭
- 必須以字母數字結尾

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
### RFC 1035 標籤名   {#rfc-1035-label-names}

某些資源類型需要其名稱遵循 [RFC 1035](https://tools.ietf.org/html/rfc1035)
所定義的 DNS 標籤標準。也就是命名必須滿足如下規則：

- 最多 63 個字符
- 只能包含小寫字母、數字，以及 '-'
- 必須以字母開頭
- 必須以字母數字結尾

{{< note >}}
<!--
While RFC 1123 technically allows labels to start with digits, the current
Kubernetes implementation requires both RFC 1035 and RFC 1123 labels to start
with an alphabetic character. The exception is when the `RelaxedServiceNameValidation`
feature gate is enabled for Service objects, which allows Service names to start with digits.
-->
儘管 RFC 1123 在技術上允許標籤以數字開頭，當前的 Kubernetes 實現要求
RFC 1035 和 RFC 1123 標籤都以字母字符開頭。例外情況是當爲 Service 對象啓用了
`RelaxedServiceNameValidation` 特性門控時，這允許 Service 名稱以數字開頭。
{{< /note >}}

<!--
### Path Segment Names

Some resource types require their names to be able to be safely encoded as a
path segment. In other words, the name may not be "." or ".." and the name may
not contain "/" or "%".
-->
### 路徑分段名稱    {#path-segment-names}

某些資源類型要求名稱能被安全地用作路徑中的片段。
換句話說，其名稱不能是 `.`、`..`，也不可以包含 `/` 或 `%` 這些字符。

<!--
Here's an example manifest for a Pod named `nginx-demo`.
-->
下面是一個名爲 `nginx-demo` 的 Pod 的配置清單：

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
某些資源類型可能具有額外的命名約束。
{{< /note >}}

## UID

{{< glossary_definition term_id="uid" length="all" >}}

<!--
Kubernetes UIDs are universally unique identifiers (also known as UUIDs).
UUIDs are standardized as ISO/IEC 9834-8 and as ITU-T X.667.
-->
Kubernetes UID 是全局唯一標識符（也叫 UUID）。
UUID 是標準化的，見 ISO/IEC 9834-8 和 ITU-T X.667。

## {{% heading "whatsnext" %}}

<!--
* Read about [labels](/docs/concepts/overview/working-with-objects/labels/) and [annotations](/docs/concepts/overview/working-with-objects/annotations/) in Kubernetes.
* See the [Identifiers and Names in Kubernetes](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md) design document.
-->
* 進一步瞭解 Kubernetes [標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和[註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)。
* 參閱 [Kubernetes 標識符和名稱](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md)的設計文檔。
