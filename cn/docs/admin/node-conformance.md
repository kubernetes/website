---
approvers:
- Random-Liu
cn-approvers:
- lichuqiang
title: 节点设置校验
---
<!--
---
approvers:
- Random-Liu
title: Validate Node Setup
---
-->

* TOC
{:toc}

<!--
## Node Conformance Test

*Node conformance test* is a containerized test framework that provides a system
verification and functionality test for a node. The test validates whether the
node meets the minimum requirements for Kubernetes; a node that passes the test
is qualified to join a Kubernetes cluster.
-->
## 节点合规性测试

*节点合规性测试* 是一个容器化的测试框架，提供了针对节点的系统验证和功能测试。 该测试主要检测节点是否满足 Kubernetes 的最低要求，通过检测的节点有资格加入 Kubernetes 集群。

<!--
## Limitations

In Kubernetes version 1.5, node conformance test has the following limitations:

* Node conformance test only supports Docker as the container runtime.
-->
## 限制

在 Kubernetes 1.5版本中，节点合规性测试存在以下限制：

* 节点合规性测试只支持 Docker 作为容器运行时环境。

<!--
## Node Prerequisite

To run node conformance test, a node must satisfy the same prerequisites as a
standard Kubernetes node. At a minimum, the node should have the following
daemons installed:
-->
## 节点的前提条件

为运行节点合规性测试，节点必须满足与标准的 Kubernetes 节点同样的前提条件。最基本地， 节点应安装以下组件：

<!--
* Container Runtime (Docker)
* Kubelet
-->
* 容器运行时 (Docker)
* Kubelet

<!--
## Running Node Conformance Test

To run the node conformance test, perform the following steps:
-->
## 运行节点合规性测试

执行以下步骤来运行节点合规性测试：

<!--
1. Point your Kubelet to localhost `--api-servers="http://localhost:8080"`,
because the test framework starts a local master to test Kubelet. There are some
other Kubelet flags you may care:
  * `--pod-cidr`: If you are using `kubenet`, you should specify an arbitrary CIDR
    to Kubelet, for example `--pod-cidr=10.180.0.0/24`.
  * `--cloud-provider`: If you are using `--cloud-provider=gce`, you should
    remove the flag to run the test.
-->
1. 因为测试框架会启动一个本地的 master 来测试 Kubelet，
所以将 Kubelet 指向本机 `--api-servers="http://localhost:8080"。 还有一些其他 Kubelet 参数可能需要注意：
  * `--pod-cidr`： 如果使用 `kubenet`， 需要为 Kubelet 任意指定一个 CIDR， 例如 `--pod-cidr=10.180.0.0/24`。
  * `--cloud-provider`： 如果使用 `--cloud-provider=gce`，需要移除这个参数来运行测试。

<!--
2. Run the node conformance test with command:
-->
2. 执行以下命令来运行节点合规性测试：

<!--
```shell
# $CONFIG_DIR is the pod manifest path of your Kubelet.
# $LOG_DIR is the test output path.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  gcr.io/google_containers/node-test:0.2
```
-->
```shell
# $CONFIG_DIR 是 Kubelet 的 manifest 文件路径。
# $LOG_DIR 是测试结果输出的路径。
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  gcr.io/google_containers/node-test:0.2
```

<!--
## Running Node Conformance Test for Other Architectures

Kubernetes also provides node conformance test docker images for other
architectures:
-->
## 针对其他硬件体系结构运行节点合规性测试

Kubernetes 也为其他硬件体系结构的系统提供了节点合规性测试的 Docker 镜像：

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

<!--
## Running Selected Test

To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.
-->
## 运行选定的测试

为运行指定的测试，用正则表达式来描述将要运行的测试，并重载 `FOCUS` 环境变量。

<!--
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  gcr.io/google_containers/node-test:0.2
```
-->
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # 只运行 MirrorPod 测试
  gcr.io/google_containers/node-test:0.2
```

<!--
To skip specific tests, overwrite the environment variable `SKIP` with the
regular expression of tests you want to skip.
-->
为跳过指定的测试，用正则表达式来描述将要跳过的测试，并重载 `SKIP` 环境变量。

<!--
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  gcr.io/google_containers/node-test:0.2
```
-->
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # 运行除 MirrorPod 外的所有测试
  gcr.io/google_containers/node-test:0.2
```

<!--
Node conformance test is a containerized version of [node e2e test](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/devel/e2e-node-tests.md).
By default, it runs all conformance tests.
-->
节点合规性测试是[节点端到端测试](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/devel/e2e-node-tests.md)的一个容器化的版本。
默认情况下， 它会运行所有的合规性测试用例。

<!--
Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance
test**, because it requires much more complex configuration to run non-conformance test.
-->
理论上，只要合理地配置容器和挂载所需的卷，就可以运行任何的节点端到端测试用例。 但是这里 **强烈建议只运行合规性测试**，因为运行非合规性测试需要很多复杂的配置。

<!--
## Caveats

* The test leaves some docker images on the node, including the node conformance
  test image and images of containers used in the functionality
  test.
* The test leaves dead containers on the node. These containers are created
  during the functionality test.
-->
## 注意事项

* 测试会在节点上遗留一些Docker镜像， 包括节点合规性测试本身的镜像，和功能测试相关的镜像。
* 测试会在节点上遗留一些死的容器。这些容器是在功能测试的过程中创建的。
