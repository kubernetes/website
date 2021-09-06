---
title: 파드 오버헤드
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}


노드 위에서 파드를 구동할 때, 파드는 그 자체적으로 많은 시스템 리소스를 사용한다.
이러한 리소스는 파드 내의 컨테이너들을 구동하기 위한 리소스 이외에 추가적으로 필요한 것이다.
_파드 오버헤드_ 는 컨테이너 리소스 요청과 상한 위에서 파드의 인프라에 의해
소비되는 리소스를 계산하는 기능이다.





<!-- body -->

쿠버네티스에서 파드의 오버헤드는 파드의
[런타임클래스](/ko/docs/concepts/containers/runtime-class/) 와 관련된 오버헤드에 따라
[어드미션](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
이 수행될 때 지정된다.

파드 오버헤드가 활성화 되면, 파드를 노드에 스케줄링 할 때 컨테이너 리소스 요청의 합에
파드의 오버헤드를 추가해서 스케줄링을 고려한다. 마찬가지로, kubelet은 파드의 cgroups 크기를 변경하거나
파드의 축출 등급을 부여할 때에도 파드의 오버헤드를 포함하여 고려한다.

## 파드 오버헤드 활성화하기 {#set-up}

기능 활성화를 위해 클러스터에서
`PodOverhead` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어 있고(1.18 버전에서는 기본적으로 활성화),
`overhead` 필드를 정의하는 `RuntimeClass` 가 사용되고 있는지 확인해야 한다.

## 사용 예제

파드 오버헤드 기능을 사용하기 위하여, `overhead` 필드를 정의하는 런타임클래스가 필요하다.
예를 들어, 가상 머신 및 게스트 OS에 대하여 파드 당 120 MiB를 사용하는
가상화 컨테이너 런타임의 런타임클래스의 경우 다음과 같이 정의 할 수 있다.

```yaml
---
kind: RuntimeClass
apiVersion: node.k8s.io/v1
metadata:
    name: kata-fc
handler: kata-fc
overhead:
    podFixed:
        memory: "120Mi"
        cpu: "250m"
```

`kata-fc` 런타임클래스 핸들러를 지정하는 워크로드는 리소스 쿼터 계산,
노드 스케줄링 및 파드 cgroup 크기 조정을 위하여 메모리와 CPU 오버헤드를 고려한다.

주어진 예제 워크로드 test-pod의 구동을 고려해보자.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox
    stdin: true
    tty: true
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
  - name: nginx-ctr
    image: nginx
    resources:
      limits:
        cpu: 1500m
        memory: 100Mi
```

어드미션 수행 시에, [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)는
런타임클래스에 기술된 `overhead` 를 포함하기 위하여 워크로드의 PodSpec 항목을 갱신한다. 만약 PodSpec이 이미 해당 필드에 정의되어 있으면,
파드는 거부된다. 주어진 예제에서, 오직 런타임클래스의 이름만이 정의되어 있기 때문에, 어드미션 컨트롤러는 파드가
`overhead` 를 포함하도록 변경한다.

런타임클래스의 어드미션 수행 후에, 파드의 스펙이 갱신된 것을 확인할 수 있다.

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

명령 실행 결과는 다음과 같다.
```
map[cpu:250m memory:120Mi]
```

만약 리소스쿼터 항목이 정의되어 있다면, 컨테이너의 리소스 요청의 합에는
`overhead` 필드도 추가된다.

kube-scheduler 는 어떤 노드에 파드가 기동 되어야 할지를 정할 때, 파드의 `overhead` 와
해당 파드에 대한 컨테이너의 리소스 요청의 합을 고려한다. 이 예제에서, 스케줄러는
리소스 요청과 파드의 오버헤드를 더하고, 2.25 CPU와 320 MiB 메모리가 사용 가능한 노드를 찾는다.

일단 파드가 특정 노드에 스케줄링 되면, 해당 노드에 있는 kubelet 은 파드에 대한 새로운 {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}을 생성한다.
기본 컨테이너 런타임이 만들어내는 컨테이너들은 이 파드 안에 존재한다.

만약 각 컨테이너에 대하여 QoS가 보장되었거나 향상이 가능하도록 QoS 의 리소스 상한 제한이 걸려있으면,
kubelet 은 해당 리소스(CPU의 경우 cpu.cfs_quota_us, 메모리의 경우 memory.limit_in_bytes)와 연관된 파드의
cgroup 의 상한선을 설정한다. 이 상한선은 컨테이너 리소스 상한과 PodSpec에
정의된 `overhead` 의 합에 기반한다.

CPU의 경우, 만약 파드가 보장형 또는 버스트형 QoS로 설정되었으면, kubelet은 PodSpec에 정의된 `overhead` 에 컨테이너의
리소스 요청의 합을 더한 값을 `cpu.shares` 로 설정한다.

다음의 예제를 참고하여, 워크로드에 대하여 컨테이너의 리소스 요청을 확인하자.
```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

컨테이너 리소스 요청의 합은 각각 CPU 2000m 와 메모리 200MiB 이다.
```
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

노드에서 측정된 내용과 비교하여 확인해보자.

```bash
kubectl describe node | grep test-pod -B2
```

CPU 2250m와 메모리 320MiB 가 리소스로 요청되었으며, 이 결과는 파드의 오버헤드를 포함한다.
```
  Namespace                   Name                CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------                   ----                ------------  ----------   ---------------  -------------  ---
  default                     test-pod            2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

## 파드 cgroup 상한 확인하기

워크로드가 실행 중인 노드에서 파드의 메모리 cgroup들을 확인 해보자. 다음의 예제에서, [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)은 노드에서 사용되며,
CRI-호환 컨테이너 런타임을 위해서 노드에서 사용할 수 있는 CLI 를 제공한다.
파드의 오버헤드 동작을 보여주는 좋은 예이며,
사용자가 노드에서 직접 cgroup들을 확인하지 않아도 된다.

먼저 특정 노드에서 파드의 식별자를 확인해 보자.

```bash
# 파드가 스케줄 된 노드에서 이것을 실행
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

여기에서, 파드의 cgroup 경로를 확인할 수 있다.
```bash
# 파드가 스케줄 된 노드에서 이것을 실행
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

명령의 결과로 나온 cgroup 경로는 파드의 `pause` 컨테이너를 포함한다. 파드 레벨의 cgroup은 하나의 디렉터리이다.
```
        "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

아래의 특정한 경우에, 파드 cgroup 경로는 `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2` 이다. 메모리의 파드 레벨 cgroup 설정을 확인하자.
```bash
# 파드가 스케줄 된 노드에서 이것을 실행.
# 또한 사용자의 파드에 할당된 cgroup 이름에 맞춰 해당 이름을 수정.
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

예상대로 320 MiB 이다.
```
335544320
```

### 관찰성
`kube_pod_overhead` 항목은 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
에서 사용할 수 있어, 파드 오버헤드가 사용되는 시기를 식별하고,
정의된 오버헤드로 실행되는 워크로드의 안정성을 관찰할 수 있다.
이 기능은 kube-state-metrics 의 1.9 릴리스에서는 사용할 수 없지만, 다음 릴리스에서는 가능할 예정이다.
그 전까지는 소스로부터 kube-state-metric 을 빌드해야 한다.



## {{% heading "whatsnext" %}}


* [런타임클래스](/ko/docs/concepts/containers/runtime-class/)
* [파드오버헤드 디자인](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
