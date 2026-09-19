---
# reviewers:
# - hasheddan
# - pjbgf
# - saschagrunert
title: seccomp를 사용하여 컨테이너의 시스템 콜(syscall) 제한
content_type: tutorial
weight: 40
min-kubernetes-server-version: v1.22
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

Seccomp는 secure computing mode의 약자로, 리눅스 커널 2.6.12 버전부터 제공되는 기능이다.
이 기능을 사용하면 프로세스의 권한을 샌드박스로 격리해서, 유저스페이스(userspace)에서
커널로 실행할 수 있는 호출을 제한할 수 있다. 쿠버네티스를 사용하면
{{< glossary_tooltip text="노드" term_id="node" >}}에 로드된 seccomp 프로파일을
파드와 컨테이너에 자동으로 적용할 수 있다.

워크로드에 필요한 권한을 식별하기란 어려울 수 있다. 이 튜토리얼에서는 로컬
쿠버네티스 클러스터에 seccomp 프로파일을 로드하는 방법과, 이를 파드에 적용하는
방법, 그리고 컨테이너 프로세스에 필요한 권한만 부여하는 프로파일 작성
방법을 살펴본다.

## {{% heading "objectives" %}}

* 노드에 seccomp 프로파일을 로드하는 방법을 배운다.
* 컨테이너에 seccomp 프로파일을 적용하는 방법을 배운다.
* 컨테이너 프로세스가 만드는 시스템 콜의 감사(auditing)를 관찰한다.
* 존재하지 않는 프로파일을 지정했을 때의 동작을 관찰한다.
* seccomp 프로파일 위반을 관찰한다.
* 세분화된 seccomp 프로파일을 작성하는 방법을 배운다.
* 컨테이너 런타임의 기본 seccomp 프로파일을 적용하는 방법을 배운다.

## {{% heading "prerequisites" %}}

이 튜토리얼의 모든 단계를 완료하려면 [kind](/docs/tasks/tools/#kind)와
[kubectl](/docs/tasks/tools/#kubectl)을 설치해야 한다.

이 튜토리얼에서 사용하는 명령어는 컨테이너 런타임으로 [도커](https://www.docker.com/)를
사용한다고 가정한다. (`kind`가 생성하는 클러스터는 내부적으로 다른 컨테이너
런타임을 사용할 수도 있다). [Podman](https://podman.io/)을 사용할 수도 있지만,
이 경우에는 작업을 성공적으로 완료하기 위해 특정
[지침](https://kind.sigs.k8s.io/docs/user/rootless/)를 따라야
한다.

이 튜토리얼은 아직 베타(v1.25부터)인 일부 예시와, 일반적으로 사용
가능한(GA) seccomp 기능만 사용하는 다른 예시를 함께 보여준다. 사용 중인
버전에 맞게 클러스터가
[올바르게 구성](https://kind.sigs.k8s.io/docs/user/quick-start/#setting-kubernetes-version)되어
있는지 확인해야 한다.

이 튜토리얼은 또한 예시를 컴퓨터에 다운로드하기 위해 `curl` 도구를 사용한다.
원한다면 다른 도구를 사용하도록 단계를 조정해도 된다.

{{< note >}}
컨테이너의 `securityContext`에 `privileged: true`가 설정되어 실행
중인 컨테이너에는 seccomp 프로파일을 적용할 수 없다. 특권을 가진(privileged)
컨테이너는 항상 `Unconfined`로 실행된다.
{{< /note >}}

<!-- steps -->

## 예시 seccomp 프로파일 다운로드 {#download-profiles}

이 프로파일들의 내용은 나중에 살펴볼 것이다. 우선은 클러스터에 적재할 수
있도록 `profiles/`라는 이름의 디렉터리에
다운로드한다.

{{< tabs name="tab_with_code" >}}
{{< tab name="audit.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/audit.json" %}}
{{< /tab >}}
{{< tab name="violation.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/violation.json" %}}
{{< /tab >}}
{{< tab name="fine-grained.json" >}}
{{% code_sample file="pods/security/seccomp/profiles/fine-grained.json" %}}
{{< /tab >}}
{{< /tabs >}}

다음 명령어를 실행한다.

```shell
mkdir ./profiles
curl -L -o profiles/audit.json https://k8s.io/examples/pods/security/seccomp/profiles/audit.json
curl -L -o profiles/violation.json https://k8s.io/examples/pods/security/seccomp/profiles/violation.json
curl -L -o profiles/fine-grained.json https://k8s.io/examples/pods/security/seccomp/profiles/fine-grained.json
ls profiles
```

마지막 단계가 끝나면 세 개의 프로파일이 나열되는 것을 볼 수 있다.
```
audit.json  fine-grained.json  violation.json
```

## kind로 로컬 쿠버네티스 클러스터 생성

간단하게, [kind](https://kind.sigs.k8s.io/)를 사용하면 seccomp 프로파일이 적재된
단일 노드 클러스터를 생성할 수 있다. kind는 도커에서 쿠버네티스를 실행하므로,
클러스터의 각 노드는 컨테이너이다. 따라서 노드에 파일을 적재하는 것과
유사하게, 각 컨테이너의 파일시스템에 파일을
마운트할 수 있다.

{{% code_sample file="pods/security/seccomp/kind.yaml" %}}

예시 kind 구성을 다운로드해서 `kind.yaml`이라는 이름의 파일로 저장한다.
```shell
curl -L -O https://k8s.io/examples/pods/security/seccomp/kind.yaml
```

노드의 컨테이너 이미지를 설정해서 특정 쿠버네티스 버전을 지정할 수 있다.
자세한 내용은 kind 문서의 구성에 대한
[노드](https://kind.sigs.k8s.io/docs/user/configuration/#nodes) 부분을 참고한다.
이 튜토리얼은 쿠버네티스 {{< param "version" >}}을 사용한다고 가정한다.

베타 기능으로, `Unconfined`로 대체되는 대신
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}이
기본으로 선호하는 프로파일을 사용하도록 쿠버네티스를 구성할 수 있다.
이를 시도해보고 싶다면, 계속 진행하기 전에
[모든 워크로드에 기본 seccomp 프로파일로 `RuntimeDefault` 사용 활성화](#모든-워크로드에-기본-seccomp-프로파일로-runtimedefault-사용-활성화)를
참고한다.

kind 구성이 준비되었으면, 해당 구성으로 kind 클러스터를
생성한다.

```shell
kind create cluster --config=kind.yaml
```

새 쿠버네티스 클러스터가 준비되면, 단일 노드 클러스터로 실행 중인 도커
컨테이너를 확인한다.

```shell
docker ps
```

`kind-control-plane`이라는 이름으로 컨테이너가 실행 중임을 나타내는 출력을
볼 수 있다. 출력 결과는 다음과 비슷하다.

```
CONTAINER ID        IMAGE                  COMMAND                  CREATED             STATUS              PORTS                       NAMES
6a96207fed4b        kindest/node:v1.18.2   "/usr/local/bin/entr…"   27 seconds ago      Up 24 seconds       127.0.0.1:42223->6443/tcp   kind-control-plane
```

해당 컨테이너의 파일시스템을 살펴보면, `profiles/` 디렉터리가 kubelet의
기본 seccomp 경로에 성공적으로 적재된 것을 확인할 수 있다. `docker exec`를
사용해서 파드에서 명령어를 실행한다.

```shell
docker exec -it kind-control-plane ls /var/lib/kubelet/seccomp/profiles
```

```
audit.json  fine-grained.json  violation.json
```

이제 kind 내에서 실행 중인 kubelet에서 이 seccomp 프로파일들을 사용할 수
있음을 확인했다.

## 컨테이너 런타임의 기본 seccomp 프로파일을 사용하는 파드 생성

대부분의 컨테이너 런타임은 허용되거나 허용되지 않는 시스템 콜에 대해 합리적인
기본 구성을 제공한다. 파드나 컨테이너의 시큐리티 컨텍스트에서 seccomp
유형을 `RuntimeDefault`로 설정하면 워크로드에 이 기본값을 적용할 수 있다.

{{< note >}}
`seccompDefault` [구성](/docs/reference/config-api/kubelet-config.v1beta1/)이
활성화되어 있으면, 다른 seccomp 프로파일이 지정되지 않았을 때 파드는
`RuntimeDefault` seccomp 프로파일을 사용한다. 그렇지 않으면 기본값은 `Unconfined`이다.
{{< /note >}}

다음은 모든 컨테이너에 대해 `RuntimeDefault` seccomp 프로파일을 요청하는
파드의 매니페스트이다.

{{% code_sample file="pods/security/seccomp/ga/default-pod.yaml" %}}

해당 파드를 생성한다.
```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/default-pod.yaml
```

```shell
kubectl get pod default-pod
```

파드가 성공적으로 시작된 것으로 표시될 것이다.
```
NAME        READY   STATUS    RESTARTS   AGE
default-pod 1/1     Running   0          20s
```

다음 섹션으로 넘어가기 전에 파드를 삭제한다.

```shell
kubectl delete pod default-pod --wait --now
```

## 시스템 콜 감사(auditing)를 위한 seccomp 프로파일을 사용하는 파드 생성

우선, 프로세스의 모든 시스템 콜을 기록하는 `audit.json` 프로파일을 새
파드에 적용한다.

다음은 해당 파드의 매니페스트이다.

{{% code_sample file="pods/security/seccomp/ga/audit-pod.yaml" %}}

{{< note >}}
이전 버전의 쿠버네티스에서는
{{< glossary_tooltip text="어노테이션" term_id="annotation" >}}을 사용해서 seccomp
동작을 구성할 수 있었다. 쿠버네티스 {{< skew currentVersion >}}는 seccomp를
구성하기 위해 `.spec.securityContext` 내의 필드를 사용하는 것만 지원하며, 이
튜토리얼에서는 이 방식을 설명한다.
{{< /note >}}

클러스터에 파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/audit-pod.yaml
```

이 프로파일은 어떠한 시스템 콜도 제한하지 않으므로, 파드는 성공적으로
시작될 것이다.

```shell
kubectl get pod audit-pod
```

```
NAME        READY   STATUS    RESTARTS   AGE
audit-pod   1/1     Running   0          30s
```

이 컨테이너가 노출하는 엔드포인트와 상호작용할 수 있도록, kind 컨트롤
플레인 컨테이너 내부에서 해당 엔드포인트에 접근할 수 있게 해주는 NodePort
{{< glossary_tooltip text="서비스" term_id="service" >}}를 생성한다.

```shell
kubectl expose pod audit-pod --type NodePort --port 5678
```

서비스가 노드에서 할당받은 포트를 확인한다.

```shell
kubectl get service audit-pod
```

출력 결과는 다음과 비슷하다.
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
audit-pod   NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

이제 이 서비스가 노출한 포트로, kind 컨트롤 플레인 컨테이너 내부에서
`curl`을 사용해서 해당 엔드포인트에 접근할 수 있다. 해당 컨트롤 플레인
컨테이너에 속한 컨테이너 내에서 `curl` 명령어를 실행하려면 `docker exec`를 사용한다.

```shell
# 32373을 "kubectl get service audit-pod"에서 확인한 포트 번호로 변경한다.
docker exec -it kind-control-plane curl localhost:32373
```

```
just made some syscalls!
```

프로세스가 실행 중인 것은 확인했지만, 실제로 어떤 시스템 콜을 만들었을까?
이 파드는 로컬 클러스터에서 실행되고 있으므로, 로컬 시스템의
`/var/log/syslog`에서 이를 확인할 수 있다. 새 터미널 창을 열고 `http-echo`가
호출한 내용에 대한 출력을 `tail`한다.

```shell
# 컴퓨터의 로그 경로는 "/var/log/syslog"와 다를 수 있다.
tail -f /var/log/syslog | grep 'http-echo'
```

이미 `http-echo`가 만든 시스템 콜의 로그 일부를 볼 수 있을 것이며, 컨트롤 플레인
컨테이너 내부에서 `curl`을 다시 실행하면 로그에 더 많은 출력이 기록되는 것을 볼 수 있다.

예를 들면 다음과 같다.
```
Jul  6 15:37:40 my-machine kernel: [369128.669452] audit: type=1326 audit(1594067860.484:14536): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=51 compat=0 ip=0x46fe1f code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669453] audit: type=1326 audit(1594067860.484:14537): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=54 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669455] audit: type=1326 audit(1594067860.484:14538): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669456] audit: type=1326 audit(1594067860.484:14539): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=288 compat=0 ip=0x46fdba code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669517] audit: type=1326 audit(1594067860.484:14540): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=0 compat=0 ip=0x46fd44 code=0x7ffc0000
Jul  6 15:37:40 my-machine kernel: [369128.669519] audit: type=1326 audit(1594067860.484:14541): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671648] audit: type=1326 audit(1594067920.488:14559): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=270 compat=0 ip=0x4559b1 code=0x7ffc0000
Jul  6 15:38:40 my-machine kernel: [369188.671726] audit: type=1326 audit(1594067920.488:14560): auid=4294967295 uid=0 gid=0 ses=4294967295 pid=29064 comm="http-echo" exe="/http-echo" sig=0 arch=c000003e syscall=202 compat=0 ip=0x455e53 code=0x7ffc0000
```

각 줄의 `syscall=` 항목을 살펴보면 `http-echo` 프로세스에 필요한 시스템
콜을 파악하기 시작할 수 있다. 이 목록이 프로세스가 사용하는 모든 시스템
콜을 포함하지는 않겠지만, 이 컨테이너를 위한 seccomp 프로파일의
기초로 사용할 수 있다.

다음 섹션으로 넘어가기 전에 서비스와 파드를 삭제한다.

```shell
kubectl delete service audit-pod --wait
kubectl delete pod audit-pod --wait --now
```

## 위반을 발생시키는 seccomp 프로파일을 사용하는 파드 생성

시연을 위해, 어떠한 시스템 콜도 허용하지 않는 프로파일을 파드에
적용한다.

이 시연을 위한 매니페스트는 다음과 같다.

{{% code_sample file="pods/security/seccomp/ga/violation-pod.yaml" %}}

클러스터에 파드 생성을 시도한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/violation-pod.yaml
```

파드는 생성되지만 문제가 발생한다.
파드의 상태를 확인해보면 시작에 실패한 것을 볼 수 있다.

```shell
kubectl get pod violation-pod
```

```
NAME            READY   STATUS             RESTARTS   AGE
violation-pod   0/1     CrashLoopBackOff   1          6s
```

이전 예시에서 봤듯이, `http-echo` 프로세스는 상당히 많은 시스템 콜이
필요하다. 여기서는 `"defaultAction": "SCMP_ACT_ERRNO"`를 설정해서 어떤
시스템 콜에도 오류를 발생시키도록 seccomp에 지시했다. 이는 매우
안전하지만, 의미 있는 작업을 수행할 수 있는 능력을 없애버린다. 실제로
원하는 것은 워크로드에 필요한 권한만 부여하는 것이다.

다음 섹션으로 넘어가기 전에 파드를 삭제한다.

```shell
kubectl delete pod violation-pod --wait --now
```

## 필요한 시스템 콜만 허용하는 seccomp 프로파일을 사용하는 파드 생성

`fine-grained.json` 프로파일을 살펴보면, `"defaultAction":
"SCMP_ACT_LOG"`로 설정했던 첫 번째 예시의 syslog에서 봤던 시스템 콜
중 일부를 확인할 수 있다. 이번 프로파일은 `"defaultAction": "SCMP_ACT_ERRNO"`로
설정하지만, `"action": "SCMP_ACT_ALLOW"` 블록에서 일련의 시스템 콜을
명시적으로 허용한다. 이상적으로는 컨테이너가 성공적으로 실행되고
`syslog`로 전송되는 메시지가 없을 것이다.

이 예시를 위한 매니페스트는 다음과 같다.

{{% code_sample file="pods/security/seccomp/ga/fine-pod.yaml" %}}

클러스터에 파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/security/seccomp/ga/fine-pod.yaml
```

```shell
kubectl get pod fine-pod
```

파드가 성공적으로 시작된 것으로 표시될 것이다.
```
NAME        READY   STATUS    RESTARTS   AGE
fine-pod   1/1     Running   0          30s
```

새 터미널 창을 열고 `http-echo`의 호출을 언급하는 로그 항목을
모니터링하기 위해 `tail`을 사용한다.

```shell
# 컴퓨터의 로그 경로는 "/var/log/syslog"와 다를 수 있다.
tail -f /var/log/syslog | grep 'http-echo'
```

다음으로, NodePort 서비스로 파드를 노출한다.

```shell
kubectl expose pod fine-pod --type NodePort --port 5678
```

서비스가 노드에서 할당받은 포트를 확인한다.

```shell
kubectl get service fine-pod
```

출력 결과는 다음과 비슷하다.
```
NAME        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
fine-pod    NodePort   10.111.36.142   <none>        5678:32373/TCP   72s
```

kind 컨트롤 플레인 컨테이너 내부에서 `curl`을 사용해서 해당 엔드포인트에 접근한다.

```shell
# 32373을 "kubectl get service fine-pod"에서 확인한 포트 번호로 변경한다.
docker exec -it kind-control-plane curl localhost:32373
```

```
just made some syscalls!
```

`syslog`에 출력이 없는 것을 확인할 수 있다. 이는 프로파일이 필요한 모든
시스템 콜을 허용하고, 목록에 없는 시스템 콜이 호출되면 오류가 발생하도록
지정했기 때문이다. 이는 보안 관점에서는 이상적인 상황이지만, 프로그램을
분석하는 데 어느 정도의 노력이 필요했다. 이러한 노력을 크게 들이지
않고도 이 수준의 보안에 가깝게 도달할 수 있는 간단한 방법이 있다면 좋을 것이다.

다음 섹션으로 넘어가기 전에 서비스와 파드를 삭제한다.

```shell
kubectl delete service fine-pod --wait
kubectl delete pod fine-pod --wait --now
```

## 모든 워크로드에 기본 seccomp 프로파일로 `RuntimeDefault` 사용 활성화

{{< feature-state state="stable" for_k8s_version="v1.27" >}}

seccomp 프로파일 기본값 지정 기능을 사용하려면, 이를 사용하려는 각
노드에서 `--seccomp-default`
[커맨드라인 플래그](/docs/reference/command-line-tools-reference/kubelet)를
활성화한 상태로 kubelet을 실행해야 한다.

활성화하면, kubelet은 `Unconfined`(seccomp 비활성화) 모드를 사용하는 대신
컨테이너 런타임이 정의하는 `RuntimeDefault` seccomp 프로파일을 기본으로
사용한다. 기본 프로파일은 워크로드의 기능을 유지하면서 강력한 보안
기본값 집합을 제공하는 것을 목표로 한다. 예를 들어 CRI-O와 containerd를
비교해보면 알 수 있듯이, 기본 프로파일은 컨테이너 런타임과 해당 릴리스
버전에 따라 다를 수 있다.

{{< note >}}
이 기능을 활성화해도 쿠버네티스
`securityContext.seccompProfile` API 필드가 변경되거나 워크로드에 사용
중단된 어노테이션이 추가되지 않는다. 이를 통해 사용자는 워크로드 구성을
실제로 변경하지 않고도 언제든지 롤백할 수 있다. 컨테이너가 사용 중인
seccomp 프로파일을 확인하려면
[`crictl inspect`](https://github.com/kubernetes-sigs/cri-tools)와 같은 도구를 사용할 수 있다.
{{< /note >}}

일부 워크로드는 다른 워크로드보다 더 적은 수준의 시스템 콜 제한을
필요로 할 수 있다. 즉, `RuntimeDefault` 프로파일을 사용하더라도 런타임
중에 실패할 수 있다는 의미이다. 이러한 실패를 완화하려면 다음과 같이 할 수 있다.

- 워크로드를 명시적으로 `Unconfined`로 실행한다.
- 해당 노드에서 `SeccompDefault` 기능을 비활성화한다. 이때 워크로드가 이 기능이
  비활성화된 노드에 스케줄되도록 해야 한다.
- 워크로드를 위한 사용자 정의 seccomp 프로파일을 생성한다.

운영 환경과 유사한 클러스터에 이 기능을 도입하는 경우, 쿠버네티스
프로젝트는 노드의 일부에만 이 기능 게이트를 활성화하고 워크로드 실행을
테스트한 다음, 클러스터 전체에 변경 사항을 적용할 것을 권장한다.

가능한 업그레이드 및 다운그레이드 전략에 대한 자세한 내용은 관련
쿠버네티스 개선 제안(KEP)인
[기본적으로 seccomp 활성화하기](https://github.com/kubernetes/enhancements/tree/9a124fd29d1f9ddf2ff455c49a630e3181992c25/keps/sig-node/2413-seccomp-by-default#upgrade--downgrade-strategy)에서 확인할 수 있다.

쿠버네티스 {{< skew currentVersion >}}에서는 파드의 스펙에 특정 seccomp
프로파일이 정의되어 있지 않을 때 적용되는 seccomp 프로파일을 구성할 수
있다. 다만 이 기본값 지정 기능을 사용하려는 각 노드에서는 여전히
이를 활성화해야 한다.

쿠버네티스 {{< skew currentVersion >}} 클러스터를 실행 중이고 이 기능을
활성화하고 싶다면, `--seccomp-default` 커맨드라인 플래그로 kubelet을
실행하거나 [kubelet 구성 파일](/docs/tasks/administer-cluster/kubelet-config-file/)을
통해 활성화한다. [kind](https://kind.sigs.k8s.io)에서 기능 게이트를
활성화하려면, `kind`가 최소 요구 쿠버네티스 버전을 제공하는지 확인하고
[kind 구성](https://kind.sigs.k8s.io/docs/user/quick-start/#enable-feature-gates-in-your-cluster)에서
`SeccompDefault` 기능을 활성화한다.

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
  - role: worker
    image: kindest/node:v1.28.0@sha256:9f3ff58f19dcf1a0611d11e8ac989fdb30a28f40f236f59f0bea31fb956ccf5c
    kubeadmConfigPatches:
      - |
        kind: JoinConfiguration
        nodeRegistration:
          kubeletExtraArgs:
            seccomp-default: "true"
```

클러스터가 준비되었으면, 파드를 실행한다.

```shell
kubectl run --rm -it --restart=Never --image=alpine alpine -- sh
```

이제 기본 seccomp 프로파일이 연결되어 있을 것이다. 이는 kind 워커의
컨테이너에 대해 `docker exec`로 `crictl inspect`를 실행해서
확인할 수 있다.

```shell
docker exec -it kind-worker bash -c \
    'crictl inspect $(crictl ps --name=alpine -q) | jq .info.runtimeSpec.linux.seccomp'
```

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_X86", "SCMP_ARCH_X32"],
  "syscalls": [
    {
      "names": ["..."]
    }
  ]
}
```

## {{% heading "whatsnext" %}}

리눅스 seccomp에 대해 더 알아보려면 다음을 참고한다.

* [seccomp 개요](https://lwn.net/Articles/656307/)
* [도커용 Seccomp 보안 프로파일](https://docs.docker.com/engine/security/seccomp/)
