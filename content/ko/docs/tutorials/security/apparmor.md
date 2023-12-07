---
# reviewers:
# - stclair
title: AppArmor를 사용하여 리소스에 대한 컨테이너의 접근 제한
content_type: tutorial
weight: 10
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.4" state="beta" >}}


AppArmor는 표준 리눅스 사용자와 그룹 기반의 권한을 보완하여, 한정된 리소스 집합으로
프로그램을 제한하는 리눅스 커널 보안 모듈이다. AppArmor는 임의의 애플리케이션에 대해서
잠재적인 공격 범위를 줄이고 더욱 심층적인 방어를 제공하도록 구성할 수 있다.
이 기능은 특정 프로그램이나 컨테이너에서 필요한 리눅스 기능, 네트워크 사용, 파일 권한 등에 대한
접근을 허용하는 프로파일로 구성한다. 각 프로파일은
허용하지 않은 리소스 접근을 차단하는 *강제(enforcing)* 모드 또는
위반만을 보고하는 *불평(complain)* 모드로 실행할 수 있다.

AppArmor를 이용하면 컨테이너가 수행할 수 있는 작업을 제한하고 또는
시스템 로그를 통해 더 나은 감사를 제공하여 더 안전한 배포를 실행할 수 있다.
그러나 AppArmor가 은탄환(언제나 통하는 무적의 방법)이 아니며,
애플리케이션 코드 취약점을 보호하기 위한 여러 조치를 할 수 있는 것 뿐임을 잊으면 안된다.
양호하고 제한적인 프로파일을 제공하고, 애플리케이션과 클러스터를 여러 측면에서 강화하는 것이 중요하다.



## {{% heading "objectives" %}}


* 노드에 프로파일을 어떻게 적재하는지 예시를 본다.
* 파드에 프로파일을 어떻게 강제 적용하는지 배운다.
* 프로파일이 적재되었는지 확인하는 방법을 배운다.
* 프로파일을 위반하는 경우를 살펴본다.
* 프로파일을 적재할 수 없을 경우를 살펴본다.



## {{% heading "prerequisites" %}}


다음을 보장해야 한다.

1. 쿠버네티스 버전은 최소 1.4 이다. -- 쿠버네티스 v1.4부터 AppArmor 지원을 추가했다.
   v1.4 이전 쿠버네티스 컴포넌트는 새로운 AppArmor 어노테이션을 인식하지 못하고
   제공되는 AppArmor 설정을 **조용히 무시**할 것이다. 파드에서 예상하는 보호를 받고 있는지 확인하려면
   해당 노드의 Kubelet 버전을 확인하는 것이 중요하다.

   ```shell
   $ kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {@.status.nodeInfo.kubeletVersion}\n{end}'
   ```
   ```
   gke-test-default-pool-239f5d02-gyn2: v1.4.0
   gke-test-default-pool-239f5d02-x1kf: v1.4.0
   gke-test-default-pool-239f5d02-xwux: v1.4.0
   ```

2. AppArmor 커널 모듈을 사용 가능해야 한다. -- 리눅스 커널에 AppArmor 프로파일을 강제 적용하기 위해 AppArmor 커널 모듈은 반드시 설치되어 있고
   사용 가능해야 한다. 예를 들어 Ubuntu 및 SUSE 같은 배포판은 모듈을 기본값으로 지원하고, 그 외 많은 다른 배포판들은 선택적으로 지원한다.
   모듈이 사용 가능한지 확인하려면
   `/sys/module/apparmor/parameters/enabled` 파일을 확인한다.

   ```shell
   $ cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   Kubelet(>=v1.4)이 AppArmor 기능 지원을 포함하지만, 커널 모듈을 사용할 수 없으면
   파드에서 AppArmor 옵션을 실행하는 것이 거부된다.

  {{< note >}}
  우분투에는 추가적인 훅(hook)이나 추가 기능 패치를 포함한 리눅스 커널의 상위 스트림에 머지되지 않은
  많은 AppArmor 패치를 가지고 있다. 쿠버네티스는
  상위 스트림 버전에서 테스트한 패치만을 가지고 있어서 다른 기능은 지원을 보장하지 않는다.
  {{< /note >}}

3. 컨테이너 런타임이 AppArmor을 지원한다. -- 현재 모든 일반적인 쿠버네티스를 지원하는
{{< glossary_tooltip term_id="docker">}}, {{< glossary_tooltip term_id="cri-o" >}} 또는
{{< glossary_tooltip term_id="containerd" >}} 와 같은 컨테이너 런타임들은 AppArmor를 지원해야 한다.
이 런타임 설명서를 참조해서 클러스터가 AppArmor를 사용하기 위한
요구 사항을 충족하는지 확인해야 한다.

4. 프로파일이 적재되어 있다. -- AppArmor는 각 컨테이너와 함께 실행해야 하는 AppArmor 프로파일을 지정하여 파드에 적용한다.
   커널에 지정한 프로파일이 적재되지 않았다면, Kubelet(>= v1.4)은 파드를 거부한다. 해당 노드에 어떤 프로파일이 적재되었는지는
   `/sys/kernel/security/apparmor/profiles` 파일을 통해 확인할 수 있다.
   예를 들어,

   ```shell
   $ ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```
   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   노드에 프로파일을 적재하는 것에 대해 더 자세한 내용은
   [프로파일과 함께 노드 설정하기](#setting-up-nodes-with-profiles).

AppArmor 지원이 포함된 Kubelet (>= v1.4)이면
어떤 전제 조건이 충족되지 않으면 AppArmor와 함께한 파드를 거부한다.
노드 상에 AppArmor 지원 여부는
노드 준비 조건 메시지를 확인하여(이후 릴리스에서는 삭제될 것 같지만) 검증할 수 있다.

```shell
kubectl get nodes -o=jsonpath='{range .items[*]}{@.metadata.name}: {.status.conditions[?(@.reason=="KubeletReady")].message}{"\n"}{end}'
```
```
gke-test-default-pool-239f5d02-gyn2: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-x1kf: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-xwux: kubelet is posting ready status. AppArmor enabled
```



<!-- lessoncontent -->

## 파드 보안 강화하기

{{< note >}}
AppArmor는 현재 베타이며, 이 때문에 옵션은 어노테이션 형식으로 지정한다. 일반 사용자 버전이 되면,
어노테이션은 최상위 종류의 필드로 대체될 것이다(자세한 내용은
[일반 사용자 버전으로 업그레이드 방법](#upgrade-path-to-general-availability) 참고)
{{< /note >}}

AppArmor 프로파일은 *컨테이너마다* 지정된다. 함께 실행할 파드 컨테이너에 AppArmor 프로파일을 지정하려면
파드의 메타데이터에 어노테이션을 추가한다.

```yaml
container.apparmor.security.beta.kubernetes.io/<container_name>: <profile_ref>
```

`<container_name>`은 프로파일을 적용하는 컨테이너 이름이고, `<profile_ref>`는
적용할 프로파일을 지정한다. `profile_ref`는 다음 중에 하나이다.

* 런타임의 기본 프로파일을 적용하기 위한 `runtime/default`
* `<profile_name>`로 이름한 호스트에 적재되는 프로파일을 적용하기 위한 `localhost/<profile_name>`
* 적재할 프로파일이 없음을 나타내는  `unconfined`

어노테이션과 프로파일 이름 형식의 자세한 내용은 [API 참조](#api-reference)를 살펴본다.

쿠버네티스 AppArmor 의 작동 순서는 모든 선행 조건이 충족되었는지 확인하고,
적용을 위해 선택한 프로파일을 컨테이너 런타임으로 전달하여 이루어진다.
만약 선행 조건이 충족되지 않으면 파드는 거부되고 실행되지 않는다.

프로파일이 적용되었는지 확인하기 위해, 컨테이너 생성 이벤트에 나열된 AppArmor 보안 옵션을 찾아 볼 수 있다.

```shell
kubectl get events | grep Created
```
```
22s        22s         1         hello-apparmor     Pod       spec.containers{hello}   Normal    Created     {kubelet e2e-test-stclair-node-pool-31nt}   Created container with docker id 269a53b202d3; Security:[seccomp=unconfined apparmor=k8s-apparmor-example-deny-write]
```

컨테이너의 루트 프로세스가 올바른 프로파일로 실행되는지는 proc attr을 확인하여 직접 검증할 수 있다.

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```
```
k8s-apparmor-example-deny-write (enforce)
```

## 예시

*이 예시는 AppArmor를 지원하는 클러스터를 이미 구성하였다고 가정한다.*

먼저 노드에서 사용하려는 프로파일을 적재해야 한다. 사용할 프로파일은 파일 쓰기를 거부한다.

```shell
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
```

파드를 언제 스케줄할지 알지 못하므로 모든 노드에 프로파일을 적재해야 한다.
이 예시에서는 SSH를 이용하여 프로파일을 설치할 것이나 다른 방법은
[프로파일과 함께 노드 설정하기](#setting-up-nodes-with-profiles)에서 논의한다.

```shell
NODES=(
    # The SSH-accessible domain names of your nodes
    gke-test-default-pool-239f5d02-gyn2.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-x1kf.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-xwux.us-central1-a.my-k8s)
for NODE in ${NODES[*]}; do ssh $NODE 'sudo apparmor_parser -q <<EOF
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
EOF'
done
```

다음으로 쓰기 금지 프로파일된 "Hello AppArmor" 파드를 실행한다.

{{< codenew file="pods/security/hello-apparmor.yaml" >}}

```shell
kubectl create -f ./hello-apparmor.yaml
```

파드 이벤트를 살펴보면, 'k8s-apparmor-example-deny-write' AppArmor 프로파일로 생성된 파드 컨테이너를
확인할 수 있다.

```shell
kubectl get events | grep hello-apparmor
```
```
14s        14s         1         hello-apparmor   Pod                                Normal    Scheduled   {default-scheduler }                           Successfully assigned hello-apparmor to gke-test-default-pool-239f5d02-gyn2
14s        14s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulling     {kubelet gke-test-default-pool-239f5d02-gyn2}   pulling image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulled      {kubelet gke-test-default-pool-239f5d02-gyn2}   Successfully pulled image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Created     {kubelet gke-test-default-pool-239f5d02-gyn2}   Created container with docker id 06b6cd1c0989; Security:[seccomp=unconfined apparmor=k8s-apparmor-example-deny-write]
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Started     {kubelet gke-test-default-pool-239f5d02-gyn2}   Started container with docker id 06b6cd1c0989
```

proc attr을 확인하여 컨테이너가 실제로 해당 프로파일로 실행 중인지 확인할 수 있다.

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```
```
k8s-apparmor-example-deny-write (enforce)
```

마지막으로 파일 쓰기를 통해 프로파일을 위반하면 어떻게 되는지 확인할 수 있다.

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```
```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

이제 정리하면서, 적재되지 않은 프로파일을 지정하면 어떻게 되는지 살펴본다.

```shell
kubectl create -f /dev/stdin <<EOF
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
  annotations:
    container.apparmor.security.beta.kubernetes.io/hello: localhost/k8s-apparmor-example-allow-write
spec:
  containers:
  - name: hello
    image: busybox:1.28
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
pod/hello-apparmor-2 created
```

```shell
kubectl describe pod hello-apparmor-2
```
```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
Reason:        AppArmor
Message:       Pod Cannot enforce AppArmor: profile "k8s-apparmor-example-allow-write" is not loaded
IP:
Controllers:   <none>
Containers:
  hello:
    Container ID:
    Image:     busybox
    Image ID:
    Port:
    Command:
      sh
      -c
      echo 'Hello AppArmor!' && sleep 1h
    State:              Waiting
      Reason:           Blocked
    Ready:              False
    Restart Count:      0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-dnz7v (ro)
Conditions:
  Type          Status
  Initialized   True
  Ready         False
  PodScheduled  True
Volumes:
  default-token-dnz7v:
    Type:    Secret (a volume populated by a Secret)
    SecretName:    default-token-dnz7v
    Optional:   false
QoS Class:      BestEffort
Node-Selectors: <none>
Tolerations:    <none>
Events:
  FirstSeen    LastSeen    Count    From                        SubobjectPath    Type        Reason        Message
  ---------    --------    -----    ----                        -------------    --------    ------        -------
  23s          23s         1        {default-scheduler }                         Normal      Scheduled     Successfully assigned hello-apparmor-2 to e2e-test-stclair-minion-group-t1f5
  23s          23s         1        {kubelet e2e-test-stclair-node-pool-t1f5}             Warning        AppArmor    Cannot enforce AppArmor: profile "k8s-apparmor-example-allow-write" is not loaded
```

파드 상태는 Pending이며, 오류 메시지는 `Pod Cannot enforce AppArmor: profile
"k8s-apparmor-example-allow-write" is not loaded`이다. 이벤트도 동일한 메시지로 기록되었다.

## 관리

### 프로파일과 함께 노드 설정하기

현재 쿠버네티스는 AppArmor 프로파일을 노드에 적재하기 위한 네이티브 메커니즘을 제공하지 않는다.
프로파일을 설정하는 여러 방법이 있다. 예를 들면 다음과 같다.

* 각 노드에서 파드를 실행하는 [데몬셋](/ko/docs/concepts/workloads/controllers/daemonset/)을 통해서
  올바른 프로파일이 적재되었는지 확인한다. 예시 구현은
  [여기](https://git.k8s.io/kubernetes/test/images/apparmor-loader)에서 찾아볼 수 있다.
* 노드 초기화 시간에 노드 초기화 스크립트(예를 들어 Salt, Ansible 등)나
  이미지를 이용
* [예시](#example)에서 보여준 것처럼,
  프로파일을 각 노드에 복사하고 SSH를 통해 적재한다.

스케줄러는 어떤 프로파일이 어떤 노드에 적재되는지 고려하지 않으니, 프로파일 전체 집합이
모든 노드에 적재되어야 한다. 대안적인 방법은
각 프로파일(혹은 프로파일의 클래스)을 위한 노드 레이블을 노드에 추가하고,
[노드 셀렉터](/ko/docs/concepts/scheduling-eviction/assign-pod-node/)를 이용하여
파드가 필요한 프로파일이 있는 노드에서 실행되도록 한다.

### AppArmor 비활성화

클러스터에서 AppArmor를 사용하지 않으려면, 커맨드라인 플래그로 비활성화 할 수 있다.

```
--feature-gates=AppArmor=false
```

비활성화되면, AppArmor 프로파일을 포함한 파드는 
"Forbidden" 오류로 검증 실패한다.

{{<note>}}
쿠버네티스 기능이 비활성화되어 있어도, 런타임이 계속 기본 프로파일을 강제할 수도 있다. 
AppArmor가 general availability (GA) 상태로 바뀌면 
AppArmor 기능을 비활성화하는 옵션은 제거될 것이다.
{{</note>}}

## 프로파일 제작

AppArmor 프로파일을 만들고 올바르게 지정하는 것은 매우 까다로울 수 있다.
다행히 이 작업에 도움 되는 도구가 있다.

* `aa-genprof`와 `aa-logprof`는 애플리케이션 활동과 로그와 수행에 필요한 행동을 모니터링하여
  일반 프로파일 규칙을 생성한다. 자세한 사용방법은
  [AppArmor 문서](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools)에서 제공한다.
* [bane](https://github.com/jfrazelle/bane)은 단순화된 프로파일 언어를 이용하는 도커를 위한
  AppArmor 프로파일 생성기이다.

AppArmor 문제를 디버깅하기 위해서 거부된 것으로 보이는 시스템 로그를 확인할 수 있다.
AppArmor 로그는 `dmesg`에서 보이며, 오류는 보통 시스템 로그나
`journalctl`에서 볼 수 있다. 더 많은 정보는
[AppArmor 실패](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures)에서 제공한다.


## API 참조

### 파드 어노테이션

컨테이너를 실행할 프로파일을 지정한다.

- **키**: `container.apparmor.security.beta.kubernetes.io/<container_name>`
  `<container_name>`는 파드 내에 컨테이너 이름과 일치한다.
  분리된 프로파일은 파드 내에 각 컨테이너로 지정할 수 있다.
- **값**: 아래 기술된 프로파일 참조

### 프로파일 참조

- `runtime/default`: 기본 런타임 프로파일을 참조한다.
  - (기본 파드시큐리티폴리시 없이) 프로파일을 지정하지 않고
    AppArmor를 사용하는 것과 동등하다.
  - 실제로는, 많은 컨테이너 런타임은 동일한 OCI 기본 프로파일을 사용하며, 이는 
    https://github.com/containers/common/blob/main/pkg/apparmor/apparmor_linux_template.go 에 정의되어 있다.
- `localhost/<profile_name>`: 노드(localhost)에 적재된 프로파일을 이름으로 참조한다.
   - 가용한 프로파일 이름의 상세 내용은
     [핵심 정책 참조](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Core_Policy_Reference#profile-names-and-attachment-specifications)에 설명되어 있다.
- `unconfined`: 이것은 컨테이너에서 AppArmor를 효과적으로 비활성시킨다.

다른 어떤 프로파일 참조 형식도 유효하지 않다.

## {{% heading "whatsnext" %}}


참고 자료

* [퀵 가이드 AppArmor 프로파일 언어](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor 코어 정책 참고](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
