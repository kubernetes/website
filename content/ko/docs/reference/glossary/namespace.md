---
title: 네임스페이스(Namespace)
id: namespace
date: 2018-04-12
full_link: /ko/docs/concepts/overview/working-with-objects/namespaces/
short_description: >
  쿠버네티스에서, 하나의 클러스터 내에서 리소스 그룹의 격리를 지원하기 위해 사용하는 추상화.

aka: 
tags:
- fundamental
---
 쿠버네티스에서 하나의 {{< glossary_tooltip text="클러스터" term_id="cluster" >}} 내에서 리소스 그룹의 격리를 지원하기 위해 사용하는 추상적 개념.

<!--more--> 

네임스페이스는 클러스터의 오브젝트를 체계화하고 클러스터의 리소스를 분리하는 방법을 제공한다. 리소스의 이름은 네임스페이스 내에서 유일해야 한다. 그러나, 네임스페이스 간에서 유일할 필요는 없다. 네임스페이스 기반 스코핑은 네임스페이스 기반 오브젝트(예: 디플로이먼트, 서비스 등)에만 적용 가능하며 클러스터 범위의 오브젝트(예: 스토리지클래스, 노드, 퍼시스턴트볼륨 등)에는 적용 불가능하다.

