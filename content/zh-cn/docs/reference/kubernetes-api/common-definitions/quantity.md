---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/api/resource"
  kind: "Quantity"
content_type: "api_reference"
description: "数量（Quantity）是数字的定点表示。"
title: "Quantity"
weight: 10
---
<!-- 
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/api/resource"
  kind: "Quantity"
content_type: "api_reference"
description: "Quantity is a fixed-point representation of a number."
title: "Quantity"
weight: 10
auto_generated: true
-->

`import "k8s.io/apimachinery/pkg/api/resource"`

<!-- 
Quantity is a fixed-point representation of a number. 
It provides convenient marshaling/unmarshaling in JSON and YAML, 
in addition to String() and AsInt64() accessors.

The serialization format is:
-->
数量（Quantity）是数字的定点表示。
除了 String() 和 AsInt64() 的访问接口之外，
它以 JSON 和 YAML 形式提供方便的打包和解包方法。

序列化格式如下：

<!-- 
\<quantity>        ::= \<signedNumber>\<suffix>
  (Note that \<suffix> may be empty, from the "" case in \<decimalSI>.)
\<digit>           ::= 0 | 1 | ... | 9 
\<digits>          ::= \<digit> | \<digit>\<digits> 
\<number>          ::= \<digits> | \<digits>.\<digits> | \<digits>. | .\<digits> 
\<sign>            ::= "+" | "-" 
\<signedNumber>    ::= \<number> | \<sign>\<number> 
\<suffix>          ::= \<binarySI> | \<decimalExponent> | \<decimalSI> 
\<binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei
  (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)
\<decimalSI>       ::= m | "" | k | M | G | T | P | E
  (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)
\<decimalExponent> ::= "e" \<signedNumber> | "E" \<signedNumber>
-->
```
<quantity>        ::= <signedNumber><suffix>
  (注意 <suffix> 可能为空，例如 <decimalSI> 的 "" 情形。) </br>
<digit>           ::= 0 | 1 | ... | 9 </br>
<digits>          ::= <digit> | <digit><digits> </br>
<number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> </br>
<sign>            ::= "+" | "-" </br>
<signedNumber>    ::= <number> | <sign><number> </br>
<suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> </br>
<binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei 
  (国际单位制度；查阅： http://physics.nist.gov/cuu/Units/binary.html)</br>
<decimalSI>       ::= m | "" | k | M | G | T | P | E 
  (注意，1024 = 1ki 但 1000 = 1k；我没有选择大写。) </br>
<decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber> </br>
```

<!-- 
No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.

When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
-->
无论使用三种指数形式中哪一种，没有数量可以表示大于 2<sup>63</sup>-1 的数，也不可能超过 3 个小数位。
更大或更精确的数字将被截断或向上取整（例如：0.1m 将向上取整为 1m）。
如果将来我们需要更大或更小的数量，可能会扩展。

当从字符串解析数量时，它将记住它具有的后缀类型，并且在序列化时将再次使用相同类型。

<!-- 
Before serializing, Quantity will be put in "canonical form". This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:

- No precision is lost
- No fractional digits will be emitted
- The exponent (or suffix) is as large as possible.

The sign will be omitted unless the number is negative.
-->
在序列化之前，数量将以“规范形式”放置。这意味着指数或者后缀将被向上或向下调整（尾数相应增加或减少），并确保：

- 没有精度丢失
- 不会输出小数数字
- 指数（或后缀）尽可能大。

除非数量是负数，否则将省略正负号。

<!-- 
Examples:

- 1.5 will be serialized as "1500m"
- 1.5Gi will be serialized as "1536Mi"
-->
例如：

- 1.5 将会被序列化成 “1500m”
- 1.5Gi 将会被序列化成 “1536Mi”

<!-- 
Note that the quantity will NEVER be internally represented by a floating point number. 
That is the whole point of this exercise.

Non-canonical values will still parse as long as they are well formed, 
but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)

This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
-->
请注意，数量永远**不会**在内部以浮点数表示。这是本设计的重中之重。

只要它们格式正确，非规范值仍将解析，但将以其规范形式重新输出（所以应该总是使用规范形式，否则不要执行 diff 比较）。

这种格式旨在使得很难在不撰写某种特殊处理代码的情况下使用这些数字，进而希望实现者也使用定点实现。

<hr>
