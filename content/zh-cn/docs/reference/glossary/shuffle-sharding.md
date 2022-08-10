---
title: 混排切片（Shuffle Sharding）
id: shuffle sharding
date: 2020-03-04
full_link:
short_description: >
  一种将请求指派给队列的技术，其隔离性好过对队列个数哈希取模的方式。

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
混排切片（Shuffle Sharding）是指一种将请求指派给队列的技术，其隔离性好过对队列个数哈希取模的方式。


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
我们通常会关心不同的请求序列间的相互隔离问题，目的是为了确保密度较高的
请求序列不会湮没密度较低的序列。
将请求放入不同队列的一种简单方法是对请求的某些特征值执行哈希函数，
将结果对队列的个数取模，从而得到要使用的队列的索引。
这一哈希函数使用请求的与其序列相对应的特征作为其输入。例如，在因特网上，
这一特征通常指的是由源地址、目标地址、协议、源端口和目标端口所组成的
五元组。

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
这种简单的基于哈希的模式有一种特性，高密度的请求序列（流）会湮没那些被
哈希到同一队列的其他低密度请求序列（流）。
为大量的序列提供较好的隔离性需要提供大量的队列，因此是有问题的。
混排切片是一种更为灵活的机制，能够更好地将低密度序列与高密度序列隔离。
混排切片的术语采用了对一叠扑克牌进行洗牌的类比，每个队列可类比成一张牌。
混排切片技术首先对请求的特定于所在序列的特征执行哈希计算，生成一个长度
为十几个二进制位或更长的哈希值。
接下来，用该哈希值作为信息熵的来源，对一叠牌来混排，并对整个一手牌（队列）来洗牌。
最后，对所有处理过的队列进行检查，选择长度最短的已检查队列作为请求的目标队列。
在队列数量适中的时候，检查所有已处理的牌的计算量并不大，对于任一给定的
低密度的请求序列而言，有相当的概率能够消除给定高密度序列的湮没效应。
当队列数量较大时，检查所有已处理队列的操作会比较耗时，低密度请求序列
消除一组高密度请求序列的湮没效应的机会也随之降低。因此，选择队列数目
时要颇为谨慎。

