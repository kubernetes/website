---
title: 장치 플러그인
description: >
  장치 플러그인을 사용하여 GPU, NIC, FPGA, 또는 비휘발성 주 메모리와 같이 공급 업체별 설정이 필요한 장치 
  또는 리소스를 클러스터에서 지원하도록 설정할 수 있다.
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

쿠버네티스는 시스템 하드웨어 리소스를 {{< glossary_tooltip term_id="kubelet" >}}에 알리는 데 사용할 수 있는
[장치 플러그인 프레임워크](https://git.k8s.io/design-proposals-archive/resource-management/device-plugin.md)를
제공한다.

공급 업체는 쿠버네티스 자체의 코드를 커스터마이징하는 대신, 수동 또는
{{< glossary_tooltip text="데몬셋" term_id="daemonset" >}}으로 배포하는 장치 플러그인을 구현할 수 있다.
대상이 되는 장치에는 GPU, 고성능 NIC, FPGA, InfiniBand 어댑터
및 공급 업체별 초기화 및 설정이 필요할 수 있는 기타 유사한 컴퓨팅 리소스가
포함된다.

<!-- body -->

## 장치 플러그인 등록

kubelet은 `Registration` gRPC 서비스를 노출시킨다.

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```

장치 플러그인은 이 gRPC 서비스를 통해 kubelet에 자체 등록할 수 있다.
등록하는 동안, 장치 플러그인은 다음을 보내야 한다.

* 유닉스 소켓의 이름.
* 빌드된 장치 플러그인 API 버전.
* 알리려는 `ResourceName`. 여기서 `ResourceName` 은
  [확장된 리소스 네이밍 체계](/ko/docs/concepts/configuration/manage-resources-containers/#확장된-리소스)를
  `vendor-domain/resourcetype` 의 형식으로 따라야 한다.
  (예를 들어, NVIDIA GPU는 `nvidia.com/gpu` 로 알려진다.)

성공적으로 등록하고 나면, 장치 플러그인은 kubelet이 관리하는
장치 목록을 전송한 다음, kubelet은 kubelet 노드 상태 업데이트의 일부로
해당 자원을 API 서버에 알리는 역할을 한다.
예를 들어, 장치 플러그인이 kubelet에 `hardware-vendor.example/foo` 를 등록하고
노드에 두 개의 정상 장치를 보고하고 나면, 노드 상태가 업데이트되어
노드에 2개의 "Foo" 장치가 설치되어 사용 가능함을 알릴 수 있다.

그러고 나면, 사용자가 장치를 파드 스펙의 일부로 요청할 수 
있다([`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) 참조). 
확장 리소스를 요청하는 것은 다른 자원의 요청 및 제한을 관리하는 것과 비슷하지만, 
다음과 같은 차이점이 존재한다.
* 확장된 리소스는 정수(integer) 형태만 지원되며 오버커밋(overcommit) 될 수 없다.
* 컨테이너간에 장치를 공유할 수 없다.

### 예제 {#example-pod}

쿠버네티스 클러스터가 특정 노드에서 `hardware-vendor.example/foo` 리소스를 알리는 장치 플러그인을 실행한다고
가정해 보자. 다음은 데모 워크로드를 실행하기 위해 이 리소스를 요청하는 파드의 예이다.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: registry.k8s.io/pause:2.0
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# 이 파드는 2개의 hardware-vendor.example/foo 장치가 필요하며
# 해당 요구를 충족할 수 있는 노드에만
# 예약될 수 있다.
#
# 노드에 2개 이상의 사용 가능한 장치가 있는 경우
# 나머지는 다른 파드에서 사용할 수 있다.
```

## 장치 플러그인 구현

장치 플러그인의 일반적인 워크플로우에는 다음 단계가 포함된다.

* 초기화. 이 단계에서, 장치 플러그인은 공급 업체별 초기화 및 설정을 수행하여
  장치가 준비 상태에 있는지 확인한다.

* 플러그인은 다음의 인터페이스를 구현하는 호스트 경로 `/var/lib/kubelet/device-plugins/`
  아래에 유닉스 소켓과 함께 gRPC 서비스를 시작한다.

  ```gRPC
  service DevicePlugin {
		    // GetDevicePluginOptions는 장치 관리자와 통신할 옵션을 반환한다.
        rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

    		// ListAndWatch는 장치 목록 스트림을 반환한다.
		    // 장치 상태가 변경되거나 장치가 사라질 때마다, ListAndWatch는
		    // 새 목록을 반환한다.
        rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

				// 컨테이너를 생성하는 동안 Allocate가 호출되어 장치
				// 플러그인이 장치별 작업을 실행하고 kubelet에 장치를
				// 컨테이너에서 사용할 수 있도록 하는 단계를 지시할 수 있다.
        rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

        // GetPreferredAllocation은 사용 가능한 장치 목록에서 할당할
				// 기본 장치 집합을 반환한다. 그 결과로 반환된 선호하는 할당은
				// devicemanager가 궁극적으로 수행하는 할당이 되는 것을 보장하지
				// 않는다. 가능한 경우 devicemanager가 정보에 입각한 할당 결정을
				// 내릴 수 있도록 설계되었다.
        rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

        // PreStartContainer는 등록 단계에서 장치 플러그인에 의해 표시되면 각 컨테이너가
				// 시작되기 전에 호출된다. 장치 플러그인은 장치를 컨테이너에서 사용할 수 있도록 하기 전에
				// 장치 재설정과 같은 장치별 작업을 실행할 수 있다.
        rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
  }
  ```

  {{< note >}}
  `GetPreferredAllocation()` 또는 `PreStartContainer()` 에 대한 유용한 구현을
  제공하기 위해 플러그인이 필요하지 않다. 이러한 호출(있는 경우) 중
  사용할 수 있는 경우를 나타내는 플래그는 `GetDevicePluginOptions()`
  호출에 의해 다시 전송된 `DevicePluginOptions` 메시지에 설정되어야 한다. `kubelet` 은
  항상 `GetDevicePluginOptions()` 를 호출하여 사용할 수 있는
  선택적 함수를 확인한 후 직접 호출한다.
  {{< /note >}}

* 플러그인은 호스트 경로 `/var/lib/kubelet/device-plugins/kubelet.sock` 에서
  유닉스 소켓을 통해 kubelet에 직접 등록한다.

* 성공적으로 등록하고 나면, 장치 플러그인은 서빙(serving) 모드에서 실행되며, 그 동안 플러그인은 장치 상태를
  모니터링하고 장치 상태 변경 시 kubelet에 다시 보고한다.
  또한 gRPC 요청 `Allocate` 를 담당한다. `Allocate` 하는 동안, 장치 플러그인은
  GPU 정리 또는 QRNG 초기화와 같은 장치별 준비를 수행할 수 있다.
  작업이 성공하면, 장치 플러그인은 할당된 장치에 접근하기 위한 컨테이너 런타임 구성이 포함된
  `AllocateResponse` 를 반환한다. kubelet은 이 정보를
  컨테이너 런타임에 전달한다.

### kubelet 재시작 처리

장치 플러그인은 일반적으로 kubelet의 재시작을 감지하고 새로운
kubelet 인스턴스에 자신을 다시 등록할 것으로 기대된다. 새 kubelet 인스턴스는 시작될 때
`/var/lib/kubelet/device-plugins` 아래에 있는 모든 기존의 유닉스 소켓을 삭제한다. 장치 플러그인은 유닉스 소켓의
삭제를 모니터링하고 이러한 이벤트가 발생하면 다시 자신을 등록할 수 있다.

## 장치 플러그인 배포

장치 플러그인을 데몬셋, 노드 운영 체제의 패키지
또는 수동으로 배포할 수 있다.

표준 디렉터리 `/var/lib/kubelet/device-plugins` 에는 특권을 가진 접근이 필요하므로,
장치 플러그인은 특권을 가진 보안 컨텍스트에서 실행해야 한다.
장치 플러그인을 데몬셋으로 배포하는 경우, 플러그인의
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)에서
`/var/lib/kubelet/device-plugins` 를
{{< glossary_tooltip text="볼륨" term_id="volume" >}}으로 마운트해야 한다.

데몬셋 접근 방식을 선택하면 쿠버네티스를 사용하여 장치 플러그인의 파드를 노드에 배치하고,
장애 후 데몬 파드를 다시 시작하고, 업그레이드를 자동화할 수 있다.

## API 호환성

과거에는 장치 플러그인의 API 버전을 반드시 kubelet의 버전과 정확하게 일치시켜야 했다.
해당 기능이 v1.12의 베타 버전으로 올라오면서 이는 필수 요구사항이 아니게 되었다.
해당 기능이 베타 버전이 된 이후로 API는 버전화되었고 그동안 변하지 않았다.
그러므로 kubelet 업그레이드를 원활하게 진행할 수 있을 것이지만,
안정화되기 전까지는 향후 API가 변할 수도 있으므로 업그레이드를 했을 때 절대로 문제가 없을 것이라고는 보장할 수는 없다.

{{< caution >}}
쿠버네티스의 장치 관리자 컴포넌트는 안정화된(GA) 기능이지만 _장치 플러그인 API_는 안정화되지 않았다.
장치 플러그인 API와 버전 호환성에 대한 정보는 [장치 플러그인 API 버전](/docs/reference/node/device-plugin-api-versions/)를 참고하라.
{{< /caution >}}

프로젝트로서, 쿠버네티스는 장치 플러그인 개발자에게 다음 사항을 권장한다.

* 향후 릴리스에서 장치 플러그인 API의 변경 사항을 확인하자.
* 이전/이후 버전과의 호환성을 위해 여러 버전의 장치 플러그인 API를 지원하자.

최신 장치 플러그인 API 버전의 쿠버네티스 릴리스로 업그레이드해야 하는 노드에서
장치 플러그인을 실행하기 위해서는, 해당 노드를 업그레이드하기 전에
두 버전을 모두 지원하도록 장치 플러그인을 업그레이드해야 한다. 이러한 방법은
업그레이드 중에 장치 할당이 지속적으로 동작할 것을 보장한다.

## 장치 플러그인 리소스 모니터링

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

장치 플러그인에서 제공하는 리소스를 모니터링하려면, 모니터링 에이전트가
노드에서 사용 중인 장치 셋을 검색하고 메트릭과 연관될 컨테이너를 설명하는
메타데이터를 얻을 수 있어야 한다. 장치 모니터링 에이전트에 의해 노출된
[프로메테우스](https://prometheus.io/) 지표는
[쿠버네티스 Instrumentation 가이드라인](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md)을 따라
`pod`, `namespace` 및 `container` 프로메테우스 레이블을 사용하여 컨테이너를 식별해야 한다.

kubelet은 gRPC 서비스를 제공하여 사용 중인 장치를 검색하고, 이러한 장치에 대한 메타데이터를
제공한다.

```gRPC
// PodResourcesLister는 kubelet에서 제공하는 서비스로, 노드의 포드 및 컨테이너가
// 사용한 노드 리소스에 대한 정보를 제공한다.
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
}
```

### `List` gRPC 엔드포인트 {#grpc-endpoint-list}

`List` 엔드포인트는 실행 중인 파드의 리소스에 대한 정보를 제공하며,
독점적으로 할당된 CPU의 ID, 장치 플러그인에 의해 보고된 장치 ID,
이러한 장치가 할당된 NUMA 노드의 ID와 같은 세부 정보를 함께 제공한다. 또한, NUMA 기반 머신의 경우, 컨테이너를 위해 예약된 메모리와 hugepage에 대한 정보를 포함한다.

```gRPC
// ListPodResourcesResponse는 List 함수가 반환하는 응답이다.
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources에는 파드에 할당된 노드 리소스에 대한 정보가 포함된다.
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources는 컨테이너에 할당된 리소스에 대한 정보를 포함한다.
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
}

// ContainerMemory는 컨테이너에 할당된 메모리와 hugepage에 대한 정보를 포함한다.
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// 토폴로지는 리소스의 하드웨어 토폴로지를 설명한다.
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA 노드의 NUMA 표현
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices는 컨테이너에 할당된 장치에 대한 정보를 포함한다.
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}
```
{{< note >}}
`List` 엔드포인트의 `ContainerResources` 내부에 있는 cpu_ids은 특정 컨테이너에 할당된
독점 CPU들에 해당한다. 만약 공유 풀(shared pool)에 있는 CPU들을 확인(evaluate)하는 것이 목적이라면, 해당 `List`
엔드포인트는 다음에 설명된 것과 같이, `GetAllocatableResources` 엔드포인트와 함께 사용되어야
한다.
1. `GetAllocatableResources`를 호출하여 할당 가능한 모든 CPU 목록을 조회
2. 시스템의 모든 `ContainerResources`에서 `GetCpuIds`를 호출
3. `GetAllocateableResources` 호출에서 `GetCpuIds` 호출로 얻은 모든 CPU를 빼기
{{< /note >}}

### `GetAllocatableResources` gRPC 엔드포인트 {#grpc-endpoint-getallocatableresources}

{{< feature-state state="beta" for_k8s_version="v1.23" >}}

GetAllocatableResources는 워커 노드에서 처음 사용할 수 있는 리소스에 대한 정보를 제공한다.
kubelet이 APIServer로 내보내는 것보다 더 많은 정보를 제공한다.

{{< note >}}
`GetAllocatableResources`는 [할당 가능(allocatable)](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) 리소스를 확인(evaluate)하기 위해서만 
사용해야 한다. 만약 목적이 free/unallocated 리소스를 확인하기 위한 것이라면
List() 엔드포인트와 함께 사용되어야 한다. `GetAllocableResources`로 얻은 결과는 kubelet에
노출된 기본 리소스가 변경되지 않는 한 동일하게 유지된다. 이러한 변경은 드물지만, 발생하게 된다면
(예를 들면: hotplug/hotunplug, 장치 상태 변경) 클라이언트가 `GetAlloctableResources` 엔드포인트를
호출할 것으로 가정한다.

그러나 CPU 및/또는 메모리가 갱신된 경우 `GetAllocateableResources` 엔드포인트를 호출하는 것만으로는
충분하지 않으며, kubelet을 다시 시작하여 올바른 리소스 용량과 할당 가능(allocatable) 리소스를 반영해야 한다.
{{< /note >}}


```gRPC
// AllocatableResourcesResponses에는 kubelet이 알고 있는 모든 장치에 대한 정보가 포함된다.
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}

```
쿠버네티스 v1.23부터, `GetAllocatableResources`가 기본으로 활성화된다.
이를 비활성화하려면 `KubeletPodResourcesGetAllocatable` 
[기능 게이트(feature gate)](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 끄면 된다.

쿠버네티스 v1.23 이전 버전에서 이 기능을 활성화하려면 `kubelet`이 다음 플래그를 가지고 시작되어야 한다. 

```
--feature-gates=KubeletPodResourcesGetAllocatable=true
```

`ContainerDevices` 는 장치가 어떤 NUMA 셀과 연관되는지를 선언하는 토폴로지 정보를 노출한다.
NUMA 셀은 불분명한(opaque) 정수 ID를 사용하여 식별되며, 이 값은
[kubelet에 등록할 때](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#토폴로지-관리자로-장치-플러그인-통합) 장치 플러그인이 보고하는 것과 일치한다.


gRPC 서비스는 `/var/lib/kubelet/pod-resources/kubelet.sock` 의 유닉스 소켓을 통해 제공된다.
장치 플러그인 리소스에 대한 모니터링 에이전트는 데몬 또는 데몬셋으로 배포할 수 있다.
표준 디렉터리 `/var/lib/kubelet/pod-resources` 에는 특권을 가진 접근이 필요하므로, 모니터링
에이전트는 특권을 가진 보안 컨텍스트에서 실행해야 한다. 장치 모니터링 에이전트가
데몬셋으로 실행 중인 경우, 해당 장치 모니터링 에이전트의 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)에서
`/var/lib/kubelet/pod-resources` 를
{{< glossary_tooltip text="볼륨" term_id="volume" >}}으로 마운트해야 한다.

`PodResourcesLister service` 를 지원하려면 `KubeletPodResources` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화해야 한다.
이것은 쿠버네티스 1.15부터 기본으로 활성화되어 있으며, 쿠버네티스 1.20부터는 v1 상태이다.

## 토폴로지 관리자로 장치 플러그인 통합

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

토폴로지 관리자는 kubelet 컴포넌트로, 리소스를 토폴로지 정렬 방식으로 조정할 수 있다. 
이를 위해, 장치 플러그인 API가 `TopologyInfo` 구조체를 포함하도록 확장되었다.


```gRPC
message TopologyInfo {
	repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```

토폴로지 관리자를 활용하려는 장치 플러그인은 장치 ID 및 장치의 정상 상태와 함께 장치 등록의 일부로 채워진 TopologyInfo 구조체를 다시 보낼 수 있다.
그런 다음 장치 관리자는 이 정보를 사용하여 토폴로지 관리자와 상의하고 리소스 할당 결정을 내린다.

`TopologyInfo` 는 `nodes` 필드에 `nil`(기본값) 또는 NUMA 노드 목록을 설정하는 것을 지원한다.
이를 통해 복수의 NUMA 노드에 연관된 장치에 대해 장치 플러그인을 설정할 수 있다.

특정 장치에 대해 `TopologyInfo`를 `nil`로 설정하거나 비어있는 NUMA 노드 목록을 제공하는 것은 
장치 플러그인이 해당 장치에 대한 NUMA 선호도(affinity)를 지니지 못함을 시사한다.

장치 플러그인으로 장치에 대해 채워진 `TopologyInfo` 구조체의 예는 다음과 같다.

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

## 장치 플러그인 예시 {#examples}

{{% thirdparty-content %}}

다음은 장치 플러그인 구현의 예이다.

* [AMD GPU 장치 플러그인](https://github.com/ROCm/k8s-device-plugin)
* 인텔 GPU, FPGA, QAT, VPU, SGX, DSA, DLB 및 IAA 장치용 [인텔 장치 플러그인](https://github.com/intel/intel-device-plugins-for-kubernetes)
* 하드웨어 지원 가상화를 위한 [KubeVirt 장치 플러그인](https://github.com/kubevirt/kubernetes-device-plugins)
* [컨테이너에 최적화된 OS를 위한 NVIDIA GPU 장치 플러그인](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [RDMA 장치 플러그인](https://github.com/hustcat/k8s-rdma-device-plugin)
* [SocketCAN 장치 플러그인](https://github.com/collabora/k8s-socketcan)
* [Solarflare 장치 플러그인](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [SR-IOV 네트워크 장치 플러그인](https://github.com/intel/sriov-network-device-plugin)
* Xilinx FPGA 장치용 [Xilinx FPGA 장치 플러그인](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin)

## {{% heading "whatsnext" %}}


* 장치 플러그인을 사용한 [GPU 리소스 스케줄링](/ko/docs/tasks/manage-gpus/scheduling-gpus/)에 대해 알아보기
* 노드에서의 [확장 리소스 알리기](/ko/docs/tasks/administer-cluster/extended-resource-node/)에 대해 배우기
* [토폴로지 관리자](/docs/tasks/administer-cluster/topology-manager/)에 대해 알아보기
* 쿠버네티스에서 [TLS 인그레스에 하드웨어 가속](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) 사용에 대해 읽기
