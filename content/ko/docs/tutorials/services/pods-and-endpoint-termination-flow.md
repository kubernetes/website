---
title: 파드와 해당 엔드포인트의 종료 동작 살펴보기
content_type: tutorial
weight: 60
---


<!-- overview -->

애플리케이션을 서비스와 연결하는 단계를 수행하면 
[서비스와 애플리케이션 연결하기](/ko/docs/tutorials/services/connect-applications-service/)에 설명된 것과 같이, 
네트워크에 노출되며 지속적으로 실행되는 복제된 애플리케이션을 갖게 된다. 
이 튜토리얼은 파드의 종료 흐름을 살펴보고, 그레이스풀 연결 드레이닝(graceful connection draining)을 
구현하는 방법을 탐색하는데 도움이 된다. 

<!-- body -->

## 파드와 엔드포인트 종료 과정

업그레이드하거나 규모를 축소(scale down)하는 경우와 같이, 파드를 종료해야 하는 상황은 자주 발생한다. 
애플리케이션의 가용성을 개선하려면, 적절한 활성 연결 드레이닝(active connections draining)을 
구현하는 것이 중요하다.

이 튜토리얼은 간단한 nginx 웹 서버를 사용하여 파드의 종료 과정이 
해당 엔드포인트의 상태 및 제거와 
어떻게 연결되는지의 흐름을 설명한다.

<!-- body -->

## 엔드포인트 종료 흐름 예시

아래 내용은 
[파드의 종료](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) 
문서에서 설명한 예시 흐름이다. 

하나의 `nginx` 레플리카
(단지 시연 목적을 위한 예시)를 포함하는 디플로이먼트(Deployment)와 서비스가 있다고 가정한다.

{{% code_sample file="service/pod-with-graceful-termination.yaml" %}}

{{% code_sample file="service/explore-graceful-termination-nginx.yaml" %}}

위 파일을 이용해 디플로이먼트(Deployment) 파드와 서비스를 생성할 수 있다.

```shell
kubectl apply -f pod-with-graceful-termination.yaml
kubectl apply -f explore-graceful-termination-nginx.yaml
```

파드와 서비스가 실행 중일 때, 관련된 엔드포인트슬라이스(EndpointSlice) 이름을 확인할 수 있다.

```shell
kubectl get endpointslice
```

출력은 다음과 비슷하다.

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

상태를 확인하고, 하나의 엔드포인트가 등록되어 있음을 검증할 수 있다.

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

출력은 다음과 비슷하다.

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
```

이제 파드를 종료하고, 파드가 설정된 그레이스풀 종료 시간을 
따르면서 종료되는지 확인할 수 있다.

```shell
kubectl delete pod nginx-deployment-7768647bf9-b4b9s
```

모든 파드를 확인한다.

```shell
kubectl get pods
```

출력은 다음과 비슷하다.

```none
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

새로운 파드가 스케줄되었음을 확인할 수 있다.

새 파드의 엔드포인트가 생성되는 동안, 기존 엔드포인트는
여전히 종료 중 상태로 남아 있다.

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

출력은 다음과 비슷하다.

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": false,
                "serving": true,
                "terminating": true
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-b4b9s",
                "namespace": "default",
                "uid": "66fa831c-7eb2-407f-bd2c-f96dfe841478"
            },
            "zone": "us-central1-c"
        },
        {
            "addresses": [
                "10.12.1.202"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-rkxlw",
                "namespace": "default",
                "uid": "722b1cbe-dcd7-4ed4-8928-4a4d0e2bbe35"
            },
            "zone": "us-central1-c"
```

이 동작을 통해 애플리케이션은 종료 전 상태를 전달할 수 있으며,
클라이언트(로드밸런서 같은)는 연결 드레이닝 기능을 구현할 수 있다.
이러한 클라이언트는 종료 중 상태의 엔드포인트를 감지하고 그에 대한 특별한 처리를 적용할 수 있다.

쿠버네티스에서는, 종료 중인 엔드포인트가 항상 `ready` 상태를 `false`로 설정한다.
이는 기존 로드밸런서들이 일반 트래픽에 해당 엔드포인트를 사용하지 않도록 하기 위한 
하위 호환성(backward compatibility) 때문이다.
만약 종료 중인 파드에서 트래픽 드레이닝이 필요하다면, 실제 준비 상태는 
`serving` 조건을 통해 확인할 수 있다.

파드가 삭제되면, 기존 엔드포인트도 함께 삭제된다.


## {{% heading "whatsnext" %}}


* 어떻게 [서비스와 애플리케이션 연결하기](/docs/tutorials/services/connect-applications-service/)를 하는 지 알아본다.
* [클러스터 내 애플리케이션에 접근하기 위해 서비스 사용하기](/docs/tasks/access-application-cluster/service-access-application-cluster/)를 더 자세히 알아본다.
* [클러스터 내 애플리케이션에 접근하기 위해 서비스 사용하기](/docs/tasks/access-application-cluster/connecting-frontend-backend/)를 더 자세히 알아본다.
* [외부 로드 밸런서 생성하기](/docs/tasks/access-application-cluster/create-external-load-balancer/)를 더 자세히 알아본다.

