---
title: 中文字地化樣式指南
content_type: concept
---

<!-- overview -->

本節詳述文件中文字地化過程中須注意的事項。
這裡列舉的內容包含了**中文字地化小組**早期給出的指導性建議和後續實踐過程中積累的經驗。
在閱讀、貢獻、評閱中文字地化文件的過程中，如果對本文的指南有任何改進建議，
都請直接提出 PR。我們歡迎任何形式的補充和更正！

<!-- body -->

## 一般規定

本節列舉一些譯文中常見問題和約定。

### 英文原文的保留

為便於譯文審查和變更追蹤，所有中文字地化 Markdown 檔案中都應使用 HTML 註釋
`<!--` 和 `-->` 將英文原文逐段註釋起來，後跟對應中文譯文。例如：

```
<!--
This is English text ... 
-->
中文譯文對應 ...
```

不建議採用下面的方式註釋英文段落，除非英文段落非常非常短：

```
<!-- This is English text ...  -->
中文譯文對應 ...

```

無論英文原文或者中文譯文中，都不要保留過多的、不必要的空白行。

#### 段落劃分

請避免大段大段地註釋和翻譯。一般而言，每段翻譯可對應兩三個自然段。
段落過長會導致譯文很難評閱。但也不必每個段落都單獨翻譯。例如：

```
<!--
## Overview

### Concept

First paragraph, not very long.
-->
## 概述 {#overview}

### 概念 {#concept}

第一段落，不太長。
```

以下風格是不必要的：

```
<!--
## Overview
-->
## 概述 {#overview}

<!--
### Concept
-->
### 概念 {#concept}

<!--
First paragraph, not very long.
-->
第一段落，不太長。
```

#### 編號列表的處理

編號列表需要編號的連續性，處理不好的話可能導致輸出結果錯誤。
由於有些列表可能很長，一次性等將整個列表註釋掉再翻譯也不現實。
推薦採用下面的方式。

假定英文為：

```
1. Prepare something
1. Followed by a long step with code snippets and notes ...
   this is a really long item
1. Another long item ...
   .. continues here
1. Almost done ...
```

本地化處理：

```
<!--
1. Prepare something
-->
1. 準備工作，...
   這裡每行縮排 3 個空格

<!--
1. Followed by a long step with code snippets and notes ...
   this is a really long item
-->
2. 這裡是第二個編號，但需要顯式給出數字，不能沿用英文編號。
   縮排內容同上，3 個空格。
   即使有三個反引號的程式碼段或者短程式碼，都按 3 個空格縮排。

<!--
1. Another long item ...
   .. continues here
1. Almost done ...
-->
3. 繼續列表。

   如果條目有多個段落，也要
   保持縮排對齊以確保排版正確。

4. 列表終於結束
```

#### Frontmatter 的處理

頁面中的 Frontmatter 指的是檔案頭的兩個 `---` 中間的部分。
對這一部分，解析器有特殊處理，因此不能將英文部分放在前面，中文跟在後面。
需要將二者順序顛倒。如下所示：

```
---
title: 譯文標題
type: concept
weight: 30
---

<!--
title: English title
type: concept
reviewers:
  - john
  - doe
weight: 30
-->
```

這裡要注意的是：

- `title`、`description` 的內容要翻譯，其他欄位一般不必（甚至不可）翻譯。
- `reviewers` 部分要刪除，不然中文譯文會轉給英文作者來審閱。


#### 短程式碼（shortcode）處理

透過 HTML 註釋的短程式碼仍會被執行，因此需要額外小心。建議處理方式：

```
{{</* note */>}}
<!--
English text
-->
中文譯文
{{</* /note */>}}
```

{{< note >}}
現行風格與之前風格有些不同，這是因為較新的 Hugo 版本已經能夠正確處理短程式碼中的註釋段落。
保持註釋掉的英文與譯文都在短程式碼內更便於維護。
{{< /note >}}

### 譯與不譯

#### 資源名稱或欄位不譯

根據英文原文寫作風格約定【也在持續修訂改進】，對 Kubernetes 中的 API
資源均按其規範中所給的大小寫形式書寫，例如：英文中會使用 Deployment 而不是
deployment 來表示名為 "Deployment" 的 API 資源型別和物件例項。

對這類詞語，一般不應翻譯。

{{< note >}}
英文原文在這方面並不嚴謹，譯者或中文譯文的評閱者要非常留心。
比如 Secret 資源，很多時候被誤寫為 secret。
這時在本地化版本中一定不能譯為“秘密”，以免與原文的語義不符。
{{< /note >}}

#### 程式碼中的註釋

一般而言，程式碼中的註釋需要翻譯，包括存放在 `content/zh-cn/examples/`
目錄下的清單檔案中的註釋。


#### 出站連結

如果超級連結的目標是 Kubernetes 網站之外的純英文網頁，連結中的內容**可以**不翻譯。
例如：

```
<!--
Please check [installation caveats](https://acme.com/docs/v1/caveats) ...
-->
請參閱 [installation caveats](https://acme.com/docs/v1/caveats) ...
```

{{< note >}}
注意，這裡的 `installation` 與 `參閱` 之間留白，因為解析後屬於中英文混排的情況。
{{< /note >}}

### 標點符號

1. 譯文中標點符號要使用全形字元，除非以下兩種情況：

   - 標點符號是英文命令的一部分；
   - 標點符號是 Markdown 語法的一部分。

1. 英文排比句式中採用的逗號，在譯文中要使用頓號代替，以便符合中文書寫習慣。

## 更新譯文

由於整個文件站點會隨著 Kubernetes 專案的開發進展而演化，英文版本的網站內容會不斷更新。
鑑於中文站點的基本翻譯工作在 1.19 版本已完成，
從 1.20 版本開始本地化的工作會集中在追蹤英文內容變化上。

為確保準確跟蹤中文化版本與英文版本之間的差異，中文內容的 PR 所包含的每個頁面都必須是“最新的”。
這裡的“最新”指的是對應的英文頁面中的更改已全部同步到中文頁面。
如果某中文 PR 中包含對 `content/zh-cn/docs/foo/bar.md` 的更改，且檔案 `bar.md`
的上次更改日期是 `2020-10-01 01:02:03 UTC`，對應 GIT 標籤 `abcd1234`，
則 `bar.md` 應包含自 `abcd1234` 以來 `content/en/docs/foo/bar.md` 的所有變更，
否則視此 PR 為不完整 PR，會破壞我們對上游變更的跟蹤。

這一要求適用於所有更改，包括拼寫錯誤、格式更正、連結修訂等等。要檢視檔案
`bar.md` 上次提交以來發生的所有變更，可使用：

```
./scripts/lsync.sh content/zh-cn/docs/foo/bar.md
```

## 關於連結

### 連結錨點

英文 Markdown 中的各級標題會自動生成錨點，以便從其他頁面中連結。
在譯為中文後，相應的連結必然會失效。為防止這類問題，
建議在翻譯各級標題時，使用英文方式顯式給出連結錨點。例如：

```
<!--
### Create a Pod
-->
### 建立 Pod   {#create-a-pod}
```

此類問題對於概念部分的頁面最為突出，需要格外注意。


### 中文連結目標

由於大部分頁面已經完成中文字地化，這意味著很多連結可以使用中文版本作為目標。
例如：

```
<!--
For more information, please check [volumes](/docs/concepts/storage/)
...
-->
更多的資訊可參考[卷](/zh-cn/docs/concepts/storage/)頁面。
```

如果對應目標頁面尚未本地化，建議登記一個 Issue。

{{< note >}}
Website 的倉庫中 `scripts/linkchecker.py` 是一個工具，可用來檢查頁面中的連結。
例如，下面的命令檢查中文字地化目錄 `/content/zh-cn/docs/concepts/containers/`
中所有 Markdown 檔案中的連結合法性：

```shell
./scripts/linkchecker.py -l zh-cn -f /docs/concepts/containers/**/*.md
```
{{< /note >}}

## 排版格式

以下為譯文 Markdown 排版格式要求：

- 中英文之間留一個空格

  * 這裡的“英文”包括以英文呈現的超級連結
  * 這裡的中文、英文都**不包括**標點符號

- 譯文 Markdown 中不要使用長行，應適當斷行。

  * 可根據需要在 80-120 列斷行
  * 最好結合句子的邊界斷行，即一句話在一行，不必留幾個字轉到下一行
  * 不要在兩個中文字元中間斷行，因為這樣會造成中文字元中間顯示一個多餘空格，
    如果句子太長，可以從中文與非中文符號之間斷行
  * 超級連結文字一般較長，可獨立成行

- 英文原文中可能透過 `_text_` 或者 `*text*` 的形式用斜體突出部分字句。
  考慮到中文斜體字非常不美觀，在譯文中應改為 `**譯文**` 形式，
  即用雙引號語法生成加粗字句，實現突出顯示效果。

{{< warning >}}
我們注意到有些貢獻者可能使用了某種自動化工具，在 Markdown 英文原文中自動新增空格。
雖然這些工具可一定程度提高效率，仍然需要提請作者注意，某些工具所作的轉換可能是不對的，
例如將 `foo=bar` 轉換為 `foo = bar`、將 `），另一些文字` 轉換為 `） ，另一些文字` 等等，
甚至將超級連結中的半形井號（`#`）轉換為全形，導致連結失效。
{{< /warning >}}


## 特殊詞彙

英文中 "you" 翻譯成 "你"，不必翻譯為 "您" 以表現尊敬或謙卑。

### 術語拼寫

按中文譯文習慣，儘量不要在中文譯文中使用首字母小寫的拼寫。例如：

```
列舉所有 pods，檢視其建立時間 ...       [No]
列舉所有 Pod，檢視其建立時間 ...        [Yes]
```

**第一次**使用首字母縮寫時，應標註其全稱和中文譯文。例如：

```
你可以建立一個 Pod 干擾預算（Pod Disruption Budget，PDB）來解決這一問題。
所謂 PDB 實際上是 ...
```

對於某些特定於 Kubernetes 語境的術語，也應在**第一次**出現在頁面中時給出其英文原文，
以便讀者對照閱讀。例如：

```
映象策略（Image Policy）用來控制叢集可拉取的映象倉庫（Image Registry）源。
```

### 術語對照

本節列舉常見術語的統一譯法。除極個別情況，對於專業術語應使用本節所列舉的譯法：

- API Server，API 伺服器
- GA (general availability)，正式釋出
- addons，外掛
- admission controller，准入控制器
- affinity，親和性
- annotation，註解
- anti-affinity，反親和性
- attach，掛接
- autoscale，自動擴縮容
- bearer token，持有者令牌
- capabilities
  * 當泛指某主體執行某操作的能力時，可直譯為“能力”
  * 當特指 Linux 作業系統上的[許可權控制](http://man7.org/linux/man-pages/man7/capabilities.7.html)機制時，譯為“權能字”
- certificate authority，證書機構
- certificate，證書
- claim，申領
- cloud provider
  * 當用來指代下層雲服務的提供廠商時，譯為“雲服務供應商”
  * 當特指 Kubernetes 中對不同雲平臺的支援時，可酌情譯為“雲驅動”
- cluster，叢集
- condition
  * 大多數上下文中，可譯為“條件”
  * 在討論 Kubernetes 資源的 condition 時，應譯為“狀況”
- control loop，控制迴路
- control plane，控制平面，或控制面
- controller，控制器
- controller manager，控制器管理器
- credential，登入憑據，憑據
- custom，定製，或自定義
- daemon，守護程序
- dashboard，儀表板
- dependent，附屬或附屬者
- deprecated，已棄用的
- deprecation，棄用
- desired，預期的
- desired state，預期狀態
- detach，解除掛接
- distribution，發行版本
- disruption，干擾（請勿譯為“中斷”）
- drain，騰空
- endpoint，端點
- egress，出站
- evict，驅逐
- eviction，驅逐
- feature gate，特性門控
- federation，聯邦
- flags，命令列引數，引數
- grace period，寬限期限
- graceful termination，體面終止
- hairpin，髮夾
- hash，雜湊
- headless service，無頭服務
- healthcheck，健康檢查
- hook，回撥
- host，主機，宿主機
- hosting，託管
- idempotent，冪等的
- image，映象
- image registry，映象倉庫
- ingress，入站
- init container，Init 容器
- key
  * 在加密解密、安全認證上下文中，譯為金鑰
  * 在配置檔案、資料結構上下文中，譯為主鍵，或鍵
- label，標籤
- label selector，標籤選擇算符
- lifecycle，生命週期
- limit，限制，限值
- liveness probe，存活態探針
- load balance，負載均衡
- load balancer，負載均衡器
- log flush，清刷日誌資料
- loopback，本地迴路
- manifest，清單，清單檔案
- master node，主控節點
- metric
  * 用來指代被測量的資料來源時，譯為指標
  * 用來指代測量觀測結果時，譯為度量值
- mount，掛載
- namespace，名字空間，名稱空間
- orphans，孤立或孤立的
- override，覆寫
- owner，所有者，屬主
- pending，懸決的
- persistent volume，持久卷
- persistent volume claim，持久卷申領
- pipeline，流水線
- prerequisites，依賴，前提條件（根據上下文判斷）
- priority class，優先順序類
- probe，探針
- provision，供應
- pull，拉取
- push，推送
- quota，配額
- readiness probe，就緒態探針
- replica，副本
- repo，倉庫
- repository，倉庫
- revision，修訂版本
- role，角色
- role binding，角色繫結
- rolling update，滾動更新
- rollout，上線
- rotate，輪換
- round robin，輪轉
- runtime，執行時
- scale in/out，橫向縮容/擴容
- scale up/down，縱向擴容/縮容
- scale
  * 做動詞用時，譯為“擴縮”，或者“改變...的規模”
  * 做名詞用時，譯為“規模”
- scheduler，排程器
- service，服務
- service account，服務賬號
- service account token，服務賬號令牌
- service discovery，服務發現
- service mesh，服務網格
- session，會話
- sidecar，邊車
- skew，偏移
- spec，規約
- specification，規約
- startup probe，啟動探針
- stateless，無狀態的
- static pod，靜態 Pod
- stderr，標準錯誤輸出
- stdin，標準輸入
- stdout，標準輸出
- storage class，儲存類
- taint，汙點
- threshold，閾值
- toleration，容忍度
- topology，拓撲
- topology spread constraint，拓撲分佈約束
- traffic，流量
  * 在某些上下文中，可以根據情況譯為“服務請求”，“服務響應”
- unmount，解除安裝
- use case，用例，使用場景
- volume，卷
- worker node，工作節點
- workload，工作負載
