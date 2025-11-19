---
layout: blog
title: "2023 中國 Kubernetes 貢獻者峯會簡要回顧"
slug: kcs-shanghai
date: 2023-10-20
---
<!--
layout: blog
title: "A Quick Recap of 2023 China Kubernetes Contributor Summit"
slug: kcs-shanghai
date: 2023-10-20
canonicalUrl: https://www.kubernetes.dev/blog/2023/10/20/kcs-shanghai/
-->

<!--
**Author:** Paco Xu and Michael Yao (DaoCloud)

On September 26, 2023, the first day of
[KubeCon + CloudNativeCon + Open Source Summit China 2023](https://www.lfasiallc.com/kubecon-cloudnativecon-open-source-summit-china/),
nearly 50 contributors gathered in Shanghai for the Kubernetes Contributor Summit.
-->
**作者：** Paco Xu 和 Michael Yao (DaoCloud)

2023 年 9 月 26 日，即
[KubeCon + CloudNativeCon + Open Source Summit China 2023](https://www.lfasiallc.com/kubecon-cloudnativecon-open-source-summit-china/)
第一天，近 50 位社區貢獻者濟濟一堂，在上海聚首 Kubernetes 貢獻者峯會。

<!--
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs04.jpeg" alt="All participants in the 2023 Kubernetes Contributor Summit" caption="All participants in the 2023 Kubernetes Contributor Summit" >}}
-->
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs04.jpeg" alt="2023 Kubernetes 貢獻者峯會與會者集體合影" caption="2023 Kubernetes 貢獻者峯會與會者集體合影" >}}

<!--
This marked the first in-person offline gathering held in China after three years of the pandemic.

## A joyful meetup

The event began with welcome speeches from [Kevin Wang](https://github.com/kevin-wangzefeng) from Huawei Cloud,
one of the co-chairs of KubeCon, and [Puja](https://github.com/puja108) from Giant Swarm.
-->
這是疫情三年之後，首次在中國本土召開的面對面線下聚會。

## 開心遇見

首先是本次 KubeCon 活動的聯席主席、來自華爲雲的 [Kevin Wang](https://github.com/kevin-wangzefeng)
和來自 Gaint Swarm 的 [Puja](https://github.com/puja108) 做了歡迎致辭。

<!--
Following the opening remarks, the contributors introduced themselves briefly. Most attendees were from China,
while some contributors had made the journey from Europe and the United States specifically for the conference.
Technical experts from companies such as Microsoft, Intel, Huawei, as well as emerging forces like DaoCloud,
were present. Laughter and cheerful voices filled the room, regardless of whether English was spoken with
European or American accents or if conversations were carried out in authentic Chinese language. This created
an atmosphere of comfort, joy, respect, and anticipation. Past contributions brought everyone closer, and
mutual recognition and accomplishments made this offline gathering possible.
-->
隨後在座的幾十位貢獻者分別做了簡單的自我介紹，80% 以上的與會者來自中國，還有一些貢獻者專程從歐美飛到上海蔘會。
其中不乏來自微軟、Intel、華爲的技術大咖，也有來自 DaoCloud 這樣的新銳中堅力量。
歡聲笑語齊聚一堂，無論是操着歐美口音的英語，還是地道的中國話，都在詮釋着舒心與歡暢，表達着尊敬和憧憬。
是曾經做出的貢獻拉近了彼此，是互相的肯定和成就賦予了這次線下聚會的可能。

<!--
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs06.jpeg" alt="Face to face meeting in Shanghai" caption="Face to face meeting in Shanghai" >}}
-->
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs06.jpeg" alt="Face to face meeting in Shanghai" caption="Face to face meeting in Shanghai" >}}

<!--
The attending contributors were no longer just GitHub IDs; they transformed into vivid faces.
From sitting together and capturing group photos to attempting to identify "Who is who,"
a loosely connected collective emerged. This team structure, although loosely knit and free-spirited,
was established to pursue shared dreams.

As the saying goes, "You reap what you sow." Each effort has been diligently documented within
the Kubernetes community contributions. Regardless of the passage of time, the community will
not erase those shining traces. Brilliance can be found in your PRs, issues, or comments.
It can also be seen in the smiling faces captured in meetup photos or heard through stories
passed down among contributors.
-->
與會的貢獻者不再是簡單的 GitHub ID，而是進階爲一個個鮮活的面孔，
從靜坐一堂，到合照留影，到尋覓彼此辨別 Who is Who 的那一刻起，我們事實上已形成了一個鬆散的集體。
這個 team 結構鬆散、自由開放，卻是爲了追逐夢想而成立。

一分耕耘一分收穫，每一份努力都已清晰地記錄在 Kubernetes 社區貢獻中。
無論時光如何流逝，社區中不會抹去那些發光的痕跡，璀璨可能是你的 PR、Issue 或 comments，
也可能是某次 Meetup 的合影笑臉，還可能是貢獻者口口相傳的故事。

<!--
## Technical sharing and discussions

Next, there were three technical sharing sessions:

- [sig-multi-cluster](https://github.com/kubernetes/community/blob/master/sig-multicluster/README.md):
  [Hongcai Ren](https://github.com/RainbowMango), a maintainer of Karmada, provided an introduction to
  the responsibilities and roles of this SIG. Their focus is on designing, discussing, implementing,
  and maintaining APIs, tools, and documentation related to multi-cluster management.
  Cluster Federation, one of Karmada's core concepts, is also part of their work.
-->
## 技術分享和討論

接下來是 3 個技術分享：

- [sig-multi-cluster](https://github.com/kubernetes/community/blob/master/sig-multicluster/README.md)：
  Karmada 的維護者 [Hongcai Ren](https://github.com/RainbowMango) 介紹了這個 SIG 的職責和作用。
  這個 SIG 負責設計、討論、實現和維護多叢集管理相關的 API、工具和文檔。
  其中涉及的 Cluster Federation 也是 Karmada 的核心概念之一。
<!--
- [helmfile](https://github.com/helmfile/helmfile): [yxxhero](https://github.com/yxxhero)
  from [GitLab](https://gitlab.cn/) presented how to deploy Kubernetes manifests declaratively,
  customize configurations, and leverage the latest features of Helm, including Helmfile.

- [sig-scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md):
  [william-wang](https://github.com/william-wang) from Huawei Cloud shared the recent updates and
  future plans of SIG Scheduling. This SIG is responsible for designing, developing, and testing
  components related to Pod scheduling.
-->
- [helmfile](https://github.com/helmfile/helmfile)：來自[極狐 GitLab](https://gitlab.cn/) 的
  [yxxhero](https://github.com/yxxhero) 介紹瞭如何聲明式部署 Kubernetes 清單，如何自定義設定，
  如何使用 Helm 的最新特性 Helmfile 等內容。
- [sig-scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md)：
  來自華爲雲的 [william-wang](https://github.com/william-wang) 介紹了
  [SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md)
  最近更新的特性以及未來的規劃。SIG Scheduling 負責設計、開發和測試 Pod 調度相關的組件。

<!--
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs03.jpeg" alt="A technical session about sig-multi-cluster" caption="A technical session about sig-multi-cluster" >}}
-->
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs03.jpeg" alt="有關 sig-multi-cluster 的技術主題演講" caption="有關 sig-multi-cluster 的技術主題演講" >}}

<!--
Following the sessions, a video featuring a call for contributors by [Sergey Kanzhelev](https://github.com/SergeyKanzhelev),
the SIG-Node Chair, was played. The purpose was to encourage more contributors to join the Kubernetes community,
with a special emphasis on the popular SIG-Node.

Lastly, Kevin hosted an Unconference collective discussion session covering topics such as
multi-cluster management, scheduling, elasticity, AI, and more. For detailed minutes of
the Unconference meeting, please refer to <https://docs.qq.com/doc/DY3pLWklzQkhjWHNT>.
-->
隨後播放了來自 SIG-Node Chair [Sergey Kanzhelev](https://github.com/SergeyKanzhelev)
的貢獻者招募視頻，希望更多貢獻者參與到 Kubernetes 社區，特別是社區熱門的 SIG-Node 方向。

最後，Kevin 主持了 Unconference 的集體討論活動，主要涉及到多叢集、調度、彈性、AI 等方向。
有關 Unconference 會議紀要，參閱 <https://docs.qq.com/doc/DY3pLWklzQkhjWHNT>

<!--
## China's contributor statistics

The contributor summit took place in Shanghai, with 90% of the attendees being Chinese.
Within the Cloud Native Computing Foundation (CNCF) ecosystem, contributions from China have been steadily increasing. Currently:

- Chinese contributors account for 9% of the total.
- Contributions from China make up 11.7% of the overall volume.
- China ranks second globally in terms of contributions.
-->
## 中國貢獻者數據

本次貢獻者峯會在上海舉辦，有 90% 的與會者爲華人。而在 CNCF 生態體系中，來自中國的貢獻數據也在持續增長，目前：

- 中國貢獻者佔比 9%
- 中國貢獻量佔比 11.7%
- 全球貢獻排名第 2

{{< note >}}
<!--
The data is from KubeCon keynotes by Chris Aniszczyk, CTO of Cloud Native Computing Foundation,
on September 26, 2023. This probably understates Chinese contributions. A lot of Chinese contributors
use VPNs and may not show up as being from China in the stats accurately.
-->
以上數據來自 CNCF 首席技術官 Chris Aniszczyk 在 2023 年 9 月 26 日 KubeCon 的主題演講。
另外，由於大量中國貢獻者使用 VPN 連接社區，這些統計數據可能與真實數據有所差異。
{{< /note >}}

<!--
The Kubernetes Contributor Summit is an inclusive meetup that welcomes all community contributors, including:

- New Contributors
- Current Contributors
  - docs
  - code
  - community management
- Subproject members
- Members of Special Interest Group (SIG) / Working Group (WG)
- Active Contributors
- Casual Contributors
-->
Kubernetes 貢獻者峯會是一個自由開放的 Meetup，歡迎社區所有貢獻者參與：

- 新人
- 老兵
  - 文檔
  - 代碼
  - 社區管理
- 子項目 Owner 和參與者
- 特別興趣小組（SIG）或工作小組（WG）人員
- 活躍的貢獻者
- 臨時貢獻者

<!--
## Acknowledgments

We would like to express our gratitude to the organizers of this event:

- [Kevin Wang](https://github.com/kevin-wangzefeng), the co-chair of KubeCon and the lead of the kubernetes contributor summit.
- [Paco Xu](https://github.com/pacoxu), who actively coordinated the venue, meals, invited contributors from both China and
  international sources, and established WeChat groups to collect agenda topics. They also shared details of the event
  before and after its occurrence through [pre and post announcements](https://github.com/kubernetes/community/issues/7510).
- [Mengjiao Liu](https://github.com/mengjiao-liu), who was responsible for organizing, coordinating,
  and facilitating various matters related to the summit.
-->
## 致謝

感謝本次活動的組織者：

- [Kevin Wang](https://github.com/kevin-wangzefeng) 是本次 KubeCon 活動的聯席主席，也是貢獻者峯會的負責人
- [Paco Xu](https://github.com/pacoxu) 積極聯絡場地餐食，聯繫和邀請國內外貢獻者，建立微信羣徵集議題，
  [會前會後公示活動細節](https://github.com/kubernetes/community/issues/7510)等
- [Mengjiao Liu](https://github.com/mengjiao-liu) 負責組織協調和聯絡事宜

<!--
We extend our appreciation to all the contributors who attended the China Kubernetes Contributor Summit in Shanghai.
Your dedication and commitment to the Kubernetes community are invaluable.
Together, we continue to push the boundaries of cloud native technology and shape the future of this ecosystem.
-->
我們衷心感謝所有參加在上海舉辦的中國 Kubernetes 貢獻者峯會的貢獻者們。
你們對 Kubernetes 社區的奉獻和承諾是無價之寶。
讓我們攜手共進，繼續推動雲原生技術的邊界，塑造這個生態系統的未來。
