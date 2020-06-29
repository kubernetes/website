---
title: 컨트롤 플레인(Control Plane)
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  컨테이너의 라이프사이클을 정의, 배포, 관리하기 위한 API와 인터페이스들을 노출하는 컨테이너 오케스트레이션 레이어.

aka:
tags:
- fundamental
---
  컨테이너의 라이프사이클을 정의, 배포, 관리하기 위한 API와 인터페이스들을 노출하는 컨테이너 오케스트레이션 레이어.

 <!--more-->

이 계층은 다음과 같은 다양한 컴포넌트로 구성된다(그러나 제한되지는 않는다).

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="컨트롤러 매니저" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="클라우드 컨트롤러 매니저" term_id="cloud-controller-manager" >}}

 이러한 컴포넌트는 기존 운영체제 서비스(데몬) 또는 컨테이너로 실행할 수 있다. 이러한 컴포넌트를 실행하는 호스트를 {{< glossary_tooltip text="마스터" term_id="master" >}}라 한다.