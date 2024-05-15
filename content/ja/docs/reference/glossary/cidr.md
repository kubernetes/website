---
title: CIDR
id: cidr
date: 2019-11-12
full_link: 
short_description: >
  CIDRは、IPアドレスの範囲を記述するための表記法であり、さまざまなネットワークを構成するために使用されています。

aka:
tags:
- networking
---
CIDR(Classless Inter-Domain Routing)はIPアドレスの範囲を記述するための表記法であり、さまざまなネットワークを構成するために使用されています。

<!--more-->

Kubernetesでは、各{{< glossary_tooltip text="Node" term_id="node" >}}に対して、CIDRで記述されている開始アドレスとサブネットマスクを通してIPアドレスの範囲が割り当てられます。これにより、Nodeは各{{< glossary_tooltip text="Pod" term_id="pod" >}}に一意のIPアドレスを割り当てることができます。CIDRはもともとIPv4の概念でしたが、IPv6もサポートされるように拡張されています。
