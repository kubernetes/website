---
title: 클러스터에서 DNS 서비스 오토스케일
content_type: task
---

<!-- overview -->
이 페이지는 쿠버네티스 클러스터에서 DNS 서비스의 오토스케일링을 구성하고
활성화하는 방법을 보여준다.


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* 이 가이드는 노드가 AMD64 또는 인텔 64 CPU 아키텍처를 사용한다고 가정한다.

* [Kubernetes DNS](/ko/docs/concepts/services-networking/dns-pod-service/)가 활성화되어 있는지 확인한다.



<!-- steps -->

## DNS 수평 오토스케일링이 이미 활성화되어 있는지 확인 {#determining-whether-dns-horizontal-autoscaling-is-already-enabled}

kube-system {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}
에서 클러스터의 {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}를 나열한다.

```shell
kubectl get deployment --namespace=kube-system
```

출력은 다음과 유사하다.

    NAME                      READY   UP-TO-DATE   AVAILABLE   AGE
    ...
    dns-autoscaler            1/1     1            1           ...
    ...

해당 출력에서 "dns-autoscaler"가 표시되면, DNS 수평 오토스케일링이
이미 활성화되어 있다는 의미이므로, 
[오토스케일링 파라미터 조정](#tuning-autoscaling-parameters)으로 건너뛰면 된다.

## DNS 디플로이먼트 이름 가져오기 {#find-scaling-target}

kube-system 네임스페이스에서 클러스터의 DNS 디플로이먼트를 나열한다.

```shell
kubectl get deployment -l k8s-app=kube-dns --namespace=kube-system
```

출력은 이와 유사하다.

    NAME      READY   UP-TO-DATE   AVAILABLE   AGE
    ...
    coredns   2/2     2            2           ...
    ...

DNS 서비스용 디플로이먼트가 표시되지 않으면, 이름으로 찾을 수 있다.

```shell
kubectl get deployment --namespace=kube-system
```

그리고 `coredns` 또는 `kube-dns`라는 디플로이먼트를 찾는다.


스케일 대상은

    Deployment/<your-deployment-name>

이며, 여기서 `<your-deployment-name>`는 DNS 디플로이먼트의 이름이다. 예를 들어, 
DNS용 디플로이먼트 이름이 coredns인 경우, 스케일 대상은 Deployment/coredns이다.

{{< note >}}
CoreDNS는 쿠버네티스의 기본 DNS 서비스이다. 
CoreDNS는 본래 kube-dns로 사용한 클러스터에서 작동할 수 있도록
`k8s-app=kube-dns`로 레이블을 설정한다.
{{< /note >}}

## DNS 수평 오토스케일링 활성화 {#enablng-dns-horizontal-autoscaling}

이 섹션에서는 새로운 디플로이먼트를 만든다. 디플로이먼트의 파드는 
`cluster-proportional-autoscaler-amd64` 이미지 기반의 컨테이너를 실행한다.

다음의 내용으로 `dns-horizontal-autoscaler.yaml`라는 파일을 만든다.

{{< codenew file="admin/dns/dns-horizontal-autoscaler.yaml" >}}

파일에서, `<SCALE_TARGET>`을 사용자의 스케일 대상으로 변경한다.

구성 파일이 포함된 디렉토리로 이동하고,
디플로이먼트를 만들기 위해 다음의 커맨드를 입력한다.

```shell
kubectl apply -f dns-horizontal-autoscaler.yaml
```

성공적인 커맨드의 출력은 다음과 같다.

    deployment.apps/dns-autoscaler created

DNS 수평 오토스케일링이 활성화되었다.

## DNS 오토스케일링 파라미터 조정 {#tuning-autoscaling-parameters}

dns-autoscaler {{< glossary_tooltip text="컨피그맵" term_id="configmap" >}}이 있는지 확인한다.

```shell
kubectl get configmap --namespace=kube-system
```

출력은 다음과 유사하다.

    NAME                  DATA      AGE
    ...
    dns-autoscaler        1         ...
    ...

컨피그맵에서 데이터를 수정한다.

```shell
kubectl edit configmap dns-autoscaler --namespace=kube-system
```

다음에 해당하는 줄을 찾는다.

```yaml
linear: '{"coresPerReplica":256,"min":1,"nodesPerReplica":16}'
```

필요에 따라서 해당 필드를 수정한다.
"min" 필드는 최소 DNS 백엔드 수를 나타낸다. 실제 백엔드의 수는
이 방정식을 사용하여 계산된다.

    replicas = max( ceil( cores × 1/coresPerReplica ) , ceil( nodes × 1/nodesPerReplica ) )

`coresPerReplica` 및 `nodesPerReplica` 값은 모두 
부동 소수점이니 주의한다.	   

해당 아이디어는 클러스터가 코어가 많은 노드를 사용하는 경우,
`coresPerReplica`의 영향을 더 크게 만들고, 코어 수가 적은 노드를 사용하는 경우
`nodesPerReplica`의 영향을 더 크게 만드는 것이다.

그밖에 다른 스케일링 패턴도 지원한다.
[cluster-proportional-autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)를 참고한다.

## DNS 수평 오토스케일링 비활성화

DNS 수평 오토스케일링을 조정하기 위해 몇 가지 옵션이 있다.
사용할 옵션은 조건에 따라 다르다.

### 옵션 1: dns-autoscaler 디플로이먼트를 레플리카 0개로 축소

이 옵션은 모든 상황에서 작동한다. 다음 커맨드를 입력한다.

```shell
kubectl scale deployment --replicas=0 dns-autoscaler --namespace=kube-system
```

출력은 다음과 같다.

    deployment.apps/dns-autoscaler scaled

레플리카 수가 0인지 확인한다.

```shell
kubectl get rs --namespace=kube-system
```

출력은 DESIRED 및 CURRENT 열에 0으로 보여준다.

    NAME                                 DESIRED   CURRENT   READY   AGE
    ...
    dns-autoscaler-6b59789fc8            0         0         0       ...
    ...

### 옵션 2: dns-autoscaler 디플로이먼트를 삭제

이 옵션은 dns-autoscaler가 자체적으로 제어되는 경우 작동하며,
아무도 이것을 재-생성하지 않음을 의미한다.

```shell
kubectl delete deployment dns-autoscaler --namespace=kube-system
```

출력은 다음과 같다.

    deployment.apps "dns-autoscaler" deleted

### 옵션 3: 마스터노드에서 dns-autoscaler 매니페스트 파일을 삭제

이 옵션은 dns-autoscaler가 (사용 중단되(deprecated))
[애드온 매니저](https://git.k8s.io/kubernetes/cluster/addons/README.md)
의 제어를 받고 마스터 노드에 쓰기 권한이 있는 경우 작동한다.

마스터 노드에 로그인하고 해당 매니페스트 파일을 삭제한다.
이 dns-autoscaler의 일반 경로는 다음과 같다.

    /etc/kubernetes/addons/dns-horizontal-autoscaler/dns-horizontal-autoscaler.yaml

매니페스트 파일이 삭제된 후, 애드온 매니저는
dns-autoscaler 디플로이먼트를 삭제한다.						  



<!-- discussion -->

## DNS 수평 오토스케일링 작동 방식 이해

* cluster-proportional-autoscaler 애플리케이션은
DNS 서비스와 별도로 배포된다.				

* 오토스케일러 파드는
클러스터의 노드 및 코어 수에 대해 쿠버네티스 API 서버를 폴링(poll)하는 클라이언트를 실행한다.										 

* 의도한 레플리카 수는 주어진 스케일링 파라미터로 계산하고 
예약 가능한 노드 및 코어를 기반으로 DNS 백엔드에 적용한다.

* 스케일링 파마리터와 데이터 포인트는 컨피그맵을 통해 자동 
오토스케일러에게 제공된다.그리고, 의도한 최근 스케일링 파라미터로 최신 상태가 되도록 
폴링 간격에 따라 파라미터 표를 갱신한다.

* 오토스케일러 파드를 다시 빌드 또는 재 시작하지 않고도 
스케일링 파라미터를 변경할 수 있다.

* 오토스케일러는 *linear*와 *ladder* 두 가지 제어 패턴을 지원하는 컨트롤러
인터페이스를 제공한다.



## {{% heading "whatsnext" %}}

* [중요한 애드온 파드 스케줄링 보장하기](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)에 대해 읽어본다.
* [cluster-proportional-autoscaler 구현](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)
에 대해 자세히 알아본다.