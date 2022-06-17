---
title: 物件名稱和 IDs
content_type: concept
weight: 20
---

<!-- overview -->

<!--
Each object in your cluster has a [_Name_](#names) that is unique for that type of resource.
Every Kubernetes object also has a [_UID_](#uids) that is unique across your whole cluster.

For example, you can only have one Pod named `myapp-1234` within the same [namespace](/docs/concepts/overview/working-with-objects/namespaces/), but you can have one Pod and one Deployment that are each named `myapp-1234`.
-->

叢集中的每一個物件都有一個[_名稱_](#names)來標識在同類資源中的唯一性。

每個 Kubernetes 物件也有一個 [_UID_](#uids) 來標識在整個叢集中的唯一性。

比如，在同一個[名字空間](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
中有一個名為 `myapp-1234` 的 Pod，但是可以命名一個 Pod 和一個 Deployment 同為 `myapp-1234`。

<!--
For non-unique user-provided attributes, Kubernetes provides [labels](/docs/user-guide/labels) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).
-->
對於使用者提供的非唯一性的屬性，Kubernetes 提供了
[標籤（Labels）](/zh-cn/docs/concepts/working-with-objects/labels)和
[註解（Annotation）](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)機制。

<!-- body -->

<!--
## Names
-->
## 名稱  {#names}

{{< glossary_definition term_id="name" length="all" >}}

{{< note >}}
<!--
In cases when objects represent a physical entity, like a Node representing a physical host, when the host is re-created under the same name without deleting and re-creating the Node, Kubernetes treats the new host as the old one, which may lead to inconsistencies.
-->
當物件所代表的是一個物理實體（例如代表一臺物理主機的 Node）時，
如果在 Node 物件未被刪除並重建的條件下，重新建立了同名的物理主機，
則 Kubernetes 會將新的主機看作是老的主機，這可能會帶來某種不一致性。
{{< /note >}}

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
- start with an alphanumeric character
- end with an alphanumeric character
-->

### DNS 子域名  {#dns-subdomain-names}

很多資源型別需要可以用作 DNS 子域名的名稱。
DNS 子域名的定義可參見 [RFC 1123](https://tools.ietf.org/html/rfc1123)。
這一要求意味著名稱必須滿足如下規則：

- 不能超過 253 個字元
- 只能包含小寫字母、數字，以及 '-' 和 '.'
- 必須以字母數字開頭
- 必須以字母數字結尾

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
### RFC 1123 標籤名    {#dns-label-names}

某些資源型別需要其名稱遵循 [RFC 1123](https://tools.ietf.org/html/rfc1123)
所定義的 DNS 標籤標準。也就是命名必須滿足如下規則：

- 最多 63 個字元
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

某些資源型別需要其名稱遵循 [RFC 1035](https://tools.ietf.org/html/rfc1035)
所定義的 DNS 標籤標準。也就是命名必須滿足如下規則：

- 最多 63 個字元
- 只能包含小寫字母、數字，以及 '-'
- 必須以字母開頭
- 必須以字母數字結尾

<!--
### Path Segment Names

Some resource types require their names to be able to be safely encoded as a
path segment. In other words, the name may not be "." or ".." and the name may
not contain "/" or "%".
-->
### 路徑分段名稱    {#path-segment-names}

某些資源型別要求名稱能被安全地用作路徑中的片段。
換句話說，其名稱不能是 `.`、`..`，也不可以包含 `/` 或 `%` 這些字元。

<!--
Here’s an example manifest for a Pod named `nginx-demo`.
-->
下面是一個名為 `nginx-demo` 的 Pod 的配置清單：

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

<!--
Some resource types have additional restrictions on their names.
-->
{{< note >}}
某些資源型別可能具有額外的命名約束。
{{< /note >}}

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

<!--
Kubernetes UIDs are universally unique identifiers (also known as UUIDs).
UUIDs are standardized as ISO/IEC 9834-8 and as ITU-T X.667.
-->
Kubernetes UIDs 是全域性唯一識別符號（也叫 UUIDs）。
UUIDs 是標準化的，見 ISO/IEC 9834-8 和 ITU-T X.667。

## {{% heading "whatsnext" %}}

<!--
* Read about [labels](/docs/concepts/overview/working-with-objects/labels/) in Kubernetes.
* See the [Identifiers and Names in Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) design document.
-->
* 進一步瞭解 Kubernetes [標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)
* 參閱 [Kubernetes 識別符號和名稱](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md)的設計文件


