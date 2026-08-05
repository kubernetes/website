---
layout: blog
title: "2023 中国 Kubernetes 贡献者峰会简要回顾"
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
第一天，近 50 位社区贡献者济济一堂，在上海聚首 Kubernetes 贡献者峰会。

<!--
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs04.jpeg" alt="All participants in the 2023 Kubernetes Contributor Summit" caption="All participants in the 2023 Kubernetes Contributor Summit" >}}
-->
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs04.jpeg" alt="2023 Kubernetes 贡献者峰会与会者集体合影" caption="2023 Kubernetes 贡献者峰会与会者集体合影" >}}

<!--
This marked the first in-person offline gathering held in China after three years of the pandemic.

## A joyful meetup

The event began with welcome speeches from [Kevin Wang](https://github.com/kevin-wangzefeng) from Huawei Cloud,
one of the co-chairs of KubeCon, and [Puja](https://github.com/puja108) from Giant Swarm.
-->
这是疫情三年之后，首次在中国本土召开的面对面线下聚会。

## 开心遇见

首先是本次 KubeCon 活动的联席主席、来自华为云的 [Kevin Wang](https://github.com/kevin-wangzefeng)
和来自 Gaint Swarm 的 [Puja](https://github.com/puja108) 做了欢迎致辞。

<!--
Following the opening remarks, the contributors introduced themselves briefly. Most attendees were from China,
while some contributors had made the journey from Europe and the United States specifically for the conference.
Technical experts from companies such as Microsoft, Intel, Huawei, as well as emerging forces like DaoCloud,
were present. Laughter and cheerful voices filled the room, regardless of whether English was spoken with
European or American accents or if conversations were carried out in authentic Chinese language. This created
an atmosphere of comfort, joy, respect, and anticipation. Past contributions brought everyone closer, and
mutual recognition and accomplishments made this offline gathering possible.
-->
随后在座的几十位贡献者分别做了简单的自我介绍，80% 以上的与会者来自中国，还有一些贡献者专程从欧美飞到上海参会。
其中不乏来自微软、Intel、华为的技术大咖，也有来自 DaoCloud 这样的新锐中坚力量。
欢声笑语齐聚一堂，无论是操着欧美口音的英语，还是地道的中国话，都在诠释着舒心与欢畅，表达着尊敬和憧憬。
是曾经做出的贡献拉近了彼此，是互相的肯定和成就赋予了这次线下聚会的可能。

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
与会的贡献者不再是简单的 GitHub ID，而是进阶为一个个鲜活的面孔，
从静坐一堂，到合照留影，到寻觅彼此辨别 Who is Who 的那一刻起，我们事实上已形成了一个松散的集体。
这个 team 结构松散、自由开放，却是为了追逐梦想而成立。

一分耕耘一分收获，每一份努力都已清晰地记录在 Kubernetes 社区贡献中。
无论时光如何流逝，社区中不会抹去那些发光的痕迹，璀璨可能是你的 PR、Issue 或 comments，
也可能是某次 Meetup 的合影笑脸，还可能是贡献者口口相传的故事。

<!--
## Technical sharing and discussions

Next, there were three technical sharing sessions:

- [sig-multi-cluster](https://github.com/kubernetes/community/blob/master/sig-multicluster/README.md):
  [Hongcai Ren](https://github.com/RainbowMango), a maintainer of Karmada, provided an introduction to
  the responsibilities and roles of this SIG. Their focus is on designing, discussing, implementing,
  and maintaining APIs, tools, and documentation related to multi-cluster management.
  Cluster Federation, one of Karmada's core concepts, is also part of their work.
-->
## 技术分享和讨论

接下来是 3 个技术分享：

- [sig-multi-cluster](https://github.com/kubernetes/community/blob/master/sig-multicluster/README.md)：
  Karmada 的维护者 [Hongcai Ren](https://github.com/RainbowMango) 介绍了这个 SIG 的职责和作用。
  这个 SIG 负责设计、讨论、实现和维护多集群管理相关的 API、工具和文档。
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
- [helmfile](https://github.com/helmfile/helmfile)：来自[极狐 GitLab](https://gitlab.cn/) 的
  [yxxhero](https://github.com/yxxhero) 介绍了如何声明式部署 Kubernetes 清单，如何自定义配置，
  如何使用 Helm 的最新特性 Helmfile 等内容。
- [sig-scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md)：
  来自华为云的 [william-wang](https://github.com/william-wang) 介绍了
  [SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md)
  最近更新的特性以及未来的规划。SIG Scheduling 负责设计、开发和测试 Pod 调度相关的组件。

<!--
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs03.jpeg" alt="A technical session about sig-multi-cluster" caption="A technical session about sig-multi-cluster" >}}
-->
{{< figure src="/blog/2023/10/20/kcs-shanghai/kcs03.jpeg" alt="有关 sig-multi-cluster 的技术主题演讲" caption="有关 sig-multi-cluster 的技术主题演讲" >}}

<!--
Following the sessions, a video featuring a call for contributors by [Sergey Kanzhelev](https://github.com/SergeyKanzhelev),
the SIG-Node Chair, was played. The purpose was to encourage more contributors to join the Kubernetes community,
with a special emphasis on the popular SIG-Node.

Lastly, Kevin hosted an Unconference collective discussion session covering topics such as
multi-cluster management, scheduling, elasticity, AI, and more. For detailed minutes of
the Unconference meeting, please refer to <https://docs.qq.com/doc/DY3pLWklzQkhjWHNT>.
-->
随后播放了来自 SIG-Node Chair [Sergey Kanzhelev](https://github.com/SergeyKanzhelev)
的贡献者招募视频，希望更多贡献者参与到 Kubernetes 社区，特别是社区热门的 SIG-Node 方向。

最后，Kevin 主持了 Unconference 的集体讨论活动，主要涉及到多集群、调度、弹性、AI 等方向。
有关 Unconference 会议纪要，参阅 <https://docs.qq.com/doc/DY3pLWklzQkhjWHNT>

<!--
## China's contributor statistics

The contributor summit took place in Shanghai, with 90% of the attendees being Chinese.
Within the Cloud Native Computing Foundation (CNCF) ecosystem, contributions from China have been steadily increasing. Currently:

- Chinese contributors account for 9% of the total.
- Contributions from China make up 11.7% of the overall volume.
- China ranks second globally in terms of contributions.
-->
## 中国贡献者数据

本次贡献者峰会在上海举办，有 90% 的与会者为华人。而在 CNCF 生态体系中，来自中国的贡献数据也在持续增长，目前：

- 中国贡献者占比 9%
- 中国贡献量占比 11.7%
- 全球贡献排名第 2

{{< note >}}
<!--
The data is from KubeCon keynotes by Chris Aniszczyk, CTO of Cloud Native Computing Foundation,
on September 26, 2023. This probably understates Chinese contributions. A lot of Chinese contributors
use VPNs and may not show up as being from China in the stats accurately.
-->
以上数据来自 CNCF 首席技术官 Chris Aniszczyk 在 2023 年 9 月 26 日 KubeCon 的主题演讲。
另外，由于大量中国贡献者使用 VPN 连接社区，这些统计数据可能与真实数据有所差异。
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
Kubernetes 贡献者峰会是一个自由开放的 Meetup，欢迎社区所有贡献者参与：

- 新人
- 老兵
  - 文档
  - 代码
  - 社区管理
- 子项目 Owner 和参与者
- 特别兴趣小组（SIG）或工作小组（WG）人员
- 活跃的贡献者
- 临时贡献者

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
## 致谢

感谢本次活动的组织者：

- [Kevin Wang](https://github.com/kevin-wangzefeng) 是本次 KubeCon 活动的联席主席，也是贡献者峰会的负责人
- [Paco Xu](https://github.com/pacoxu) 积极联络场地餐食，联系和邀请国内外贡献者，建立微信群征集议题，
  [会前会后公示活动细节](https://github.com/kubernetes/community/issues/7510)等
- [Mengjiao Liu](https://github.com/mengjiao-liu) 负责组织协调和联络事宜

<!--
We extend our appreciation to all the contributors who attended the China Kubernetes Contributor Summit in Shanghai.
Your dedication and commitment to the Kubernetes community are invaluable.
Together, we continue to push the boundaries of cloud native technology and shape the future of this ecosystem.
-->
我们衷心感谢所有参加在上海举办的中国 Kubernetes 贡献者峰会的贡献者们。
你们对 Kubernetes 社区的奉献和承诺是无价之宝。
让我们携手共进，继续推动云原生技术的边界，塑造这个生态系统的未来。
