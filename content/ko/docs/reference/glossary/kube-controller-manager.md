---
title: kube-controller-manager
id: kube-controller-manager
date: 2018-04-12
full_link: /docs/reference/generated/kube-controller-manager/
short_description: >
  컨트롤러를 구동하는 마스터 상의 컴포넌트.

aka: 
tags:
- architecture
- fundamental
---
 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}를 구동하는 마스터 상의 컴포넌트.

<!--more--> 

논리적으로, 각 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}는 개별 프로세스이지만, 복잡성을 낮추기 위해 모두 단일 바이너리로 컴파일되고 단일 프로세스 내에서 실행된다.

