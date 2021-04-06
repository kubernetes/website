---
title: 여러 영역에서 실행
weight: 20
content_type: concept
---

<!-- overview -->

이 페이지에서는 여러 영역에서 쿠버네티스를 실행하는 방법을 설명한다.

<!-- body -->

## 배경

쿠버네티스는 단일 쿠버네티스 클러스터가 여러 장애 영역에서
실행될 수 있도록 설계되었다. 일반적으로 이러한 영역은 _지역(region)_ 이라는
논리적 그룹 내에 적합하다. 주요 클라우드 제공자는 지역을 일관된 기능 집합을
제공하는 장애 영역 집합(_가용성 영역_ 이라고도 함)으로
정의한다. 지역 내에서 각 영역은 동일한 API 및
서비스를 제공한다.

일반적인 클라우드 아키텍처는 한 영역의 장애가 다른 영역의 서비스도
손상시킬 가능성을 최소화하는 것을 목표로 한다.

## 컨트롤 플레인 동작

모든 [컨트롤 플레인 컴포넌트](/ko/docs/concepts/overview/components/#컨트롤-플레인-컴포넌트)는
컴포넌트별로 복제되는 교환 가능한 리소스 풀로 실행을
지원한다.

클러스터 컨트롤 플레인을 배포할 때, 여러 장애 영역에
컨트롤 플레인 컴포넌트의 복제본을 배치한다. 가용성이
중요한 문제인 경우, 3개 이상의 장애 영역을 선택하고
각 개별 컨트롤 플레인 컴포넌트(API 서버, 스케줄러, etcd,
클러스터 컨트롤러 관리자)를 3개 이상의 장애 영역에 복제한다.
클라우드 컨트롤러 관리자를 실행 중인 경우 선택한
모든 장애 영역에 걸쳐 이를 복제해야 한다.

{{< note >}}
쿠버네티스는 API 서버 엔드포인트에 대한 교차 영역 복원성을 제공하지
않는다. DNS 라운드-로빈, SRV 레코드 또는 상태 확인 기능이 있는
써드파티 로드 밸런싱 솔루션을 포함하여 다양한 기술을 사용하여
클러스터 API 서버의 가용성을 향상시킬 수 있다.
{{< /note >}}

## 노드 동작

쿠버네티스는 클러스터의 여러 노드에 걸쳐
워크로드 리소스(예: {{< glossary_tooltip text="디플로이먼트(Deployment)" term_id="deployment" >}}
또는 {{< glossary_tooltip text="스테이트풀셋(StatefulSet)" term_id="statefulset" >}})에
대한 파드를 자동으로 분배한다. 이러한 분배는
실패에 대한 영향을 줄이는 데 도움이 된다.

노드가 시작되면, 각 노드의 kubelet이 쿠버네티스 API에서
특정 kubelet을 나타내는 노드 오브젝트에
{{< glossary_tooltip text="레이블" term_id="label" >}}을 자동으로 추가한다.
이러한 레이블에는
[영역 정보](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)가 포함될 수 있다.

클러스터가 여러 영역 또는 지역에 걸쳐있는 경우,
[파드 토폴로지 분배 제약 조건](/ko/docs/concepts/workloads/pods/pod-topology-spread-constraints/)과
함께 노드 레이블을 사용하여
파드가 장애 도메인(지역, 영역, 특정 노드) 간 클러스터에
분산되는 방식을 제어할 수 있다.
이러한 힌트를 통해
{{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}는
더 나은 예상 가용성을 위해 파드를 배치할 수 있으므로, 상관 관계가 있는
오류가 전체 워크로드에 영향을 미칠 위험을 줄일 수 있다.

예를 들어, 가능할 때마다 스테이트풀셋의
3개 복제본이 모두 서로 다른 영역에서 실행되도록 제약 조건을
설정할 수 있다. 각 워크로드에 사용 중인
가용 영역을 명시적으로 정의하지 않고 이를 선언적으로
정의할 수 있다.

### 여러 영역에 노드 분배

쿠버네티스의 코어는 사용자를 위해 노드를 생성하지 않는다. 사용자가 직접 수행하거나,
[클러스터 API](https://cluster-api.sigs.k8s.io/)와 같은 도구를 사용하여
사용자 대신 노드를 관리해야 한다.

클러스터 API와 같은 도구를 사용하면 여러 장애 도메인에서
클러스터의 워커 노드로 실행할 머신 집합과 전체 영역 서비스 중단 시
클러스터를 자동으로 복구하는 규칙을 정의할 수 있다.

## 파드에 대한 수동 영역 할당

생성한 파드와 디플로이먼트, 스테이트풀셋, 잡(Job)과
같은 워크로드 리소스의 파드 템플릿에 [노드 셀렉터 제약 조건](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#노드-셀렉터-nodeselector)을
적용할 수 있다.

## 영역에 대한 스토리지 접근

퍼시스턴트 볼륨이 생성되면, `PersistentVolumeLabel`
[어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)는
특정 영역에 연결된 모든 퍼시스턴트볼륨(PersistentVolume)에 영역 레이블을 자동으로
추가한다. 그런 다음 {{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}는
`NoVolumeZoneConflict` 프레디케이트(predicate)를 통해 주어진 퍼시스턴트볼륨을 요구하는 파드가
해당 볼륨과 동일한 영역에만 배치되도록 한다.

해당 클래스의 스토리지가 사용할 수 있는 장애 도메인(영역)을 지정하는
퍼시스턴트볼륨클레임(PersistentVolumeClaims)에 대한
{{< glossary_tooltip text="스토리지클래스(StorageClass)" term_id="storage-class" >}}를 지정할 수 있다.
장애 도메인 또는 영역을 인식하는 스토리지클래스 구성에 대한 자세한 내용은
[허용된 토폴로지](/ko/docs/concepts/storage/storage-classes/#허용된-토폴로지)를 참고한다.

## 네트워킹

쿠버네티스가 스스로 영역-인지(zone-aware) 네트워킹을 포함하지는 않는다.
[네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)을
사용하여 클러스터 네트워킹을 구성할 수 있으며, 해당 네트워크 솔루션에는 영역별 요소가
있을 수 있다. 예를 들어, 클라우드 제공자가
`type=LoadBalancer` 를 사용하여 서비스를 지원하는 경우, 로드 밸런서는 지정된 연결을 처리하는
로드 밸런서 요소와 동일한 영역에서 실행 중인 파드로만 트래픽을 보낼 수 있다.
자세한 내용은 클라우드 제공자의 문서를 확인한다.

사용자 정의 또는 온-프레미스 배포의 경우, 비슷한 고려 사항이 적용된다.
다른 장애 영역 처리를 포함한 {{< glossary_tooltip text="서비스" term_id="service" >}}와
{{< glossary_tooltip text="인그레스(Ingress)" term_id="ingress" >}} 동작은
클러스터가 설정된 방식에 명확히 의존한다.

## 장애 복구

클러스터를 설정할 때, 한 지역의 모든 장애 영역이 동시에
오프라인 상태가 되는 경우 설정에서 서비스를 복원할 수 있는지
여부와 방법을 고려해야 할 수도 있다. 예를 들어, 영역에서 파드를 실행할 수 있는
노드가 적어도 하나 이상 있어야 하는가?
클러스터에 중요한 복구 작업이 클러스터에
적어도 하나 이상의 정상 노드에 의존하지 않는지 확인한다. 예를 들어, 모든 노드가
비정상인 경우, 하나 이상의 노드를 서비스할 수 있을 만큼 복구를 완료할 수 있도록 특별한
{{< glossary_tooltip text="톨러레이션(toleration)" term_id="toleration" >}}으로
복구 작업을 실행해야 할 수 있다.

쿠버네티스는 이 문제에 대한 답을 제공하지 않는다. 그러나,
고려해야 할 사항이다.

## {{% heading "whatsnext" %}}

스케줄러가 구성된 제약 조건을 준수하면서, 클러스터에 파드를 배치하는 방법을 알아보려면,
[스케줄링과 축출(eviction)](/ko/docs/concepts/scheduling-eviction/)을 참고한다.
