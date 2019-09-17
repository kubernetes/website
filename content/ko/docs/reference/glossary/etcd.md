---
title: etcd
id: etcd
date: 2018-04-12
full_link: /docs/tasks/administer-cluster/configure-upgrade-etcd/
short_description: >
  모든 클러스터 데이터를 담는 쿠버네티스 뒷단의 저장소로 사용되는 일관성·고가용성 키-값 저장소.

aka: 
tags:
- architecture
- storage
---
 모든 클러스터 데이터를 담는 쿠버네티스 뒷단의 저장소로 사용되는 일관성·고가용성 키-값 저장소.

<!--more-->

쿠버네티스 클러스터에서 etcd를 뒷단의 저장소로 사용한다면,
이 데이터를 [백업](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)하는 계획은
필수이다.

etcd에 대한 자세한 정보는, [etcd 문서](https://github.com/coreos/etcd/blob/master/Documentation/docs.md)를 참고한다.
