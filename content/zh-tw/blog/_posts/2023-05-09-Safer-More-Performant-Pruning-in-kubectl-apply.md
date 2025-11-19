---
layout: blog
title: "Kubernetes 1.27：kubectl apply 裁剪更安全、更高效"
date: 2023-05-09
slug: introducing-kubectl-applyset-pruning
---
<!--
layout: blog
title: "Kubernetes 1.27: Safer, More Performant Pruning in kubectl apply"
date: 2023-05-09
slug: introducing-kubectl-applyset-pruning
-->

<!--
**Authors:** Katrina Verey (independent) and Justin Santa Barbara (Google)
-->
**作者:** Katrina Verey（獨立個人）和 Justin Santa Barbara (Google)

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
Declarative configuration management with the `kubectl apply` command is the gold standard approach
to creating or modifying Kubernetes resources. However, one challenge it presents is the deletion
of resources that are no longer needed. In Kubernetes version 1.5, the `--prune` flag was
introduced to address this issue, allowing kubectl apply to automatically clean up previously
applied resources removed from the current configuration.
-->
通過 `kubectl apply` 命令執行聲明式配置管理是創建或修改 Kubernetes 資源的黃金標準方法。
但這種方法也帶來了一個挑戰，那就是刪除不再需要的資源。
在 Kubernetes 1.5 版本中，引入了 `--prune` 標誌來解決此問題，
允許 `kubectl apply` 自動清理從當前配置中刪除的先前應用的資源。

<!--
Unfortunately, that existing implementation of `--prune` has design flaws that diminish its
performance and can result in unexpected behaviors. The main issue stems from the lack of explicit
encoding of the previously applied set by the preceding `apply` operation, necessitating
error-prone dynamic discovery. Object leakage, inadvertent over-selection of resources, and limited
compatibility with custom resources are a few notable drawbacks of this implementation. Moreover,
its coupling to client-side apply hinders user upgrades to the superior server-side apply
mechanism.
-->
然而，現有的 `--prune` 實現存在設計缺陷，會降低性能並導致意外行爲。
主要問題源於先前的 `apply` 操作未對已應用的集合進行顯式編碼，有必要進行易錯的動態發現。
對象泄漏、意外過度選擇資源以及與自定義資源的有限兼容性是這種實現的一些明顯缺點。
此外，其與客戶端 apply 的耦合阻礙了用戶升級到更優秀的服務器端 apply 方式。

<!--
Version 1.27 of `kubectl` introduces an alpha version of a revamped pruning implementation that
addresses these issues. This new implementation, based on a concept called _ApplySet_, promises
better performance and safety.
-->
`kubectl` 的 1.27 版本引入了 Alpha 版本的重構裁剪實現，解決了這些問題。
這個基於 **ApplySet** 概念的新實現承諾能夠提供更好的性能和更好的安全性。

<!--
An _ApplySet_ is a group of resources associated with a _parent_ object on the cluster, as
identified and configured through standardized labels and annotations. Additional standardized
metadata allows for accurate identification of ApplySet _member_ objects within the cluster,
simplifying operations like pruning.
-->
**ApplySet** 是一個與集羣上的**父**對象相關聯的資源組，通過標準化的標籤和註解進行標識和配置。
附加的標準化元數據允許準確標識集羣內的 ApplySet **成員**對象，簡化了裁剪等操作。

<!--
To leverage ApplySet-based pruning, set the `KUBECTL_APPLYSET=true` environment variable and include
the flags `--prune` and `--applyset` in your `kubectl apply` invocation:

```shell
KUBECTL_APPLYSET=true kubectl apply -f <directory/> --prune --applyset=<name>
```
-->
爲了充分利用基於 ApplySet 的裁剪，設置 `KUBECTL_APPLYSET=true` 環境變量，
並在 `kubectl apply` 調用中包括標誌 `--prune` 和 `--applyset`：

```shell
KUBECTL_APPLYSET=true kubectl apply -f <目錄> --prune --applyset=<name>
```

<!--
By default, ApplySet uses a Secret as the parent object. However, you can also use
a ConfigMap with the format `--applyset=configmaps/<name>`. If your desired Secret or
ConfigMap object does not yet exist, `kubectl` will create it for you. Furthermore, custom
resources can be enabled for use as ApplySet parent objects.
-->
默認情況下，ApplySet 使用 Secret 作爲父對象。
但是，你也可以通過格式 `--applyset=configmaps/<name>` 來使用 ConfigMap。
如果所需的 Secret 或 ConfigMap 對象尚不存在，則 `kubectl` 將爲你創建它。
此外，可以啓用自定義資源以用作 ApplySet 父對象。

<!--
The ApplySet implementation is based on a new low-level specification that can support higher-level
ecosystem tools by improving their interoperability. The lightweight nature of this specification
enables these tools to continue to use existing object grouping systems while opting in to
ApplySet's metadata conventions to prevent inadvertent changes by other tools (such as `kubectl`).
-->
ApplySet 實現基於新的底層規約，可以通過提高其互操作性來支持更高層次的生態系統工具。
這種規約的輕量性使得這些工具可以繼續使用現有的對象分組系統，
同時選用 ApplySet 的元數據約定以防被其他工具（例如 `kubectl`）意外更改。

<!--
ApplySet-based pruning offers a promising solution to the shortcomings of the previous `--prune`
implementation in `kubectl` and can help streamline your Kubernetes resource management. Please
give this new feature a try and share your experiences with the community—ApplySet is under active
development, and your feedback is invaluable!
-->
基於 ApplySet 的裁剪提供了一種方法，保證有效解決之前 `kubectl` 中 `--prune` 實現的缺陷，
還可以幫助優化 Kubernetes 資源管理。請使用這個新特性並與社區分享你的經驗。
ApplySet 正處於積極開發中，你的反饋至關重要！

<!--
### Additional resources

- For more information how to use ApplySet-based pruning, read
  [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/) in the Kubernetes documentation.
- For a deeper dive into the technical design of this feature or to learn how to implement the
  ApplySet specification in your own tools, refer to [KEP&nbsp;3659](https://git.k8s.io/enhancements/keps/sig-cli/3659-kubectl-apply-prune/README.md):
  _ApplySet: `kubectl apply --prune` redesign and graduation strategy_.
-->
### 更多資源

- 想了解如何使用基於 ApplySet 的裁剪，請閱讀 Kubernetes 文檔中的
  [使用配置文件以聲明方式管理 Kubernetes 對象](/zh-cn/docs/tasks/manage-kubernetes-objects/declarative-config/)。
- 如需更深入地瞭解此特性的技術設計或瞭解如何用你自己工具實現 ApplySet 規範，
  請參閱 [KEP-3659](https://git.k8s.io/enhancements/keps/sig-cli/3659-kubectl-apply-prune/README.md):
  **ApplySet: `kubectl apply --prune` 重新設計和進階策略**。

<!--
### How do I get involved?

If you want to get involved in ApplySet development, you can get in touch with the developers at
[SIG CLI](https://git.k8s.io/community/sig-cli). To provide feedback on the feature, please
[file a bug](https://github.com/kubernetes/kubectl/issues/new?assignees=knverey,justinsb&labels=kind%2Fbug&template=bug-report.md)
or [request an enhancement](https://github.com/kubernetes/kubectl/issues/new?assignees=knverey,justinsb&labels=kind%2Fbug&template=enhancement.md)
on the `kubernetes/kubectl` repository.
-->
### 如何參與

如果你想參與 ApplySet 的開發，可以聯繫 [SIG CLI](https://git.k8s.io/community/sig-cli) 的開發人員。
如需提供有關此特性的反饋，請在 `kubernetes/kubectl`
代碼庫上[提交 bug](https://github.com/kubernetes/kubectl/issues/new?assignees=knverey,justinsb&labels=kind%2Fbug&template=bug-report.md)
或[提出增強請求](https://github.com/kubernetes/kubectl/issues/new?assignees=knverey,justinsb&labels=kind%2Fbug&template=enhancement.md)。
