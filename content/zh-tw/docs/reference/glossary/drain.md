---
title: 騰空
id: drain
date: 2024-12-27
full_link:
short_description: >
  從 Node 中安全地驅逐 Pod，爲節點維護或移除做好準備。
tags:
- fundamental
- operation
---

<!--
title: Drain
id: drain
date: 2024-12-27
full_link:
short_description: >
  Safely evicts Pods from a Node to prepare for maintenance or removal.
tags:
- fundamental
- operation
-->

<!--
The process of safely evicting {{< glossary_tooltip text="Pods" term_id="pod" >}} from a {{< glossary_tooltip text="Node" term_id="node" >}} to prepare it for maintenance or removal from a {{< glossary_tooltip text="cluster" term_id="cluster" >}}.
-->
從 {{< glossary_tooltip text="Node" term_id="node" >}} 中安全驅逐
{{< glossary_tooltip text="Pod" term_id="pod" >}} 的過程，
爲維護或從{{< glossary_tooltip text="叢集" term_id="cluster" >}}中移除節點做好準備。

<!--more-->

<!--
The `kubectl drain` command is used to mark a {{< glossary_tooltip text="Node" term_id="node" >}} as going out of service. 
When executed, it evicts all {{< glossary_tooltip text="Pods" term_id="pod" >}} from the {{< glossary_tooltip text="Node" term_id="node" >}}. 
If an eviction request is temporarily rejected, `kubectl drain` retries until all {{< glossary_tooltip text="Pods" term_id="pod" >}} are terminated or a configurable timeout is reached.
-->
`kubectl drain` 命令用於將 {{< glossary_tooltip text="Node" term_id="node" >}} 標記爲停止服務。
執行此命令時，它會從 {{< glossary_tooltip text="Node" term_id="node" >}} 驅逐所有
{{< glossary_tooltip text="Pod" term_id="pod" >}}。 
如果驅逐請求臨時被拒絕，`kubectl drain` 會重試，直到所有
{{< glossary_tooltip text="Pod" term_id="pod" >}} 被終止或達到可設定的超時時限。
