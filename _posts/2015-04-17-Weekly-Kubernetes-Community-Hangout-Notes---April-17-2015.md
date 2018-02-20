---
layout: blog
title: " Weekly Kubernetes Community Hangout Notes - April 17 2015 "
date:  Saturday, April 17, 2015
pagination:
  enabled: true
---
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.  

Agenda  

* Mesos Integration
* High Availability (HA)
* Adding performance and profiling details to e2e to track regressions
* Versioned clients

Notes  


* Mesos integration

    * Mesos integration proposal:

    * No blockers to integration.

    * Documentation needs to be updated.
* HA

    * Proposal should land today.

    * Etcd cluster.

    * Load-balance apiserver.

    * Cold standby for controller manager and other master components.
* Adding performance and profiling details to e2e to track regression

    * Want red light for performance regression

    * Need a public DB to post the data

        * See

    * Justin working on multi-platform e2e dashboard
* Versioned clients

    *

    *

    * Client library currently uses internal API objects.

    * Nobody reported that frequent changes to types.go have been painful, but we are worried about it.

    * Structured types are useful in the client. Versioned structs would be ok.

    * If start with json/yaml (kubectl), shouldn’t convert to structured types. Use swagger.
* Security context

    *

    * Administrators can restrict who can run privileged containers or require specific unix uids

    * Kubelet will be able to get pull credentials from apiserver

    * Policy proposal coming in the next week or so
* Discussing upstreaming of users, etc. into Kubernetes, at least as optional
* 1.0 Roadmap

    * Focus is performance, stability, cluster upgrades

    * TJ has been making some edits to [roadmap.md][4] but hasn’t sent out a PR yet
* Kubernetes UI

    * Dependencies broken out into third-party

    * @lavalamp is reviewer

Posted by  Unknown at  [3:27 PM][5] [ ![][6] ][7]

[Email This][8][BlogThis!][9][Share to Twitter][10][Share to Facebook][11][Share to Pinterest][12]

Labels: [community meetings][13], [containers][14], [docker][15], [k8s][16], [kubernetes][17], [open source][18]

#### No comments:

#### Post a Comment

[Newer Post][19] [Older Post][20] [Home][3]

Subscribe to: [Post Comments (Atom)][21]

## Subscribe To Blog

![][22] ![][23] Posts

[ ![][24] ][25] [ ![][26] ][27] [ ![][23] Atom ][28]

![][22] ![][23] Posts

![][22] ![][23] Comments

[ ![][24] ][29] [ ![][26] ][30] [ ![][23] Atom ][21]

![][22] ![][23] Comments

[ ![][31] ][32]

[@Kubernetesio][33] [View on GitHub][34] [#kubernetes-users][35] [Stack Overflow][36] [Download Kubernetes][37]

[ ![][31] ][38]

## Blog Archive

* [ ►  ][39] [ 2018 ][40] (7)
    * [ ►  ][39] [ January ][41] (7)
* [ ►  ][39] [ 2017 ][42] (53)
    * [ ►  ][39] [ December ][43] (4)
    * [ ►  ][39] [ November ][44] (6)
    * [ ►  ][39] [ October ][45] (8)
    * [ ►  ][39] [ September ][46] (4)
    * [ ►  ][39] [ August ][47] (3)
    * [ ►  ][39] [ July ][48] (2)
    * [ ►  ][39] [ June ][49] (1)
    * [ ►  ][39] [ May ][50] (5)
    * [ ►  ][39] [ April ][51] (3)
    * [ ►  ][39] [ March ][52] (6)
    * [ ►  ][39] [ February ][53] (5)
    * [ ►  ][39] [ January ][54] (6)
* [ ►  ][39] [ 2016 ][55] (91)
    * [ ►  ][39] [ December ][56] (8)
    * [ ►  ][39] [ November ][57] (6)
    * [ ►  ][39] [ October ][58] (7)
    * [ ►  ][39] [ September ][59] (7)
    * [ ►  ][39] [ August ][60] (6)
    * [ ►  ][39] [ July ][61] (19)
    * [ ►  ][39] [ June ][62] (3)
    * [ ►  ][39] [ May ][63] (2)
    * [ ►  ][39] [ April ][64] (9)
    * [ ►  ][39] [ March ][65] (13)
    * [ ►  ][39] [ February ][66] (7)
    * [ ►  ][39] [ January ][67] (4)
* [ ▼  ][39] [ 2015 ][68] (44)
    * [ ►  ][39] [ December ][69] (3)
    * [ ►  ][39] [ November ][70] (5)
    * [ ►  ][39] [ October ][71] (1)
    * [ ►  ][39] [ September ][72] (1)
    * [ ►  ][39] [ August ][73] (2)
    * [ ►  ][39] [ July ][74] (7)
    * [ ►  ][39] [ June ][75] (4)
    * [ ►  ][39] [ May ][76] (8)
    * [ ▼  ][39] [ April ][77] (9)
        * [Weekly Kubernetes Community Hangout Notes - April ...][78]
        * [Borg: The Predecessor to Kubernetes][79]
        * [Kubernetes and the Mesosphere DCOS][80]
        * [Weekly Kubernetes Community Hangout Notes - April ...][81]
        * [Introducing Kubernetes API Version v1beta3][82]
        * [Kubernetes Release: 0.15.0][83]
        * [Weekly Kubernetes Community Hangout Notes - April ...][84]
        * [Faster than a speeding Latte][85]
        * [Weekly Kubernetes Community Hangout Notes - April ...][86]
    * [ ►  ][39] [ March ][87] (4)

[ ![][31] ][88]

[ ![][31] ][89]

| -----|  
|  

  |  

  |  

Simple theme. Powered by [Blogger][90].

[ ![][31] ][91]

[1]: http://kubernetes.io/images/nav_logo.svg
[2]: http://kubernetes.io/docs/
[3]: http://blog.kubernetes.io/
[4]: https://github.com/GoogleCloudPlatform/kubernetes/blob/master/docs/roadmap.md
[5]: http://blog.kubernetes.io/2015/04/weekly-kubernetes-community-hangout_17.html "permanent link"
[6]: https://resources.blogblog.com/img/icon18_edit_allbkg.gif
[7]: https://www.blogger.com/post-edit.g?blogID=112706738355446097&postID=630924463010638300&from=pencil "Edit Post"
[8]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=630924463010638300&target=email "Email This"
[9]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=630924463010638300&target=blog "BlogThis!"
[10]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=630924463010638300&target=twitter "Share to Twitter"
[11]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=630924463010638300&target=facebook "Share to Facebook"
[12]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=630924463010638300&target=pinterest "Share to Pinterest"
[13]: http://blog.kubernetes.io/search/label/community%20meetings
[14]: http://blog.kubernetes.io/search/label/containers
[15]: http://blog.kubernetes.io/search/label/docker
[16]: http://blog.kubernetes.io/search/label/k8s
[17]: http://blog.kubernetes.io/search/label/kubernetes
[18]: http://blog.kubernetes.io/search/label/open%20source
[19]: http://blog.kubernetes.io/2015/04/kubernetes-and-mesosphere-dcos.html "Newer Post"
[20]: http://blog.kubernetes.io/2015/04/introducing-kubernetes-v1beta3.html "Older Post"
[21]: http://blog.kubernetes.io/feeds/630924463010638300/comments/default
[22]: https://img2.blogblog.com/img/widgets/arrow_dropdown.gif
[23]: https://img1.blogblog.com/img/icon_feed12.png
[24]: https://img1.blogblog.com/img/widgets/subscribe-netvibes.png
[25]: https://www.netvibes.com/subscribe.php?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2Fposts%2Fdefault
[26]: https://img1.blogblog.com/img/widgets/subscribe-yahoo.png
[27]: https://add.my.yahoo.com/content?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2Fposts%2Fdefault
[28]: http://blog.kubernetes.io/feeds/posts/default
[29]: https://www.netvibes.com/subscribe.php?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2F630924463010638300%2Fcomments%2Fdefault
[30]: https://add.my.yahoo.com/content?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2F630924463010638300%2Fcomments%2Fdefault
[31]: https://resources.blogblog.com/img/icon18_wrench_allbkg.png
[32]: //www.blogger.com/rearrange?blogID=112706738355446097&widgetType=Subscribe&widgetId=Subscribe1&action=editWidget§ionId=sidebar-right-1 "Edit"
[33]: https://twitter.com/kubernetesio
[34]: https://github.com/kubernetes/kubernetes
[35]: http://slack.k8s.io/
[36]: http://stackoverflow.com/questions/tagged/kubernetes
[37]: http://get.k8s.io/
[38]: //www.blogger.com/rearrange?blogID=112706738355446097&widgetType=HTML&widgetId=HTML2&action=editWidget§ionId=sidebar-right-1 "Edit"
[39]: javascript:void(0)
[40]: http://blog.kubernetes.io/2018/
[41]: http://blog.kubernetes.io/2018/01/
[42]: http://blog.kubernetes.io/2017/
[43]: http://blog.kubernetes.io/2017/12/
[44]: http://blog.kubernetes.io/2017/11/
[45]: http://blog.kubernetes.io/2017/10/
[46]: http://blog.kubernetes.io/2017/09/
[47]: http://blog.kubernetes.io/2017/08/
[48]: http://blog.kubernetes.io/2017/07/
[49]: http://blog.kubernetes.io/2017/06/
[50]: http://blog.kubernetes.io/2017/05/
[51]: http://blog.kubernetes.io/2017/04/
[52]: http://blog.kubernetes.io/2017/03/
[53]: http://blog.kubernetes.io/2017/02/
[54]: http://blog.kubernetes.io/2017/01/
[55]: http://blog.kubernetes.io/2016/
[56]: http://blog.kubernetes.io/2016/12/
[57]: http://blog.kubernetes.io/2016/11/
[58]: http://blog.kubernetes.io/2016/10/
[59]: http://blog.kubernetes.io/2016/09/
[60]: http://blog.kubernetes.io/2016/08/
[61]: http://blog.kubernetes.io/2016/07/
[62]: http://blog.kubernetes.io/2016/06/
[63]: http://blog.kubernetes.io/2016/05/
[64]: http://blog.kubernetes.io/2016/04/
[65]: http://blog.kubernetes.io/2016/03/
[66]: http://blog.kubernetes.io/2016/02/
[67]: http://blog.kubernetes.io/2016/01/
[68]: http://blog.kubernetes.io/2015/
[69]: http://blog.kubernetes.io/2015/12/
[70]: http://blog.kubernetes.io/2015/11/
[71]: http://blog.kubernetes.io/2015/10/
[72]: http://blog.kubernetes.io/2015/09/
[73]: http://blog.kubernetes.io/2015/08/
[74]: http://blog.kubernetes.io/2015/07/
[75]: http://blog.kubernetes.io/2015/06/
[76]: http://blog.kubernetes.io/2015/05/
[77]: http://blog.kubernetes.io/2015/04/
[78]: http://blog.kubernetes.io/2015/04/weekly-kubernetes-community-hangout_29.html
[79]: http://blog.kubernetes.io/2015/04/borg-predecessor-to-kubernetes.html
[80]: http://blog.kubernetes.io/2015/04/kubernetes-and-mesosphere-dcos.html
[81]: http://blog.kubernetes.io/2015/04/weekly-kubernetes-community-hangout_17.html
[82]: http://blog.kubernetes.io/2015/04/introducing-kubernetes-v1beta3.html
[83]: http://blog.kubernetes.io/2015/04/kubernetes-release-0150.html
[84]: http://blog.kubernetes.io/2015/04/weekly-kubernetes-community-hangout_11.html
[85]: http://blog.kubernetes.io/2015/04/faster-than-speeding-latte.html
[86]: http://blog.kubernetes.io/2015/04/weekly-kubernetes-community-hangout.html
[87]: http://blog.kubernetes.io/2015/03/
[88]: //www.blogger.com/rearrange?blogID=112706738355446097&widgetType=BlogArchive&widgetId=BlogArchive1&action=editWidget§ionId=sidebar-right-1 "Edit"
[89]: //www.blogger.com/rearrange?blogID=112706738355446097&widgetType=HTML&widgetId=HTML1&action=editWidget§ionId=sidebar-right-1 "Edit"
[90]: https://www.blogger.com
[91]: //www.blogger.com/rearrange?blogID=112706738355446097&widgetType=Attribution&widgetId=Attribution1&action=editWidget§ionId=footer-3 "Edit"

  [*[3:27 PM]: 2015-04-17T15:27:00-07:00
