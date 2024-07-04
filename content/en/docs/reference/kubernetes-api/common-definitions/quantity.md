---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/api/resource"
  kind: "Quantity"
content_type: "api_reference"
description: "Quantity is a fixed-point representation of a number."
title: "Quantity"
weight: 10
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



`import "k8s.io/apimachinery/pkg/api/resource"`


<p>Quantity is a fixed-point representation of a number. It provides convenient marshaling/unmarshaling in JSON and YAML, in addition to String() and AsInt64() accessors.</p>
<p>The serialization format is:</p>
<pre><code> &lt;quantity&gt;        ::= &lt;signedNumber&gt;&lt;suffix&gt;

  (Note that &lt;suffix&gt; may be empty, from the &quot;&quot; case in &lt;decimalSI&gt;.)

&lt;digit&gt;           ::= 0 | 1 | ... | 9 &lt;digits&gt;          ::= &lt;digit&gt; | &lt;digit&gt;&lt;digits&gt; &lt;number&gt;          ::= &lt;digits&gt; | &lt;digits&gt;.&lt;digits&gt; | &lt;digits&gt;. | .&lt;digits&gt; &lt;sign&gt;            ::= &quot;+&quot; | &quot;-&quot; &lt;signedNumber&gt;    ::= &lt;number&gt; | &lt;sign&gt;&lt;number&gt; &lt;suffix&gt;          ::= &lt;binarySI&gt; | &lt;decimalExponent&gt; | &lt;decimalSI&gt; &lt;binarySI&gt;        ::= Ki | Mi | Gi | Ti | Pi | Ei

  (International System of units; See: http://physics.nist.gov/cuu/Units/binary.html)

&lt;decimalSI&gt;       ::= m | &quot;&quot; | k | M | G | T | P | E

  (Note that 1024 = 1Ki but 1000 = 1k; I didn't choose the capitalization.)

&lt;decimalExponent&gt; ::= &quot;e&quot; &lt;signedNumber&gt; | &quot;E&quot; &lt;signedNumber&gt; 
</code></pre>
<p>No matter which of the three exponent forms is used, no quantity may represent a number greater than 2^63-1 in magnitude, nor may it have more than 3 decimal places. Numbers larger or more precise will be capped or rounded up. (E.g.: 0.1m will rounded up to 1m.) This may be extended in the future if we require larger or smaller quantities.</p>
<p>When a Quantity is parsed from a string, it will remember the type of suffix it had, and will use the same type again when it is serialized.</p>
<p>Before serializing, Quantity will be put in &quot;canonical form&quot;. This means that Exponent/suffix will be adjusted up or down (with a corresponding increase or decrease in Mantissa) such that:</p>
<ul>
<li>No precision is lost - No fractional digits will be emitted - The exponent (or suffix) is as large as possible.</li>
</ul>
<p>The sign will be omitted unless the number is negative.</p>
<p>Examples:</p>
<ul>
<li>1.5 will be serialized as &quot;1500m&quot; - 1.5Gi will be serialized as &quot;1536Mi&quot;</li>
</ul>
<p>Note that the quantity will NEVER be internally represented by a floating point number. That is the whole point of this exercise.</p>
<p>Non-canonical values will still parse as long as they are well formed, but will be re-emitted in their canonical form. (So always use canonical form, or don't diff.)</p>
<p>This format is intended to make it difficult to use these numbers without writing some sort of special handling code in the hopes that that will cause implementors to also use a fixed point implementation.</p>


<hr>





