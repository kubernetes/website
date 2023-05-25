---
title: 프록시(Proxy)
id: proxy
date: 2019-09-10
short_description: >
  클라이언트와 서버 간의 중개자 역할을 하는 애플리케이션

aka:
tags:
- networking
---
 컴퓨팅에서 프록시는 원격 서비스를 위한 중개자 역할을 하는 서버이다.


<!--more-->

클라이언트는 프록시와 통신한다. 프록시는 클라이언트에게 받은 데이터를 복사하여 실제 서버에게 보내고
실제 서버는 이에 대한 응답을 프록시에게 보낸다. 마지막으로 프록시는 실제 서버에게 받은 응답을 클라이언트에게 전달한다.


[kube-proxy](/ko/docs/reference/command-line-tools-reference/kube-proxy/)는 
클러스터의 각 노드에서 실행되는 네트워크 프록시로, 쿠버네티스 {{< glossary_tooltip text="서비스" term_id="service">}} 개념의
일부를 구현한다.

kube-proxy를 일반 사용자 영역 프록시(plain userland proxy) 서비스로 실행할 수 있다. 운영체제가 지원한다면, 
더 적은 시스템 리소스를 사용하여 동일한 효과를 내는 하이브리드 방식으로 kube-proxy를 대신 실행할 수 있다.

