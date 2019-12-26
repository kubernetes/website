---
title: 이름(Name)
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

클러스터의 각 오브젝트는 해당 유형의 리소스에 대하여 고유한 [_이름_](#names) 을 가지고 있다.
또한, 모든 쿠버네티스 오브젝트는 전체 클러스터에 걸쳐 고유한 [_UID_](#uids) 를 가지고 있다.

예를 들어, 이름이 `myapp-1234`인 파드는 동일한 [네임스페이스](/ko/docs/concepts/overview/working-with-objects/namespaces/) 내에서 하나만 가질 수 있지만, 이름이 `myapp-1234`인 파드와 디플로이먼트는 각각 가질 수 있다.

유일하지 않은 사용자 제공 속성에 대해서, 쿠버네티스는 [레이블](/ko/docs/concepts/overview/working-with-objects/labels/)과 [어노테이션](/ko/docs/concepts/overview/working-with-objects/annotations/)을 제공한다.

{{% /capture %}}


{{% capture body %}}

## 이름 {#names}

{{< glossary_definition term_id="name" length="all" >}}

관례에 따라, 쿠버네티스 리소스의 이름은 최대 253자까지 허용되고 소문자 알파벳과 숫자(alphanumeric), `-`, 그리고 `.`로 구성되며 특정 리소스는 보다 구체적인 제약을 갖는다.

여기 파드의 이름이 `nginx-demo`라는 매니페스트 예시가 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
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

{{% /capture %}}
{{% capture whatsnext %}}
* 쿠버네티스의 [레이블](/ko/docs/concepts/overview/working-with-objects/labels/)에 대해 읽기.
* [쿠버네티스의 식별자와 이름](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) 디자인 문서 읽기.
{{% /capture %}}
