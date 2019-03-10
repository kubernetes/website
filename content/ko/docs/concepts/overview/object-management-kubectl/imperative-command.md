---
title: 명령형 명령어를 이용한 쿠버네티스 오브젝트 관리하기
content_template: templates/concept
weight: 20
---

{{% capture overview %}}
Kubernetes 오브젝트는 `kubectl` 커맨드 라인 툴 속에 내장된 명령형 명령어를 이용함으로써
바로 신속하게 생성, 업데이트 및 삭제할 수 있다. 이 문서는 어떻게 명령어가 구성되어 있으며,
어떻게 활성 오브젝트를 관리하기 위해 이를 이용할 수 있는지에 대해 설명한다,
{{% /capture %}}

{{% capture body %}}

## 트레이드 오프

`kubectl`툴은 3가지 종류의 오브젝트 관리를 지원한다.

* 명령형 명령어
* 명령형 오브젝트 구성
* 선언형 오브젝트 구성

오브젝트 관리 종류별 각각의 장단점에 대한 논의는 [쿠버네티스 오브젝트 관리](/docs/concepts/overview/object-management-kubectl/overview/)
를 참고한다.

## 오브젝트 생성 방법

구성파일로부터 오브젝트를 생성하려면 `kubectl create -f`을 사용할 수 있다.
보다 상세한 내용은 [쿠버네티스 API 참조](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
를 참조한다.

- `kubectl create -f <filename|url>`

## 오브젝트 업데이트 방법

{{< warning >}}
`replace` 명령으로 오브젝트를 업데티트하면
구성파일 내 정의하지 않은 규격의 모든 부분은 삭제된다. 이것을
구성파일로부터 독립적으로 관리되는 `externalIPs` 필드가 있는
`LoadBalancer` 타입의 서비스와 같은, 클러스터에 의해
관리되는 규격을 지닌 오브젝트와 함께 사용해서는 안된다.
독립적으로 관리되는 필드는 `replace`로 인해 삭제가 되는 것을 방지하기 위해
구성파일에 복사되어야만 한다.
{{< /warning >}}

구성파일에 따라 활성화 된 오브젝트를 업데이트 하기 위해 `kubectl replace -f`를
사용할 수 있다.

- `kubectl replace -f <filename|url>`

## 오브젝트 삭제 방법

구성파일 내 기술된 오브젝트를 삭제하기 위해 `kubectl delete -f`를
사용할 수 있다.

- `kubectl delete -f <filename|url>`

## 오브젝트 확인 방법

구성파일 내 기술된 오브젝트에 대한 정보를 확인하기 위해 `kubectl get -f`를
사용할 수 있다.

- `kubectl get -f <filename|url> -o yaml`

`-o yaml` 플래그는 전체 오브젝트 구성이 출력되도록 지정한다.
옵션 리스트를 확인하려면 `kubectl get -h`를 사용한다.

## 제약사항

`create`, `replace`, 그리고 `delete` 명령은 구성파일 내 각 오브젝트의
구성이 완전하게 정의되고 기록되어진 경우에는 동작을 잘한다.
그러나 활성화 오브젝트가 업데이트 되고 구성파일 안으로 병합되지 않은 경우,
다음 `replace`가 실행될 때 업데이트는 유실될 것이다.
HorizontalPodAutoscaler와 같은 컨트롤러가 활성화 오브제트를
직접적으로 업데이트 하는 경우 이런 상황이 발생할 수 있다.
다음은 이에 관한 예시이다.

1. 구성파일로부터 오브젝트를 생성한다.
1. 다른 소스가 일부 필드를 변경하여 오브젝트를 업데이트 한다.
1. 구성파일로부터 오브젝트를 대체한다. 2번째 단계에서의 다른 소스에 의해
이루어진 변경은 유실된다.

여러 작성자들이 동일한 오브젝트에 대해 지원하도록 필요한 경우,
오브젝트를 관리하기 위해 `kubectl apply`를 사용할 수 있다.

## 구성파일 저장 없이 URL로 오브젝트를 생성하고 편집하기

오브젝트 구성파일에 대한 URL을 가졌다고 가정해 보자. 오브젝트가 생성되기 전에
구성에 변경을 하려면 `kubectl create --edit`를 사용할 수 있다.
이것은 특히, 독자에 의해 수정될 수도 있는 구성파일을 지정하고 있는
튜토리얼과 태스크에 대해 유용하다.

```sh
kubectl create -f <url> --edit
```

## 명령형 명령에서 명령형 오브젝트 구성으로 이전하기

명령형 명령에서 명령형 오브젝트 구성으로 이전하려면 몇 가지 수동조치가
수반된다.

1. 활성화 오브젝트를 로컬의 오브젝트 구성파일로 내보낸다.
```sh
kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml
```

1. 수동으로 오브젝트 구성파일로부터 상태 필드를 제거한다.

1. 뒤따르는 오브젝트 관리를 위해서는, 오직 `replace`만 사용한다.
```sh
kubectl replace -f <kind>_<name>.yaml
```


## 컨트롤러 선택기(selector)와 PodTemplate 레이블 정의하기

{{< warning >}}
컨트롤러 상에서 선택기를 업데이트하는 것은 강력히 권장되지 않는다.
{{< /warning >}}

권장되는 접근법은 다른 의미론적 의미를 가지지 않는 컨트롤러 선택기에 의해서만이 사용되는
단일, 불변의 PodTemplate 레이블을 정의하는 것이다.

예시 레에블:

```yaml
selector:
  matchLabels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
```

{{% /capture %}}

{{% capture whatsnext %}}
- [오브젝트 구성을 이용하여 쿠베네티스 관리하기 (명령형)](/docs/concepts/overview/object-management-kubectl/imperative-config/)
- [오브젝트 구성을 이용하여 쿠버네티스 관리하기 (선언형)](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl 명령어 참조](/docs/reference/generated/kubectl/kubectl/)
- [쿠버네티스 API 참조](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
{{% /capture %}}
