---
title: 서비스 카탈로그
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog is" >}}  

[오픈 서비스 브로커 API 명세](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)에 정의된 서비스 브로커는 AWS, GCP 또는 Azure 와 같은 타사 클라우드 공급자에 의해 제공되고 관리되는 매니지드 서비스의 세트에 대한 엔드포인트다.
매니지드 서비스의 예로 Microsoft Azure Cloud Queue, Amazon Simple Quere Service, Google Cloud Pub/Sub이 있으나 애플리케이션에서 사용할 수 있는 모든 소프트웨어 제품일 수 있다.

{{< glossary_tooltip text="클러스터 오퍼레이터" term_id="cluster-operator" >}}는 서비스 카탈로그를 사용하여 서비스 브로커가 제공하는 매니지드 서비스 목록을 탐색하거나 매니지드 서비스 인스턴스를 프로비저닝 하고, 쿠버네티스 클러스터 내의 애플리케이션에서 사용할 수 있도록 바인딩 할 수 있다.

{{% /capture %}}


{{% capture body %}}
## 유스케이스 예제

한 애플리케이션 개발자가 쿠버네티스 클러스터 내에서 실행되는 응용프로그램 중 일부로 메시지 큐를 사용 하기를 원한다.
그러나 그러한 서비스를 설정하고 관리하는 노력을 원하지는 않는다.
다행히 서비스 브로커를 통해 메시지 큐를 매니지드 서비스로 제공하는 클라우드 공급자가 있다.

클러스터 운영자는 서비스 카탈로그를 설정하고 이를 이용하여 클라우드 공급자의 서비스 브로커와 통신하여 메시지 큐 서비스의 인스턴스를 프로비저닝 하고 쿠버네티스 클러스터 내의 애플리케이션에서 사용할 수 있게 한다.
따라서 애플리케이션 개발자는 메시지 큐의 세부 구현 또는 관리에 신경 쓸 필요가 없다.
애플리케이션은 그것을 서비스로 간단하게 사용할 수 있다.

## 아키텍처

서비스 카탈로그는 [오픈 서비스 브로커 API](https://github.com/openservicebrokerapi/servicebroker)를 사용하여 쿠버네티스 API 서버가 초기 프로비저닝을 협상하고 애플리케이션이 매니지드 서비스를 사용 하는데 필요한 자격 증명을 검색하는 중개자 역할을 하는 서비스 브로커와 통신한다.

스토리지에 etcd를 사용하여 확장 API 서버와 컨트롤러로 구현된다. 또한 쿠버네티스 1.7 이상에서 제공하는 [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)를 사용하여 API를 제공한다.

<br>

![Service Catalog Architecture](/images/docs/service-catalog-architecture.svg)


### API 리소스

서비스 카탈로그는 `servicecatalog.k8s.io` API를 설치하고 다음 쿠버네티스 리소스를 제공합니다.

* `ClusterServiceBroker`: 서버 연결 내부 사항을 캡슐화한, 서비스 브로커의 클러스터 내부 대표.
이들은 클러스터 내에서 새로운 유형의 매니지드 서비스를 사용 할 수 있도록 하려는 클러스터 운영자가 만들고 관리한다.
`ClusterServiceClass`: 특정 서비스 브로커가 제공하는 매니지드 서비스.
새로운 `ClusterServiceBroker` 자원이 클러스터에 추가되면 서비스 카탈로그 컨트롤러는 서비스 브로커에 연결해서 사용 가능한 매니지드 서비스 목록을 얻는다. 그 다음 각 매니지드 서비스에 해당하는 새로운 `ClusterServiceClass` 리소스를 만든다.
`ClusterServicePlan`: 매니지드 서비스의 특별 요청. 예를 들어, 매니지드 서비스는 무료 혹은 유료 티어와 같이 사용 가능한 다른 계획이 있거나, SSD 스토리지를 사용하거나 더 많은 리소스를 갖는 등 다른 구성 옵션을 가질 수 있다. `ClusterServiceClass`와 유사하게, 새로운 `ClusterServiceBroker`가 클러스터에 추가되면, 서비스 카탈로그는 각 매니지드 서비스에 사용 가능한 서비스 플랜에 해당하는 새로운 `ClusterServicePlan` 자원을 작성한다.
`ServiceInstance`: `ClusterServiceClass`의 프로비저닝 된 인스턴스.
클러스터 운영자가 하나 이상의 클러스터 애플리케이션에서 사용할 수 있도록 매니지드 서비스의 특정 인스턴스를 사용하기 위해 생성한다.
새로운 `ServiceInstance`자원이 생성되면, 서비스 카탈로그 컨트롤러는 해당 서비스 브로커에 연결하여 서비스 인스턴스를 프로비저닝하도록 지시한다.
`ServiceBinding`: `ServiceInstance`에 대한 자격 증명에 액세스한다.
자신의 애플리케이션이 `ServiceInstance`를 사용하기를 원하는 클러스터 운영자가 이들을 생성한다.
서비스 카탈로그 컨트롤러는 생성시 파드에 마운트 될 수 있는 서비스 인스턴스에 대한 연결 세부 정보와 자격 증명이 포함된 쿠버네티스 '시크릿'을 생성한다.

### 인증

서비스 카탈로그는 다음의 인증 방법을 지원한다:

* 기본 (username/password)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)

## 사용법

클러스터 운영자는 서비스 카탈로그 API 리소스를 사용하여 매니지드 서비스를 프로비저닝하여 쿠버네티스 클러스터 내에서 사용할 수 있게 한다. 관련 단계는 다음과 같다:

1. 서비스 브로커에서 사용 가능한 매니지드 서비스와 서비스 플랜을 나열한다.
1. 매니지드 서비스의 새 인스턴스 프로비저닝.
1. 연결 자격 증명을 반환하는 매니지드 서비스에 바인딩.
1. 연결 자격 증명을 애플리케이션에 매핑.

### 매니지드 서비스와 서비스 플랜 나열

먼저, 클러스터 운영자는 `servicecatalog.k8s.io` 그룹 내에 `ClusterServiceBroker` 리소스를 생성해야 한다. 이 자원은 서비스 브로커 엔드포인트에 접근하는데 필요한 URL과 연결 세부 사항이 포함한다.

This is an example of a `ClusterServiceBroker` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # Points to the endpoint of a service broker. (This example is not a working URL.)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # Additional values can be added here, which may be used to communicate
  # with the service broker, such as bearer token info or a caBundle for TLS.
  #####
```

The following is a sequence diagram illustrating the steps involved in listing managed services and Plans available from a service broker:

![List Services](/images/docs/service-catalog-list.svg)

1. Once the `ClusterServiceBroker` resource is added to Service Catalog, it triggers a call to the external service broker for a list of available services.
1. The service broker returns a list of available managed services and a list of Service Plans, which are cached locally as `ClusterServiceClass` and `ClusterServicePlan` resources respectively.
1. A cluster operator can then get the list of available managed services using the following command:

        kubectl get clusterserviceclasses -o=custom-columns=SERVICE\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    It should output a list of service names with a format similar to:

        SERVICE NAME                           EXTERNAL NAME
        4f6e6cf6-ffdd-425f-a2c7-3c9258ad2468   cloud-provider-service
        ...                                    ...

    They can also view the Service Plans available using the following command:

        kubectl get clusterserviceplans -o=custom-columns=PLAN\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    It should output a list of plan names with a format similar to:

        PLAN NAME                              EXTERNAL NAME
        86064792-7ea2-467b-af93-ac9694d96d52   service-plan-name
        ...                                    ...


### Provisioning a new instance

A cluster operator can initiate the provisioning of a new instance by creating a `ServiceInstance` resource.

This is an example of a `ServiceInstance` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cloud-queue-instance
  namespace: cloud-apps
spec:
  # References one of the previously returned services
  clusterServiceClassExternalName: cloud-provider-service
  clusterServicePlanExternalName: service-plan-name
  #####
  # Additional parameters can be added here,
  # which may be used by the service broker.
  #####
```

The following sequence diagram illustrates the steps involved in provisioning a new instance of a managed service:

![Provision a Service](/images/docs/service-catalog-provision.svg)

1. When the `ServiceInstance` resource is created, Service Catalog initiates a call to the external service broker to provision an instance of the service.
1. The service broker creates a new instance of the managed service and returns an HTTP response.
1. A cluster operator can then check the status of the instance to see if it is ready.

### Binding to a managed service

After a new instance has been provisioned, a cluster operator must bind to the managed service to get the connection credentials and service account details necessary for the application to use the service. This is done by creating a `ServiceBinding` resource.

The following is an example of a `ServiceBinding` resource:

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
  # Additional information can be added here, such as a secretName or
  # service account parameters, which may be used by the service broker.
  #####
```

The following sequence diagram illustrates the steps involved in binding to a managed service instance:

![Bind to a managed service](/images/docs/service-catalog-bind.svg)

1. After the `ServiceBinding` is created, Service Catalog makes a call to the external service broker requesting the information necessary to bind with the service instance.
1. The service broker enables the application permissions/roles for the appropriate service account.
1. The service broker returns the information necessary to connect and access the managed service instance. This is provider and service-specific so the information returned may differ between Service Providers and their managed services.

### Mapping the connection credentials

After binding, the final step involves mapping the connection credentials and service-specific information into the application.
These pieces of information are stored in secrets that the application in the cluster can access and use to connect directly with the managed service.

<br>

![Map connection credentials](/images/docs/service-catalog-map.svg)

#### Pod configuration File

One method to perform this mapping is to use a declarative Pod configuration.

The following example describes how to map service account credentials into the application. A key called `sa-key` is stored in a volume named `provider-cloud-key`, and the application mounts this volume at `/var/secrets/provider/key.json`. The environment variable `PROVIDER_APPLICATION_CREDENTIALS` is mapped from the value of the mounted file.

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

The following example describes how to map secret values into application environment variables. In this example, the messaging queue topic name is mapped from a secret named `provider-queue-credentials` with a key named `topic` to the environment variable `TOPIC`.


```yaml
...
          env:
          - name: "TOPIC"
            valueFrom:
                secretKeyRef:
                   name: provider-queue-credentials
                   key: topic
```

{{% /capture %}}


{{% capture whatsnext %}}
* If you are familiar with {{< glossary_tooltip text="Helm Charts" term_id="helm-chart" >}}, [install Service Catalog using Helm](/docs/tasks/service-catalog/install-service-catalog-using-helm/) into your Kubernetes cluster. Alternatively, you can [install Service Catalog using the SC tool](/docs/tasks/service-catalog/install-service-catalog-using-sc/).
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) project.
* View [svc-cat.io](https://svc-cat.io/docs/).

{{% /capture %}}



