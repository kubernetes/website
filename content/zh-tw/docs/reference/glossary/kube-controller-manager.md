---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  主節點上運行控制器的組件。

aka: 
tags:
- architecture
- fundamental
---
<!--
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-controller-manager/
short_description: >
  Component on the master that runs controllers.

aka: 
tags:
- architecture
- fundamental
-->

<!--
 Control plane component that runs
 {{< glossary_tooltip text="controller" term_id="controller" >}} processes.
-->
[kube-controller-manager](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
是{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的組件，
負責運行{{< glossary_tooltip text="控制器" term_id="controller" >}}進程。

<!--more-->

<!--
Logically, each {{< glossary_tooltip text="controller" term_id="controller" >}}
is a separate process, but to reduce complexity,
they are all compiled into a single binary and run in a single process.
--> 
從邏輯上講，
每個{{< glossary_tooltip text="控制器" term_id="controller" >}}都是一個單獨的進程，
但是爲了降低複雜性，它們都被編譯到同一個可執行文件，並在同一個進程中運行。

