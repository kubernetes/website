---
title: API 오브젝트에 대한 쿼터 구성
content_type: task
weight: 130
---


<!-- overview -->

이 페이지에서는 퍼시스턴트볼륨클레임(PersistentVolumeClaim) 및 
서비스를 포함한 API 오브젝트에 대한 쿼터를 구성하는 방법을 설명한다.
쿼터는 네임스페이스에 생성할 수 있는 
특정 유형의 오브젝트 수를 제한한다.
쿼터는 [리소스쿼터(ResourceQuota)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core) 
오브젝트에서 지정한다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## 네임스페이스 생성

이 예제에서 생성하는 리소스가 클러스터의 나머지 부분과 격리되도록  
네임스페이스를 생성한다.

```shell
kubectl create namespace quota-object-example
```

## 리소스쿼터 생성

리소스쿼터 오브젝트의 구성 파일은 다음과 같다.

{{% codenew file="admin/resource/quota-objects.yaml" %}}

리소스쿼터를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects.yaml --namespace=quota-object-example
```

리소스쿼터에 대한 자세한 정보를 살펴본다.

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

출력에 따르면 quota-object-example 네임스페이스가 
최대 하나의 퍼시스턴트볼륨클레임, 최대 두 개의 로드밸런서 유형의 서비스를 가질 수 있으며, NodePort 유형의 서비스는 
가질 수 없다.

```yaml
status:
  hard:
    persistentvolumeclaims: "1"
    services.loadbalancers: "2"
    services.nodeports: "0"
  used:
    persistentvolumeclaims: "0"
    services.loadbalancers: "0"
    services.nodeports: "0"
```

## 퍼시스턴트볼륨클레임 생성

퍼시스턴트볼륨클레임 오브젝트에 대한 구성 파일은 다음과 같다.

{{% codenew file="admin/resource/quota-objects-pvc.yaml" %}}

퍼시스턴트볼륨클레임을 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc.yaml --namespace=quota-object-example
```

퍼시스턴트볼륨클레임이 생성되었는지 확인한다.

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

출력에 따르면 퍼시스턴트볼륨클레임이 존재하고 Pending 상태이다.

```
NAME             STATUS
pvc-quota-demo   Pending
```

## 두 번째 퍼시스턴트볼륨클레임 생성 시도

두 번째 퍼시스턴트볼륨클레임 오브젝트의 구성 파일은 다음과 같다.

{{% codenew file="admin/resource/quota-objects-pvc-2.yaml" %}}

두 번째 퍼시스턴트볼륨클레임 생성을 시도한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

출력에 따르면 두 번째 퍼시스턴트볼륨클레임이 네임스페이스의 쿼터를 초과했기 때문에 생성되지 않았다.


```
persistentvolumeclaims "pvc-quota-demo-2" is forbidden:
exceeded quota: object-quota-demo, requested: persistentvolumeclaims=1,
used: persistentvolumeclaims=1, limited: persistentvolumeclaims=1
```

## 참고 사항

쿼터로 제한할 수 있는 API 리소스를 확인하는 데 사용되는 문자열은 
다음과 같다.

<table>
<tr><th>문자열</th><th>API 오브젝트</th></tr>
<tr><td>"pods"</td><td>파드</td></tr>
<tr><td>"services"</td><td>서비스</td></tr>
<tr><td>"replicationcontrollers"</td><td>레플리케이션컨트롤러(ReplicationController)</td></tr>
<tr><td>"resourcequotas"</td><td>리소스쿼터</td></tr>
<tr><td>"secrets"</td><td>시크릿(Secret)</td></tr>
<tr><td>"configmaps"</td><td>컨피그맵(ConfigMap)</td></tr>
<tr><td>"persistentvolumeclaims"</td><td>퍼시스턴트볼륨클레임</td></tr>
<tr><td>"services.nodeports"</td><td>NodePort 유형의 서비스</td></tr>
<tr><td>"services.loadbalancers"</td><td>로드밸런서 유형의 서비스</td></tr>
</table>

## 정리

네임스페이스를 삭제한다.

```shell
kubectl delete namespace quota-object-example
```



## {{% heading "whatsnext" %}}


### 클러스터 관리자의 경우

* [네임스페이스에 대한 기본 메모리 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 대한 기본 CPU 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

### 앱 개발자의 경우

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)








