---
title: kustomize를 사용하여 시크릿 관리
content_type: task
weight: 30
description: kustomization.yaml 파일을 사용하여 시크릿 오브젝트 생성.
---

<!-- overview -->

쿠버네티스 v1.14부터 `kubectl`은 
[Kustomize를 이용한 쿠버네티스 오브젝트의 선언형 관리](/ko/docs/tasks/manage-kubernetes-objects/kustomization/)를 지원한다.
Kustomize는 시크릿 및 컨피그맵을 생성하기 위한 리소스 생성기를 제공한다.
Kustomize 생성기는 디렉토리 내의 `kustomization.yaml` 파일에 지정되어야 한다.
시크릿 생성 후 `kubectl apply`를 통해 API
서버에 시크릿을 생성할 수 있다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Kustomization 파일 생성

`kustomization.yaml` 파일에 다른 기존 파일을 참조하는 
`secretGenerator`를 정의하여 시크릿을 생성할 수 있다.
예를 들어 다음 kustomization 파일은
`./username.txt` 및 `./password.txt` 파일을 참조한다.

```yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
```

`kustomization.yaml` 파일에 리터럴을 명시하여 `secretGenerator`를
정의할 수도 있다.
예를 들어 다음 `kustomization.yaml` 파일에는
각각 `username`과 `password`에 대한 두 개의 리터럴이 포함되어 있다.

```yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=1f2d1e2e67df
```

`kustomization.yaml` 파일에 `.env` 파일을 명시하여
`secretGenerator`를 정의할 수도 있다.
예를 들어 다음 `kustomization.yaml` 파일은
`.env.secret` 파일에서 데이터를 가져온다.

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```

모든 경우에 대해, 값을 base64로 인코딩하지 않아도 된다.

## 시크릿 생성

다음 명령을 실행하여 시크릿을 생성한다.

```shell
kubectl apply -k .
```

출력은 다음과 유사하다.

```
secret/db-user-pass-96mffmfh4k created
```

시크릿이 생성되면 시크릿 데이터를 해싱하고
이름에 해시 값을 추가하여 시크릿 이름이 생성된다. 이렇게 함으로써
데이터가 수정될 때마다 시크릿이 새롭게 생성된다.

## 생성된 시크릿 확인

시크릿이 생성된 것을 확인할 수 있다.

```shell
kubectl get secrets
```

출력은 다음과 유사하다.

```
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s
```

다음 명령을 실행하여 시크릿에 대한 상세 사항을 볼 수 있다.

```shell
kubectl describe secrets/db-user-pass-96mffmfh4k
```

출력은 다음과 유사하다.

```
Name:            db-user-pass-96mffmfh4k
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

`kubectl get` 및 `kubectl describe` 명령은 기본적으로 `시크릿`의 내용을 표시하지 않는다.
이는 `시크릿`이 실수로 구경꾼에게 노출되는 것을 방지하기 위한 것으로,
또는 터미널 로그에 저장되지 않는다.
인코딩된 데이터의 실제 내용을 확인하려면 다음을 참조한다.
[시크릿 디코딩](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/#decoding-secret).

## 삭제

생성한 시크릿을 삭제하려면 다음 명령을 실행한다.

```shell
kubectl delete secret db-user-pass-96mffmfh4k
```

<!-- Optional section; add links to information related to this topic. -->
## {{% heading "whatsnext" %}}

- [시크릿 개념](/ko/docs/concepts/configuration/secret/)에 대해 자세히 알아보기
- [`kubectl` 커맨드을 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/) 방법 알아보기
- [환경 설정 파일을 사용하여 시크릿을 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-config-file/)하는 방법 알아보기
