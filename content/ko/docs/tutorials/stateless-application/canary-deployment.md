---
title: 카나리(canary) 디플로이먼트를 사용하여 릴리스 배포하기
content_type: tutorial
weight: 10
card:
  name: tutorials
  weight: 60
  title: "카나리 디플로이먼트 배포하기"
---

<!-- overview -->

이 튜토리얼은 쿠버네티스에서 카나리 릴리스를 배포하는 과정을 안내한다. 카나리 배포를 사용하면 새 애플리케이션 버전을 완전히 롤아웃하기 전에 프로덕션 트래픽의 일부만으로 안전하게 테스트할 수 있다. 이 방식은 위험을 최소화하는 데 도움이 되고 실제 사용자로부터 빠른 피드백을 받을 수 있게 한다.

카나리 배포의 개요는 워크로드 관리 개념 페이지의 [카나리아 배포](/docs/concepts/workloads/management/#카나리아-배포)를 참고한다.

## {{% heading "objectives" %}}

* 애플리케이션의 스테이블 버전을 배포한다.
* 스테이블 버전과 나란히 카나리 버전을 배포한다.
* 서비스를 사용하여 두 버전 모두에 트래픽을 라우팅한다.
* 카나리 디플로이먼트(Deployment)를 모니터링한다.
* 카나리를 스케일링하고 스테이블 버전을 제거하여 롤아웃을 완료한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- lessoncontent -->

## 카나리 배포 이해하기

카나리 배포는 기존 버전과 나란히 애플리케이션의 새 버전을 배포하는 전략이다. 새 버전(카나리)은 트래픽의 일부만 받으며, 이를 통해 다음을 할 수 있다.

* 실제 프로덕션 트래픽으로 새 버전을 테스트한다.
* 오류, 성능 문제, 예상치 못한 동작을 모니터링한다.
* 문제가 감지되면 빠르게 롤백한다.
* 잘 동작하면 새 버전으로 가는 트래픽을 점진적으로 늘린다.

이 튜토리얼에서는 `track` 레이블로 스테이블 릴리스와 카나리 릴리스를 구분한다. 스테이블 릴리스는 `track: stable`을, 카나리 릴리스는 `track: canary`를 사용한다. 두 디플로이먼트는 서비스가 두 파드 세트 모두에 트래픽을 라우팅할 수 있게 하는 공통 레이블(`app.kubernetes.io/name: rollout-demo`)을 공유한다.

스테이블 버전은 레플리카 3개로, 카나리 버전은 레플리카 1개로 배포한다. 두 버전이 같은 서비스 셀렉터(`app.kubernetes.io/name: rollout-demo`)를 공유하므로, 쿠버네티스는 파드 4개 전체에 트래픽을 로드 밸런싱한다. 이 비율에서는 트래픽의 약 25%가 카나리로, 75%가 스테이블 버전으로 간다.

## 스테이블 버전 배포하기

먼저, 애플리케이션의 스테이블 버전을 배포한다.

{{% code_sample file="application/canary/app-v1-deployment.yaml" %}}

스테이블 디플로이먼트를 적용한다.

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v1-deployment.yaml
```

디플로이먼트가 생성되고 파드가 실행 중인지 확인한다.

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

출력은 다음과 유사하다.

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           10s
```

파드를 확인한다.

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

출력은 다음과 유사하다.

```
NAME                                  READY   STATUS    RESTARTS   AGE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          15s
```

## 서비스 생성하기

애플리케이션을 노출하기 위해 서비스를 생성한다. 서비스 셀렉터는 공통 레이블(`app.kubernetes.io/name: rollout-demo`)을 사용하고 `track` 레이블은 생략하는데, 이를 통해 서비스가 스테이블 파드와 카나리 파드 모두에 트래픽을 라우팅할 수 있다.

{{% code_sample file="application/canary/app-service.yaml" %}}

서비스를 적용한다.

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-service.yaml
```

서비스가 생성되었는지 확인한다.

```shell
kubectl get service rollout-demo-service
```

출력은 다음과 유사하다.

```
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
rollout-demo-service   ClusterIP   10.96.123.45    <none>        80/TCP    5s
```

임시 파드를 생성하고 요청을 보내서 서비스를 테스트한다.

```shell
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://rollout-demo-service
```

스테이블 파드에서 오는 응답을 볼 수 있다. 이 명령을 여러 번 실행하면 서로 다른 파드 호스트네임을 확인할 수 있지만, 모든 응답은 v1 버전을 표시해야 한다.

이 시점에서 애플리케이션은 안정된 상태다. 실제 상황이라면 보통 여기서 멈추고 배포할 새 버전이 나올 때까지 스테이블 버전을 운영한다. 다음 단계에서는 카나리 버전을 도입하는 방법을 보여준다.

## 카나리 버전 배포하기

카나리 디플로이먼트를 생성하려면 스테이블 디플로이먼트 매니페스트를 복사해 다음 몇 가지를 변경할 수 있다.

- `metadata.name`을 변경한다(예: `rollout-demo-canary`).
- `metadata.labels`와 `spec.selector.matchLabels`/`spec.template.metadata.labels` 양쪽에서 `track` 레이블을 `stable`에서 `canary`로 변경한다.
- 레플리카 수를 더 적게 설정한다(예: 1).
- 컨테이너 이미지를 새 버전으로 업데이트한다.

업데이트한 매니페스트는 다음과 같아야 한다.

{{% code_sample file="application/canary/app-v2-deployment.yaml" %}}

`kubectl`로 로컬 매니페스트를 적용할 수도 있고, 원한다면 검증된 다음 예제를 사용할 수도 있다.

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v2-deployment.yaml
```

두 디플로이먼트가 모두 실행 중인지 확인한다.

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

출력은 다음과 유사하다.

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           2m
rollout-demo-canary    1/1     1            1           10s
```

모든 파드를 확인한다.

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -o wide
```

출력은 다음과 유사하다.

```
NAME                                  READY   STATUS    RESTARTS   AGE   IP           NODE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          2m    10.244.1.5   node1
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          2m    10.244.1.6   node1
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          2m    10.244.2.7   node2
rollout-demo-canary-8e5c0d9f6a-xyz78   1/1     Running   0          15s   10.244.2.8   node2
```

이제 파드가 모두 4개임을 알 수 있다. 스테이블 파드 3개와 카나리 파드 1개다.

## 트래픽 분배 테스트하기

두 디플로이먼트가 같은 서비스 셀렉터(`app.kubernetes.io/name: rollout-demo`)를 사용하므로, 서비스는 모든 파드로 트래픽을 라우팅한다. 스테이블 파드 3개와 카나리 파드 1개라면 요청의 약 25%가 카나리로 간다.

트래픽 분배를 확인하기 위해 서비스를 여러 번 테스트한다.

```shell
kubectl run curl-test --image=docker.io/library/curlimages/curl:latest --rm -it --restart=Never -- \
  sh -c 'for i in $(seq 1 10); do curl -s http://rollout-demo-service; echo; done'
```

스테이블 버전과 카나리 버전 양쪽에서 오는 응답을 볼 수 있다. 비율은 달라질 수 있지만, 스테이블 응답에 카나리 응답이 일부 섞여 있는 것을 볼 수 있다.

두 버전이 모두 트래픽을 받고 있는지 확인하려면 서비스의 엔드포인트슬라이스(EndpointSlice)를 조회한다.

```shell
kubectl get endpointslices -l kubernetes.io/service-name=rollout-demo-service
```

출력은 다음과 유사하다(주소 패밀리마다 엔드포인트슬라이스가 하나이며 ENDPOINTS 열은 기본적으로 잘려서 표시된다).

```
NAME                          ADDRESSTYPE   PORTS   ENDPOINTS                              AGE
rollout-demo-service-abc12    IPv4          8080    10.244.1.5,10.244.1.6,10.244.2.7 + 1 more...   3m
```

모든 엔드포인트 주소를 보려면 `-o yaml`을 사용한다.

## 카나리 디플로이먼트 모니터링하기

카나리 디플로이먼트에서 오류, 성능 문제, 예상치 못한 동작이 있는지 모니터링한다.

카나리의 파드 로그를 확인한다.

```shell
kubectl logs -l app.kubernetes.io/name=rollout-demo,track=canary --tail=50
```

파드 상태를 모니터링한다.

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -w
```

감시를 멈추려면 Ctrl+C를 누른다.

리소스 사용량을 확인한다.

```shell
kubectl top pods -l app.kubernetes.io/name=rollout-demo
```

{{< note >}}
`kubectl top` 명령은 클러스터에 [metrics-server](https://github.com/kubernetes-sigs/metrics-server)가 설치되어 있어야 한다. 사용할 수 없다면 프로메테우스나 클라우드 공급자의 모니터링 도구 같은 다른 방법으로 모니터링할 수 있다.
{{< /note >}}

## 트래픽 분배 조정하기

카나리가 잘 동작하고 있으면 스케일 업해서 카나리로 가는 트래픽을 점진적으로 늘릴 수 있다.

카나리를 레플리카 2개로 스케일링한다(이제 트래픽의 40%).

```shell
kubectl scale deployment/rollout-demo-canary --replicas=2
```

새 파드가 실행 중인지 확인한다.

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

계속 모니터링한다. 모든 것이 괜찮아 보이면 카나리를 더 스케일 업하고 스테이블 버전을 스케일 다운할 수 있다.

## 롤아웃 완료하기

모니터링에서 오히려 카나리의 문제가 드러났다면 대신 롤백하게 된다.
문제 상황을 연습해 보려면 [카나리 디플로이먼트 롤백하기](#카나리-디플로이먼트-롤백하기)로 건너뛸 수 있다.



디플로이먼트 하나로 롤아웃을 완료하려면, 먼저 스테이블 디플로이먼트를 다시 스케일 업해서 새 이미지 풀에 실패해도 용량을 잃지 않게 한다. 그런 다음 이미지와 `VERSION` 환경 변수를 새 버전에 맞게 업데이트하고, 롤아웃이 완료되기를 기다린 뒤 카나리 디플로이먼트를 제거한다.

```shell
kubectl scale deployment/rollout-demo-stable --replicas=3

# Outside of this tutorial, you wouldn't set the
# environment variable $VERSION.
# However, your new application code might need
# other configuration changes after an upgrade.
kubectl set image deployment/rollout-demo-stable rollout-demo=gcr.io/google-samples/hello-app:2.0
kubectl set env deployment/rollout-demo-stable VERSION=v2

# Wait for the rollout to complete
kubectl rollout status deployment/rollout-demo-stable

kubectl delete deployment rollout-demo-canary
```

이 작업이 성공했으므로, 이제 [정리하기](#정리하기)
절로 넘어갈 준비가 되었다. 바로 다음에 나오는 롤백 절은 따라 하지 않아도 된다.

또는 정리를 시작하기 전에 페이지의 나머지 내용을 읽어도 된다.
다룰 주제가 몇 가지 더 있다.

## 카나리 디플로이먼트 롤백하기

카나리 버전에서 문제를 감지하면 빠르게 롤백할 수 있다.

카나리 디플로이먼트를 스케일 다운한다.

```shell
kubectl scale deployment/rollout-demo-canary --replicas=0
```

0으로 스케일링하면 카나리 디플로이먼트가 유지되므로 조사하는 동안 그 구성을 살펴볼 수 있다. 조사를 마치면 `kubectl delete deployment rollout-demo-canary`로 카나리 디플로이먼트를 삭제한다.

필요하면 스테이블 버전을 다시 스케일 업한다.

```shell
kubectl scale deployment/rollout-demo-stable --replicas=3
```

다시 카나리 배포를 시도하기 전에 카나리의 문제를 조사한다.

## HTTP라우트(HTTPRoute)를 사용하여 트래픽 분할하기 (선택 사항)


[게이트웨이 API(Gateway API)](https://gateway-api.sigs.k8s.io/)를 사용하고 있다면, HTTP라우트로 스테이블 버전과 카나리 버전 사이의 트래픽 분할을 더 정밀하게 제어할 수 있다. 이 방식에서는 레플리카 수에 의존하지 않고 정확한 트래픽 분배 비율을 지정할 수 있다.

먼저 스테이블 버전과 카나리 버전에 각각 별도의 서비스를 생성한다. 이 방식은 게이트웨이 API를 사용하지 않더라도 디버깅에도 유용하다. 서비스를 따로 두면 각 버전을 독립적으로 직접 테스트하거나 모니터링할 수 있다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-stable-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
    track: stable
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-canary-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
    track: canary
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

그런 다음 두 서비스 사이에서 트래픽을 분할하는 HTTP라우트를 생성한다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

이 구성은 레플리카 수와 무관하게 트래픽의 90%를 스테이블 서비스로, 10%를 카나리 서비스로 라우팅한다.

헤더 기반 라우팅으로 특정 트래픽을 카나리로 보낼 수도 있다.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  # Rule 1: Route traffic with canary header to canary service
  - matches:
    - headers:
      - type: Exact
        name: env
        value: canary
    backendRefs:
    - name: rollout-demo-canary-service
      port: 80
  # Rule 2: Split remaining traffic 90/10
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

이 구성은 `env: canary` 헤더가 있는 모든 트래픽을 카나리 서비스로 보내고, 나머지 트래픽은 스테이블과 카나리 사이에서 90 대 10으로 분할한다.

{{< note >}}
게이트웨이 API는 클러스터에 게이트웨이 컨트롤러가 설치되어 있어야 한다. 설치 방법과 지원되는 구현체는 [게이트웨이 API 문서](https://gateway-api.sigs.k8s.io/)를 참고한다.
{{< /note >}}

## 카나리 롤아웃 자동화하기

프로덕션 환경에서 카나리 롤아웃은 보통 트래픽 전환, 모니터링, 승격(promotion)이나 롤백을 자동화하는 컨트롤러나 CI/CD 시스템이 관리한다. Flux, Argo Rollouts, GitLab 등 여러 도구가 점진적 배포(progressive delivery), 분석, 롤백을 처리할 수 있다. 이렇게 하면 수동 단계가 줄어들며 안전하고 반복 가능한 배포를 보장하는 데 도움이 된다. 자세한 내용은 선택한 배포 도구나 컨트롤러의 문서를 참고한다.

## {{% heading "cleanup" %}}

이 튜토리얼에서 생성한 리소스를 삭제한다.

```shell
kubectl delete deployment rollout-demo-stable rollout-demo-canary
kubectl delete service rollout-demo-service
```

HTTP라우트용으로 별도의 서비스를 생성했다면 그 서비스도 삭제한다.

```shell
kubectl delete service rollout-demo-stable-service rollout-demo-canary-service
kubectl delete httproute rollout-demo-route
```

## {{% heading "whatsnext" %}}

* 워크로드 관리 개념 페이지에서 [카나리아 배포](/docs/concepts/workloads/management/#카나리아-배포)에 대해 자세히 알아본다.
* [디플로이먼트](/docs/concepts/workloads/controllers/deployment/)와 디플로이먼트가 애플리케이션 라이프사이클을 어떻게 관리하는지에 대해 읽는다.
* [서비스](/docs/concepts/services-networking/service/)와 서비스가 서비스 디스커버리 및 로드 밸런싱을 어떻게 가능하게 하는지에 대해 읽는다.
* 고급 트래픽 관리 기능에 대해서는 [게이트웨이 API](/docs/concepts/services-networking/gateway/)를 살펴본다.
* 메트릭을 기반으로 레플리카 수를 자동으로 조정하려면 [수평 파드 오토스케일링](/docs/tasks/run-application/horizontal-pod-autoscale/)을 사용하는 것을 고려한다.
