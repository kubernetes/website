---
title: kubectl을 사용한 시크릿(Secret) 관리
content_type: task
weight: 10
description: kubectl 커맨드를 사용하여 시크릿 오브젝트를 생성.
---

<!-- overview -->

이 페이지는 `kubectl` 커맨드라인 툴을 이용하여 쿠버네티스
{{<glossary_tooltip text="시크릿" term_id="secret">}}을
생성, 편집, 관리, 삭제하는 방법을 보여준다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 시크릿 생성

`시크릿` 오브젝트는 파드가 서비스에 접근하기 위해 사용하는 자격 증명과 같은
민감한 데이터를 저장한다. 예를 들어 데이터베이스에 접근하는데 필요한 사용자 이름과 비밀번호를
저장하기 위해서 시크릿이 필요할 수 있다.

명령어를 통해 원시 데이터를 바로 보내거나, 파일에 자격 증명을 저장하고 명령어로 전달하는 방식으로
시크릿을 생성할 수 있다. 다음 명령어는 사용자 이름을 `admin`으로
비밀번호는 `S!B\*d$zDsb=`으로 저장하는 시크릿을 생성한다.

### 원시 데이터 사용

다음 명령어를 실행한다.

```shell
kubectl create secret generic db-user-pass \
    --from-literal=username=admin \
    --from-literal=password='S!B\*d$zDsb='
```
문자열에서 `$`, `\`, `*`, `=` 및 `!`과 같은 특수 문자를 이스케이프(escape)하기
위해서는 작은따옴표 `''`를 사용해야 한다. 그렇지 않으면 셸은 이런 문자들을
해석한다.

### 소스 파일 사용

1. base64로 인코딩된 자격 증명의 값들을 파일에 저장한다.

   ```shell
   echo -n 'admin' | base64 > ./username.txt
   echo -n 'S!B\*d$zDsb=' | base64 > ./password.txt
   ```
   `-n` 플래그는 생성된 파일이 텍스트 끝에 추가적인 개행 문자를 갖지
   않도록 보장한다. 이는 `kubectl`이 파일을 읽고 내용을 base64
   문자열로 인코딩할 때 개행 문자도 함께 인코딩될 수 있기 때문에
   중요하다. 파일에 포함된 문자열에서 특수 문자를 이스케이프 할
   필요는 없다.

1. `kubectl` 명령어에 파일 경로를 전달한다.

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=./username.txt \
       --from-file=./password.txt
   ```
   기본 키 이름은 파일 이름이다. 선택적으로 `--from-file=[key=]source`를 사용하여
   키 이름을 설정할 수 있다. 예제:

   ```shell
   kubectl create secret generic db-user-pass \
       --from-file=username=./username.txt \
       --from-file=password=./password.txt
   ```

두 방법 모두 출력은 다음과 유사하다.

```
secret/db-user-pass created
```

### 시크릿 확인 {#verify-the-secret}

시크릿이 생성되었는지 확인한다.

```shell
kubectl get secrets
```

출력은 다음과 유사하다.

```
NAME              TYPE       DATA      AGE
db-user-pass      Opaque     2         51s
```

시크릿의 상세 사항을 보자.

```shell
kubectl describe secret db-user-pass
```

출력은 다음과 유사하다.

```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

`kubectl get` 및 `kubectl describe` 명령은
기본적으로 `시크릿`의 내용을 표시하지 않는다. 이는 `시크릿`이 실수로 노출되거나
터미널 로그에 저장되는 것을 방지하기 위한 것이다.

### 시크릿 디코딩 {#decoding-secret}

1.  생성한 시크릿을 보려면 다음 명령을 실행한다.

    ```shell
    kubectl get secret db-user-pass -o jsonpath='{.data}'
    ```

    출력은 다음과 유사하다.

    ```json
    { "password": "UyFCXCpkJHpEc2I9", "username": "YWRtaW4=" }
    ```

1.  `password` 데이터를 디코딩한다.

    ```shell
    echo 'UyFCXCpkJHpEc2I9' | base64 --decode
    ```

    출력은 다음과 유사하다.

    ```
    S!B\*d$zDsb=
    ```

    {{< caution >}}
    이 예시는 문서화를 위한 것이다. 실제로,
    이 방법은 인코딩된 데이터가 포함된 명령어를 셸 히스토리에 남기게 되는 문제를 야기할 수 있다.
    당신의 컴퓨터에 접근할 수 있는 사람은 누구나 그 명령어를 찾아 그 비밀 정보를
    디코드할 수 있다. 더 나은 접근법은 시크릿을 보는 명령어와 디코드하는 명령어를
    조합하여 사용하는 것이다.
    {{< /caution >}}

    ```shell
    kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
    ```

## 시크릿 편집 {#edit-secret}

존재하는 `시크릿` 오브젝트가 [수정 불가능한(immutable)](/ko/docs/concepts/configuration/secret/#secret-immutable)이
아니라면 편집할 수 있다. 시크릿을 편집하기 위해서  
다음 명령어를 실행한다.

```shell
kubectl edit secrets <secret-name>
```

이 명령어는 기본 편집기를 열고 다음 예시와 같이 `data` 필드의 base64로 인코딩된
시크릿의 값들을 업데이트할 수 있도록 허용한다.

```yaml
# 아래 오브젝트를 편집하길 바란다. '#'로 시작하는 줄은 무시될 것이고,
# 빈 파일은 편집을 중단시킬 것이다. 이 파일을 저장하는 동안 오류가 발생한다면
# 이 파일은 관련된 오류와 함께 다시 열린다.
#
apiVersion: v1
data:
  password: UyFCXCpkJHpEc2I9
  username: YWRtaW4=
kind: Secret
metadata:
  creationTimestamp: "2022-06-28T17:44:13Z"
  name: db-user-pass
  namespace: default
  resourceVersion: "12708504"
  uid: 91becd59-78fa-4c85-823f-6d44436242ac
type: Opaque
```

## 삭제

시크릿을 삭제하기 위해서 다음 명령어를 실행한다.

```shell
kubectl delete secret db-user-pass
```

## {{% heading "whatsnext" %}}

- [시크릿 개념](/ko/docs/concepts/configuration/secret/)에 대해 자세히 알아보기
- [환경 설정 파일을 사용하여 시크릿을 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-config-file/)하는 방법 알아보기
- [kustomize를 사용하여 시크릿을 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/)하는 방법 알아보기