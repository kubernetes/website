---
title: kubelet 이미지 자격 증명 공급자 구성하기
# reviewers:
# - liggitt
# - cheftako
description: kubelet의 이미지 자격 증명 공급자 플러그인을 구성한다.
content_type: task
min-kubernetes-server-version: v1.26
---

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!-- overview -->

쿠버네티스 v1.20부터 kubelet은 exec 플러그인을 사용하여 컨테이너 이미지 레지스트리에 대한 자격 증명(credential)을 동적으로 검색할 수 있다.
kubelet과 exec 플러그인은 쿠버네티스 버전 API를 사용하여 stdio(stdin, stdout, stderr)를 통해 통신한다.
kubelet은 플러그인을 통해 정적 자격 증명을 디스크에 저장하는 대신 컨테이너 레지스트리에 대한 자격 증명을 동적으로 요청할 수 있다.
예를 들어, 플러그인은 로컬 메타데이터 서버와 통신하여 kubelet에 의해 풀(pulled) 된
이미지에 대한 단기 유효(short-lived) 자격 증명을 검색할 수 있다.

아래 중 하나에 해당하면 이 기능의 사용을 고려해도 좋다.

* 레지스트리에 대한 인증 정보를 찾기 위해 클라우드 공급자 서비스에 대한 API 호출이 필요할 때.
* 자격 증명 만료 시간이 짧아 새 자격 증명 요청이 자주 필요할 때.
* 레지스트리 자격 증명을 디스크 또는 이미지 풀 시크릿에 저장하는 것을 허용하지 않을 때.

이 가이드는 kubelet의 이미지 자격 증명 공급자 플러그인 메커니즘을 구성하는 방법을 보여 준다.

## {{% heading "prerequisites" %}}

* kubelet 자격 증명 공급자 플러그인을 지원하는 노드로 구성된 쿠버네티스 클러스터가 필요하다. 
  이 기능은 쿠버네티스 {{< skew currentVersion >}}에서 사용 가능하다. 
  쿠버네티스 v1.24 및 v1.25에는 베타 기능으로 포함되었으며, 기본적으로 활성화되어 있다.
* 자격 증명 공급자 exec 플러그인에 대한 구현체(implementation)가 필요하다. 이를 위해 자체 플러그인을 구축하거나 클라우드 공급자가 제공하는 플러그인을 사용할 수 있다.

{{< version-check >}}

<!-- steps -->

## 노드에 플러그인 설치하기

자격 증명 공급자 플러그인은 kubelet에 의해 실행될 실행 가능한 바이너리이다. 클러스터의 모든 노드에 플러그인 바이너리가 있고 알려진 디렉터리에 저장됐는지 확인한다.
이후 kubelet 플래그를 구성할 때 해당 디렉터리가 필요하다.

## kubelet 구성하기

이 기능을 사용하려면 kubelet에 두 개의 플래그가 설정돼야 한다.

* `--image-credential-provider-config` - 자격 증명 공급자 플러그인 구성 파일 경로.
* `--image-credential-provider-bin-dir` - 자격 증명 공급자 플러그인 바이너리 파일이 있는 디렉터리 경로.

### kubelet 자격 증명 공급자 구성

kubelet은 `--image-credential-provider-config`로 전달된 구성 파일을 읽고,
컨테이너 이미지에 대해 어떤 exec 플러그인을 호출할지 결정한다.
[ECR](https://aws.amazon.com/ecr/)-based 플러그인을 사용하는 경우 사용하게 될 수 있는 구성 파일의 예:

```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
# providers 필드는 kubelet이 활성화할 자격 증명 공급자 헬퍼 플러그인의 목록을 나타낸다. 
# 단일 이미지에 대해 복수 공급자가 매치될 수도 있으며, 
# 이러한 경우 모든 공급자의 자격 증명이 kubelet으로 리턴된다. 
# 단일 이미지에 대해 복수 공급자가 호출된 경우, 결과가 합산된다. 
# 공급자가 중복되는(overlapping) 인증 키를 리턴한 경우, 이 목록의 위쪽에 위치하는 공급자로부터의 값이 사용된다.
providers:
  # name 필드는 자격 증명 공급자를 구분하기 위한 필수 필드이다. 
  # 이 이름은 kubelet이 인식하는 공급자 실행 파일의 이름과 일치해야 한다. 
  # 해당 실행 파일은 kubelet의 bin 디렉토리에 존재해야 한다(--image-credential-provider-bin-dir 플래그로 설정).
  - name: ecr
    # matchImages 필드는 각 이미지에 대해 이 공급자가 활성화되어야 하는지를 
    # 판단하기 위한 문자열의 목록을 나타내는 필수 필드이다. 
    # kubelet이 요청한 이미지가 다음 문자열 중 하나와 매치되면, 
    # 해당 플러그인이 활성화되어 자격 증명을 제공할 수 있게 된다. 
    # 이미지 태그 문자열은 저장소(registry) 도메인 및 URL 경로를 포함해야 한다.
    #
    # matchImages의 각 항목은 패턴을 나타내며, 포트와 경로를 포함할 수 있다. 
    # 도메인 자리에 글롭(glob)도 사용할 수 있으나, 포트와 경로에는 사용할 수 없다. 
    # 글롭은 '*.k8s.io' 또는 'k8s.*.io'와 같이 서브도메인 형태로 사용하거나, 'k8s.*'와 같이 최상위 도메인 형태로 사용할 수 있다. 
    # 'app*.k8s.io'와 같이 서브도메인의 일부를 매칭하는 것도 지원된다. 
    # 각 글롭은 단일 서브도메인 분할만을 매칭할 수 있으므로, `*.io`는 `*.k8s.io`에 매치되지 **않는다**.
    #
    # 다음 사항이 모두 만족될 때에만 image와 matchImage가 매치되었다고 판단한다.
    # - 양쪽의 도메인 파트 수가 동일하고, 각 파트가 매치됨
    # - imageMatch의 URL 경로가 타겟 이미지 URL 경로의 접두사임
    # - imageMatch가 포트를 포함하면, 이미지 쪽에 기재된 포트와 매치됨
    #
    # matchImages 예시는 다음과 같다.
    # - 123456789.dkr.ecr.us-east-1.amazonaws.com
    # - *.azurecr.io
    # - gcr.io
    # - *.*.registry.io
    # - registry.io:8080/path
    matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    # defaultCacheDuration 필드는 캐시 기간이 플러그인 응답에 명시되지 않은 경우에 
    # 해당 플러그인이 자격 증명을 인메모리 캐시에 보관할 기본 기간을 지정한다. 이 필드는 필수이다.
    defaultCacheDuration: "12h"
    # apiVersion 필드는 CredentialProviderRequest를 실행할 때 기재될 입력 버전을 지정하는 필수 필드이다. 
    # 응답 CredentialProviderResponse는 입력과 동일한 인코딩 버전을 사용해야 한다. 현재 지원되는 값은 다음과 같다.
    # - credentialprovider.kubelet.k8s.io/v1
    apiVersion: credentialprovider.kubelet.k8s.io/v1
    # args 필드는 커맨드를 실행할 때 전달할 인자를 지정하는 필드이다.
    # 이 필드는 선택사항이다.
    args:
      - get-credentials
    # env 필드는 프로세스에 노출할 추가적인 환경 변수를 기재하는 필드이다. 
    # 이들은 호스트의 환경 변수 및 
    # client-go가 플러그인에 인자를 전달하기 위해 사용하는 변수와 합산된다.
    # 이 필드는 선택사항이다.
    env:
      - name: AWS_PROFILE
        value: example_profile
```

`providers` 필드는 kubelet에서 사용되는 활성화된 플러그인의 목록으로, 각 항목에는 몇 가지 필수 필드가 있다.

* `name`: `--image-credential-provider-bin-dir`로 전달된 디렉터리에 존재하는
  실행 가능한 바이너리의 이름과 반드시 일치해야 하는 플러그인의 이름.
* `matchImages`: 이 공급자를 호출할지 결정하기 위해 이미지를 대조하는 데 사용되는 문자열 목록.
  아래의 더 많은 내용 참조.
* `defaultCacheDuration`: 플러그인에 의해 캐시 기간이 지정되지 않으면,
  kubelet이 메모리에 자격 증명을 캐시하는 기본 기간.
* `apiVersion`: kubelet과 exec 플러그인이 통신할 때 사용하는 API 버전.

각 자격 증명 공급자에게 인수(arg) 및 환경 변수도 선택적으로 제공할 수 있다.
플러그인에 필요한 인수 및 환경 변수 집합을 확인하려면 해당 플러그인 구현자에게 문의하는 것이 좋다.

#### 이미지 매칭 구성

kubelet은 각 자격 증명 공급자에 대한 `matchImages` 필드를 사용해 파드가 사용하고 있는 특정 이미지에 대해 플러그인을 호출할지 결정한다.
Globs는 도메인에서 사용할 수 있지만 포트나 경로에서는 사용할 수 없다.
Glob은 `*.k8s.io`이나 `k8s.*.io` 같은 서브도메인과 `k8s.*`와 같은 최상위 도메인으로 지원된다.
또한, `app*.k8s.io`와 같은 부분 서브도메인을 매칭하는 것도 지원된다.
각 Glob은 단일 하위 도메인 세그먼트만 일치할 수 있으므로 `*.io`는 `*.k8s.io`과 일치하지 않는다.

아래와 같은 경우 이미지 이름과 `matchImage` 항목 사이에 매치가 존재한다.

* 둘 다 동일한 수의 도메인 파트를 포함하고 있으며 각 파트가 매치한다.
* 매치 이미지의 URL 경로는 대상 이미지 URL 경로의 접두사여야 한다.
* imageMatch에 포트가 포함되어 있으면 해당 포트는 이미지에서도 매치해야 한다.

`matchImages` 패턴의 예시 값은 아래와 같다.

* `123456789.dkr.ecr.us-east-1.amazonaws.com`
* `*.azurecr.io`
* `gcr.io`
* `*.*.registry.io`
* `foo.registry.io:8080/path`

## {{% heading "whatsnext" %}}

* [kubelet 구성 API(v1) 레퍼런스](/docs/reference/config-api/kubelet-config.v1/)에서
  `CredentialProviderConfig`에 대한 세부 정보 읽기
* [kubelet 자격 증명 공급자 API (v1) 레퍼런스](/docs/reference/config-api/kubelet-credentialprovider.v1/) 읽기

