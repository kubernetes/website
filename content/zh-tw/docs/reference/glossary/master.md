---
title: Master
id: master
date: 2020-04-16
short_description: >
  遺留術語，作爲運行控制平面的節點的同義詞使用。

aka:
tags:
- fundamental
---
 遺留術語，作爲運行 {{< glossary_tooltip text="控制平面" term_id="control-plane" >}} 的 {{< glossary_tooltip text="節點" term_id="node" >}} 的同義詞使用。

<!-- 
---
title: Master
id: master
date: 2020-04-16
short_description: >
  Legacy term, used as synonym for nodes running the control plane.

aka:
tags:
- fundamental
---
 Legacy term, used as synonym for {{< glossary_tooltip text="nodes" term_id="node" >}} hosting the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
 -->

<!--more-->

<!-- 
The term is still being used by some provisioning tools, such as {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}}, and managed services, to {{< glossary_tooltip text="label" term_id="label" >}} {{< glossary_tooltip text="nodes" term_id="node" >}} with `kubernetes.io/role` and control placement of {{< glossary_tooltip text="control plane" term_id="control-plane" >}} {{< glossary_tooltip text="pods" term_id="pod" >}}.
-->
該術語仍被一些設定工具使用，如 {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} 以及託管的服務，爲 {{< glossary_tooltip text="節點（nodes）" term_id="node" >}} 添加 `kubernetes.io/role` 的 {{< glossary_tooltip text="標籤（label）" term_id="label" >}}，以及管理控制平面 Pod 的調度。