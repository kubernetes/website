---
layout: blog
title: "基于 MIPS 架构的 Kubernetes 方案"
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
**作者:** 石光银，尹东超，展望，江燕，蔡卫卫，高传集，孙思清（浪潮）

<!-- 
## Background
-->
## 背景

<!-- 
[MIPS](https://en.wikipedia.org/wiki/MIPS_architecture) (Microprocessor without Interlocked Pipelined Stages) is a reduced instruction set computer (RISC) instruction set architecture (ISA), appeared in 1981 and developed by MIPS Technologies. Now MIPS architecture is widely used in many electronic products.
-->
[MIPS](https://zh.wikipedia.org/wiki/MIPS%E6%9E%B6%E6%A7%8B) (Microprocessor without Interlocked Pipelined Stages) 是一种采取精简指令集（RISC）的处理器架构 (ISA)，出现于 1981 年，由 MIPS 科技公司开发。如今 MIPS 架构被广泛应用于许多电子产品上。

<!-- 
[Kubernetes](https://kubernetes.io) has officially supported a variety of CPU architectures such as x86, arm/arm64, ppc64le, s390x. However, it's a pity that Kubernetes doesn't support MIPS. With the widespread use of cloud native technology, users under MIPS architecture also have an urgent demand for Kubernetes on MIPS.
-->
[Kubernetes](https://kubernetes.io) 官方目前支持众多 CPU 架构诸如 x86, arm/arm64, ppc64le, s390x 等。然而目前还不支持 MIPS 架构，始终是一个遗憾。随着云原生技术的广泛应用，MIPS 架构下的用户始终对 Kubernetes on MIPS 有着迫切的需求。

<!--
## Achievements
-->

## 成果

<!--
For many years, to enrich the ecology of the open-source community, we have been working on adjusting MIPS architecture for Kubernetes use cases. With the continuous iterative optimization and the performance improvement of the MIPS CPU, we have made some breakthrough progresses on the mips64el platform.
-->
多年来，为了丰富开源社区的生态，我们一直致力于在 MIPS 架构下适配 Kubernetes。随着 MIPS CPU 的不断迭代优化和性能的提升，我们在 mips64el 平台上取得了一些突破性的进展。

<!-- 
Over the years, we have been actively participating in the Kubernetes community and have rich experience in the using and optimization of Kubernetes technology. Recently, we tried to adapt the MIPS architecture platform for Kubernetes and achieved a new a stage on that journey. The team has completed migration and adaptation of Kubernetes and related components, built not only a stable and highly available MIPS cluster but also completed the conformance test for Kubernetes v1.16.2.
-->
多年来，我们一直积极投入 Kubernetes 社区，在 Kubernetes 技术应用和优化方面具备了丰富的经验。最近，我们在研发过程中尝试将 Kubernetes 适配到 MIPS 架构平台，并取得了阶段性成果。成功完成了 Kubernetes 以及相关组件的迁移适配，不仅搭建出稳定高可用的 MIPS 集群，同时完成了 Kubernetes v1.16.2 版本的一致性测试。


![Kubernetes on MIPS](/images/blog/2020-01-15-Kubernetes-on-MIPS/kubernetes-on-mips.png)

<!--
_Figure 1 Kubernetes on MIPS_
-->
_图一 Kubernetes on MIPS_

<!--
## K8S-MIPS component build
-->
## K8S-MIPS 组件构建

<!--
Almost all native cloud components related to Kubernetes do not provide a MIPS version installation package or image. The prerequisite of deploying Kubernetes on the MIPS platform is to compile and build all required components on the mips64el platform. These components include:
-->
几乎所有的 Kubernetes 相关的云原生组件都没有提供 MIPS 版本的安装包或镜像，在 MIPS 平台上部署 Kubernetes 的前提是自行编译构建出全部所需组件。这些组件主要包括：

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
得益于 Golang 优秀的设计以及对于 MIPS 平台的良好支持，极大地简化了上述云原生组件的编译过程。首先，我们在 mips64el 平台编译出了最新稳定的 golang, 然后通过源码构建的方式编译完成了上述大部分组件。

<!--
During the compilation processes, we inevitably encountered many platform compatibility problems, such as a Golang system call compatibility problem (syscall), typecasting of syscall. Stat_t from uint32 to uint64, patching for EpollEvent, and so on.
-->
在编译过程中，我们不可避免地遇到了很多平台兼容性的问题，比如关于 golang 系统调用 (syscall) 的兼容性问题, syscall.Stat_t 32 位 与 64 位类型转换，EpollEvent 修正位缺失等等。

<!--
To build K8S-MIPS components, we used cross-compilation technology. Our process involved integrating a QEMU tool to translate MIPS CPU instructions and modifying the build script of Kubernetes and E2E image script of Kubernetes, Hyperkube, and E2E test images on MIPS architecture.
-->
构建 K8S-MIPS 组件主要使用了交叉编译技术。构建过程包括集成 QEMU 工具来实现 MIPS CPU 指令的转换。同时修改 Kubernetes 和 E2E 镜像的构建脚本，构建了 Hyperkube 和 MIPS 架构的 E2E 测试镜像。

<!--
After successfully building the above components, we use tools such as kubespray and kubeadm to complete kubernetes cluster construction.
-->
成功构建出以上组件后，我们使用工具完成 Kubernetes 集群的搭建，比如 kubespray、kubeadm 等。

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

| 名称                              | 版本    | MIPS 镜像仓库                                                                                                                                                                                                                                                                     |
|-----------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MIPS 版本 golang                  | 1.12.5  | -                                                                                                                                                                                                                                                                                 |
| MIPS 版本 docker-ce               | 18.09.8 | -                                                                                                                                                                                                                                                                                 |
| MIPS 版本 CKE 构建 metrics-server | 0.3.2   | `registry.inspurcloud.cn/library/cke/kubernetes/metrics-server-mips64el:v0.3.2`                                                                                                                                                                                                   |
| MIPS 版本 CKE 构建 etcd           | 3.2.26  | `registry.inspurcloud.cn/library/cke/etcd/etcd-mips64el:v3.2.26`                                                                                                                                                                                                                  |
| MIPS 版本 CKE 构建 pause          | 3.1     | `registry.inspurcloud.cn/library/cke/kubernetes/pause-mips64el:3.1`                                                                                                                                                                                                               |
| MIPS 版本 CKE 构建 hyperkube      | 1.14.3  | `registry.inspurcloud.cn/library/cke/kubernetes/hyperkube-mips64el:v1.14.3`                                                                                                                                                                                                       |
| MIPS 版本 CKE 构建 coredns        | 1.6.5   | `registry.inspurcloud.cn/library/cke/kubernetes/coredns-mips64el:v1.6.5`                                                                                                                                                                                                          |
| MIPS 版本 CKE 构建 calico         | 3.8.0   | `registry.inspurcloud.cn/library/cke/calico/cni-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/ctl-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/node-mips64el:v3.8.0` `registry.inspurcloud.cn/library/cke/calico/kube-controllers-mips64el:v3.8.0` |

<!--
**Note**: CKE is a Kubernetes-based cloud container engine launched by Inspur
-->
**注**: CKE 是浪潮推出的一款基于 Kubernetes 的容器云服务引擎

![K8S-MIPS Cluster Components](/images/blog/2020-01-15-Kubernetes-on-MIPS/k8s-mips-cluster-components.png)

<!--
_Figure 2 K8S-MIPS Cluster Components_
-->
_图二 K8S-MIPS 集群组件_

![CPU Architecture](/images/blog/2020-01-15-Kubernetes-on-MIPS/cpu-architecture.png)

<!--
_Figure 3 CPU Architecture_
-->
_图三 CPU 架构_

![Cluster Node Information](/images/blog/2020-01-15-Kubernetes-on-MIPS/cluster-node-information.png)

<!--
_Figure 4 Cluster Node Information_
-->
_图四 集群节点信息_

<!--
## Run K8S Conformance Test
-->
## 运行 K8S 一致性测试

<!--
The most straightforward way to verify the stability and availability of the K8S-MIPS cluster is to run a Kubernetes [conformance test](https://github.com/kubernetes/kubernetes/blob/v1.16.2/cluster/images/conformance/README.md).
-->
验证 K8S-MIP 集群稳定性和可用性最简单直接的方式是运行 Kubernetes 的 [一致性测试](https://github.com/kubernetes/kubernetes/blob/v1.16.2/cluster/images/conformance/README.md)。

<!--
Conformance is a standalone container to launch Kubernetes end-to-end tests for conformance testing.
-->
一致性测试是一个独立的容器，用于启动 Kubernetes 端到端的一致性测试。

<!--
Once the test has started, it launches several pods for various end-to-end tests. The source code of those images used by these pods is mostly from `kubernetes/test/images`, and the built images are at `gcr.io/kubernetes-e2e-test-images`. Since there are no MIPS images in the repository, we must first build all needed images to run the test.
-->
当执行一致性测试时，测试程序会启动许多 Pod 进行各种端到端的行为测试，这些 Pod 使用的镜像源码大部分来自于 `kubernetes/test/images` 目录下，构建的镜像位于 `gcr.io/kubernetes-e2e-test-images/`。由于镜像仓库中目前并不存在 MIPS 架构的镜像，我们要想运行 E2E 测试，必须首先构建出测试所需的全部镜像。

<!--
### Build needed images for test
-->
### 构建测试所需镜像

<!-- 
The first step is to find all needed images for the test. We can run `sonobuoy images-p e2e` command to list all images, or we can find those images in [/test/utils/image/manifest.go](https://github.com/kubernetes/kubernetes/blob/master/test/utils/image/manifest.go). Although Kubernetes officially has a complete Makefile and shell-script that provides commands for building test images, there are still a number of architecture-related issues that have not been resolved, such as the incompatibilities of base images and dependencies. So we cannot directly build mips64el architecture images by executing these commands.
-->
第一步是找到测试所需的所有镜像。我们可以执行 `sonobuoy images-p e2e` 命令来列出所有镜像，或者我们可以在 [/test/utils/image/manifest.go](https://github.com/kubernetes/kubernetes/blob/master/test/utils/image/manifest.go) 中找到这些镜像。尽管 Kubernetes 官方提供了完整的 Makefile 和 shell 脚本，为构建测试映像提供了命令，但是仍然有许多与体系结构相关的问题未能解决，比如基础映像和依赖包的不兼容问题。因此，我们无法通过直接执行这些构建命令来制作 mips64el 架构镜像。

<!--
Most test images are in golang, then compiled into binaries and built as Docker image based on the corresponding Dockerfile. These images are easy to build. But note that most images are using alpine as their base image, which does not officially support mips64el architecture for now. For this moment, we are unable to make mips64el version of [alpine](https://www.alpinelinux.org/), so we have to replace the alpine to existing MIPS images, such as Debian-stretch, fedora, ubuntu. Replacing the base image also requires replacing the command to install the dependencies, even the version of these dependencies.
-->
多数测试镜像都是使用 golang 编写，然后编译出二进制文件，并基于相应的 Dockerfile 制作出镜像。这些镜像对我们来说可以轻松地制作出来。但是需要注意一点：测试镜像默认使用的基础镜像大多是 alpine, 目前 [Alpine](https://www.alpinelinux.org/) 官方并不支持 mips64el 架构，我们暂时未能自己制作出 mips64el 版本的 alpine 础镜像，只能将基础镜像替换为我们目前已有的 mips64el 基础镜像，比如 debian-stretch,fedora, ubuntu 等。替换基础镜像的同时也需要替换安装依赖包的命令，甚至依赖包的版本等。

<!--
Some images are not in `kubernetes/test/images`, such as `gcr.io/google-samples/gb-frontend:v6`. There is no clear documentation explaining where these images are locaated, though we found the source code in repository [github.com/GoogleCloudPlatform/kubernetes-engine-samples](https://github.com/GoogleCloudPlatform/kubernetes-engine-samples). We soon ran into new problems: to build these google sample images, we have to build the base image it uses, even the base image of the base images, such as `php:5-apache`, `redis`, and `perl`.
-->
有些测试所需镜像的源码并不在 `kubernetes/test/images` 下,比如 `gcr.io/google-samples/gb-frontend:v6` 等，没有明确的文档说明这类镜像来自于何方，最终还是在 [github.com/GoogleCloudPlatform/kubernetes-engine-samples](github.com/GoogleCloudPlatform/kubernetes-engine-samples) 这个仓库找到了原始的镜像源代码。但是很快我们遇到了新的问题，为了制作这些镜像，还要制作它依赖的基础镜像，甚至基础镜像的基础镜像，比如 `php:5-apache`、`redis`、`perl` 等等。

<!--
After a long process of building an image, we finished with about four dozen images, including the images used by the test pod, and the base images. The last step before we run the tests is to place all those images into every node in the cluster and make sure the Pod image pull policy is `imagePullPolicy: ifNotPresent`.
-->
经过漫长庞杂的的镜像重制工作，我们完成了总计约 40 个镜像的制作 ，包括测试镜像以及直接和间接依赖的基础镜像。
最终我们将所有镜像在集群内准备妥当，并确保测试用例内所有 Pod 的镜像拉取策略设置为 `imagePullPolicy: ifNotPresent`。

<!--
Here are some of the images we built
-->
这是我们构建出的部分镜像列表：

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
- `registry.k8s.io/etcd:3.3.15` (镜像自发布以来已更改（以前使用的仓库为 "k8s.gcr.io"))
- `registry.k8s.io/pause:3.1` (镜像自发布以来已更改（以前使用的仓库为 "k8s.gcr.io"))

<!--
Finally, we ran the tests and got the test result, include `e2e.log`, which showed that all test cases passed. Additionally, we submitted our test result to [k8s-conformance](https://github.com/cncf/k8s-conformance) as a [pull request](https://github.com/cncf/k8s-conformance/pull/779).
-->
最终我们执行一致性测试并且得到了测试报告，包括 `e2e.log`，显示我们通过了全部的测试用例。此外，我们将测试结果以 [pull request](https://github.com/cncf/k8s-conformance/pull/779) 的形式提交给了 [k8s-conformance](https://github.com/cncf/k8s-conformance) 。

![Pull request for conformance test results](/images/blog/2020-01-15-Kubernetes-on-MIPS/pull-request-for-conformance-test-results.png)

<!--
_Figure 5 Pull request for conformance test results_
-->
_图五 一致性测试结果的 PR_

<!--
## What's next
-->
## 后续计划

<!--
We built the kubernetes-MIPS component manually and finished the conformance test, which verified the feasibility of Kubernetes On the MIPS platform and greatly enhanced our confidence in promoting the support of the MIPS architecture by Kubernetes.
-->
我们手动构建了 K8S-MIPS 组件以及执行了 E2E 测试，验证了 Kubernetes on MIPS 的可行性，极大的增强了我们对于推进 Kubernetes 支持 MIPS 架构的信心。

<!--
In the future, we plan to actively contribute our experience and achievements to the community, submit PR, and patch for MIPS. We hope that more developers and companies in the community join us and promote Kubernetes on MIPS.
-->
后续，我们将积极地向社区贡献我们的工作经验以及成果，提交 PR 以及 Patch For MIPS 等， 希望能够有更多的来自社区的力量加入进来，共同推进 Kubernetes for MIPS 的进程。

<!--
Contribution plan：
-->
后续开源贡献计划：

<!--
- contribute the source of e2e test images for MIPS
- contribute the source of hyperkube for MIPS
- contribute the source of deploy tools like kubeadm for MIPS
-->
- 贡献构建 E2E 测试镜像代码
- 贡献构建 MIPS 版本 hyperkube 代码
- 贡献构建 MIPS 版本 kubeadm 等集群部署工具

---
