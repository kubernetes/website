---
title: 애그리게이션 레이어(Aggregation Layer)
id: aggregation-layer
date: 2018-10-08
full_link: /ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  애그리게이션 레이어를 이용하면 사용자가 추가로 쿠버네티스 형식의 API를 클러스터에 설치할 수 있다.

aka:
tags:
- architecture
- extension
- operation
---
애그리게이션 레이어를 이용하면 사용자가 추가로 쿠버네티스 형식의 API를 클러스터에 설치할 수 있다.

<!--more-->

{{< glossary_tooltip text="쿠버네티스 API 서버" term_id="kube-apiserver" >}}에서 [추가 API 지원](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)을 구성하였으면, 쿠버네티스 API의 URL 경로를 "요구하는" `APIService` 오브젝트 추가할 수 있다.
