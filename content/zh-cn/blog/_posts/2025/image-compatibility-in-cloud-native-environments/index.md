---
layout: blog
title: "云原生环境中的镜像兼容性"
date: 2025-06-25
draft: false
slug: image-compatibility-in-cloud-native-environments
author: >
  Chaoyi Huang（华为）,
  Marcin Franczyk（华为）,
  Vanessa Sochat（劳伦斯利物浦国家实验室）
translator: >
  Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Image Compatibility In Cloud Native Environments"
date: 2025-06-25
draft: false
slug: image-compatibility-in-cloud-native-environments
author: >
  Chaoyi Huang (Huawei),
  Marcin Franczyk (Huawei),
  Vanessa Sochat (Lawrence Livermore National Laboratory)
-->

<!--
In industries where systems must run very reliably and meet strict performance criteria such as telecommunication, high-performance or AI computing, containerized applications often need specific operating system configuration or hardware presence.
It is common practice to require the use of specific versions of the kernel, its configuration, device drivers, or system components.
Despite the existence of the [Open Container Initiative (OCI)](https://opencontainers.org/), a governing community to define standards and specifications for container images, there has been a gap in expression of such compatibility requirements.
The need to address this issue has led to different proposals and, ultimately, an implementation in Kubernetes' [Node Feature Discovery (NFD)](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html).
-->
在电信、高性能或 AI 计算等必须高度可靠且满足严格性能标准的行业中，容器化应用通常需要特定的操作系统配置或硬件支持。
通常的做法是要求使用特定版本的内核、其配置、设备驱动程序或系统组件。
尽管存在[开放容器倡议 (OCI)](https://opencontainers.org/) 这样一个定义容器镜像标准和规范的治理社区，
但在表达这种兼容性需求方面仍存在空白。为了解决这一问题，业界提出了多个提案，并最终在 Kubernetes
的[节点特性发现 (NFD)](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html) 项目中实现了相关功能。

<!--
[NFD](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html) is an open source Kubernetes project that automatically detects and reports [hardware and system features](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features) of cluster nodes. This information helps users to schedule workloads on nodes that meet specific system requirements, which is especially useful for applications with strict hardware or operating system dependencies.
-->
[NFD](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html)
是一个开源的 Kubernetes 项目，能够自动检测并报告集群节点的[硬件和系统特性](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features)。
这些信息帮助用户将工作负载调度到满足特定系统需求的节点上，尤其适用于具有严格硬件或操作系统依赖的应用。

<!--
## The need for image compatibility specification

### Dependencies between containers and host OS

A container image is built on a base image, which provides a minimal runtime environment, often a stripped-down Linux userland, completely empty or distroless. When an application requires certain features from the host OS, compatibility issues arise. These dependencies can manifest in several ways:
-->
## 镜像兼容性规范的需求 {#the-need-for-image-compatibility-specification}

### 容器与主机操作系统之间的依赖关系

容器镜像是基于基础镜像构建的，基础镜像提供了最小的运行时环境，通常是一个精简的 Linux 用户态环境，
有时甚至是完全空白或无发行版的。
当应用需要来自主机操作系统的某些特性时，就会出现兼容性问题。这些依赖可能表现为以下几种形式：

<!--
- **Drivers**:
  Host driver versions must match the supported range of a library version inside the container to avoid compatibility problems. Examples include GPUs and network drivers.
- **Libraries or Software**:
  The container must come with a specific version or range of versions for a library or software to run optimally in the environment. Examples from high performance computing are MPI, EFA, or Infiniband.
- **Kernel Modules or Features**:
  Specific kernel features or modules must be present. Examples include having support of write protected huge page faults, or the presence of VFIO
- And more…
-->
* **驱动程序**：
  主机上的驱动程序版本必须与容器内的库所支持的版本范围相匹配，以避免兼容性问题，例如 GPU 和网络驱动。

* **库或软件**：
  容器必须包含某个库或软件的特定版本或版本范围，才能在目标环境中以最优方式运行。
  高性能计算方面的示例包括 MPI、EFA 或 Infiniband。

* **内核模块或特性**：
  必须存在特定的内核特性或模块，例如对写入保护巨页错误的支持，或存在对 VFIO 的支持。

* 以及其他更多形式...

<!--
While containers in Kubernetes are the most likely unit of abstraction for these needs, the definition of compatibility can extend further to include other container technologies such as Singularity and other OCI artifacts such as binaries from a spack binary cache.
-->
虽然在 Kubernetes 中容器是这些需求最常见的抽象单位，但兼容性的定义可以进一步扩展，包括
Singularity 等其他容器技术以及来自 spack 二进制缓存的二进制文件等 OCI 工件。

<!--
### Multi-cloud and hybrid cloud challenges

Containerized applications are deployed across various Kubernetes distributions and cloud providers, where different host operating systems introduce compatibility challenges.
Often those have to be pre-configured before workload deployment or are immutable.
For instance, different cloud providers will include different operating systems like:
-->
### 多云与混合云的挑战

容器化应用被部署在各种 Kubernetes 发行版和云平台上，而不同的主机操作系统带来了兼容性挑战。
这些操作系统通常需要在部署工作负载之前预配置，或者它们是不可变的。
例如，不同云平台会使用不同的操作系统，包括：

<!--
- **RHCOS/RHEL**
- **Photon OS**
- **Amazon Linux 2**
- **Container-Optimized OS**
- **Azure Linux OS**
- And more...
-->
* **RHCOS/RHEL**
* **Photon OS**
* **Amazon Linux 2**
* **Container-Optimized OS**
* **Azure Linux OS**
* 等等...

<!--
Each OS comes with unique kernel versions, configurations, and drivers, making compatibility a non-trivial issue for applications requiring specific features.
It must be possible to quickly assess a container for its suitability to run on any specific environment.
-->
每种操作系统都具有独特的内核版本、配置和驱动程序，对于需要特定特性的应用来说，兼容性问题并不简单。
因此必须能够快速评估某个容器镜像是否适合在某个特定环境中运行。

<!--
### Image compatibility initiative

An effort was made within the [Open Containers Initiative Image Compatibility](https://github.com/opencontainers/wg-image-compatibility) working group to introduce a standard for image compatibility metadata.
A specification for compatibility would allow container authors to declare required host OS features, making compatibility requirements discoverable and programmable.
The specification implemented in Kubernetes Node Feature Discovery is one of the discussed proposals.
It aims to:
-->
### 镜像兼容性倡议

[OCI 镜像兼容性工作组](https://github.com/opencontainers/wg-image-compatibility)正在推动引入一个镜像兼容性元数据的标准。
此规范允许容器作者声明所需的主机操作系统特性，使兼容性需求可以被发现和编程化处理。
目前已在 Kubernetes 的 Node Feature Discovery 中实现了其中一个被讨论的提案，其目标包括：

<!--
- **Define a structured way to express compatibility in OCI image manifests.**
- **Support a compatibility specification alongside container images in image registries.**
- **Allow automated validation of compatibility before scheduling containers.**

The concept has since been implemented in the Kubernetes Node Feature Discovery project.
-->
* **在 OCI 镜像清单中定义一种结构化的兼容性表达方式。**
* **支持在镜像仓库中将兼容性规范与容器镜像一同存储。**
* **在容器调度之前实现兼容性自动验证。**

这个理念目前已在 Kubernetes 的 Node Feature Discovery 项目中落地。

<!--
### Implementation in Node Feature Discovery

The solution integrates compatibility metadata into Kubernetes via NFD features and the [NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup) API.
This interface enables the user to match containers to nodes based on exposing features of hardware and software, allowing for intelligent scheduling and workload optimization.
-->
### 在 Node Feature Discovery 中的实现

这种解决方案通过 NFD 的特性机制和
[NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)
API 将兼容性元数据集成到 Kubernetes 中。
此接口使用户可以根据硬件和软件暴露的特性将容器与节点进行匹配，从而实现智能调度与工作负载优化。

<!--
### Compatibility specification

The compatibility specification is a structured list of compatibility objects containing *[Node Feature Groups](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)*.
These objects define image requirements and facilitate validation against host nodes.
The feature requirements are described by using [the list of available features](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features) from the NFD project.
The schema has the following structure:
-->
### 兼容性规范

兼容性规范是一个结构化的兼容性对象列表，包含
**[Node Feature Groups](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)**。
这些对象定义了镜像要求，并支持与主机节点进行验证。特性需求通过
[NFD 项目提供的特性列表](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features)进行描述。此模式的结构如下：

<!--
- **version** (string) - Specifies the API version.
- **compatibilities** (array of objects) - List of compatibility sets.
  - **rules** (object) - Specifies [NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup) to define image requirements.
  - **weight** (int, optional) - Node affinity weight.
  - **tag** (string, optional) - Categorization tag.
  - **description** (string, optional) - Short description.
-->
* **version**（字符串）— 指定 API 版本。
* **compatibilities**（对象数组）— 兼容性集合列表。

  * **rules**（对象）— 指定
    [NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)
    来定义镜像要求。
  * **weight**（整数，可选）— 节点亲和性权重。
  * **tag**（字符串，可选）— 分类标记。
  * **description**（字符串，可选）— 简短描述。

<!--
An example might look like the following:
-->
示例如下：

```yaml
version: v1alpha1
compatibilities:
- description: "My image requirements"
  rules:
  - name: "kernel and cpu"
    matchFeatures:
    - feature: kernel.loadedmodule
      matchExpressions:
        vfio-pci: {op: Exists}
    - feature: cpu.model
      matchExpressions:
        vendor_id: {op: In, value: ["Intel", "AMD"]}
  - name: "one of available nics"
    matchAny:
    - matchFeatures:
      - feature: pci.device
        matchExpressions:
          vendor: {op: In, value: ["0eee"]}
          class: {op: In, value: ["0200"]}
    - matchFeatures:
      - feature: pci.device
        matchExpressions:
          vendor: {op: In, value: ["0fff"]}
          class: {op: In, value: ["0200"]}
```

<!--
### Client implementation for node validation

To streamline compatibility validation, we implemented a [client tool](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/reference/node-feature-client-reference.html) that allows for node validation based on an image's compatibility artifact.
In this workflow, the image author would generate a compatibility artifact that points to the image it describes in a registry via the referrers API.
When a need arises to assess the fit of an image to a host, the tool can discover the artifact and verify compatibility of an image to a node before deployment.
The client can validate nodes both inside and outside a Kubernetes cluster, extending the utility of the tool beyond the single Kubernetes use case.
In the future, image compatibility could play a crucial role in creating specific workload profiles based on image compatibility requirements, aiding in more efficient scheduling.
Additionally, it could potentially enable automatic node configuration to some extent, further optimizing resource allocation and ensuring seamless deployment of specialized workloads.
-->
### 节点验证的客户端实现

为了简化兼容性验证，
我们实现了一个[客户端工具](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/reference/node-feature-client-reference.html)，
可以根据镜像的兼容性工件进行节点验证。在这个流程中，镜像作者会生成一个兼容性工件，
并通过引用者（Referrs） API 将其指向镜像所在的仓库。当需要评估某个镜像是否适用于某个主机节点时，
此工具可以发现工件并在部署前验证镜像对节点的兼容性。
客户端可以验证 Kubernetes 集群内外的节点，扩大了其应用范围。
未来，镜像兼容性还可能在基于镜像要求创建特定工作负载配置文件中发挥关键作用，有助于提升调度效率。
此外，还可能实现一定程度上的节点自动配置，进一步优化资源分配并确保特种工作负载的顺利部署。

<!--
### Examples of usage

1. **Define image compatibility metadata**

   A [container image](/docs/concepts/containers/images) can have metadata that describes
   its requirements based on features discovered from nodes, like kernel modules or CPU models.
   The previous compatibility specification example in this article exemplified this use case.
-->
### 使用示例

1. **定义镜像兼容性元数据**

   一个[容器镜像](/zh-cn/docs/concepts/containers/images)可以包含元数据，
   基于节点所发现的特性（如内核模块或 CPU 型号）描述其需求。
   上文所述的兼容性规范示例即体现了这种用法。

<!--
2. **Attach the artifact to the image**

   The image compatibility specification is stored as an OCI artifact.
   You can attach this metadata to your container image using the [oras](https://oras.land/) tool.
   The registry only needs to support OCI artifacts, support for arbitrary types is not required.
   Keep in mind that the container image and the artifact must be stored in the same registry.
   Use the following command to attach the artifact to the image:
-->
2. **将工件挂接到镜像上**

   镜像兼容性规范以 OCI 工件的形式存储。
   你可以使用 [oras](https://oras.land/) 工具将元数据挂接到你的容器镜像上。
   镜像仓库只需支持 OCI 工件，不必支持任意类型。
   请注意，容器镜像和工件必须存储在同一个镜像仓库中。
   使用以下命令将工件挂接到镜像上：

   ```bash
   oras attach \ 
   --artifact-type application/vnd.nfd.image-compatibility.v1alpha1 <image-url> \ 
   <path-to-spec>.yaml:application/vnd.nfd.image-compatibility.spec.v1alpha1+yaml
   ```

<!--
3. **Validate image compatibility**

   After attaching the compatibility specification, you can validate whether a node meets the
   image's requirements. This validation can be done using the
   [nfd client](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/reference/node-feature-client-reference.html):

   ```bash
   nfd compat validate-node --image <image-url>
   ```
-->
3. **验证镜像兼容性**

   在挂接兼容性规范之后，你可以验证某个节点是否满足镜像的运行要求。这种验证可以通过
   [nfd 客户端](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/reference/node-feature-client-reference.html)来完成：

   ```bash
   nfd compat validate-node --image <镜像地址>
   ```

<!--
4. **Read the output from the client**

   Finally you can read the report generated by the tool or use your own tools to act based on the generated JSON report.

   ![validate-node command output](validate-node-output.png)
-->
4. **读取客户端的输出**

   你可以阅读工具生成的报告，也可以使用你自己的工具解析生成的 JSON 报告并做出决策。

   ![validate-node 命令输出](validate-node-output.png)

<!--
## Conclusion

The addition of image compatibility to Kubernetes through Node Feature Discovery underscores the growing importance of addressing compatibility in cloud native environments.
It is only a start, as further work is needed to integrate compatibility into scheduling of workloads within and outside of Kubernetes.
However, by integrating this feature into Kubernetes, mission-critical workloads can now define and validate host OS requirements more efficiently.
Moving forward, the adoption of compatibility metadata within Kubernetes ecosystems will significantly enhance the reliability and performance of specialized containerized applications, ensuring they meet the stringent requirements of industries like telecommunications, high-performance computing or any environment that requires special hardware or host OS configuration.
-->
## 总结 {#conclusion}

通过 Node Feature Discovery 将镜像兼容性引入 Kubernetes，突显了在云原生环境中解决兼容性问题的重要性。
这只是一个起点，未来仍需进一步将兼容性深度集成到 Kubernetes 内外的工作负载调度中。
然而，借助这一功能，关键任务型工作负载现在可以更高效地定义和验证其对主机操作系统的要求。
展望未来，兼容性元数据在 Kubernetes 生态系统中的广泛采用将显著提升专用容器化应用的可靠性与性能，
确保其能够满足电信、高性能计算等行业对硬件或主机系统配置的严格要求。

<!--
## Get involved

Join the [Kubernetes Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/contributing/) project if you're interested in getting involved with the design and development of Image Compatibility API and tools.
We always welcome new contributors.
-->
## 加入我们 {#get-involved}

如果你有兴趣参与镜像兼容性 API 和工具的设计与开发，欢迎加入
[Kubernetes Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/contributing/)
项目。我们始终欢迎新的贡献者加入。
