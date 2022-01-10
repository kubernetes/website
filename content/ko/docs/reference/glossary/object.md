---
title: 오브젝트(Object)
id: object
date: 2020-12-1
full_link: https://kubernetes.io/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/#kubernetes-objects
short_description: >
   클러스터 상태의 일부를 나타내는 쿠버네티스 시스템의 엔티티이다.
aka:
tags:
- fundamental
---
쿠버네티스 시스템의 엔티티이다. 쿠버네티스 API가 클러스터의 상태를 나타내기 위해
사용하는 엔티티이다.
<!--more-->
쿠버네티스 오브젝트는 일반적으로 "의도를 담은 레코드"이다. 당신이 오브젝트를 생성하게 되면, 쿠버네티스
{{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}은 그 아이템이 실제 존재함을 보장하기 위해
지속적으로 작동한다.
객체를 생성함으로써 당신의 클러스터의 워크로드 해당 부분이 어떻게 보이길 원하는지 쿠버네티스 시스템에 효과적으로 알리는 것이다.
이것은 당신의 클러스터의 의도한 상태이다.
