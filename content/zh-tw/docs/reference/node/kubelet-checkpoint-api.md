---
content_type: "reference"
title: Kubelet Checkpoint API
weight: 10
---

{{< feature-state feature_gate_name="ContainerCheckpoint" >}}

<!--
Checkpointing a container is the functionality to create a stateful copy of a
running container. Once you have a stateful copy of a container, you could
move it to a different computer for debugging or similar purposes.

If you move the checkpointed container data to a computer that's able to restore
it, that restored container continues to run at exactly the same
point it was checkpointed. You can also inspect the saved data, provided that you
have suitable tools for doing so.
-->
爲容器生成檢查點這個功能可以爲一個正在運行的容器創建有狀態的拷貝。
一旦容器有一個有狀態的拷貝，你就可以將其移動到其他計算機進行調試或類似用途。

如果你將通過檢查點操作生成的容器資料移動到能夠恢復該容器的一臺計算機，
所恢復的容器將從之前檢查點操作執行的時間點繼續運行。
你也可以檢視所保存的資料，前提是你擁有這類操作的合適工具。

<!--
Creating a checkpoint of a container might have security implications. Typically
a checkpoint contains all memory pages of all processes in the checkpointed
container. This means that everything that used to be in memory is now available
on the local disk. This includes all private data and possibly keys used for
encryption. The underlying CRI implementations (the container runtime on that node)
should create the checkpoint archive to be only accessible by the `root` user. It
is still important to remember if the checkpoint archive is transferred to another
system all memory pages will be readable by the owner of the checkpoint archive.
-->
創建容器的檢查點可能會產生安全隱患。
通常，一個檢查點包含執行檢查點操作時容器中所有進程的所有內存頁。
這意味着以前存在於內存中的一切內容現在都在本地磁盤上獲得。
這裏的內容包括一切私密資料和可能用於加密的密鑰。
底層 CRI 實現（該節點上的容器運行時）應創建只有 `root` 使用者可以訪問的檢查點存檔。
另外重要的是記住：如果檢查點存檔被轉移到另一個系統，該檢查點存檔的所有者將可以讀取所有內存頁。

<!--
## Operations {#operations}

### `post` checkpoint the specified container {#post-checkpoint}

Tell the kubelet to checkpoint a specific container from the specified Pod.

Consult the [Kubelet authentication/authorization reference](/docs/reference/access-authn-authz/kubelet-authn-authz)
for more information about how access to the kubelet checkpoint interface is
controlled.
-->
## 操作 {#operations}

### `post` 對指定的容器執行檢查點操作    {#post-checkpoint}

告知 kubelet 對指定 Pod 中的特定容器執行檢查點操作。

查閱 [Kubelet 身份驗證/鑑權參考](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz)瞭解如何控制對
kubelet 檢查點介面的訪問。

<!--
The kubelet will request a checkpoint from the underlying
{{<glossary_tooltip term_id="cri" text="CRI">}} implementation. In the checkpoint
request the kubelet will specify the name of the checkpoint archive as
`checkpoint-<podFullName>-<containerName>-<timestamp>.tar` and also request to
store the checkpoint archive in the `checkpoints` directory below its root
directory (as defined by `--root-dir`).  This defaults to
`/var/lib/kubelet/checkpoints`.
-->
Kubelet 將對底層 {{<glossary_tooltip term_id="cri" text="CRI">}} 實現請求執行檢查點操作。
在該檢查點請求中，Kubelet 將檢查點存檔的名稱設置爲 `checkpoint-<pod 全稱>-<容器名稱>-<時間戳>.tar`，
還會請求將該檢查點存檔儲存到其根目錄（由 `--root-dir` 定義）下的 `checkpoints` 子目錄中。
這個目錄預設爲 `/var/lib/kubelet/checkpoints`。

<!--
The checkpoint archive is in _tar_ format, and could be listed using an implementation of
[`tar`](https://pubs.opengroup.org/onlinepubs/7908799/xcu/tar.html). The contents of the
archive depend on the underlying CRI implementation (the container runtime on that node).
-->
檢查點存檔的格式爲 **tar**，可以使用 [`tar`](https://pubs.opengroup.org/onlinepubs/7908799/xcu/tar.html)
的一種實現來讀取。存檔檔案的內容取決於底層 CRI 實現（該節點的容器運行時）。

<!--
#### HTTP Request {#post-checkpoint-request}
-->
#### HTTP 請求 {#post-checkpoint-request}

POST /checkpoint/{namespace}/{pod}/{container}

<!--
#### Parameters {#post-checkpoint-params}

- **namespace** (*in path*): string, required

- **pod** (*in path*): string, required

- **container** (*in path*): string, required

- **timeout** (*in query*): integer
-->
#### 參數 {#post-checkpoint-params}

- **namespace** (**路徑參數**)：string，必需

  {{< glossary_tooltip term_id="namespace" >}}

- **pod** (**路徑參數**)：string，必需

  {{< glossary_tooltip term_id="pod" >}}

- **container** (**路徑參數**)：string，必需

  {{< glossary_tooltip term_id="container" >}}

- **timeout** (**查詢參數**)：integer

  <!--
  Timeout in seconds to wait until the checkpoint creation is finished.
  If zero or no timeout is specified the default {{<glossary_tooltip
  term_id="cri" text="CRI">}} timeout value will be used. Checkpoint
  creation time depends directly on the used memory of the container.
  The more memory a container uses the more time is required to create
  the corresponding checkpoint.
  -->

  等待檢查點創建完成的超時時間（單位爲秒）。
  如果超時值爲零或未設定，將使用預設的 {{<glossary_tooltip term_id="cri" text="CRI">}} 超時時間值。
  生成檢查點所需的時長直接取決於容器所用的內存。容器使用的內存越多，創建相應檢查點所需的時間越長。

<!--
#### Response {#post-checkpoint-response}
-->
#### 響應 {#post-checkpoint-response}

<!--
200: OK

401: Unauthorized

404: Not Found (if the `ContainerCheckpoint` feature gate is disabled)

404: Not Found (if the specified `namespace`, `pod` or `container` cannot be found)

500: Internal Server Error (if the CRI implementation encounter an error during checkpointing (see error message for further details))

500: Internal Server Error (if the CRI implementation does not implement the checkpoint CRI API (see error message for further details))
-->
200: OK

401: Unauthorized

404: Not Found（如果 `ContainerCheckpoint` 特性門控被禁用）

404: Not Found（如果指定的 `namespace`、`pod` 或 `container` 無法被找到）

500: Internal Server Error（如果執行檢查點操作期間 CRI 實現遇到一個錯誤（參閱錯誤消息瞭解更多細節））

500: Internal Server Error（如果 CRI 實現未實現檢查點 CRI API（參閱錯誤消息瞭解更多細節））

{{< comment >}}
<!--
TODO: Add more information about return codes once CRI implementation have checkpoint/restore.
      This TODO cannot be fixed before the release, because the CRI implementation need
      the Kubernetes changes to be merged to implement the new ContainerCheckpoint CRI API
      call. We need to wait after the 1.25 release to fix this.
-->
TODO：一旦 CRI 實現具有檢查點/恢復能力，就會添加有關返回碼的更多資訊。
      這個 TODO 在發佈之前無法被修復，因爲 CRI 實現需要先合併對 Kubernetes 的變更，
      才能實現新的 ContainerCheckpoint CRI API 調用。我們需要等到 1.25 發佈後才能修復此問題。
{{< /comment >}}
