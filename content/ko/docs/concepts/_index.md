---
title: 개념
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

개념 섹션을 통해 쿠버네티스 시스템을 구성하는 요소와 클러스터를 표현하는데 사용되는 추상 개념에 대해 배우고 쿠버네티스가 작동하는 방식에 대해 보다 깊이 이해할 수 있다.

{{% /capture %}}

{{% capture body %}}

## 개요

쿠버네티스를 사용하려면, *쿠버네티스 API 오브젝트* 로 클러스터에 대해 사용자가 *바라는 상태* 를 기술해야 한다. 어떤 애플리케이션이나 워크로드를 구동시키려고 하는지, 어떤 컨테이너 이미지를 쓰는지, 복제의 수는 몇 개인지, 어떤 네트워크와 디스크 자원을 쓸 수 있도록 할 것인지 등을 의미한다. 바라는 상태를 설정하는 방법은 쿠버네티스 API를 사용해서 오브젝트를 만드는 것인데, 대개 `kubectl`이라는 커맨드라인 인터페이스를 사용한다. 클러스터와 상호 작용하고 바라는 상태를 설정하거나 수정하기 위해서 쿠버네티스 API를 직접 사용할 수도 있다.

바라는 상태를 설정하면, *쿠버네티스 컨트롤 플레인* 은 Pod Lifecycle Event Generator (PLEG) 를 통해 클러스터의 현재 상태를 바라는 상태와 일치시킨다. 그렇게 함으로써, 쿠버네티스가 컨테이너를 시작 또는 재시작하거나, 주어진 애플리케이션의 복제 수를 스케일링하는 등의 다양한 작업을 자동으로 수행한다. 쿠버네티스 컨트롤 플레인은 클러스터에서 실행 중인 프로세스의 묶음(collection)으로 구성된다.

* **쿠버네티스 마스터**는 클러스터 내 마스터 노드로 지정된 노드 내에서 구동되는 세 개의 프로세스 묶음이다. 해당 프로세스는 [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) 및 [kube-scheduler](/docs/admin/kube-scheduler/)이다.
* 클러스터 내 마스터 노드가 아닌 각각의 노드는 다음 두 개의 프로세스를 구동시킨다.
  * 쿠버네티스 마스터와 통신하는 **[kubelet](/docs/admin/kubelet/)**.
  * 각 노드의 쿠버네티스 네트워킹 서비스를 반영하는 네트워크 프록시인 **[kube-proxy](/docs/admin/kube-proxy/)**.

## 쿠버네티스 오브젝트

쿠버네티스는 시스템의 상태를 나타내는 추상 개념을 다수 포함하고 있다. 컨테이너화되어 배포된 애플리케이션과 워크로드, 이에 연관된 네트워크와 디스크 자원, 그 밖에 클러스터가 무엇을 하고 있는지에 대한 정보가 이에 해당한다. 이런 추상 개념은 쿠버네티스 API 내 오브젝트로 표현된다. 보다 자세한 내용은 [쿠버네티스 오브젝트 개요](/docs/concepts/abstractions/overview/) 문서를 참조한다.

기초적인 쿠버네티스 오브젝트에는 다음과 같은 것들이 있다.

* [파드](/docs/concepts/workloads/pods/pod-overview/)
* [서비스](/docs/concepts/services-networking/service/)
* [볼륨](/docs/concepts/storage/volumes/)
* [네임스페이스](/docs/concepts/overview/working-with-objects/namespaces/)

추가로, 쿠버네티스에는 컨트롤러라는 보다 높은 수준의 추상 개념도 다수 있다. 컨트롤러는 기초 오브젝트를 기반으로, 부가 기능 및 편의 기능을 제공해준다. 다음이 포함된다.

* [레플리카 셋](/docs/concepts/workloads/controllers/replicaset/)
* [디플로이먼트](/docs/concepts/workloads/controllers/deployment/)
* [스테이트풀 셋](/docs/concepts/workloads/controllers/statefulset/)
* [데몬 셋](/docs/concepts/workloads/controllers/daemonset/)
* [잡](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## 쿠버네티스 컨트롤 플레인

쿠버네티스 마스터와 kubelet 프로세스와 같은 쿠버네티스 컨트롤 플레인의 다양한 구성 요소는 쿠버네티스가 클러스터와 통신하는 방식을 관장한다. 컨트롤 플레인은 시스템 내 모든 쿠버네티스 오브젝트의 레코드를 유지하면서, 오브젝트의 상태를 관리하는 제어 루프를 지속적으로 구동시킨다. 컨트롤 플레인의 제어 루프는 클러스터 내 변경이 발생하면 언제라도 응답하고 시스템 내 모든 오브젝트의 실제 상태가 사용자가 바라는 상태와 일치시키기 위한 일을 한다.

예를 들어, 쿠버네티스 API를 사용해서 디플로이먼트를 만들 때에는, 바라는 상태를 시스템에 신규로 입력해야한다. 쿠버네티스 컨트롤 플레인이 오브젝트 생성을 기록하고, 사용자 지시대로 필요한 애플리케이션을 시작시키고 클러스터 노드에 스케줄링한다. 그래서 결국 클러스터의 실제 상태가 바라는 상태와 일치하게 된다.

### 쿠버네티스 마스터

클러스터에 대해 바라는 상태를 유지할 책임은 쿠버네티스 마스터에 있다. `kubectl` 커맨드라인 인터페이스와 같은 것을 사용해서 쿠버네티스로 상호 작용할 때에는 쿠버네티스 마스터와 통신하고 있는 셈이다.

> "마스터"는 클러스터 상태를 관리하는 프로세스의 묶음이다. 주로 모든 프로세스는 클러스터 내 단일 노드에서 구동되며, 이 노드가 바로 마스터이다. 마스터는 가용성과 중복을 위해 복제될 수도 있다.

### 쿠버네티스 노드

클러스터 내 노드는 애플리케이션과 클라우드 워크플로우를 구동시키는 머신(VM, 물리 서버 등)이다. 쿠버네티스 마스터는 각 노드를 관리한다. 직접 노드와 직접 상호 작용할 일은 거의 없을 것이다.

#### 오브젝트 메타데이터


* [어노테이션](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

개념 페이지를 작성하기를 원하면,
개념 페이지 유형과 개념 템플릿에 대한 정보가 있는
[페이지 템플릿 사용하기](/docs/home/contribute/page-templates/)를 참조한다.

{{% /capture %}}
