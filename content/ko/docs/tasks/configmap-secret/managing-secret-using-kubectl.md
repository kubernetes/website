---
title: kubectl을 사용한 시크릿 관리
content_type: task
weight: 10
description: kubectl 커맨드를 사용하여 시크릿 오브젝트를 생성.
---

<!-- overview -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 시크릿 생성

`시크릿`에는 파드가 데이터베이스에 접근하는 데 필요한 사용자 자격 증명이 포함될 수 있다.
예를 들어 데이터베이스 연결 문자열은 사용자 이름과 암호로 구성된다.
사용자 이름은 로컬 컴퓨터의 `./username.txt` 파일에, 비밀번호는
`./password.txt` 파일에 저장할 수 있다.

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```
이 명령에서 `-n` 플래그는 생성된 파일의
텍스트 끝에 추가 개행 문자가 포함되지 않도록 해 준다. 이는 `kubectl`이 파일을 읽고
내용을 base64 문자열로 인코딩할 때 개행 문자도 함께 인코딩될 수 있기 때문에 
중요하다.

`kubectl create secret` 명령은 이러한 파일들을 시크릿으로 패키징하고
API 서버에 오브젝트를 생성한다.

```shell
kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt
```

출력은 다음과 유사하다.

```
secret/db-user-pass created
```

기본 키 이름은 파일 이름이다. 선택적으로 `--from-file=[key=]source`를 사용하여 키 이름을 설정할 수 있다.
예제:

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

파일에 포함하는 암호 문자열에서
특수 문자를 이스케이프하지 않아도 된다.

`--from-literal=<key>=<value>` 태그를 사용하여 시크릿 데이터를 제공할 수도 있다.
이 태그는 여러 키-값 쌍을 제공하기 위해 두 번 이상 지정할 수 있다.
`$`, `\`, `*`, `=` 및 `!`와 같은 특수 문자는
[shell](https://en.wikipedia.org/wiki/Shell_(computing))에 해석하고 처리하기 때문에
이스케이프할 필요가 있다.

대부분의 셸에서 암호를 이스케이프하는 가장 쉬운 방법은 암호를 작은따옴표(`'`)로 둘러싸는 것이다.
예를 들어, 비밀번호가 `S!B\*d$zDsb=`인 경우,
다음 커맨드를 실행한다.

```shell
kubectl create secret generic db-user-pass \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

## 시크릿 확인

시크릿이 생성되었는지 확인한다.

```shell
kubectl get secrets
```

출력은 다음과 유사하다.

```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

다음 명령을 실행하여 `시크릿`에 대한 상세 사항을 볼 수 있다.

```shell
kubectl describe secrets/db-user-pass
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

## 시크릿 디코딩  {#decoding-secret}

생성한 시크릿을 보려면 다음 명령을 실행한다.

```shell
kubectl get secret db-user-pass -o jsonpath='{.data}'
```

출력은 다음과 유사하다.

```json
{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="}
```

이제 `password` 데이터를 디코딩할 수 있다.

```shell
# 이 예시는 문서화를 위한 것이다. 
# 아래와 같은 방법으로 이를 수행했다면, 
# 'MWYyZDFlMmU2N2Rm' 데이터가 셸 히스토리에 저장될 수 있다. 
# 당신의 컴퓨터에 접근할 수 있는 사람이 당신 몰래 저장된 명령을 찾아 
# 시크릿을 base-64 디코드할 수도 있다. 
# 따라서 이 페이지의 아래 부분에 나오는 다른 단계들과 조합하는 것이 좋다.
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

출력은 다음과 유사하다.

```
1f2d1e2e67df
```

인코딩된 시크릿 값이 셸 히스토리에 저장되는 것을 피하려면, 
다음의 명령을 실행할 수 있다.

```shell
kubectl get secret db-user-pass -o jsonpath='{.data.password}' | base64 --decode
```

출력은 위의 경우와 유사할 것이다.

## 삭제

생성한 시크릿을 삭제하려면 다음 명령을 실행한다.

```shell
kubectl delete secret db-user-pass
```

<!-- discussion -->

## {{% heading "whatsnext" %}}

- [시크릿 개념](/ko/docs/concepts/configuration/secret/)에 대해 자세히 알아보기
- [환경 설정 파일을 사용하여 시크릿을 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-config-file/)하는 방법 알아보기
- [kustomize를 사용하여 시크릿을 관리](/ko/docs/tasks/configmap-secret/managing-secret-using-kustomize/)하는 방법 알아보기
