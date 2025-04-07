---
title: Toleration
id: toleration
date: 2019-01-11
full_link: /ja/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  key、value、effectの3つの必須属性からなるコアオブジェクトです。
  Tolerationは、対応するTaintを持つノードやノードグループにPodをスケジューリングできるようにします。
aka:
tags:
- core-object
- fundamental
---
key、value、effectの3つの必須属性からなるコアオブジェクトです。
Tolerationは、対応する{{< glossary_tooltip text="Taint" term_id="taint" >}}を持つノードやノードグループにPodをスケジューリングできるようにします。

<!--more-->

Tolerationと{{< glossary_tooltip text="Taint" term_id="taint" >}}は組になって機能し、Podが不適切なノードにスケジューリングされないことを保証します。
1つ以上のTolerationが{{< glossary_tooltip text="Pod" term_id="pod" >}}に付与されます。
Tolerationは、付与された{{< glossary_tooltip text="Pod" term_id="pod" >}}が、対応する{{< glossary_tooltip text="Taint" term_id="taint" >}}を持つノードやノードグループへのスケジューリングを許可された(ただし、強制されるわけではない)ことを示します。
