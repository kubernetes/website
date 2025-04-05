---
title: Taint
id: taint
date: 2019-01-11
full_link: /ja/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  key、value、effectの3つの必須属性からなり、Podが特定のノードやノードグループにスケジューリングされることを防ぎます。
aka:
tags:
- fundamental
---
key、value、effectの3つの必須属性からなり、{{< glossary_tooltip text="Pod" term_id="pod" >}}が特定の{{< glossary_tooltip text="ノード" term_id="node" >}}やノードグループにスケジューリングされることを防ぎます。

<!--more-->

Taintと{{< glossary_tooltip text="Toleration" term_id="toleration" >}}は組になって機能し、Podが不適切なノードにスケジューリングされないことを保証します。
1つ以上のTaintがノードに付与されます。
Taintが付与されたノードには、対応するTolerationを持つPodのみがスケジューリングされるべきです。
