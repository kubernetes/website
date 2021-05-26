---
title: 서비스 카탈로그


content_type: concept
weight: 40
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="서비스 카탈로그는" >}}

[오픈 서비스 브로커 API 명세](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)에 정의된 서비스 브로커는 AWS, GCP 또는 Azure와 같은 타사 클라우드 공급자에 의해 제공되고 관리되는 매니지드 서비스의 세트에 대한 엔드포인트다.
매니지드 서비스의 예로 Microsoft Azure Cloud Queue, Amazon Simple Quere Service, Google Cloud Pub/Sub이 있으나 애플리케이션에서 사용할 수 있는 모든 소프트웨어 제품일 수 있다.

{{< glossary_tooltip text="클러스터 오퍼레이터" term_id="cluster-operator" >}}는 서비스 카탈로그를 사용하여 서비스 브로커가 제공하는 매니지드 서비스 목록을 탐색하거나 매니지드 서비스 인스턴스를 프로비저닝하고, 쿠버네티스 클러스터 내의 애플리케이션에서 사용할 수 있도록 바인딩할 수 있다.




<!-- body -->
## 유스케이스 예제

한 {{< glossary_tooltip text="애플리케이션 개발자" term_id="application-developer" >}}가 쿠버네티스 클러스터 내에서 실행되는 애플리케이션 중 일부로 메시지 큐를 사용하기를 원한다.
그러나 그러한 서비스에 대한 설정과 관리에는 부담이 따른다.
다행히 서비스 브로커를 통해 메시지 큐를 매니지드 서비스로 제공하는 클라우드 공급자가 있다.

클러스터 운영자는 서비스 카탈로그를 설정하고 이를 이용하여 클라우드 공급자의 서비스 브로커와 통신하여 메시지 큐 서비스의 인스턴스를 프로비저닝하고 쿠버네티스 클러스터 내의 애플리케이션에서 사용할 수 있게 한다.
따라서 애플리케이션 개발자는 메시지 큐의 세부 구현 또는 관리에 신경 쓸 필요가 없다.
애플리케이션은 메시지 큐에 서비스로 접속할 수 있다.

## 아키텍처

서비스 카탈로그는 [오픈 서비스 브로커 API](https://github.com/openservicebrokerapi/servicebroker)를 사용하여 쿠버네티스 API 서버가 초기 프로비저닝을 협상하고 애플리케이션이 매니지드 서비스를 사용하는데 필요한 자격 증명을 검색하는 중개자 역할을 하는 서비스 브로커와 통신한다.

스토리지에 etcd를 사용하여 확장 API 서버와 컨트롤러로 구현된다. 또한 쿠버네티스 1.7 이상에서 제공하는 [애그리게이션 레이어(aggregation layer)](/ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)를 사용하여 API를 제공한다.

<br>

![Service Catalog Architecture](/images/docs/service-catalog-architecture.svg)


### API 리소스

서비스 카탈로그는 `servicecatalog.k8s.io` API를 설치하고 다음 쿠버네티스 리소스를 제공한다.

* `ClusterServiceBroker`: 서버 연결 세부 사항을 캡슐화한, 서비스 브로커의 클러스터 내부 대표.
이들은 클러스터 내에서 새로운 유형의 매니지드 서비스를 사용할 수 있도록 하려는 클러스터 운영자가 만들고 관리한다.
* `ClusterServiceClass`: 특정 서비스 브로커가 제공하는 매니지드 서비스.
새로운 `ClusterServiceBroker` 리소스가 클러스터에 추가되면 서비스 카탈로그 컨트롤러는 서비스 브로커에 연결해서 사용 가능한 매니지드 서비스 목록을 얻는다. 그 다음 각 매니지드 서비스에 해당하는 새로운 `ClusterServiceClass` 리소스를 만든다.
* `ClusterServicePlan`: 매니지드 서비스의 특별 요청. 예를 들어, 매니지드 서비스는 무료 혹은 유료 티어와 같이 사용 가능한 서로 다른 상품이 있거나, SSD 스토리지를 사용하거나 더 많은 리소스를 갖는 등 다른 구성 옵션을 가질 수 있다. `ClusterServiceClass`와 유사하게, 새로운 `ClusterServiceBroker`가 클러스터에 추가되면, 서비스 카탈로그는 각 매니지드 서비스에 사용 가능한 서비스 플랜에 해당하는 새로운 `ClusterServicePlan` 리소스를 작성한다.
* `ServiceInstance`: `ClusterServiceClass`의 프로비저닝된 인스턴스.
클러스터 운영자가 하나 이상의 클러스터 애플리케이션에서 사용할 수 있도록 매니지드 서비스의 특정 인스턴스를 사용하기 위해 생성한다.
새로운 `ServiceInstance`리소스가 생성되면, 서비스 카탈로그 컨트롤러는 해당 서비스 브로커에 연결하여 서비스 인스턴스를 프로비저닝하도록 지시한다.
* `ServiceBinding`: `ServiceInstance`에 대한 자격 증명에 액세스한다.
자신의 애플리케이션이 `ServiceInstance`를 사용하기를 원하는 클러스터 운영자가 이들을 생성한다.
서비스 카탈로그 컨트롤러는 생성 시 파드에 마운트될 수 있는 서비스 인스턴스에 대한 연결 세부 정보와 자격 증명이 포함된 쿠버네티스 '시크릿(secret)'을 생성한다.

### 인증

서비스 카탈로그는 다음의 인증 방법을 지원한다.

* 기본 (username/password)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)

## 사용법

클러스터 운영자는 서비스 카탈로그 API 리소스를 사용하여 매니지드 서비스를 프로비저닝하여 쿠버네티스 클러스터 내에서 사용할 수 있게 한다. 관련 단계는 다음과 같다.

1. 서비스 브로커에서 사용 가능한 매니지드 서비스와 서비스 플랜을 나열.
1. 매니지드 서비스의 새 인스턴스 프로비저닝.
1. 연결 자격 증명을 반환하는 매니지드 서비스에 바인딩.
1. 연결 자격 증명을 애플리케이션에 매핑.

### 매니지드 서비스와 서비스 플랜 나열

먼저, 클러스터 운영자는 `servicecatalog.k8s.io` 그룹 내에 `ClusterServiceBroker` 리소스를 생성해야 한다. 이 리소스는 서비스 브로커 엔드포인트에 접근하는데 필요한 URL과 연결 세부 사항을 포함한다.

다음은 `ClusterServiceBroker` 리소스 예시이다.

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # 서비스 브로커의 엔드포인트를 가리킨다. (이 예시는 동작하지 않는 URL이다.)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # bearer 토큰 정보 혹은 TLS용 caBundle과 같은
  # 서비스 브로커와 통신하는데 사용될 수 있는 값을 여기에 추가할 수 있다.
  #####
```

다음은 서비스 브로커에서 사용 가능한 매니지드 서비스와 플랜을 나열하는 단계를 설명하는 시퀀스 다이어그램이다.

![List Services](/images/docs/service-catalog-list.svg)

1. `ClusterServiceBroker` 리소스가 서비스 카탈로그에 추가되면, 사용 가능한 서비스 목록에 대한 외부 서비스 브로커에 대한 호출을 발생시킨다.
1. 서비스 브로커는 사용 가능한 매니지드 서비스 목록과 서비스 플랜 목록을 반환한다. 이 목록은 각각 로컬 `ClusterServiceClass`와 `ClusterServicePlan` 리소스로 캐시된다.
1. 그런 다음 클러스터 운영자는 다음의 명령어를 사용하여 가용한 관리 서비스 목록을 얻을 수 있다.

        kubectl get clusterserviceclasses -o=custom-columns=SERVICE\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    아래와 같은 형태의 서비스 이름 목록이 출력된다.

        SERVICE NAME                           EXTERNAL NAME
        4f6e6cf6-ffdd-425f-a2c7-3c9258ad2468   cloud-provider-service
        ...                                    ...

    또한 다음의 명령어를 사용하여 가용한 서비스 플랜을 볼 수 있다.

        kubectl get clusterserviceplans -o=custom-columns=PLAN\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    아래와 같은 형태의 플랜 이름 목록이 출력된다.

        PLAN NAME                              EXTERNAL NAME
        86064792-7ea2-467b-af93-ac9694d96d52   service-plan-name
        ...                                    ...


### 새 인스턴스 프로비저닝

클러스터 운영자는 `ServiceInstance` 리소스를 생성하여 새 인스턴스 프로비저닝을 시작할 수 있다.

다음은 `ServiceInstance` 리소스의 예시이다.

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cloud-queue-instance
  namespace: cloud-apps
spec:
  # 이전에 반환된 서비스 중 하나를 참조
  clusterServiceClassExternalName: cloud-provider-service
  clusterServicePlanExternalName: service-plan-name
  #####
  # 이곳에 서비스 브로커가 사용할 수 있는
  # 파라미터를 추가할 수 있다.
  #####
```

다음의 시퀀스 다이어그램은 매니지드 서비스의 새 인스턴스 프로비저닝과 관련된 일련의 단계를 보여준다.

![Provision a Service](/images/docs/service-catalog-provision.svg)

1. `ServiceInstance` 리소스가 생성되면, 서비스 카탈로그는 서비스 인스턴스를 프로비저닝하기 위해 외부의 서비스 브로커 호출을 초기화한다.
1. 서비스 브로커는 새로운 매니지드 서비스 인스턴스를 생성하고 HTTP 응답을 리턴한다.
1. 그 후 클러스터 운영자는 인스턴스 상태가 준비되었는지 점검할 수 있다.

### 매니지드 서비스에 바인딩

새 인스턴스가 프로비저닝된 후, 클러스터 운영자는 애플리케이션이 서비스를 사용하는데 필요한 자격 증명을 얻기 위해 매니지드 서비스에 바인드해야 한다. 이것은 `ServiceBinding` 리소스를 생성하는 것으로 이루어진다.

다음은 `ServiceBinding` 리소스의 예시다.

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cloud-queue-binding
  namespace: cloud-apps
spec:
  instanceRef:
    name: cloud-queue-instance
  #####
  # 서비스 브로커가 사용할 수 있는 secretName, 서비스 어카운트 파라미터 등의
  # 추가 정보를 여기에 추가할 수 있다.
  #####
```

다음의 시퀀스 다이어그램은 매니지드 서비스 인스턴스에 바인딩하는 단계를 보여준다.

![Bind to a managed service](/images/docs/service-catalog-bind.svg)

1. `ServiceBinding`이 생성된 이후, 서비스 카탈로그는 서비스 인스턴스와 바인딩하는데 필요한 정보를 요청하는 외부 서비스 브로커를 호출한다.
1. 서비스 브로커는 적절한 서비스 어카운트에 대한 애플리케이션 권한/역할을 활성화한다.
1. 서비스 브로커는 매니지드 서비스 인스턴스에 연결하고 액세스하는데 필요한 정보를 리턴한다. 이는 제공자와 서비스에 특화되어 있으므로 서비스 프로바이더와 매니지드 서비스에 따라 다를 수 있다.

### 연결 자격 증명 매핑

바인딩 후 마지막 단계는 연결 자격 증명과 서비스 특화 정보를 애플리케이션에 매핑하는 것이다.
이런 정보는 클러스터의 애플리케이션이 액세스하여 매니지드 서비스와 직접 연결하는데 사용할 수 있는 시크릿으로 저장된다.

<br>

![Map connection credentials](/images/docs/service-catalog-map.svg)

#### 파드 구성 파일

이 매핑을 수행하는 한 가지 방법은 선언적 파드 구성을 사용하는 것이다.

다음 예시는 서비스 자격 증명을 애플리케이션에 매핑하는 방법을 설명한다. `sa-key`라는 키는 `provider-cloud-key`라는 볼륨에 저장되며, 애플리케이션은 이 볼륨을 `/var/secrets/provider/key.json`에 마운트한다. 환경 변수 `PROVIDER_APPLICATION_CREDENTIALS`는 마운트된 파일의 값에서 매핑된다.

```yaml
...
    spec:
      volumes:
        - name: provider-cloud-key
          secret:
            secretName: sa-key
      containers:
...
          volumeMounts:
          - name: provider-cloud-key
            mountPath: /var/secrets/provider
          env:
          - name: PROVIDER_APPLICATION_CREDENTIALS
            value: "/var/secrets/provider/key.json"
```

다음 예시는 시크릿 값을 애플리케이션 환경 변수에 매핑하는 방법을 설명한다. 이 예시에서 메시지 큐 토픽 이름은 `topic` 라는 키의 `provider-queue-credentials` 시크릿에서 환경 변수 `TOPIC`에 매핑된다.


```yaml
...
          env:
          - name: "TOPIC"
            valueFrom:
                secretKeyRef:
                   name: provider-queue-credentials
                   key: topic
```




## {{% heading "whatsnext" %}}

* 만약 당신이 {{< glossary_tooltip text="Helm Charts" term_id="helm-chart" >}}에 익숙하다면, 당신의 쿠버네티스 클러스터에 [Helm을 이용하여 서비스 카탈로그를 설치](/docs/tasks/service-catalog/install-service-catalog-using-helm/)할 수 있다. 다른 방법으로 [SC tool을 이용하여 서비스 카탈로그를 설치](/docs/tasks/service-catalog/install-service-catalog-using-sc/)할 수 있다.
* [샘플 서비스 브로커](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers) 살펴보기
* [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) 프로젝트 탐색
* [svc-cat.io](https://svc-cat.io/docs/) 살펴보기
