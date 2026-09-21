---
title: 동적 리소스 할당 (원문, Dynamic Resource Allocation)
id: dra
full_link: /docs/concepts/scheduling-eviction/dynamic-resource-allocation/
short_description: >
  하드웨어 가속기와 같은 리소스를
  파드 간에 요청하고 공유할 수 있게 하는 쿠버네티스 기능.

aka:
- DRA
tags:
- extension
---
파드 간에 리소스를 요청하고 공유할 수 있도록 하는
쿠버네티스 기능이다.
이러한 리소스는 하드웨어 가속기와 같이 노드에 연결된
{{< glossary_tooltip text="디바이스" term_id="device" >}}인 경우가 많다.

<!--more-->

DRA를 사용하면 디바이스 드라이버와 클러스터 관리자가 워크로드에서
클레임할 수 있는 디바이스 클래스를 정의한다. 쿠버네티스는
특정 클레임에 조건이 일치하는 디바이스를 할당하고,
할당된 디바이스에 접근할 수 있는 노드에 해당 파드를 배치한다.
