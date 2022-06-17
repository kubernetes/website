---
title: 卷外掛（Volume Plugin）
id: volumeplugin
date: 2018-04-12
full_link: 
short_description: >
  卷外掛可以讓 Pod 整合儲存。

aka: 
tags:
- core-object
- storage
---

<!--
---
title: Volume Plugin
id: volumeplugin
date: 2018-04-12
full_link: 
short_description: >
  A Volume Plugin enables integration of storage within a Pod.

aka: 
tags:
- core-object
- storage
---
-->

<!--
 A Volume Plugin enables integration of storage within a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
-->

卷外掛可以讓 {{< glossary_tooltip text="Pod" term_id="pod" >}} 整合儲存。

<!--more--> 

<!--
A Volume Plugin lets you attach and mount storage volumes for use by a {{< glossary_tooltip text="Pod" term_id="pod" >}}. Volume plugins can be _in tree_ or _out of tree_. _In tree_ plugins are part of the Kubernetes code repository and follow its release cycle. _Out of tree_ plugins are developed independently.
-->

卷外掛讓你能給 {{< glossary_tooltip text="Pod" term_id="pod" >}} 附加和掛載儲存卷。
卷外掛既可以是 _in tree_ 也可以是 _out of tree_ 。_in tree_ 外掛是 Kubernetes 程式碼庫的一部分，
並遵循其釋出週期。而 _Out of tree_ 外掛則是獨立開發的。

