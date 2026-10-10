---
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "FieldsV1"
content_type: "api_reference"
description: "FieldsV1 将一组字段存储在类似 Trie 的数据结构中，格式为 JSON。\n\n
  每个键要么是一个 “.”，表示字段本身，并且始终映射到空集；
  要么是一个字符串，表示子字段或项。该字符串遵循以下四种格式之一：
  `f:<name>`，其中 `<name>` 是结构体中字段的名称，或映射中的键；
  `v:<value>`，其中 `<value>` 是列表项的精确 JSON 格式值；
  `i:<index>`，其中 `<index>` 是项在列表中的位置；
  `k:<keys>`，其中 `<keys>` 是列表项的键值。
  是列表项的键字段到其唯一值的映射。如果某个键映射到空的字段值，
  则该键所代表的字段属于该集合。\n\n
  确切格式定义在 sigs.k8s.io/structured-merge-diff 中。"
title: "FieldsV1"
weight: 130
---

<!--
api_metadata:
  apiVersion: "meta/v1"
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "FieldsV1"
content_type: "api_reference"
description: "FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.\n\nEach key is either a &#39;.&#39; representing the field itself, and will always map to an empty set, or a string representing a sub-field or item. The string will follow one of these four formats: &#39;f:&lt;name&gt;&#39;, where &lt;name&gt; is the name of a field in a struct, or key in a map &#39;v:&lt;value&gt;&#39;, where &lt;value&gt; is the exact json formatted value of a list item &#39;i:&lt;index&gt;&#39;, where &lt;index&gt; is position of a item in a list &#39;k:&lt;keys&gt;&#39;, where &lt;keys&gt; is a map of  a list item&#39;s key fields to their unique values If a key maps to an empty Fields value, the field that key represents is part of the set.\n\nThe exact format is defined in sigs.k8s.io/structured-merge-diff"
title: "FieldsV1"
weight: 130
auto_generated: true
-->

`apiVersion: meta/v1`

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`


## FieldsV1 {#FieldsV1}

<!--
FieldsV1 stores a set of fields in a data structure like a Trie, in JSON format.
-->
FieldsV1 以 JSON 格式将一组字段存储在类似 Trie 的数据结构中。

<!--
Each key is either a &#39;.&#39; representing the field itself, and will always map to an empty set, or a string representing a sub-field or item. The string will follow one of these four formats: &#39;f:&lt;name&gt;&#39;, where &lt;name&gt; is the name of a field in a struct, or key in a map &#39;v:&lt;value&gt;&#39;, where &lt;value&gt; is the exact json formatted value of a list item &#39;i:&lt;index&gt;&#39;, where &lt;index&gt; is position of a item in a list &#39;k:&lt;keys&gt;&#39;, where &lt;keys&gt; is a map of  a list item&#39;s key fields to their unique values If a key maps to an empty Fields value, the field that key represents is part of the set.
-->
FieldsV1 将一组字段存储在类似 Trie 的数据结构中，格式为 JSON。\n\n
每个键要么是一个 “.”，表示字段本身，并且始终映射到空集；
要么是一个字符串，表示子字段或项。该字符串遵循以下四种格式之一：
`f:<name>`，其中 `<name>` 是结构体中字段的名称，或映射中的键；
`v:<value>`，其中 `<value>` 是列表项的精确 JSON 格式值；
`i:<index>`，其中 `<index>` 是项在列表中的位置；
`k:<keys>`，其中 `<keys>` 是列表项的键值。
是列表项的键字段到其唯一值的映射。如果某个键映射到空的字段值，
则该键所代表的字段属于该集合。\n\n
确切格式定义在 sigs.k8s.io/structured-merge-diff 中。

<!--
The exact format is defined in sigs.k8s.io/structured-merge-diff
-->
具体格式定义在 sigs.k8s.io/structured-merge-diff 中。

<hr>
