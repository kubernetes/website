---
title: 이름(Name)
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

쿠버네티스 REST API의 모든 오브젝트는 이름과 UID로 명백히 식별된다.

유일하지 않은 사용자 제공 속성에 대해서, 쿠버네티스는 [레이블](/docs/user-guide/labels)과 [어노테이션](/docs/concepts/overview/working-with-objects/annotations/)을 제공한다.

이름과 UID에 대한 정확한 구문 규칙은 [식별자 설계 문서](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md)를 참고한다.

{{% /capture %}}


{{% capture body %}}

## 이름 {#names}

{{< glossary_definition term_id="name" length="all" >}}

관례에 따라, 쿠버네티스 리소스의 이름은 최대 253자까지 허용되고 소문자 알파벳과 숫자(alphanumeric), `-`, 그리고 `.`로 구성되며 특정 리소스는 보다 구체적인 제약을 갖는다.

다음은 이름이 `nginx-demo`이고 컨테이너 이름이 `nginx`인 파드의 구성 파일 예시이다.

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

## UID {#uids}

{{< glossary_definition term_id="uid" length="all" >}}

{{% /capture %}}
