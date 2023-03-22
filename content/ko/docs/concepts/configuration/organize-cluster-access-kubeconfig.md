---
title: kubeconfig 파일을 사용하여 클러스터 접근 구성하기
content_type: concept
weight: 60
---

<!-- overview -->

kubeconfig 파일들을 사용하여 클러스터, 사용자, 네임스페이스 및 인증 메커니즘에 대한 정보를 관리하자.
`kubectl` 커맨드라인 툴은 kubeconfig 파일을 사용하여
클러스터의 선택과
클러스터의 API 서버와의 통신에 필요한 정보를 찾는다.

{{< note >}}
클러스터에 대한 접근을 구성하는 데 사용되는 파일을 *kubeconfig 파일* 이라 한다.
이는 구성 파일을 참조하는 일반적인 방법을 의미한다.
`kubeconfig`라는 이름의 파일이 있다는 의미는 아니다.
{{< /note >}}

{{< warning >}}
신뢰할 수 있는 소스의 kubeconfig 파일만 사용한다. 특수 제작된 kubeconfig 파일을 사용하면 악성 코드가 실행되거나 파일이 노출될 수 있다.
신뢰할 수 없는 kubeconfig 파일을 사용해야 하는 경우 셸 스크립트를 사용하는 경우처럼 먼저 신중하게 검사한다.
{{< /warning>}}

기본적으로 `kubectl`은 `$HOME/.kube` 디렉터리에서 `config`라는 이름의 파일을 찾는다.
`KUBECONFIG` 환경 변수를 설정하거나
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/) 플래그를 지정해서
다른 kubeconfig 파일을 사용할 수 있다.

kubeconfig 파일을 생성하고 지정하는 단계별 지시사항은
[다중 클러스터로 접근 구성하기](/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)를 참조한다.




<!-- body -->

## 다중 클러스터, 사용자와 인증 메커니즘 지원

여러 클러스터가 있고, 사용자와 구성 요소가 다양한 방식으로 인증한다고 가정하자.
예를 들면 다음과 같다.

- 실행 중인 kubelet은 인증서를 이용하여 인증할 수 있다.
- 사용자는 토큰으로 인증할 수 있다.
- 관리자는 개별 사용자에게 제공하는 인증서 집합을 가지고 있다.

kubeconfig 파일을 사용하면 클러스터와 사용자와 네임스페이스를 구성할 수 있다.
또한 컨텍스트를 정의하여
빠르고 쉽게 클러스터와 네임스페이스 간에 전환할 수 있다.

## 컨텍스트

kubeconfig에서 *컨텍스트* 요소는 편리한 이름으로 접속 매개 변수를 묶는데 사용한다.
각 컨텍스트는 클러스터, 네임스페이스와 사용자라는 세 가지 매개 변수를 가진다.
기본적으로 `kubectl` 커맨드라인 툴은 *현재 컨텍스트* 의 매개 변수를
사용하여 클러스터와 통신한다.

현재 컨택스트를 선택하려면 다음을 실행한다.
```
kubectl config use-context
```

## KUBECONFIG 환경 변수

`KUBECONFIG` 환경 변수는 kubeconfig 파일 목록을 보유한다.
리눅스 및 Mac의 경우 이는 콜론(:)으로 구분된 목록이다.
윈도우는 세미콜론(;)으로 구분한다. `KUBECONFIG` 환경 변수가 필수는 아니다.
`KUBECONFIG` 환경 변수가 없으면,
`kubectl`은 기본 kubeconfig 파일인 `$HOME/.kube/config`를 사용한다.

`KUBECONFIG` 환경 변수가 존재하면, `kubectl`은
`KUBECONFIG` 환경 변수에 나열된 파일을 병합한 결과 형태의
효과적 구성을 이용한다.

## kubeconfig 파일 병합

구성을 보려면, 다음 커맨드를 입력한다.

```shell
kubectl config view
```

앞서 설명한 것처럼, 이 출력 내용은 단일 kubeconfig 파일이나
여러 kubeconfig 파일을 병합한 결과 일 수 있다.

다음은 kubeconfig 파일을 병합할 때에 `kubectl`에서 사용하는 규칙이다.

1. `--kubeconfig` 플래그를 설정했으면, 지정한 파일만 사용한다. 병합하지 않는다.
   이 플래그는 오직 한 개 인스턴스만 허용한다.

   그렇지 않고, `KUBECONFIG` 환경 변수를 설정하였다면
   병합해야 하는 파일의 목록으로 사용한다.
   `KUBECONFIG` 환경 변수의 나열된 파일은
   다음 규칙에 따라 병합한다.

   * 빈 파일명은 무시한다.
   * 역 직렬화 불가한 파일 내용에 대해서 오류를 일으킨다.
   * 특정 값이나 맵 키를 설정한 첫 번째 파일을 우선한다.
   * 값이나 맵 키를 변경하지 않는다.
     예: `현재 컨텍스트`를 설정할 첫 번째 파일의 컨택스트를 유지한다.
     예: 두 파일이 `red-user`를 지정했다면, 첫 번째 파일의 `red-user` 값만을 사용한다.
     두 번째 파일의 `red-user` 하위에 충돌하지 않는 항목이 있어도 버린다.

   `KUBECONFIG` 환경 변수 설정의 예로,
   [KUBECONFIG 환경 변수 설정](/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#kubeconfig-환경-변수-설정)를 참조한다.

   그렇지 않다면, 병합하지 않고 기본 kubeconfig 파일인 `$HOME/.kube/config`를 사용한다.

1. 이 체인에서 첫 번째를 기반으로 사용할 컨텍스트를 결정한다.

    1. 커맨드라인 플래그의 `--context`를 사용한다.
    1. 병합된 kubeconfig 파일에서 `current-context`를 사용한다.

   이 시점에서는 빈 컨텍스트도 허용한다.

1. 클러스터와 사용자를 결정한다. 이 시점에서는 컨텍스트가 있을 수도 있고 없을 수도 있다.
   사용자에 대해 한 번, 클러스터에 대해 한 번 총 두 번에 걸친
   이 체인에서 첫 번째 것을 기반으로 클러스터와 사용자를 결정한다.

   1. 커맨드라인 플래그가 존재하면, `--user` 또는 `--cluster`를 사용한다.
   1. 컨텍스트가 비어있지 않다면, 컨텍스트에서 사용자 또는 클러스터를 가져온다.

   이 시점에서는 사용자와 클러스터는 비워둘 수 있다.

1. 사용할 실제 클러스터 정보를 결정한다.
   이 시점에서 클러스터 정보가 있을 수 있고 없을 수도 있다.
   이 체인을 기반으로 클러스터 정보를 구축한다. 첫 번째 것을 사용한다.

   1. 커맨드라인 플래그가 존재하면, `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`를 사용한다.
   1. 병합된 kubeconfig 파일에서 클러스터 정보 속성이 있다면 사용한다.
   1. 서버 위치가 없다면 실패한다.

1. 사용할 실제 사용자 정보를 결정한다.
   사용자 당 하나의 인증 기법만 허용하는 것을 제외하고는
   클러스터 정보와 동일한 규칙을 사용하여 사용자 정보를 작성한다.

   1. 커맨드라인 플래그가 존재하면, `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`을 사용한다.
   1. 병합된 kubeconfig 파일에서 `user` 필드를 사용한다.
   1. 충돌하는 두 가지 기법이 있다면 실패한다.

1. 여전히 누락된 정보는 기본 값을 사용하고
   인증 정보를 묻는 메시지가 표시될 수 있다.

## 파일 참조

kubeconfig 파일에서 파일과 경로 참조는 kubeconfig 파일의 위치와 관련 있다.
커맨드라인 상에 파일 참조는 현재 디렉터리를 기준으로 한다.
`$HOME/.kube/config`에서 상대 경로는 상대적으로, 절대 경로는
절대적으로 저장한다.

## 프록시

다음과 같이 kubeconfig 파일에서 `proxy-url`를 사용하여 `kubectl`이 각 클러스터마다 프록시를 거치도록 설정할 수 있다.

```yaml
apiVersion: v1
kind: Config

clusters:
- cluster:
    proxy-url: http://proxy.example.org:3128
    server: https://k8s.example.org/k8s/clusters/c-xxyyzz
  name: development

users:
- name: developer

contexts:
- context:
  name: development
```


## {{% heading "whatsnext" %}}


* [다중 클러스터 접근 구성하기](/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)



