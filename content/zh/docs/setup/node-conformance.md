---
reviewers:
- Random-Liu
title: 验证节点设置
---

<!--

---
reviewers:
- Random-Liu
title: Validate Node Setup
---

-->

{{< toc >}}

<!--
## Node Conformance Test
-->
## 节点合规性测试

<!--
*Node conformance test* is a containerized test framework that provides a system
verification and functionality test for a node. The test validates whether the
node meets the minimum requirements for Kubernetes; a node that passes the test
is qualified to join a Kubernetes cluster.
-->
*节点合规性测试* 是一种容器化测试框架，为节点提供系统验证和功能测试。该测试验证节点是否满足 Kubernetes 的最低要求；通过测试的节点有资格加入 Kubernetes 集群。

<!--
## Limitations
-->
## 限制

<!--
In Kubernetes version 1.5, node conformance test has the following limitations:

* Node conformance test only supports Docker as the container runtime.
-->
在 Kubernetes 1.5 版中，节点合规性测试具有以下限制：

* 节点合规性测试仅支持 Docker 作为容器运行时。

<!--
## Node Prerequisite
-->
## 节点先决条件

<!--
To run node conformance test, a node must satisfy the same prerequisites as a
standard Kubernetes node. At a minimum, the node should have the following
daemons installed:

* Container Runtime (Docker)
* Kubelet
-->
要运行节点合规性测试，节点必须满足与标准 Kubernetes 节点相同的先决条件。该节点至少应安装以下守护程序：

* 容器运行时（Docker）
* Kubelet

<!--
## Running Node Conformance Test
-->
## 运行节点合规性测试

<!--
To run the node conformance test, perform the following steps:

1. Point your Kubelet to localhost `--api-servers="http://localhost:8080"`,
because the test framework starts a local master to test Kubelet. There are some
other Kubelet flags you may care:
  * `--pod-cidr`: If you are using `kubenet`, you should specify an arbitrary CIDR to Kubelet, for example `--pod-cidr=10.180.0.0/24`.
  * `--cloud-provider`: If you are using `--cloud-provider=gce`, you should
    remove the flag to run the test.

2. Run the node conformance test with command:

```shell
# $CONFIG_DIR is the pod manifest path of your Kubelet.
# $LOG_DIR is the test output path.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  k8s.gcr.io/node-test:0.2
```
-->

要运行节点合规性测试，请执行以下步骤：

1. 将您的 Kubelet 指向 localhost `--api-servers="http://localhost:8080"`，因为测试框架启动了一个本地主服务器来测试 Kubelet。您可能会关注其他一些 Kubelet 标记：
  * `--pod-cidr`： 如果你使用 `kubenet`，你应该为 Kubelet 指定一个任意的 CIDR，例如 `--pod-cidr=10.180.0.0/24`。
  * `--cloud-provider`: 如果您使用`--cloud-provider = gce`，则应删除该标志以运行测试。

2. 使用以下命令运行节点合规性测试：

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
## 为其他架构运行节点合规性测试

<!--
Kubernetes also provides node conformance test docker images for other
architectures:
-->
Kubernetes 还为其他架构提供节点合规性测试 docker 镜像：

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

<!--
## Running Selected Test
-->
## 运行选定的测试

<!--
To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.
-->
要运行特定测试，请使用要运行的测试的正则表达式覆盖环境变量 `FOCUS`。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  k8s.gcr.io/node-test:0.2
```

<!--
To skip specific tests, overwrite the environment variable `SKIP` with the
regular expression of tests you want to skip.
-->
要跳过特定测试，请使用要跳过的测试的正则表达式覆盖环境变量 `SKIP`。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  k8s.gcr.io/node-test:0.2
```

<!--
Node conformance test is a containerized version of [node e2e test](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/e2e-node-tests.md).By default, it runs all conformance tests.
-->
节点合规性测试是[节点 e2e 测试](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/e2e-node-tests.md)的容器化版本。默认情况下，它会运行所有一致性测试。

<!--
Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance test**, because it requires much more complex configuration to run non-conformance test.
-->
从理论上讲，如果配置容器并正确安装所需的卷，则可以运行任何节点 e2e 测试。 但**强烈建议仅运行一致性测试**，因为它需要更复杂的配置来运行不一致性测试。

<!--
## Caveats
-->
## 注意事项

<!--
* The test leaves some docker images on the node, including the node conformance
  test image and images of containers used in the functionality
  test.
* The test leaves dead containers on the node. These containers are created
  during the functionality test.
-->
* 测试在节点上留下一些 docker 镜像，包括节点合规性测试镜像和功能测试中使用的容器镜像。
* 测试在节点上留下了死容器。 这些容器是在功能测试期间创建的。
