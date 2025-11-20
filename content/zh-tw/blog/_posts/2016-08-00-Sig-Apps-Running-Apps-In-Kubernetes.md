---
layout: blog
title: 'SIG Apps: 爲 Kubernetes 構建應用並在 Kubernetes 中進行運維'
date: 2016-08-16
slug: sig-apps-running-apps-in-kubernetes
---
<!--
title: " SIG Apps: build apps for and operate them in Kubernetes "
date: 2016-08-16
slug: sig-apps-running-apps-in-kubernetes
canonicalUrl: https://kubernetes.io/blog/2016/08/sig-apps-running-apps-in-kubernetes/
url: /blog/2016/08/Sig-Apps-Running-Apps-In-Kubernetes
-->

<!--
_Editor’s note: This post is by the Kubernetes SIG-Apps team sharing how they focus on the developer and devops experience of running applications in Kubernetes._  

Kubernetes is an incredible manager for containerized applications. Because of this, [numerous](https://kubernetes.io/blog/2016/02/sharethis-kubernetes-in-production) [companies](https://blog.box.com/blog/kubernetes-box-microservices-maximum-velocity/) [have](http://techblog.yahoo.co.jp/infrastructure/os_n_k8s/) [started](http://www.nextplatform.com/2015/11/12/inside-ebays-shift-to-kubernetes-and-containers-atop-openstack/) to run their applications in Kubernetes.  

Kubernetes Special Interest Groups ([SIGs](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig)) have been around to support the community of developers and operators since around the 1.0 release. People organized around networking, storage, scaling and other operational areas.  

As Kubernetes took off, so did the need for tools, best practices, and discussions around building and operating cloud native applications. To fill that need the Kubernetes [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) came into existence.  

SIG Apps is a place where companies and individuals can:
-->  

**編者注**：這篇文章由 Kubernetes SIG-Apps 團隊撰寫，分享他們如何關注在 Kubernetes
中運行應用的開發者和 devops 經驗。

Kubernetes 是容器化應用程式的出色管理者。因此，[衆多](https://kubernetes.io/blog/2016/02/sharethis-kubernetes-in-production)
[公司](https://blog.box.com/blog/kubernetes-box-microservices-maximum-velocity/)
[已經](http://techblog.yahoo.co.jp/infrastructure/os_n_k8s/)
[開始](http://www.nextplatform.com/2015/11/12/inside-ebays-shift-to-kubernetes-and-containers-atop-openstack/) 在 Kubernetes 中運行應用程式。

Kubernetes 特殊興趣小組 ([SIGs](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig))
自 1.0 版本開始就一直致力於支持開發者和運營商社區。圍繞網路、儲存、擴展和其他運營領域組織的人員。

隨着 Kubernetes 的興起，對工具、最佳實踐以及圍繞構建和運營雲原生應用程式的討論的需求也隨之增加。爲了滿足這一需求，
Kubernetes [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps) 應運而生。

SIG Apps 爲公司和個人提供以下支持：

<!--
- see and share demos of the tools being built to enable app operators
- learn about and discuss needs of app operators
- organize around efforts to improve the experience
- -->

- 查看和分享正在構建的、爲應用操作人員賦能的工具的演示
- 瞭解和討論應用運營人員的需求
- 組織各方努力改善體驗

<!--
Since the inception of SIG Apps we’ve had demos of projects like [KubeFuse](https://github.com/opencredo/kubefuse), [KPM](https://github.com/kubespray/kpm), and [StackSmith](https://stacksmith.bitnami.com/). We’ve also executed on a survey of those operating apps in Kubernetes.  

From the survey results we’ve learned a number of things including:
-->  

自從 SIG Apps 成立以來，我們已經進行了項目演示，例如 [KubeFuse](https://github.com/opencredo/kubefuse)、
[KPM](https://github.com/kubespray/kpm)，和 [StackSmith](https://stacksmith.bitnami.com/)。 
我們還對那些負責 Kubernetes 中應用運維的人進行了調查。

從調查結果中，我們學到了很多東西，包括：

<!--
- That 81% of respondents want some form of autoscaling
- To store secret information 47% of respondents use built-in secrets. At reset these are not currently encrypted. (If you want to help add encryption there is an [issue](https://github.com/kubernetes/kubernetes/issues/10439) for that.)&nbsp;
- The most responded questions had to do with 3rd party tools and debugging
- For 3rd party tools to manage applications there were no clear winners. There are a wide variety of practices
- An overall complaint about a lack of useful documentation. (Help contribute to the docs [here](https://github.com/kubernetes/kubernetes.github.io).)
- There’s a lot of data. Many of the responses were optional so we were surprised that 935 of all questions across all candidates were filled in. If you want to look at the data yourself it’s [available online](https://docs.google.com/spreadsheets/d/15SUL7QTpR4Flrp5eJ5TR8A5ZAFwbchfX2QL4MEoJFQ8/edit?usp=sharing).
-->

- 81% 的受訪者希望採用某種形式的自動擴縮
- 爲了儲存祕密資訊，47% 的受訪者使用內置 Secret。目前這些資料並未實現靜態加密。 
  （如果你需要關於加密的幫助，請參見[問題](https://github.com/kubernetes/kubernetes/issues/10439)。)
- 響應最多的問題與第三方工具和調試有關
- 對於管理應用程式的第三方工具，沒有明確的贏家。有各種各樣的做法
- 總體上對缺乏有用檔案有較多抱怨。（請在[此處](https://github.com/kubernetes/kubernetes.github.io)幫助提交文檔。）
- 資料量很大。很多回答是可選的，所以我們很驚訝所有候選人的所有問題中有 935 個都被填寫了。
  如果你想親自查看資料，可以[在線](https://docs.google.com/spreadsheets/d/15SUL7QTpR4Flrp5eJ5TR8A5ZAFwbchfX2QL4MEoJFQ8/edit?usp=sharing)查看。

<!--
When it comes to application operation there’s still a lot to be figured out and shared. If you've got opinions about running apps, tooling to make the experience better, or just want to lurk and learn about what's going please come join us.
-->  

就應用運維而言，仍然有很多東西需要解決和共享。如果你對運行應用程式有看法或者有改善體驗的工具，
或者只是想潛伏並瞭解狀況，請加入我們。

<!--
- Chat with us on SIG-Apps [Slack channel](https://kubernetes.slack.com/messages/sig-apps)
- Email as at SIG-Apps [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-apps)
- Join our open meetings: weekly at 9AM PT on Wednesdays, [full details here](https://github.com/kubernetes/community/blob/master/sig-apps/README.md#meeting).
-->

- 在 SIG-Apps [Slack 頻道](https://kubernetes.slack.com/messages/sig-apps)與我們聊天
- 發送郵件到 SIG-Apps [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-apps)
- 參加我們的公開會議：太平洋時間每週三上午 9 點，[詳情點擊此處](https://github.com/kubernetes/community/blob/master/sig-apps/README.md#meeting)

<!--
_--Matt Farina, Principal Engineer, Hewlett Packard Enterprise_
-->  
_--Matt Farina ，Hewlett Packard Enterprise 首席工程師_ 