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
또한, 모든 쿠버네티스 오브젝트는 전체 클러스터에 걸쳐 고유한 [_UID_](#uids) 를 가지고 있다.

예를 들어, 이름이 `myapp-1234`인 파드는 동일한 [네임스페이스](/ko/docs/concepts/overview/working-with-objects/namespaces/) 내에서 하나만 존재할 수 있지만, 이름이 `myapp-1234`인 파드와 디플로이먼트는 각각 존재할 수 있다.

유일하지 않은 사용자 제공 속성의 경우 쿠버네티스는 [레이블](/ko/docs/concepts/overview/working-with-objects/labels/)과 [어노테이션](/ko/docs/concepts/overview/working-with-objects/annotations/)을 제공한다.



<!-- body -->

## 이름 {#names}

{{< glossary_definition term_id="name" length="all" >}}

**이름은 동일한 리소스의 모든 [API 버전](/ko/docs/concepts/overview/kubernetes-api/#api-그룹과-버전-규칙)에서 
고유해야 한다. API 리소스는 API 그룹, 리소스 유형, 
네임스페이스(네임스페이스 범위 리소스의 경우), 그리고 이름으로 구분된다. 즉, 이 맥락에서 API 버전은 고려 대상이 아니다.**

{{< note >}}
물리적 호스트를 나타내는 노드와 같이 오브젝트가 물리적 엔티티를 나타내는 경우, 노드를 삭제한 후 다시 생성하지 않은 채 동일한 이름으로 호스트를 다시 생성하면, 쿠버네티스는 새 호스트를 불일치로 이어질 수 있는 이전 호스트로 취급한다.
{{< /note >}}

리소스 생성 요청에서 `name` 대신 `generateName`이 제공되면 서버가 이름을 생성할 수 있다.
`generateName`이 사용될 경우, 제공된 값은 이름의 접두사로 사용되고, 서버는 여기에 생성된 접미사를 
추가한다. 이름이 생성되더라도 기존 이름과 충돌하여 HTTP 409 응답이 발생할 수 있다. 이는
쿠버네티스 v1.31 이상에서는 서버가 HTTP 409 응답을 반환하기 전에 최대 8번까지 
고유한 이름을 생성하려고 시도하므로 이러한 일이 발생할 가능성이 훨씬 낮아졌다.

다음은 리소스에 일반적으로 사용되는 네 가지 유형의 이름 제한 조건이다.

### DNS 서브도메인 이름

대부분의 리소스 유형에는 [RFC 1123](https://tools.ietf.org/html/rfc1123)에 정의된 대로
DNS 서브도메인 이름으로 사용할 수 있는 이름이 필요하다.
이것은 이름이 다음을 충족해야 한다는 것을 의미한다.

- 253자를 넘지 말아야 한다.
- 소문자와 영숫자 `-` 또는 `.` 만 포함한다.
- 영숫자로 시작한다.
- 영숫자로 끝난다.

### RFC 1123 레이블 이름 {#dns-label-names}

일부 리소스 유형은 [RFC 1123](https://tools.ietf.org/html/rfc1123)에
정의된 대로 DNS 레이블 표준을 따라야 한다.
이것은 이름이 다음을 충족해야 한다는 것을 의미한다.

- 최대 63자이다.
- 소문자와 영숫자 또는 `-` 만 포함한다.
- 영숫자로 시작한다.
- 영숫자로 끝난다.

### RFC 1035 레이블 이름

몇몇 리소스 타입은 자신의 이름을 [RFC 1035](https://tools.ietf.org/html/rfc1035)에
정의된 DNS 레이블 표준을 따르도록 요구한다.
이것은 이름이 다음을 만족해야 한다는 의미이다.

- 최대 63개 문자를 포함
- 소문자 영숫자 또는 '-'만 포함
- 알파벳 문자로 시작
- 영숫자로 끝남

{{< note >}}
RFC 1035와 RFC 1123
레이블 표준의 유일한 차이점은 RFC 1123 레이블은 
숫자로 시작할 수 있는 반면, RFC 1035 레이블은 
소문자로만 시작할 수 있다는 것이다. 
{{< /note >}}

### 경로 세그먼트 이름

일부 리소스 유형에서는 이름을 경로 세그먼트로 안전하게 인코딩 할 수
있어야 한다. 즉 이름이 "." 또는 ".."이 아닐 수 있으며 이름에는
"/" 또는 "%"가 포함될 수 없다.

아래는 파드의 이름이 `nginx-demo`라는 매니페스트 예시이다.

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
일부 리소스 유형은 이름에 추가적인 제약이 있다.
{{< /note >}}

## UID {#uids}

{{< glossary_definition term_id="uid" length="all" >}}

쿠버네티스 UID는 보편적으로 고유한 식별자이다(또는 UUID라고 한다).
UUID는 ISO/IEC 9834-8 과 ITU-T X.667 로 표준화 되어 있다.


## {{% heading "whatsnext" %}}

* 쿠버네티스의 [레이블](/ko/docs/concepts/overview/working-with-objects/labels/)과 [어노테이션](/ko/docs/concepts/overview/working-with-objects/annotations/)에 대해 읽기.
* [쿠버네티스의 식별자와 이름](https://git.k8s.io/design-proposals-archive/architecture/identifiers.md) 디자인 문서 읽기.
