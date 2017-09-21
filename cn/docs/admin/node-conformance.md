---
approvers:
- Random-Liu
title: 验证节点设置
---

* TOC
{:toc}

## 节点一致性测试

*节点一致性测试* 是一个容器化的测试框架，它提供了针对节点的操作系统验证和功能测试。该测试主要检测节点是否满足Kubernetes的最低要求; 通过检测的节点有资格加入Kubernetes集群。

## 限制

在Kubernetes1.5版本中，节点一致性测试存在以下限制:

* 节点一致性测试只支持Docker作为容器运行时环境。

## 节点的前提条件

为运行节点一致性测试，节点必须满足与标准的Kubernetes节点同样的前提条件。 最基本地，节点应安装以下组件:

* 容器运行时 (Docker)
* Kubelet

## 运行节点一致性测试

为运行节点一致性测试，执行以下步骤:

1. 将 Kubelet定向到本机 `--api-servers="http://localhost:8080"`，
因为测试框架会启动一个本地的master来测试Kubelet。还有一些其他Kubelet参数可能需要关心:
  * `--pod-cidr`: 如果使用 `kubenet`，需要为Kubelet任意指定一个 CIDR，例如 `--pod-cidr=10.180.0.0/24`。
  * `--cloud-provider`: 如果使用了 `--cloud-provider=gce`，需要移除这个标记来运行测试。

2. 执行以下命令来运行节点一致性测试:

```shell
# $CONFIG_DIR 是Kubelet的manifest文件路径。
# $LOG_DIR 是测试结果输出的路径。
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  gcr.io/google_containers/node-test:0.2
```

## 针对其他架构运行节点一致性测试

Kubernetes 也为其他架构的系统提供了节点一致性测试的Docker镜像:

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

## 运行选定的测试

为运行指定的测试，用需要运行的测试的正则表达式来覆盖 `FOCUS` 环境变量。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # 只运行MirrorPod测试
  gcr.io/google_containers/node-test:0.2
```

为跳过指定的测试，用需要跳过的测试的正则表达式来覆盖 `SKIP` 环境变量。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # 运行除MirrorPod外的所有测试
  gcr.io/google_containers/node-test:0.2
```

节点一致性测试是 [节点 e2e 测试](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/devel/e2e-node-tests.md)的一个容器化的版本。
默认情况下，它会运行所有的一致性测试用例。

理论上，只要合理地配置容器和挂载所需的卷，就可以运行任何的节点 e2e 测试用例。但是这里 **强烈建议只运行一致性测试**， 因为运行非一致性测试需要很多复杂的配置。

## 注意事项

* 测试会在节点上遗留一些Docker镜像，包括节点一致性测试本身的镜像，和功能测试相关的镜像。
* 测试会在节点上遗留一些死的容器。 这些容器是在功能测试的过程中创建的。
