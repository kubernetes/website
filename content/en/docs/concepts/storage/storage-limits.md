---
title: 노드 별 볼륨 제한
content_template: templates/concept
---

{{% capture overview %}}

이 페이지는 다양한 클라우드 제공자들이 노드에 접속할 수 있는 최대 볼륨 수를 설명합니다.

구글, 아마존 및 마이크로소프트와 같은 클라우드 공급자는 일반적으로 노드에 연결할 수 있는 볼륨 수를 제한하고 있습니다.
쿠버네티스는 이러한 한계를 준수하는 것은 중요합니다. 그렇지 않으면 노드에서 예약된 포드가 볼륨이 연결될 때 까지
멈출 수 있기 때문입니다.

{{% /capture %}}

{{% capture body %}}

## 쿠버네티스의 기본 제한

쿠버네티스 스케줄러에는 노드에 연결할 수 있는 볼륨 수에 기본적인 제한이 있습니다.:

<table>
  <tr><th> 클라우드 서비스 </th><th> 노드 당 최대 볼륨 </th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## 기능 수정 제한

`KUBE_MAX_PD_VOLS`의 환경 변수의 값을 설정한 후 스케줄러를 실행하여 이러한 제한을 변경할 수 있습니다.

기본 제한보다 높은 제한을 설정할 경우 주의하십시오. 클라우드 공급자의 설명서를 참고하여 노드가 실제로
설정한 제한을 지원할 수 있는지 확인하십시오.

제한은 전체 클러스터에 적용되므로 모든 노드에 영향을 미칩니다.

## 동적 불륨 제한

{{< feature-state state="beta" for_k8s_version="v1.12" >}}

Kubernetes 1.11은 노드 기능을 알파 기능으로 사용하여 동적 볼륨 제한을 지원합니다.
In Kubernetes 1.12에서 이 기능은 베타 버전이며 기본적으로 활성화됩니다.

동적 볼륨 제한은 다음과 같은 볼륨 유형에 대해 지원됩니다.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI


동적 볼륨 제한 기능이 활성화되면 쿠버네티스는 자동으로 노드 유형을 결정하고
노드에 적절한 개수의 연결 가능한 볼륨을 적용합니다. 예를 들면 다음과 같습니다. :

* <a href="https://cloud.google.com/compute/">Google Compute Engine</a> 에서는 
[노드의 유형](https://cloud.google.com/compute/docs/disks/#pdnumberlimits)에 따라
최대 128개의 볼륨을 노드에 연결할 수 있습니다, 

* M5, C5, R5, T3 및 Z1D 인스턴스 유형의 Amazon EBS 디스크의 경우 쿠버네티스의 노드에
25개의 볼륨만 연결할 수 있습니다. <a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>의
위의 5개의 유형 이외의 유형인 경우 쿠버네티스는 노드에 39개의 볼륨을 연결할 수 있습니다.

* Azure에서는 노드 유형에 따라 최대 64개의 디스크를 노드에 연결할 수 있습니다. 
자세한 내용은 [Azure의 가상 시스템](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes)을 참조하십시오.

* CSI의 경우, CSI 규격을 통해 볼륨에 연결할 수 있는 제한을 알리는 드라이버는 노드의 할당 가능한 속성으로 사용할 수 있는
제한을 가지게 되며 스케줄러는 이미 용량이 있는 노드에 볼륨을 가진 포드를 예약하지 않습니다. 자세한 내용은 [CSI 규격](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo)을 참조하십시오.

{{% /capture %}}
