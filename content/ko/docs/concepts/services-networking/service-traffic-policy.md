---
# reviewers:
# - maplain
title: 서비스 내부 트래픽 정책
content_type: concept
weight: 120
description: >-
  클러스터 내의 두 파드가 통신을 하려고 하고 두 파드가 동일한 노드에서 실행되는 경우,
  _서비스 내부 트래픽 정책_을 사용하여 네트워크 트래픽을 해당 노드 안에서 유지할 수 있다.
  클러스터 네트워크를 통한 왕복 이동을 피하면 안전성, 성능
  (네트워크 지연 및 처리량) 혹은 비용 측면에 도움이 될 수 있다.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

_서비스 내부 트래픽 정책_ 을 사용하면 내부 트래픽 제한이 트래픽이 시작된 
노드 내의 엔드포인트로만 내부 트래픽을 라우팅하도록 한다. 
여기서 "내부" 트래픽은 현재 클러스터의 파드로부터 시작된 트래픽을 지칭한다.
이를 통해 비용을 절감하고 성능을 개선할 수 있다.

<!-- body -->

## 서비스 내부 트래픽 정책 사용

{{< glossary_tooltip text="서비스" term_id="service" >}}의 
`.spec.internalTrafficPolicy`를 `Local`로 설정하여 내부 전용 트래픽 정책을 활성화 할 수 있다.
이것은 kube-proxy가 클러스터 내부 트래픽을 위해 노드 내부 엔드포인트로만 사용하도록 한다.

{{< note >}}
지정된 서비스에 대한 엔드포인트가 없는 노드의 파드인 경우에 
서비스는 다른 노드에 엔드포인트가 있더라도 엔드포인트가 없는 것처럼 작동한다. 
(이 노드의 파드에 대해서)
{{< /note >}}

다음 예제는 서비스의 `.spec.internalTrafficPolicy`를 `Local`로 
설정하는 것을 보여 준다:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

## 작동 방식

kube-proxy는 `spec.internalTrafficPolicy` 의 설정에 따라서 라우팅되는 
엔드포인트를 필터링한다. 
이것을 `Local`로 설정하면, 노드 내부 엔드포인트만 고려한다. 
이 설정이 `Cluster`(기본)이거나 설정되지 않았다면 모든 엔드포인트를 고려한다.

## {{% heading "whatsnext" %}}

* [토폴로지 인지 힌트](/ko/docs/concepts/services-networking/topology-aware-hints/)에 대해서 읽기
* [서비스 외부 트래픽 정책](/ko/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)에 대해서 읽기
* [서비스와 애플리케이션 연결하기](/ko/docs/tutorials/services/connect-applications-service/) 를 따라하기
