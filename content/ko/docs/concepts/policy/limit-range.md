---
title: 리밋 레인지(Limit Range)
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

기본적으로 컨테이너는 쿠버네티스 클러스터에서 무제한 [컴퓨팅 리소스](/docs/user-guide/compute-resources)로 실행된다.
리소스 쿼터을 사용하면 클러스터 관리자는 네임스페이스별로 리소스 사용과 생성을 제한할 수 있다.
네임스페이스 내에서 파드나 컨테이너는 네임스페이스의 리소스 쿼터에 정의된 만큼의 CPU와 메모리를 사용할 수 있다. 하나의 파드 또는 컨테이너가 사용 가능한 모든 리소스를 독점할 수 있다는 우려가 있다. 리밋레인지는 네임스페이스에서 리소스 할당(파드 또는 컨테이너)을 제한하는 정책이다.

{{% /capture %}}


{{% capture body %}}

_리밋레인지_ 는 다음과 같은 제약 조건을 제공한다.

- 네임스페이스에서 파드 또는 컨테이너별 최소 및 최대 컴퓨팅 리소스 사용량을 지정한다.
- 네임스페이스에서 스토리지클래스별 최소 및 최대 스토리지 요청을 지정한다.
- 네임스페이스에서 리소스에 대한 요청과 제한 사이의 비율을 지정한다.
- 네임스페이스에서 컴퓨팅 리소스에 대한 기본 요청/제한을 설정하고 런타임에 있는 컨테이너에 자동으로 설정한다.

## 리밋레인지 활성화

많은 쿠버네티스 배포판에 리밋레인지 지원이 기본적으로 활성화되어 있다. apiserver `--enable-admission-plugins=` 플래그의 인수 중 하나로 `LimitRanger` 어드미션 컨트롤러가 있는 경우 활성화된다.

해당 네임스페이스에 리밋레인지 오브젝트가 있는 경우 특정 네임스페이스에 리밋레인지가 지정된다.

리밋레인지 오브젝트의 이름은 유효한 [DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야한다.

### 범위 제한의 개요

- 관리자는 하나의 네임스페이스에 하나의 `LimitRange`를 만든다.
- 사용자는 네임스페이스에서 파드, 컨테이너 및 퍼시스턴트볼륨클레임과 같은 리소스를 생성한다.
- `LimitRanger` 어드미션 컨트롤러는 컴퓨팅 리소스 요청 사항을 설정하지 않은 모든 파드와 컨테이너에 대한 기본값과 제한을 지정하고 네임스페이스의 리밋레인지에 정의된 리소스의 최소, 최대 및 비율을 초과하지 않도록 사용량을 추적한다.
- 리밋레인지 제약 조건을 위반하는 리소스(파드, 컨테이너, 퍼시스턴트볼륨클레임)를 생성하거나 업데이트하는 경우 HTTP 상태 코드 `403 FORBIDDEN` 및 위반된 제약 조건을 설명하는 메시지와 함께 API 서버에 대한 요청이 실패한다.
- `cpu`, `memory`와 같은 컴퓨팅 리소스의 네임스페이스에서 리밋레인지가 활성화된 경우 사용자는 해당 값에 대한 요청 또는 제한을 지정해야 한다. 그렇지 않으면 시스템에서 파드 생성이 거부될 수 있다.
- 리밋레인지 유효성 검사는 파드 실행 단계가 아닌 파드 어드미션 단계에서만 발생한다.

범위 제한을 사용하여 생성할 수 있는 정책의 예는 다음과 같다.

- 용량이 8GiB RAM과 16 코어인 2 노드 클러스터에서 네임스페이스의 파드를 제한하여 CPU의 최대 제한이 500m인 CPU 100m를 요청하고 메모리의 최대 제한이 600M인 메모리 200Mi를 요청하라.
- 스펙에 CPU 및 메모리 요청없이 시작된 컨테이너에 대해 기본 CPU 제한 및 요청을 150m로, 메모리 기본 요청을 300Mi로 정의하라.

네임스페이스의 총 제한이 파드/컨테이너의 제한 합보다 작은 경우 리소스에 대한 경합이 있을 수 있다.
이 경우 컨테이너 또는 파드가 생성되지 않는다.

경합이나 리밋레인지 변경은 이미 생성된 리소스에 영향을 미치지 않는다.

## 컨테이너 컴퓨팅 리소스 제한

다음 절에서는 컨테이너 레벨에서 작동하는 리밋레인지 생성에 대해 설명한다.
4개의 컨테이너가 있는 파드가 먼저 생성된다. 파드 내의 각 컨테이너에는 특정 `spec.resource` 구성이 있다.
파드 내의 각 컨테이너는 `LimitRanger` 어드미션 컨트롤러에 의해 다르게 처리된다.

다음 kubectl 명령을 사용하여 네임스페이스 `limitrange-demo`를 생성한다.

```shell
kubectl create namespace limitrange-demo
```

kubectl 명령에서 네임스페이스 대상인 `limitrange-demo`를 빠트리지 않으려면 다음 명령으로 컨텍스트를 변경한다.

```shell
kubectl config set-context --current --namespace=limitrange-demo
```

다음은 리밋레인지 오브젝트의 구성 파일이다.
{{< codenew file="admin/resource/limit-mem-cpu-container.yaml" >}}

이 오브젝트는 컨테이너에 적용할 최소 및 최대 CPU/메모리 제한, 기본 CPU/메모리 요청과 CPU/메모리 리소스에 대한 기본 제한을 정의한다.

다음 kubectl 명령을 사용하여 `limit-mem-cpu-per-container` 리밋레인지를 생성한다.

```shell
kubectl create -f https://k8s.io/examples/admin/resource/limit-mem-cpu-container.yaml
```

```shell
kubectl describe limitrange/limit-mem-cpu-per-container
```

```shell
Type        Resource  Min   Max   Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---   ---   ---------------  -------------  -----------------------
Container   cpu       100m  800m  110m             700m           -
Container   memory    99Mi  1Gi   111Mi            900Mi          -
```
다음은 4개의 컨테이너가 포함된 파드의 구성 파일로 리밋레인지 기능을 보여준다.
{{< codenew file="admin/resource/limit-range-pod-1.yaml" >}}

`busybox1` 파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-range-pod-1.yaml
```

### 유효한 CPU/메모리 요청과 제한이 있는 컨테이너 스펙

`busybox-cnt01`의 리소스 구성을 보자.

```shell
kubectl get po/busybox1 -o json | jq ".spec.containers[0].resources"
```

```json
{
  "limits": {
    "cpu": "500m",
    "memory": "200Mi"
  },
  "requests": {
    "cpu": "100m",
    "memory": "100Mi"
  }
}
```

- `busybox` 파드 내의 `busybox-cnt01` 컨테이너는 `requests.cpu=100m`와 `requests.memory=100Mi`로 정의됐다.
- `100m <= 500m <= 800m`, 컨테이너 CPU 제한(500m)은 승인된 CPU 리밋레인지 내에 있다.
- `99Mi <= 200Mi <= 1Gi`, 컨테이너 메모리 제한(200Mi)은 승인된 메모리 리밋레인지 내에 있다.
- CPU/메모리에 대한 요청/제한 비율 검증이 없으므로 컨테이너가 유효하며 생성되었다.


### 유효한 CPU/메모리 요청은 있지만 제한이 없는 컨테이너 스펙

`busybox-cnt02`의 리소스 구성을 보자.

```shell
kubectl get po/busybox1 -o json | jq ".spec.containers[1].resources"
```

```json
{
  "limits": {
    "cpu": "700m",
    "memory": "900Mi"
  },
  "requests": {
    "cpu": "100m",
    "memory": "100Mi"
  }
}
```
- `busybox1` 파드 내의 `busybox-cnt02` 컨테이너는 `requests.cpu=100m`와 `requests.memory=100Mi`를 정의했지만 CPU와 메모리에 대한 제한은 없다.
- 컨테이너에 제한 섹션이 없다. `limit-mem-cpu-per-container` 리밋레인지 오브젝트에 정의된 기본 제한은 `limits.cpu=700mi` 및 `limits.memory=900Mi`로 이 컨테이너에 설정된다.
- `100m <= 700m <= 800m`, 컨테이너 CPU 제한(700m)이 승인된 CPU 제한 범위 내에 있다.
- `99Mi <= 900Mi <= 1Gi`, 컨테이너 메모리 제한(900Mi)이 승인된 메모리 제한 범위 내에 있다.
- 요청/제한 비율이 설정되지 않았으므로 컨테이너가 유효하며 생성되었다.

### 유효한 CPU/메모리 제한은 있지만 요청은 없는 컨테이너 스펙

`busybox-cnt03`의 리소스 구성을 보자.

```shell
kubectl get po/busybox1 -o json | jq ".spec.containers[2].resources"
```
```json
{
  "limits": {
    "cpu": "500m",
    "memory": "200Mi"
  },
  "requests": {
    "cpu": "500m",
    "memory": "200Mi"
  }
}
```

- `busybox1` 파드 내의 `busybox-cnt03` 컨테이너는 `limits.cpu=500m`와 `limits.memory=200Mi`를 정의했지만 CPU와 메모리에 대한 요청은 없다.
- 컨테이너에 요청 섹션이 정의되지 않았다. `limit-mem-cpu-per-container` 리밋레인지에 정의된 기본 요청은 제한 섹션을 채우는 데 사용되지 않지만 컨테이너에 의해 정의된 제한은 `limits.cpu=500m` 및 `limits.memory=200Mi`로 설정된다.
- `100m <= 500m <= 800m`, 컨테이너 CPU 제한(500m)은 승인된 CPU 제한 범위 내에 있다.
- `99Mi <= 200Mi <= 1Gi`, 컨테이너 메모리 제한(200Mi)은 승인된 메모리 제한 범위 내에 있다.
- 요청/제한 비율이 설정되지 않았으므로 컨테이너가 유효하며 생성되었다.

### CPU/메모리 요청/제한이 없는 컨테이너 스펙

`busybox-cnt04`의 리소스 구성을 보자.

```shell
kubectl get po/busybox1 -o json | jq ".spec.containers[3].resources"
```

```json
{
  "limits": {
    "cpu": "700m",
    "memory": "900Mi"
  },
  "requests": {
    "cpu": "110m",
    "memory": "111Mi"
  }
}
```

- `busybox1`의 `busybox-cnt04` 컨테이너는 제한이나 요청을 정의하지 않았다.
- 컨테이너는 제한 섹션을 정의하지 않으며 `limit-mem-cpu-per-container` 리밋레인지에 정의된 기본 제한은 `limit.cpu=700m` 및 `limits.memory=900Mi`로 설정된다.
- 컨테이너는 요청 섹션을 정의하지 않으며 `limit-mem-cpu-per-container` 리밋레인지에 정의된 defaultRequest는 `requests.cpu=110m` 및 `requests.memory=111Mi`로 설정된다.
- `100m <= 700m <= 800m`, 컨테이너 CPU 제한(700m)은 승인된 CPU 제한 범위 내에 있다.
- `99Mi <= 900Mi <= 1Gi`, 컨테이너 메모리 제한(900Mi)은 승인된 메모리 제한 범위 내에 있다.
- 요청/제한 비율이 설정되지 않았으므로 컨테이너가 유효하며 생성되었다.

`busybox` 파드에 정의된 모든 컨테이너는 리밋레인지 유효성 검사를 통과했으므로 이 파드는 유효하며 네임스페이스에서 생성된다.

## 파드 컴퓨팅 리소스 제한

다음 절에서는 파드 레벨에서 리소스를 제한하는 방법에 대해 설명한다.

{{< codenew file="admin/resource/limit-mem-cpu-pod.yaml" >}}

`busybox1` 파드를 삭제하지 않고 `limitrange-demo` 네임스페이스에 `limit-mem-cpu-pod` 리밋레인지를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-mem-cpu-pod.yaml
```
리밋레인지가 생성되고 파드별로 CPU가 2 코어로, 메모리가 2Gi로 제한된다.

```shell
limitrange/limit-mem-cpu-per-pod created
```

다음 kubectl 명령을 사용하여 `limit-mem-cpu-per-pod` 리밋레인지 오브젝트의 정보를 나타낸다.

```shell
kubectl describe limitrange/limit-mem-cpu-per-pod
```

```shell
Name:       limit-mem-cpu-per-pod
Namespace:  limitrange-demo
Type        Resource  Min  Max  Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---  ---  ---------------  -------------  -----------------------
Pod         cpu       -    2    -                -              -
Pod         memory    -    2Gi  -                -              -
```

이제 `busybox2` 파드를 생성한다.

{{< codenew file="admin/resource/limit-range-pod-2.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-range-pod-2.yaml
```

`busybox2` 파드 정의는 `busybox1`과 동일하지만 이제 파드 리소스가 제한되어 있으므로 오류가 보고된다.

```shell
Error from server (Forbidden): error when creating "limit-range-pod-2.yaml": pods "busybox2" is forbidden: [maximum cpu usage per Pod is 2, but limit is 2400m., maximum memory usage per Pod is 2Gi, but limit is 2306867200.]
```

```shell
kubectl get po/busybox1 -o json | jq ".spec.containers[].resources.limits.memory"
"200Mi"
"900Mi"
"200Mi"
"900Mi"
```

해당 컨테이너의 총 메모리 제한이 리밋레인지에 정의된 제한보다 크므로 `busybox2` 파드는 클러스터에서 허용되지 않는다.
`busyRange1`은 리밋레인지를 생성하기 전에 클러스터에서 생성되고 허용되므로 제거되지 않는다.

## 스토리지 리소스 제한

리밋레인지를 사용하여 네임스페이스에서 각 퍼시스턴트볼륨클레임이 요청할 수 있는 [스토리지 리소스](/ko/docs/concepts/storage/persistent-volumes/)의 최소 및 최대 크기를 지정할 수 있다.

{{< codenew file="admin/resource/storagelimits.yaml" >}}

`kubectl create`를 사용하여 YAML을 적용한다.

```shell
kubectl create -f https://k8s.io/examples/admin/resource/storagelimits.yaml
```

```shell
limitrange/storagelimits created
```

생성된 오브젝트의 정보를 나타낸다.

```shell
kubectl describe limits/storagelimits
```

출력은 다음과 같다.

```shell
Name:                  storagelimits
Namespace:             limitrange-demo
Type                   Resource  Min  Max  Default Request  Default Limit  Max Limit/Request Ratio
----                   --------  ---  ---  ---------------  -------------  -----------------------
PersistentVolumeClaim  storage   1Gi  2Gi  -                -              -
```

{{< codenew file="admin/resource/pvc-limit-lower.yaml" >}}

```shell
kubectl create -f https://k8s.io/examples/admin/resource/pvc-limit-lower.yaml
```

`requests.storage`가 리밋레인지의 Min 값보다 낮은 PVC를 만드는 동안 서버에서 발생하는 오류는 다음과 같다.

```shell
Error from server (Forbidden): error when creating "pvc-limit-lower.yaml": persistentvolumeclaims "pvc-limit-lower" is forbidden: minimum storage usage per PersistentVolumeClaim is 1Gi, but request is 500Mi.
```

`requests.storage`가 리밋레인지의 Max 값보다 큰 경우에도 동일한 동작이 나타난다.

{{< codenew file="admin/resource/pvc-limit-greater.yaml" >}}

```shell
kubectl create -f https://k8s.io/examples/admin/resource/pvc-limit-greater.yaml
```

```shell
Error from server (Forbidden): error when creating "pvc-limit-greater.yaml": persistentvolumeclaims "pvc-limit-greater" is forbidden: maximum storage usage per PersistentVolumeClaim is 2Gi, but request is 5Gi.
```

## 제한/요청 비율

`LimitRangeSpec`에 `LimitRangeItem.maxLimitRequestRatio`가 지정되어 있으면 명명된 리소스는 제한을 요청으로 나눈 값이 열거된 값보다 작거나 같은 0이 아닌 값을 요청과 제한 모두 가져야 한다.

다음의 리밋레인지는 메모리 제한이 네임스페이스의 모든 파드에 대한 메모리 요청 양의 최대 두 배가 되도록 한다.

{{< codenew file="admin/resource/limit-memory-ratio-pod.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-memory-ratio-pod.yaml
```

다음의 kubectl 명령으로 `limit-memory-ratio-pod` 리밋레인지의 정보를 나타낸다.

```shell
kubectl describe limitrange/limit-memory-ratio-pod
```

```shell
Name:       limit-memory-ratio-pod
Namespace:  limitrange-demo
Type        Resource  Min  Max  Default Request  Default Limit  Max Limit/Request Ratio
----        --------  ---  ---  ---------------  -------------  -----------------------
Pod         memory    -    -    -                -              2
```


`requests.memory=100Mi` 및 `limits.memory=300Mi`로 파드를 생성한다.

{{< codenew file="admin/resource/limit-range-pod-3.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/limit-range-pod-3.yaml
```

위 예에서 제한/요청 비율(`3`)이 `limit-memory-ratio-pod` 리밋레인지에 지정된 제한 비율(`2`)보다 커서 파드 생성에 실패했다.

```
Error from server (Forbidden): error when creating "limit-range-pod-3.yaml": pods "busybox3" is forbidden: memory max limit to request ratio per Pod is 2, but provided ratio is 3.000000.
```

## 정리

모든 리소스를 해제하려면 `limitrange-demo` 네임스페이스를 삭제한다.

```shell
kubectl delete ns limitrange-demo
```
다음 명령을 사용하여 컨텍스트를 `default` 네임스페이스로 변경한다.

```shell
kubectl config set-context --current --namespace=default
```

## 예제

- [네임스페이스별 컴퓨팅 리소스를 제한하는 방법에 대한 튜토리얼](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)을 참고하길 바란다.
- [스토리지 사용을 제한하는 방법](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage)을 확인하라.
- [네임스페이스별 쿼터에 대한 자세한 예](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/)를 참고하길 바란다.

{{% /capture %}}

{{% capture whatsnext %}}

보다 자세한 내용은 [LimitRanger 설계 문서](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)를 참고하길 바란다.

{{% /capture %}}
