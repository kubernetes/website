---
layout: blog
title: "基於 MIPS 架構的 Kubernetes 方案"
date: 2020-01-15
slug: Kubernetes-on-MIPS
---
<!--
layout: blog
title: "Kubernetes on MIPS"
date: 2020-01-15
slug: Kubernetes-on-MIPS
-->

<!-- 
**Authors:** TimYin Shi, Dominic Yin, Wang Zhan, Jessica Jiang, Will Cai, Jeffrey Gao, Simon Sun (Inspur)
-->
**作者:** 石光銀，尹東超，展望，江燕，蔡衛衛，高傳集，孫思清（浪潮）

<!-- 
## Background
-->
## 背景

<!-- 
[MIPS](https://en.wikipedia.org/wiki/MIPS_architecture) (Microprocessor without Interlocked Pipelined Stages) is a reduced instruction set computer (RISC) instruction set architecture (ISA), appeared in 1981 and developed by MIPS Technologies. Now MIPS architecture is widely used in many electronic products.
-->
[MIPS](https://zh.wikipedia.org/wiki/MIPS%E6%9E%B6%E6%A7%8B) (Microprocessor without Interlocked Pipelined Stages) 是一種採取精簡指令集（RISC）的處理器架構 (ISA)，出現於 1981 年，由 MIPS 科技公司開發。如今 MIPS 架構被廣泛應用於許多電子產品上。

<!-- 
[Kubernetes](https://kubernetes.io) has officially supported a variety of CPU architectures such as x86, arm/arm64, ppc64le, s390x. However, it's a pity that Kubernetes doesn't support MIPS. With the widespread use of cloud native technology, users under MIPS architecture also have an urgent demand for Kubernetes on MIPS.
-->
[Kubernetes](https://kubernetes.io) 官方目前支援眾多 CPU 架構諸如 x86, arm/arm64, ppc64le, s390x 等。然而目前還不支援 MIPS 架構，始終是一個遺憾。隨著雲原生技術的廣泛應用，MIPS 架構下的使用者始終對 Kubernetes on MIPS 有著迫切的需求。

<!--
## Achievements
-->

## 成果

<!--
For many years, to enrich the ecology of the open-source community, we have been working on adjusting MIPS architecture for Kubernetes use cases. With the continuous iterative optimization and the performance improvement of the MIPS CPU, we have made some breakthrough progresses on the mips64el platform.
-->
多年來，為了豐富開源社群的生態，我們一直致力於在 MIPS 架構下適配 Kubernetes。隨著 MIPS CPU 的不斷迭代最佳化和效能的提升，我們在 mips64el 平臺上取得了一些突破性的進展。

<!-- 
Over the years, we have been actively participating in the Kubernetes community and have rich experience in the using and optimization of Kubernetes technology. Recently, we tried to adapt the MIPS architecture platform for Kubernetes and achieved a new a stage on that journey. The team has completed migration and adaptation of Kubernetes and related components, built not only a stable and highly available MIPS cluster but also completed the conformance test for Kubernetes v1.16.2.
-->
多年來，我們一直積極投入 Kubernetes 社群，在 Kubernetes 技術應用和最佳化方面具備了豐富的經驗。最近，我們在研發過程中嘗試將 Kubernetes 適配到 MIPS 架構平臺，並取得了階段性成果。成功完成了 Kubernetes 以及相關元件的遷移適配，不僅搭建出穩定高可用的 MIPS 叢集，同時完成了 Kubernetes v1.16.2 版本的一致性測試。


![Kubernetes on MIPS](/images/blog/2020-01-15-Kubernetes-on-MIPS/kubernetes-on-mips.png)

<!--
_Figure 1 Kubernetes on MIPS_
-->
_圖一 Kubernetes on MIPS_

<!--
## K8S-MIPS component build
-->
## K8S-MIPS 元件構建

<!--
Almost all native cloud components related to Kubernetes do not provide a MIPS version installation package or image. The prerequisite of deploying Kubernetes on the MIPS platform is to compile and build all required components on the mips64el platform. These components include:
-->
幾乎所有的 Kubernetes 相關的雲原生元件都沒有提供 MIPS 版本的安裝包或映象，在 MIPS 平臺上部署 Kubernetes 的前提是自行編譯構建出全部所需元件。這些元件主要包括：

- golang
- docker-ce
- hyperkube
- pause
- etcd
- calico
- coredns
- metrics-server

<!--
Thanks to the excellent design of Golang and its good support for the MIPS platform, the compilation processes of the above cloud native components are greatly simplified. First of all, we compiled Golang on the latest stable version for the mips64el platform, and then we compiled most of the above components with source code.
-->
得益於 Golang 優秀的設計以及對於 MIPS 平臺的良好支援，極大地簡化了上述雲原生元件的編譯過程。首先，我們在 mips64el 平臺編譯出了最新穩定的 golang, 然後透過原始碼構建的方式編譯完成了上述大部分元件。

<!--
During the compilation processes, we inevitably encountered many platform compatibility problems, such as a Golang system call compatibility problem (syscall), typecasting of syscall. Stat_t from uint32 to uint64, patching for EpollEvent, and so on.
-->
在編譯過程中，我們不可避免地遇到了很多平臺相容性的問題，比如關於 golang 系統呼叫 (syscall) 的相容性問題, syscall.Stat_t 32 位 與 64 位型別轉換，EpollEvent 修正位缺失等等。

<!--
To build K8S-MIPS components, we used cross-compilation technology. Our process involved integrating a QEMU tool to translate MIPS CPU instructions and modifying the build script of Kubernetes and E2E image script of Kubernetes, Hyperkube, and E2E test images on MIPS architecture.
-->
構建 K8S-MIPS 元件主要使用了交叉編譯技術。構建過程包括整合 QEMU 工具來實現 MIPS CPU 指令的轉換。同時修改 Kubernetes 和 E2E 映象的構建指令碼，構建了 Hyperkube 和 MIPS 架構的 E2E 測試映象。

<!--
After successfully building the above components, we use tools such as kubespray and kubeadm to complete kubernetes cluster construction.
-->
成功構建出以上元件後，我們使用工具完成 Kubernetes 叢集的搭建，比如 kubespray、kubeadm 等。

<!--
| Name                           | Version | MIPS Repository                                                                                                                                                                                                                                                                   |
|--------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| golang on MIPS                 | 1.12.5  | -                                                                                                                                                                                                                                                                                 |
| docker-ce on MIPS              | 18.09.8 | -                                                                                                                                                                                                                                                                                 |
| metrics-server for CKE on MIPS | 0.3.2   | `registry.inspurcloud.cn/library/cke/kubernetes/metrics-server-mips64el:v0.3.2`                                                                                                                                                                                                   |
| etcd for CKE on MIPS           | 3.2.26  | `registry.inspurcloud.cn/library/cke/etcd/etcd-mips64el:v3.2.26`                                                                                                                                                                                                                  |
| pause for CKE on MIPS          | 3.1     | `registry.inspurcloud.cn/library/cke/kubernetes/pause-mips64el:3.1`                                                                                                                                                                                                               |
| hyperkube for CKE on MIPS      | 1.14.3  | `registry.inspurcloud.cn/library/cke/kubernetes/hyperkube-mips64el:v1.14.3`                                                                                                                                                                                                       |
| coredns for CKE on MIPS        | 1.6.5   | `registry.inspurcloud.cn/library/cke/kubernetes/coredns-mips64el:v1.6.5`                                                                                                                                                                                                          |
| calico for CKE on MIPS         | 3.8.0   | `registry.inspurcloud.cn/library/cke/calico/cni-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/ctl-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/node-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/kube-controllers-mips64el:v3.8.0` |
-->

| 名稱                              | 版本    | MIPS 映象倉庫                                                                                                                                                                                                                                                                     |
|-----------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MIPS 版本 golang                  | 1.12.5  | -                                                                                                                                                                                                                                                                                 |
| MIPS 版本 docker-ce               | 18.09.8 | -                                                                                                                                                                                                                                                                                 |
| MIPS 版本 CKE 構建 metrics-server | 0.3.2   | `registry.inspurcloud.cn/library/cke/kubernetes/metrics-server-mips64el:v0.3.2`                                                                                                                                                                                                   |
| MIPS 版本 CKE 構建 etcd           | 3.2.26  | `registry.inspurcloud.cn/library/cke/etcd/etcd-mips64el:v3.2.26`                                                                                                                                                                                                                  |
| MIPS 版本 CKE 構建 pause          | 3.1     | `registry.inspurcloud.cn/library/cke/kubernetes/pause-mips64el:3.1`                                                                                                                                                                                                               |
| MIPS 版本 CKE 構建 hyperkube      | 1.14.3  | `registry.inspurcloud.cn/library/cke/kubernetes/hyperkube-mips64el:v1.14.3`                                                                                                                                                                                                       |
| MIPS 版本 CKE 構建 coredns        | 1.6.5   | `registry.inspurcloud.cn/library/cke/kubernetes/coredns-mips64el:v1.6.5`                                                                                                                                                                                                          |
| MIPS 版本 CKE 構建 calico         | 3.8.0   | `registry.inspurcloud.cn/library/cke/calico/cni-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/ctl-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/node-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/kube-controllers-mips64el:v3.8.0` |

<!--
**Note**: CKE is a Kubernetes-based cloud container engine launched by Inspur
-->
**注**: CKE 是浪潮推出的一款基於 Kubernetes 的容器雲服務引擎

![K8S-MIPS Cluster Components](/images/blog/2020-01-15-Kubernetes-on-MIPS/k8s-mips-cluster-components.png)

<!--
_Figure 2 K8S-MIPS Cluster Components_
-->
_圖二 K8S-MIPS 叢集元件_

![CPU Architecture](/images/blog/2020-01-15-Kubernetes-on-MIPS/cpu-architecture.png)

<!--
_Figure 3 CPU Architecture_
-->
_圖三 CPU 架構_

![Cluster Node Information](/images/blog/2020-01-15-Kubernetes-on-MIPS/cluster-node-information.png)

<!--
_Figure 4 Cluster Node Information_
-->
_圖四 叢集節點資訊_

<!--
## Run K8S Conformance Test
-->
## 執行 K8S 一致性測試

<!--
The most straightforward way to verify the stability and availability of the K8S-MIPS cluster is to run a Kubernetes [conformance test](https://github.com/kubernetes/kubernetes/blob/v1.16.2/cluster/images/conformance/README.md).
-->
驗證 K8S-MIP 叢集穩定性和可用性最簡單直接的方式是執行 Kubernetes 的 [一致性測試](https://github.com/kubernetes/kubernetes/blob/v1.16.2/cluster/images/conformance/README.md)。

<!--
Conformance is a standalone container to launch Kubernetes end-to-end tests for conformance testing.
-->
一致性測試是一個獨立的容器，用於啟動 Kubernetes 端到端的一致性測試。

<!--
Once the test has started, it launches several pods for various end-to-end tests. The source code of those images used by these pods is mostly from `kubernetes/test/images`, and the built images are at `gcr.io/kubernetes-e2e-test-images`. Since there are no MIPS images in the repository, we must first build all needed images to run the test.
-->
當執行一致性測試時，測試程式會啟動許多 Pod 進行各種端到端的行為測試，這些 Pod 使用的映象原始碼大部分來自於 `kubernetes/test/images` 目錄下，構建的映象位於 `gcr.io/kubernetes-e2e-test-images/`。由於映象倉庫中目前並不存在 MIPS 架構的映象，我們要想執行 E2E 測試，必須首先構建出測試所需的全部映象。

<!--
### Build needed images for test
-->
### 構建測試所需映象

<!-- 
The first step is to find all needed images for the test. We can run `sonobuoy images-p e2e` command to list all images, or we can find those images in [/test/utils/image/manifest.go](https://github.com/kubernetes/kubernetes/blob/master/test/utils/image/manifest.go). Although Kubernetes officially has a complete Makefile and shell-script that provides commands for building test images, there are still a number of architecture-related issues that have not been resolved, such as the incompatibilities of base images and dependencies. So we cannot directly build mips64el architecture images by executing these commands.
-->
第一步是找到測試所需的所有映象。我們可以執行 `sonobuoy images-p e2e` 命令來列出所有映象，或者我們可以在 [/test/utils/image/manifest.go](https://github.com/kubernetes/kubernetes/blob/master/test/utils/image/manifest.go) 中找到這些映象。儘管 Kubernetes 官方提供了完整的 Makefile 和 shell 指令碼，為構建測試映像提供了命令，但是仍然有許多與體系結構相關的問題未能解決，比如基礎映像和依賴包的不相容問題。因此，我們無法透過直接執行這些構建命令來製作 mips64el 架構映象。

<!--
Most test images are in golang, then compiled into binaries and built as Docker image based on the corresponding Dockerfile. These images are easy to build. But note that most images are using alpine as their base image, which does not officially support mips64el architecture for now. For this moment, we are unable to make mips64el version of [alpine](https://www.alpinelinux.org/), so we have to replace the alpine to existing MIPS images, such as Debian-stretch, fedora, ubuntu. Replacing the base image also requires replacing the command to install the dependencies, even the version of these dependencies.
-->
多數測試映象都是使用 golang 編寫，然後編譯出二進位制檔案，並基於相應的 Dockerfile 製作出映象。這些映象對我們來說可以輕鬆地製作出來。但是需要注意一點：測試映象預設使用的基礎映象大多是 alpine, 目前 [Alpine](https://www.alpinelinux.org/) 官方並不支援 mips64el 架構，我們暫時未能自己製作出 mips64el 版本的 alpine 礎映象，只能將基礎映象替換為我們目前已有的 mips64el 基礎映象，比如 debian-stretch,fedora, ubuntu 等。替換基礎映象的同時也需要替換安裝依賴包的命令，甚至依賴包的版本等。

<!--
Some images are not in `kubernetes/test/images`, such as `gcr.io/google-samples/gb-frontend:v6`. There is no clear documentation explaining where these images are locaated, though we found the source code in repository [github.com/GoogleCloudPlatform/kubernetes-engine-samples](https://github.com/GoogleCloudPlatform/kubernetes-engine-samples). We soon ran into new problems: to build these google sample images, we have to build the base image it uses, even the base image of the base images, such as `php:5-apache`, `redis`, and `perl`.
-->
有些測試所需映象的原始碼並不在 `kubernetes/test/images` 下,比如 `gcr.io/google-samples/gb-frontend:v6` 等，沒有明確的文件說明這類映象來自於何方，最終還是在 [github.com/GoogleCloudPlatform/kubernetes-engine-samples](github.com/GoogleCloudPlatform/kubernetes-engine-samples) 這個倉庫找到了原始的映象原始碼。但是很快我們遇到了新的問題，為了製作這些映象，還要製作它依賴的基礎映象，甚至基礎映象的基礎映象，比如 `php:5-apache`、`redis`、`perl` 等等。

<!--
After a long process of building an image, we finished with about four dozen images, including the images used by the test pod, and the base images. The last step before we run the tests is to place all those images into every node in the cluster and make sure the Pod image pull policy is `imagePullPolicy: ifNotPresent`.
-->
經過漫長龐雜的的映象重製工作，我們完成了總計約 40 個映象的製作 ，包括測試映象以及直接和間接依賴的基礎映象。
最終我們將所有映象在叢集內準備妥當，並確保測試用例內所有 Pod 的映象拉取策略設定為 `imagePullPolicy: ifNotPresent`。

<!--
Here are some of the images we built
-->
這是我們構建出的部分映象列表：

- `docker.io/library/busybox:1.29`
- `docker.io/library/nginx:1.14-alpine`
- `docker.io/library/nginx:1.15-alpine`
- `docker.io/library/perl:5.26`
- `docker.io/library/httpd:2.4.38-alpine`
- `docker.io/library/redis:5.0.5-alpine`
- `gcr.io/google-containers/conformance:v1.16.2`
- `gcr.io/google-containers/hyperkube:v1.16.2`
- `gcr.io/google-samples/gb-frontend:v6`
- `gcr.io/kubernetes-e2e-test-images/agnhost:2.6`
- `gcr.io/kubernetes-e2e-test-images/apparmor-loader:1.0`
- `gcr.io/kubernetes-e2e-test-images/dnsutils:1.1`
- `gcr.io/kubernetes-e2e-test-images/echoserver:2.2`
- `gcr.io/kubernetes-e2e-test-images/ipc-utils:1.0`
- `gcr.io/kubernetes-e2e-test-images/jessie-dnsutils:1.0`
- `gcr.io/kubernetes-e2e-test-images/kitten:1.0`
- `gcr.io/kubernetes-e2e-test-images/metadata-concealment:1.2`
- `gcr.io/kubernetes-e2e-test-images/mounttest-user:1.0`
- `gcr.io/kubernetes-e2e-test-images/mounttest:1.0`
- `gcr.io/kubernetes-e2e-test-images/nautilus:1.0`
- `gcr.io/kubernetes-e2e-test-images/nonewprivs:1.0`
- `gcr.io/kubernetes-e2e-test-images/nonroot:1.0`
- `gcr.io/kubernetes-e2e-test-images/resource-consumer-controller:1.0`
- `gcr.io/kubernetes-e2e-test-images/resource-consumer:1.5`
- `gcr.io/kubernetes-e2e-test-images/sample-apiserver:1.10`
- `gcr.io/kubernetes-e2e-test-images/test-webserver:1.0`
- `gcr.io/kubernetes-e2e-test-images/volume/gluster:1.0`
- `gcr.io/kubernetes-e2e-test-images/volume/iscsi:2.0`
- `gcr.io/kubernetes-e2e-test-images/volume/nfs:1.0`
- `gcr.io/kubernetes-e2e-test-images/volume/rbd:1.0.1`
- `k8s.gcr.io/etcd:3.3.15`
- `k8s.gcr.io/pause:3.1`

<!--
Finally, we ran the tests and got the test result, include `e2e.log`, which showed that all test cases passed. Additionally, we submitted our test result to [k8s-conformance](https://github.com/cncf/k8s-conformance) as a [pull request](https://github.com/cncf/k8s-conformance/pull/779).
-->
最終我們執行一致性測試並且得到了測試報告，包括 `e2e.log`，顯示我們通過了全部的測試用例。此外，我們將測試結果以 [pull request](https://github.com/cncf/k8s-conformance/pull/779) 的形式提交給了 [k8s-conformance](https://github.com/cncf/k8s-conformance) 。

![Pull request for conformance test results](/images/blog/2020-01-15-Kubernetes-on-MIPS/pull-request-for-conformance-test-results.png)

<!--
_Figure 5 Pull request for conformance test results_
-->
_圖五 一致性測試結果的 PR_

<!--
## What's next
-->
## 後續計劃

<!--
We built the kubernetes-MIPS component manually and finished the conformance test, which verified the feasibility of Kubernetes On the MIPS platform and greatly enhanced our confidence in promoting the support of the MIPS architecture by Kubernetes.
-->
我們手動構建了 K8S-MIPS 元件以及執行了 E2E 測試，驗證了 Kubernetes on MIPS 的可行性，極大的增強了我們對於推進 Kubernetes 支援 MIPS 架構的信心。

<!--
In the future, we plan to actively contribute our experience and achievements to the community, submit PR, and patch for MIPS. We hope that more developers and companies in the community join us and promote Kubernetes on MIPS.
-->
後續，我們將積極地向社群貢獻我們的工作經驗以及成果，提交 PR 以及 Patch For MIPS 等， 希望能夠有更多的來自社群的力量加入進來，共同推進 Kubernetes for MIPS 的程序。

<!--
Contribution plan：
-->
後續開源貢獻計劃：

<!--
- contribute the source of e2e test images for MIPS
- contribute the source of hyperkube for MIPS
- contribute the source of deploy tools like kubeadm for MIPS
-->
- 貢獻構建 E2E 測試映象程式碼
- 貢獻構建 MIPS 版本 hyperkube 程式碼
- 貢獻構建 MIPS 版本 kubeadm 等叢集部署工具

---
