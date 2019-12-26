---
title: 컨트롤러(Controller)
id: controller
date: 2018-04-12
full_link: /ko/docs/concepts/architecture/controller/
short_description: >
  API 서버를 통해 클러스터의 공유된 상태를 감시하고, 현재 상태를 원하는 상태로 이행시키는 컨트롤 루프.

aka:
tags:
- architecture
- fundamental
---
쿠버네티스에서 컨트롤러는 {{< glossary_tooltip term_id="cluster" text="클러스터">}}
의 상태를 관찰 한 다음, 필요한 경우에 생성 또는 변경을 
요청하는 컨트롤 루프이다.
각 컨트롤러는 현재 클러스터 상태를 의도한 상태에 가깝게
이동한다.


<!--more-->

컨트롤러는 {{< glossary_tooltip text="api 서버" term_id="kube-apiserver" >}} 
({{< glossary_tooltip term_id="control-plane" >}}의 일부)를 
통해 클러스터의 공유 상태를 감시한다.

일부 컨트롤러는 컨트롤 플레인 내부에서 실행되며, 쿠버네티스 작업의 핵심인 
컨트롤 루프를 제공한다. 예를 들어 디플로이먼트 컨트롤러,
데몬셋 컨트롤러, 네임스페이스 컨트롤러 그리고 퍼시스턴트 볼륨
컨트롤러(및 그 외)는 모두 "kube-controller-manager" 내에서 실행 된다.
