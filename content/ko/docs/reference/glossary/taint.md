---
title: 테인트(Taint)
id: taint
date: 2019-01-11
full_link: /ko/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  세 가지 필수 속성: 키(key), 값(value), 효과(effect)로 구성된 코어 오브젝트. 테인트는 파드가 노드나 노드 그룹에 스케줄링되는 것을 방지한다.

aka:
tags:
- core-object
- fundamental
---
 세 가지 필수 속성: 키(key), 값(value), 효과(effect)로 구성된 코어 오브젝트. 테인트는 {{< glossary_tooltip text="파드" term_id="pod" >}}가 {{< glossary_tooltip text="노드" term_id="node" >}}나 노드 그룹에 스케줄링되는 것을 방지한다.

<!--more-->

테인트 및 {{< glossary_tooltip text="톨러레이션(toleration)" term_id="toleration" >}}은 함께 작동하며, 파드가 적절하지 못한 노드에 스케줄되는 것을 방지한다. 하나 이상의 테인트가 노드에 적용될 수 있으며, 이것은 노드에 해당 테인트를 극복(tolerate)하지 않은 파드를 허용하지 않도록 표시한다.
