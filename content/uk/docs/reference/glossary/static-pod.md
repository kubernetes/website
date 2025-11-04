---
title: Статичний Pod
id: static-pod
date: 2019-02-12
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  Pod, яким управляє безпосередньо демон kubelet на певному вузлі.

aka:
  - Static Pod
tags:
- fundamental
---

{{< glossary_tooltip text="Pod" term_id="pod" >}}, яким управляє безпосередньо демон {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} на певному вузлі,

<!--more-->

без його спостереження через сервер API.

Static Pod не підтримують {{< glossary_tooltip text="ефемерні контейнери" term_id="ephemeral-container" >}}.
