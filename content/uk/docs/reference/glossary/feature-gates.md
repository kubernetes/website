---
title: Відстеження функцій
id: feature-gate
date: 2023-01-12
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  Спосіб перевірки увімкення тих чи інших функцій Kubernetes у вашому кластері.

aka: 
- Feature gate
tags:
- fundamental
- operation
---

Можливість відстеження функцій містить набір ключів (прихованих значень), які ви можете використовувати для контролю того, які функції Kubernetes увімкнені у вашому кластері.

<!--more-->

Ви можете вмикати або вимикати функції, використовуючи прапорець командного рядка `--feature-gates` для кожного компонента Kubernetes. Кожен компонент Kubernetes дозволяє вам увімкнути чи вимкнути набори відстеження функцій, які є відповідними для цього компонента. У документації Kubernetes перелічено всі поточні [набори відстеження функці](/docs/reference/command-line-tools-reference/feature-gates/) та те, що вони контролюють.
