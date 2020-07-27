---
title: 가비지(Garbage) 수집
content_type: concept
weight: 70
---

<!-- overview -->

쿠버네티스의 가비지 수집기는 한때 소유자가 있었지만, 더 이상
소유자가 없는 오브젝트들을 삭제하는 역할을 한다.


<!-- body -->

## 소유자(owner)와 종속(dependent)

일부 쿠버네티스 오브젝트는 다른 오브젝트의 소유자이다. 예를 들어 레플리카셋은
파드 집합의 소유자이다. 소유자 오브젝트에게 소유된 오브젝트를 *종속*
이라고 한다. 모든 종속 오브젝트는 소유하는 오브젝트를 가르키는 `metadata.ownerReferences`
필드를 가지고 있다.

때때로, 쿠버네티스는 `ownerReference` 값을 자동적으로 설정한다.
예를 들어 레플리카셋을 만들 때 쿠버네티스는 레플리카셋에 있는 각 파드의
`ownerReference` 필드를 자동으로 설정한다. 1.8 에서는 쿠버네티스가
레플리케이션컨트롤러, 레플리카셋, 스테이트풀셋, 데몬셋, 디플로이먼트, 잡
그리고 크론잡에 의해서 생성되거나 차용된 오브젝트의 `ownerReference` 값을
자동으로 설정한다.

또한 `ownerReference` 필드를 수동으로 설정해서 소유자와 종속 항목 간의
관계를 지정할 수도 있다.

여기에 파드 3개가 있는 레플리카셋의 구성 파일이 있다.

{{< codenew file="controllers/replicaset.yaml" >}}

레플리카셋을 생성하고 파드의 메타데이터를 본다면,
OwnerReferences 필드를 찾을 수 있다.

```shell
kubectl apply -f https://k8s.io/examples/controllers/replicaset.yaml
kubectl get pods --output=yaml
```

출력 결과는 파드의 소유자가 `my-repset` 이라는 이름의 레플리카셋인 것을 보여준다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
  ownerReferences:
  - apiVersion: apps/v1
    controller: true
    blockOwnerDeletion: true
    kind: ReplicaSet
    name: my-repset
    uid: d9607e19-f88f-11e6-a518-42010a800195
  ...
```

{{< note >}}
교차 네임스페이스(cross-namespace)의 소유자 참조는 디자인상 허용되지 않는다. 이는 다음을 의미한다.
1) 네임스페이스 범위의 종속 항목은 동일한 네임스페이스의 소유자와
클러스터 범위의 소유자만 지정할 수 있다.
2) 클러스터 범위의 종속 항목은 클러스터 범위의 소유자만 지정할 수 있으며,
네임스페이스 범위의 소유자는 불가하다.
{{< /note >}}

## 가비지 수집기의 종속 항목 삭제 방식 제어

오브젝트를 삭제할 때, 오브젝트의 종속 항목을 자동으로 삭제하는지의
여부를 지정할 수 있다. 종속 항목을 자동으로 삭제하는 것을 *캐스케이딩(cascading)
삭제* 라고 한다. *캐스케이딩 삭제* 에는 *백그라운드* 와 *포어그라운드* 2가지 모드가 있다.

만약 종속 항목을 자동으로 삭제하지 않고 오브젝트를 삭제한다면,
종속 항목은 *분리됨(orphaned)* 이라고 한다.

### 포어그라운드 캐스케이딩 삭제

*포어그라운드 캐스케이딩 삭제* 에서는 루트 오브젝트가 먼저
"삭제 중(deletion in progress)" 상태가 된다. "삭제 중" 상태에서는
다음 사항이 적용된다.

 * 오브젝트는 REST API를 통해 여전히 볼 수 있음
 * 오브젝트에 `deletionTimestamp` 가 설정됨
 * 오브젝트의 "foregroundDeletion"에 `metadata.finalizers` 값이 포함됨.

"삭제 중" 상태가 설정되면, 가비지
수집기는 오브젝트의 종속 항목을 삭제한다. 가비지 수집기는 모든
"차단" 종속 항목(`ownerReference.blockOwnerDeletion=true` 가 있는 오브젝트)의 삭제가 완료되면,
소유자 오브젝트를 삭제한다.

"foregroundDeletion" 에서는 ownerReference.blockOwnerDeletion=true 로
설정된 종속 항목만 소유자 오브젝트의 삭제를 차단한다는 것을 참고한다.
쿠버네티스 버전 1.7에서는 소유자 오브젝트에 대한 삭제 권한에 따라 `blockOwnerDeletion` 를 true로 설정하기 위해 사용자 접근을 제어하는
[어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#ownerreferencespermissionenforcement)가
추가되었기에 권한이 없는 종속 항목은 소유자 오브젝트의 삭제를 지연시킬 수 없다.

만약 오브젝트의 `ownerReferences` 필드가 컨트롤러(디플로이먼트 또는 레플리카셋과 같은)에
의해 설정된 경우 blockOwnerDeletion이 자동으로 설정되므로 이 필드를 수동으로 수정할 필요가 없다.

### 백그라운드 캐스케이딩 삭제

*백그라운드 캐스케이딩 삭제* 에서 쿠버네티스는 소유자 오브젝트를
즉시 삭제하고, 가비지 수집기는 백그라운드에서 종속 항목을
삭제한다.

### 캐스케이딩 삭제 정책 설정하기

캐스케이딩 삭제 정책을 제어하려면, 오브젝트를 삭제할 때 `deleteOptions`
인수를 `propagationPolicy` 필드에 설정한다. 여기에 가능한 값으로는 "Orphan",
"Foreground" 또는 "Background" 이다.

쿠버네티스 1.9 이전에는 많은 컨트롤러의 리소스에 대한 기본 가비지 수집 정책이 `orphan` 이었다.
여기에는 레플리케이션컨트롤러, 레플리카셋, 스테이트풀셋, 데몬셋 그리고
디플로이먼트가 포함된다. 그룹 버전 `extensions/v1beta1`, `apps/v1beta1` 그리고 `apps/v1beta2` 의 kinds에서는
달리 지정하지 않는 한 오브젝트가 분리되는 것이 기본이다. 쿠버네티스 1.9에서는 그룹 버전 `apps/v1` 의 모든 kinds에 해당하는
종속 오브젝트들이 기본적으로 삭제된다.

여기에 백그라운드에서 종속 항목을 삭제하는 예시가 있다.

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
  -H "Content-Type: application/json"
```

여기에 포어그라운드에서 종속 항목을 삭제하는 예시가 있다.

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
  -H "Content-Type: application/json"
```

여기에 종속 항목을 분리됨으로 하는 예시가 있다.

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
  -H "Content-Type: application/json"
```

kubectl도 캐스케이딩 삭제를 지원한다.
kubectl을 사용해서 종속 항목을 자동으로 삭제하려면 `--cascade` 를 true로 설정한다. 종속 항목을
분리하기 위해서는 `--cascade` 를 false로 설정한다. `--cascade` 의 기본값은
true 이다.

여기에 레플리카셋의 종속 항목을 분리로 만드는 예시가 있다.

```shell
kubectl delete replicaset my-repset --cascade=false
```

### 디플로이먼트에 대한 추가 참고

1.7 이전에서는 디플로이먼트와 캐스케이딩 삭제를 사용하면 반드시 `propagationPolicy: Foreground`
를 사용해서 생성된 레플리카셋 뿐만 아니라 해당 파드도 삭제해야 한다. 만약 이 _propagationPolicy_
유형을 사용하지 않는다면, 레플리카셋만 삭제되고 파드는 분리된 상태로 남을 것이다.
더 많은 정보는 [kubeadm/#149](https://github.com/kubernetes/kubeadm/issues/149#issuecomment-284766613)를 본다.

## 알려진 이슈들

[#26120](https://github.com/kubernetes/kubernetes/issues/26120)을 추적한다.



## {{% heading "whatsnext" %}}


[디자인 문서 1](https://git.k8s.io/community/contributors/design-proposals/api-machinery/garbage-collection.md)

[디자인 문서 2](https://git.k8s.io/community/contributors/design-proposals/api-machinery/synchronous-garbage-collection.md)
