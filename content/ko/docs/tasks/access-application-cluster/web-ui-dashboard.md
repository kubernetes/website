---
title: 웹 UI (대시보드)
content_template: templates/concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Use the Web UI Dashboard
---

{{% capture overview %}}
대시보드는 웹-기반 쿠버네티스 유저 인터페이스이다. 대시보드를 통해 컨테이너화 된 애플리케이션을 쿠버네티스 클러스터에 배포할 수 있고, 컨테이너화 된 애플리케이션을 트러블슈팅할 수 있고, 클러스터 리소스들을 관리할 수 있다. 대시보드를 통해 클러스터에서 동작중인 애플리케이션의 정보를 볼 수 있고, 개별적인 쿠버네티스 리소스들을(예를 들면 디플로이먼트, 잡, 데몬셋 등) 생성하거나 수정할 수 있다. 예를 들면, 디플로이먼트를 스케일하거나, 롤링 업데이트를 초기화하거나, 파드를 재시작하거나 또는 배포 마법사를 이용해 새로운 애플리케이션을 배포할 수 있다.

또한 대시보드는 클러스터 내부에 있는 쿠버네티스 리소스들의 상태와 발생되는 모든 에러들을 정보로 제공한다.


Dashboard is a web-based Kubernetes user interface. You can use Dashboard to deploy containerized applications to a Kubernetes cluster, troubleshoot your containerized application, and manage the cluster resources. You can use Dashboard to get an overview of applications running on your cluster, as well as for creating or modifying individual Kubernetes resources (such as Deployments, Jobs, DaemonSets, etc). For example, you can scale a Deployment, initiate a rolling update, restart a pod or deploy new applications using a deploy wizard.

Dashboard also provides information on the state of Kubernetes resources in your cluster and on any errors that may have occurred.

![Kubernetes Dashboard UI](/images/docs/ui-dashboard.png)

{{% /capture %}}


{{% capture body %}}

## 대시보드 UI 배포
## Deploying the Dashboard UI

대시보드 UI는 default로 배포되지 않는다. 배포하기 위해서는, 다음 커맨드를 동작한다.
The Dashboard UI is not deployed by default. To deploy it, run the following command:

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta1/aio/deploy/recommended.yaml
```

## 대시보드 UI 접근
## Accessing the Dashboard UI

클러스터 데이터를 보호하기 위해, 대시보드는 기본적으로 최소한의 RBAC 설정을 제공한다. 현재, 대시보드는 Bearer 토큰으로 로그인 하는 방법을 제공한다. 다음 데모와 같이 토큰을 생성하기 위해서는, [샘플 유저 만들기](https://github.com/kubernetes/dashboard/wiki/Creating-sample-user) 가이드를 따른다.
To protect your cluster data, Dashboard deploys with a minimal RBAC configuration by default. Currently, Dashboard only supports logging in with a Bearer Token. To create a token for this demo, you can follow our guide on [creating a sample user](https://github.com/kubernetes/dashboard/wiki/Creating-sample-user).

{{< warning >}}
튜토리얼에서 만들어진 샘플 유저는 어드민 권한을 가지고 이는 교육 목적으로 사용한다.
The sample user created in the tutorial will have administrative privileges and is for educational purposes only.
{{< /warning >}}

### 커맨드 라인 프록시
### Command line proxy
kubectl 커맨드라인 툴을 이용해 다음 커맨드를 실행함으로써 대시보드에 접근 가능하다.
You can access Dashboard using the kubectl command-line tool by running the following command:

```
kubectl proxy
```

Kubectl은 http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/ 에 대시보드로 접근 가능하게 해줄 것이다.
Kubectl will make Dashboard available at http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/.

UI는 커맨드가 실행된 머신에서 _오직_ 접근 가능하다. 상세 내용은 `kubectl proxy --help` 옵션을 확인한다.
The UI can _only_ be accessed from the machine where the command is executed. See `kubectl proxy --help` for more options.

{{< note >}}
Kubeconfig 인증 방법은 외부 아이덴티티 프로파이더 또는 x509 인증서를 지원하지 않는다.
Kubeconfig Authentication method does NOT support external identity providers or x509 certificate-based authentication.
{{< /note >}}

## 웰컴 뷰
## Welcome view

초기 클러스터 대시보드에 접근하면, 웰컴 페이지를 볼 수 있다. 이 페이지는 버튼으로 첫 애플리케이션을 배포한 것 뿐만 아니라 이 문서의 링크를 포함하고 있다. 게다가, 대시보드가 있는 클러스터에서 기본적으로 `kube-system` [네임스페이스](/docs/tasks/administer-cluster/namespaces/)이 동작중인 시스템 애플리케이션을 볼 수 있다.
When you access Dashboard on an empty cluster, you'll see the welcome page. This page contains a link to this document as well as a button to deploy your first application. In addition, you can view which system applications are running by default in the `kube-system` [namespace](/docs/tasks/administer-cluster/namespaces/) of your cluster, for example the Dashboard itself.

![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)

## 컨테이너화 된 애플리케이션 배포
## Deploying containerized applications

대시보드는 디플로이먼트와 간단한 위자드를 통한 선택적인 서비스를 컨테이너화 된 애플리케이션으로 생성하고 배포할 수 있다. 애플리케이션 세부 정보를 수동으로 지정할 수 있고, 또는 애플리케이션 설정을 포함한 YAML, JSON 파일을 업로드 할 수 있다.
Dashboard lets you create and deploy a containerized application as a Deployment and optional Service with a simple wizard. You can either manually specify application details, or upload a YAML or JSON file containing application configuration.

시작하는 페이지의 상위 오른쪽 코너에 있는 **CREATE** 버튼을 클릭한다.
Click the **CREATE** button in the upper right corner of any page to begin.

### 애플리케이션 세부 정보 지정
### Specifying application details

배포 위자드는 다음 정보를 제공한다.
The deploy wizard expects that you provide the following information:

- **App name** (필수): 애플리케이션 이름. [레이블](/docs/concepts/overview/working-with-objects/labels/) 이름은 배포할 모든 디플로이먼트와 서비스에 추가되어야 한다.
- **App name** (mandatory): Name for your application. A [label](/docs/concepts/overview/working-with-objects/labels/) with the name will be added to the Deployment and Service, if any, that will be deployed.

  애플리케이션 이름은 선택된 쿠버네티스 [네임스페이스](/docs/tasks/administer-cluster/namespaces/) 안에서 유일해야 한다. 소문자로 시작해야하며, 소문자 또는 숫자로 끝나고, 소문자, 숫자 및 대쉬(-)만을 포함해야한다. 24 문자만을 제한한다. 처음과 끝의 스페이스는 무시된다.
  The application name must be unique within the selected Kubernetes [namespace](/docs/tasks/administer-cluster/namespaces/). It must start with a lowercase character, and end with a lowercase character or a number, and contain only lowercase letters, numbers and dashes (-). It is limited to 24 characters. Leading and trailing spaces are ignored.

- **Container image** (필수): 레지스트리에 올라간 퍼블릭 도커 [컨테이너 이미지](/docs/concepts/containers/images/) 또는 프라이빗 이미지(대체로 Google Container Registry 또는 도커 허브에 올라간)의 URL. 컨테이너 이미지 사양은 콜론으로 끝난다.
- **Container image** (mandatory): The URL of a public Docker [container image](/docs/concepts/containers/images/) on any registry, or a private image (commonly hosted on the Google Container Registry or Docker Hub). The container image specification must end with a colon.

- **Number of pods** (필수): 배포하고 싶은 애플리케이션의 원하는 목표 파드 개수. 값은 양수이어야 한다.
- **Number of pods** (mandatory): The target number of Pods you want your application to be deployed in. The value must be a positive integer.

  [디플로이먼트](/docs/concepts/workloads/controllers/deployment/)는 클러스터 안에서 요구된 파드 숫자를 유지하기 위해 생성할 것이다.
  A [Deployment](/docs/concepts/workloads/controllers/deployment/) will be created to maintain the desired number of Pods across your cluster.

- **Service** (선택): 아마도 클러스터 밖( 외부 서비스 )에 퍼블릭 IP 주소를 가진  외부로 노출 시키고 싶은 [서비스](/docs/concepts/services-networking/service/)의 몇몇의 애플리케이션 (예를 들어, 프론트엔드)이 있을 것이다. 외부 서비스들을 위해, 한개 또는 여러 개의 포트들을 열어 둘 필요가 있다. [이 곳](/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/) 내용을 더 참고한다.
- **Service** (optional): For some parts of your application (e.g. frontends) you may want to expose a [Service](/docs/concepts/services-networking/service/) onto an external, maybe public IP address outside of your cluster (external Service). For external Services, you may need to open up one or more ports to do so. Find more details [here](/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/).

  클러스터 내부에서만 보고 싶은 어떤 서비스들이 있을 것인다. 이를 내부 서비스라고 한다.
  Other Services that are only visible from inside the cluster are called internal Services.

  서비스 타입과는 무관하게, 서비스 생성을 선택해서 컨테이너의 (들어오는 패킷의) 포트를 리슨한다면, 두 개의 포트를 정의해야 한다. 서비스는 컨테이너가 바라보는 타겟 포트와 (들어오는 패킷의) 맵핑하는 포트가 만들어져야 할 것이다. 서비스는 배포된 파드에 라우팅 될 것이다. 지원하는 프로토콜은 TCP와 UDP이다. 서비스가 이용하는 내부 DNS 이름은 애플리케이션 이름으로 지정한 값이 될 것이다.
  Irrespective of the Service type, if you choose to create a Service and your container listens on a port (incoming), you need to specify two ports. The Service will be created mapping the port (incoming) to the target port seen by the container. This Service will route to your deployed Pods. Supported protocols are TCP and UDP. The internal DNS name for this Service will be the value you specified as application name above.

만약 필요하다면, 더 많은 세팅을 지정할 수 있는 **Advanced options** 섹션에서 확장할 수 있다.
If needed, you can expand the **Advanced options** section where you can specify more settings:

- **Description**: 입력하는 텍스트값은 디플로이먼트에 [어노테이션](/docs/concepts/overview/working-with-objects/annotations/) 으로 추가될 것이고, 애플리케이션의 세부사항에 표시될 것이다.
- **Description**: The text you enter here will be added as an [annotation](/docs/concepts/overview/working-with-objects/annotations/) to the Deployment and displayed in the application's details.

- **Labels**: 애플리케이션에 사용되는 기본적인 [레이블](/docs/concepts/overview/working-with-objects/labels/)은 애플리케이션 이름과 버전이다. 릴리스, 환경, 티어, 파티션, 그리고 릴리스 트랙과 같은 레이블을 디플로이먼트, 서비스, 그리고 파드를 생성할 때 추가적으로 정의할 수 있다.
- **Labels**: Default [labels](/docs/concepts/overview/working-with-objects/labels/) to be used for your application are application name and version. You can specify additional labels to be applied to the Deployment, Service (if any), and Pods, such as release, environment, tier, partition, and release track.

  예를 들면:
  Example:

  ```conf
release=1.0
tier=frontend
environment=pod
track=stable
```

- **Namespace**: 쿠버네티스는 동일한 물리 클러스터를 바탕으로 여러 가상의 클러스터를 제공한다. 이러한 가상 클러스터들을 [네임스페이스](/docs/tasks/administer-cluster/namespaces/)라고 부른다. 논리적으로 명명된 그룹으로 리소스들을 나눈다.
- **Namespace**: Kubernetes supports multiple virtual clusters backed by the same physical cluster. These virtual clusters are called [namespaces](/docs/tasks/administer-cluster/namespaces/). They let you partition resources into logically named groups.

  대시보드는 드롭다운 리스트로 가능한 모든 네임스페이스를 제공하고, 새로운 네임스페이스를 생성할 수 있도록 한다. 네임스페이스 이름은 최대 63개의 영숫자 단어와 대시(-)를 포함하고 있지만 대문자를 가지지 못한다.
  네임스페이스 이름은 숫자로만 구성할 수 없다. 만약 이름을 10이라는 숫자로 세팅한다면, 파드는 기본 네임스페이스로 배정하게 될 것이다.
  Dashboard offers all available namespaces in a dropdown list, and allows you to create a new namespace. The namespace name may contain a maximum of 63 alphanumeric characters and dashes (-) but can not contain capital letters.
  Namespace names should not consist of only numbers. If the name is set as a number, such as 10, the pod will be put in the default namespace.

  네임스페이스 생성이 성공하는 경우, 생성된 네임스페이스가 기본으로 선택된다. 만약 생성에 실패하면, 첫번째 네임스페이스가 선택된다.
  In case the creation of the namespace is successful, it is selected by default. If the creation fails, the first namespace is selected.

- **Image Pull Secret**: 특정 도커 컨테이너 이미지가 프라이빗한 경우, [풀 시크릿](/docs/concepts/configuration/secret/) 증명을 요구한다.
- **Image Pull Secret**: In case the specified Docker container image is private, it may require [pull secret](/docs/concepts/configuration/secret/) credentials.

  대시보드는 가능한 모든 시크릿을 드롭다운 리스트로 제공하며, 새로운 시크릿을 생성 할 수 있도록 한다. 시크릿 이름은 예를 들어 `new.image-pull.secret` 과 같이 DNS 도메인 이름 구문으로 따르기로 한다. 시크릿 내용은 base64 인코딩 방식이며, [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) 파일로 정의된다. 시크릿 이름은 최대 253 문자를 포함할 수 있다.
  Dashboard offers all available secrets in a dropdown list, and allows you to create a new secret. The secret name must follow the DNS domain name syntax, e.g. `new.image-pull.secret`. The content of a secret must be base64-encoded and specified in a  [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) file. The secret name may consist of a maximum of 253 characters.

  이미지 풀 시크릿의 생성이 성공한 경우, 기본으로 선택된다. 만약 생성에 실패하면, 시크릿은 허용되지 않는다.
  In case the creation of the image pull secret is successful, it is selected by default. If the creation fails, no secret is applied.

- **CPU requirement (cores)** 와 **Memory requirement (MiB)**: 컨테이너를 위한 최소 [리소스 상한](/docs/tasks/configure-pod-container/limit-range/)을 정의할 수 있다. 기본적으로, 파드는 CPU와 메모리 상한을 두지 않고 동작한다.
- **CPU requirement (cores)** and **Memory requirement (MiB)**: You can specify the minimum [resource limits](/docs/tasks/configure-pod-container/limit-range/) for the container. By default, Pods run with unbounded CPU and memory limits.

- **Run command** 와 **Run command arguments**: 기본적으로, 컨테이너는 특정 도커 이미지의 [진입점 명령어](/docs/user-guide/containers/#containers-and-commands)로 동작한다. 명령어 옵션과 인자를 기본 옵션에 우선 적용하여 사용할 수 있다.
- **Run command** and **Run command arguments**: By default, your containers run the specified Docker image's default [entrypoint command](/docs/user-guide/containers/#containers-and-commands). You can use the command options and arguments to override the default.

- **Run as privileged**: 다음 세팅은 호스트에서 루트 권한을 가진 프로세스들이 [특권을 가진 컨테이너](/docs/user-guide/pods/#privileged-mode-for-pod-containers)의 프로세스들과 동등한 지 아닌지 정의한다. 특권을 가진 컨테이너는 네트워크 스택과 디바이스에 접근하는 것을 조작하도록 활용할 수 있다.
- **Run as privileged**: This setting determines whether processes in [privileged containers](/docs/user-guide/pods/#privileged-mode-for-pod-containers) are equivalent to processes running as root on the host. Privileged containers can make use of capabilities like manipulating the network stack and accessing devices.

- **Environment variables**: 쿠버네티스 서비스를 [환경 변수](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)를 통해 노출한다. 환경 변수 또는 인자를 환경 변수들의 값으로 커맨드를 통해 구성할 수 있다. 애플리케이션들이 서비스를 찾는데 사용된다. 값들은 `$(VAR_NAME)` 구문을 사용하는 다른 변수들로 참조할 수 있다.
- **Environment variables**: Kubernetes exposes Services through [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/). You can compose environment variable or pass arguments to your commands using the values of environment variables. They can be used in applications to find a Service. Values can reference other variables using the `$(VAR_NAME)` syntax.

### YAML 또는 JSON 파일 업로드
### Uploading a YAML or JSON file

쿠버네티스는 선언적인 설정을 제공한다. 이 방식으로 모든 설정은 쿠버네티스 [API](/docs/concepts/overview/kubernetes-api/) 리소스 스키마를 이용하여 YAML 또는 JSON 설정 파일에 저장한다.
Kubernetes supports declarative configuration. In this style, all configuration is stored in YAML or JSON configuration files using the Kubernetes [API](/docs/concepts/overview/kubernetes-api/) resource schemas.

배포 마법사를 통해 애플리케이션 세부사항들을 지정하는 대신, 애플리케이션을 YAML 또는 JSON 파일로 정의할 수 있고 대시보드를 이용해서 파일을 업로드할 수 있다.  
As an alternative to specifying application details in the deploy wizard, you can define your application in YAML or JSON files, and upload the files using Dashboard.

## 대시보드 사용
## Using Dashboard
다음 섹션들은 어떻게 제공하고 어떻게 사용할 수 있는지에 대한 쿠버네티스 대시보드 UI의 모습을 보여준다.
Following sections describe views of the Kubernetes Dashboard UI; what they provide and how can they be used.

### 탐색
### Navigation

클러스터에 쿠버네티스 오프젝트를 정의할 때, 대시보드는 초기화된 뷰를 제공한다. 기본적으로 _default_ 네임스페이스의 오프벡트만이 보여지고 탐색 창에 위치한 네임스페이스 셀렉터를 이용해 변경할 수 있다.
When there are Kubernetes objects defined in the cluster, Dashboard shows them in the initial view. By default only objects from the _default_ namespace are shown and this can be changed using the namespace selector located in the navigation menu.

대시보드는 몇가지 메뉴 카테고리 중에서 대부분의 쿠버네티스 오브젝트 종류와 그룹을 보여준다.
Dashboard shows most Kubernetes object kinds and groups them in a few menu categories.

#### 어드민 개요
#### Admin Overview
클러스터와 네임스페이스 관리자에게 대시보드는 노드, 네임스페이스 그리고 퍼시스턴트 볼륨과 세부사항들이 보여진다. 노드는 모든 노드를 통틀어 CPU와 메모리 사용량을 보여준다. 세부사항은 각 노드들에 대한 사용량, 사양, 상태, 할당된 리소스, 이벤트 그리고 노드에서 돌아가는 파드를 보여준다.
For cluster and namespace administrators, Dashboard lists Nodes, Namespaces and Persistent Volumes and has detail views for them. Node list view contains CPU and memory usage metrics aggregated across all Nodes. The details view shows the metrics for a Node, its specification, status, allocated resources, events and pods running on the node.

#### 워크로드
#### Workloads
선택된 네임스페이스에서 구동되는 모든 애플리케이션을 보여준다. 애플리케이션의 워크로드 종류(예를 들어, 디플로이먼트, 레플리카 셋, 스테이트풀 셋 등)를 보여주고 각각의 워크로드 종류는 따로 보여진다. 리스트는 예를 들어 레플리카 셋에서 준비된 파드의 숫자 또는 파드의 현재 메모리 사용량과 같은 워크로드에 대한 실용적인 정보를 요약한다.
Shows all applications running in the selected namespace. The view lists applications by workload kind (e.g., Deployments, Replica Sets, Stateful Sets, etc.) and each workload kind can be viewed separately. The lists summarize actionable information about the workloads, such as the number of ready pods for a Replica Set or current memory usage for a Pod.

워크로드에 대한 세부적인 것들은 상태와 사양 정보, 오프젝트들 간의 관계를 보여준다. 예를 들어, 레플리카 셋으로 관리하는 파드들 또는 새로운 레플리카 셋과 디플로이먼트를 위한 Horizontal Pod Autoscalers 이다.
Detail views for workloads show status and specification information and surface relationships between objects. For example, Pods that Replica Set is controlling or New Replica Sets and Horizontal Pod Autoscalers for Deployments.

#### 서비스
#### Services
외부로 노출되는 서비스들과 클러스터 내에 발견되는 서비스들을 허용하는 쿠버네티스 리소스들을 보여준다. 이러한 이유로 서비스와 인그레스는 클러스터간의 연결을 위한 내부 엔드포인트들과 외부 유저를 위한 외부 엔드포인트들에 의해 타게팅된 파드들을 보여준다.
Shows Kubernetes resources that allow for exposing services to external world and discovering them within a cluster. For that reason, Service and Ingress views show Pods targeted by them, internal endpoints for cluster connections and external endpoints for external users.

#### 스토리지
#### Storage
스토리지는 애플리케이션이 데이터를 저장하기 위해 사용하는 퍼시턴트 볼륨 클레임 리소스들을 보여준다.
Storage view shows Persistent Volume Claim resources which are used by applications for storing data.

#### 컨피그 맵과 시크릿
#### Config Maps and Secrets
클러스터에서 동작 중인 애플리케이션의 라이브 설정을 사용하는 모든 쿠버네티스 리소스들을 보여준다. 컨피그 오브젝트들을 수정하고 관리할 수 있도록 허용하며, 기본적으로는 숨겨져 있는 시크릿들을 보여준다.
Shows all Kubernetes resources that are used for live configuration of applications running in clusters. The view allows for editing and managing config objects and displays secrets hidden by default.

#### 로그 뷰어
#### Logs viewer
파드 목록과 세부사항 페이지들은 대시보드에 구현된 로그 뷰어에 링크된다. 뷰어는 단일 파드에 있는 컨테이너들의 로그들을 내려가면 볼 수 있도록 한다.
Pod lists and detail pages link to a logs viewer that is built into Dashboard. The viewer allows for drilling down logs from containers belonging to a single Pod.

![Logs viewer](/images/docs/ui-dashboard-logs-view.png)

{{% /capture %}}

{{% capture whatsnext %}}

더 많은 정보는 [쿠버네티스 대시보드 프로젝트 페이지](https://github.com/kubernetes/dashboard)를 참고하세요.
For more information, see the
[Kubernetes Dashboard project page](https://github.com/kubernetes/dashboard).

{{% /capture %}}
