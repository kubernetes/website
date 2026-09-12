---
# reviewers:
# - mikedanese
# - thockin
title: 오브젝트 이름과 ID
content_type: concept
weight: 30
---

<!-- overview -->

클러스터의 각 {{< glossary_tooltip text="오브젝트" term_id="object" >}}는 해당 유형의 리소스에 대하여 고유한 [_이름_](#names) 을 가지고 있다.
모든 쿠버네티스 오브젝트는 전체 클러스터에 걸쳐 고유한 [_UID_](#uids) 를 가지고 있다.

예를 들어, 동일한 [네임스페이스](/docs/concepts/overview/working-with-objects/namespaces/) 안에서는 `myapp-1234`라는 이름의 파드를 하나만 가질 수 있지만, `myapp-1234`라는 이름의 파드와 디플로이먼트(Deployment)는 각각 하나씩 가질 수 있다.

고유하지 않은 사용자 제공 속성의 경우 쿠버네티스는 [레이블](/docs/concepts/overview/working-with-objects/labels/)과 [어노테이션](/docs/concepts/overview/working-with-objects/annotations/)을 제공한다.



<!-- body -->

## 이름

{{< glossary_definition term_id="name" length="all" >}}

이름은 동일한 리소스의 모든 [API 버전](/docs/concepts/overview/kubernetes-api/#api-그룹과-버전-규칙)에서 고유해야 한다.

쿠버네티스는 네 가지 속성의 조합을 사용해 객체를 고유하게 식별한다.
* **API 그룹** (예: `apps`)
* **리소스 타입** (예: `deployments`)
* **네임스페이스(Namespace)** (네임스페이스를 사용하는 리소스의 경우)
* **이름**

서로 다른 API 버전 (예: `v1` 또는 `v1beta1`)을 통해 리소스에 접근할 수 있지만, 버전은 단순히 동일한 기본 객체를 다르게 표현한 것이다. 버전은 고유 식별의 일부가 아니기 때문에, 서로 다른 API 버전을 사용해 같은 네임스페이스에서 동일한 이름과 리소스 타입을 가진 두 개의 객체를 생성할 수 없다.

{{< note >}}
물리적 호스트를 나타내는 노드(Node)와 같이 오브젝트가 물리적 엔티티를 나타내는 경우, 노드를 삭제하고 다시 생성하지 않은 상태에서 호스트가 동일한 이름으로 다시 생성되면 쿠버네티스는 새로운 호스트를 기존 호스트로 취급하며, 이로 인해 불일치가 발생할 수 있다.
{{< /note >}}

리소스 생성 요청에서 `name` 대신 `generateName`이 제공되면 서버가 이름을 생성할 수 있다.
`generateName`이 사용되면, 제공된 값이 이름 접두사로 사용되고, 서버는 여기에 생성된 접미사를
추가한다. 이름이 생성되더라도 기존 이름과 충돌하여 HTTP 409 응답이 발생할 수 있다. 이러한 충돌은
쿠버네티스 v1.31 이상에서 발생할 가능성이 훨씬 낮아졌는데, 서버가 HTTP 409 응답을 반환하기 전에
고유한 이름을 생성하기 위해 최대 8번 시도하기 때문이다.

다음은 리소스에 일반적으로 사용되는 네 가지 이름 제약 조건 타입이다.

### DNS 서브도메인 이름

대부분의 리소스 타입은 [RFC 1123](https://tools.ietf.org/html/rfc1123)에 정의된
DNS 서브도메인 이름으로 사용할 수 있는 이름을 요구한다.
이는 이름이 다음을 충족해야 함을 의미한다.

- 253자를 초과하지 말아야 한다.
- 소문자 영숫자, `-` 또는 `.`만 포함해야 한다.
- 영숫자로 시작해야 한다.
- 영숫자로 끝나야 한다.

### RFC 1123 레이블 이름

일부 리소스 타입은 이름이 [RFC 1123](https://tools.ietf.org/html/rfc1123)에
정의된 DNS 레이블 표준을 따르도록 요구한다.
이는 이름이 다음을 충족해야 함을 의미한다.

- 최대 63자여야 한다.
- 소문자 영숫자 또는 `-`만 포함해야 한다.
- 영문자로 시작해야 한다.
- 영숫자로 끝나야 한다.

{{< note >}}
`RelaxedServiceNameValidation` 기능 게이트가 활성화된 경우,
서비스 오브젝트 이름은 숫자로 시작할 수 있다.
{{< /note >}}

### RFC 1035 레이블 이름

일부 리소스 타입은 이름이 [RFC 1035](https://tools.ietf.org/html/rfc1035)에
정의된 DNS 레이블 표준을 따르도록 요구한다.
이는 이름이 다음을 충족해야 함을 의미한다.

- 최대 63자여야 한다.
- 소문자 영숫자 또는 `-`만 포함해야 한다.
- 영문자로 시작해야 한다.
- 영숫자로 끝나야 한다.

{{< note >}}
RFC 1123에서는 기술적으로 레이블이 숫자로 시작하는 것을 허용하지만, 현재
쿠버네티스 구현에서는 RFC 1035와 RFC 1123 레이블 모두
영문자로 시작하도록 요구한다. 예외는 `RelaxedServiceNameValidation`
기능 게이트가 서비스 오브젝트에 활성화된 경우이며, 이 경우 서비스 이름이 숫자로 시작할 수 있다.
{{< /note >}}

### 경로 세그먼트 이름

일부 리소스 타입은 이름을 경로 세그먼트로 안전하게 인코딩할 수
있어야 한다. 다시 말해, 이름은 "." 또는 ".."일 수 없으며
"/" 또는 "%"를 포함할 수 없다.

다음은 `nginx-demo`라는 이름의 파드에 대한 매니페스트 예시이다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```


{{< note >}}
일부 리소스 유형은 이름에 추가적인 제한이 있다.
{{< /note >}}

## UID

{{< glossary_definition term_id="uid" length="all" >}}

쿠버네티스 UID는 보편적으로 고유한 식별자이다(UUID라고도 한다).
UUID는 ISO/IEC 9834-8과 ITU-T X.667로 표준화되어 있다.


## {{% heading "whatsnext" %}}

* 쿠버네티스의 [레이블](/docs/concepts/overview/working-with-objects/labels/)과 [어노테이션](/docs/concepts/overview/working-with-objects/annotations/)에 대해 읽어보기
* [쿠버네티스의 식별자와 이름](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md) 설계 문서 참고하기