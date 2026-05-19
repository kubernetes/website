---
title: kustomize를 사용하여 시크릿(Secret) 관리
content_type: task
weight: 30
description: kustomization.yaml 파일을 사용하여 시크릿 오브젝트 생성.
---

<!-- overview -->

`kubectl`은 시크릿과 컨피그맵(ConfigMap)을 관리하기위해 [Kustomize를 이용한 쿠버네티스 오브젝트의 선언형 관리](/ko/docs/tasks/manage-kubernetes-objects/kustomization/)를
지원한다. Kustomize를 이용하여 *리소스 생성기*를 생성한다. 이는 `kubectl`을
사용하여 API 서버에 적용할 수 있는 시크릿을 생성한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 시크릿 생성

`kustomization.yaml` 파일에 다른 기존 파일, `.env` 파일 및
리터럴(literal) 값들을 참조하는 `secretGenerator`를 정의하여 시크릿을 생성할 수 있다.
예를 들어 다음 명령어는 사용자 이름 `admin`과 비밀번호 `1f2d1e2e67df`
를 위해 Kustomization 파일을 생성한다.

### Kustomization 파일 생성

{{< tabs name="Secret data" >}}
{{< tab name="Literals" codelang="yaml" >}}
secretGenerator:
- name: database-creds
  literals:
  - username=admin
  - password=1f2d1e2e67df
{{< /tab >}}
{{% tab name="Files" %}}
1.  base64로 인코딩된 자격 증명의 값들을 파일에 저장한다.

    ```shell
    echo -n 'admin' > ./username.txt
    echo -n '1f2d1e2e67df' > ./password.txt
    ```
    `-n` 플래그는 파일의 끝에 개행 문자가 존재하지 않는 것을
    보장한다.

1.  `kustomization.yaml` 파일 생성:

    ```yaml
    secretGenerator:
    - name: database-creds
      files:
      - username.txt
      - password.txt
    ```
{{% /tab %}}}
{{% tab name=".env files" %}}
`kustomization.yaml` 파일에 `.env` 파일을 명시하여 시크릿 생성자를
정의할 수도 있다. 예를 들어 다음 `kustomization.yaml` 파일은
`.env.secret` 파일에서 데이터를 가져온다.

```yaml
secretGenerator:
- name: db-user-pass
  envs:
  - .env.secret
```
{{% /tab %}}
{{< /tabs >}}

모든 경우에 대해, 값을 base64로 인코딩하지 않아도 된다. YAML 파일의 이름은
**무조건** `kustomization.yaml` 또는 `kustomization.yml` 이어야 한다.

### kustomization 파일 적용

시크릿을 생성하기 위해서 kustomization 파일을 포함하는 디렉토리에 적용한다.

```shell
kubectl apply -k <directory-path>
```

출력은 다음과 유사하다.

```
secret/database-creds-5hdh7hhgfk created
```

시크릿이 생성되면 시크릿 데이터를 해싱하고
이름에 해시 값을 추가하여 시크릿 이름이 생성된다. 이렇게 함으로써
데이터가 수정될 때마다 시크릿이 새롭게 생성된다.

시크릿이 생성되었는지 확인하고 시크릿 데이터를 디코딩하려면, 다음을 참조한다.
[kubectl을 사용한 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/#verify-the-secret).

## 시크릿 편집 {#edit-secret}

1.  `kustomization.yaml` 파일에서 `password`와 같은 데이터를 수정한다.
1.  kustomization 파일을 포함하는 디렉토리에 적용한다:

    ```shell
    kubectl apply -k <directory-path>
    ```

    출력은 다음과 유사하다.

    ```
    secret/db-user-pass-6f24b56cc8 created
    ```

편집된 시크릿은 존재하는 `Secret` 오브젝트를 업데이트하는 것이 아니라
새로운 `Secret` 오브젝트로 생성된다. 따라서 파드에서 시크릿에 대한 참조를
업데이트해야 한다.

## 삭제

시크릿을 삭제하려면 `kubectl`을 사용한다.

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- [시크릿 개념](/ko/docs/concepts/configuration/secret/)에 대해 자세히 알아보기
- [kubectl을 사용한 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/) 방법 알아보기
- [환경 설정 파일을 사용한 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-config-file/) 방법 알아보기