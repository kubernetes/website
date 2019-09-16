---
title: 파드 프리셋
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
이 페이지는 파드 프리셋에 대한 개요를 제공한다. 파드 프리셋은 파드 생성 시간에 파드에
특정 정보를 주입하기 위한 오브젝트이다. 해당 정보에는
시크릿, 볼륨, 볼륨 마운트, 환경 변수가 포함될 수 있다.
{{% /capture %}}


{{% capture body %}}
## 파드 프리셋 이해하기

`Pod Preset`은 파드 생성 시간에 파드에 추가적인 런타임 요구사항을
주입하기 위한 API 리소스이다.
주어진 파드 프리셋이 적용되도록 파드에 명시하기 위해서는
[레이블 셀렉터](/docs/concepts/overview/working-with-objects/labels/#label-selectors)를 사용한다.

파드 프리셋을 사용하는 것은 파드 템플릿 작성자에게 모든 파드를 위한 모든 정보를 명시적으로
제공하지는 않아도 되도록 한다. 이렇게 하면, 어떤 특정 서비스를 사용할 파드의 파드
템플릿 작성자는 해당 서비스에 대한 모든 세부 사항을 알 필요가 없다.

그 배경에 대한 자세한 정보를 위해서는, [파드 프리셋을 위한 디자인 제안](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md)을 참고한다.

## 어떻게 동작하는가

쿠버네티스는 어드미션 컨트롤러(`PodPreset`)를 제공한다. 어드미션 컨트롤러가 활성화되면,
파드 프리셋을 파드 생성 요청에 적용한다.
파드 생성 요청이 발생하면, 시스템은 다음의 내용을 수행한다.

1. 사용 가능한 모든 `PodPresets`을 검색한다.
1. `PodPreset`의 레이블 셀렉터들 중 하나라도 생성되는 파드의 레이블과 일치하는
   것이 있는지 확인한다.
1. `PodPreset`에 의해서 정의된 다양한 리소스가 생성되는 파드에
   병합되도록 시도한다.
1. 오류 시, 파드의 병합 오류를 문서화하는 이벤트를 발생시키고, `PodPreset`으로
   부터 주입된 어떤 리소스도 _없이_ 파드를 생성한다.
1. 수정된 파드 스펙의 결과에 어노테이션을 달아 `PodPreset`에 의해서
   수정되었음을 표시한다. 해당 어노테이션은 다음의 양식을 따른다.
    `podpreset.admission.kubernetes.io/podpreset-<파드-프리셋 이름>: "<리소스 버전>"`.

각 파드는 0개 이상의 파드 프리셋에 일치될 수 있고, 각 `PodPreset`은 0개 이상의
파드에 적용될 수 있다. 하나의 `PodPreset`이 한 개 이상의 파드에 적용되었을
때, 쿠버네티스는 해당 파드의 스펙을 수정한다. `Env`, `EnvFrom`, `VolumeMounts`의
변경에 대해서는, 쿠버네티스가 파드 내의 모든 컨테이너의 컨테이너 스펙을
수정한다. `Volume` 변경에 대해서는, 쿠버네티스는 해당 파드의 스펙을 수정한다.

{{< note >}}
파드 프리셋은 적절한 경우 파드 스펙의 다음 필드를 수정할 수도 있다.
- `.spec.containers` 필드
- `initContainers` 필드(쿠버네티스 버전 1.14.0 이후에서 필요)
{{< /note >}}

### 특정 파드의 파드 프리셋 비활성화하기

어떠한 파드 프리셋 변이에 의해서도 파드에 변경이 일어나지 않게 하고 싶은 경우가
있을 것이다. 이 경우에는, 다음과 같은 양식으로 어노테이션을 파드 스펙에
추가한다. `podpreset.admission.kubernetes.io/exclude: "true"`.

## 파드 프리셋 활성화하기

클러스터에서 파드 프리셋을 사용하기 위해서는 다음 사항이 반드시 이행되어야 한다.

1.  API 타입 `settings.k8s.io/v1alpha1/podpreset`을 활성화하였다.
    예를 들면, 이것은 API 서버의 `--runtime-config` 옵션에 `settings.k8s.io/v1alpha1=true`을 포함하여 완료할 수 있다.
    minikube에서는 클러스터가 시작할 때
    `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true`
    플래그를 추가한다.
1.  어드미션 컨트롤러 `PodPreset`을 활성화하였다. 이것을 이루는 방법 중 하나는
    API 서버를 위해서 명시된 `--enable-admission-plugins` 옵션에 `PodPreset`을 포함하는 것이다.
    minikube에서는 클러스터가 시작할 때

    ```shell
    --extra-config=apiserver.enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset
    ```

    플래그를 추가한다.
1.  사용할 네임스페이스 안에서 `PodPreset` 오브젝트를 생성하여
    파드 프리셋을 정의하였다.

{{% /capture %}}

{{% capture whatsnext %}}

* [파드 프리셋을 사용하여 파드에 데이터 주입하기](/docs/tasks/inject-data-application/podpreset/)

{{% /capture %}}
