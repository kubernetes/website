---
content_type: "reference"
title: Мітки вузлів, які заповнює kubelet
weight: 40
---

{{< glossary_tooltip text="Вузли" term_id="node" >}} Kubernetes мають попередньо встановлений набір {{< glossary_tooltip text="міток" term_id="label" >}}.

Ви також можете встановлювати власні мітки на вузлах, як через конфігурацію kubelet, так і використовуючи API Kubernetes.

## Попередньо встановлені мітки {#preset-labels}

Попередньо встановлені мітки, які Kubernetes встановлює на вузли:

* [`kubernetes.io/arch`](/uk/docs/reference/labels-annotations-taints/#kubernetes-io-arch)
* [`kubernetes.io/hostname`](/uk/docs/reference/labels-annotations-taints/#kubernetes-io-hostname)
* [`kubernetes.io/os`](/uk/docs/reference/labels-annotations-taints/#kubernetes-io-os)
* [`node.kubernetes.io/instance-type`](/uk/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type) (якщо відомо kubelet, Kubernetes може не мати цієї інформації для встановлення мітки)
* [`topology.kubernetes.io/region`](/uk/docs/reference/labels-annotations-taints/#topologykubernetesioregion) (якщо відомо kubelet, Kubernetes може не мати цієї інформації для встановлення мітки)
* [`topology.kubernetes.io/zone`](/uk/docs/reference/labels-annotations-taints/#topologykubernetesiozone) (якщо відомо kubelet, Kubernetes може не мати цієї інформації для встановлення мітки)

{{<note>}}
Значення цих міток специфічні для постачальника хмарних послуг і їх надійність не гарантуються. Наприклад, значення `kubernetes.io/hostname` може бути таким самим, як імʼя вузла в деяких середовищах та різним в інших середовищах.
{{</note>}}

## {{% heading "whatsnext" %}}

* Дивіться [Відомі мітки, анотації та позначення](/uk/docs/reference/labels-annotations-taints/) для списку загальних міток.
* Дізнайтеся, як [додати мітку на вузол](/uk/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
