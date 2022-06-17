---
title: 校驗節點設定
weight: 30
---
<!--
reviewers:
- Random-Liu
title: Validate node setup
weight: 30
-->

{{< toc >}}

<!--
## Node Conformance Test
-->
## 節點一致性測試    {#node-conformance-test}

<!--
*Node conformance test* is a containerized test framework that provides a system
verification and functionality test for a node. The test validates whether the
node meets the minimum requirements for Kubernetes; a node that passes the test
is qualified to join a Kubernetes cluster.
-->
**節點一致性測試** 是一個容器化的測試框架，提供了針對節點的系統驗證和功能測試。
測試驗證節點是否滿足 Kubernetes 的最低要求；透過測試的節點有資格加入 Kubernetes 叢集。

<!--
The test validates whether the node meets the minimum requirements for Kubernetes; a node that passes the testis qualified to join a Kubernetes cluster.
-->
該測試主要檢測節點是否滿足 Kubernetes 的最低要求，透過檢測的節點有資格加入 Kubernetes 叢集。

<!--
## Node Prerequisite
-->
## 節點的前提條件    {#node-prerequisite}

<!--
To run node conformance test, a node must satisfy the same prerequisites as a
standard Kubernetes node. At a minimum, the node should have the following
daemons installed:
-->
要執行節點一致性測試，節點必須滿足與標準 Kubernetes 節點相同的前提條件。節點至少應安裝以下守護程式：

<!--
* Container Runtime (Docker)
* Kubelet
-->
* 容器執行時 (Docker)
* Kubelet

<!--
## Running Node Conformance Test
-->
## 執行節點一致性測試    {#running-node-conformance-test}

<!--
To run the node conformance test, perform the following steps:
-->
要執行節點一致性測試，請執行以下步驟：

<!--
1. Work out the value of the `--kubeconfig` option for the kubelet; for example:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
    Because the test framework starts a local control plane to test the kubelet,
    use `http://localhost:8080` as the URL of the API server.
    There are some other kubelet command line parameters you may want to use:
  * `--cloud-provider`: If you are using `--cloud-provider=gce`, you should
    remove the flag to run the test.
-->
1. 得出 kubelet 的 `--kubeconfig` 的值；例如：`--kubeconfig=/var/lib/kubelet/config.yaml`。
   由於測試框架啟動了本地控制平面來測試 kubelet，因此使用 `http://localhost:8080`
   作為API 伺服器的 URL。
   一些其他的 kubelet 命令列引數可能會被用到：
   * `--cloud-provider`：如果使用 `--cloud-provider=gce`，需要移除這個引數來執行測試。


<!--
2. Run the node conformance test with command:

```shell
# $CONFIG_DIR is the pod manifest path of your Kubelet.
# $LOG_DIR is the test output path.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  k8s.gcr.io/node-test:0.2
```
-->
2. 使用以下命令執行節點一致性測試：

   ```shell
   # $CONFIG_DIR 是你 Kubelet 的 pod manifest 路徑。
   # $LOG_DIR 是測試的輸出路徑。
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     k8s.gcr.io/node-test:0.2
   ```

<!--
## Running Node Conformance Test for Other Architectures
-->
## 針對其他硬體體系結構執行節點一致性測試    {#running-node-conformance-test-for-other-architectures}

<!--
Kubernetes also provides node conformance test docker images for other
architectures:
-->
Kubernetes 也為其他硬體體系結構的系統提供了節點一致性測試的 Docker 映象：

<!--
  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |
-->
  架構  |       映象        |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

<!--
## Running Selected Test
-->
## 執行特定的測試    {#running-selected-test}

<!--
To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.
-->
要執行特定測試，請使用你希望執行的測試的特定表示式覆蓋環境變數 `FOCUS`。

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
要跳過特定的測試，請使用你希望跳過的測試的常規表示式覆蓋環境變數 `SKIP`。

<!--
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  k8s.gcr.io/node-test:0.2
```
-->
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # 執行除 MirrorPod 測試外的所有一致性測試內容
  k8s.gcr.io/node-test:0.2
```


<!--
Node conformance test is a containerized version of [node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md).
-->
節點一致性測試是[節點端到端測試](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md)的容器化版本。
<!--
By default, it runs all conformance tests.
-->
預設情況下，它會執行所有一致性測試。

<!--
Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance
test**, because it requires much more complex configuration to run non-conformance test.
-->
理論上，只要合理地配置容器和掛載所需的卷，就可以執行任何的節點端到端測試用例。但是這裡**強烈建議只執行一致性測試**，因為執行非一致性測試需要很多複雜的配置。

<!--
## Caveats
-->
## 注意事項    {#caveats}

<!--
* The test leaves some docker images on the node, including the node conformance
  test image and images of containers used in the functionality
  test.
* The test leaves dead containers on the node. These containers are created
  during the functionality test.
-->

* 測試會在節點上遺留一些 Docker 映象，包括節點一致性測試本身的映象和功能測試相關的映象。
* 測試會在節點上遺留一些死的容器。這些容器是在功能測試的過程中建立的。