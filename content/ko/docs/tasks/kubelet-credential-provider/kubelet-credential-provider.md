---
title: kubelet 이미지 자격 증명 공급자 구성하기
# reviewers:
# - liggitt
# - cheftako
description: kubelet의 이미지 자격 증명 공급자 플러그인을 구성한다.
content_type: task
---

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

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

* kubelet 이미지 자격 증명 공급자는 알파(alpha) 기능으로 v1.20에서 도입되었다.
  이 기능을 구동하려면, 다른 알파 기능과 마찬가지로 기능 게이트(feature gate) `KubeletCredentialProviders`가 kubelet에서만 활성화되어야 한다.
* 자격 증명 공급자 exec 플러그인에 대한 구현체(implementation)가 필요하다. 이를 위해 자체 플러그인을 구축하거나 클라우드 공급자가 제공하는 플러그인을 사용할 수 있다.

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
apiVersion: kubelet.config.k8s.io/v1alpha1
kind: CredentialProviderConfig
# providers is a list of credential provider plugins that will be enabled by the kubelet.
# Multiple providers may match against a single image, in which case credentials
# from all providers will be returned to the kubelet. If multiple providers are called
# for a single image, the results are combined. If providers return overlapping
# auth keys, the value from the provider earlier in this list is used.
providers:
  # name is the required name of the credential provider. It must match the name of the
  # provider executable as seen by the kubelet. The executable must be in the kubelet's
  # bin directory (set by the --image-credential-provider-bin-dir flag).
  - name: ecr
    # matchImages is a required list of strings used to match against images in order to
    # determine if this provider should be invoked. If one of the strings matches the
    # requested image from the kubelet, the plugin will be invoked and given a chance
    # to provide credentials. Images are expected to contain the registry domain
    # and URL path.
    #
    # Each entry in matchImages is a pattern which can optionally contain a port and a path.
    # Globs can be used in the domain, but not in the port or the path. Globs are supported
    # as subdomains like '*.k8s.io' or 'k8s.*.io', and top-level-domains such as 'k8s.*'.
    # Matching partial subdomains like 'app*.k8s.io' is also supported. Each glob can only match
    # a single subdomain segment, so *.io does not match *.k8s.io.
    #
    # A match exists between an image and a matchImage when all of the below are true:
    # - Both contain the same number of domain parts and each part matches.
    # - The URL path of an imageMatch must be a prefix of the target image URL path.
    # - If the imageMatch contains a port, then the port must match in the image as well.
    #
    # Example values of matchImages:
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
    # defaultCacheDuration is the default duration the plugin will cache credentials in-memory
    # if a cache duration is not provided in the plugin response. This field is required.
    defaultCacheDuration: "12h"
    # Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
    # MUST use the same encoding version as the input. Current supported values are:
    # - credentialprovider.kubelet.k8s.io/v1alpha1
    apiVersion: credentialprovider.kubelet.k8s.io/v1alpha1
    # Arguments to pass to the command when executing it.
    # +optional
    args:
      - get-credentials
    # Env defines additional environment variables to expose to the process. These
    # are unioned with the host's environment, as well as variables client-go uses
    # to pass argument to the plugin.
    # +optional
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

* [kubelet 구성 API(v1alpha1) 레퍼런스](/docs/reference/config-api/kubelet-config.v1alpha1/)에서
  `CredentialProviderConfig`에 대한 세부 정보 읽기
* [kubelet 자격 증명 공급자 API (v1alpha1) 레퍼런스](/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/) 읽기

