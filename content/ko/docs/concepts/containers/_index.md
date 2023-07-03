---
title: 컨테이너
weight: 40
description: 런타임 의존성과 함께 애플리케이션을 패키징하는 기술
# reviewers:
# - erictune
# - thockin
content_type: concept
---

<!-- overview -->

실행하는 각 컨테이너는 반복 가능하다. 의존성이 포함된 표준화는
어디에서 실행하던지 동일한 동작을 얻는다는 것을
의미한다.

컨테이너는 기본 호스트 인프라에서 애플리케이션을 분리한다.
따라서 다양한 클라우드 또는 OS 환경에서 보다 쉽게 배포할 수 있다.

쿠버네티스 클러스터에 있는 개별 {{< glossary_tooltip text="node" term_id="node" >}}는
해당 노드에 할당된 [파드](/ko/docs/concepts/workloads/pods/)를
구성하는 컨테이너들을 실행한다.
파드 내부에 컨테이너들은 같은 노드에서 실행될 수 있도록 같은 곳에 위치하고 함께 스케줄된다.


<!-- body -->

## 컨테이너 이미지
[컨테이너 이미지](/ko/docs/concepts/containers/images/)는 애플리케이션을
실행하는 데 필요한 모든 것이 포함된 실행할 준비가 되어 있는(ready-to-run) 소프트웨어 패키지이다.
여기에는 실행하는 데 필요한 코드와 모든 런타임, 애플리케이션 및 시스템 라이브러리,
그리고 모든 필수 설정에 대한 기본값이 포함된다.

컨테이너는 스테이트리스하며
[불변(immutable)](https://glossary.cncf.io/immutable-infrastructure/)일 것으로 계획되었다.
즉, 이미 실행 중인 컨테이너의 코드를 수정해서는 안된다.
만일 컨테이너화된 애플리케이션에 수정을 가하고 싶다면,
수정 내역을 포함한 새로운 이미지를 빌드하고, 
업데이트된 이미지로부터
컨테이너를 새로 생성하는 것이 올바른 방법이다.

## 컨테이너 런타임

{{< glossary_definition term_id="container-runtime" length="all" >}}

일반적으로 클러스터에서 파드의 기본 컨테이너 런타임을 선택하도록 허용할 수 있다.
만일 클러스터에서 복수의 컨테이너 런타임을 사용해야 하는 경우,
파드에 대해 [런타임클래스(RuntimeClass)](/ko/docs/concepts/containers/runtime-class/)을 명시함으로써
쿠버네티스가 특정 컨테이너 런타임으로
해당 컨테이너들을 실행하도록 설정할 수 있다.

또한 런타임클래스을 사용하면 하나의 컨테이너 런타임을 사용하여 복수의 파드들을
각자 다른 설정으로 실행할 수도 있다.
