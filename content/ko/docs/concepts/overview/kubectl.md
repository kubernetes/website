---
title: kubectl 커맨드라인 도구
content_type: concept
description: >
  kubectl은 쿠버네티스 클러스터와 통신하기 위한 주요 커맨드라인 도구이다. 이 페이지는 kubectl과 쿠버네티스 생태계에서의 역할에 대한 개요를 제공한다.
weight: 50
card:
  name: concepts
  title: kubectl
  weight: 40
---

<!-- overview -->

{{< glossary_definition prepend="쿠버네티스는" term_id="kubectl" length="short" >}}를 제공한다.

`kubectl` 도구는 [쿠버네티스 API](/docs/concepts/overview/kubernetes-api/)를 사용하여 클러스터와 통신한다.
클러스터 연결 설정을 위해 `kubectl`은 `$HOME/.kube` 디렉터리에서 `config`라는 이름의 파일을 찾는다.
또한 `KUBECONFIG` 환경 변수를 설정하거나 [`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 플래그를 설정하여 다른 [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 파일을 지정할 수도 있다.

<!-- body -->

## kubectl의 역할

`kubectl` 도구는 쿠버네티스 오브젝트를 생성, 조회, 업데이트 및 삭제하기 위한 기본 인터페이스이다.
클러스터 내부에서 실행되는 [쿠버네티스 컴포넌트](/docs/concepts/overview/components/)와 해당 컴포넌트들이 제공하는 [쿠버네티스 API](/docs/concepts/overview/kubernetes-api/)를 보완한다.
로컬 머신에서 실행하든 클러스터 내부의 파드(Pod)에서 실행하든, `kubectl`은 API 서버로 요청을 보낸다.
[클라이언트 라이브러리](/docs/reference/using-api/client-libraries/)나 [Headlamp](https://headlamp.dev/)와 같은 웹 대시보드 등 다른 클라이언트들도 동일한 API를 통해 통신한다.

## kubectl 작동 방식

`kubectl` 도구는 API 서버에 연결하고 [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 파일에 정의된 클러스터, 사용자 및 컨텍스트를 사용하여 인증한다.
클러스터 외부에서 `kubectl`을 실행할 때, 이 도구는 kubeconfig 파일을 사용하여 API 서버 주소와 자격 증명을 찾는다.
파드 내부에서 (예: CI/CD 파이프라인에서) `kubectl`이 실행될 때는 파드에 마운트된 서비스 어카운트(ServiceAccount) 토큰을 기반으로 클러스터 내부(in-cluster) 인증을 사용할 수 있다.

명령어를 실행하면, `kubectl`은 사용자의 의도를 하나 이상의 [쿠버네티스 API](/docs/concepts/overview/kubernetes-api/)에 대한 HTTP 요청으로 변환한다. API 서버는 각 요청을 검증하고, {{< glossary_tooltip text="etcd" term_id="etcd" >}}에 저장된 클러스터 상태에 이를 적용한 후 결과를 반환한다. 이는 디플로이먼트(Deployment)를 생성하든 로그를 읽든, 모든 `kubectl` 작업이 동일한 API 기반 절차를 거친다는 것을 의미한다.

kubeconfig는 여러 클러스터, 사용자 및 컨텍스트를 정의할 수 있으므로, 환경을 다시 구성하지 않고도 `kubectl`을 사용하여 클러스터 간에 전환할 수 있다. 활성 컨텍스트를 변경하려면 `kubectl config use-context`를 실행한다.

## kubectl로 할 수 있는 일

`kubectl` 도구는 다양한 작업을 지원하며, 크게 다음 범주로 나눌 수 있다:

* **리소스 관리** – 파드, 디플로이먼트, 서비스 등의 오브젝트를 생성, 업데이트 및 삭제한다.
  구성 파일을 이용한 선언적 관리를 위해 `kubectl apply`를 사용한다.
* **클러스터 상태 조회** – 오브젝트를 나열(list) 및 기술(describe)하고, 이벤트를 확인하며, 리소스 사용량을 점검한다.
* **디버깅** – 컨테이너에서 로그를 확인하거나, 실행 중인 컨테이너 내부에서 명령어를 실행하거나, 파드로 포트 포워딩을 수행한다.
* **클러스터 운영** – 유지 보수를 위해 노드를 드레인(drain)하고, 새 워크로드가 스케줄링되지 않도록 노드를 코던(cordon) 처리하며, 클러스터 구성을 관리한다.
* **스크립팅 및 자동화** – 스크립트 및 파이프라인에서 사용할 수 있도록 출력을 JSON, YAML 또는 [JSONPath](/docs/reference/kubectl/jsonpath/)를 사용한 사용자 정의 열(custom columns) 형식으로 포맷팅한다.

구문, 명령어 레퍼런스 및 예제는 [kubectl 레퍼런스 문서](/docs/reference/kubectl/)를 참조한다.

## 선언적 방식과 명령형 방식

프로덕션 워크로드의 경우, 버전 관리되는 구성 파일과 함께 `kubectl apply`를 사용하는 [선언적 오브젝트 관리](/docs/concepts/overview/working-with-objects/object-management/) 방식을 선호해야 한다.
선언적 관리는 변경 사항을 추적하고, 협업하며, GitOps 워크플로우와 통합하는 데 도움이 된다.
명령형 명령어(`kubectl create` 또는 `kubectl run` 등)는 개발 및 실험에는 유용하지만, 재현하고 감사(audit)하기는 더 어렵다.

## 플러그인을 통한 kubectl 확장

새로운 하위 명령어를 추가하는 [플러그인](/docs/tasks/extend-kubectl/kubectl-plugins/)을 사용하여 `kubectl`을 확장할 수 있다. 플러그인은 `kubectl-<plugin-name>` 명명 규칙을 따르는 독립 실행형 바이너리이다.
쿠버네티스 커뮤니티는 많은 플러그인을 유지 관리하며, [Krew](https://krew.sigs.k8s.io/) 플러그인 관리자를 사용하여 이를 관리할 수 있다.

## 버전 호환성

`kubectl` 도구는 클러스터의 컨트롤 플레인 버전과 비교하여 마이너 버전 1단계 차이(plus-or-minus)의 버전 스큐(version skew)를 지원한다. 예를 들어, `kubectl` v1.32는 v1.31, v1.32, v1.33 버전의 컨트롤 플레인과 호환된다.
호환되는 버전을 사용하면 예기치 않은 동작을 방지할 수 있다. 자세한 내용은 [버전 스큐 정책](/releases/version-skew-policy/)을 참조한다.

## {{% heading "whatsnext" %}}

* 구문 및 명령어 세부 정보는 [kubectl 레퍼런스](/docs/reference/kubectl/)를 읽어본다.
* 로컬 머신에 [kubectl을 설치](/docs/tasks/tools/#kubectl)한다.
* `kubectl`이 사용하는 [쿠버네티스 API](/docs/concepts/overview/kubernetes-api/)에 대해 알아본다.
* 클러스터를 구성하는 [쿠버네티스 컴포넌트](/docs/concepts/overview/components/)를 검토한다.
* [오브젝트 관리](/docs/concepts/overview/working-with-objects/object-management/) 및 선언적 구성에 대해 살펴본다.
* 지원되는 버전 조합에 대한 [버전 스큐 정책](/releases/version-skew-policy/)을 확인한다.
