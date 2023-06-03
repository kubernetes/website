---
title: 官方 CVE 订阅源
linkTitle: CVE feed
weight: 25
layout: cve-feed
---
<!--
title: Official CVE Feed
linkTitle: CVE feed
weight: 25
outputs:
  - json
  - html
  - rss
layout: cve-feed
-->

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

<!--
This is a community maintained list of official CVEs announced by
the Kubernetes Security Response Committee. See
[Kubernetes Security and Disclosure Information](/docs/reference/issues-security/security/)
for more details.

The Kubernetes project publishes a programmatically accessible feed of published
security issues in [JSON feed](/docs/reference/issues-security/official-cve-feed/index.json)
and [RSS feed](/docs/reference/issues-security/official-cve-feed/feed.xml)
formats. You can access it by executing the following commands:
-->
这是由 Kubernetes 安全响应委员会（Security Response Committee, SRC）公布的经社区维护的官方 CVE 列表。
更多细节请参阅 [Kubernetes 安全和信息披露](/zh-cn/docs/reference/issues-security/security/)。

Kubernetes 项目以 [JSON Feed](/docs/reference/issues-security/official-cve-feed/index.json)
和 [RSS feed](/docs/reference/issues-security/official-cve-feed/feed.xml)
格式就已发布的安全问题提供了可通过程序访问的提要。 
你可以通过执行以下命令来查阅这些安全问题：

{{< tabs name="CVE feeds" >}}
{{% tab name="JSON feed" %}}
<!--
[Link to JSON format](/docs/reference/issues-security/official-cve-feed/index.json)
-->
[链接到 JSON 格式](/docs/reference/issues-security/official-cve-feed/index.json)

```shell
curl -Lv https://k8s.io/docs/reference/issues-security/official-cve-feed/index.json
```

{{% /tab %}}
{{% tab name="RSS feed" %}}
<!--
[Link to RSS format](/docs/reference/issues-security/official-cve-feed/feed.xml)
-->
[链接到 RSS 格式](/docs/reference/issues-security/official-cve-feed/feed.xml)

```shell
curl -Lv https://k8s.io/docs/reference/issues-security/official-cve-feed/feed.xml
```
{{% /tab %}}
{{< /tabs >}}

{{< cve-feed >}}

<!-- | CVE ID      | Issue Summary | CVE GitHub Issue URL |
| ----------- | ----------- | --------- |
| [CVE-2021-25741](https://www.cve.org/CVERecord?id=CVE-2021-25741)      | Symlink Exchange Can Allow Host Filesystem Access | [#104980](https://github.com/kubernetes/kubernetes/issues/104980) |
| [CVE-2020-8565](https://www.cve.org/CVERecord?id=CVE-2020-8565)      | Incomplete fix for CVE-2019-11250 allows for token leak in logs when logLevel >= 9 | [#95623](https://github.com/kubernetes/kubernetes/issues/95623) | -->

<!--
This feed is auto-refreshing with a noticeable but small lag (minutes to hours)
from the time a CVE is announced to the time it is accessible in this feed.

The source of truth of this feed is a set of GitHub Issues, filtered by a controlled and
restricted label `official-cve-feed`. The raw data is stored in a Google Cloud
Bucket which is writable only by a small number of trusted members of the
Community.
-->
此订阅源会自动刷新，但从宣布 CVE 到可在此订阅源中找到对应的 CVE 会有一个明显却很小的延迟（几分钟到几小时）。

此订阅源的真实来源是一组 GitHub Issue，通过受控和受限的标签 `official-cve-feed` 进行过滤。
原始数据存放在 Google Cloud Bucket 中，只有社区少数受信任的成员可以写入。
