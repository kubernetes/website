---
title: API 서버
id: kube-apiserver
date: 2018-04-12
full_link: /ko/docs/concepts/overview/components/#kube-apiserver
short_description: >
  쿠버네티스 API를 제공하는 컨트롤 플레인 컴포넌트.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
API 서버는 쿠버네티스 API를 외부에 노출하며, {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}의 진입점 역할을 하는 컴포넌트이다.

<!--more-->

쿠버네티스 API 서버의 주요 구현은 [kube-apiserver](/docs/reference/generated/kube-apiserver/)이다.
kube-apiserver는 수평으로 확장 가능하도록 설계되어, 여러 인스턴스를 배포해 확장할 수 있다.
여러 kube-apiserver 인스턴스를 실행하고, 인스턴스 간의 트래픽을 균형 있게 조절할 수 있다.
