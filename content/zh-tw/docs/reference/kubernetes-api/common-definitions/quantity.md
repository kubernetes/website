---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/api/resource"
  kind: "Quantity"
content_type: "api_reference"
description: "數量（Quantity）是數字的定點表示。"
title: "Quantity"
weight: 10
auto_generated: true
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



`import "k8s.io/apimachinery/pkg/api/resource"`


<!-- 
Quantity is a fixed-point representation of a number. 
It provides convenient marshaling/unmarshaling in JSON and YAML, 
in addition to String() and AsInt64() accessors.

The serialization format is:
-->
數量（Quantity）是數字的定點表示。
除了 String() 和 AsInt64() 的訪問介面之外，
它以 JSON 和 YAML形式提供方便的打包和解包方法。

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
  (注意 <suffix> 可能為空，例如 <decimalSI> 的 "" 情形。) </br>
<digit>           ::= 0 | 1 | ... | 9 </br>
<digits>          ::= <digit> | <digit><digits> </br>
<number>          ::= <digits> | <digits>.<digits> | <digits>. | .<digits> </br>
<sign>            ::= "+" | "-" </br>
<signedNumber>    ::= <number> | <sign><number> </br>
<suffix>          ::= <binarySI> | <decimalExponent> | <decimalSI> </br>
<binarySI>        ::= Ki | Mi | Gi | Ti | Pi | Ei 
  (國際單位制度；查閱： http://physics.nist.gov/cuu/Units/binary.html)</br>
<decimalSI>       ::= m | "" | k | M | G | T | P | E 
  (注意，1024 = 1ki 但 1000 = 1k；我沒有選擇大寫。) </br>
<decimalExponent> ::= "e" <signedNumber> | "E" <signedNumber> </br>
```


<!-- 
No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.

When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.
-->
無論使用三種指數形式中哪一種，沒有數量可以表示大於 2<sup>63</sup>-1 的數，也不可能超過 3 個小數位。
更大或更精確的數字將被截斷或向上取整。（例如：0.1m 將向上取整為 1m。）
如果將來我們需要更大或更小的數量，可能會擴充套件。

當從字串解析數量時，它將記住它具有的字尾型別，並且在序列化時將再次使用相同型別。

<!-- 
Before serializing, Quantity will be put in "canonical form". 
This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:
  a. No precision is lost
  b. No fractional digits will be emitted
  c. The exponent (or suffix) is as large as possible.
The sign will be omitted unless the number is negative.
-->
在序列化之前，數量將以“規範形式”放置。這意味著指數或者字尾將被向上或向下調整（尾數相應增加或減少），並確保：
  1. 沒有精度丟失
  2. 不會輸出小數數字
  3. 指數（或字尾）儘可能大。
除非數量是負數，否則將省略正負號。

<!-- 
Examples:
  1.5 will be serialized as "1500m"
  1.5Gi will be serialized as "1536Mi"
-->
例如：
  - 1.5 將會被序列化成 “1500m”
  - 1.5Gi 將會被序列化成 “1536Mi”

<!-- 
Note that the quantity will NEVER be internally represented by a floating point number. 
That is the whole point of this exercise.

Non-canonical values will still parse as long as they are well formed, 
but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)

This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.
-->
請注意，數量永遠**不會**在內部以浮點數表示。這是本設計的重中之重。

只要它們格式正確，非規範值仍將解析，但將以其規範形式重新輸出。（所以應該總是使用規範形式，否則不要執行 diff 比較。）

這種格式旨在使得很難在不撰寫某種特殊處理程式碼的情況下使用這些數字，進而希望實現者也使用定點實現。

<hr>
