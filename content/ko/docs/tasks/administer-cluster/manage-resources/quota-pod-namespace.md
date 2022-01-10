---
title: 네임스페이스에 대한 파드 쿼터 구성
content_type: task
weight: 60
---


<!-- overview -->

이 페이지는 네임스페이스에서 실행할 수 있는 총 파드 수에 대한 쿼터를
설정하는 방법을 보여준다.
[리소스쿼터(ResourceQuota)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
오브젝트에 쿼터를 지정한다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## 네임스페이스 생성

이 실습에서 생성한 리소스가 클러스터의 나머지와
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace quota-pod-example
```

## 리소스쿼터 생성

다음은 리소스쿼터 오브젝트의 구성 파일이다.

{{< codenew file="admin/resource/quota-pod.yaml" >}}

리소스쿼터를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod.yaml --namespace=quota-pod-example
```

리소스쿼터에 대한 자세한 정보를 본다.

```shell
kubectl get resourcequota pod-demo --namespace=quota-pod-example --output=yaml
```

출력 결과는 네임스페이스에 두 개의 파드 쿼터가 있고, 현재 파드가 없음을
보여준다. 즉, 쿼터 중 어느 것도 사용되지 않았다.

```yaml
spec:
  hard:
    pods: "2"
status:
  hard:
    pods: "2"
  used:
    pods: "0"
```

다음은 디플로이먼트(Deployment) 구성 파일이다.

{{< codenew file="admin/resource/quota-pod-deployment.yaml" >}}

구성 파일에서, `replicas: 3` 은 쿠버네티스가 모두 동일한 애플리케이션을 실행하는 세 개의 파드를 만들도록 지시한다.

디플로이먼트를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-pod-deployment.yaml --namespace=quota-pod-example
```

디플로이먼트에 대한 자세한 정보를 본다.

```shell
kubectl get deployment pod-quota-demo --namespace=quota-pod-example --output=yaml
```

출력 결과는 디플로이먼트에서 3개의 레플리카를 지정하더라도, 쿼터로
인해 2개의 파드만 생성되었음을 보여준다.

```yaml
spec:
  ...
  replicas: 3
...
status:
  availableReplicas: 2
...
lastUpdateTime: 2017-07-07T20:57:05Z
    message: 'unable to create pods: pods "pod-quota-demo-1650323038-" is forbidden:
      exceeded quota: pod-demo, requested: pods=1, used: pods=2, limited: pods=2'
```

## 정리

네임스페이스를 삭제한다.

```shell
kubectl delete namespace quota-pod-example
```



## {{% heading "whatsnext" %}}


### 클러스터 관리자를 위한 문서

* [네임스페이스에 대한 기본 메모리 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 대한 기본 CPU 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [API 오브젝트에 대한 쿼터 구성](/docs/tasks/administer-cluster/quota-api-object/)

### 앱 개발자를 위한 문서

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)
