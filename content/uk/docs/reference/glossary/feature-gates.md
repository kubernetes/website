---
title: Функціональна можливість
id: feature-gate
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  Спосіб керувати тим, чи увімкнена певна можливість Kubernetes.

aka:
- Feature gate
tags:
- fundamental
- operation
---

Функціональні можливості (feature gates) — це набір ключів (непрозорих рядкових значень), за допомогою яких ви можете керувати тим, які можливості Kubernetes увімкнені у вашому кластері.

<!--more-->

Ви можете вмикати або вимикати ці можливості за допомогою прапорця командного рядка `--feature-gates` для кожного компонента Kubernetes. Кожен компонент Kubernetes дозволяє вмикати або вимикати набір функціональних можливостей, що стосуються цього компонента. У документації Kubernetes перелічено всі поточні [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) і те, чим вони керують.
