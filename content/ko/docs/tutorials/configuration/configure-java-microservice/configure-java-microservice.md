---
title: "MicroProfile, 컨피그맵(ConfigMaps) 및 시크릿(Secrets)을 사용하여 구성 외부화(externalizing)"
content_type: tutorial
weight: 10
---

<!-- overview -->

이 튜토리얼에서는 마이크로서비스의 구성을 외부화하는 방법과 이유를 알아본다.
특히, 쿠버네티스 컨피그맵과 시크릿을 사용하여 환경 변수를
설정한 다음 MicroProfile Config를 이용한 사용 방법을 배운다.


## {{% heading "prerequisites" %}}

### 쿠버네티스 컨피그맵 및 시크릿 생성하기

쿠버네티스에서 도커 컨테이너에 대한 환경 변수를 설정하는 방법에는 
Dockerfile, kubernetes.yml, 쿠버네티스 컨피그맵 및 쿠버네티스 시크릿이 있다. 
이 튜토리얼에서는 사용자의 마이크로서비스에 값을 주입하기 위한 환경 변수를 설정하기 위해 
후자의 두 가지를 사용하는 방법에 대해 배운다. 
컨피그맵 및 시크릿을 사용할 때의 이점 중 하나는 여러 다른 컨테이너에 대해 서로 다른 환경 변수에 할당되는 것을 포함하여, 
여러 컨테이너에서 다시 사용할 수 있다는 것이다.

컨피그맵은 기밀이 아닌 키-값 쌍을 저장하는 API 오브젝트이다. 
대화형 튜토리얼에서는 컨피그맵을 사용하여 애플리케이션의 이름을 저장하는 방법을 배운다. 
컨피그맵에 대한 자세한 정보는 
[여기](/docs/tasks/configure-pod-container/configure-pod-configmap/)에서 문서를 찾을 수 있다.

시크릿은 키-값 쌍을 저장하는 데도 사용되지만, 기밀/민감한 정보를 위한 것이며 
Base64 인코딩을 사용하여 저장된다는 점에서 컨피그맵과 다르다. 
따라서 시크릿은 자격 증명, 키 및 토큰과 같은 항목을 저장하는 데 적합한 선택이 된다. 
이 내용은 대화형 튜토리얼에서 수행할 것이다. 
시크릿에 대한 자세한 내용은 [여기](/ko/docs/concepts/configuration/secret/)에서 문서를 찾을 수 있다.


### 코드로부터 구성 외부화

구성은 일반적으로 환경에 따라 변경되기 때문에, 외부화된 애플리케이션 구성(externalized application 
configuration)은 유용하다. 이를 이루기 위해, Java의 CDI(콘텍스트와 의존성 주입) 및 MicroProfile 
Config를 사용한다. MicroProfile Config는 클라우드 네이티브 마이크로서비스를 개발하고 배포하기 위한 
개방형 Java 기술 세트인 MicroProfile의 기능이다.

CDI는 느슨하게 결합된 협업 빈(beans)을 통해 애플리케이션을 어셈블할 수 있는 표준 종속성 주입(standard 
dependency injection) 기능을 제공한다. MicroProfile Config는 애플리케이션, 런타임 및 환경을 포함한 
다양한 소스에서 구성 속성을 가져오는 표준 방법을 앱과 마이크로서비스에 제공한다. 소스의 정의된 우선순위에 
따라 속성은 애플리케이션이 API를 통해 접근할 수 있는 단일 속성 집합으로 자동 결합된다. 대화형 튜토리얼에서는 
CDI와 MicroProfile을 함께 사용하여 쿠버네티스 컨피그맵 및 시크릿을 통한 외부 제공 속성을 검색하고 
애플리케이션 코드에 
삽입한다.

많은 오픈 소스 프레임워크와 런타임이 MicroProfile Config를 구현하고 지원한다. 대화형 튜토리얼을 통해 
클라우드 네이티브 앱과 마이크로서비스를 빌드하고 실행하기 위한 유연한 오픈 소스 Java 런타임인 Open Liberty를 
사용하게 될 것이다. 그러나, 모든 MicroProfile 호환 런타임을 
대신 사용할 수 있다.


## {{% heading "objectives" %}}

* 쿠버네티스 컨피그맵 및 시크릿 생성
* MicroProfile Config를 사용하여 마이크로서비스 구성 주입


<!-- lessoncontent -->

## 예제: MicroProfile, 컨피그맵 및 시크릿을 사용하여 구성 외부화
### [대화형 튜토리얼 시작](/ko/docs/tutorials/configuration/configure-java-microservice/configure-java-microservice-interactive/)
