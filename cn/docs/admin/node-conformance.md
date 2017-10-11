---
approvers:
- Random-Liu
title: 节点安装校验
---

* TOC
{:toc}

## 节点一致性测试（Node Conformance Test）

*节点一致性测试*是对节点提供系统验证及功能性测试的集装化测试框架。该测试验证节点是否满足加入Kubernetes的最小化要求；通过了测试的节点才适合加入到Kubernetes集群中。

## 限制

在1.5版的Kubernetes中，节点一致性测试有如下限制:

* 节点一致性测试仅仅支持Docker作为容器的运行时环境 

## 节点的前提条件

想要进行节点一致性测试，节点必须满足和标准的Kubernetes节点相同的先决条件。至少，该节点应该安装了以下这些软件：

* 容器运行环境(Docker)
* Kubelet

## 进行节点一致性测试

通过执行以下步骤来进行节点一致性测试：

1. 指定你的Kubelet到localhost `--api-servers="http://localhost:8080"`，因为测试框架会启动一个本地master来测试Kubelet。另外有几个Kubelet的标签你应该要留意:
  * `--pod-cidr`: 如果你正在用 `kubenet`, 你应该给Kubelet设定一个任意的CIDR值，例如 `--pod-cidr=10.180.0.0/24`。
  * `--cloud-provider`: 如果你正在用 `--cloud-provider=gce`， 在执行测试的时候你应该删除该标签。

2. 通过命令来执行节点一致性测试:

```shell
# $CONFIG_DIR 是Kubelet的pod manifest路径。
# $LOG_DIR 是测试的输出路径。
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  gcr.io/google_containers/node-test:0.2
```

## 针对不同平台执行节点一致性测试

Kubernetes也为不同的体系结构提供了节点一致性测试的docker镜像：

  架构   |       镜像        |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

## 执行选择性测试

想要执行特定的测试，可用你想要执行的正规测试表达式来覆盖`FOCUS`环境变量。
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  gcr.io/google_containers/node-test:0.2
```

想要跳过特定的测试，可用你想要跳过的正规测试表达式来覆盖`SKIP`环境变量。
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  gcr.io/google_containers/node-test:0.2
```

节点一致性测试是[node e2e test](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/devel/e2e-node-tests.md)的集装化版本。
默认情况下，会执行所有的一致性测试。

理论上, 如果你正确的配置了容器并挂载了必须的卷，你就可以运行任何node e2e test。 但是**强烈建议你只执行一致性测试**，因为执行非一致性测试需要更多复杂的配置。

## 附加说明

* 该测试会在节点上留下一些docker镜像，包括节点一致性测试的镜像和一些用于功能性测试容器的镜像。
* 该测试会有死掉的容器留在节点上，这些容器是在进行功能性测试的过程中被创建的。
