---
title: 파드(Pod) 개요
content_template: templates/concept
weight: 10
---

{{% capture overview %}}
이 페이지는 쿠버네티스 객체 모델 중 가장 작으면서, 배포 가능한 객체인 `파드` 에 대한 개요를 제공한다.
{{% /capture %}}


{{% capture body %}}
## 파드에 대해 이해하기

*파드*는 쿠버네티스의 기본적인 블럭이다--쿠버네티스 객체모델 중 당신이 만들고 배포할 수 있는 가장 작고 심플한 단위이다. 파드는 당신의 클러스터에서의 Running 프로세스를 나타낸다. 

A Pod encapsulates an application container (or, in some cases, multiple containers), storage resources, a unique network IP, and options that govern how the container(s) should run. A Pod represents a unit of deployment: *a single instance of an application in Kubernetes*, which might consist of either a single container or a small number of containers that are tightly coupled and that share resources.



> [Docker](https://www.docker.com)는 쿠버네티스 파드에서 가장 대표적인 컨테이너 런타임이지만, 파드는 다른 컨테이너 런타임 역시 지원한다.


쿠버네티스 클러스터 안의 파드들은 주로 두가지 방법으로 사용된다:

* **한 개의 컨테이너만 동작하는 파드**. "한 개의 컨테이너 당 한 개의 파드" 모델은 쿠버네티스 사용 사례중 가장 흔하다; 이 경우, 한 개의 파드가 한 개의 컨테이너를 감싸고 있다고 생각할 수 있으며, 쿠버네티스가 컨테이너를 직접 관리하는 대신 파드를 관리한다고도 볼 수 있다.
 
* **Pods that run multiple containers that need to work together**. A Pod might encapsulate an application composed of multiple co-located containers that are tightly coupled and need to share resources. These co-located containers might form a single cohesive unit of service--one container serving files from a shared volume to the public, while a separate "sidecar" container refreshes or updates those files. The Pod wraps these containers and storage resources together as a single manageable entity.

The [쿠버네티스 블로그](http://blog.kubernetes.io)에는 파드 사용 사례의 몇가지 추가적인 정보가 있다. 더 많은 정보를 위해서 아래 내용을 참조한다:

* [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
* [Container Design Patterns](https://kubernetes.io/blog/2016/06/container-design-patterns)

Each Pod is meant to run a single instance of a given application. If you want to scale your application horizontally (e.g., run multiple instances), you should use multiple Pods, one for each instance. In Kubernetes, this is generally referred to as _replication_. Replicated Pods are usually created and managed as a group by an abstraction called a Controller. See [Pods and Controllers](#pods-and-controllers) for more information.

## 어떻게 파드들이 다중 컨테이너들을 관리하는가

Pods are designed to support multiple cooperating processes (as containers) that form a cohesive unit of service. The containers in a Pod are automatically co-located and co-scheduled on the same physical or virtual machine in the cluster. The containers can share resources and dependencies, communicate with one another, and coordinate when and how they are terminated.

Note that grouping multiple co-located and co-managed containers in a single Pod is a relatively advanced use case. You should use this pattern only in specific instances in which your containers are tightly coupled. For example, you might have a container that acts as a web server for files in a shared volume, and a separate "sidecar" container that updates those files from a remote source, as in the following diagram:

{{< figure src="/images/docs/pod.svg" title="pod diagram" width="50%" >}}

파드는 같은 파드 안에 속한 컨테이너들에게 두가지 공유 리소스를 제공한다: *네트워킹* 과 *저장소*.

#### 네트워킹

Each Pod is assigned a unique IP address. Every container in a Pod shares the network namespace, including the IP address and network ports. Containers *inside a Pod* can communicate with one another using `localhost`. When containers in a Pod communicate with entities *outside the Pod*, they must coordinate how they use the shared network resources (such as ports).

#### 저장소

A Pod can specify a set of shared storage *volumes*. All containers in the Pod can access the shared volumes, allowing those containers to share data. Volumes also allow persistent data in a Pod to survive in case one of the containers within needs to be restarted. See [Volumes](/docs/concepts/storage/volumes/) for more information on how Kubernetes implements shared storage in a Pod.

## Working with Pods

You'll rarely create individual Pods directly in Kubernetes--even singleton Pods. This is because Pods are designed as relatively ephemeral, disposable entities. When a Pod gets created (directly by you, or indirectly by a Controller), it is scheduled to run on a Node in your cluster. The Pod remains on that Node until the process is terminated, the pod object is deleted, the pod is *evicted* for lack of resources, or the Node fails.

{{< note >}}
Restarting a container in a Pod should not be confused with restarting the Pod. The Pod itself does not run, but is an environment the containers run in and persists until it is deleted.
{{< /note >}}

Pods do not, by themselves, self-heal. If a Pod is scheduled to a Node that fails, or if the scheduling operation itself fails, the Pod is deleted; likewise, a Pod won't survive an eviction due to a lack of resources or Node maintenance. Kubernetes uses a higher-level abstraction, called a *Controller*, that handles the work of managing the relatively disposable Pod instances. Thus, while it is possible to use Pod directly, it's far more common in Kubernetes to manage your pods using a Controller. See [Pods and Controllers](#pods-and-controllers) for more information on how Kubernetes uses Controllers to implement Pod scaling and healing.

### 파드와 컨트롤러

컨트롤러는 당신을 위해 다중 파드를 생성하고 관리해 주는데, 클러스터 범위 내에서의 레플리케이션 핸들링, 롤아웃 그리고 자가치료 기능 제공을 한다. 예를들어, 만약 노드가 고장났을 때, 컨트롤러는 아마 자동으로 다른 노드에 고장난 노드에 스케줄링되고 있는 것과 같은 파드로 교체할 것이다.  

한가지 또는 그 이상의 파드를 보유한 컨트롤러의 몇가지 예시:

* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)

일반적으로, 컨트롤러는 당신이 책임을 지고 제공한 파드 템플릿을 사용한다.

## 파드 

Pod templates are pod specifications which are included in other objects, such as
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), and
[DaemonSets](/docs/concepts/workloads/controllers/daemonset/).  Controllers use Pod Templates to make actual pods.
The sample below is a simple manifest for a Pod which contains a container that prints
a message.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```

Rather than specifying the current desired state of all replicas, pod templates are like cookie cutters. Once a cookie has been cut, the cookie has no relationship to the cutter. There is no "quantum entanglement". Subsequent changes to the template or even switching to a new template has no direct effect on the pods already created. Similarly, pods created by a replication controller may subsequently be updated directly. This is in deliberate contrast to pods, which do specify the current desired state of all containers belonging to the pod. This approach radically simplifies system semantics and increases the flexibility of the primitive.

{{% /capture %}}

{{% capture whatsnext %}}
* 파드의 다른 동작들을 더 배워보자:
  * [파드 종료](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * 다른 파드 주제
{{% /capture %}}
