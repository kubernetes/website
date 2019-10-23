---
title: 네임스페이스
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

쿠버네티스는 동일 물리 클러스터를 기반으로 하는 복수의 가상 클러스터를 지원한다.
이들 가상 클러스터를 네임스페이스라고 한다.

{{% /capture %}}


{{% capture body %}}

## 복수의 네임스페이스를 사용하는 경우

네임스페이스는 복수의 팀이나, 프로젝트에 걸쳐서 많은 사용자가 있는 환경에서 사용하도록
만들어졌다. 사용자가 거의 없거나, 수 십명 정도가 되는 경우에는,
네임스페이스를 고려할 필요가 전혀 없다.
네임스페이스가 제공하는 기능이 필요할 때 사용하도록 하자.

네임스페이스는 이름의 범위를 제공한다.
리소스의 이름은 네임스페이스 내에서 유일해야하지만,
네임스페이스를 통틀어서 유일할 필요는 없다.

네임스페이스는 클러스터 자원을 ([리소스 쿼터](/docs/concepts/policy/resource-quotas/)를 통해) 복수의 사용자 사이에서 나누는 방법이다.

다음 버전의 쿠버네티스에서는, 같은 네임스페이스의 오브젝트는 기본적을 동일한 접근  제어 정책을 갖게 된다.
네임스페이스는 서로 중첩될 수 없으며, 각 쿠버네티스 리소스는 하나의 네임스페이스에만 있을 수 있다.

같은 소프트웨어의 다른 버전과 같이 단지 약간의 차이가 있는 리소스를 분리하기 위해서
복수의 네임스페이스를 사용할 필요가 있다. 동일한 네임스페이스에 있는 리소스를
구분하기 위해서는 [레이블](/docs/user-guide/labels)을 사용한다.

## 네임스페이스 다루기

네임스페이스의 생성과 삭제는 [네임스페이스 관리자 가이드 문서](/docs/admin/namespace)에
기술되어 있다.

### 네임스페이스 조회

사용중인 클러스터의 현재 네임스페이스를 나열할 수 있다.

```shell
kubectl get namespace
```
```
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
kube-public   Active    1d
```

쿠버네티스는 처음에 세 개의 초기 네임스페이스를 갖는다.

   * `default` 다른 네임스페이스가 없는 오브젝트를 위한 기본 네임스페이스
   * `kube-system` 쿠버네티스 시스템에서 생성한 오브젝트를 위한 네임스페이스
   * `kube-public` 이 네임스페이스는 자동으로 생성되며 모든 사용자(인증되지 않은 사용자 포함)가 읽기 권한으로 접근할 수 있다. 이 네임스페이스는 주로 전체 클러스터 중에 공개적으로 드러나서 읽을 수 있는 리소스를 위해 예약되어 있다. 이 네임스페이스의 공개적인 성격은 단지 관례이지 요구 사항은 아니다.

### 요청에 네임스페이스 설정하기

네임스페이스를 현재 요청에 설정하기 위해서는, `--namespace` 플래그를 사용한다.

예를 들면,

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### 선호하는 네임스페이스 설정하기

이후 모든 kubectl 명령에서 사용될 네임스페이스를 컨텍스트에
영구적으로 저장할 수 있다.

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# 확인하기
kubectl config view | grep namespace:
```

## 네임스페이스와 DNS

[서비스](/docs/user-guide/services)를 생성하면, 대응되는
[DNS 엔트리](/docs/concepts/services-networking/dns-pod-service/)가 생성된다.
이 엔트리는 `<서비스-이름>.<네임스페이스-이름>.svc.cluster.local`의 형식을 갖는데,
이는 컨테이너가 `<서비스-이름>`만 사용하는 경우, 네임스페이스 내에 국한된 서비스로 연결된다.
개발, 스테이징, 운영과 같이 여러 네임스페이스 내에서 동일한 설정을 사용하는 경우에 유용하다.
네임스페이스를 넘어서 접근하기 위해서는, 전체 주소 도메인 이름(FQDN)을 사용해야 한다.

## 모든 오브젝트가 네임스페이스에 속하지는 않음

대부분의 쿠버네티스 리소스(예를 들어, 파드, 서비스, 레플리케이션 컨트롤러 외)는
네임스페이스에 속한다. 하지만 네임스페이스 리소스 자체는 네임스페이스에 속하지 않는다.
그리고 [nodes](/docs/admin/node)나 퍼시스턴트 볼륨과 같은 저수준 리소스는 어느
네임스페이스에도 속하지 않는다.

네임스페이스에 속하지 않는 쿠버네티스 리소스를 조회하기 위해서는,

```shell
# 네임스페이스에 속하는 리소스
kubectl api-resources --namespaced=true

# 네임스페이스에 속하지 않는 리소스
kubectl api-resources --namespaced=false
```

{{% /capture %}}

{{% capture whatsnext %}}
* [신규 네임스페이스 생성](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace)에 대해 더 배우기.
* [네임스페이스 삭제](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace)에 대해 더 배우기.

{{% /capture %}}

