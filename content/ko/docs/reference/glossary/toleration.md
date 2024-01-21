---
title: 톨러레이션(Toleration)
id: toleration
date: 2019-01-11
full_link: /ko/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  세 가지 필수 속성: 키(key), 값(value), 효과(effect)로 구성된 코어 오브젝트. 톨러레이션은 매칭되는 테인트(taint)를 가진 노드나 노드 그룹에 파드가 스케줄링되는 것을 활성화한다.

aka:
tags:
- core-object
- fundamental
---
 세 가지 필수 속성: 키(key), 값(value), 효과(effect)로 구성된 코어 오브젝트. 톨러레이션은 매칭되는 {{< glossary_tooltip text="테인트(taints)" term_id="taint" >}}를 가진 노드나 노드 그룹에 파드가 스케줄링되는 것을 활성화한다.

<!--more-->

톨러레이션 및 {{< glossary_tooltip text="테인트" term_id="taint" >}}는 함께 작동하며, 파드가 적절하지 못한 노드에 스케줄되는 것을 방지한다. 하나 이상의 톨러레이션이 {{< glossary_tooltip text="파드" term_id="pod" >}}에 적용될 수 있다. 톨러레이션은 매칭되는 {{< glossary_tooltip text="테인트" term_id="taint" >}}를 가진 노드나 노드 그룹에 {{< glossary_tooltip text="파드" term_id="pod" >}}가 스케줄링되는 것을 허용(그러나 필수는 아님)하도록 표시한다.
