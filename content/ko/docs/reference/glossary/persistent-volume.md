---
title: 퍼시스턴트 볼륨(Persistent Volume)
id: persistent-volume
date: 2018-04-12
full_link: /ko/docs/concepts/storage/persistent-volumes/
short_description: >
  클러스터의 스토리지를 구성하는 API 오브젝트이다. 보통은 개별 파드보다 수명이 긴 플러그 가능한 형태의 리소스로 제공한다.

aka: 
tags:
- core-object
- storage
---
 클러스터의 스토리지를 나타내는 API 오브젝트이다. 보통은 개별 {{< glossary_tooltip text="파드" term_id="pod" >}}보다 수명이 긴 플러그 가능한 형태의 리소스로 제공한다.

<!--more-->

퍼시스턴트볼륨(PV)은 스토리지를 어떻게 제공하고 사용하는지를 추상화하는 API를 제공한다.
PV는 스토리지를 미리 생성할 수 있는 경우에 사용한다(정적 프로비저닝). 
온-디맨드 스토리지(동적 프로비저닝)가 필요한 경우에는 퍼시스턴트볼륨클레임(PVC)을 대신 사용한다.

