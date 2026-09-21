---
title: 리소스 (인프라) (원문, Resource (infrastructure))
id: infrastructure-resource
short_description: >
  소비할 수 있도록 제공되는 인프라의 정해진 양(CPU, 메모리 등).

aka:
tags:
- architecture
---
하나 이상의 {{< glossary_tooltip text="노드" term_id="node" >}}에 제공되어, 해당 노드에서 실행 중인 {{< glossary_tooltip text="파드" term_id="pod" >}}가
사용할 수 있는 기능(CPU, 메모리, GPU 등)이다.

쿠버네티스는 _리소스_ 라는 용어를 {{< glossary_tooltip text="API 리소스" term_id="api-resource" >}}를 설명할 때도 사용한다.

<!--more-->
컴퓨터는 처리 능력, 저장 메모리, 네트워크 등 기본적인 하드웨어 기능을 제공한다.
이러한 리소스는 유한한 용량을 가지며, 각 리소스에 알맞은 단위(CPU 수, 메모리의 바이트 수 등)로 측정된다.
쿠버네티스는 {{< glossary_tooltip text="워크로드" term_id="workload" >}}에
할당할 수 있도록 공통 [리소스](/docs/concepts/configuration/manage-resources-containers/)를 추상화하고, 리소스 사용량을 관리하기 위해 운영 체제의 기본 요소(예: Linux {{< glossary_tooltip text="cgroups" term_id="cgroup" >}})를 활용한다.

[동적 리소스 할당](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)을
사용하여 복잡한 리소스 할당을 자동으로 관리할 수도 있다.
