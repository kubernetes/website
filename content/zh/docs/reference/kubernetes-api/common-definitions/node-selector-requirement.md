---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorRequirement"
content_type: "api_reference"
description: "节点选择器是一个需要包含键、值以及一个将键与值关联起来的运算符的选择器"
title: "NodeSelectorRequirement"
weight: 5
auto_generated: true
---
<!--
---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorRequirement"
content_type: "api_reference"
description: "A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values."
title: "NodeSelectorRequirement"
weight: 5
auto_generated: true
---
-->

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
<!--
该文件是使用通用Go源码自动生成的组件 [生成器](https://github.com/kubernetes-sigs/reference-docs/)。
学习如何生成参考文档，请阅读 [贡献参考文档](/docs/contribute/generate-ref-docs/)。
更新参考内容，请按照 [贡献上游](/docs/contribute/generate-ref-docs/contribute-upstream/)。
针对文档格式化，可以参考 [参考文档](https://github.com/kubernetes-sigs/reference-docs/)。
-->


`import "k8s.io/api/core/v1"`

<!--
A node selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
-->
   节点选择器是一个需要包含键、值以及一个将键与值关联起来的运算符的选择器。

<hr>

<!--
- **key** (string), required
  
  The label key that the selector applies to.
-->
- **key**（字符串），必选项

   key是一种被选择器使用的标签。

<!--
- **operator** (string), required

  Represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists, DoesNotExist. Gt, and Lt.

   Possible enum values:
   - `"DoesNotExist"`
   - `"Exists"`
   - `"Gt"`
   - `"In"`
   - `"Lt"`
   - `"NotIn"` 
-->
- **operator** (字符串), 必选项

  operator是表示键与一组值的关系的运算符。有效的运算符包括：In、NotIn、Exists、DoesNotExist、Gt和Lt。

  可用的取值:
   - `"DoesNotExist"`
   - `"Exists"`
   - `"Gt"`
   - `"In"`
   - `"Lt"`
   - `"NotIn"`

<!--
- **values** ([]string)

  An array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. If the operator is Gt or Lt, the values array must have a single element, which will be interpreted as an integer. This array is replaced during a strategic merge patch.
-->
- **values** （字符串数组）

   values是一个字符串数组。如果运算符为In或NotIn，则该数组必须为非空。如果运算符为Exists或DoesNotExist，则该数组必须为空。如果运算符为Gt或Lt，则数组必须有一个元素，该元素将被看作整数。该数组会在合入全局补丁时被替换。


