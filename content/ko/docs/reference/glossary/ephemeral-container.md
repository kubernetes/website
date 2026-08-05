---
title: 임시 컨테이너(Ephemeral Container)
id: ephemeral-container
date: 2019-08-26
full_link: /ko/docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  파드 내에 임시적으로 실행할 수 있는 컨테이너 타입

aka:
tags:
- fundamental
---
{{< glossary_tooltip text="파드" term_id="pod" >}} 내에 임시적으로 실행할 수 있는 {{< glossary_tooltip text="컨테이너" term_id="container" >}} 타입.

<!--more-->

문제가 있는 실행 중 파드를 조사하고 싶다면, 파드에 임시 컨테이너를 추가하고 진단을 수행할 수 있다. 임시 컨테이너는 리소스 및 스케줄링에 대한 보장이 제공되지 않으며, 워크로드 자체를 실행하기 위해 임시 컨테이너를 사용해서는 안 된다.

{{< glossary_tooltip text="스태틱 파드(static pod)" term_id="static-pod" >}}는 임시 컨테이너를 지원하지 않는다.

<!-- Even though the English doc doesn't mention this, the link below is to help Korean readers understand what 임시 컨테이너 equates to in the API. -->
더 자세한 정보는 파드 API의 [EphemeralContainer](/docs/reference/kubernetes-api/workload-resources/pod-v1/#EphemeralContainer)를 참고한다.
