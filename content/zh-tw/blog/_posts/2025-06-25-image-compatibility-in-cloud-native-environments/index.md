---
layout: blog
title: "雲原生環境中的映像檔兼容性"
date: 2025-06-25
draft: false
slug: image-compatibility-in-cloud-native-environments
author: >
  Chaoyi Huang（華爲）,
  Marcin Franczyk（華爲）,
  Vanessa Sochat（勞倫斯利物浦國家實驗室）
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
在電信、高性能或 AI 計算等必須高度可靠且滿足嚴格性能標準的行業中，容器化應用通常需要特定的操作系統設定或硬件支持。
通常的做法是要求使用特定版本的內核、其設定、設備驅動程式或系統組件。
儘管存在[開放容器倡議 (OCI)](https://opencontainers.org/) 這樣一個定義容器映像檔標準和規範的治理社區，
但在表達這種兼容性需求方面仍存在空白。爲了解決這一問題，業界提出了多個提案，並最終在 Kubernetes
的[節點特性發現 (NFD)](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html) 項目中實現了相關功能。

<!--
[NFD](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html) is an open source Kubernetes project that automatically detects and reports [hardware and system features](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features) of cluster nodes. This information helps users to schedule workloads on nodes that meet specific system requirements, which is especially useful for applications with strict hardware or operating system dependencies.
-->
[NFD](https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/index.html)
是一個開源的 Kubernetes 項目，能夠自動檢測並報告叢集節點的[硬件和系統特性](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features)。
這些資訊幫助使用者將工作負載調度到滿足特定系統需求的節點上，尤其適用於具有嚴格硬件或操作系統依賴的應用。

<!--
## The need for image compatibility specification

### Dependencies between containers and host OS

A container image is built on a base image, which provides a minimal runtime environment, often a stripped-down Linux userland, completely empty or distroless. When an application requires certain features from the host OS, compatibility issues arise. These dependencies can manifest in several ways:
-->
## 映像檔兼容性規範的需求 {#the-need-for-image-compatibility-specification}

### 容器與主機操作系統之間的依賴關係

容器映像檔是基於基礎映像檔構建的，基礎映像檔提供了最小的運行時環境，通常是一個精簡的 Linux 使用者態環境，
有時甚至是完全空白或無發行版的。
當應用需要來自主機操作系統的某些特性時，就會出現兼容性問題。這些依賴可能表現爲以下幾種形式：

<!--
- **Drivers**:
  Host driver versions must match the supported range of a library version inside the container to avoid compatibility problems. Examples include GPUs and network drivers.
- **Libraries or Software**:
  The container must come with a specific version or range of versions for a library or software to run optimally in the environment. Examples from high performance computing are MPI, EFA, or Infiniband.
- **Kernel Modules or Features**:
  Specific kernel features or modules must be present. Examples include having support of write protected huge page faults, or the presence of VFIO
- And more…
-->
* **驅動程式**：
  主機上的驅動程式版本必須與容器內的庫所支持的版本範圍相匹配，以避免兼容性問題，例如 GPU 和網路驅動。

* **庫或軟體**：
  容器必須包含某個庫或軟體的特定版本或版本範圍，才能在目標環境中以最優方式運行。
  高性能計算方面的示例包括 MPI、EFA 或 Infiniband。

* **內核模塊或特性**：
  必須存在特定的內核特性或模塊，例如對寫入保護巨頁錯誤的支持，或存在對 VFIO 的支持。

* 以及其他更多形式...

<!--
While containers in Kubernetes are the most likely unit of abstraction for these needs, the definition of compatibility can extend further to include other container technologies such as Singularity and other OCI artifacts such as binaries from a spack binary cache.
-->
雖然在 Kubernetes 中容器是這些需求最常見的抽象單位，但兼容性的定義可以進一步擴展，包括
Singularity 等其他容器技術以及來自 spack 二進制緩存的二進制檔案等 OCI 工件。

<!--
### Multi-cloud and hybrid cloud challenges

Containerized applications are deployed across various Kubernetes distributions and cloud providers, where different host operating systems introduce compatibility challenges.
Often those have to be pre-configured before workload deployment or are immutable.
For instance, different cloud providers will include different operating systems like:
-->
### 多雲與混合雲的挑戰

容器化應用被部署在各種 Kubernetes 發行版和雲平臺上，而不同的主機操作系統帶來了兼容性挑戰。
這些操作系統通常需要在部署工作負載之前預設定，或者它們是不可變的。
例如，不同雲平臺會使用不同的操作系統，包括：

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
每種操作系統都具有獨特的內核版本、設定和驅動程式，對於需要特定特性的應用來說，兼容性問題並不簡單。
因此必須能夠快速評估某個容器映像檔是否適合在某個特定環境中運行。

<!--
### Image compatibility initiative

An effort was made within the [Open Containers Initiative Image Compatibility](https://github.com/opencontainers/wg-image-compatibility) working group to introduce a standard for image compatibility metadata.
A specification for compatibility would allow container authors to declare required host OS features, making compatibility requirements discoverable and programmable.
The specification implemented in Kubernetes Node Feature Discovery is one of the discussed proposals.
It aims to:
-->
### 映像檔兼容性倡議

[OCI 映像檔兼容性工作組](https://github.com/opencontainers/wg-image-compatibility)正在推動引入一個映像檔兼容性元資料的標準。
此規範允許容器作者聲明所需的主機操作系統特性，使兼容性需求可以被發現和編程化處理。
目前已在 Kubernetes 的 Node Feature Discovery 中實現了其中一個被討論的提案，其目標包括：

<!--
- **Define a structured way to express compatibility in OCI image manifests.**
- **Support a compatibility specification alongside container images in image registries.**
- **Allow automated validation of compatibility before scheduling containers.**

The concept has since been implemented in the Kubernetes Node Feature Discovery project.
-->
* **在 OCI 映像檔清單中定義一種結構化的兼容性表達方式。**
* **支持在映像檔倉庫中將兼容性規範與容器映像檔一同儲存。**
* **在容器調度之前實現兼容性自動驗證。**

這個理念目前已在 Kubernetes 的 Node Feature Discovery 項目中落地。

<!--
### Implementation in Node Feature Discovery

The solution integrates compatibility metadata into Kubernetes via NFD features and the [NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup) API.
This interface enables the user to match containers to nodes based on exposing features of hardware and software, allowing for intelligent scheduling and workload optimization.
-->
### 在 Node Feature Discovery 中的實現

這種解決方案通過 NFD 的特性機制和
[NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)
API 將兼容性元資料集成到 Kubernetes 中。
此介面使使用者可以根據硬件和軟體暴露的特性將容器與節點進行匹配，從而實現智能調度與工作負載優化。

<!--
### Compatibility specification

The compatibility specification is a structured list of compatibility objects containing *[Node Feature Groups](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)*.
These objects define image requirements and facilitate validation against host nodes.
The feature requirements are described by using [the list of available features](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features) from the NFD project.
The schema has the following structure:
-->
### 兼容性規範

兼容性規範是一個結構化的兼容性對象列表，包含
**[Node Feature Groups](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)**。
這些對象定義了映像檔要求，並支持與主機節點進行驗證。特性需求通過
[NFD 項目提供的特性列表](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/customization-guide.html#available-features)進行描述。此模式的結構如下：

<!--
- **version** (string) - Specifies the API version.
- **compatibilities** (array of objects) - List of compatibility sets.
  - **rules** (object) - Specifies [NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup) to define image requirements.
  - **weight** (int, optional) - Node affinity weight.
  - **tag** (string, optional) - Categorization tag.
  - **description** (string, optional) - Short description.
-->
* **version**（字符串）— 指定 API 版本。
* **compatibilities**（對象數組）— 兼容性集合列表。

  * **rules**（對象）— 指定
    [NodeFeatureGroup](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/usage/custom-resources.html#nodefeaturegroup)
    來定義映像檔要求。
  * **weight**（整數，可選）— 節點親和性權重。
  * **tag**（字符串，可選）— 分類標記。
  * **description**（字符串，可選）— 簡短描述。

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
### 節點驗證的客戶端實現

爲了簡化兼容性驗證，
我們實現了一個[客戶端工具](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/reference/node-feature-client-reference.html)，
可以根據映像檔的兼容性工件進行節點驗證。在這個流程中，映像檔作者會生成一個兼容性工件，
並通過引用者（Referrs） API 將其指向映像檔所在的倉庫。當需要評估某個映像檔是否適用於某個主機節點時，
此工具可以發現工件並在部署前驗證映像檔對節點的兼容性。
客戶端可以驗證 Kubernetes 叢集內外的節點，擴大了其應用範圍。
未來，映像檔兼容性還可能在基於映像檔要求創建特定工作負載設定檔案中發揮關鍵作用，有助於提升調度效率。
此外，還可能實現一定程度上的節點自動設定，進一步優化資源分配並確保特種工作負載的順利部署。

<!--
### Examples of usage

1. **Define image compatibility metadata**

   A [container image](/docs/concepts/containers/images) can have metadata that describes
   its requirements based on features discovered from nodes, like kernel modules or CPU models.
   The previous compatibility specification example in this article exemplified this use case.
-->
### 使用示例

1. **定義映像檔兼容性元資料**

   一個[容器映像檔](/zh-cn/docs/concepts/containers/images)可以包含元資料，
   基於節點所發現的特性（如內核模塊或 CPU 型號）描述其需求。
   上文所述的兼容性規範示例即體現了這種用法。

<!--
2. **Attach the artifact to the image**

   The image compatibility specification is stored as an OCI artifact.
   You can attach this metadata to your container image using the [oras](https://oras.land/) tool.
   The registry only needs to support OCI artifacts, support for arbitrary types is not required.
   Keep in mind that the container image and the artifact must be stored in the same registry.
   Use the following command to attach the artifact to the image:
-->
2. **將工件掛接到映像檔上**

   映像檔兼容性規範以 OCI 工件的形式儲存。
   你可以使用 [oras](https://oras.land/) 工具將元資料掛接到你的容器映像檔上。
   映像檔倉庫只需支持 OCI 工件，不必支持任意類型。
   請注意，容器映像檔和工件必須儲存在同一個映像檔倉庫中。
   使用以下命令將工件掛接到映像檔上：

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
3. **驗證映像檔兼容性**

   在掛接兼容性規範之後，你可以驗證某個節點是否滿足映像檔的運行要求。這種驗證可以通過
   [nfd 客戶端](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/reference/node-feature-client-reference.html)來完成：

   ```bash
   nfd compat validate-node --image <鏡像地址>
   ```

<!--
4. **Read the output from the client**

   Finally you can read the report generated by the tool or use your own tools to act based on the generated JSON report.

   ![validate-node command output](validate-node-output.png)
-->
4. **讀取客戶端的輸出**

   你可以閱讀工具生成的報告，也可以使用你自己的工具解析生成的 JSON 報告並做出決策。

   ![validate-node 命令輸出](validate-node-output.png)

<!--
## Conclusion

The addition of image compatibility to Kubernetes through Node Feature Discovery underscores the growing importance of addressing compatibility in cloud native environments.
It is only a start, as further work is needed to integrate compatibility into scheduling of workloads within and outside of Kubernetes.
However, by integrating this feature into Kubernetes, mission-critical workloads can now define and validate host OS requirements more efficiently.
Moving forward, the adoption of compatibility metadata within Kubernetes ecosystems will significantly enhance the reliability and performance of specialized containerized applications, ensuring they meet the stringent requirements of industries like telecommunications, high-performance computing or any environment that requires special hardware or host OS configuration.
-->
## 總結 {#conclusion}

通過 Node Feature Discovery 將映像檔兼容性引入 Kubernetes，突顯了在雲原生環境中解決兼容性問題的重要性。
這只是一個起點，未來仍需進一步將兼容性深度集成到 Kubernetes 內外的工作負載調度中。
然而，藉助這一功能，關鍵任務型工作負載現在可以更高效地定義和驗證其對主機操作系統的要求。
展望未來，兼容性元資料在 Kubernetes 生態系統中的廣泛採用將顯著提升專用容器化應用的可靠性與性能，
確保其能夠滿足電信、高性能計算等行業對硬件或主機系統設定的嚴格要求。

<!--
## Get involved

Join the [Kubernetes Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/contributing/) project if you're interested in getting involved with the design and development of Image Compatibility API and tools.
We always welcome new contributors.
-->
## 加入我們 {#get-involved}

如果你有興趣參與映像檔兼容性 API 和工具的設計與開發，歡迎加入
[Kubernetes Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/v0.17/contributing/)
項目。我們始終歡迎新的貢獻者加入。
