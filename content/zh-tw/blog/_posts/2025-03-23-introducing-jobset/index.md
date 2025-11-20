---
layout: blog
title: "JobSet 介紹"
date: 2025-03-23
slug: introducing-jobset
author: >
  Daniel Vega-Myhre (Google),
  Abdullah Gharaibeh (Google),
  Kevin Hannon (Red Hat)
translator: >
  Xin Li (DaoCloud)
---
<!--
layout: blog
title: "Introducing JobSet"
date: 2025-03-23
slug: introducing-jobset

**Authors**: Daniel Vega-Myhre (Google), Abdullah Gharaibeh (Google), Kevin Hannon (Red Hat)
-->

<!--
In this article, we introduce [JobSet](https://jobset.sigs.k8s.io/), an open source API for
representing distributed jobs. The goal of JobSet is to provide a unified API for distributed ML
training and HPC workloads on Kubernetes.
-->
在本文中，我們介紹 [JobSet](https://jobset.sigs.k8s.io/)，這是一個用於表示分佈式任務的開源 API。
JobSet 的目標是爲 Kubernetes 上的分佈式機器學習訓練和高性能計算（HPC）工作負載提供統一的 API。

<!--
## Why JobSet?

The Kubernetes community’s recent enhancements to the batch ecosystem on Kubernetes has attracted ML
engineers who have found it to be a natural fit for the requirements of running distributed training
workloads. 

Large ML models (particularly LLMs) which cannot fit into the memory of the GPU or TPU chips on a
single host are often distributed across tens of thousands of accelerator chips, which in turn may
span thousands of hosts.
-->
## 爲什麼需要 JobSet？   {#why-jobset}

Kubernetes 社區近期對 Kubernetes 批處理生態系統的增強，吸引了許多機器學習工程師，
他們發現這非常符合運行分佈式訓練工作負載的需求。

單個主機上的 GPU 或 TPU 芯片通常無法滿足大型機器學習模型（尤其是大語言模型，LLM）的內存需求，
因此往往會被分佈到成千上萬的加速器芯片上，而這些芯片可能跨越數千個主機。

<!--
As such, the model training code is often containerized and executed simultaneously on all these
hosts, performing distributed computations which often shard both the model parameters and/or the
training dataset across the target accelerator chips, using communication collective primitives like
all-gather and all-reduce to perform distributed computations and synchronize gradients between
hosts. 

These workload characteristics make Kubernetes a great fit for this type of workload, as efficiently
scheduling and managing the lifecycle of containerized applications across a cluster of compute
resources is an area where it shines. 
-->
因此，模型訓練代碼通常會被容器化，並在所有這些主機上同時執行，進行分佈式計算。
這些計算通常會將模型參數和/或訓練資料集拆分到目標加速器芯片上，並使用如
all-gather 和 all-reduce 等通信集合原語來進行分佈式計算以及在主機之間同步梯度。

這些工作負載的特性使得 Kubernetes 非常適合此類任務，
因爲高效地調度和管理跨計算資源叢集的容器化應用生命週期是 Kubernetes 的強項。

<!--
It is also very extensible, allowing developers to define their own Kubernetes APIs, objects, and
controllers which manage the behavior and life cycle of these objects, allowing engineers to develop
custom distributed training orchestration solutions to fit their needs.

However, as distributed ML training techniques continue to evolve, existing Kubernetes primitives do
not adequately model them alone anymore.
-->
Kubernetes 還具有很強的可擴展性，允許開發者定義自己的 Kubernetes API、
對象以及管理這些對象行爲和生命週期的控制器，
從而讓工程師能夠開發定製化的分佈式訓練編排解決方案以滿足特定需求。

然而，隨着分佈式機器學習訓練技術的不斷發展，現有的 Kubernetes
原語已經無法單獨充分描述這些新技術。

<!--
Furthermore, the landscape of Kubernetes distributed training orchestration APIs has become
fragmented, and each of the existing solutions in this fragmented landscape has certain limitations
that make it non-optimal for distributed ML training. 

For example, the KubeFlow training operator defines custom APIs for different frameworks (e.g.
PyTorchJob, TFJob, MPIJob, etc.); however, each of these job types are in fact a solution fit
specifically to the target framework, each with different semantics and behavior.
-->
此外，Kubernetes 分佈式訓練編排 API 的領域已經變得支離破碎，
而這個碎片化的領域中每個現有的解決方案都存在某些限制，
使得它們在分佈式機器學習訓練方面並非最優選擇。

例如，KubeFlow 訓練 Operator 爲不同的框架定義了自定義 API（例如 PyTorchJob、TFJob、MPIJob 等）。
然而，這些作業類型實際上分別是針對特定框架量身定製的解決方案，各自具有不同的語義和行爲。

<!--
On the other hand, the Job API fixed many gaps for running batch workloads, including Indexed
completion mode, higher scalability, Pod failure policies and Pod backoff policy to mention a few of
the most recent enhancements. However, running ML training and HPC workloads using the upstream Job
API requires extra orchestration to fill the following gaps:

Multi-template Pods : Most HPC or ML training jobs include more than one type of Pods. The different
Pods are part of the same workload, but they need to run a different container, request different
resources or have different failure policies. A common example is the driver-worker pattern.
-->
另一方面，Job API 彌補了運行批處理工作負載的許多空白，包括帶索引的完成模式（Indexed Completion Mode）、
更高的可擴展性、Pod 失效策略和 Pod 回退策略等，這些都是最近的一些重要增強功能。然而，使用上游
Job API 運行機器學習訓練和高性能計算（HPC）工作負載時，需要額外的編排來填補以下空白：

- 多模板 Pod：大多數 HPC 或機器學習訓練任務包含多種類型的 Pod。這些不同的 Pod 屬於同一工作負載，
  但它們需要運行不同的容器、請求不同的資源或具有不同的失效策略。
  一個常見的例子是驅動器-工作節點（driver-worker）模式。

<!--
Job groups : Large scale training workloads span multiple network topologies, running across
multiple racks for example. Such workloads are network latency sensitive, and aim to localize
communication and minimize traffic crossing the higher-latency network links. To facilitate this,
the workload needs to be split into groups of Pods each assigned to a network topology.

Inter-Pod communication : Create and manage the resources (e.g. [headless
Services](/docs/concepts/services-networking/service/#headless-services)) necessary to establish
communication between the Pods of a job.
-->
- 任務組：大規模訓練工作負載跨越多個網路拓撲，例如在多個機架之間運行。
  這類工作負載對網路延遲非常敏感，目標是將通信本地化並儘量減少跨越高延遲網路鏈路的流量。
  爲此，需要將工作負載拆分爲 Pod 組，每組分配到一個網路拓撲。

- Pod 間通信：創建和管理建立作業中 Pod 之間通信所需的資源
  （例如[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)）。

<!--
Startup sequencing : Some jobs require a specific start sequence of pods; sometimes the driver is
expected to start first (like Ray or Spark), in other cases the workers are expected to be ready
before starting the driver (like MPI).

JobSet aims to address those gaps using the Job API as a building block to build a richer API for
large-scale distributed HPC and ML use cases.
-->
- 啓動順序：某些任務需要特定的 Pod 啓動順序；有時需要驅動（driver）首先啓動（例如 Ray 或 Spark），
  而有時，人們期望多個工作節點（worker）在驅動啓動之前就緒（例如 MPI）。

JobSet 旨在以 Job API 爲基礎，填補這些空白，構建一個更豐富的 API，
以支持大規模分佈式 HPC 和 ML 使用場景。

<!--
## How JobSet Works
JobSet models a distributed batch workload as a group of Kubernetes Jobs. This allows a user to
easily specify different pod templates for different distinct groups of pods (e.g. a leader,
workers, parameter servers, etc.). 

It uses the abstraction of a ReplicatedJob to manage child Jobs, where a ReplicatedJob is
essentially a Job Template with some desired number of Job replicas specified. This provides a
declarative way to easily create identical child-jobs to run on different islands of accelerators,
without resorting to scripting or Helm charts to generate many versions of the same job but with
different names.
-->
## JobSet 的工作原理   {#how-jobset-works}

JobSet 將分佈式批處理工作負載建模爲一組 Kubernetes Job。
這使得使用者可以輕鬆爲不同的 Pod 組（例如領導者 Pod、工作節點 Pod、參數伺服器 Pod 等）
指定不同的 Pod 模板。

它通過抽象概念 ReplicatedJob 來管理子 Job，其中 ReplicatedJob 本質上是一個帶有指定副本數量的
Job 模板。這種方式提供了一種聲明式的手段，能夠輕鬆創建相同的子 Job，使其在不同的加速器叢集上運行，
而無需藉助腳本或 Helm Chart 來生成具有不同名稱的多個相同任務版本。

<!--
{{< figure src="jobset_diagram.svg" alt="JobSet Architecture" class="diagram-large" clicktozoom="true" >}}

Some other key JobSet features which address the problems described above include:

Replicated Jobs : In modern data centers, hardware accelerators like GPUs and TPUs allocated in
islands of homogenous accelerators connected via a specialized, high bandwidth network links. For
example, a user might provision nodes containing a group of hosts co-located on a rack, each with
H100 GPUs, where GPU chips within each host are connected via NVLink, with a NVLink Switch
connecting the multiple NVLinks. TPU Pods are another example of this: TPU ViperLitePods consist of
64 hosts, each with 4 TPU v5e chips attached, all connected via ICI mesh. When running a distributed
training job across multiple of these islands, we often want to partition the workload into a group
of smaller identical jobs, 1 per island, where each pod primarily communicates with the pods within
the same island to do segments of distributed computation, and keeping the gradient synchronization
over DCN (data center network, which is lower bandwidth than ICI) to a bare minimum. 
-->
{{< figure src="jobset_diagram.svg" alt="JobSet 架構" class="diagram-large" clicktozoom="true" >}}

解決上述問題的其他一些關鍵 JobSet 特性包括：

- **任務副本（Replicated Jobs）**：在現代資料中心中，硬件加速器（如 GPU 和 TPU）通常以同質加速器島的形式分配，
  並通過專用的高帶寬網路鏈路連接。例如，使用者可能會設定包含一組主機的節點，這些主機位於同一機架內，
  每個主機都配備了 H100 GPU，主機內的 GPU 芯片通過 NVLink 連接，並通過 NVLink 交換機連接多個 NVLink。
  TPU Pod 是另一個例子：TPU ViperLitePods 包含 64 個主機，每個主機連接了 4 個 TPU v5e 芯片，
  所有芯片通過 ICI 網格連接。在跨多個這樣的加速器島運行分佈式訓練任務時，我們通常希望將工作負載劃分爲一組較小的相同任務，
  每個島一個任務，其中每個 Pod 主要與同一島內的其他 Pod 通信以完成分佈式計算的部分段，
  並將梯度同步通過資料中心網路（DCN，其帶寬低於 ICI）降到最低。

<!--
Automatic headless service creation, configuration, and lifecycle management : Pod-to-pod
communication via pod hostname is enabled by default, with automatic configuration and lifecycle
management of the headless service enabling this. 

Configurable success policies : JobSet has configurable success policies which target specific
ReplicatedJobs, with operators to target “Any” or “All” of their child jobs. For example, you can
configure the JobSet to be marked complete if and only if all pods that are part of the “worker”
ReplicatedJob are completed.
-->
- **自動創建、設定無頭服務並管理其生命週期**：預設情況下，啓用通過 Pod 主機名來完成
  Pod 到 Pod 的通信，並通過無頭服務的自動設定和生命週期管理來支持這一功能。

- **可設定的成功策略**：JobSet 提供了可設定的成功策略，這些策略針對特定的 ReplicatedJob，
  並可通過操作符指定 "Any" 或 "All" 子任務。例如，你可以將 JobSet 設定爲僅在屬於 "worker"
  ReplicatedJob 的所有 Pod 完成時才標記爲完成。

<!--
Configurable failure policies : JobSet has configurable failure policies which allow the user to
specify a maximum number of times the JobSet should be restarted in the event of a failure. If any
job is marked failed, the entire JobSet will be recreated, allowing the workload to resume from the
last checkpoint. When no failure policy is specified, if any job fails, the JobSet simply fails. 
-->
- **可設定的失效策略**：JobSet 提供了可設定的失效策略，允許使用者指定在發生故障時
  JobSet 應重啓的最大次數。如果任何任務被標記爲失敗，整個 JobSet 將會被重新創建，
  從而使工作負載可以從最後一個檢查點恢復。當未指定失效策略時，如果任何任務失敗，
  JobSet 會直接標記爲失敗。

<!--
Exclusive placement per topology domain : JobSet allows users to express that child jobs have 1:1
exclusive assignment to a topology domain, typically an accelerator island like a rack. For example,
if the JobSet creates two child jobs, then this feature will enforce that the pods of each child job
will be co-located on the same island, and that only one child job is allowed to schedule per
island. This is useful for scenarios where we want to use a distributed data parallel (DDP) training
strategy to train a model using multiple islands of compute resources (GPU racks or TPU slices),
running 1 model replica in each accelerator island, ensuring the forward and backward passes
themselves occur within a single model replica occurs over the high bandwidth interconnect linking
the accelerators chips within the island, and only the gradient synchronization between model
replicas occurs across accelerator islands over the lower bandwidth data center network.
-->
- **按拓撲域的獨佔放置**：JobSet 允許使用者指定子任務與拓撲域（通常是加速器島，例如機架）
  之間的一對一獨佔分配關係。例如，如果 JobSet 創建了兩個子任務，
  此功能將確保每個子任務的 Pod 位於同一個加速器島內，並且每個島只允許調度一個子任務。
  這在我們希望使用分佈式資料並行（DDP）訓練策略的情況下非常有用，
  例如利用多個計算資源島（GPU 機架或 TPU 切片）訓練模型，在每個加速器島內運行一個模型副本，
  確保前向和反向傳播過程通過島內加速器芯片之間的高帶寬互聯完成，
  而模型副本之間的梯度同步則通過低帶寬的資料中心網路在加速器島之間進行。

<!--
Integration with Kueue : Users can submit JobSets via [Kueue](https://kueue.sigs.k8s.io/) to
oversubscribe their clusters, queue workloads to run as capacity becomes available, prevent partial
scheduling and deadlocks, enable multi-tenancy, and more.
-->
- **與 Kueue 集成**：使用者可以通過 [Kueue](https://kueue.sigs.k8s.io/)
  提交 JobSet，以實現叢集的超額訂閱、將工作負載排隊等待容量可用時運行、
  防止部分調度和死鎖、支持多租戶等更多功能。

<!--
## Example use case

### Distributed ML training on multiple TPU slices with Jax

The following example is a JobSet spec for running a TPU Multislice workload on 4 TPU v5e
[slices](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm#slices). To learn more about
TPU concepts and terminology, please refer to these
[docs](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm).
-->
## 示例用例   {#example-use-case}

### 使用 Jax 在多個 TPU 切片上進行分佈式 ML 訓練

以下示例展示了一個 JobSet 規範，用於在 4 個 TPU v5e
[切片](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm#slices)上運行
TPU 多切片工作負載。若想了解更多關於 TPU 的概念和術語，
請參考這些[文檔](https://cloud.google.com/tpu/docs/system-architecture-tpu-vm)。

<!--
This example uses [Jax](https://jax.readthedocs.io/en/latest/quickstart.html), an ML framework with
native support for Just-In-Time (JIT) compilation targeting TPU chips via
[OpenXLA](https://github.com/openxla). However, you can also use
[PyTorch/XLA](https://pytorch.org/xla/release/2.3/index.html) to do ML training on TPUs.

This example makes use of several JobSet features (both explicitly and implicitly) to support the
unique scheduling requirements of TPU multislice training out-of-the-box with very little
configuration required by the user.
-->
此示例使用了 [Jax](https://jax.readthedocs.io/en/latest/quickstart.html)，
這是一個通過 [OpenXLA](https://github.com/openxla) 提供對 TPU 芯片即時（JIT）
編譯原生支持的機器學習框架。不過，你也可以使用 [PyTorch/XLA](https://pytorch.org/xla/release/2.3/index.html)
在 TPUs 上進行機器學習訓練。

此示例利用了 JobSet 的多個功能（無論是顯式還是隱式），以開箱即用地支持 TPU
多切片訓練的獨特調度需求，而使用者需要的設定非常少。

<!--
```yaml
# Run a simple Jax workload on 
apiVersion: jobset.x-k8s.io/v1alpha2
kind: JobSet
metadata:
  name: multislice
  annotations:
    # Give each child Job exclusive usage of a TPU slice 
    alpha.jobset.sigs.k8s.io/exclusive-topology: cloud.google.com/gke-nodepool
spec:
  failurePolicy:
    maxRestarts: 3
  replicatedJobs:
  - name: workers
    replicas: 4 # Set to number of TPU slices
    template:
      spec:
        parallelism: 2 # Set to number of VMs per TPU slice
        completions: 2 # Set to number of VMs per TPU slice
        backoffLimit: 0
        template:
          spec:
            hostNetwork: true
            dnsPolicy: ClusterFirstWithHostNet
            nodeSelector:
              cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice
              cloud.google.com/gke-tpu-topology: 2x4
            containers:
            - name: jax-tpu
              image: python:3.8
              ports:
              - containerPort: 8471
              - containerPort: 8080
              securityContext:
                privileged: true
              command:
              - bash
              - -c
              - |
                pip install "jax[tpu]" -f https://storage.googleapis.com/jax-releases/libtpu_releases.html
                python -c 'import jax; print("Global device count:", jax.device_count())'
                sleep 60
              resources:
                limits:
                  google.com/tpu: 4
```
-->
```yaml
# 運行簡單的 Jax 工作負載
apiVersion: jobset.x-k8s.io/v1alpha2
kind: JobSet
metadata:
  name: multislice
  annotations:
    # 爲每個子任務提供 TPU 切片的獨佔使用權
    alpha.jobset.sigs.k8s.io/exclusive-topology: cloud.google.com/gke-nodepool
spec:
  failurePolicy:
    maxRestarts: 3
  replicatedJobs:
  - name: workers
    replicas: 4 # 設置爲 TPU 切片的數量
    template:
      spec:
        parallelism: 2 # 設置爲每個 TPU 切片的虛擬機數量
        completions: 2 # 設置爲每個 TPU 切片的虛擬機數量
        backoffLimit: 0
        template:
          spec:
            hostNetwork: true
            dnsPolicy: ClusterFirstWithHostNet
            nodeSelector:
              cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice
              cloud.google.com/gke-tpu-topology: 2x4
            containers:
            - name: jax-tpu
              image: python:3.8
              ports:
              - containerPort: 8471
              - containerPort: 8080
              securityContext:
                privileged: true
              command:
              - bash
              - -c
              - |
                pip install "jax[tpu]" -f https://storage.googleapis.com/jax-releases/libtpu_releases.html
                python -c 'import jax; print("Global device count:", jax.device_count())'
                sleep 60
              resources:
                limits:
                  google.com/tpu: 4
```

<!--
## Future work and getting involved
We have a number of features on the JobSet roadmap planned for development this year, which can be
found in the [JobSet roadmap](https://github.com/kubernetes-sigs/jobset?tab=readme-ov-file#roadmap).

Please feel free to reach out with feedback of any kind. We’re also open to additional contributors,
whether it is to fix or report bugs, or help add new features or write documentation. 
-->
## 未來工作與參與方式   {#furture-work-and-getting-involved}

我們今年的 JobSet 路線圖中計劃開發多項功能，具體內容可以在
[JobSet 路線圖](https://github.com/kubernetes-sigs/jobset?tab=readme-ov-file#roadmap)中找到。

歡迎你隨時提供任何形式的反饋。我們也歡迎更多貢獻者加入，無論是修復或報告問題、
幫助添加新功能，還是撰寫文檔，都非常歡迎。

<!--
You can get in touch with us via our [repo](http://sigs.k8s.io/jobset), [mailing
list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on
[Slack](https://kubernetes.slack.com/messages/wg-batch).

Last but not least, thanks to all [our
contributors](https://github.com/kubernetes-sigs/jobset/graphs/contributors) who made this project
possible!
-->
你可以通過我們的[代碼倉庫](http://sigs.k8s.io/jobset)、
[郵件列表](https://groups.google.com/a/kubernetes.io/g/wg-batch)或者在
[Slack](https://kubernetes.slack.com/messages/wg-batch) 上與我們聯繫。

最後但同樣重要的是，感謝所有[貢獻者](https://github.com/kubernetes-sigs/jobset/graphs/contributors)，
是你們讓這個項目成爲可能！
