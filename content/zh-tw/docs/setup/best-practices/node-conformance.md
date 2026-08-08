---
title: 驗證節點設定
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

<!--
## Node Conformance Test
-->
## 節點一致性測試 {#node-conformance-test}

<!--
*Node conformance test* is a containerized test framework that provides a system
verification and functionality test for a node. The test validates whether the
node meets the minimum requirements for Kubernetes; a node that passes the test
is qualified to join a Kubernetes cluster.
-->
*節點一致性測試*是一個容器化的測試框架，用於對節點進行系統驗證與功能測試。
此測試會驗證節點是否符合 Kubernetes 的最低要求；通過測試的節點才可加入 Kubernetes 叢集。

<!--
## Node Prerequisite
-->
## 節點前置條件 {#node-prerequisite}

<!--
To run node conformance test, a node must satisfy the same prerequisites as a
standard Kubernetes node. At a minimum, the node should have the following
daemons installed:
-->
要執行節點一致性測試，節點必須滿足與標準 Kubernetes 節點相同的先決條件。
節點應至少安裝以下常駐程式：

<!--
* CRI-compatible container runtimes such as Docker, containerd and CRI-O
* kubelet
-->
* 相容 CRI 的容器執行階段：例如 Docker、containerd 與 CRI-O
* kubelet

<!--
## Running Node Conformance Test
-->
## 執行節點一致性測試 {#running-node-conformance-test}

<!--
To run the node conformance test, perform the following steps:
-->
若要執行節點一致性測試，請執行以下步驟：

<!--
1. Work out the value of the `--kubeconfig` option for the kubelet; for example:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
    Because the test framework starts a local control plane to test the kubelet,
    use `http://localhost:8080` as the URL of the API server.
    There are some other kubelet command line parameters you may want to use:
  
   * `--cloud-provider`: If you are using `--cloud-provider=gce`, you should
     remove the flag to run the test.
-->
1. 確認 kubelet 的 `--kubeconfig` 設定；例如：`--kubeconfig=/var/lib/kubelet/config.yaml`。
   由於測試框架會啟動一個本地控制平面來測試 kubelet，應使用 `http://localhost:8080` 作為 API 伺服器的網址。
   此外，還有一些您可能需要使用的 kubelet 命令列參數：

   * `--cloud-provider`：如果您目前使用 `--cloud-provider=gce`，執行測試時應移除此命令列參數。

<!--
1. Run the node conformance test with command:

   ```shell
   # $CONFIG_DIR is the pod manifest path of your kubelet.
   # $LOG_DIR is the test output path.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```
-->
1. 使用以下指令執行節點一致性測試：

   ```shell
   # $CONFIG_DIR 是您 kubelet 的 Pod 設定檔（manifest）路徑。
   # $LOG_DIR 是測試結果的輸出路徑。
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

<!--
## Running Node Conformance Test for Other Architectures
-->
## 執行其他架構的節點一致性測試 {#running-node-conformance-test-for-other-architectures}

<!--
Kubernetes also provides node conformance test docker images for other
architectures:
-->
Kubernetes 也為其他架構提供了節點一致性測試的 Docker 映像檔：

<!--
|  Arch  |       Image       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |
-->
|  架構  |      映像檔       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

<!--
## Running Selected Test
-->
## 執行選定的測試 {#running-selected-test}

<!--
To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.
-->
要執行特定的測試，需使用您想執行的測試正規表達式來覆寫環境變數 `FOCUS`。

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
若要跳過特定測試，請使用您想跳過的測試正則表達式來覆寫環境變數 `SKIP`。

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  registry.k8s.io/node-test:0.2
```

<!--
Node conformance test is a containerized version of
[node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md).
By default, it runs all conformance tests.
-->
節點端對端（e2e）測試是 [node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md) 的容器化版本。
在預設情況下，它會執行所有的一致性測試。

<!--
Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance
test**, because it requires much more complex configuration to run non-conformance test.
-->
理論上，只要您正確配置容器並掛載必要的卷，您就能執行任何節點端對端測試。
但**強烈建議僅執行一致性測試**，因為執行非一致性測試所需的配置要複雜得多。

<!--
## Caveats
-->
## 注意事項 {#caveats}

<!--
* The test leaves some docker images on the node, including the node conformance
  test image and images of containers used in the functionality
  test.
* The test leaves dead containers on the node. These containers are created
  during the functionality test.
-->
* 測試會在節點上留下一些 Docker 映像檔，包括節點一致性測試的映像檔，以及功能測試中所使用的容器映像檔。
* 測試會在節點上留下已停止的容器。這些容器是在功能測試期間所建立的。