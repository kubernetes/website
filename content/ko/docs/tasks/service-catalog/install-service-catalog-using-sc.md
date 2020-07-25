---
title: SC를 사용하여 서비스 카탈로그(Service Catalog) 설치
content_type: task
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="서비스 카탈로그는" >}}

GCP [서비스 카탈로그 인스톨러](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation)
도구를 사용하여 쿠버네티스 클러스터에서 서비스 카탈로그를 Google Cloud 프로젝트에 연결하여
쉽게 설치하거나 제거할 수 있다.

서비스 카탈로그 자체는 Google Cloud 뿐만 아니라, 모든 종류의 매니지드 서비스와 작동할 수 있다.




## {{% heading "prerequisites" %}}

* [서비스 카탈로그](/docs/concepts/service-catalog/)의 주요 개념을 이해한다.
* [Go 1.6 이상](https://golang.org/dl/)을 설치하고 `GOPATH` 를 설정한다.
* SSL 아티팩트 생성에 필요한 [cfssl](https://github.com/cloudflare/cfssl) 도구를 설치한다.
* 서비스 카탈로그는 쿠버네티스 버전 1.7 이상이 필요하다.
* 쿠버네티스 v1.7 이상의 클러스터에 연결하도록 [kubectl을 설치하고 구성한다](/ko/docs/tasks/tools/install-kubectl/).
* kubectl 사용자는 서비스 카탈로그를 설치하기 위해 *cluster-admin* 롤에 바인드되어야 한다. 이것이 제대로 되어있는지 확인하려면, 다음 명령을 실행한다.

        kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>




<!-- steps -->
## 사용자의 로컬 환경에 `sc` 설치하기

인스톨러는 사용자의 로컬 컴퓨터에 `sc` 라는 CLI 도구로 실행된다.

`go get` 을 사용해서 설치한다.

```shell
go get github.com/GoogleCloudPlatform/k8s-service-catalog/installer/cmd/sc
```

`sc` 는 이제 `GOPATH/bin` 디렉터리에 설치되어야 한다.

## 쿠버네티스 클러스터에 서비스 카탈로그 설치

먼저, 의존성이 있는 모든 것이 설치되었는지 확인한다. 다음을 실행한다.

```shell
sc check
```

확인이 성공하면, 다음을 반환해야 한다.

```
Dependency check passed. You are good to go.
```

그런 다음, install 명령을 실행하고 백업을 위해 사용할 `storageclass` 를 지정한다.

```shell
sc install --etcd-backup-storageclass "standard"
```

## 서비스 카탈로그 제거

`sc` 도구를 사용하여 쿠버네티스 클러스터에서 서비스 카탈로그를 제거하려면, 다음을 실행한다.

```shell
sc uninstall
```




## {{% heading "whatsnext" %}}

* [샘플 서비스 브로커(service brokers)](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers) 보기.
* [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) 프로젝트 탐색하기.
