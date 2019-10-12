---
title: 名称
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

<!--
All objects in the Kubernetes REST API are unambiguously identified by a Name and a UID.
-->

Kubernetes REST API 中的所有对象都由名称和 UID 明确标识。

<!--
For non-unique user-provided attributes, Kubernetes provides [labels](/docs/user-guide/labels) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).

See the [identifiers design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) for the precise syntax rules for Names and UIDs.
-->

对于非唯一的用户提供的属性，Kubernetes 提供了[标签](/docs/user-guide/labels)和[注释](/docs/concepts/overview/working-with-objects/annotations/)。

有关名称和 UID 的精确语法规则，请参见[标识符设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md)。

{{% /capture %}}


{{% capture body %}}

<!--
## Names1
-->

## 名称

{{< glossary_definition term_id="name" length="all" >}}

<!--
By convention, the names of Kubernetes resources should be up to maximum length of 253 characters and consist of lower case alphanumeric characters, `-`, and `.`, but certain resources have more specific restrictions.
-->

按照惯例，Kubernetes 资源的名称最大长度应为 253 个字符，由小写字母、数字、`-`和 `.` 组成，但某些资源有更具体的限制。

<!--
For example, here’s the configuration file with a Pod name as `nginx-demo` and a Container name as `nginx`:
-->

例如，下面是一个配置文件，Pod 名为 `nginx demo`，容器名为 `nginx`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80
```

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

{{% /capture %}}
