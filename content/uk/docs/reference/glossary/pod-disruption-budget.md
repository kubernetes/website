---
title: Бюджет переривання роботи Podʼів
id: pod-disruption-budget
full-link: /docs/concepts/workloads/pods/disruptions/
short_description: >
 Обʼєкт, який обмежує кількість Podʼів реплікованого застосунку, що можуть бути одночасно вимкнені через добровільне переривання роботи.

aka:
 - PDB
 - Pod Disruption Budget
related:
 - pod
 - container
tags:
 - operation
---

[Бюджет переривання роботи Podʼів](/docs/concepts/workloads/pods/disruptions/) дозволяє власникам застосунків створювати обʼєкт для реплікованого застосунку, який гарантує, що певна кількість або відсоток {{< glossary_tooltip text="Podʼів" term_id="pod" >}} з визначеною міткою не буде добровільно виселена в будь-який момент часу.

<!--more-->

PDB не можуть запобігти невідворотному перериванню роботи; однак воно враховується в бюджеті.
