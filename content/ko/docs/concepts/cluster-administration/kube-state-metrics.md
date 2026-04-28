---
title: 쿠버네티스 오브젝트 상태에 대한 메트릭
content_type: concept
weight: 75
description: >-
   클러스터 수준의 메트릭을 생성하고 노출하는 애드온 에이전트인 kube-state-metrics
---

쿠버네티스 API에서 쿠버네티스 오브젝트에 대한 상태를 메트릭으로 노출할 수 있다.  
[kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)라고 하는 애드온 에이전트는 쿠버네티스 API 서버에 연결하고 클러스터에 있는 개별 오브젝트 상태에서 생성된 메트릭으로 HTTP 엔드포인트를 노출할 수 있다.
이는 레이블과 어노테이션, 시작 및 종료 시간, 상태 또는 오브젝트가 현재 속한 단계(phase)와 같은 오브젝트 상태에 대한 다양한 정보를 노출한다.  
예를 들어, 파드 내에서 실행 중인 컨테이너는 `kube_pod_container_info` 메트릭을 생성한다.  
여기에는 컨테이너 이름, 컨테이너가 속한 파드 이름, 파드가 실행 중인 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}, 컨테이너 이미지 이름, 이미지 ID, 컨테이너 사양의 이미지 이름, 실행 중인 컨테이너 ID 및 파드 ID가 레이블로 포함된다.

{{% thirdparty-content single="true" %}}

kube-state-metrics의 엔드포인트를 스크래핑할 수 있는 외부 컴포넌트(예를 들어 프로메테우스를 통해)는 이제 다음 사용 사례를 활성화할 수 있다.

## 예시: kube-state-metrics 메트릭을 사용한 클러스터 상태 조회 {#example-kube-state-metrics-query-1}

kube-state-metrics가 생성하는 메트릭 시리즈는 쿼리를 통해 클러스터에 대한 추가적인 인사이트를 얻는 데 있어 유용하다.

프로메테우스 또는 동일한 쿼리 언어를 사용하는 도구를 사용하는 경우, 다음 PromQL 쿼리는 준비 상태가 되지 않은 파드 개수를 반환한다.

```
count(kube_pod_status_ready{condition="false"}) by (namespace, pod)
```

## 예시: kube-state-metrics 기반 경고 설정 {#example-kube-state-metrics-alert-1}

kube-state-metrics에서 생성한 메트릭을 사용하면 클러스터의 이슈에 대한 알람을 설정할 수 있다.

프로메테우스 또는 동일한 알림 규칙 언어(alert rule language)를 사용하는 도구를 사용하는 경우, 다음 알람은 `Terminating` 상태가 5분 이상 지속된 파드를 감지할 수 있다.

```yaml
groups:
- name: Pod state
  rules:
  - alert: PodsBlockedInTerminatingState
    expr: count(kube_pod_deletion_timestamp) by (namespace, pod) * count(kube_pod_status_reason{reason="NodeLost"} == 0) by (namespace, pod) > 0
    for: 5m
    labels:
      severity: page
    annotations:
      summary: 파드 {{$labels.namespace}}/{{$labels.pod}} 가 Terminating 상태에서 차단됨.
```
