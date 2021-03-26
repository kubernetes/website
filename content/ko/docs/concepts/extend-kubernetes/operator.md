---
title: 오퍼레이터(operator) 패턴
content_type: concept
weight: 30
---

<!-- overview -->

오퍼레이터(Operator)는
[사용자 정의 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)를
사용하여 애플리케이션 및 해당 컴포넌트를 관리하는 쿠버네티스의 소프트웨어 익스텐션이다. 오퍼레이터는
쿠버네티스 원칙, 특히 [컨트롤 루프](/ko/docs/concepts/architecture/controller/)를 따른다.

<!-- body -->

## 동기 부여

오퍼레이터 패턴은 서비스 또는 서비스 셋을 관리하는 운영자의
주요 목표를 포착하는 것을 목표로 한다. 특정 애플리케이션 및
서비스를 돌보는 운영자는 시스템의 작동 방식, 배포 방법 및 문제가 있는 경우
대처 방법에 대해 깊이 알고 있다.

쿠버네티스에서 워크로드를 실행하는 사람들은 종종 반복 가능한 작업을 처리하기 위해
자동화를 사용하는 것을 좋아한다. 오퍼레이터 패턴은 쿠버네티스 자체가 제공하는 것 이상의
작업을 자동화하기 위해 코드를 작성하는 방법을 포착한다.

## 쿠버네티스의 오퍼레이터

쿠버네티스는 자동화를 위해 설계되었다. 기본적으로 쿠버네티스의 중추를 통해 많은
빌트인 자동화 기능을 사용할 수 있다. 쿠버네티스를 사용하여 워크로드 배포
및 실행을 자동화할 수 있고, *또한* 쿠버네티스가 수행하는 방식을
자동화할 수 있다.

쿠버네티스의 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}
개념을 통해 쿠버네티스 코드 자체를 수정하지 않고도 클러스터의 동작을
확장할 수 있다.
오퍼레이터는 [사용자 정의 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)의
컨트롤러 역할을 하는 쿠버네티스 API의 클라이언트이다.

## 오퍼레이터 예시 {#example}

오퍼레이터를 사용하여 자동화할 수 있는 몇 가지 사항은 다음과 같다.

* 주문형 애플리케이션 배포
* 해당 애플리케이션의 상태를 백업하고 복원
* 데이터베이스 스키마 또는 추가 구성 설정과 같은 관련 변경 사항에 따른
  애플리케이션 코드 업그레이드 처리
* 쿠버네티스 API를 지원하지 않는 애플리케이션에 서비스를
  게시하여 검색을 지원
* 클러스터의 전체 또는 일부에서 장애를 시뮬레이션하여 가용성 테스트
* 내부 멤버 선출 절차없이 분산 애플리케이션의
  리더를 선택

오퍼레이터의 모습을 더 자세하게 볼 수 있는 방법은 무엇인가? 자세한 예는
다음과 같다.

1. 클러스터에 구성할 수 있는 SampleDB라는 사용자 정의 리소스.
2. 오퍼레이터의 컨트롤러 부분이 포함된 파드의 실행을
   보장하는 디플로이먼트.
3. 오퍼레이터 코드의 컨테이너 이미지.
4. 컨트롤 플레인을 쿼리하여 어떤 SampleDB 리소스가 구성되어 있는지
   알아내는 컨트롤러 코드.
5. 오퍼레이터의 핵심은 API 서버에 구성된 리소스와 현재 상태를
   일치시키는 방법을 알려주는 코드이다.
   * 새 SampleDB를 추가하면 오퍼레이터는 퍼시스턴트볼륨클레임을
     설정하여 내구성있는 데이터베이스 스토리지, SampleDB를 실행하는 스테이트풀셋 및
     초기 구성을 처리하는 잡을 제공한다.
   * SampleDB를 삭제하면 오퍼레이터는 스냅샷을 생성한 다음 스테이트풀셋과 볼륨도
     제거되었는지 확인한다.
6. 오퍼레이터는 정기적인 데이터베이스 백업도 관리한다. 오퍼레이터는 각 SampleDB
   리소스에 대해 데이터베이스에 연결하고 백업을 수행할 수 있는 파드를 생성하는
   시기를 결정한다. 이 파드는 데이터베이스 연결 세부 정보 및 자격 증명이 있는
   컨피그맵 및 / 또는 시크릿에 의존한다.
7. 오퍼레이터는 관리하는 리소스에 견고한 자동화를 제공하는 것을 목표로 하기 때문에
   추가 지원 코드가 있다. 이 예제에서 코드는 데이터베이스가 이전 버전을 실행 중인지
   확인하고, 업그레이드된 경우 이를 업그레이드하는
   잡 오브젝트를 생성한다.

## 오퍼레이터 배포

오퍼레이터를 배포하는 가장 일반적인 방법은
커스텀 리소스 데피니션의 정의 및 연관된 컨트롤러를 클러스터에 추가하는 것이다.
컨테이너화된 애플리케이션을 실행하는 것처럼
컨트롤러는 일반적으로 {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}
외부에서 실행된다.
예를 들어 클러스터에서 컨트롤러를 디플로이먼트로 실행할 수 있다.

## 오퍼레이터 사용 {#using-operators}

오퍼레이터가 배포되면 오퍼레이터가 사용하는 리소스의 종류를 추가, 수정 또는
삭제하여 사용한다. 위의 예에 따라 오퍼레이터 자체에 대한
디플로이먼트를 설정한 후 다음을 수행한다.

```shell
kubectl get SampleDB                   # 구성된 데이터베이스 찾기

kubectl edit SampleDB/example-database # 일부 설정을 수동으로 변경하기
```

&hellip;이것으로 끝이다! 오퍼레이터는 변경 사항을 적용하고 기존 서비스를
양호한 상태로 유지한다.

## 자신만의 오퍼레이터 작성 {#writing-operator}

에코시스템에 원하는 동작을 구현하는 오퍼레이터가 없다면 직접 코딩할 수 있다.
[다음 내용](#다음-내용)에서는 클라우드 네이티브 오퍼레이터를 작성하는 데
사용할 수 있는 라이브러리 및 도구에 대한 몇 가지 링크를
찾을 수 있다.

또한 [쿠버네티스 API의 클라이언트](/ko/docs/reference/using-api/client-libraries/)
역할을 할 수 있는 모든 언어 / 런타임을 사용하여 오퍼레이터(즉, 컨트롤러)를 구현한다.



## {{% heading "whatsnext" %}}


* [사용자 정의 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)에 대해 더 알아보기
* [OperatorHub.io](https://operatorhub.io/)에서 유스케이스에 맞는 이미 만들어진 오퍼레이터 찾기
* 기존 도구를 사용하여 자신만의 오퍼레이터를 작성해보자. 다음은 예시이다.
  * [KUDO](https://kudo.dev/) (Kubernetes Universal Declarative Operator) 사용하기
  * [kubebuilder](https://book.kubebuilder.io/) 사용하기
  * 웹훅(WebHook)과 함께 [Metacontroller](https://metacontroller.app/)를
    사용하여 직접 구현하기
  * [오퍼레이터 프레임워크](https://operatorframework.io) 사용하기
* 다른 사람들이 사용할 수 있도록 자신의 오퍼레이터를 [게시](https://operatorhub.io/)하기
* 오퍼레이터 패턴을 소개한 [CoreOS 원본 글](https://web.archive.org/web/20170129131616/https://coreos.com/blog/introducing-operators.html) 읽기 (이 링크는 원본 글에 대한 보관 버전임)
* 오퍼레이터 구축을 위한 모범 사례에 대한 구글 클라우드(Google Cloud)의 [기사](https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps) 읽기
