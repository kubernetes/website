---
title: 클러스터 종료 및 재시작
content_type: task
weight: 55
---

<!-- overview -->

이 페이지는 쿠버네티스 클러스터를 안전하게 종료하고 재시작하는 절차를 설명한다.

클러스터 관리자는 유지보수를 수행하거나 운영 비용과 리소스 사용량을 줄이기 위해 실행 중인 클러스터를 일시적으로 종료했다가 나중에 재시작해야 할 수 있다.

<!-- body -->

## {{% heading "prerequisites" %}}

- 기존 쿠버네티스 클러스터가 있어야 하며, 클러스터 관리자 역할을 가진 사용자로 클러스터에 접근할 수 있어야 한다.
- 이 절차는 노드 오토스케일러를 사용하는 환경에는 적용되지 않는다.
- 이 절차에서는 클러스터를 종료하기 위해 노드의 전원을 끈다. 일부 서버 관리 시스템은 활성 상태 확인에 응답하지 않는 서버(VM)를 삭제하도록 구성되어 있다. 이런 환경에서는 VM이 자동으로 삭제될 수 있으므로 이 절차를 수행하지 않는다.

### (선택 사항) 인증서 만료일 확인 {#check-certificate-expiration}

클러스터를 장기간 종료할 계획이라면 인증서의 만료일을 확인한다.

```bash
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -enddate
```

출력 예시:

```bash
notAfter=Mar  3 09:18:19 2026 GMT
```

종료 후 클러스터를 정상적으로 재시작할 수 있도록 인증서가 만료되기 전에 재시작할 계획을 세운다.
인증서마다 만료일이 다를 수 있다.

## (선택 사항) etcd 클러스터 백업

쿠버네티스 클러스터가 etcd를 데이터 저장소로 사용한다면
[etcd 백업](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)을 생성한다.
클러스터가 정상적으로 재시작되지 않으면 이 백업을 사용해 복구할 수 있다.

{{< note >}}
- 이 절차에서는 데이터 손상을 방지하기 위해 워크로드를 정상적으로 종료한다.
  필요한 경우 각 워크로드의 백업 방법을 확인하고 백업한다.
- 클러스터는 클러스터 관리자가 종료하지만, 워크로드는 각 담당자가 백업해야 할 수 있다.
  클러스터 관리자는 사용자에게 미리 알리는 등 클러스터 종료에 필요한 운영 절차를 마련한다.
{{< /note >}}

## 클러스터의 노드 종료 {#node-shutdown}

클러스터를 안전하게 종료하려면 각 노드를 그레이스풀 방식으로 종료한다.
이렇게 하면 일반적으로 나중에 클러스터를 정상적으로 재시작할 수 있다.
일반적인 [노드 셧다운](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown)에서는
축출된 파드를 가용한 다른 노드에 배치할 수 있다. 클러스터 전체를 종료할 때는
클러스터가 재시작될 때까지 축출된 파드가 다시 스케줄링되지 않도록 한다.
워커 노드를 먼저 종료한 뒤 컨트롤 플레인을 종료한다.

### 노드를 스케줄링 불가 상태로 표시

`kubectl cordon`으로 워커 노드와 컨트롤 플레인 노드를 모두 스케줄링 불가 상태로 표시한다.

```bash
kubectl cordon --selector='!node-role.kubernetes.io/control-plane'
kubectl cordon --selector='node-role.kubernetes.io/control-plane'
```

### 노드의 파드 종료

`kubectl drain`을 사용해 노드에서 파드를 축출한다.

`kubectl drain`은 파드를 축출하기 전에 대상 노드를 스케줄링 불가 상태로 표시한다. 규모가 큰 클러스터에서는 드레인을 시작하기 전에 모든 노드가 스케줄링 불가 상태인지 확인해야 할 수 있다. 노드의 스케줄링 가능 여부는 `kubectl get nodes`로 확인할 수 있다.
워커 노드를 먼저 드레인한 뒤 컨트롤 플레인 노드를 드레인한다.

```bash
kubectl drain --ignore-daemonsets --selector='!node-role.kubernetes.io/control-plane'
kubectl drain --ignore-daemonsets --selector='node-role.kubernetes.io/control-plane'
```

### 클러스터 노드의 전원 끄기

클러스터의 모든 노드를 종료한다. 클라우드 제공자의 웹 콘솔, 스크립트, 플레이북 등
클러스터 환경에 맞는 방법을 사용한다.

예를 들어 다음 명령을 각 노드에서 실행할 수 있다.

```bash
# Run this on each node (not on your own PC)
systemctl poweroff
```

### 클러스터가 의존하는 리소스 종료

모든 노드의 종료가 완료되면 외부 스토리지 등 클러스터가 의존하는 리소스 중
더 이상 필요하지 않은 것을 종료한다.
각 리소스를 종료하거나 일시 중지하거나 삭제해도 되는지 공급업체의 문서를 확인한다.

## 클러스터 재시작

정상적으로 종료한 클러스터를 다시 시작하려면 다음 절차를 따른다.

클러스터가 복구되지 않으면
[etcd 백업](/docs/tasks/administer-cluster/configure-upgrade-etcd/#restoring-an-etcd-cluster)을
사용해 클러스터를 이전 상태로 복원한다.

### 클러스터가 의존하는 리소스 시작

외부 스토리지 등 클러스터에 필요한 외부 리소스를 먼저 시작한다.

### 클러스터 머신의 전원 켜기

먼저 클러스터의 모든 컨트롤 플레인 노드에 해당하는 머신을 시작한다.
클라우드 제공자의 웹 콘솔 등 클러스터 환경에 맞는 방법을 사용한다.
컨트롤 플레인 노드가 `Ready`가 될 때까지 몇 분간 기다린다.
`kube-apiserver`와 etcd 같은 컨트롤 플레인 컴포넌트는 시작하는 데 시간이 더 걸릴 수 있다.
모든 컨트롤 플레인 노드가 `Ready`인지 확인한다.

이어서 모든 워커 노드의 머신을 시작하고, 워커 노드가 `Ready`인지 확인한다.

```bash
kubectl get nodes --selector='node-role.kubernetes.io/control-plane'
kubectl get nodes --selector='!node-role.kubernetes.io/control-plane'
```

### 컨트롤 플레인 노드를 스케줄링 가능 상태로 변경

컨트롤 플레인 노드가 `Ready`가 되면 `kubectl uncordon`으로 모든 컨트롤 플레인 노드를
스케줄링 가능 상태로 변경한다.

```bash
kubectl uncordon --selector='node-role.kubernetes.io/control-plane'
```

### 워커 노드를 스케줄링 가능 상태로 변경

워커 노드가 `Ready`가 되면 `kubectl uncordon`으로 모든 워커 노드를
스케줄링 가능 상태로 변경한다.

```bash
kubectl uncordon --selector='!node-role.kubernetes.io/control-plane'
```

모든 파드가 다시 동작할 때까지 기다린 뒤, 파드가 `Running` 상태인지 확인한다.

```bash
kubectl get pods --all-namespaces
```

이 명령은 기본적인 확인 방법이다. 실제 프로덕션 환경에서는 시스템 구성에 따라
추가 절차와 검증이 필요할 수 있다.

### 유의 사항

클러스터를 재시작한 뒤에는 종료 전의 파드 배치가 유지되지 않을 수 있다.
노드는 순차적으로 스케줄링 가능 상태가 된다. kube-scheduler는 스케줄링 시점에
`Ready`이면서 스케줄링 가능한 노드에만 파드를 배치한다.
스케줄링 가능 상태로 전환할 노드가 많으면, 파드가 먼저 전환된 노드에 편중될 수 있다.
