---
title: 스케줄링 정책
content_type: concept
sitemap:
  priority: 0.2 # Scheduling priorities are deprecated
weight: 30
---

<!-- overview -->

쿠버네티스 v1.23 이전 버전에서는, *단정(predicates)* 및 *우선순위(priorities)* 프로세스를 지정하기 위해 스케줄링 정책을 사용할 수 있다. 
예를 들어, `kube-scheduler --policy-config-file <filename>` 또는 `kube-scheduler --policy-configmap <ConfigMap>` 명령을 실행하여 스케줄링 정책을 설정할 수 있다.

이러한 스케줄링 정책은 쿠버네티스 v1.23 버전부터 지원되지 않는다. 관련된 플래그인 `policy-config-file`, `policy-configmap`, `policy-configmap-namespace`, `use-legacy-policy-config` 플래그도 지원되지 않는다. 대신, 비슷한 효과를 얻기 위해 [스케줄러 구성](/ko/docs/reference/scheduling/config/)을 사용한다.

## {{% heading "whatsnext" %}}

* [스케줄링](/ko/docs/concepts/scheduling-eviction/kube-scheduler/)에 대해 배우기
* [kube-scheduler 프로파일](/docs/reference/scheduling/profiles/)에 대해 배우기
* [kube-scheduler configuration 레퍼런스 (v1)](/docs/reference/config-api/kube-scheduler-config.v1/) 읽어보기
