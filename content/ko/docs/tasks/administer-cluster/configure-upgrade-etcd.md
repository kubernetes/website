---
# reviewers:
# - mml
# - wojtek-t
# - jpbetz
title: 쿠버네티스를 위한 etcd 클러스터 운영
content_type: task
weight: 270
---

<!-- overview -->

{{< glossary_definition term_id="etcd" length="all" prepend="etcd는 ">}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## 전제 조건

* etcd를 홀수 멤버 클러스터로 실행한다.

* etcd는 리더 기반 분산 시스템이다. 클러스터를 안정적으로 유지하기 위해서는
  리더가 모든 팔로워에게 주기적으로 제시간에 하트비트를 보내야
  한다.

* 리소스 고갈이 발생하지 않도록 한다.

  클러스터의 성능과 안정성은 네트워크와 디스크 I/O에 민감하다.
  리소스가 부족하면 하트비트 시간이 초과하여 클러스터가 불안정해질 수 있다.
  etcd가 불안정하다는 것은 리더가 선출되지 않는 것을 의미한다. 이런
  상황에서는 클러스터가 현재 상태를 변경할 수 없으며,
  이는 곧 새로운 파드를 스케줄링할 수 없음을 의미한다.

* etcd 클러스터를 안정적으로 유지하는 것은 쿠버네티스 클러스터의
  안정성에 매우 중요하다. 따라서, [보장된 리소스 요구사항](https://etcd.io/docs/current/op-guide/hardware/)
  을 위해 전용 머신 또는 격리된 환경에서 etcd 클러스터를 실행한다.

* 프로덕션 환경에서 실행하기 위한 etcd의 최소 권장 버전은 `3.4.22+`와 `3.5.6+` 이다.

## 리소스 요구 사항

제한된 리소스로 etcd를 운영하는 것은 테스트를 목적으로 하는 경우에만 적합하다.
프로덕션 환경에 배포하기 위해선 전문적인 하드웨어 구성이 필요하다.
etcd를 프로덕션 환경에 배포하기 전에
[리소스 요구 사항 레퍼런스](https://etcd.io/docs/current/op-guide/hardware/#example-hardware-configurations)를 참고한다.

## etcd 클러스터 시작하기

이 섹션에서는 단일 노드와 다중 노드의 etcd 클러스터를 시작하는 방법을 설명한다.

### 단일 노드 etcd 클러스터

단일 노드 etcd 클러스터는 테스트 목적으로만 사용한다.

1. 다음 명령을 실행한다.

   ```sh
   etcd --listen-client-urls=http://$PRIVATE_IP:2379 \
      --advertise-client-urls=http://$PRIVATE_IP:2379
   ```

2. `--etcd-servers=$PRIVATE_IP:2379` 플래그를 사용하여
   쿠버네티스 API 서버를 시작한다.

   이 때, `PRIVATE_IP`가 etcd 클라이언트 IP로 설정되어 있는지 확인한다.

### 다중 노드 etcd 클러스터

내구성과 고가용성을 위해 프로덕션 환경에서는 etcd를 다중 노드 클러스터로
실행하고 주기적으로 백업해야 한다. 프로덕션 환경에서는 5개의 멤버로 구성된
클러스터를 권장한다. 자세한 내용은
[FAQ 문서](https://etcd.io/docs/current/faq/#what-is-failure-tolerance)를 참고한다.

고정(static) 멤버 정보를 이용하거나, 또는 동적 디스커버리를 통해 etcd 클러스터를 구성한다.
클러스터링에 대한 자세한 내용은
[etcd 클러스터링 문서](https://etcd.io/docs/current/op-guide/clustering/)를 참고한다.

예를 들어, 다음과 같이 클라이언트 URL로 실행되는 다섯 개 멤버의 etcd 클러스터를
가정해 보자 (`http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`,
`http://$IP4:2379`, `http://$IP5:2379`). 쿠버네티스 API 서버를 시작하려면

1. 다음과 같이 실행한다.

   ```shell
   etcd --listen-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379 --advertise-client-urls=http://$IP1:2379,http://$IP2:2379,http://$IP3:2379,http://$IP4:2379,http://$IP5:2379
   ```

2. `--etcd-servers=$IP1:2379,$IP2:2379,$IP3:2379,$IP4:2379,$IP5:2379`
   플래그를 사용하여 쿠버네티스 API 서버를 시작한다.

   `IP<n>` 변수를 클라이언트 IP 주소로 설정했는지 확인하자.

### 로드 밸런서가 있는 멀티 노드 etcd 클러스터

로드 밸런싱 etcd 클러스터를 실행하려면 다음을 수행한다.

1. etcd 클러스터를 설정한다.
2. etcd 클러스터 앞에 로드 밸런서를 구성한다.
   예를 들어 로드 밸런서의 주소는 `$LB`로 설정한다.
3. `--etcd-servers=$LB:2379` 플래그를 사용하여 쿠버네티스 API 서버를 시작한다.

## etcd 클러스터 보안

etcd에 대한 접근 권한은 클러스터의 루트 권한과 동일하므로 API 서버만
접근 권한을 갖는 것이 바람직하다. 데이터의 민감도를 고려하여,
etcd 클러스터에 대한 접근이 필요한 노드에만 권한을 부여하는
것이 권장된다.

etcd를 보호하려면 방화벽 규칙을 설정하거나 etcd에서 제공하는 보안
기능을 사용한다. etcd 보안 기능은 x509 공개키 인프라스트럭처(PKI)에
의해 결정된다. 시작하려면 키와 인증서 쌍을 생성하여 보안 통신
채널을 설정한다. 예를 들어, etcd 멤버 간의 보안 통신을 위해
`peer.key` 및 `peer.cert` 키 쌍을 사용하고, etcd와 해당 클라이언트
간의 보안 통신을 위해 `client.key` 와 `client.cert` 키 쌍을 사용한다.
클라이언트 인증을 위한 키 쌍과 CA 파일을 생성하려면 etcd 프로젝트에서
제공하는 [예제 스크립트](https://github.com/coreos/etcd/tree/master/hack/tls-setup)를
참고한다.

### 보안 통신

보안 피어 통신을 사용하도록 etcd를 구성하려면,
`--peer-key-file=peer.key` 및 `--peer-cert-file=peer.cert` 플래그를 지정하고 URL
스키마로 HTTPS를 사용한다.

마찬가지로, 보안 클라이언트 통신을 사용하도록 etcd를 구성하려면,
`--key-file=k8sclient.key` 및 `--cert-file=k8sclient.cert` 플래그를 지정하고 URL
스키마로 HTTPS를 사용한다. 다음은 보안 통신을 사용하는 클라이언트 명령어의
예시이다.

```
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  member list
```

### etcd 클러스터의 접근 제한

보안 통신 구성을 마치면, etcd 클러스터의 접근을 쿠버네티스
API 서버로만 제한한다. 이를 위해 TLS 인증을 사용한다.

CA `etcd.ca`가 신뢰하는 키 쌍 `k8sclient.key` 와 `k8sclient.cert`를
예로 들어본다. etcd가 TLS와 함께 `--client-cert-auth`로 구성되면,
시스템 CA 또는 `--trusted-ca-file` 플래그로 전달된 CA를 사용하여
클라이언트의 인증서를 확인한다.
`--client-cert-auth=true` 와 `--trusted-ca-file=etcd.ca` 플래그를 지정하면
`k8sclient.cert` 인증서를 가진 클라이언트만이 접근 허용된다.

etcd가 올바르게 구성되었다면, 이제 유효한 인증서를 가진 클라이언트만 엑세스할 수
있다. 쿠버네티스 API 서버에 접근 권한을 부여하려면 `--etcd-certfile=k8sclient.cert`,
`--etcd-keyfile=k8sclient.key` 및 `--etcd-cafile=ca.cert` 플래그를
사용하여 서버를 구성한다.

{{< note >}}
etcd 인증은 현재 쿠버네티스에서 지원되지 않는다. 자세한
내용은 관련된 이슈
[Etcd v2에 대한 기본 인증 지원](https://github.com/kubernetes/kubernetes/issues/23398)을 참고한다.
{{< /note >}}

## 실패한 etcd 멤버 교체

etcd 클러스터는 사소한 멤버 장애를 허용함으로써 고가용성을 달성한다.
그러나 클러스터 전반의 상태를 개선하려면 장애가 발생한 멤버를 즉시
교체해야 한다. 여러 구성원이 실패했다면, 멤버를 하나씩 교체한다.
장애 멤버 교체는 장애 멤버를 제거하고 새 멤버를 추가하는 두 단계를
포함한다.

etcd는 내부적으로 고유한 멤버 ID를 사용하고 있지만, 사람에 의한 실수를
방지하기 위해 각 멤버에 고유한 이름을 사용하는 것을 권장한다. 예를 들어,
세 명의 멤버로 구성된 etcd 클러스터 가정해 보자. `member1=http://10.0.0.1`,
`member2=http://10.0.0.2`, `member3=http://10.0.0.3`의 URL을 사용한다.
`member1`이 실패하면 `member4=http://10.0.0.4`로 대체한다.

1. 실패한 `member1`의 멤버 ID를 가져온다.

   ```shell
   etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list
   ```

   다음과 같은 메시지가 표시된다.

   ```console
   8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
   91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
   fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379
   ```

1. 다음 중 하나를 수행한다.

   1. 각 쿠버네티스 API 서버가 모든 etcd 멤버와 통신하도록 구성된 경우,
      `--etcd-servers` 플래그에서 실패한 멤버를 제거한 다음
      각 쿠버네티스 API 서버를 재시작한다.
   1. 각 쿠버네티스 API 서버가 단일 etcd 멤버와 통신하는 경우,
      실패한 etcd와 통신하는 쿠버네티스 API 서버를
      중지한다.

1. 장애가 발생한 노드의 etcd 서버를 중지한다. 쿠버네티스 API 서버 이외의
   다른 클라이언트가 etcd로 트래픽을 발생시킬 수 있으므로, 데이터 디렉터리에
   데이터 쓰기 작업이 일어나는 것을 방지하기 위해 모든 트래픽을 중지하는 것이
   좋다.

1. 다음 명령을 실행하여 실패한 멤버를 제거한다.

   ```shell
   etcdctl member remove 8211f1d0f64f3269
   ```

   다음과 같은 메시지가 표시된다.

   ```console
   Removed member 8211f1d0f64f3269 from cluster
   ```

1. 다음 명령을 실행하여 새로운 멤버를 추가한다.

   ```shell
   etcdctl member add member4 --peer-urls=http://10.0.0.4:2380
   ```

   다음과 같은 메시지가 표시된다.

   ```console
   Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4
   ```

1. `10.0.0.4` IP를 사용하는 머신에서 새로 추가할 멤버를 실행한다.

   ```shell
   export ETCD_NAME="member4"
   export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
   export ETCD_INITIAL_CLUSTER_STATE=existing
   etcd [flags]
   ```

1. 다음 중 하나를 수행한다.

   1. 각 쿠버네티스 API 서버가 모든 etcd 멤버와 통신하도록 구성된 경우,
      새로 추가된 멤버를 `--etcd-servers` 플래그에 추가한 다음
      각 쿠버네티스 API 서버를 재시작한다.
   1. 각 쿠버네티스 API 서버가 단일 etcd 멤버와 통신하는 경우,
      2단계에서 중지한 쿠버네티스 API 서버를 시작한다. 그런 다음
      중지된 쿠버네티스 API 서버로 요청을 다시 라우팅하도록
      쿠버네티스 API 서버 클라이언트를 구성한다. 로그밸런서를 구성하여
      이 작업을 수행할 수 있다.

클러스터 재구성에 대한 자세한 내용은
[etcd 재구성 문서](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)를 참고한다.

## etcd 클러스터 백업

쿠버네티스의 모든 오브젝트는 etcd에 저장된다. etcd 클러스터 데이터를 주기적으로
백업하는 것은, 모든 컨트롤 플레인 노드가 손실되는 등의 재해가
발생했을 때 쿠버네티스 클러스터를 복구하는 데 중요한 역할을 한다. 스냅샷
파일에는 쿠버네티스의 모든 상태와 중요 정보가 포함되어 있다. 쿠버네티스의
중요한 데이터를 안전하게 유지하려면 스냅샷 파일을 암호화하자.

etcd 클러스터 백업은 etcd 자체 스냅샷과 볼륨 스냅샷, 두 가지 방법으로
수행할 수 있다.

### 자체(Built-in) 스냅샷

etcd는 자체 스냅샷을 지원한다. 스냅샷은 라이브 멤버 내에서
`etcdctl snapshot save` 명령을 사용해 만들거나, 현재
etcd 프로세스가 사용하고 있지 않은
[데이터 디렉터리](https://etcd.io/docs/current/op-guide/configuration/#--data-dir) 아래의
`member/snap/db` 파일을 복사해 만들 수 있다. 스냅샷을 생성해도
멤버의 성능에는 영향을 미치지 않는다.

아래는 `$ENDPOINT`가 제공하는 키 공간의 스냅샷을 `snapshotdb`
파일로 만드는 예시이다.

```shell
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshotdb
```

스냅샷을 확인한다.

```shell
ETCDCTL_API=3 etcdctl --write-out=table snapshot status snapshotdb
```

```console
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| fe01cf57 |       10 |          7 | 2.1 MB     |
+----------+----------+------------+------------+
```

### 볼륨 스냅샷

Amazon Elastic Block Store와 같이 백업을 지원하는 스토리지 볼륨에서
etcd를 실행 중인 경우, 스토리지 볼륨의 스냅샷을 생성하여 etcd 데이터를
백업한다.

### etcdctl 옵션을 사용한 스냅샷

etcdctl에서 제공하는 다양한 옵션을 사용하여 스냅샷을 만들 수도 있다. 예를 들면

```shell
ETCDCTL_API=3 etcdctl -h 
``` 

명령을 통해 etcdctl의 다양한 옵션을 나열할 수 있다. 예를 들어, 아래와 같이
엔드포인트, 인증서 등을 지정하여 스냅샷을 만들 수 있다.

```shell
ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=<trusted-ca-file> --cert=<cert-file> --key=<key-file> \
  snapshot save <backup-file-location>
```
여기서 `trusted-ca-file`, `cert-file` 그리고 `key-file`은 etcd 파드의 상세사항에서 설명을 확인할 수 있다.

## etcd 클러스터 스케일 아웃(Scaling out)

etcd 클러스터를 스케일 아웃하면 성능을 희생함으로써 가용성을 높일 수 있다.
확장하더라도 클러스터의 성능이나 기능이 향상되지는 않는다. 일반적인 규칙은 etcd
클러스터를 스케일 아웃 또는 스케일 인 하는 것을 권장하지 않는다는 것이다. etcd
클러스터에 오토 스케일링 그룹을 구성하지 말자. 공식적으로 지원하는 모든 규모의
프로덕션용 쿠버네티스 클러스터에는 항상 정적인 다섯 개의 멤버로 구성된 etcd 클러스터를 실행하는
것을 강력하게 권장한다.

더 높은 안정성이 필요한 경우 3-멤버 클러스터를 5-멤버 클러스터로 업그레이드
하는 것이 합리적인 스케일링이다. 기존 클러스터에
멤버를 추가하는 방법에 대한 정보는
[etcd 재구성 문서](https://etcd.io/docs/current/op-guide/runtime-configuration/#remove-a-member)를 참고한다.

## etcd 클러스터 복원

etcd는 [주(major).부(minor)](http://semver.org/) 버전의 etcd 프로세스에서
만들어진 스냅샷으로 복원하는 것을 지원한다. 다른 패치(patch) 버전의
etcd에서 복원하는 것도 지원한다. 복원 작업은 장애가 발생한 클러스터의
데이터를 복원하는 데 사용된다.

복원 작업을 시작하기 전에, 스냅샷 파일이 있어야 한다. 이전 백업 작업의 스냅샷
파일이나 기존 [데이터 디렉터리](https://etcd.io/docs/current/op-guide/configuration/#--data-dir)의
스냅샷 파일 중 하나가 될 수 있다.
다음은 예시이다.

```shell
ETCDCTL_API=3 etcdctl --endpoints 10.2.0.9:2379 snapshot restore snapshotdb
```
다음은 etcdctl 옵션을 사용하면서 복원하는 예시이다.
```shell
ETCDCTL_API=3 etcdctl snapshot restore --data-dir <data-dir-location> snapshotdb
```
다음은 복원 전에 변수를 먼저 환경 변수로 정의하는 또 다른 예시이다.
```shell
export ETCDCTL_API=3
etcdctl snapshot restore --data-dir <data-dir-location> snapshotdb
```

스냅샷 파일에서 클러스터를 복원하는 방법에 대한 자세한 내용은
[etcd 재해 복구 문서](https://etcd.io/docs/current/op-guide/recovery/#restoring-a-cluster)를 참고한다.

복원된 클러스터의 접속 URL이 이전 클러스터와 달라졌다면
이에 맞게 쿠버네티스 API 서버를 재구성해야한다. 이런 경우,
`--etcd-servers=$OLD_ETCD_CLUSTER` 플래그 대신에
`--etcd-servers=$NEW_ETCD_CLUSTER` 플래그를 사용하여
쿠버네티스를 재시작한다. `$NEW_ETCD_CLUSTER`와
`$OLD_ETCD_CLUSTER`를 각각 IP 주소로 대체한다. etcd 클러스터 앞에
로드 밸런서를 사용하는 경우엔 로드 밸런서의 IP 주소를 대신
사용한다.

etcd 멤버 대다수가 영구적으로 실패한 경우, etcd 클러스터는
실패한 것으로 간주한다. 이 시나리오에서는 쿠버네티스가 현재 상태를
변경할 수 없다. 이미 스케쥴링된 파드는 계속 실행될 수 있지만, 새 파드를
스케줄링할 수는 없다. 이런 경우, etcd 클러스터를 복구하고 가능하면
쿠버네티스 API 서버를 재구성하여 문제를 해결하자.

{{< note >}}
클러스터에서 API 서버가 실행 중인 경우, etcd 인스턴스 복원을
시도하면 안 된다. 그 대신, 다음 단계를 따라 etcd를 복원한다.

- *모든* API 서버 인스턴스 중지
- 모든 etcd 인스턴스의 상태 복원
- 모든 API 서버 인스턴스 재시작

또한 오래된 데이터에 의존하지 않도록 모든 컴포넌트 (예로,
`kube-scheduler`, `kube-controller-manager`, `kubelet`)를 재시작하는 것이
좋다. 실제로 복원 작업에 약간의 시간이 소요된다는 점에 유의하자. 복원하는 동안
중요한 컴포넌트는 리더 락(lock)을 잃고 자체적으로 다시 시작된다.
{{< /note >}}

## etcd 클러스터 업그레이드


etcd 업그레이드에 대한 자세한 내용은 [etcd 업그레이드](https://etcd.io/docs/latest/upgrades/) 문서를 참고한다.

{{< note >}}
업그레이드를 시작하기 전에, 먼저 etcd 클러스터를 백업하자.
{{< /note >}}

## etcd 클러스터 유지 관리

etcd 유지보수에 대한 자세한 내용은 [etcd 유지보수](https://etcd.io/docs/latest/op-guide/maintenance/) 문서를 참고한다.

{{% thirdparty-content single="true" %}}

{{< note >}}
조각 모음은 비용이 많이 드는 작업이므로 자주 실행하지 않아야 한다.
다른 한편으로, 모든 etcd 멤버가 최대 스토리지 할당량에 도달하지 않도록
하는 것도 필요하다. 쿠버네티스 프로젝트는 조각 모음을 수행할 때
[etcd-defrag](https://github.com/ahrtr/etcd-defrag)와 같은 도구를 사용하는 것을 권장한다.
{{< /note >}}
