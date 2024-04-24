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
준수하는 것은 중요하다. 그렇지 않으면, 노드에서 예약된 파드가 볼륨이
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

## 사용자 정의 한도

`KUBE_MAX_PD_VOLS` 환경 변수의 값을 설정한 후,
스케줄러를 시작하여 이러한 한도를 변경할 수 있다.
CSI 드라이버는 절차가 다를 수 있으므로, 한도를 사용자 정의하는
방법에 대한 문서를 참고한다.

기본 한도보다 높은 한도를 설정한 경우 주의한다. 클라우드
공급자의 문서를 참조하여 노드가 실제로 사용자가 설정한 한도를
지원할 수 있는지 확인한다.

한도는 전체 클러스터에 적용되므로, 모든 노드에 영향을 준다.

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

* CSI 스토리지 드라이버가 `NodeGetInfo` 를 사용해서 노드에 대한 최대 볼륨 수를 알린다면, {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}는 그 한도를 따른다.

자세한 내용은 [CSI 명세](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo)를 참고한다.

* CSI 드라이버로 마이그레이션된 인-트리 플러그인으로 관리되는 볼륨의 경우, 최대 볼륨 수는 CSI 드라이버가 보고한 개수이다.
