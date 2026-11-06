---
title: Пристрій
id: device
short_description: >
  Будь-який ресурс, який безпосередньо або опосередковано підключений до вузлів вашого кластера, як-от GPU або друковані плати.

tags:
- extension
- fundamental
aka:
- Device
---

Один або кілька {{< glossary_tooltip text="інфраструктурних ресурсів" term_id="infrastructure-resource" >}}, які прямо чи опосередковано приєднані до ваших {{< glossary_tooltip text="вузлів" term_id="node" >}}.

<!--more-->

Пристрої можуть бути комерційними продуктами, такими як GPU, або спеціальним обладнанням, таким як [ASIC-плати](https://uk.wikipedia.org/wiki/ASIC). Приєднані пристрої зазвичай вимагають драйверів пристроїв, які дозволяють {{< glossary_tooltip text="Podʼам" term_id="pod" >}} Kubernetes отримувати доступ до пристроїв.
