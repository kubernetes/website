---
title: API 오브젝트에 대한 쿼터 구성
content_type: task
weight: 130
---


<!-- overview -->

이 페이지에서는 퍼시스턴트볼륨클레임(PersistentVolumeClaim) 및 서비스를 포함한 
API 오브젝트에 대한 쿼터를 구성하는 방법을 보여준다. 쿼터는 네임스페이스 내에서 
생성할 수 있는 특정 유형의 오브젝트 개수를 제한한다. 
쿼터는 
[리소스쿼터(ResourceQuota)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcequota-v1-core)
오브젝트로 지정한다.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## 네임스페이스 생성

이 실습에서 생성하는 리소스가 클러스터의 다른 리소스와 
격리되도록 네임스페이스를 생성한다.

```shell
kubectl create namespace quota-object-example
```

## 리소스쿼터(ResourceQuota) 생성

다음은 리소스쿼터 오브젝트에 대한 설정 파일이다.

{{% code_sample file="admin/resource/quota-objects.yaml" %}}

리소스쿼터를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects.yaml --namespace=quota-object-example
```

리소스쿼터의 상세 정보를 확인한다.

```shell
kubectl get resourcequota object-quota-demo --namespace=quota-object-example --output=yaml
```

출력 결과를 통해 quota-object-example 네임스페이스에서 퍼시스턴트볼륨클레임은 
최대 1개, LoadBalancer 타입 서비스는 최대 2개가 허용되며, NodePort 타입 서비스는
허용되지 않음을 확인할 수 있다.

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

다음은 퍼시스턴트볼륨클레임 오브젝트에 대한 설정 파일이다.

{{% code_sample file="admin/resource/quota-objects-pvc.yaml" %}}

퍼시스턴트볼륨클레임을 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc.yaml --namespace=quota-object-example
```

퍼시스턴트볼륨클레임이 생성되었는지 확인한다.

```shell
kubectl get persistentvolumeclaims --namespace=quota-object-example
```

출력 결과는 퍼시스턴트볼륨클레임이 존재하며 Pending 상태임을 보여준다.

```
NAME             STATUS
pvc-quota-demo   Pending
```

## 두 번째 퍼시스턴트볼륨클레임 생성 시도

다음은 두 번째 퍼시스턴트볼륨클레임 오브젝트에 대한 설정 파일이다.

{{% code_sample file="admin/resource/quota-objects-pvc-2.yaml" %}}

두 번째 퍼시스턴트볼륨클레임을 생성 시도한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/quota-objects-pvc-2.yaml --namespace=quota-object-example
```

출력 결과는 네임스페이스의 쿼터 초과에 의해서 두 번째 
퍼시스턴트볼륨클레임이 생성되지 않았음을 보여준다.

```
persistentvolumeclaims "pvc-quota-demo-2" is forbidden:
exceeded quota: object-quota-demo, requested: persistentvolumeclaims=1,
used: persistentvolumeclaims=1, limited: persistentvolumeclaims=1
```

## 참고

다음 문자열은 쿼터로 제한할 수 있는 
API 리소스를 식별하는데 사용된다.

<table>
<tr><th>문자열</th><th>API 오브젝트</th></tr>
<tr><td>"pods"</td><td>Pod</td></tr>
<tr><td>"services"</td><td>Service</td></tr>
<tr><td>"replicationcontrollers"</td><td>ReplicationController</td></tr>
<tr><td>"resourcequotas"</td><td>ResourceQuota</td></tr>
<tr><td>"secrets"</td><td>Secret</td></tr>
<tr><td>"configmaps"</td><td>ConfigMap</td></tr>
<tr><td>"persistentvolumeclaims"</td><td>PersistentVolumeClaim</td></tr>
<tr><td>"services.nodeports"</td><td>Service of type NodePort</td></tr>
<tr><td>"services.loadbalancers"</td><td>Service of type LoadBalancer</td></tr>
</table>

## 정리하기

네임스페이스를 삭제한다.

```shell
kubectl delete namespace quota-object-example
```



## {{% heading "whatsnext" %}}


### 클러스터 관리자를 위한 내용

* [네임스페이스에 대한 기본 메모리 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [네임스페이스에 대한 기본 CPU 요청량과 상한 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [네임스페이스에 대한 메모리의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [네임스페이스에 대한 CPU의 최소 및 최대 제약 조건 구성](/ko/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [네임스페이스에 대한 메모리 및 CPU 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [네임스페이스에 대한 파드 쿼터 구성](/ko/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

### 애플리케이션 개발자를 위한 내용

* [컨테이너 및 파드 메모리 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-memory-resource/)

* [컨테이너 및 파드 CPU 리소스 할당](/ko/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [파드 단위 CPU 및 메모리 리소스 할당](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [파드에 대한 서비스 품질(QoS) 구성](/ko/docs/tasks/configure-pod-container/quality-service-pod/)








