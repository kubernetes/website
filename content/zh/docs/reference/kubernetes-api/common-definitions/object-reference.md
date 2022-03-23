---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectReference"
content_type: "api_reference"
description: "ObjectReference 包含足够的信息，可以让您检查或修改引用的对象。"
title: "ObjectReference"
weight: 8
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->



`import "k8s.io/api/core/v1"`

<!--
ObjectReference contains enough information to let you inspect or modify the referred object.

<hr>
-->

ObjectReference包含足够的信息，允许您检查或修改引用的对象。

<hr>


<!--
- **apiVersion** (string)

  API version of the referent.

- **fieldPath** (string)

  If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: "spec.containers{name}" (where "name" refers to the name of the container that triggered the event) or if no container name is specified "spec.containers[2]" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.

- **kind** (string)

  Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **name** (string)

  Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

- **namespace** (string)

  Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/

- **resourceVersion** (string)

  Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **uid** (string)

  UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids
-->

- **apiVersion** (string)

  引用的API版本。

- **fieldPath** (string)

  如果引用的是对象的一部分而不是整个对象，则该字符串应包含有效的JSON/Go字段访问语句，如desiredState.manifest.containers[2]。例如，如果对象引用是pod中的一个容器，那么它将采用如下值：“spec.containers{name}”（其中“name”指触发事件的容器的名称），或者如果没有指定容器名称，“spec.containers[2]”（此pod中会索引2的容器）。选择这种语法只是为了有一些定义良好的方法来引用对象的一部分。

- **kind** (string)

  有点指代物。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **name** (string)

  所指对象的名称。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

- **namespace** (string)

  引用对象的命名空间。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/

- **resourceVersion** (string)

  此引用的特定资源版本（如果有）。更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

- **uid** (string)

  引用对象的UID。更多信息：https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids

