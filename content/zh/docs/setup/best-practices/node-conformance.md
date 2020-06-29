---
reviewers:
- Random-Liu
title: 校验节点设置
weight: 30
---
<!--
---
reviewers:
- Random-Liu
title: Validate node setup
weight: 30
---
-->

{{< toc >}}

<!--
## Node Conformance Test
-->
## 节点一致性测试

<!--
*Node conformance test* is a containerized test framework that provides a system
verification and functionality test for a node. 
-->
*节点一致性测试* 是一个容器化的测试框架，提供了针对节点的系统验证和功能测试。

<!--
The test validates whether the node meets the minimum requirements for Kubernetes; a node that passes the testis qualified to join a Kubernetes cluster.
-->
该测试主要检测节点是否满足 Kubernetes 的最低要求，通过检测的节点有资格加入 Kubernetes 集群。

<!--
## Limitations
-->
## 限制

<!--
In Kubernetes version 1.5, node conformance test has the following limitations:
-->
在 Kubernetes 1.5 版中，节点一致性测试具有以下限制：

<!--
* Node conformance test only supports Docker as the container runtime.
* -->
* 节点一致性测试只支持 Docker 作为容器运行时环境。

<!--
## Node Prerequisite
-->
## 节点的前提条件

<!--
To run node conformance test, a node must satisfy the same prerequisites as astandard Kubernetes node. At a minimum, the node should have the following daemons installed:
-->
要运行节点一致性测试，节点必须满足与标准 Kubernetes 节点相同的前提条件。节点至少应安装以下守护程序：

<!--
* Container Runtime (Docker)
* Kubelet
-->
* 容器运行时 (Docker)
* Kubelet

<!--
## Running Node Conformance Test
-->
## 运行节点一致性测试

<!--
To run the node conformance test, perform the following steps:
-->
要运行节点一致性测试，请执行以下步骤：

<!--
1. Point your Kubelet to localhost `--api-servers="http://localhost:8080"`,
because the test framework starts a local master to test Kubelet. There are some
other Kubelet flags you may care:
  * `--pod-cidr`: If you are using `kubenet`, you should specify an arbitrary CIDR
    to Kubelet, for example `--pod-cidr=10.180.0.0/24`.
  * `--cloud-provider`: If you are using `--cloud-provider=gce`, you should
    remove the flag to run the test.
-->
1. 因为测试框架会启动一个本地的 master 来测试 Kubelet，所以将 Kubelet 指向本机 `--api-servers="http://localhost:8080"。 
   还有一些其他 Kubelet 参数可能需要注意：
  * `--pod-cidr`： 如果使用 `kubenet`， 需要为 Kubelet 任意指定一个 CIDR， 例如 `--pod-cidr=10.180.0.0/24`。
  * `--cloud-provider`： 如果使用 `--cloud-provider=gce`，需要移除这个参数来运行测试。


<!--
2. Run the node conformance test with command:
-->
2. 使用以下命令运行节点一致性测试：

```shell
# $CONFIG_DIR is the pod manifest path of your Kubelet.
# $LOG_DIR is the test output path.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  k8s.gcr.io/node-test:0.2
```

<!--
## Running Node Conformance Test for Other Architectures
-->
## 针对其他硬件体系结构运行节点一致性测试

<!--
Kubernetes also provides node conformance test docker images for other architectures:
-->
Kubernetes 也为其他硬件体系结构的系统提供了节点一致性测试的 Docker 镜像：

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

<!--
## Running Selected Test
-->
## 运行特定的测试

<!--
To run specific tests, overwrite the environment variable `FOCUS` with theregular expression of tests you want to run.
-->
要运行特定测试，请使用您希望运行的测试的特定表达式覆盖环境变量 `FOCUS`。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  k8s.gcr.io/node-test:0.2
```

<!--
To skip specific tests, overwrite the environment variable `SKIP` with theregular expression of tests you want to skip.
-->
要跳过特定的测试，请使用您希望跳过的测试的常规表达式覆盖环境变量 `SKIP`。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  k8s.gcr.io/node-test:0.2
```

<!--
Node conformance test is a containerized version of [node e2e test](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/e2e-node-tests.md).
-->
节点一致性测试是[节点端到端测试](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/e2e-node-tests.md)的容器化版本。
<!--
By default, it runs all conformance tests.
-->
默认情况下，它会运行所有一致性测试。

<!--
Theoretically, you can run any node e2e test if you configure the container andmount required volumes properly. But **it is strongly recommended to only run conformance test**, because it requires much more complex configuration to run non-conformance test.
-->
理论上，只要合理地配置容器和挂载所需的卷，就可以运行任何的节点端到端测试用例。 但是这里**强烈建议只运行一致性测试**，因为运行非一致性测试需要很多复杂的配置。

<!--
## Caveats
-->
## 注意

<!--
* The test leaves some docker images on the node, including the node conformance
  test image and images of containers used in the functionality
  test.
* The test leaves dead containers on the node. These containers are created
  during the functionality test.
-->

* 测试会在节点上遗留一些 Docker 镜像， 包括节点一致性测试本身的镜像和功能测试相关的镜像。
* 测试会在节点上遗留一些死的容器。这些容器是在功能测试的过程中创建的。
