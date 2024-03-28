---
title: Обмеження переривання роботи Podʼів
id: pod-disruption-budget
full-link: /docs/concepts/workloads/pods/disruptions/
date: 2019-02-12
short_description: >
 Обʼєкт, який обмежує кількість {{< glossary_tooltip text="Podʼів" term_id="pod" >}} реплікованого застосунку, які можуть бути вимкнені одночасно з причини добровільного переривання роботи.

aka:
 - PDB
 - Pod Disruption Budget
related:
 - pod
 - container
tags:
 - operation
---

[Обмеження переривання роботи Podʼів](/docs/concepts/workloads/pods/disruptions/) дозволяє власникам застосунків створювати обʼєкт для реплікованого застосунку, який гарантує, що певна кількість або відсоток Podʼів з визначеною міткою не буде добровільно вимкнена в будь-який момент часу.

<!--more--> 

PDB не можуть запобігти невимушеним збоям; однак вони
зараховуються до бюджету.
