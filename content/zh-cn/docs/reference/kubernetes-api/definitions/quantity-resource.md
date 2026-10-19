---
api_metadata:
  apiVersion: "resource"
  import: "k8s.io/apimachinery/pkg/api/resource"
  kind: "Quantity"
content_type: "api_reference"
description: "Quantity 是数字的定点表示。它提供了方便的 JSON 和 YAML 编组/解组功能，以及 `String()` 和 `AsInt64()` 访问器。\n\n
  序列化格式如下：\n\n
  ``` &lt;quantity&gt;        ::= &lt;signedNumber&gt;&lt;suffix&gt;\n\n\t(Note that &lt;suffix&gt; may be empty, from the &#34;&#34; case in &lt;decimalSI&gt;.)\n\n&lt;digit&gt;           ::= 0 | 1 | ... | 9 &lt;digits&gt;          ::= &lt;digit&gt; | &lt;digit&gt;&lt;digits&gt; &lt;number&gt;          ::= &lt;digits&gt; | &lt;digits&gt;.&lt;digits&gt; | &lt;digits&gt;. | .&lt;digits&gt; &lt;sign&gt;            ::= &#34;+&#34; | &#34;-&#34; &lt;signedNumber&gt;    ::= &lt;number&gt; | &lt;sign&gt;&lt;number&gt; &lt;suffix&gt;          ::= &lt;binarySI&gt; | &lt;decimalExponent&gt; | &lt;decimalSI&gt; &lt;binarySI&gt;        ::= Ki | Mi | Gi | Ti | Pi | Ei\n\n\t(International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)\n\n&lt;decimalSI&gt;       ::= m | &#34;&#34; | k | M | G | T | P | E\n\n\t(Note that 1024 = 1Ki but 1000 = 1k; I didn&#39;t choose the capitalization.)\n\n&lt;decimalExponent&gt; ::= &#34;e&#34; &lt;signedNumber&gt; | &#34;E&#34; &lt;signedNumber&gt; ```\n\n
  无论使用三种指数形式中的哪一种，任何 Quantity 都不能表示幅度大于 2^63-1 的数字，也不能超过 3 位小数。更大或更精确的数字将被截断或向上取整。（例如：0.1m 将向上取整为 1m。）如果将来需要更大或更小的数量，这可能会被扩展。\n\n
  当 Quantity 从字符串解析时，它会记住其后缀类型，并在再次序列化时使用相同的类型。\n\n
  在序列化之前，Quantity 将被置于 &#34;规范形式&#34;（canonical form）。这意味着指数/后缀将向上或向下调整（尾数相应增加或减少），使得：\n\n
  - 不会丢失精度 - 不会输出小数位 - 指数（或后缀）尽可能大。\n\n
  除非数字为负数，否则符号将被省略。\n\n
  示例：\n\n
  - 1.5 将被序列化为 &#34;1500m&#34;
  - 1.5Gi 将被序列化为 &#34;1536Mi&#34;\n\n
  只要格式正确，非规范值仍可被解析，但会以其规范形式重新输出。（因此请始终使用规范形式，或者不要进行 diff。）\n\n
  此格式旨在使不编写某种特殊处理代码就使用这些数字变得困难，希望以此促使实现者也使用定点实现。"
title: "Quantity"
weight: 390
---
<!--
api_metadata:
  apiVersion: "resource"
  import: "k8s.io/apimachinery/pkg/api/resource"
  kind: "Quantity"
content_type: "api_reference"
description: "Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.\n\nThe serialization format is:\n\n``` &lt;quantity&gt;        ::= &lt;signedNumber&gt;&lt;suffix&gt;\n\n\t(Note that &lt;suffix&gt; may be empty, from the &#34;&#34; case in &lt;decimalSI&gt;.)\n\n&lt;digit&gt;           ::= 0 | 1 | ... | 9 &lt;digits&gt;          ::= &lt;digit&gt; | &lt;digit&gt;&lt;digits&gt; &lt;number&gt;          ::= &lt;digits&gt; | &lt;digits&gt;.&lt;digits&gt; | &lt;digits&gt;. | .&lt;digits&gt; &lt;sign&gt;            ::= &#34;+&#34; | &#34;-&#34; &lt;signedNumber&gt;    ::= &lt;number&gt; | &lt;sign&gt;&lt;number&gt; &lt;suffix&gt;          ::= &lt;binarySI&gt; | &lt;decimalExponent&gt; | &lt;decimalSI&gt; &lt;binarySI&gt;        ::= Ki | Mi | Gi | Ti | Pi | Ei\n\n\t(International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)\n\n&lt;decimalSI&gt;       ::= m | &#34;&#34; | k | M | G | T | P | E\n\n\t(Note that 1024 = 1Ki but 1000 = 1k; I didn&#39;t choose the capitalization.)\n\n&lt;decimalExponent&gt; ::= &#34;e&#34; &lt;signedNumber&gt; | &#34;E&#34; &lt;signedNumber&gt; ```\n\nNo matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.\n\nWhen a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.\n\nBefore serializing, Quantity will be put in &#34;canonical form&#34;. This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:\n\n- No precision is lost - No fractional digits will be emitted - The exponent (or suffix) is as large as possible.\n\nThe sign will be omitted unless the number is negative.\n\nExamples:\n\n- 1.5 will be serialized as &#34;1500m&#34; - 1.5Gi will be serialized as &#34;1536Mi&#34;\n\nNote that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.\n\nNon-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don&#39;t diff.)\n\nThis format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation."
title: "Quantity"
weight: 390
auto_generated: true
-->

`apiVersion: resource`

`import "k8s.io/apimachinery/pkg/api/resource"`


## Quantity {#Quantity}

<!--
Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.

The serialization format is:
-->
Quantity 是数字的定点表示。它提供了方便的 JSON 和 YAML 编组/解组功能，
以及 `String()` 和 `AsInt64()` 访问器。

序列化格式如下：

```
&lt;quantity&gt;        ::= &lt;signedNumber&gt;&lt;suffix&gt;

	(Note that &lt;suffix&gt; may be empty, from the &#34;&#34; case in &lt;decimalSI&gt;.)

&lt;digit&gt;           ::= 0 | 1 | ... | 9 &lt;digits&gt;          ::= &lt;digit&gt; | &lt;digit&gt;&lt;digits&gt; &lt;number&gt;          ::= &lt;digits&gt; | &lt;digits&gt;.&lt;digits&gt; | &lt;digits&gt;. | .&lt;digits&gt; &lt;sign&gt;            ::= &#34;+&#34; | &#34;-&#34; &lt;signedNumber&gt;    ::= &lt;number&gt; | &lt;sign&gt;&lt;number&gt; &lt;suffix&gt;          ::= &lt;binarySI&gt; | &lt;decimalExponent&gt; | &lt;decimalSI&gt; &lt;binarySI&gt;        ::= Ki | Mi | Gi | Ti | Pi | Ei

	(International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)

&lt;decimalSI&gt;       ::= m | &#34;&#34; | k | M | G | T | P | E

	(Note that 1024 = 1Ki but 1000 = 1k; I didn&#39;t choose the capitalization.)

&lt;decimalExponent&gt; ::= &#34;e&#34; &lt;signedNumber&gt; | &#34;E&#34; &lt;signedNumber&gt;
```
<!--
No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.

When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
-->
无论使用三种指数形式中的哪一种，任何 Quantity 都不能表示幅度大于 2^63-1 的数字，
也不能超过 3 位小数。更大或更精确的数字将被截断或向上取整。
（例如：0.1m 将向上取整为 1m。）
如果将来需要更大或更小的数量，这可能会被扩展。

当 Quantity 从字符串解析时，它会记住其后缀类型，并在再次序列化时使用相同的类型。

<!--
Before serializing, Quantity will be put in &#34;canonical form&#34;. This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:

- No precision is lost - No fractional digits will be emitted - The exponent (or suffix) is as large as possible.

The sign will be omitted unless the number is negative.

Examples:

- 1.5 will be serialized as &#34;1500m&#34; - 1.5Gi will be serialized as &#34;1536Mi&#34;
-->
在序列化之前，Quantity 将被置于"规范形式"（canonical form）。
这意味着指数/后缀将向上或向下调整（尾数相应增加或减少），使得：

- 不会丢失精度
- 不会输出小数位
- 指数（或后缀）尽可能大。

除非数字为负数，否则符号将被省略。

示例：

- 1.5 将被序列化为 "1500m"
- 1.5Gi 将被序列化为 "1536Mi"

<!--
Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.

Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don&#39;t diff.)

This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
-->
请注意，Quantity 永远不会在内部以浮点数表示。这正是此设计的全部意义所在。

只要格式正确，非规范值仍可被解析，但会以其规范形式重新输出。
（因此请始终使用规范形式，或者不要进行 diff。）

此格式旨在使不编写某种特殊处理代码就使用这些数字变得困难，
希望以此促使实现者也使用定点实现。

<hr>
