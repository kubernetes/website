---
title: 권장 레이블
content_type: concept
weight: 100
---

<!-- overview -->
kubectl과 대시보드와 같은 많은 도구들로 쿠버네티스 오브젝트를 시각화 하고 관리할 수 있다.
공통 레이블 셋은 모든 도구들이 이해할 수 있는 공통의 방식으로 오브젝트를 식별하고
도구들이 상호 운용적으로 작동할 수 있도록 한다.

권장 레이블은 지원 도구 외에도 쿼리하는 방식으로
애플리케이션을 식별하게 한다.


<!-- body -->
메타데이터는 _애플리케이션_ 의 개념을 중심으로 정리된다.
쿠버네티스는 플랫폼 서비스(PaaS)가 아니며 애플리케이션에 대해 공식적인 개념이 없거나 강요하지 않는다.
대신 애플리케이션은 비공식적이며 메타데이터로 설명된다.
애플리케이션에 포함된 정의는 유연하다.

{{< note >}}
메타데이터들은 권장하는 레이블이다. 애플리케이션을 보다 쉽게 관리할 수 있지만
코어 도구에는 필요하지 않다.
{{< /note >}}

공유 레이블과 주석에는 공통 접두사인 `app.kubernetes.io` 가 있다.
접두사가 없는 레이블은 사용자가 개인적으로 사용할 수 있다.
공유 접두사는 공유 레이블이 사용자 정의 레이블을 방해하지 않도록 한다.

## 레이블

레이블을 최대한 활용하려면 모든 리소스 오브젝트에
적용해야 한다.

| 키                                  | 설명                  | 예시     | 타입 |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | 애플리케이션 이름 | `mysql` | 문자열 |
| `app.kubernetes.io/instance`        | 애플리케이션의 인스턴스를 식별하는 고유한 이름 | `mysql-abcxzy` | 문자열 |
| `app.kubernetes.io/version`         | 애플리케이션의 현재 버전 (예: a semantic version, revision hash 등.) | `5.7.21` | 문자열 |
| `app.kubernetes.io/component`       | 아키텍처 내 구성요소 | `database` | 문자열 |
| `app.kubernetes.io/part-of`         | 이 애플리케이션의 전체 이름 | `wordpress` | 문자열 |
| `app.kubernetes.io/managed-by`      | 애플리케이션의 작동을 관리하는 데 사용되는 도구 | `helm` | 문자열 |

위 레이블의 실제 예시는 다음 {{< glossary_tooltip text="스테이트풀셋" term_id="statefulset" >}} 오브젝트를 고려한다.

```yaml
# 아래는 전체 명세의 일부분이다
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

## 애플리케이션과 애플리케이션 인스턴스

애플리케이션은 동일한 쿠버네티스 클러스터에,
심지어는 동일한 네임스페이스에도 한번 또는 그 이상 설치될 수 있다. 예를 들어, 하나의 쿠버네티스 클러스터에
WordPress가 여러 번 설치되어 각각 서로 다른 웹사이트를 서비스할 수 있다.

애플리케이션의 이름과 애플리케이션 인스턴스 이름은 별도로 기록된다.
예를 들어 WordPress는 애플리케이션 이름으로 `app.kubernetes.io/name` 이라는 레이블에 `wordpress` 라는 값을 가지며,
애플리케이션 인스턴스 이름으로는 `app.kubernetes.io/instance` 라는 레이블에
`wordpress-abcxzy` 라는 값을 가진다. 이를 통해 애플리케이션과 애플리케이션 인스턴스를
식별할 수 있다. 모든 애플리케이션 인스턴스는 고유한 이름을 가져야 한다.

## 예시

위 레이블을 사용하는 다른 방식에 대한 예시는 다양한 복잡성이 있다.

### 단순한 스테이트리스 서비스

`Deployment` 와 `Service` 오브젝트를 통해 배포된 단순한 스테이트리스 서비스의 경우를 보자. 다음 두 식별자는 레이블을 가장 간단한 형태로 사용하는 방법을 나타낸다.

`Deployment` 는 애플리케이션을 실행하는 파드를 감시하는 데 사용한다.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

`Service`는 애플리케이션을 노출하기 위해 사용한다.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

### 데이터베이스가 있는 웹 애플리케이션

Helm을 이용해서 데이터베이스(MySQL)을 이용하는 웹 애플리케이션(WordPress)을
설치한 것과 같이 좀 더 복잡한 애플리케이션을 고려할 수 있다.
다음 식별자는 이 애플리케이션을 배포하는 데 사용하는 오브젝트의 시작을 보여준다.

WordPress를 배포하는 데 다음과 같이 `Deployment` 로 시작한다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

`Service` 는 애플리케이션을 노출하기 위해 사용한다.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

MySQL은 `StatefulSet` 에 MySQL의 소속과 상위 애플리케이션에 대한 메타데이터가 포함되어 노출된다.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

`Service` 는 WordPress의 일부로 MySQL을 노출하는 데 이용한다.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

MySQL `StatefulSet` 과 `Service` 로 MySQL과 WordPress가 더 큰 범위의 애플리케이션에 포함되어 있는 것을 알게 된다.
