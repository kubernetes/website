---
title: kubectl을 이용한 시크릿 관리
content_type: task
weight: 10
description: kubectl 커멘드를 이용하여 시크릿 오브젝트를 생성
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 시크릿 생성

`시크릿`에는 파드가 데이터베이스에 접근하는 데 필요한 사용자 자격 증명이 포함될 수 있습니다.
예를 들어 데이터베이스 연결 문자열은 사용자 이름과 암호로 구성됩니다.
사용자 이름은 './username.txt' 파일에, 비밀번호는
'./password.txt' 파일에 로컬 컴퓨터에 저장할 수 있습니다.

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```
이 명령에서 `-n` 플래그는 생성된 파일의
텍스트 끝에 추가 개행 문자가 없도록 합니다. `kubectl`이 파일을 읽고
내용을 base64 문자열로 인코딩할 때 추가 개행 문자도 인코딩되기 때문에 
이것은 중요합니다.

`kubectl create secret` 명령은 이러한 파일들을 시크릿으로 패키징하고
API 서버에 오브젝트를 생성합니다.

```shell
kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt
```

출력은 다음과 유사합니다:

```
secret/db-user-pass created
```

기본 키 이름은 파일 이름입니다. 선택적으로 `--from-file=[key=]source`를 사용하여 키 이름을 설정할 수 있습니다.
예제:

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

파일에 포함하는 암호 문자열에서
특수 문자를 이스케이프할 필요가 없습니다.

`--from-literal=<key>=<value>` 태그를 사용하여 시크릿 데이터를 제공할 수도 있습니다.
이 태그는 여러 키-값 쌍을 제공하기 위해 두 번 이상 지정할 수 있습니다.
`$`, `\`, `*`, `=` 및 `!`와 같은 특수 문자는
[shell](https://en.wikipedia.org/wiki/Shell_(computing))에서 해석하고
이스케이프해야 합니다.

대부분의 셸에서 암호를 이스케이프하는 가장 쉬운 방법은 암호를 둘러싸는 것입니다.
작은따옴표(`'`). 예를 들어, 비밀번호가 `S!B\*d$zDsb=`인 경우,
다음 커멘드를 실행하십시오:

```shell
kubectl create secret generic dev-db-secret \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

## 시크릿 확인

시크릿이 생성 되었는지 확인:

```shell
kubectl get secrets
```

출력은 다음과 유사합니다:

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

`시크릿`에 대한 설명을 볼 수 있습니다:

```shell
kubectl describe secrets/db-user-pass
```

출력은 다음과 유사합니다:

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
기본적으로 `시크릿`의 내용을 표시하지 않습니다. 이는 `시크릿`이 실수로 노출되거나
터미널 로그에 저장되는 것을 방지하기 위한 것입니다.

## 시크릿 디코딩  {#decoding-secret}

생성한 시크릿을 보려면 다음 명령을 실행합니다:

```shell
kubectl get secret db-user-pass -o jsonpath='{.data}'
```

출력은 다음과 유사합니다:

```json
{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="}
```

이제 `password` 데이터를 디코딩할 수 있습니다.:

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

출력은 다음과 유사합니다:

```
1f2d1e2e67df
```

## 정리

생성한 시크릿 삭제:

```shell
kubectl delete secret db-user-pass
```

<!-- discussion -->

## {{% heading "whatsnext" %}}

- [시크릿 개념](/ko/docs/concepts/configuration/secret/)에 대해 자세히 알아보기
- [`kubectl` 커멘드을 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kubectl/)방법 알아보기
- [kustomize를 사용하여 시크릿 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/)방법 알아보기
