---
# reviewers:
# - jayunit100
# - jsturtevant
# - marosset
# - perithompson
title: 윈도우 노드의 자원 관리
content_type: concept
weight: 75
---

<!-- overview -->

이 페이지는 리눅스와 윈도우 간에 리소스를 관리하는 방법의 차이점을 간략하게 설명한다.

<!-- body -->

리눅스 노드에서, {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}이 
리소스 제어를 위한 파드 경계로서 사용된다. 
컨테이너는 네트워크, 프로세스 및 파일시스템 격리를 위해 해당 경계 내에 생성된다. 
cpu/io/memory 통계를 수집하기 위해 cgroup API를 사용할 수 있다.

반대로, 윈도우는 시스템 네임스페이스 필터와 함께 
컨테이너별로 [잡(job) 오브젝트](https://docs.microsoft.com/windows/win32/procthread/job-objects)를 사용하여 
모든 프로세스를 컨테이너 안에 포함시키고 호스트와의 논리적 격리를 제공한다.
(잡 오브젝트는 윈도우의 프로세스 격리 메커니즘이며 
쿠버네티스의 {{< glossary_tooltip term_id="job" text="잡(Job)" >}}과는 다른 것이다.)

네임스페이스 필터링 없이 윈도우 컨테이너를 실행할 수 있는 방법은 없다. 
이는 곧 시스템 권한은 호스트 입장에서 주장할(assert) 수 없고, 
이로 인해 특권을 가진(privileged) 컨테이너는 윈도우에서 사용할 수 없음을 의미한다. 
또한 보안 계정 매니저(Security Account Manager, SAM)가 분리되어 있으므로 
컨테이너는 호스트의 ID를 가정(assume)할 수 없다.

## 메모리 관리 {#resource-management-memory}

윈도우에는 리눅스에는 있는 메모리 부족 프로세스 킬러가 없다. 
윈도우는 모든 사용자 모드 메모리 할당을 항상 가상 메모리처럼 처리하며, 페이지파일(pagefile)이 필수이다.

윈도우 노드는 프로세스를 위해 메모리를 오버커밋(overcommit)하지 않는다. 
이로 인해 윈도우는 메모리 컨디션에 도달하는 방식이 리눅스와 다르며, 
프로세스는 메모리 부족(OOM, out of memory) 종료를 겪는 대신 디스크에 페이징을 수행한다. 
메모리가 오버프로비저닝(over-provision)되고 전체 물리 메모리가 고갈되면, 
페이징으로 인해 성능이 저하될 수 있다.

## CPU 관리 {#resource-management-cpu}

윈도우는 각 프로세스에 할당되는 CPU 시간의 양을 제한할 수는 있지만, 
CPU 시간의 최소량을 보장하지는 않는다.

윈도우에서, kubelet은 kubelet 프로세스의 
[스케줄링 우선 순위](https://docs.microsoft.com/windows/win32/procthread/scheduling-priorities)를 설정하기 위한 명령줄 플래그인 
`--windows-priorityclass`를 지원한다. 
이 플래그를 사용하면 윈도우 호스트에서 실행되는 kubelet 프로세스가 다른 프로세스보다 더 많은 CPU 시간 슬라이스를 할당받는다. 
할당 가능한 값 및 각각의 의미에 대한 자세한 정보는 
[윈도우 프라이어리티 클래스](https://docs.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities#priority-class)에서 확인할 수 있다. 
실행 중인 파드가 kubelet의 CPU 사이클을 빼앗지 않도록 하려면, 이 플래그를 `ABOVE_NORMAL_PRIORITY_CLASS` 이상으로 설정한다.

## 리소스 예약 {#resource-reservation}

운영 체제, 컨테이너 런타임, 그리고 kubelet과 같은 쿠버네티스 호스트 프로세스가 사용하는 메모리 및 CPU를 고려하기 위해, 
kubelet 플래그 `--kube-reserved` 및 `--system-reserved`를 사용하여 
메모리 및 CPU 리소스의 예약이 가능하다 (그리고 필요하다). 
윈도우에서 이들 값은 노드의 
[할당 가능(allocatable)](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) 리소스의 계산에만 사용된다.

{{< caution >}}
워크로드를 배포할 때, 컨테이너에 메모리 및 CPU 리소스 제한을 걸자. 
이 또한 NodeAllocatable에서 차감되며, 클러스터 수준 스케줄러가 각 파드를 어떤 노드에 할당할지 결정하는 데 도움을 준다.

제한을 설정하지 않은 파드를 스케줄링하면 윈도우 노드가 오버프로비전될 수 있으며, 
극단적인 경우 노드가 비정상 상태(unhealthy)로 될 수도 있다.
{{< /caution >}}

윈도우에서는, 메모리를 최소 2GB 이상 예약하는 것이 좋다.

얼마나 많은 양의 CPU를 예약할지 결정하기 위해, 
각 노드의 최대 파드 수를 확인하고 해당 노드의 시스템 서비스의 CPU 사용량을 모니터링한 뒤, 
워크로드 요구사항을 충족하는 값을 선택한다.
