---
# reviewers:
# - enisoc
# - erictune
# - foxish
# - janetkuo
# - kow3ns
# - smarterclayton
title: 복제 스테이트풀 애플리케이션 실행하기
content_type: tutorial
weight: 30
---

<!-- overview -->

이 페이지에서는 {{< glossary_tooltip term_id="statefulset" >}} 으로 복제
스테이트풀 애플리케이션을 실행하는 방법에 대해 소개한다.
이 애플리케이션은 복제 MySQL 데이터베이스이다. 이 예제의 토폴로지는
단일 주 서버와 여러 복제 서버로 이루어져있으며, row-based 비동기 복제 방식을
사용한다.

{{< note >}}
**해당 설정은 프로덕션 설정이 아니다**. 쿠버네티스에서 스테이트풀한 애플리케이션을 실행하기 위한 일반적인 패턴에
집중하기 위해 MySQL 세팅이 안전하지 않은 기본 설정으로 되어 있다.
{{< /note >}}

## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* {{< include "default-storage-class-prereqs.md" >}}
* 이 튜토리얼은
  [퍼시스턴트볼륨](/ko/docs/concepts/storage/persistent-volumes/)
  그리고 [스테이트풀셋](/ko/docs/concepts/workloads/controllers/statefulset/),
  [파드](/ko/docs/concepts/workloads/pods/),
  [서비스](/ko/docs/concepts/services-networking/service/),
  [컨피그맵(ConfigMap)](/docs/tasks/configure-pod-container/configure-pod-configmap/)와 같은 핵심 개념들에 대해 알고 있다고 가정한다.
* MySQL에 대한 지식이 있으면 도움이 되지만, 이 튜토리얼은 다른 시스템을 활용하였을 때도
  도움이 되는 일반적인 패턴을 다루는데 중점을 둔다.
* default 네임스페이스를 사용하거나, 다른 오브젝트들과 충돌이 나지 않는 다른 네임스페이스를 사용한다.



## {{% heading "objectives" %}}


* 스테이트풀셋을 이용한 복제 MySQL 토폴로지를 배포한다.
* MySQL 클라이언트에게 트래픽을 보낸다.
* 다운타임에 대한 저항력을 관찰한다.
* 스테이트풀셋을 확장/축소한다.



<!-- lessoncontent -->

## MySQL 배포하기

MySQL 디플로이먼트 예시는 컨피그맵과, 2개의 서비스, 그리고 스테이트풀셋으로
구성되어 있다.

### 컨피그맵 생성하기 {#configmap}

다음 YAML 설정 파일로부터 컨피그맵을 생성한다.

{{< codenew file="application/mysql/mysql-configmap.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-configmap.yaml
```

이 컨피그맵은 당신이 독립적으로 주 MySQL 서버와 레플리카들의 설정을 컨트롤할 수 있도록
`my.cnf` 을 오버라이드한다.
이 경우에는, 주 서버는 복제 로그를 레플리카들에게 제공하고
레플리카들은 복제를 통한 쓰기가 아닌 다른 쓰기들은 거부하도록 할 것이다.

컨피그맵 자체가 다른 파드들에 서로 다른 설정 영역이
적용되도록 하는 것이 아니다.
스테이트풀셋 컨트롤러가 제공해주는 정보에 따라서,
각 파드들은 초기화되면서 설정 영역을 참조할지 결정한다.

### 서비스 생성하기 {#services}

다음 YAML 설정 파일로부터 서비스를 생성한다.

{{< codenew file="application/mysql/mysql-services.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-services.yaml
```

헤드리스 서비스는 스테이트풀셋
{{< glossary_tooltip text="컨트롤러" term_id="controller" >}}가 집합의 일부분인
파드들을 위해 생성한 DNS 엔트리들(entries)의 위한 거점이 된다.
헤드리스 서비스의 이름이 `mysql`이므로, 파드들은
같은 쿠버네티스 클러스터나 네임스페이스에 존재하는 다른 파드들에게 `<pod-name>.mysql`라는 이름으로
접근될 수 있다.

`mysql-read`라고 불리우는 클라이언트 서비스는 고유의 클러스터 IP를 가지며,
Ready 상태인 모든 MySQL 파드들에게 커넥션을 분배하는 일반적인 서비스이다.
잠재적인 엔드포인트들의 집합은 주 MySQL 서버와 해당
레플리카들을 포함한다.

오직 읽기 쿼리들만 로드-밸런싱된 클라이언트 서비스를 이용할 수 있다는 사실에 주목하자.
하나의 주 MySQL 서버만이 존재하기 떄문에, 클라이언트들은 쓰기 작업을 실행하기 위해서
주 MySQL 파드에 (헤드리스 서비스 안에 존재하는 DNS 엔트리를 통해)
직접 접근해야 한다.

### 스테이트풀셋 생성하기 {#statefulset}

마지막으로, 다음 YAML 설정 파일로부터 스테이트풀셋을 생성한다.

{{< codenew file="application/mysql/mysql-statefulset.yaml" >}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-statefulset.yaml
```

다음을 실행하여, 초기화되는 프로세스들을 확인할 수 있다.

```shell
kubectl get pods -l app=mysql --watch
```

잠시 뒤에, 3개의 파드들이 `Running` 상태가 되는 것을 볼 수 있다.

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-0   2/2       Running   0          2m
mysql-1   2/2       Running   0          1m
mysql-2   2/2       Running   0          1m
```

**Ctrl+C**를 입력하여 watch를 종료하자.

{{< note >}}
만약 아무 진행 상황도 보이지 않는다면, [시작하기 전에](#before-you-begin) 에 언급된
동적 퍼시스턴트볼륨 프로비저너(provisioner)가 활성화되어 있는지 확인한다.
{{< /note >}}

해당 메니페스트에는 스테이트풀셋의 일부분인 스테이트풀 파드들을 관리하기 위한 다양한 기법들이
적용되어 있다. 다음 섹션에서는 스테트풀셋이 파드들을 생성할 때 일어나는 일들을 이해할 수 있도록
일부 기법들을 강조하여 설명한다.

## 스테이트풀 파드 초기화 이해하기

스테이트풀셋 컨트롤러는 파드들의 인덱스에 따라
순차적으로 시작시킨다.
컨트롤러는 다음 파드 생성 이전에 각 파드가 Ready 상태가 되었다고 알려줄 때까지 기다린다.

추가적으로, 컨트롤러는 각 파드들에게 `<스테이트풀셋 이름>-<순차적 인덱스>` 형태의
고유하고 안정적인 이름을 부여하는데, 결과적으로 파드들은 `mysql-0`, `mysql-1`,
그리고 `mysql-2` 라는 이름을 가지게 된다.

스테이트풀셋 매니페스트의 파드 템플릿은 해당 속성들을 통해
순차적인 MySQL 복제의 시작을 수행한다.

### 설정 생성하기

파드 스펙의 컨테이너를 시작하기 전에, 파드는 순서가 정의되어 있는
[초기화 컨테이너](/ko/docs/concepts/workloads/pods/init-containers/)들을
먼저 실행시킨다.

`init-mysql`라는 이름의 첫 번째 초기화 컨테이너는, 인덱스에 따라
특별한 MySQL 설정 파일을 생성한다.

스크립트는 인덱스를 `hostname` 명령으로 반환되는 파드 이름의
마지막 부분에서 추출하여 결정한다.
그리고 인덱스(이미 사용된 값들을 피하기 위한 오프셋 숫자와 함께)를
MySQL의 `conf.d` 디렉토리의 `server-id.cnf` 파일에 저장한다.
이는 스테이트풀셋에게서 제공된 고유하고, 안정적인 신원을 같은 속성을
필요로 하는 MySQL 서버 ID의 형태로 바꾸어준다.

또한 `init-mysql` 컨테이너의 스크립트는 컨피그맵을 `conf.d`로 복사하여,
`primary.cnf` 또는 `replica.cnf`을 적용한다.
이 예제의 토폴로지가 하나의 주 MySQL 서버와 일정 수의 레플리카들로 이루어져 있기 때문에,
스크립트는 `0` 인덱스를 주 서버로, 그리고 나머지 값들은
레플리카로 지정한다.
스테이트풀셋 컨트롤러의
[디플로이먼트와 스케일링 보증](/ko/docs/concepts/workloads/controllers/statefulset/#디플로이먼트와-스케일링-보증)과
합쳐지면, 복제를 위한 레플리카들을 생성하기 전에 주 MySQL 서버가 Ready 상태가 되도록
보장할 수 있다.

### 기존 데이터 복제(cloning)

일반적으로, 레플리카에 새로운 파드가 추가되는 경우, 주 MySQL 서버가
이미 데이터를 가지고 있다고 가정해야 한다. 또한 복제 로그가 첫 시작점부터의 로그들을
다 가지고 있지는 않을 수 있다고 가정해야 한다.
이러한 보수적인 가정들은 스테이트풀셋이 초기 크기로 고정되어 있는 것보다, 시간에 따라
확장/축소하게 할 수 있도록 하는 중요한 열쇠가 된다.

`clone-mysql`라는 이름의 두 번째 초기화 컨테이너는, 퍼시스턴트볼륨에서 처음 초기화된
레플리카 파드에 복제 작업을 수행한다.
이 말은 다른 실행 중인 파드로부터 모든 데이터들을 복제하기 때문에,
로컬의 상태가 충분히 일관성을 유지하고 있어서 주 서버에서부터 복제를 시작할 수 있다는 의미이다.

MySQL 자체가 이러한 메커니즘을 제공해주지는 않기 때문에, 이 예제에서는 XtraBackup이라는
유명한 오픈소스 도구를 사용한다.
복제 중에는, 복제 대상 MySQL 서버가 성능 저하를 겪을 수 있다.
주 MySQL 서버의 이러한 충격을 최소화하기 위해, 스크립트는 각 파드가 자신의 인덱스보다
하나 작은 파드로부터 복제하도록 지시한다.
이것이 정상적으로 동작하는 이유는 스테이트풀셋 컨트롤러가 파드 `N+1`을 실행하기 전에
항상 파드 `N`이 Ready 상태라는 것을 보장하기 때문이다.

### 복제(replication) 시작하기

초기화 컨테이너들의 성공적으로 완료되면, 일반적인 컨테이너가 실행된다.
MySQL 파드는 `mysqld` 서버를 구동하는 `mysql` 컨테이너로 구성되어 있으며,
`xtrabackup` 컨테이너는
[사이드카(sidecar)](/blog/2015/06/the-distributed-system-toolkit-patterns)로서 작동한다.

`xtrabackup` 사이드카는 복제된 데이터 파일들을 보고 레플리카에 MySQL 복제를 시작해야 할
필요가 있는지 결정한다.
만약 그렇다면, `mysqld`이 준비될 때까지 기다린 후 `CHANGE MASTER TO`,
그리고 `START SLAVE`를 XtraBackup 복제(clone) 파일들에서
추출한 복제(replication) 파라미터들과 함께 실행시킨다.

레플리카가 복제를 시작하면, 먼저 주 MySQL 서버를 기억하고, 서버가 재시작되거나
커넥션이 끊어지면 다시 연결한다.
또한 레플리카들은 주 서버를 안정된 DNS 이름
(`mysql-0.mysql`)으로 찾기 때문에, 주 서버가 리스케쥴링에 의해 새로운
파드 IP를 받아도 주 서버를 자동으로 찾는다.

마지막으로, 복제를 시작한 후에는, `xtrabackup` 컨테이너는 데이터 복제를 요청하는
다른 파드들의 커넥션을 리스닝한다.
이 서버는 스테이트풀셋이 확장하거나, 다음 파드가 퍼시스턴트볼륨클레임을 잃어서 다시 복제를
수행해햐 할 경우를 대비하여 독립적으로 존재해야 한다.

## 클라이언트 트래픽 보내기

임시 컨테이너를 `mysql:5.7` 이미지로 실행하고 `mysql` 클라이언트
바이너리를 실행하는 것으로 테스트 쿼리를 주 MySQL 서버(`mysql-0.mysql` 호스트네임)로
보낼 수 있다.

```shell
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --\
  mysql -h mysql-0.mysql <<EOF
CREATE DATABASE test;
CREATE TABLE test.messages (message VARCHAR(250));
INSERT INTO test.messages VALUES ('hello');
EOF
```

`mysql-read` 호스트네임을 사용하여 Ready 상태가 되었다고 보고하는 어느 서버에나 시험 쿼리를
보낼 수 있다.

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-read -e "SELECT * FROM test.messages"
```

그러면 다음과 같은 출력를 얻을 것이다.

```
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

`mysql-read` 서비스가 커넥션을 서버들에게 분배하고 있다는 사실을 확인하기 위해서,
`SELECT @@server_id`를 루프로 돌릴 수 있다.

```shell
kubectl run mysql-client-loop --image=mysql:5.7 -i -t --rm --restart=Never --\
  bash -ic "while sleep 1; do mysql -h mysql-read -e 'SELECT @@server_id,NOW()'; done"
```

보고된 `@@server_id`가 무작위로 바뀌는 것을 알 수 있다. 왜냐하면 매 커넥션 시도마다
다른 엔드포인트가 선택될 수 있기 때문이다.

```
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         100 | 2006-01-02 15:04:05 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         102 | 2006-01-02 15:04:06 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         101 | 2006-01-02 15:04:07 |
+-------------+---------------------+
```

루프를 끝내고 싶다면 **Ctrl+C**를 입력하면 되지만, 다음 단계에서의 영향을 보기 위해서
다른 창에 계속 실행시켜 놓는 것이 좋다.

## 노드와 파드 실패 시뮬레이션하기 {#simulate-pod-and-node-downtime}

단일 서버 대비 레플리카들의 풀에 의한 읽기의 가용성 향상을
시연하기 위해, 파드를 Ready 상태로 강제하면서 `SELECT @@server_id`
루프를 돌리자.

### 준비성 프로브 고장내기

`mysql` 컨테이너의 [준비성 프로브](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes)는
쿼리를 실행할 수 있는지를 확인하기 위해 `mysql -h 127.0.0.1 -e 'SELECT 1'`
명령을 실행한다.

준비성 프로브를 강제로 실패시키는 방법은 해당 명령을 고장내는 것이다.

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql /usr/bin/mysql.off
```

이것은 `mysql-2` 파드의 실제 컨테이너의 파일시스템에 접근해서 `mysql` 명령의 이름을 변경하여,
준비성 프로브가 찾을 수 없도록 한다.
몇 초 뒤에, 파드는 컨터이너 중 하나가 준비되지 않았다고 보고할 것이다.
다음 명령을 실행시켜서 확인할 수 있다.

```shell
kubectl get pod mysql-2
```

`READY` 항목의 `1/2`를 확인하자.

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-2   1/2       Running   0          3m
```

이 시점에서, `102`를 보고하지 않지만, 계속해서 `SELECT @@server_id` 루프가 실행되는 것을
확인할 수 있을 것이다.
`init-mysql` 스크립트에서 `server-id`를 `100 + $ordinal`로 정의했기 때문에,
서버 ID `102`는 `mysql-2` 파드에 대응된다는 사실을 상기하자.

이제 파드를 고치면 몇 초 뒤에 루프 출력에
나타날 것이다.

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql.off /usr/bin/mysql
```

### 파드 삭제하기

레플리카셋이 스테이트리스 파드들에게 하는 것처럼, 스테이트풀셋 또한 파드들이 삭제되면 파드들을
다시 생성한다.

```shell
kubectl delete pod mysql-2
```

스테이트풀셋 컨트롤러는 `mysql-2` 파드가 존재하지 않는 것을 인지하고,
같은 이름으로 새로운 파드를 생성하고 같은
퍼시스턴트볼륨클레임에 연결한다.
잠시동안 서버 ID `102`가 루프 출력에서 사라지고 다시 나타나는 것을
확인할 수 있을 것이다.

### 노드 드레인하기

만약 당신의 쿠버네티스 클러스터가 여러 노드들을 가지고 있으면,
[드레인](/docs/reference/generated/kubectl/kubectl-commands/#drain)을 사용하여
노드 다운타임을 시뮬레이션할 수 있다.

먼저 MySQL 파드가 존재하고 있는 노드를 확인하자.

```shell
kubectl get pod mysql-2 -o wide
```

노드 이름은 마지막 열에서 나타날 것이다.

```
NAME      READY     STATUS    RESTARTS   AGE       IP            NODE
mysql-2   2/2       Running   0          15m       10.244.5.27   kubernetes-node-9l2t
```

그 후에, 다음 명령을 실행하여 노드를 드레인한다.
그러면 새로운 파드가 스케줄되지 않게 방지하고(cordon), 기존의 파드들을 추방(evict)한다.
`<node-name>`를 이전 단계에서 찾았던 노드의 이름으로 바꾸자.

{{< caution >}}
노드 드레인은 해당 노드에서 실행 중인 다른 워크로드와 애플리케이션들에게
영향을 줄 수 있다. 테스트 클러스터에만
다음 단계를 수행하자.
{{< /caution >}}

```shell
# 위에 명시된 다른 워크로드들이 받는 영향에 대한 주의사항을 확인한다.
kubectl drain <node-name> --force --delete-emptydir-data --ignore-daemonsets
```

이제 파드가 다른 노드에 리스케줄링되는 것을 관찰할 수 있다.

```shell
kubectl get pod mysql-2 -o wide --watch
```

출력은 다음과 비슷할 것이다.

```
NAME      READY   STATUS          RESTARTS   AGE       IP            NODE
mysql-2   2/2     Terminating     0          15m       10.244.1.56   kubernetes-node-9l2t
[...]
mysql-2   0/2     Pending         0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:0/2        0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:1/2        0          20s       10.244.5.32   kubernetes-node-fjlm
mysql-2   0/2     PodInitializing 0          21s       10.244.5.32   kubernetes-node-fjlm
mysql-2   1/2     Running         0          22s       10.244.5.32   kubernetes-node-fjlm
mysql-2   2/2     Running         0          30s       10.244.5.32   kubernetes-node-fjlm
```

그리고, 서버 ID `102`가 `SELECT @@server_id` 루프 출력에서 잠시
사라진 후 다시 보이는 것을 확인할 수 있을 것이다.

이제 노드의 스케줄 방지를 다시 해제(uncordon)해서 정상으로 돌아가도록 조치한다.

```shell
kubectl uncordon <node-name>
```

## 레플리카 스케일링하기

MySQL 레플리케이션을 사용하면, 레플리카를 추가하는 것으로
읽기 쿼리 용량을 키울 수 있다.
스테이트풀셋을 사용하면, 단 한 줄의 명령으로 달성할 수 있다.

```shell
kubectl scale statefulset mysql  --replicas=5
```

명령을 실행시켜서 새로운 파드들이 올라오는 것을 관찰하자.

```shell
kubectl get pods -l app=mysql --watch
```

파드들이 올라오면, `SELECT @@server_id` 루프 출력에 서버 ID `103` 과 `104`가 나타나기
시작할 것이다.

그리고 해당 파드들이 존재하기 전에 추가된 데이터들이 해당 새 서버들에게도 존재하는 것을
확인할 수 있다.

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-3.mysql -e "SELECT * FROM test.messages"
```

```
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

축소하는 것도 간단하게 할 수 있다.

```shell
kubectl scale statefulset mysql --replicas=3
```

{{< note >}}
확장은 퍼시스턴트볼륨클레임을 자동으로 생성하지만,
축소에서는 해당 PVC들이 자동으로 삭제되지 않는다.

이로써 확장을 빠르게 하기 위해 초기화된 PVC들을 보관해 두거나,
삭제하기 전에 데이터를 추출하는 선택을 할 수 있다.
{{< /note >}}

다음 명령을 실행하여 확인할 수 있다.

```shell
kubectl get pvc -l app=mysql
```

스테이트풀셋을 3으로 축소했음에도 PVC 5개가
아직 남아있음을 보여준다.

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
data-mysql-0   Bound     pvc-8acbf5dc-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-1   Bound     pvc-8ad39820-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-2   Bound     pvc-8ad69a6d-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-3   Bound     pvc-50043c45-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
data-mysql-4   Bound     pvc-500a9957-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
```

만약 여분의 PVC들을 재사용하지 않을 것이라면, 이들을 삭제할 수 있다.

```shell
kubectl delete pvc data-mysql-3
kubectl delete pvc data-mysql-4
```



## {{% heading "cleanup" %}}


1. `SELECT @@server_id` 루프를 끝내기 위해, 터미널에 **Ctrl+C**를 입력하거나,
    해당 명령을 다른 터미널에서 실행시키자.

   ```shell
   kubectl delete pod mysql-client-loop --now
   ```

1. 스테이트풀셋을 삭제한다. 이것은 파드들 또한 삭제할 것이다.

   ```shell
   kubectl delete statefulset mysql
   ```

1. 파드들의 삭제를 확인한다.
   삭제가 완료되기까지 시간이 걸릴 수 있다.

   ```shell
   kubectl get pods -l app=mysql
   ```

   위와 같은 메세지가 나타나면 파드들이 삭제되었다는 것을 알 수 있다.

   ```
   No resources found.
   ```

1. 컨피그맵, 서비스, 그리고 퍼시스턴트볼륨클레임들을 삭제한다.

   ```shell
   kubectl delete configmap,service,pvc -l app=mysql
   ```

1. 만약 수동으로 퍼시스턴스볼륨들을 프로비저닝했다면, 수동으로 삭제하면서,
   그 밑에 존재하는 리소스들을 또한 삭제해야 한다.
   만약 동적 프로비저너를 사용했다면, 당신이 퍼시스턴트볼륨클레임으로 삭제하면
   자동으로 퍼시스턴트볼륨을 삭제한다.
   일부 (EBS나 PD와 같은) 동적 프로비저너들은 퍼시스턴트볼륨을 삭제
   하면 그 뒤에 존재하는 리소스들도 삭제한다.



## {{% heading "whatsnext" %}}

* [스테이트풀셋(StatefulSet) 확장하기](/ko/docs/tasks/run-application/scale-stateful-set/)에 대해 더 배워보기.
* [스테이트풀셋 디버깅하기](/ko/docs/tasks/debug/debug-application/debug-statefulset/)에 대해 더 배워보기.
* [스테이트풀셋(StatefulSet) 삭제하기](/ko/docs/tasks/run-application/delete-stateful-set/)에 대해 더 배워보기.
* [스테이트풀셋(StatefulSet) 파드 강제 삭제하기](/ko/docs/tasks/run-application/force-delete-stateful-set-pod/)에 대해 더 배워보기.
* [Helm Charts 저장소](https://artifacthub.io/)를 통해
  다른 스테이트풀 애플리케이션 예제들을 확인해보기.
