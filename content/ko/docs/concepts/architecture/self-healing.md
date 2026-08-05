---
title: 쿠버네티스 자가 치유  
content_type: concept  
weight: 50  
feature:
  title: 자가 치유
  anchor: Automated recovery from damage
  description: >
    쿠버네티스는 비정상 종료한 컨테이너를 재시작하고, 필요한 경우 전체 파드를 교체하며,
    더 넓은 장애에 대응하여 스토리지를 다시 연결하고, 
    노드 오토스케일러와 연동하여 노드 수준에서도 자가 치유할 수 있다.
---
<!-- overview -->

쿠버네티스는 워크로드의 상태와 가용성을 유지할 수 있도록 자가 치유 기능을 제공한다. 
실패한 컨테이너를 자동으로 교체하고, 노드가 사용할 수 없게 되면 워크로드를 다시 스케줄하며, 원하는 시스템 상태를 유지하도록 보장한다.

<!-- body -->

## 자가 치유 기능 {#self-healing-capabilities} 

- **컨테이너 단위 재시작:** 파드 내부의 컨테이너가 실패하면, 쿠버네티스는 [`재시작 정책`](/ko/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)에 따라 재시작한다.

- **레플리카 교체:** [디플로이먼트(Deployment)](/ko/docs/concepts/workloads/controllers/deployment/) 또는 [스테이트풀셋(StatefulSet)](/ko/docs/concepts/workloads/controllers/statefulset/)의 파드가 실패하면, 쿠버네티스는 지정된 레플리카 수를 유지하기 위해 대체 파드를 생성한다.
  [데몬셋(DaemonSet)](/ko/docs/concepts/workloads/controllers/daemonset/)의 일부인 파드가 실패한다면, 컨트롤 플레인이 
  대체 파드를 생성하여 동일한 노드에서 실행되도록 한다.
  
- **영구 스토리지 복구:** 퍼시스턴트볼륨(PersistentVolume)이 연결된 파드를 실행 중일 떄 노드에 장애가 발생하면, 쿠버네티스는 다른 노드에 있는 새로운 파드에 다시 연결할 수 있다.

- **서비스 로드 밸런싱:** [서비스](/ko/docs/concepts/services-networking/service/) 뒤에 있는 파드에 장애가 발생하면, 쿠버네티스는 자동으로 서비스의 엔드포인트에서 해당 파드를 제거하여 정상 파드로만 트래픽을 라우팅한다.

쿠버네티스가 자가 치유를 제공하는 주요 컴포넌트는 다음과 같다.

- **[kubelet](/docs/concepts/architecture/#kubelet):** 컨테이너가 실행 중인지 확인하고, 실패한 컨테이너를 재시작한다.

- **레플리카셋(ReplicaSet), 스테이트풀셋, 데몬셋 컨트롤러:** 파드 레플리카를 원하는 수로 유지한다.

- **퍼시스턴트볼륨 컨트롤러:** 상태 저장 워크로드의 볼륨 연결 및 연결 해제를 관리한다.

## 고려 사항 {#considerations} 

- **스토리지 장애:** 퍼시스턴트볼륨을 사용할 수 없게 되면, 복구 절차가 필요할 수 있다.

- **애플리케이션 오류:** 쿠버네티스는 컨테이너를 재시작할 수 있지만, 근본적인 애플리케이션 문제는 별도로 해결해야 한다.

## {{% heading "whatsnext" %}} 

- [파드](/ko/docs/concepts/workloads/pods/) 더 읽어보기
- [쿠버네티스 컨트롤러](/ko/docs/concepts/architecture/controller/) 학습하기
- [퍼시스턴트볼륨](/ko/docs/concepts/storage/persistent-volumes/) 살펴보기
- [노드 오토스케일링](/docs/concepts/cluster-administration/node-autoscaling/) 읽어보기. 노드 오토스케일링은
  클러스터의 노드가 실패할 경우 자동 치유 기능도 제공한다. 