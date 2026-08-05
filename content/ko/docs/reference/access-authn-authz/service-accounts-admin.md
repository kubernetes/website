---
# reviewers:
#   - bprashanth
#   - davidopp
#   - lavalamp
#   - liggitt
title: 서비스 어카운트 관리하기
content_type: concept
weight: 50
---

<!-- overview -->

_서비스어카운트(ServiceAccount)_ 는 파드에서 실행되는 프로세스에 대한 식별자를 제공한다.

파드 내부의 프로세스는, 자신에게 부여된 서비스 어카운트의 식별자를 사용하여
클러스터의 API 서버에 인증할 수 있다.

서비스 어카운트에 대한 소개는, [서비스 어카운트 구성하기](/docs/tasks/configure-pod-container/configure-service-account/)를 참고한다.

이 가이드는 서비스어카운트와 관련된 개념 중 일부를 설명하며,
서비스어카운트를 나타내는 토큰을 얻거나 취소하는
방법에 대해서도 설명한다.

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

아래 내용들을 따라하기 위해서는
`examplens`라는 네임스페이스가 필요하다.
없을 경우 다음과 같이 네임스페이스를 생성한다.

```shell
kubectl create namespace examplens
```

## 사용자 어카운트와 서비스 어카운트 비교

쿠버네티스는 여러 가지 이유로 사용자 어카운트와 서비스 어카운트의 개념을
구분한다.

- 사용자 어카운트는 사람을 위한 것이지만, 서비스 어카운트는 쿠버네티스의 경우 파드의 일부 컨테이너에서 실행되는
  애플리케이션 프로세스를 위한 것이다.
- 사용자 어카운트는 전역적으로 고려되기 때문에,
  클러스터의 모든 네임스페이스에 걸쳐 이름이 고유해야 한다. 어떤 네임스페이스를 확인하든지 간에,
  특정 사용자명은 해당 유저만을 나타낸다.
  쿠버네티스에서 서비스 어카운트는 네임스페이스별로 구분된다. 두 개의 서로 다른 네임스페이스는
  동일한 이름의 서비스어카운트를 각자 가질 수 있다.
- 일반적으로 클러스터의 사용자 어카운트는 기업 데이터베이스로부터 동기화될 수 있으며,
  여기서 새로운 사용자 어카운트를 생성하려면 특별한 권한이 필요하며 복잡한 비즈니스 프로세스에 연결된다.
  반면에 서비스 어카운트를 생성하는 경우는,
  클러스터 사용자가 최소 권한 원칙에 따라 특정 작업을 위한 서비스 어카운트를 만들 수 있도록
  보다 가볍게 만들어졌다.
  실 사용자를 온보딩하는 단계와 서비스어카운트를 생성하는 단계를 분리하는 것은,
  워크로드가 최소 권한 원칙을 따르기 쉬워지게 한다.
- 사람과 서비스 어카운트에 대한 감사 고려 사항은 다를 수 있다. 이 둘을 따로 관리함으로써
  더욱 쉽게 감사를 수행할 수 있다.
- 복잡한 시스템의 설정들은 그 시스템의 구성요소에 대한 다양한 서비스 어카운트 정의를 포함할 수 있다.
  서비스 어카운트는 많은 제약없이 만들 수 있고
  네임스페이스에 할당된 이름을 가질 수 있기 때문에
  이러한 설정은 이식성이 좋다.

## 바인딩된 서비스 어카운트 토큰 볼륨 메커니즘 {#bound-service-account-token-volume}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

기본적으로,
쿠버네티스 컨트롤 플레인(구체적으로 말하자면 [서비스어카운트 어드미션 컨트롤러](#service-account-admission-controller))은
[프로젝티드 볼륨](/ko/docs/concepts/storage/projected-volumes/)을 파드에 추가하며,
이 볼륨은 쿠버네티스 API에 접근할 수 있는 토큰을 포함한다.

다음은 실행된 파드에서 해당 토큰이 어떻게 보이는지에 대한 예시이다.

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      sources:
        - serviceAccountToken:
            path: token # 애플리케이션이 알고 있는 경로와 일치해야 한다.
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

위의 매니페스트는 세 가지 정보로 구성된 프로젝티드 볼륨을 정의한다.
이 경우, 각 정보는 해당 볼륨 내의 단일 경로를 나타내기도 한다. 세 가지 정보는 다음과 같다.

1. `서비스어카운트토큰(serviceAccountToken)` 정보는 kubelet이 kube-apiserver로부터 취득한 토큰을 포함한다. 
   kubelet은 TokenRequest API를 통해 일정 시간 동안 사용할 수 있는 토큰을 발급 받는다.
   이렇게 취득한 토큰은 파드가 삭제되거나 지정된 수명 주기 이후에 만료된다(기본값은 1시간이다).
   이 토큰은 특정한 파드에 바인딩되며 kube-apiserver를 그 대상으로 한다.
   이 메커니즘은 시크릿을 기반으로 볼륨을 추가하던 이전 메커니즘을 대체한 것이다.
   해당 시크릿은 파드의 서비스어카운트를 나타냈었는데, 이는 토큰과는 달리 만료가 되지 않는 것이었다.
1. `컨피그맵(ConfigMap)` 정보는 인증 및 인가에 관한 번들을 포함한다.
   파드들은 이러한 인증서를 사용하여 해당 클러스터의 kube-apiserver(미들박스나 실수로 잘못 구성된 피어가 아닌)
   에 대한 연결을 확인할 수 있다.
1. `DownwardAPI` 정보는 파드가 포함된 네임스페이스를 검색하고,
   해당 정보를 파드 내부에서 실행 중인 애플리케이션에서 사용할 수 있도록 한다.

이러한 볼륨을 마운트한 컨테이너는 위의 정보들에 접근할 수 있다.

{{< note >}}
TokenRequest를 통해 발급된 토큰을 무효화하는 메커니즘은 없다.
만약 파드에 바인딩된 서비스 어카운트 토큰을 더 이상 신뢰하지 못하게 된다면, 파드를 삭제한다.
파드를 삭제하면 바인딩 되어있던 서비스 어카운트 토큰 역시 만료된다.
{{< /note >}}

## 서비스어카운트에 대해 수동으로 시크릿 관리하기

쿠버네티스 v1.22 이전의 버전들은 쿠버네티스 API에 접근하기 위한 자격 증명들을 자동으로 생성했다.
이러한 옛 메커니즘들은, 실행 중인 파드에 마운트 될 수 있는
토큰 시크릿을 만드는 것에 기반을 두었다.

쿠버네티스 v{{< skew currentVersion >}}을 포함한 최신 버전에서는,
API 자격 증명들은 [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/) API를 사용하여
[직접 얻을 수 있으며](#bound-service-account-token-volume),
프로젝티드 볼륨을 사용하여 파드에 마운트할 수 있다.
이 방법으로 취득한 토큰은 시간 제한이 있으며,
마운트 되었던 파드가 삭제되는 경우 자동으로 만료된다.

예를 들어 평생 만료되지 않는 토큰이 필요한 경우, 서비스 어카운트 토큰을 유지하기 위한 시크릿을 [수동으로 생성](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)할 수 있다.

한 번 시크릿을 수동으로 생성하여 서비스어카운트에 연결했다면, 쿠버네티스 컨트롤 플레인은 자동으로 해당 시크릿에 토큰을 채운다.

{{< note >}}
장기간 사용할 서비스어카운트 토큰을 수동으로 생성하는 메커니즘이 존재하지만,
단기간 동안에만 사용할 토큰을 취득하는 경우
[TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)를 사용하는 것이 권장된다.
{{< /note >}}

## 컨트롤 플레인의 세부 사항들

### 토큰 컨트롤러

토큰 컨트롤러는 `kube-controller-manager` 의 일부로써 실행되며,
비동기적으로 동작한다.

- 서비스어카운트에 대한 삭제를 감시하고, 해당하는 모든 서비스어카운트
  토큰 시크릿을 같이 삭제한다.
- 서비스어카운트 토큰 시크릿에 대한 추가를 감시하고, 참조된 서비스어카운트가
  존재하는지 확인하며, 필요한 경우 시크릿에 토큰을 추가한다.
- 시크릿에 대한 삭제를 감시하고, 필요한 경우 해당 서비스어카운트에서
  참조 중인 항목들을 제거한다.

서비스 어카운트 개인키 파일은 `--service-account-private-key-file`
플래그를 사용하여 `kube-controller-manager` 의 토큰 컨트롤러에 전달해야
한다. 개인키는 생성된 서비스 어카운트 토큰에 서명하는 데 사용될 것이다.
마찬가지로 `--service-account-key-file` 플래그를 사용하여 해당 공개키를
`kube-apiserver` 에 전달해야 한다. 공개키는 인증 과정에서 토큰을
검증하는 데 사용될 것이다.

### 서비스어카운트 어드미션 컨트롤러

파드 수정은 [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)라는
플러그인을 통해 구현된다.
이것은 API 서버의 일부이며,
파드가 생성될 때 파드를 수정하기 위해 동기적으로 동작한다.
이 플러그인이 활성 상태(대부분의 배포에서 기본값)인 경우,
어드미션 컨트롤러는 파드의 생성 시점에 다음 작업들을 수행한다.

1. 파드에 `.spce.serviceAccountName` 항목이 지정되지 않았다면, 어드미션 컨트롤러는
   실행하려는 파드의 서비스어카운트 이름을 `default`로 설정한다.
1. 어드미션 컨트롤러는 실행되는 파드가 참조하는 서비스어카운트가 존재하는지 확인한다.
   만약 해당하는 이름의 서비스어카운트가 존재하지 않는 경우, 어드미션 컨트롤러는 파드를 실행시키지 않는다.
   이는 `default` 서비스어카운트에 대해서도 동일하게 적용된다.
1. 서비스어카운트의 `automountServiceAccountToken` 또는 파드의 `automountServiceAccountToken` 중
   어느 것도 `false` 로 설정되어 있지 않다면,
   - 어드미션 컨트롤러는 실행하려는 파드에
     API에 접근할 수 있는 토큰을 포함하는
     {{< glossary_tooltip text="볼륨" term_id="volume" >}} 을 추가한다.
   - 어드미션 컨트롤러는 파드의 각 컨테이너에 `volumeMount`를 추가한다.
     이미 `/var/run/secrets/kubernetes.io/serviceaccount` 경로에 볼륨이 마운트 되어있는
     컨테이너에 대해서는 추가하지 않는다.
     리눅스 컨테이너의 경우, 해당 볼륨은 `/var/run/secrets/kubernetes.io/serviceaccount` 위치에 마운트되며,
     윈도우 노드 역시 동일한 경로에 마운트된다.
1. 파드의 spec에 `imagePullSecrets` 이 없는 경우,
   어드미션 컨트롤러는 `ServiceAccount`의 `imagePullSecrets`을 복사하여 추가된다.

### TokenRequest API

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

서비스어카운트의 하위 리소스인 [TokenRequest](/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)를 사용하여
일정 시간 동안 해당 서비스어카운트에서 사용할 수 있는 토큰을 가져올 수 있다.
컨테이너 내에서 사용하기 위한 API 토큰을 얻기 위해 이 요청을 직접 호출할 필요는 없는데,
kubelet이 _프로젝티드 볼륨_ 을 사용하여 이를 설정하기 때문이다.

`kubectl`에서 TokenRequest API를 사용하고 싶다면,
[서비스어카운트를 위한 API 토큰을 수동으로 생성하기](/docs/tasks/configure-pod-container/configure-service-account/#manually-create-an-api-token-for-a-serviceaccount)를 확인한다.

쿠버네티스 컨트롤 플레인(구체적으로는 서비스어카운트 어드미션 컨트롤러)은
파드에 프로젝티드 볼륨을 추가하고, kubelet은 컨테이너가 올바른 서비스어카운트로 인증할 수 있도록
해당 볼륨이 토큰을 포함하는고 있는지 확인한다.

(이 메커니즘은 시크릿을 기반으로 볼륨을 추가하던 이전 메커니즘을 대체한 것이다.
해당 시크릿은 파드의 서비스어카운트를 나타냈었는데, 이는 만료가 되지 않는 것이었다.)

아래는 실행 중인 파드에서 어떻게 보이는지에 대한 예시이다.

```yaml
...
  - name: kube-api-access-<random-suffix>
    projected:
      defaultMode: 420 # 8진수 0644에 대한 10진수 값
      sources:
        - serviceAccountToken:
            expirationSeconds: 3607
            path: token
        - configMap:
            items:
              - key: ca.crt
                path: ca.crt
            name: kube-root-ca.crt
        - downwardAPI:
            items:
              - fieldRef:
                  apiVersion: v1
                  fieldPath: metadata.namespace
                path: namespace
```

위의 매니페스트는 세 가지 정보로 구성된 프로젝티드 볼륨을 정의한다.

1. `서비스어카운트토큰(serviceAccountToken)` 정보는 kubelet이 kube-apiserver로부터 취득한 토큰을 포함한다. 
   kubelet은 TokenRequest API를 통해 일정 시간 동안 사용할 수 있는 토큰을 발급 받는다.
   이렇게 취득한 토큰은 파드가 삭제되거나 지정된 수명 주기 이후에 만료된다(기본값은 1시간이다).
   이 토큰은 특정한 파드에 바인딩되며 kube-apiserver를 그 대상으로 한다.
1. `컨피그맵(ConfigMap)` 정보는 인증 및 인가에 관한 번들을 포함한다.
   파드들은 이러한 인증서를 사용하여 해당 클러스터의 kube-apiserver(미들박스나 실수로 잘못 구성된 피어가 아닌)
   에 대한 연결을 확인할 수 있다.
1. `DownwardAPI` 정보는 파드가 포함된 네임스페이스를 검색하고,
   해당 정보를 파드 내부에서 실행 중인 애플리케이션에서 사용할 수 있도록 한다.

이러한 볼륨을 마운트한 컨테이너는 위의 정보들에 접근할 수 있다.

## 추가적인 API 토큰 생성하기 {#create-token}

{{< caution >}}
[토큰 요청](#tokenrequest-api) 메커니즘이 적합하지 않은 경우에만 수명이 긴 API 토큰을 생성한다.
토큰 요청 메커니즘은 시간 제한이 있는 토큰만을 제공하며,
토큰이 만료되기 때문에 보안에 대한 위험이 적다.
{{< /caution >}}

서비스어카운트를 위한 만료되지 않는 API 토큰을 생성하려면,
해당 서비스어카운트를 참조하는 어노테이션을 갖는 `kubernetes.io/service-account-token` 타입의 시크릿을 생성한다.
그러면 컨트롤 플레인은 장기적으로 사용 가능한 토큰을 발급하여
시크릿을 갱신할 것이다.

아래는 시크릿을 위한 예제 매니페스트이다.

{{< codenew file="secret/serviceaccount/mysecretname.yaml" >}}

이 예제에 기반한 시크릿을 생성하려면, 아래의 명령어를 실행한다.

```shell
kubectl -n examplens create -f https://k8s.io/examples/secret/serviceaccount/mysecretname.yaml
```

시크릿에 대한 자세한 사항을 확인하려면, 아래의 명령어를 실행한다.

```shell
kubectl -n examplens describe secret mysecretname
```

결과는 다음과 같다.

```
Name:           mysecretname
Namespace:      examplens
Labels:         <none>
Annotations:    kubernetes.io/service-account.name=myserviceaccount
                kubernetes.io/service-account.uid=8a85c4c4-8483-11e9-bc42-526af7764f64

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1362 bytes
namespace:      9 bytes
token:          ...
```

만약 `examplens` 네임스페이스에 새로운 파드를 실행한다면, 해당 파드는 방금 생성한 `myserviceaccount`
서비스 어카운트 토큰 시크릿을 사용할 수 있다.

## 서비스어카운트 토큰 시크릿 삭제/무효화 {#delete-token}

만약 제거하려는 토큰을 포함하는 시크릿의 이름을 알고 있다면, 아래 명령어를 실행한다.

```shell
kubectl delete secret name-of-secret
```

그게 아니라면, 먼저 시크릿을 확인한다.

```shell
# 아래 명령어는 'examplens' 네임스페이스가 존재한다고 가정한다.
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```

결과는 다음과 같다.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"name":"example-automated-thing","namespace":"examplens"}}
  creationTimestamp: "2019-07-21T07:07:07Z"
  name: example-automated-thing
  namespace: examplens
  resourceVersion: "777"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
  - name: example-automated-thing-token-zyxwv
```

이제 시크릿의 이름을 알았으니, 삭제한다.

```shell
kubectl -n examplens delete secret/example-automated-thing-token-zyxwv
```

컨트롤 플레인은 서비스어카운트에 시크릿이 누락되었음을 감지하고,
새로운 것으로 대체한다.

```shell
kubectl -n examplens get serviceaccount/example-automated-thing -o yaml
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"ServiceAccount","metadata":{"annotations":{},"name":"example-automated-thing","namespace":"examplens"}}
  creationTimestamp: "2019-07-21T07:07:07Z"
  name: example-automated-thing
  namespace: examplens
  resourceVersion: "1026"
  selfLink: /api/v1/namespaces/examplens/serviceaccounts/example-automated-thing
  uid: f23fd170-66f2-4697-b049-e1e266b7f835
secrets:
  - name: example-automated-thing-token-4rdrh
```

## 정리하기

예제를 위해 `examplens` 네임스페이스를 생성했었다면, 아래의 명령어로 제거할 수 있다.

```shell
kubectl delete namespace examplens
```

## 컨트롤 플레인의 세부 사항들

### 서비스어카운트 컨트롤러

서비스어카운트 컨트롤러는 네임스페이스 내의 서비스어카운트들을 관리하며,
활성화된 모든 네임스페이스에 "default"라는 이름의 서비스어카운트가 존재하도록 한다.

### 토큰 컨트롤러

토큰 컨트롤러는 `kube-controller-manager`의 일부로써 실행되며,
비동기적으로 동작한다.

- 서비스어카운트에 대한 생성을 감시하고, 해당 서비스어카운트 토큰 시크릿을 생성하여
  API에 대한 접근을 허용한다.
- 서비스어카운트에 대한 삭제를 감시하고, 해당하는 모든 서비스어카운트
  토큰 시크릿을 같이 삭제한다.
- 서비스어카운트 토큰 시크릿에 대한 추가를 감시하고, 참조된 서비스어카운트가
  존재하는지 확인하며, 필요한 경우 시크릿에 토큰을 추가한다.
- 시크릿에 대한 삭제를 감시하고, 필요한 경우 해당 서비스어카운트에서
  참조 중인 항목들을 제거한다.

서비스 어카운트 개인키 파일은 `--service-account-private-key-file`
플래그를 사용하여 `kube-controller-manager` 의 토큰 컨트롤러에 전달해야
한다. 개인키는 생성된 서비스 어카운트 토큰에 서명하는 데 사용될 것이다.
마찬가지로 `--service-account-key-file` 플래그를 사용하여 해당 공개키를
`kube-apiserver` 에 전달해야 한다. 공개키는 인증 과정에서 토큰을
검증하는 데 사용될 것이다.

## {{% heading "whatsnext" %}}

- 자세한 내용은 [프로젝티드 볼륨](/ko/docs/concepts/storage/projected-volumes/)을 확인한다.
