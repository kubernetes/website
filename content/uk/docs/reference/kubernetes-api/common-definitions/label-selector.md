---
api_metadata:
  apiVersion: ""
  import: "k8s.io/apimachinery/pkg/apis/meta/v1"
  kind: "LabelSelector"
content_type: "api_reference"
description: "Селектор міток — є запитом на наявність міток до набору ресурсів."
title: "LabelSelector"
weight: 2
auto_generated: false
---

`import "k8s.io/apimachinery/pkg/apis/meta/v1"`

Селектор міток — це запит на наявність міток до набору ресурсів. Результати matchLabels та matchExpressions поєднуються логічним І (AND). Порожній селектор міток має збіг зі всіма обʼєктам. Нульовий селектор міток не збігається з жодним обʼєктом.

---

- **matchExpressions** ([]LabelSelectorRequirement)

  *Atomic: буде замінено під час злиття*

  matchExpressions — це список вимог селектора міток. Вимоги зʼєднуються логічною операцією І (AND).

  <a name="LabelSelectorRequirement"></a>
  *Вимоги селектора міток — це селектор, що містить значення, ключ та оператор, який повʼязує ключ і значення.*

  - **matchExpressions.key** (string), обовʼязково

    key — це ключ мітки, до якого застосовується селектор.

  - **matchExpressions.operator** (string), обовʼязково

    operator представляє стосунок ключа до набору значень. Допустимі оператори: In, NotIn, Exists та DoesNotExist.

  - **matchExpressions.values** ([]string)

    *Atomic: буде замінено під час злиття*

    values — це масив рядкових значень. Якщо оператор — In або NotIn, масив значень повинен бути не пустим. Якщо оператор — Exists або DoesNotExist, масив значень повинен бути пустим. Цей масив замінюється під час стратегічного злиття патча.

- **matchLabels** (map[string]string)

  matchLabels — це зіставлення пар {ключ, значення}. Один {ключ, значення} у зіставленні matchLabels еквівалентний елементу matchExpressions, де поле key — "key", оператор — "In", а масив значень містить лише "value". Вимоги зʼєднуються логічною операцією І (AND).
