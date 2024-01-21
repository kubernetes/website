---
layout: blog
title: "dl.k8s.io 采用内容分发网络（CDN）"
date: 2023-06-09
slug: dl-adopt-cdn
---

<!--
layout: blog
title: "dl.k8s.io to adopt a Content Delivery Network"
date: 2023-06-09
slug: dl-adopt-cdn
-->

<!--
**Authors**: Arnaud Meukam (VMware), Hannah Aubry (Fast Forward), Frederico
Muñoz (SAS Institute)
-->
**作者**：Arnaud Meukam (VMware), Hannah Aubry (Fast Forward), Frederico Muñoz (SAS Institute)

**译者**：[Xin Li](https://github.com/my-git9) (Daocloud)

<!--
We're happy to announce that dl.k8s.io, home of the official Kubernetes
binaries, will soon be powered by [Fastly](https://www.fastly.com).

Fastly is known for its high-performance content delivery network (CDN) designed
to deliver content quickly and reliably around the world. With its powerful
network, Fastly will help us deliver official Kubernetes binaries to users
faster and more reliably than ever before.
-->
我们很高兴地宣布，官方 Kubernetes 二进制文件的主页 dl.k8s.io 很快将由
[Fastly](https://www.fastly.com) 提供支持。

Fastly 以其高性能内容分发网络（CDN）而闻名，
该网络旨在全球范围内快速可靠地分发内容。凭借其强大的网络，Fastly
将帮助我们实现比以往更快、更可靠地向用户分发官方 Kubernetes 二进制文件。

<!--
The decision to use Fastly was made after an extensive evaluation process in
which we carefully evaluated several potential content delivery network
providers. Ultimately, we chose Fastly because of their commitment to the open
internet and proven track record of delivering fast and secure digital
experiences to some of the most known open source projects (through their [Fast
Forward](https://www.fastly.com/fast-forward) program).
-->
使用 Fastly 是在经过广泛的评估过程后做出的决定，
在该过程中我们仔细评估了几个潜在的内容分发网络提供商。最终，我们选择
Fastly 是因为他们对开放互联网的承诺以及在为一些著名的开源项目（通过他们的
[Fast Forward](https://www.fastly.com/fast-forward)
计划）提供快速和安全的数字体验方面的良好记录。

<!--
## What you need to know about this change

- On Monday, July 24th, the IP addresses and backend storage associated with the
  dl.k8s.io domain name will change.
- The change will not impact the vast majority of users since the domain
  name will remain the same.
- If you restrict access to specific IP ranges, access to the dl.k8s.io domain
  could stop working.
-->
## 关于本次更改你需要了解的信息

- 7 月 24 日星期一，与 dl.k8s.io 域名关联的 IP 地址和后端存储将发生变化。
- 由于域名将保持不变，因此更改不会影响绝大多数用户。
- 如果你限制对特定 IP 范围的访问，则对 dl.k8s.io 域的访问可能会停止工作。

<!--
If you think you may be impacted or want to know more about this change,
please keep reading.
-->
如果你认为你可能会受到影响或想了解有关此次更改的更多信息，请继续阅读。

<!--
## Why are we making this change

The official Kubernetes binaries site, dl.k8s.io, is used by thousands of users
all over the world, and currently serves _more than 5 petabytes of binaries each
month_. This change will allow us to improve access to those resources by
leveraging a world-wide CDN.
-->
## 我们为什么要进行此更改

官方 Kubernetes 二进制文件网站 dl.k8s.io 被全世界成千上万的用户使用，
目前**每月提供超过 5 PB 的二进制文件服务**。本次更改将通过充分利用全球
CDN 来改善对这些资源的访问。

<!--
## Does this affect dl.k8s.io only, or are other domains also affected?

Only dl.k8s.io will be affected by this change.
-->
## 这只影响 dl.k8s.io，还是其他域也受到影响？

只有 dl.k8s.io 会受到本次变更的影响。

<!--
## My company specifies the domain names that we are allowed to be accessed. Will this change affect the domain name?

No, the domain name (`dl.k8s.io`) will remain the same: no change will be
necessary, and access to the Kubernetes release binaries site should not be
affected.
-->
## 我公司规定了允许我们访问的域名，此更改会影响域名吗？

不，域名（`dl.k8s.io`）将保持不变：无需更改，不会影响对 Kubernetes
发布二进制文件站点的访问。

<!--
## My company uses some form of IP filtering. Will this change affect access to the site?

If IP-based filtering is in place, it’s possible that access to the site will be
affected when the new IP addresses become active.
-->
## 我的公司使用某种形式的 IP 过滤，此更改会影响对站点的访问吗？

如果已经存在基于 IP 的过滤，则当新 IP 地址变为活动状态时，对站点的访问可能会受到影响。

<!--
## If my company doesn’t use IP addresses to restrict network traffic, do we need to do anything?

No, the switch to the CDN should be transparent.
-->
## 如果我的公司不使用 IP 地址来限制网络流量，我们需要做些什么吗？

不，切换到 CDN 的过程应该是透明的。

<!--
## Will there be a dual running period?

**No, it is a cutover.** You can, however, test your networks right now to check
if they can route to the new public IP addresses from Fastly.  You should add
the new IPs to your network's `allowlist` before July 24th. Once the transfer is
complete, ensure your networks use the new IP addresses to connect to
the `dl.k8s.io` service.
-->
## 会有双运行期吗？

**不，这是切换。** 但是，你现在可以测试你的网络，检查它们是否可以从 Fastly
路由到新的公共 IP 地址。 你应该在 7 月 24 日之前将新 IP 添加到你网络的 `allowlist`（白名单）中。
切换完成后，确保你的网络使用新的 IP 地址连接到 `dl.k8s.io` 服务。

<!--
## What are the new IP addresses?

If you need to manage an allow list for downloads, you can get the ranges to
match from the Fastly API, in JSON: [public IP address
ranges](https://api.fastly.com/public-ip-list).  You don't need any credentials
to download that list of ranges.
-->
## 新 IP 地址是什么？

如果你需要管理下载允许列表，你可以从 Fastly API 中获取需要匹配的范围，
JSON 格式地址：[公共 IP 地址范围](https://api.fastly.com/public-ip-list)。

你不需要任何凭据即可下载该范围列表。

<!--
## What next steps would you recommend?

If you have IP-based filtering in place, we recommend the following course of
action **before July, 24th**:
-->
## 推荐哪些后续操作？

如果你已经有了基于 IP 的过滤，我们建议你**在 7 月 24 日**之前采取以下行动：

<!--
- Add the new IP addresses to your allowlist.
- Conduct tests with your networks/firewall to ensure your networks can route to
  the new IP addresses.

After the change is made, we recommend double-checking that HTTP calls are
accessing dl.k8s.io with the new IP addresses.
-->
- 将新的 IP 地址添加到你的白名单。
- 对你的网络/防火墙进行测试，以确保你的网络可以路由到新的 IP 地址。

进行更改后，我们建议仔细检查 HTTP 调用是否正在使用新 IP 地址访问 dl.k8s.io。

<!--
## What should I do if I detect some abnormality after the cutover date?

If you encounter any weirdness during binaries download, please [open an
issue](https://github.com/kubernetes/k8s.io/issues/new/choose).
-->
## 切换后发现异常怎么办？

如果你在二进制文件下载过程中遇到任何异常，
请[提交 Issue](https://github.com/kubernetes/k8s.io/issues/new/choose)。
