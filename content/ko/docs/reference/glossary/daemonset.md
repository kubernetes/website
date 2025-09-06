---
title: 데몬셋(DaemonSet)
id: daemonset
date: 2019-03-04
full_link: /ko/docs/concepts/workloads/controllers/daemonset/
short_description: 클러스터의 모든(또는 일부) 노드에서 특정 파드의 복제본이 항상 실행되도록 보장하는 컨트롤러.
aka:
- DaemonSet
tags:
- fundamental
- workloads
- core-object
related:
- /ko/docs/concepts/workloads/controllers/daemonset/
- /ko/docs/concepts/architecture/nodes/
- /ko/docs/concepts/workloads/controllers/deployment/
---

<!-- overview -->
**데몬셋(DaemonSet)** 은 {{< glossary_tooltip text="클러스터" term_id="cluster" >}}의 모든(또는 선택된) {{< glossary_tooltip text="노드" term_id="node" >}}에서 특정 {{< glossary_tooltip text="파드" term_id="pod" >}}의 복제본이 **항상** 실행되도록 보장하는 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}다.

<!-- body -->
데몬셋은 보통 노드마다 하나씩 필요한 **노드 로컬 에이전트**를 배포할 때 사용한다. 예를 들어:

- 로그 수집기(예: node-level log shipper)
- 노드/시스템 메트릭 수집기(예: node exporter)
- 노드 수준의 네트워크/스토리지 에이전트

새로운 노드가 클러스터에 추가되면, 해당 노드에도 자동으로 데몬 파드가 생성된다.  
노드가 제거되면, 그 노드에서 실행되던 데몬 파드는 함께 제거된다.  
라벨 셀렉터와 노드 셀렉터/어피니티를 활용하면 **일부 노드 집합에만** 데몬 파드를 배치할 수도 있다.

<!-- best_practices -->
데몬셋은 모든(또는 특정) 노드에 공통으로 필요한 기능(모니터링, 로깅, 시스템 에이전트 등)을 **간단하고 일관되게 배포·유지**하는 데 유용하다.  
데몬셋으로 배포한 워크로드는 일반 {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}와 달리 **노드 수/구성 변화에 자동 대응**하므로, 클러스터 운영 자동화 수준을 높일 수 있다.

<!-- more -->
더 알아보기:
- [데몬셋 개념](/ko/docs/concepts/workloads/controllers/daemonset/)
- [노드](/ko/docs/concepts/architecture/nodes/)
- [디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/)

