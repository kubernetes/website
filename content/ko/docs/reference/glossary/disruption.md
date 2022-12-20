---
title: 중단(Disruption)
id: disruption
date: 2019-09-10
full_link: /ko/docs/concepts/workloads/pods/disruptions/
short_description: >
  파드의 서비스 중단으로 이어지는 이벤트
aka:
tags:
- fundamental
---
중단은 하나 이상의 {{< glossary_tooltip term_id="pod" text="파드" >}}를
중단시키게 만드는 이벤트를 의미한다.
중단은 {{< glossary_tooltip term_id="deployment" >}}와 같이
해당 영향을 받는 파드에 의존하는 워크로드 리소스에도 영향을
준다.

<!--more-->

클러스터 오퍼레이터로서, 애플리케이션에 속한 파드를 직접 파괴하는 경우
쿠버네티스는 이를 _자발적 중단(voluntary disruption)_ 이라고 칭한다.
노드 장애 또는 더 넓은 영역에 장애를 일으키는 정전 등으로 인해 파드가 오프라인 상태가 되면
쿠버네티스는 이를 _비자발적 중단(involuntary disruption)_ 이라고 한다.

자세한 정보는 [중단](/ko/docs/concepts/workloads/pods/disruptions/)을 확인한다.
