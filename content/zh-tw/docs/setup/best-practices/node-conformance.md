---
title: 校驗節點設置
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
**節點一致性測試**是一個容器化的測試框架，提供了針對節點的系統驗證和功能測試。
測試驗證節點是否滿足 Kubernetes 的最低要求；通過測試的節點有資格加入 Kubernetes 叢集。

<!--
The test validates whether the node meets the minimum requirements for Kubernetes;
a node that passes the testis qualified to join a Kubernetes cluster.
-->
該測試主要檢測節點是否滿足 Kubernetes 的最低要求，通過檢測的節點有資格加入 Kubernetes 叢集。

<!--
## Node Prerequisite
-->
## 節點的前提條件    {#node-prerequisite}

<!--
To run node conformance test, a node must satisfy the same prerequisites as a
standard Kubernetes node. At a minimum, the node should have the following
daemons installed:
-->
要運行節點一致性測試，節點必須滿足與標準 Kubernetes 節點相同的前提條件。
節點至少應安裝以下守護程序：

<!--
* CRI-compatible container runtimes such as Docker, Containerd and CRI-O
* kubelet
-->
* 與 CRI 兼容的容器運行時，例如 Docker、Containerd 和 CRI-O
* kubelet

<!--
## Running Node Conformance Test
-->
## 運行節點一致性測試    {#running-node-conformance-test}

<!--
To run the node conformance test, perform the following steps:
-->
要運行節點一致性測試，請執行以下步驟：

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
   由於測試框架啓動了本地控制平面來測試 kubelet，因此使用 `http://localhost:8080`
   作爲API 伺服器的 URL。
   一些其他的 kubelet 命令列參數可能會被用到：
   * `--cloud-provider`：如果使用 `--cloud-provider=gce`，需要移除這個參數來運行測試。

<!--
1. Run the node conformance test with command:

   ```shell
   # $CONFIG_DIR is the pod manifest path of your kubelet.
   # $LOG_DIR is the test output path.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```
```
-->
2. 使用以下命令運行節點一致性測試：

   ```shell
   # $CONFIG_DIR 是你 kubelet 的 Pod manifest 路徑。
   # $LOG_DIR 是測試的輸出路徑。
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

<!--
## Running Node Conformance Test for Other Architectures
-->
## 針對其他硬件體系結構運行節點一致性測試    {#running-node-conformance-test-for-other-architectures}

<!--
Kubernetes also provides node conformance test docker images for other
architectures:
-->
Kubernetes 也爲其他硬件體系結構的系統提供了節點一致性測試的 Docker 鏡像：

<!--
|  Arch  |       Image       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |
-->
|  架構   |       鏡像       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

<!--
## Running Selected Test
-->
## 運行特定的測試    {#running-selected-test}

<!--
To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.
-->
要運行特定測試，請使用你希望運行的測試的特定表達式覆蓋環境變量 `FOCUS`。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  registry.k8s.io/node-test:0.2
```

<!--
To skip specific tests, overwrite the environment variable `SKIP` with the
regular expression of tests you want to skip.
-->
要跳過特定的測試，請使用你希望跳過的測試的常規表達式覆蓋環境變量 `SKIP`。

<!--
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  registry.k8s.io/node-test:0.2
```
-->
```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # 運行除 MirrorPod 測試外的所有一致性測試內容
  registry.k8s.io/node-test:0.2
```

<!--
Node conformance test is a containerized version of
[node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md).
By default, it runs all conformance tests.
-->
節點一致性測試是
[節點端到端測試](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md)的容器化版本。
默認情況下，它會運行所有一致性測試。

<!--
Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance
test**, because it requires much more complex configuration to run non-conformance test.
-->
理論上，只要合理地設定容器和掛載所需的卷，就可以運行任何的節點端到端測試用例。
但是這裏**強烈建議只運行一致性測試**，因爲運行非一致性測試需要很多複雜的設定。

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
* 測試會在節點上遺留一些 Docker 映像檔，包括節點一致性測試本身的映像檔和功能測試相關的映像檔。
* 測試會在節點上遺留一些死的容器。這些容器是在功能測試的過程中創建的。
