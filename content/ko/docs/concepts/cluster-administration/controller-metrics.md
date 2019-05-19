---
title: 컨트롤러 관리자 메트릭
content_template: templates/concept
weight: 100
---

{{% capture overview %}}
컨트롤러 관리자 메트릭은 컨트롤러 관리자의 성능과 상태에 대한
중요한 통찰을 제공한다.

{{% /capture %}}

{{% capture body %}}
## 컨트롤러 관리자 메트릭은 무엇인가

컨트롤러 관리자 메트릭은 컨트롤러 관리자의 성능과 상태에 대한 중요한 통찰을 제공한다.
메트릭은 go_routine count와 같은 일반적인 Go 언어 런타임 메트릭과 
etcd 요청 대기 시간 또는 클라우드 제공자(AWS, GCE, OpenStack) API 대기 시간과 같이 클러스터 상태를
측정할 수 있는 컨트롤러 특징적 메트릭을 포함한다.

쿠버네티스 1.7 부터, GCE, AWS, Vsphere 그리고 OpenStack의 저장소 작업에 대한 자세한 클라우드 제공자 메트릭을 사용할 수 있다.
이 메트릭은 영구 볼륨 작업의 상태 감시에 사용될 수 있다.

예를 들어, GCE의 경우 다음과 같은 메트릭이 호출된다:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```



## 구성


클러스터에서 컨트롤러-관리자 메트릭은 컨트롤러-관리자가 실행되고 있는 호스트의 `http://localhost:10252/metrics`를 통해서
이용 가능하다.

메트릭은 [프로메테우스 형식](https://prometheus.io/docs/instrumenting/exposition_formats/)에서 나오고, 사람이 읽을 수 있다.

운영 환경에서는 주기적으로 메트릭을 모으고, 일종의 시계열 데이터베이스로 만들기 위해,
프로메테우스 설정이나 다른 메트릭 수집기를 구성할 것이다.

{{% /capture %}}
