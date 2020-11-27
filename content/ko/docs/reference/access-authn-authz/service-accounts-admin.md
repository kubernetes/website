---
title: 서비스 어카운트 관리하기
content_type: concept
weight: 50
---

<!-- overview -->
이것은 서비스 어카운트에 대한 클러스터 관리자 안내서다.
독자는 [쿠버네티스 서비스 어카운트 설정](/docs/tasks/configure-pod-container/configure-service-account/)에 익숙하다고 가정한다.

인증 및 사용자 어카운트에 대한 지원은 아직 준비 중이다.
가끔은 서비스 어카운트를 더 잘 설명하기 위해 준비 중인 기능을 참조한다.


<!-- body -->
## 사용자 어카운트와 서비스 어카운트 비교

쿠버네티스는 여러 가지 이유로 사용자 어카운트와 서비스 어카운트의 개념을
구분한다.

  - 사용자 어카운트는 사람을 위한 것이다. 서비스 어카운트는 파드에서 실행되는 프로세스를
    위한 것이다.
  - 사용자 어카운트는 전역을 대상으로 고려된다.
    클러스터의 모든 네임스페이스에 걸쳐 이름이 고유해야 하며, 향후 사용자 리소스는 네임스페이스에 할당되지 않는다.
    서비스 어카운트는 네임스페이스에 할당된다.
  - 일반적으로 클러스터의 사용자 어카운트는 기업 데이터베이스로부터 동기화될 수 있으며,
    여기서 새로운 사용자 어카운트를 생성하려면 특별한 권한이 필요하며 복잡한 비즈니스 프로세스에 연결된다.
    서비스 어카운트 생성은
    클러스터 사용자가 특정 작업(즉, 최소 권한 원칙)을 위한 서비스 어카운트를 만들 수 있도록
    보다 가볍게 만들어졌다.
  - 사람과 서비스 어카운트에 대한 감사 항목은 다를 수 있다.
  - 복잡한 시스템의 설정들은 그 시스템의 구성요소에 대한 다양한 서비스 어카운트 정의를 포함할 수 있다.
    서비스 어카운트는 임시(ad-hoc)로 만들 수도 있고 네임스페이스에 할당된 이름을 가질 수도 있기 때문에
    이러한 설정은 이식성이 좋다.

## 서비스 어카운트 자동화

서비스 계정 자동화를 구현하기 위해 세 가지 개별 요소가 협력한다.

  - 서비스 어카운트 어드미션 컨트롤러
  - 토큰 컨트롤러
  - 서비스 어카운트 컨트롤러

### 서비스 어카운트 어드미션 컨트롤러

파드 수정은 [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)
라는 플러그인을 통해 구현된다. 이것은 apiserver의 일부이다.
파드가 생성되거나 수정될 때 파드를 수정하기 위해 동기적으로 동작한다.
이 플러그인이 활성 상태(대부분의 배포에서 기본값)인 경우 파드 생성 또는 수정 시 다음 작업을 수행한다.

  1. 파드에 `ServiceAccount`가 없다면 `ServiceAccount`를 `default`로 설정한다.
  1. 파드에 참조되는 `ServiceAccount`가 있도록 하고, 그렇지 않으면 이를 거부한다.
  1. 파드에 `ImagePullSecrets`이 없는 경우 `ServiceAccount`의 `ImagePullSecrets`이 파드에 추가된다.
  1. 파드에 API 접근 토큰이 포함된 `volume`을 추가한다.
  1. `/var/run/secrets/kubernetes.io/serviceaccount`에 마운트된 파드의 각 컨테이너에 `volumeSource`를 추가한다.

v1.13부터 `BoundServiceAccountTokenVolume` 기능 게이트가 활성화되면 서비스 어카운트 볼륨을 프로젝티드 볼륨으로 마이그레이션할 수 있다.
서비스 어카운트 토큰은 1시간 후에 만료되거나 파드가 삭제된다.
[프로젝티드 볼륨](/docs/tasks/configure-pod-container/configure-projected-volume-storage/)에 대한 자세한 내용을 참조한다.

### 토큰 컨트롤러

토큰컨트롤러는 컨트롤러 매니저의 일부로 실행된다. 이것은 비동기적으로 동작한다. 토큰 컨트롤러는,

- 서비스 어카운트 생성을 지켜보고 API에 접근할 수 있는 시크릿을 생성한다.
- 서비스 어카운트 삭제를 지켜보고 해당하는 모든 서비스 어카운트 토큰 시크릿을 삭제한다.
- 시크릿 추가를 지켜보고 참조된 서비스 어카운트가 존재하는지 확인하고 필요한 경우 시크릿에 토큰을 추가한다.
- 시크릿 삭제를 지켜보고 필요한 경우 해당 서비스 어카운트에서 참조를 제거한다.

서비스 어카운트 개인키 파일은 `--service-account-private-key-file` 옵션을 사용하여 컨트롤러 매니저의 토큰 컨트롤러에 전달해야 한다.
개인키는 생성된 서비스 어카운트 토큰에 서명하는 데 사용될 것이다.
마찬가지로 `--service-account-key-file` 옵션을 사용하여 해당 공개키를 쿠버네티스 API 서버에 전달해야 한다.
공개키는 인증 과정에서 토큰을 검증하는 데 사용될 것이다.

#### 추가적인 API 토큰 생성

컨트롤러 루프는 API 토큰이 포함된 시크릿이 각 서비스 어카운트에 존재하도록 보장한다.
서비스 어카운트에 대한 추가적인 API 토큰을 생성하기 위해
서비스 어카운트를 참조하는 어노테이션과 함께 `ServiceAccountToken` 유형의 시크릿을 생성하면
컨트롤러가 새로 생성된 토큰으로 갱신한다.

secret.json:

```json
{
    "kind": "Secret",
    "apiVersion": "v1",
    "metadata": {
        "name": "mysecretname",
        "annotations": {
            "kubernetes.io/service-account.name": "myserviceaccount"
        }
    },
    "type": "kubernetes.io/service-account-token"
}
```

```shell
kubectl create -f ./secret.json
kubectl describe secret mysecretname
```

#### 서비스 어카운트 토큰 삭제/무효화

```shell
kubectl delete secret mysecretname
```

### 서비스 어카운트 컨트롤러

서비스 어카운트 컨트롤러는 네임스페이스에 있는 서비스 어카운트를 관리하고
"default"라는 이름의 서비스 어카운트가 모든 활성 네임스페이스에 존재하는지 확인한다.
