---
# reviewers:
# - jsafrane
# - saad-ali
# - msau42
# - xing-yang
title: 볼륨 헬스 모니터링
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

{{< glossary_tooltip text="CSI" term_id="csi" >}} 볼륨 헬스 모니터링을 통해 CSI 드라이버는 기본 스토리지 시스템에서 비정상적인 볼륨 상태를 감지하고 이를 {{< glossary_tooltip text="PVC"  term_id="persistent-volume-claim" >}} 또는 {{< glossary_tooltip text="파드" term_id="pod" >}}의 이벤트로 보고한다.

<!-- body -->

## 볼륨 헬스 모니터링

쿠버네티스 _볼륨 헬스 모니터링_ 은 쿠버네티스가 CSI(Container Storage Interface)를 구현하는 방법의 일부다. 볼륨 헬스 모니터링 기능은 외부 헬스 모니터 컨트롤러와 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, 2가지 컴포넌트로 구현된다.

CSI 드라이버가 컨트롤러 측의 볼륨 헬스 모니터링 기능을 지원하는 경우, CSI 볼륨에서 비정상적인 볼륨 상태가 감지될 때 관련 {{< glossary_tooltip text="퍼시스턴트볼륨클레임" term_id="persistent-volume-claim" >}}(PersistentVolumeClaim, PVC) 이벤트가 보고된다.

외부 헬스 모니터 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}는 노드 장애 이벤트도 감시한다. `enable-node-watcher` 플래그를 true로 설정하여 노드 장애 모니터링을 활성화할 수 있다. 외부 헬스 모니터가 노드 장애 이벤트를 감지하면, 컨트롤러는 이 PVC를 사용하는 파드가 장애 상태인 노드에 있음을 나타내는 이벤트가 PVC에 보고된다고 알린다.

CSI 드라이버가 노드 측에서 볼륨 헬스 모니터링 기능을 지원하는 경우, CSI 볼륨에서 비정상적인 볼륨 상태가 감지되면 PVC를 사용하는 모든 파드에서 이벤트가 보고된다. 그리고, 볼륨 헬스 정보는 kubelet VolumeStats 메트릭 형태로 노출된다. 새로운 kubelet_volume_stats_health_status_abnormal 메트릭이 추가되었다. 이 메트릭은 `namespace` 및 `persistentvolumeclaim` 2개의 레이블을 포함한다. 카운터는 1 또는 0이다. 카운터가 1이면 볼륨이 정상적이지 않음을, 0이면 정상적임을 의미한다. 더 많은 정보는 [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor#kubelet-metrics-changes)를 참고한다.

{{< note >}}
노드 측에서 이 기능을 사용하려면 `CSIVolumeHealth` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화해야 한다.
{{< /note >}}

## {{% heading "whatsnext" %}}

이 기능을 구현한 CSI 드라이버를 확인하려면 [CSI 드라이버 문서](https://kubernetes-csi.github.io/docs/drivers.html)를 참고한다.
