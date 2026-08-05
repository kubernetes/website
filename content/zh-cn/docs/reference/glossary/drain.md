---
title: 腾空
id: drain
date: 2024-12-27
full_link:
short_description: >
  从 Node 中安全地驱逐 Pod，为节点维护或移除做好准备。
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
从 {{< glossary_tooltip text="Node" term_id="node" >}} 中安全驱逐
{{< glossary_tooltip text="Pod" term_id="pod" >}} 的过程，
为维护或从{{< glossary_tooltip text="集群" term_id="cluster" >}}中移除节点做好准备。

<!--more-->

<!--
The `kubectl drain` command is used to mark a {{< glossary_tooltip text="Node" term_id="node" >}} as going out of service. 
When executed, it evicts all {{< glossary_tooltip text="Pods" term_id="pod" >}} from the {{< glossary_tooltip text="Node" term_id="node" >}}. 
If an eviction request is temporarily rejected, `kubectl drain` retries until all {{< glossary_tooltip text="Pods" term_id="pod" >}} are terminated or a configurable timeout is reached.
-->
`kubectl drain` 命令用于将 {{< glossary_tooltip text="Node" term_id="node" >}} 标记为停止服务。
执行此命令时，它会从 {{< glossary_tooltip text="Node" term_id="node" >}} 驱逐所有
{{< glossary_tooltip text="Pod" term_id="pod" >}}。 
如果驱逐请求临时被拒绝，`kubectl drain` 会重试，直到所有
{{< glossary_tooltip text="Pod" term_id="pod" >}} 被终止或达到可配置的超时时限。
