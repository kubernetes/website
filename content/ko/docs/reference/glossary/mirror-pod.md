---
title: 미러 파드(Mirror Pod)
id: mirror-pod
date: 2091-02-12
full_link:
short_description: >
  Kubelet의 스태틱 파드(Static Pod)를 추적하는 API 서버 내부의 객체.

aka:
tags:
- fundamental
---
  Kubelet이 {{< glossary_tooltip text="스태틱 파드" term_id="static-pod" >}}를
  표현하는 {{< glossary_tooltip text="파드" term_id="pod" >}} 객체

<!--more-->
Kubelet이 설정에서 스태틱 파드를 찾으면, 자동으로 쿠버네티스
API 서버에 파드 객체 생성을 시도한다. 이렇게 생성된 파드를
API 서버에서 확인할 수는 있지만, API 서버를 통해 제어할 수는 없다.

(예를 들어, 미러 파드를 제거하더라도 kubelet 데몬이 해당 파드를 멈추지 않는다.)
