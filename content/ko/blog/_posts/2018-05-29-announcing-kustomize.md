---
layout: blog
title: 'kustomize: 템플릿에서 자유로운 쿠버네티스 구성 커스터마이제이션을 소개합니다.'
date: 2018-05-29
---

**Authors:** Jeff Regan (Google), Phil Wittrock (Google)

**번역**: 정진우 (Devsisters), 손석호 (ETRI)

[**kustomize**]: https://github.com/kubernetes-sigs/kustomize
[hello world]: https://github.com/kubernetes-sigs/kustomize/blob/master/examples/helloWorld
[메일 수신자 목록]: https://groups.google.com/forum/#!forum/kustomize
[이슈를 열어주세요]: https://github.com/kubernetes-sigs/kustomize/issues/new
[하위 프로젝트]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/2377-Kustomize/README.md
[SIG-CLI]: https://github.com/kubernetes/community/tree/master/sig-cli
[워크플로우]: https://github.com/kubernetes-sigs/kustomize/blob/1dd448e65c81aab9d09308b695691175ca6459cd/docs/workflows.md

쿠버네티스 환경을 운영해 보았다면, 아마도 쿠버네티스 구성을
자신이 원하는 대로 변경(customize) 해본 경험이 있을 것입니다.
API 오브젝트 YAML 파일을 복사하고 필요에 따라 일부분만 수정하는 작업이
그 예입니다.

그러나 언급한 방식에는 단점이 있습니다.
적용된 개선 사항을 원본 소스에
재반영하는 것이 까다롭다는 점입니다. 오늘 구글은
[SIG-CLI]의 [하위 프로젝트]로
기여된 커맨드라인 도구
[**kustomize**]를 발표합니다. 이 도구는
완전히 *선언적(declarative)* 인 새로운 구성 커스터마이제이션 방법을 제시하며,
친숙하면서도 신중하게 설계된 쿠버네티스 API를 준수 및
적극 활용합니다.

일반적으로 격을 수 있는 시나리오를 함께 살펴봅시다. 당신은 다른 사람이 작성한
콘텐츠 관리 시스템(content management system) 쿠버네티스 구성을 인터넷에서
찾았습니다. 그것은 쿠버네티스 API 오브젝트들에 대한 명세가 담긴
YAML 파일들일 것입니다. 그리고 회사 내부에서
해당 CMS를 보조하기 위한 데이터베이스
구성을 찾았습니다. 해당 데이터베이스는
당신이 잘 알아서 더 선호하는 데이터베이스입니다.

당신은 어떻게든 이 둘을 함께 사용하고 싶습니다. 나아가,
해당 구성을 커스터마이즈하여 당신의 리소스 인스턴스와
클러스터 내에서 동일한 작업을
수행하고 있는 동료의 리소스를
구분할 수 있도록 라벨을 추가하고 싶습니다.
또한 CPU, 메모리, 레플리카 수에 적절한 값을
지정하고 싶습니다.

추가적으로, 당신은 구성 전체를 *여러 변형(variants)* 으로 재구성하게 될 수 있습니다.
테스트와 실험을 위한 (사용되는 컴퓨팅 리소스의 차원에서) 작은 규모로 변형,
운영 환경에서 외부 사용자들에게 서비스하기 훨씬 큰 규모로 변형 등이
그 예입니다.
마찬가지로, 다른
팀들에서도 자신들만의 변형을 필요로 할 수 있습니다.

이러한 시나리오에는 다양한 질문이 뒤따릅니다. 하나의 구성을
여러 위치에 복사해두고 개별적으로 수정하고
있나요? 만일 수십 개의 개발 팀들이 모두
아주 미세하게 다른 변형이 필요하다면 어떻게 해야
할까요? 모든 구성들이 공통적으로 공유하는 요소들은
어떻게 업그레이드하고 관리하고 있나요? **kustomize**를
사용하는 워크플로우는 이러한 질문에 답변할 수 있습니다.

## 커스터마이제이션은 재사용이다.

쿠버네티스의 구성(configuration)은 코드가 아닙니다. (API 오브젝트에 대한
YAML 명세라는 점에서 엄밀하게는
데이터로 간주됨) 그러나 구성과 코드의 라이프사이클은
서로 많은 유사점을 가지고 있습니다.

구성의 버전은 제어 및 관리되어야 합니다.
구성의 소유자와 구성의 사용자가
동일한 사람일 필요는
없습니다. 구성은 전체에서 일부분으로서 사용될 수도
있습니다. 사용자들은 각자의 목적에 따라 구성을 *재사용* 하고
싶을 것입니다.

코드 재사용과 마찬가지로 전체를 단순 복사하고 복사본을
적절히 수정하는 것도 구성 재사용 방식 중
하나입니다. 코드와 마찬가지로 원본 소스와의 연결을 끊어내면
원본이 개선되었을 때 그 수혜를 받기 어려워집니다.
다양한 팀 또는 환경이
각자 자신만의 변형된 구성을 지니는 상황에서
이러한 방식을 취하게 되면
간단한 업그레이드조차 다루기 힘들어집니다.

재사용을 위한 다른 방식은 원본 소스를
매개변수가 포함된 템플릿으로
표현하는 것입니다. 특정 도구를 활용하여 템플릿을 처리, 즉
내장된 스크립트를 실행하여 매개변수들을 특정 값들로 대체함으로써
구성을 생성합니다. 다양한 값들의 지정함으로써
하나의 템플릿을 재사용한다고 말할 수 있습니다. 문제는
템플릿과 값들이 명시된 파일이 쿠버네티스 API 리소스의 명세가
아니라는 점입니다. 그들은 필연적으로
쿠버네티스 API에 덧대는 또 다른 언어가
될 수 밖에 없습니다. 물론 이러한 도구는 강력할 수 있지만,
학습 및 활용 비용이 수반됩니다. 각
팀마다 다른 수정 사항을 원하기 때문에 결국 YAML 파일에 포함시킬 수 있는
거의 모든 명세는 특정 값을 필요로 하는 매개변수가 됩니다.
결과적으로, (디폴트 값이 없는) 모든 매개변수들은
대체할 값들이 명시되어야 하므로
값들의 조합은 커집니다.
이는 다른 변형들 간의 차이를
최대한 작게 유지하고,
전체 리소스 명세가 없을 때에도
이해하기 쉽도록 한다는 재사용의 목표 중 하나를 훼손합니다.

## 구성 커스터마이제이션의 새로운 옵션

`kustomization.yaml` 파일에
표현된 선언적 명세로 도구의 동작 방식이 결정되는 **kustomize**와
위의 방식을 비교해봅시다.

**kustomize** 프로그램은 파일과 해당 파일이 참조하는
쿠버네티스 API 리소스 파일을 읽습니다. 그리고 표준 출력으로
완성된 리소스를 출력합니다. 이 텍스트 결과물은
다른 도구에 의해 추가적으로 처리되거나, 스트림 그대로
**kubectl**로 직접적으로 전달되어 클러스터에 적용될 수도 있습니다.

예를 들어, 아래와 같이 작성된 `kustomization.yaml`라는
파일이

```
   commonLabels:
     app: hello
   resources:
   - deployment.yaml
   - configMap.yaml
   - service.yaml
```

파일에 명시된 세 가지 리소스 파일과 함께
현재 디렉터리에 존재하는 경우, 아래와 같이 실행했을 때

```
kustomize build
```

세 가지 리소스가 포함된 YAML 스트림을 출력하고
`app: hello`라는 공통적인 라벨을 각 리소스에
추가해 줍니다.

유사하게, *commonAnnotations* 필드를 통해
모든 리소스에 어노테이션을 추가하고, *namePrefix* 필드로
모든 리소스명에 공통적인 접두사를 하나 추가할 수 있습니다.
이러한 진부하면서도 일반적인 커스터마이징은 그저
시작일 뿐입니다.

보다 일반적인 사용 사례는 공통적인 리소스들에 대해
다양한 변형(variants)이 필요한 경우입니다.
*개발* , *스테이지* , *운영* 환경에 따른 형태들이 그 예시입니다.

이러한 목적을 위해 **kustomize**는
*오버레이(overlay)* 와 *베이스(base)* 라는 개념을 지원합니다. 둘 다
kustomization 파일로 표현됩니다. 베이스는
(리소스들과 해당 리소스들의 공통적 커스터마이제이션에 있어)
다양한 변형들 간의 공통점을 선언하고, 오버레이는
차이점을 선언합니다.

아래는 특정 클러스터 앱에 대한 *스테이징(staging)* 및 *프로덕션(production)* 환경용 변형
관리를 위한 파일 시스템 레이아웃 예시입니다.

```
   someapp/
   ├── base/
   │   ├── kustomization.yaml
   │   ├── deployment.yaml
   │   ├── configMap.yaml
   │   └── service.yaml
   └── overlays/
      ├── production/
      │   └── kustomization.yaml
      │   ├── replica_count.yaml
      └── staging/
          ├── kustomization.yaml
          └── cpu_count.yaml
```

`someapp/base/kustomization.yaml` 파일은 공통 리소스와
해당 리소스들에 공통적으로 적용할 수정 사항을 명시합니다.
(예를 들면, 모든 리소스에 특정 레이블을 붙이거나, 이름에 접두사를 붙이거나, 어노테이션을
추가하는 등)

`someapp/overlays/production/kustomization.yaml`의
내용은
다음과 같을 수 있습니다.

```
   commonLabels:
    env: production
   bases:
   - ../../base
   patches:
   - replica_count.yaml
```

이 kustomization은 `replica_count.yaml`라는
*패치(patch)* 파일을 명시하며, 그 내용은 아래와 같을 수 있습니다.

```
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: the-deployment
   spec:
     replicas: 100
```

패치란 부분적인 리소스 선언입니다. 위의 경우
운영 환경이 트래픽을 감당할 수 있도록
`someapp/base/deployment.yaml`의 디플로이먼트에
*replicas* 값만 덮어쓰는 수정입니다.

해당 패치는 디플로이먼트 스펙의 일부분으로서
나머지 전체 구성과 독립적으로 보더라도 명확한
맥락과 의도를 가지고 있으며 별도로 검증도
가능합니다. 단순히 맥락과 무관한 *{매개변수 명칭, 값}*
튜플 이상의 의미를 지닙니다.

운영 환경의 리소스를 생성하기 위해서는 다음과 같이 실행하면 됩니다.

```
kustomize build someapp/overlays/production
```

표준출력으로 나오는 결과물은 그대로 클러스터에 적용될 수 있는
완전한 리소스들입니다.
유사한 명령어로 스테이징 환경도 정의할 수 있습니다.

## 요약

**kustomize**를 사용하면 쿠버네티스 API 리소스 파일만으로
독립적으로 커스터마이징된 쿠버네티스 구성을 임의의 숫자만큼
관리할 수 있습니다. **kustomize**가
사용하는 모든 아티팩트(artifact)는 순수한 YAML이며
YAML 형식으로 검증 및 처리될 수 있습니다. kustomize는
fork/modify/rebase [워크플로우]를 권장합니다.

입문하려면 [hello world] 예시를 해보는 것을 추천합니다.
논의와 피드백을 위해 [메일 수신자 목록]에 참여하거나
[이슈를 열어주세요]. PR(Pull Request)도 환영합니다.
