---
title: 큐브-컨트롤러-매니저
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  컨트롤러를 동작시키는 마스터 상의 컴포넌트다.

aka:
tags:
- architecture
- fundamental
---
 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}를 동작시키는 마스터 상의 컴포넌트다.

<!--more-->

논리적으로, 각 {{< glossary_tooltip text="controller" term_id="controller" >}}는 분리된 프로세스이긴 하지만, 복잡도를 줄이기 위해, 하나의 바이너리에 컴파일 되어 하나의 프로세스 내에서 동작한다.
