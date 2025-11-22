---
layout: blog
title: "dl.k8s.io 採用內容分發網路（CDN）"
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

**譯者**：[Xin Li](https://github.com/my-git9) (Daocloud)

<!--
We're happy to announce that dl.k8s.io, home of the official Kubernetes
binaries, will soon be powered by [Fastly](https://www.fastly.com).

Fastly is known for its high-performance content delivery network (CDN) designed
to deliver content quickly and reliably around the world. With its powerful
network, Fastly will help us deliver official Kubernetes binaries to users
faster and more reliably than ever before.
-->
我們很高興地宣佈，官方 Kubernetes 二進制檔案的主頁 dl.k8s.io 很快將由
[Fastly](https://www.fastly.com) 提供支持。

Fastly 以其高性能內容分發網路（CDN）而聞名，
該網路旨在全球範圍內快速可靠地分發內容。憑藉其強大的網路，Fastly
將幫助我們實現比以往更快、更可靠地向使用者分發官方 Kubernetes 二進制檔案。

<!--
The decision to use Fastly was made after an extensive evaluation process in
which we carefully evaluated several potential content delivery network
providers. Ultimately, we chose Fastly because of their commitment to the open
internet and proven track record of delivering fast and secure digital
experiences to some of the most known open source projects (through their [Fast
Forward](https://www.fastly.com/fast-forward) program).
-->
使用 Fastly 是在經過廣泛的評估過程後做出的決定，
在該過程中我們仔細評估了幾個潛在的內容分發網路提供商。最終，我們選擇
Fastly 是因爲他們對開放互聯網的承諾以及在爲一些著名的開源項目（通過他們的
[Fast Forward](https://www.fastly.com/fast-forward)
計劃）提供快速和安全的數字體驗方面的良好記錄。

<!--
## What you need to know about this change

- On Monday, July 24th, the IP addresses and backend storage associated with the
  dl.k8s.io domain name will change.
- The change will not impact the vast majority of users since the domain
  name will remain the same.
- If you restrict access to specific IP ranges, access to the dl.k8s.io domain
  could stop working.
-->
## 關於本次更改你需要了解的資訊

- 7 月 24 日星期一，與 dl.k8s.io 域名關聯的 IP 地址和後端儲存將發生變化。
- 由於域名將保持不變，因此更改不會影響絕大多數使用者。
- 如果你限制對特定 IP 範圍的訪問，則對 dl.k8s.io 域的訪問可能會停止工作。

<!--
If you think you may be impacted or want to know more about this change,
please keep reading.
-->
如果你認爲你可能會受到影響或想了解有關此次更改的更多資訊，請繼續閱讀。

<!--
## Why are we making this change

The official Kubernetes binaries site, dl.k8s.io, is used by thousands of users
all over the world, and currently serves _more than 5 petabytes of binaries each
month_. This change will allow us to improve access to those resources by
leveraging a world-wide CDN.
-->
## 我們爲什麼要進行此更改

官方 Kubernetes 二進制檔案網站 dl.k8s.io 被全世界成千上萬的使用者使用，
目前**每月提供超過 5 PB 的二進制檔案服務**。本次更改將通過充分利用全球
CDN 來改善對這些資源的訪問。

<!--
## Does this affect dl.k8s.io only, or are other domains also affected?

Only dl.k8s.io will be affected by this change.
-->
## 這隻影響 dl.k8s.io，還是其他域也受到影響？

只有 dl.k8s.io 會受到本次變更的影響。

<!--
## My company specifies the domain names that we are allowed to be accessed. Will this change affect the domain name?

No, the domain name (`dl.k8s.io`) will remain the same: no change will be
necessary, and access to the Kubernetes release binaries site should not be
affected.
-->
## 我公司規定了允許我們訪問的域名，此更改會影響域名嗎？

不，域名（`dl.k8s.io`）將保持不變：無需更改，不會影響對 Kubernetes
發佈二進制檔案站點的訪問。

<!--
## My company uses some form of IP filtering. Will this change affect access to the site?

If IP-based filtering is in place, it’s possible that access to the site will be
affected when the new IP addresses become active.
-->
## 我的公司使用某種形式的 IP 過濾，此更改會影響對站點的訪問嗎？

如果已經存在基於 IP 的過濾，則當新 IP 地址變爲活動狀態時，對站點的訪問可能會受到影響。

<!--
## If my company doesn’t use IP addresses to restrict network traffic, do we need to do anything?

No, the switch to the CDN should be transparent.
-->
## 如果我的公司不使用 IP 地址來限制網路流量，我們需要做些什麼嗎？

不，切換到 CDN 的過程應該是透明的。

<!--
## Will there be a dual running period?

**No, it is a cutover.** You can, however, test your networks right now to check
if they can route to the new public IP addresses from Fastly.  You should add
the new IPs to your network's `allowlist` before July 24th. Once the transfer is
complete, ensure your networks use the new IP addresses to connect to
the `dl.k8s.io` service.
-->
## 會有雙運行期嗎？

**不，這是切換。** 但是，你現在可以測試你的網路，檢查它們是否可以從 Fastly
路由到新的公共 IP 地址。 你應該在 7 月 24 日之前將新 IP 添加到你網路的 `allowlist`（白名單）中。
切換完成後，確保你的網路使用新的 IP 地址連接到 `dl.k8s.io` 服務。

<!--
## What are the new IP addresses?

If you need to manage an allow list for downloads, you can get the ranges to
match from the Fastly API, in JSON: [public IP address
ranges](https://api.fastly.com/public-ip-list).  You don't need any credentials
to download that list of ranges.
-->
## 新 IP 地址是什麼？

如果你需要管理下載允許列表，你可以從 Fastly API 中獲取需要匹配的範圍，
JSON 格式地址：[公共 IP 地址範圍](https://api.fastly.com/public-ip-list)。

你不需要任何憑據即可下載該範圍列表。

<!--
## What next steps would you recommend?

If you have IP-based filtering in place, we recommend the following course of
action **before July, 24th**:
-->
## 推薦哪些後續操作？

如果你已經有了基於 IP 的過濾，我們建議你**在 7 月 24 日**之前採取以下行動：

<!--
- Add the new IP addresses to your allowlist.
- Conduct tests with your networks/firewall to ensure your networks can route to
  the new IP addresses.

After the change is made, we recommend double-checking that HTTP calls are
accessing dl.k8s.io with the new IP addresses.
-->
- 將新的 IP 地址添加到你的白名單。
- 對你的網路/防火牆進行測試，以確保你的網路可以路由到新的 IP 地址。

進行更改後，我們建議仔細檢查 HTTP 調用是否正在使用新 IP 地址訪問 dl.k8s.io。

<!--
## What should I do if I detect some abnormality after the cutover date?

If you encounter any weirdness during binaries download, please [open an
issue](https://github.com/kubernetes/k8s.io/issues/new/choose).
-->
## 切換後發現異常怎麼辦？

如果你在二進制檔案下載過程中遇到任何異常，
請[提交 Issue](https://github.com/kubernetes/k8s.io/issues/new/choose)。
