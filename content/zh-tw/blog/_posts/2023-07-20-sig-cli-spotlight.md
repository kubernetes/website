---
layout: blog
title: "聚焦 SIG CLI"
date: 2023-07-20
slug: sig-cli-spotlight-2023
---

<!--
layout: blog
title: "Spotlight on SIG CLI"
date: 2023-07-20
slug: sig-cli-spotlight-2023
canonicalUrl: https://www.kubernetes.dev/blog/2023/07/13/sig-cli-spotlight-2023/
-->

<!--
**Author**: Arpit Agrawal
-->
**作者**：Arpit Agrawal

**譯者**：Xin Li (Daocloud)

<!--
In the world of Kubernetes, managing containerized applications at
scale requires powerful and efficient tools. The command-line
interface (CLI) is an integral part of any developer or operator’s
toolkit, offering a convenient and flexible way to interact with a
Kubernetes cluster.
-->
在 Kubernetes 的世界中，大規模管理容器化應用程序需要強大而高效的工具。
命令行界面（CLI）是任何開發人員或操作人員工具包不可或缺的一部分，
其提供了一種方便靈活的方式與 Kubernetes 集羣交互。

<!--
SIG CLI plays a crucial role in improving the [Kubernetes
CLI](https://github.com/kubernetes/community/tree/master/sig-cli)
experience by focusing on the development and enhancement of
`kubectl`, the primary command-line tool for Kubernetes.
-->
SIG CLI 通過專注於 Kubernetes 主要命令行工具 `kubectl` 的開發和增強，
在改善 [Kubernetes CLI](https://github.com/kubernetes/community/tree/master/sig-cli)
體驗方面發揮着至關重要的作用。

<!--
In this SIG CLI Spotlight, Arpit Agrawal, SIG ContribEx-Comms team
member, talked with [Katrina Verey](https://github.com/KnVerey), Tech
Lead & Chair of SIG CLI,and [Maciej
Szulik](https://github.com/soltysh), SIG CLI Batch Lead, about SIG
CLI, current projects, challenges and how anyone can get involved.
-->
在本次 SIG CLI 聚焦中，SIG ContribEx-Comms 團隊成員 Arpit Agrawal 與
SIG CLI 技術主管兼主席 [Katrina Verey](https://github.com/KnVerey)
和 SIG CLI Batch 主管 [Maciej Szulik](https://github.com/soltysh)
討論了 SIG CLI 當前項目狀態和挑戰以及如何參與其中。

<!--
So, whether you are a seasoned Kubernetes enthusiast or just getting
started, understanding the significance of SIG CLI will undoubtedly
enhance your Kubernetes journey.
-->
因此，無論你是經驗豐富的 Kubernetes 愛好者還是剛剛入門，瞭解
SIG CLI 的重要性無疑將增強你的 Kubernetes 之旅。

<!--
## Introductions

**Arpit**: Could you tell us a bit about yourself, your role, and how
you got involved in SIG CLI?
-->
## 簡介

**Arpit**：你們能否向我們介紹一下你自己、你的角色以及你是如何參與 SIG CLI 的？

<!--
**Maciej**: I’m one of the technical leads for SIG-CLI. I was working
on Kubernetes in multiple areas since 2014, and in 2018 I got
appointed a lead.
-->
**Maciej**：我是 SIG-CLI 的技術負責人之一。自 2014 年以來，我一直在多個領域從事
Kubernetes 工作，並於 2018 年被任命爲負責人。

<!--
**Katrina**: I’ve been working with Kubernetes as an end-user since
2016, but it was only in late 2019 that I discovered how well SIG CLI
aligned with my experience from internal projects. I started regularly
attending meetings and made a few small PRs, and by 2021 I was working
more deeply with the
[Kustomize](https://github.com/kubernetes-sigs/kustomize) team
specifically. Later that year, I was appointed to my current roles as
subproject owner for Kustomize and KRM Functions, and as SIG CLI Tech
Lead and Chair.
-->
**Katrina**：自 2016 年以來，我一直作爲最終用戶使用 Kubernetes，但直到 2019 年底，
我才發現 SIG CLI 與我在內部項目中的經驗非常吻合。我開始定期參加會議並提交了一些小型 PR，
到 2021 年，我專門與 [Kustomize](https://github.com/kubernetes-sigs/kustomize)
團隊進行了更深入的合作。同年晚些時候，我被任命擔任目前的職務，擔任 Kustomize 和
KRM Functions 的子項目 owner 以及 SIG CLI 技術主管和負責人。

<!--
## About SIG CLI

**Arpit**: Thank you! Could you share with us the purpose and goals of SIG CLI?
-->
## 關於 SIG CLI

**Arpit**：謝謝！你們能否與我們分享一下 SIG CLI 的宗旨和目標？

<!--
**Maciej**: Our
[charter](https://github.com/kubernetes/community/tree/master/sig-cli/)
has the most detailed description, but in few words, we handle all CLI
tooling that helps you manage your Kubernetes manifests and interact
with your Kubernetes clusters.
-->
**Maciej**：我們的[章程](https://github.com/kubernetes/community/tree/master/sig-cli/)有最詳細的描述，
但簡而言之，我們處理所有 CLI 工具，幫助你管理 Kubernetes 資源清單以及與 Kubernetes 集羣進行交互。

<!--
**Arpit**: I see. And how does SIG CLI work to promote best-practices
for CLI development and usage in the cloud native ecosystem?
-->
**Arpit**：我明白了。請問 SIG CLI 如何致力於推廣雲原生生態系統中 CLI 開發和使用的最佳實踐？

<!--
**Maciej**: Within `kubectl`, we have several on-going efforts that
try to encourage new contributors to align existing commands to new
standards. We publish several libraries which hopefully make it easier
to write CLIs that interact with Kubernetes APIs, such as cli-runtime
and
[kyaml](https://github.com/kubernetes-sigs/kustomize/tree/master/kyaml).
-->
**Maciej**：在 `kubectl` 中，我們正在進行多項努力，試圖鼓勵新的貢獻者將現有命令與新標準保持一致。
我們發佈了幾個庫，希望能夠更輕鬆地編寫與 Kubernetes API 交互的 CLI，例如 cli-runtime 和
[kyaml](https://github.com/kubernetes-sigs/kustomize/tree/master/kyaml)。

<!--
**Katrina**: We also maintain some interoperability specifications for
CLI tooling, such as the [KRM Functions
Specification](https://github.com/kubernetes-sigs/kustomize/blob/master/cmd/config/docs/api-conventions/functions-spec.md)
(GA) and the new ApplySet
Specification
(alpha).
-->
**Katrina**：我們還維護一些 CLI 工具的互操作性規範，例如
[KRM 函數規範](https://github.com/kubernetes-sigs/kustomize/blob/master/cmd/config/docs/api-conventions/functions-spec.md)（GA）
和新的 ApplySet 規範（Alpha）。

<!--
## Current projects and challenges

**Arpit**: Going through the README file, it’s clear SIG CLI has a
number of subprojects, could you highlight some important ones?
-->
## 當前的項目和挑戰

**Arpit**：閱讀了一遍 README 文件，發現 SIG CLI 有許多子項目，你能突出講一些重要的子項目嗎？

<!--
**Maciej**: The four most active subprojects that are, in my opinion,
worthy of your time investment would be:

* [`kubectl`](https://github.com/kubernetes/kubectl):  the canonical Kubernetes CLI.
* [Kustomize](https://github.com/kubernetes-sigs/kustomize): a
  template-free customization tool for Kubernetes yaml manifest files.
* [KUI](https://kui.tools) - a GUI interface to Kubernetes, think
   `kubectl` on steroids.
* [`krew`](https://github.com/kubernetes-sigs/krew): a plugin manager for `kubectl`.
-->
**Maciej**：在我看來，值得你投入時間的四個最活躍的子項目是：

* [`kubectl`](https://github.com/kubernetes/kubectl)：規範的 Kubernetes CLI。
* [Kustomize](https://github.com/kubernetes-sigs/kustomize)：Kubernetes yaml 清單文件的無模板定製工具。
* [KUI](https://kui.tools) - 一個針對 Kubernetes 的 GUI 界面，可以將其視爲增強版的 `kubectl`。
* [`krew`](https://github.com/kubernetes-sigs/krew)：`kubectl` 的插件管理器。

<!--
**Arpit**: Are there any upcoming initiatives or developments that SIG
CLI is working on?

**Maciej**: There are always several initiatives we’re working on at
any given point in time. It’s best to join [one of our
calls](https://github.com/kubernetes/community/tree/master/sig-cli/#meetings)
to learn about the current ones.
-->
**Arpit**：SIG CLI 是否有任何正在開展或即將開展的計劃或開發工作？

**Maciej**：在任何給定的時間點，我們總是在開展多項舉措。
最好加入[我們的一個電話會議](https://github.com/kubernetes/community/tree/master/sig-cli/#meetings)來了解當前的情況。

<!--
**Katrina**: For major features, you can check out [our open
KEPs](https://www.kubernetes.dev/resources/keps/). For instance, in
1.27 we introduced alphas for [a new pruning mode in kubectl
apply](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning/),
and for kubectl create plugins. Exciting ideas that are currently
under discussion include an interactive mode for `kubectl` delete
([KEP
3895](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning))
and the `kuberc` user preferences file ([KEP
3104](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning)).
-->
對於主要功能，你可以查看[我們的開放 KEP](https://www.kubernetes.dev/resources/keps/)。
例如，在 1.27 中，我們爲 [kubectl apply 中的新裁剪模式](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning/)
引入了新的 Alpha 特性，併爲 kubectl 添加了插件。
目前正在討論的令人興奮的想法包括 `kubectl` 刪除的交互模式（[KEP 3895](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning)）和
`kuberc` 用戶首選項文件（[KEP 3104](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning)）。

<!--
**Arpit**: Could you discuss any challenges that SIG CLI faces in its
efforts to improve CLIs for cloud-native technologies? What are the
future efforts to solve them?
-->
**Arpit**：你們能否說說 SIG CLI 在改善雲本地技術的 CLI 時面臨的任何挑戰？未來將採取哪些措施來解決這些問題？

<!--
**Katrina**: The biggest challenge we’re facing with every decision is
backwards compatibility and ensuring we don’t break existing users. It
frequently happens that fixing what's on the surface may seem
straightforward, but even fixing a bug could constitute a breaking
change for some users, which means we need to go through an extended
deprecation process to change it, or in some cases we can’t change it
at all. Another challenge is the need to balance customization with
usability in the flag sets we expose on our tools. For example, we get
many proposals for new flags that would certainly be useful to some
users, but not a large enough subset to justify the increased
complexity having them in the tool entails for everyone. The `kuberc`
proposal may help with some of these problems by giving individual
users the ability to set or override default values we can’t change,
and even create custom subcommands via aliases
-->
**Katrina**：我們每個決定面臨的最大挑戰是向後兼容性並確保我們不會影響現有用戶。
經常發生的情況是，修復表面上的內容似乎很簡單，但即使修復 bug 也可能對某些用戶造成破壞性更改，
這意味着我們需要經歷一個較長的棄用過程來更改它，或者在某些情況下我們不能完全改變它。
另一個挑戰是我們需要在工具上公開 flag 的平衡定製和可用性。例如，我們收到了許多關於新標誌的建議，
這些建議肯定對某些用戶有用，但沒有足夠大的子集來證明，將它們添加到工具中對每個用戶來說都會增加複雜性。
`kuberc` 提案可能會幫助個人用戶設置或覆蓋我們無法更改的默認值，甚至通過別名創建自定義子命令，
從而幫助解決其中一些問題。

<!--
**Arpit**: With every new version release of Kubernetes, maintaining
consistency and integrity is surely challenging: how does the SIG CLI
team tackle it?
-->
**Arpit**：隨着 Kubernetes 的每個新版本的發佈，保持一致性和完整性無疑是一項挑戰：
SIG CLI 團隊如何解決這個問題？

<!--
**Maciej**: This is mostly similar to the topic mentioned in the
previous question: every new change, especially to existing commands
goes through a lot of scrutiny to ensure we don’t break existing
users. At any point in time we have to keep a reasonable balance
between features and not breaking users.
-->
**Maciej**：這與上一個問題中提到的主題非常相似：每一個新的更改，尤其是對現有命令的更改，
都會經過大量的審查，以確保我們不會影響現有用戶。在任何時候我們都必須在功能和不影響用戶之間保持合理的平衡。

<!--
## Future plans and contribution

**Arpit**: How do you see the role of CLI tools in the cloud-native
ecosystem evolving in the future?
-->
## 未來計劃及貢獻

**Arpit**：你們如何看待 CLI 工具在未來雲原生生態系統中的作用？

<!--
**Maciej**: I think that CLI tools were and will always be an
important piece of the ecosystem. Whether used by administrators on
remote machines that don’t have GUI or in every CI/CD pipeline, they
are irreplaceable.
-->
**Maciej**：我認爲 CLI 工具曾經並將永遠是生態系統的重要組成部分。
無論是管理員在沒有 GUI 的遠程計算機上還是在每個 CI/CD 管道中使用，它們都是不可替代的。

<!--
**Arpit**: Kubernetes is a community-driven project. Any
recommendation for anyone looking into getting involved in SIG CLI
work? Where should they start? Are there any prerequisites?

**Maciej**: There are no prerequisites other than a little bit of free
time on your hands and willingness to learn something new :-)
-->
**Arpit**：Kubernetes 是一個社區驅動的項目。對於想要參與 SIG CLI 工作的人有什麼建議嗎？
他們應該從哪裏開始？有什麼先決條件嗎？

**Maciej**：除了有一點空閒時間和學習新東西的意願之外，沒有任何先決條件 :-)

<!--
**Katrina**: A working knowledge of [Go](https://go.dev/) often helps,
but we also have areas in need of non-code contributions, such as the
[Kustomize docs consolidation
project](https://github.com/kubernetes-sigs/kustomize/issues/4338).
-->
**Katrina**：[Go](https://go.dev/) 的實用知識通常會有所幫助，但我們也有需要非代碼貢獻的領域，
例如 [Kustomize 文檔整合項目](https://github.com/kubernetes-sigs/kustomize/issues/4338)。
