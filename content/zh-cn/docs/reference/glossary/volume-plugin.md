---
title: 卷插件（Volume Plugin）
id: volumeplugin
date: 2018-04-12
full_link: 
short_description: >
  卷插件可以让 Pod 集成存储。

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

卷插件可以让 {{< glossary_tooltip text="Pod" term_id="pod" >}} 集成存储。

<!--more--> 

<!--
A Volume Plugin lets you attach and mount storage volumes for use by a {{< glossary_tooltip text="Pod" term_id="pod" >}}. Volume plugins can be _in tree_ or _out of tree_. _In tree_ plugins are part of the Kubernetes code repository and follow its release cycle. _Out of tree_ plugins are developed independently.
-->

卷插件让你能给 {{< glossary_tooltip text="Pod" term_id="pod" >}} 附加和挂载存储卷。
卷插件既可以是 _in tree_ 也可以是 _out of tree_ 。_in tree_ 插件是 Kubernetes 代码库的一部分，
并遵循其发布周期。而 _Out of tree_ 插件则是独立开发的。

