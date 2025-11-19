---
layout: blog
title: "Kubernetes 1.26: 我們現在正在對二進制發佈工件進行簽名!"
date: 2022-12-12
slug: kubernetes-release-artifact-signing
---
<!--
layout: blog
title: "Kubernetes 1.26: We're now signing our binary release artifacts!"
date: 2022-12-12
slug: kubernetes-release-artifact-signing
-->

<!--
**Author:** Sascha Grunert
-->
**作者：** Sascha Grunert

**譯者：** XiaoYang Zhang (HUAWEI)

<!--
The Kubernetes Special Interest Group (SIG) Release is proud to announce that we
are digitally signing all release artifacts, and that this aspect of Kubernetes
has now reached _beta_.
-->
Kubernetes 特別興趣小組 SIG Release 自豪地宣佈，我們正在對所有發佈工件進行數字簽名，並且
Kubernetes 在這一方面現已達到 **Beta**。

<!--
Signing artifacts provides end users a chance to verify the integrity of the
downloaded resource. It allows to mitigate man-in-the-middle attacks directly on
the client side and therefore ensures the trustfulness of the remote serving the
artifacts. The overall goal of out past work was to define the used tooling for
signing all Kubernetes related artifacts as well as providing a standard signing
process for related projects (for example for those in [kubernetes-sigs][k-sigs]).
-->
簽名工件爲終端用戶提供了驗證下載資源完整性的機會。
它可以直接在客戶端減輕中間人攻擊，從而確保遠程服務工件的可信度。
過去工作的總體目標是定義用於對所有 Kubernetes 相關工件進行簽名的工具，
以及爲相關項目（例如 [kubernetes-sigs][k-sigs] 中的項目）提供標準簽名流程。

[k-sigs]: https://github.com/kubernetes-sigs

<!--
We already signed all officially released container images (from Kubernetes v1.24 onwards).
Image signing was alpha for v1.24 and v1.25. For v1.26, we've added all
**binary artifacts** to the signing process as well! This means that now all
[client, server and source tarballs][tarballs], [binary artifacts][binaries],
[Software Bills of Material (SBOMs)][sboms] as well as the [build
provenance][provenance] will be signed using [cosign][cosign]. Technically
speaking, we now ship additional `*.sig` (signature) and `*.cert` (certificate)
files side by side to the artifacts for verifying their integrity.
-->
我們已經對所有官方發佈的容器鏡像進行了簽名（從 Kubernetes v1.24 開始）。
在 v1.24 版本和 v1.25 版本中，鏡像簽名是 alpha 版本。
在 v1.26 版本中，我們將所有的 **二進制工件** 也加入到了簽名過程中！
這意味着現在所有的[客戶端、服務器和源碼壓縮包][tarballs]、[二進制工件][binaries]、[軟件材料清單（SBOM）][sboms]
以及[構建源][provenance]都將使用 [cosign][cosign] 進行簽名！
從技術上講，我們現在將額外的 `*.sig`（簽名）和 `*.cert`（證書）文件與工件一起發佈以用於驗證其完整性。

[tarballs]: https://github.com/kubernetes/kubernetes/blob/release-1.26/CHANGELOG/CHANGELOG-1.26.md#downloads-for-v1260
[binaries]: https://gcsweb.k8s.io/gcs/kubernetes-release/release/v1.26.0/bin
[sboms]: https://dl.k8s.io/release/v1.26.0/kubernetes-release.spdx
[provenance]: https://dl.k8s.io/release/v1.26.0/provenance.json
[cosign]: https://github.com/sigstore/cosign

<!--
To verify an artifact, for example `kubectl`, you can download the
signature and certificate alongside with the binary. I use the release candidate
`rc.1` of v1.26 for demonstration purposes because the final has not been released yet:
-->
要驗證一個工件，例如 `kubectl`，你可以在下載二進制文件的同時下載簽名和證書。
我使用 v1.26 的候選發佈版本 `rc.1` 來演示，因爲最終版本還沒有發佈：

```shell
curl -sSfL https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl -o kubectl
curl -sSfL https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.sig -o kubectl.sig
curl -sSfL https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.cert -o kubectl.cert
```

<!--
Then you can verify `kubectl` using [`cosign`][cosign]:
-->
然後你可以使用 [`cosign`][cosign] 驗證 `kubectl`：

```shell
COSIGN_EXPERIMENTAL=1 cosign verify-blob kubectl --signature kubectl.sig --certificate kubectl.cert
```

```
tlog entry verified with uuid: 5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657 index: 8173886
Verified OK
```

<!--
The UUID can be used to query the [rekor][rekor] transparency log:
-->
可用 UUID 查詢 [rekor][rekor] 透明日誌：

[rekor]: https://github.com/sigstore/rekor

```shell
rekor-cli get --uuid 5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657
```

```
LogID: c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d
Index: 8173886
IntegratedTime: 2022-11-30T18:59:07Z
UUID: 24296fb24b8ad77a5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657
Body: {
  "HashedRekordObj": {
    "data": {
      "hash": {
        "algorithm": "sha256",
        "value": "982dfe7eb5c27120de6262d30fa3e8029bc1da9e632ce70570e9c921d2851fc2"
      }
    },
    "signature": {
      "content": "MEQCIH0e1/0svxMoLzjeyhAaLFSHy5ZaYy0/2iQl2t3E0Pj4AiBsWmwjfLzrVyp9/v1sy70Q+FHE8miauOOVkAW2lTYVug==",
      "publicKey": {
        "content": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN2akNDQWthZ0F3SUJBZ0lVRldab0pLSUlFWkp3LzdsRkFrSVE2SHBQdi93d0NnWUlLb1pJemowRUF3TXcKTnpFVk1CTUdBMVVFQ2hNTWMybG5jM1J2Y21VdVpHVjJNUjR3SEFZRFZRUURFeFZ6YVdkemRHOXlaUzFwYm5SbApjbTFsWkdsaGRHVXdIaGNOTWpJeE1UTXdNVGcxT1RBMldoY05Nakl4TVRNd01Ua3dPVEEyV2pBQU1Ga3dFd1lICktvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUVDT3h5OXBwTFZzcVFPdHJ6RFgveTRtTHZSeU1scW9sTzBrS0EKTlJDM3U3bjMreHorYkhvWVkvMUNNRHpJQjBhRTA3NkR4ZWVaSkhVaWFjUXU4a0dDNktPQ0FXVXdnZ0ZoTUE0RwpBMVVkRHdFQi93UUVBd0lIZ0RBVEJnTlZIU1VFRERBS0JnZ3JCZ0VGQlFjREF6QWRCZ05WSFE0RUZnUVV5SmwxCkNlLzIzNGJmREJZQ2NzbXkreG5qdnpjd0h3WURWUjBqQkJnd0ZvQVUzOVBwejFZa0VaYjVxTmpwS0ZXaXhpNFkKWkQ4d1FnWURWUjBSQVFIL0JEZ3dOb0UwYTNKbGJDMXpkR0ZuYVc1blFHczRjeTF5Wld4bGJtY3RjSEp2WkM1cApZVzB1WjNObGNuWnBZMlZoWTJOdmRXNTBMbU52YlRBcEJnb3JCZ0VFQVlPL01BRUJCQnRvZEhSd2N6b3ZMMkZqClkyOTFiblJ6TG1kdmIyZHNaUzVqYjIwd2dZb0dDaXNHQVFRQjFua0NCQUlFZkFSNkFIZ0FkZ0RkUFRCcXhzY1IKTW1NWkhoeVpaemNDb2twZXVONDhyZitIaW5LQUx5bnVqZ0FBQVlUSjZDdlJBQUFFQXdCSE1FVUNJRXI4T1NIUQp5a25jRFZpNEJySklXMFJHS0pqNkQyTXFGdkFMb0I5SmNycXlBaUVBNW4xZ283cmQ2U3ZVeXNxeldhMUdudGZKCllTQnVTZHF1akVySFlMQTUrZTR3Q2dZSUtvWkl6ajBFQXdNRFpnQXdZd0l2Tlhub3pyS0pWVWFESTFiNUlqa1oKUWJJbDhvcmlMQ1M4MFJhcUlBSlJhRHNCNTFUeU9iYTdWcGVYdThuTHNjVUNNREU4ZmpPZzBBc3ZzSXp2azNRUQo0c3RCTkQrdTRVV1UrcjhYY0VxS0YwNGJjTFQwWEcyOHZGQjRCT2x6R204K093PT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
      }
    }
  }
}
```

<!--
The `HashedRekordObj.signature.content` should match the content of the file
`kubectl.sig` and `HashedRekordObj.signature.publicKey.content` should be
identical with the contents of `kubectl.cert`. It is also possible to specify
the remote certificate and signature locations without downloading them:
-->
`HashedRekordObj.signature.content` 應與 `kubectl.sig` 的內容匹配，
`HashedRekordObj.signature.publicKey.content` 應與 `kubectl.cert` 的內容匹配。
也可以指定遠程證書和簽名的位置而不下載它們：

```shell
COSIGN_EXPERIMENTAL=1 cosign verify-blob kubectl \
    --signature https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.sig \
    --certificate https://dl.k8s.io/release/v1.26.0-rc.1/bin/linux/amd64/kubectl.cert
```

```
tlog entry verified with uuid: 5d54b39222e3fa9a21bcb0badd8aac939b4b0d1d9085b37f1f10b18a8cd24657 index: 8173886
Verified OK
```

<!--
All of the mentioned steps as well as how to verify container images are
outlined in the official documentation about how to [Verify Signed Kubernetes
Artifacts][docs]. In one of the next upcoming Kubernetes releases we will
working making the global story more mature by ensuring that truly all
Kubernetes artifacts are signed. Beside that, we are considering using Kubernetes
owned infrastructure for the signing (root trust) and verification (transparency
log) process.
-->
有關如何[驗證已簽名的 Kubernetes 工件][docs]的官方文檔中概述了所有提到的步驟以及如何驗證容器鏡像。
在下一個即將發佈的 Kubernetes 版本中，我們將通過確保真正對所有 Kubernetes 工件進行簽名來使之在全球更加成熟。
除此之外，我們正在考慮使用 Kubernetes 自有的基礎設施來進行簽名（根信任）和驗證（透明日誌）過程。

<!--
[docs]: /docs/tasks/administer-cluster/verify-signed-artifacts
-->
[docs]: /zh-cn/docs/tasks/administer-cluster/verify-signed-artifacts

<!--
## Getting involved

If you're interested in contributing to SIG Release, then consider applying for
the upcoming v1.27 shadowing program (watch for the announcement on
[k-dev][k-dev]) or join our [weekly meeting][meeting] to say _hi_.
-->
## 參與其中  {#getting-involved}

如果你有興趣爲 SIG Release 做貢獻，請考慮申請即將推出的 v1.27 影子計劃（觀看 [k-dev][k-dev]
上的公告）或參加我們的[周例會][meeting]。

<!--
We're looking forward to making even more of those awesome changes for future
Kubernetes releases. For example, we're working on the [SLSA Level 3 Compliance
in the Kubernetes Release Process][slsa] or the [Renaming of the kubernetes/kubernetes
default branch name to `main`][kkmain].
-->
我們期待着在未來的 Kubernetes 版本中做出更多了不起的改變。例如，我們正在致力於
[Kubernetes 發佈過程中的 SLSA 3 級合規性][slsa]或將 [kubernetes/kubernetes 默認分支名稱重命名爲 `main`][kkmain]。

<!--
Thank you for reading this blog post! I'd like to use this opportunity to give
all involved SIG Release folks a special shout-out for shipping this feature in
time!
-->
感謝你閱讀這篇博文！我想藉此機會向所有參與的 SIG Release 人員表示特別地感謝，感謝他們及時推出這一功能！

<!--
Feel free to reach out to us by using the [SIG Release mailing list][mail] or
the [#sig-release][slack] Slack channel.
-->
歡迎使用 [SIG Release 郵件列表][mail]或 [#sig-release][slack] Slack 頻道與我們聯繫。

[mail]: https://groups.google.com/g/kubernetes-sig-release
[slsa]: https://github.com/kubernetes/enhancements/issues/3027
[kkmain]: https://github.com/kubernetes/enhancements/issues/2853
[slack]: http://slack.k8s.io
[k-dev]: https://groups.google.com/a/kubernetes.io/g/dev
[meeting]: http://bit.ly/k8s-sig-release-meeting

<!--
## Additional resources

- [Signing Release Artifacts Enhancement Proposal](https://github.com/kubernetes/enhancements/issues/3031)
-->
## 附加資源  {#additional-resources}
- [簽名發佈工件增強提案](https://github.com/kubernetes/enhancements/issues/3031)
