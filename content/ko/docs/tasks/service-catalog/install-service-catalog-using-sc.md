---
title: SC로 서비스 카탈로그 설치하기
content_type: task
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="서비스 카탈로그는" >}}

GCP [서비스 카탈로그 설치 프로그램](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation)
도구로 쿠버네티스 클러스터에 서비스 카탈로그를 쉽게 설치하거나 제거하여 
Google Cloud 프로젝트에 연결할 수 있다.

서비스 카탈로그는 Google Cloud뿐 아니라 모든 종류의 관리형 서비스와 함께 작동할 수 있다.

## {{% heading "prerequisites" %}}

* [서비스 카탈로그](/ko/docs/concepts/extend-kubernetes/service-catalog/)의 핵심 개념을 이해한다.
* [Go 1.6+](https://golang.org/dl/)를 설치하고 `GOPATH`를 설정한다.
* SSL 아티팩트 생성에 필요한 [cfssl](https://github.com/cloudflare/cfssl) 도구를 설치한다.
* 서비스 카탈로그에는 Kubernetes 버전 1.7 이상이 필요하다.
* [kubectl 설치 및 설정](/ko/docs/tasks/tools/)을 사용하여 Kubernetes 버전 1.7 이상의 클러스터에 연결하도록 구성한다.
* kubectl 사용자는 서비스 카탈로그를 설치하기 위해 *cluster-admin* 역할에 바인딩되어야 한다. 이것이 사실인지 확인하려면 다음 명령을 실행한다.

        kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>




<!-- steps -->
## 로컬 환경에 `sc` 설치하기

설치 프로그램은 로컬 컴퓨터에서 `sc`라는 CLI 도구로 실행된다.

`go get`을 사용하여 설치한다.

```shell
go get github.com/GoogleCloudPlatform/k8s-service-catalog/installer/cmd/sc
```

`sc`는 이제 `GOPATH/bin` 디렉토리에 설치되어야 한다.

## 쿠버네티스 클러스터에 서비스 카탈로그 설치하기

먼저 명령을 실행하여 모든 종속성이 설치되었는지 확인한다.

```shell
sc check
```

확인에 성공하면 다음을 반환해야 한다.

```
Dependency check passed. You are good to go.
```

그런 다음 설치 명령을 실행하고 백업에 사용할 `storageclass`를 지정한다.

```shell
sc install --etcd-backup-storageclass "standard"
```

## 서비스 카탈로그 제거하기

`sc` 도구를 사용하여 쿠버네티스 클러스터에서 서비스 카탈로그를 제거하려면 다음을 실행한다.

```shell
sc uninstall
```




## {{% heading "whatsnext" %}}

* [샘플 서비스 브로커](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers) 살펴보기
* [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) 프로젝트 탐색


