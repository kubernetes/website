---
title: Бюджет порушень Podʼів
id: pod-disruption-budget
full-link: /docs/concepts/workloads/pods/disruptions/
short_description: >
 Обʼєкт, який обмежує кількість Podʼів реплікованого застосунку, що можуть бути одночасно вимкнені через добровільне порушення.

aka:
 - PDB
 - Pod Disruption Budget
related:
 - pod
 - container
tags:
 - operation
---

[Бюджет порушень Podʼів](/docs/concepts/workloads/pods/disruptions/) дозволяє власникам застосунків створювати обʼєкт для реплікованого застосунку, який гарантує, що певна кількість або відсоток {{< glossary_tooltip text="Podʼів" term_id="pod" >}} з визначеною міткою не буде добровільно виселена в будь-який момент часу.

<!--more-->

PDB не можуть запобігти невідворотному порушенню; однак воно враховується в бюджеті.
