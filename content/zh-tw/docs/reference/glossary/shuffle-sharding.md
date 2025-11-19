---
title: 混排切片（Shuffle Sharding）
id: shuffle sharding
date: 2020-03-04
full_link:
short_description: >
  一種將請求指派給隊列的技術，其隔離性好過對隊列個數哈希取模的方式。

aka:
tags:
- fundamental
---

<!--
---
title: shuffle sharding
id: shuffle-sharding
date: 2020-03-04
full_link:
short_description: >
  A technique for assigning requests to queues that provides better isolation than hashing modulo the number of queues.

aka:
tags:
- fundamental
---
-->


<!--
A technique for assigning requests to queues that provides better isolation than hashing modulo the number of queues.
-->
混排切片（Shuffle Sharding）是指一種將請求指派給隊列的技術，其隔離性好過對隊列個數哈希取模的方式。


<!--more--> 

<!--
We are often concerned with insulating different flows of requests
from each other, so that a high-intensity flow does not crowd out low-intensity flows.
A simple way to put requests into queues is to hash some
characteristics of the request, modulo the number of queues, to get
the index of the queue to use. The hash function uses as input
characteristics of the request that align with flows. For example, in
the Internet this is often the 5-tuple of source and destination
address, protocol, and source and destination port.
-->
我們通常會關心不同的請求序列間的相互隔離問題，目的是爲了確保密度較高的
請求序列不會湮沒密度較低的序列。
將請求放入不同隊列的一種簡單方法是對請求的某些特徵值執行哈希函數，
將結果對隊列的個數取模，從而得到要使用的隊列的索引。
這一哈希函數使用請求的與其序列相對應的特徵作爲其輸入。例如，在因特網上，
這一特徵通常指的是由源地址、目標地址、協議、源端口和目標端口所組成的
五元組。

<!--
That simple hash-based scheme has the property that any high-intensity flow
will crowd out all the low-intensity flows that hash to the same queue.
Providing good insulation for a large number of flows requires a large
number of queues, which is problematic. Shuffle sharding is a more
nimble technique that can do a better job of insulating the low-intensity
flows from the high-intensity flows. The terminology of shuffle sharding uses
the metaphor of dealing a hand from a deck of cards; each queue is a
metaphorical card. The shuffle sharding technique starts with hashing
the flow-identifying characteristics of the request, to produce a hash
value with dozens or more of bits. Then the hash value is used as a
source of entropy to shuffle the deck and deal a hand of cards
(queues). All the dealt queues are examined, and the request is put
into one of the examined queues with the shortest length. With a
modest hand size, it does not cost much to examine all the dealt cards
and a given low-intensity flow has a good chance to dodge the effects of a
given high-intensity flow. With a large hand size it is expensive to examine
the dealt queues and more difficult for the low-intensity flows to dodge the
collective effects of a set of high-intensity flows. Thus, the hand size
should be chosen judiciously.
-->
這種簡單的基於哈希的模式有一種特性，高密度的請求序列（流）會湮沒那些被
哈希到同一隊列的其他低密度請求序列（流）。
爲大量的序列提供較好的隔離性需要提供大量的隊列，因此是有問題的。
混排切片是一種更爲靈活的機制，能夠更好地將低密度序列與高密度序列隔離。
混排切片的術語採用了對一疊撲克牌進行洗牌的類比，每個隊列可類比成一張牌。
混排切片技術首先對請求的特定於所在序列的特徵執行哈希計算，生成一個長度
爲十幾個二進制位或更長的哈希值。
接下來，用該哈希值作爲信息熵的來源，對一疊牌來混排，並對整個一手牌（隊列）來洗牌。
最後，對所有處理過的隊列進行檢查，選擇長度最短的已檢查隊列作爲請求的目標隊列。
在隊列數量適中的時候，檢查所有已處理的牌的計算量並不大，對於任一給定的
低密度的請求序列而言，有相當的概率能夠消除給定高密度序列的湮沒效應。
當隊列數量較大時，檢查所有已處理隊列的操作會比較耗時，低密度請求序列
消除一組高密度請求序列的湮沒效應的機會也隨之降低。因此，選擇隊列數目
時要頗爲謹慎。

