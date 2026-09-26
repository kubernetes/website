---
# reviewers:
# - jsafrane
# - saad-ali
# - thockin
# - msau42
title: 노드 별 볼륨 한도
content_type: concept
weight: 90
---

<!-- overview -->

이 페이지는 다양한 클라우드 공급자들이 제공하는 노드에 연결할 수 있는
최대 볼륨 수를 설명한다.

Google, Amazon 그리고 Microsoft와 같은 클라우드 공급자는 일반적으로 노드에
연결할 수 있는 볼륨 수에 제한이 있다. 쿠버네티스가 이러한 제한을
준수하는 것은 중요하다. 그렇지 않으면, 노드에 스케줄된 파드가 볼륨이
연결될 때까지 멈추고 기다릴 수 있다.



<!-- body -->

## 쿠버네티스 기본 한도

쿠버네티스 스케줄러에는 노드에 연결될 수 있는 볼륨 수에 대한
기본 한도가 있다.

<table>
  <tr><th>클라우드 서비스</th><th>노드 당 최대 볼륨</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/ko-kr/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## 동적 볼륨 한도

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

다음 볼륨 유형에 대해 동적 볼륨 한도가 지원된다.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

인-트리(in-tree) 볼륨 플러그인으로 관리되는 볼륨의 경우, 쿠버네티스는 자동으로 노드 유형을
결정하고 노드에 적절한 최대 볼륨 수를 적용한다. 예를 들면, 다음과 같다.

* <a href="https://cloud.google.com/compute/">Google Compute Engine</a>에서는,
[노드 유형에 따라](https://cloud.google.com/compute/docs/disks/#pdnumberlimits)
최대 127개의 볼륨까지
노드에 연결할 수 있다.

* M5, C5, R5, T3와 Z1D 인스턴스 유형의 Amazon EBS 디스크의 경우, 쿠버네티스는 25개의 볼륨만 노드에
연결할 수 있도록 허용한다.
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>의
다른 인스턴스 유형의 경우, 쿠버네티스는 노드에 39개의 볼륨을 연결할 수 있도록 허용한다.

* Azure에서는, 노드 유형에 따라 최대 64개의 디스크를 노드에 연결할 수 있다. 더 자세한 내용은 [Azure의 가상 머신 크기](https://docs.microsoft.com/ko-kr/azure/virtual-machines/windows/sizes)를 참고한다.

* CSI 스토리지 드라이버가 `NodeGetInfo`를 사용해서 노드에 대한 최대 볼륨 수를 알린다면, {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}는 그 한도를 따른다.
자세한 내용은 [CSI 명세](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo)를 참고한다.

* CSI 드라이버로 마이그레이션된 인-트리 플러그인으로 관리되는 볼륨의 경우, 최대 볼륨 수는 CSI 드라이버가 보고한 개수이다.

### CSI 노드의 할당 가능한 볼륨 수 변경

{{< feature-state feature_gate_name="MutableCSINodeAllocatableCount" >}}

CSI 드라이버는 런타임에 노드에 연결할 수 있는 최대 볼륨 수를 동적으로 조정할 수 있다. 이를 통해 스케줄링의 정확도를 높이고 리소스 가용성 변화로 인한 파드 스케줄링 실패를 줄일 수 있다.

이 기능을 사용하려면 다음 컴포넌트에서 `MutableCSINodeAllocatableCount` 기능 게이트를 활성화해야 한다.

- `kube-apiserver`
- `kubelet`

#### 주기적 갱신

이 기능이 활성화되면, CSI 드라이버는 CSI드라이버(CSIDriver) 명세의 `nodeAllocatableUpdatePeriodSeconds` 필드를 설정하여 볼륨 한도를 주기적으로 갱신하도록 요청할 수 있다. 예를 들면 다음과 같다.

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

kubelet은 `nodeAllocatableUpdatePeriodSeconds`에 지정된 간격으로 해당 CSI 드라이버의 `NodeGetInfo` 엔드포인트를 주기적으로 호출하여 연결 가능한 최대 볼륨 수를 갱신한다. 이 필드에 허용되는 최솟값은 10초이다.

볼륨 연결 작업이 `ResourceExhausted` 오류(gRPC 코드 8)로 실패하면, 쿠버네티스는 해당 노드의 할당 가능한 볼륨 수를 즉시 갱신한다. 또한 kubelet은 영향을 받은 파드를 Failed 상태로 표시하여 해당 컨트롤러가 파드를 다시 생성할 수 있도록 한다. 이를 통해 파드가 `ContainerCreating` 상태에서 무기한 멈추는 것을 방지한다.

### CSI 드라이버가 없는 노드에 파드 배치 방지

{{< feature-state feature_gate_name="VolumeLimitScaling" >}}

`VolumeLimitScaling`
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates#VolumeLimitScaling)는
쿠버네티스 v1.37에서 기본적으로 활성화되어 있다.

그러나 CSI 드라이버가 없는 노드에 파드가 배치되는 것을 방지하려면
CSI드라이버 오브젝트의 `spec.preventPodSchedulingIfMissing` 필드를 통해 명시적으로 활성화해야 한다.

`preventPodSchedulingIfMissing` 필드의 기본값은 `false`이며, CSI 드라이버가 없는 노드에
파드가 스케줄되지 않도록 하려면 `true`로 설정해야 한다. 기본값을
`false`로 정한 것은 하위 호환성을 유지하고,
[클러스터 오토스케일러](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)와의
호환성을 보장하기 위해서이다. 클러스터 오토스케일러는 오토스케일링 단계에서 CSI 볼륨 한도를
인식하지 못할 수 있다(아래 섹션 참고).

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  preventPodSchedulingIfMissing: true
```


### CSI 볼륨 연결 한도와 클러스터 오토스케일러

[클러스터 오토스케일러](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)는
`--enable-csi-node-aware-scheduling=true`로 설정하면
CSI 볼륨 한도를 고려할 수 있다. 이 옵션은
`VolumeLimitScaling` 기능 게이트와 독립적이다.

클러스터 오토스케일러를 사용하는 경우, 클러스터 오토스케일러에
`--enable-csi-node-aware-scheduling=true`가 설정되어 있을 때만
`spec.preventPodSchedulingIfMissing`을 `true`로 설정한다. 그렇지 않으면 스케줄링 시뮬레이션에
새 노드에 필요한 CSI노드(CSINode) 정보가 포함되지 않아, 클러스터
오토스케일러가 CSI 볼륨을 사용하는 대기 중인 파드를 위해 스케일 업을 수행하지 못할 수 있다.
