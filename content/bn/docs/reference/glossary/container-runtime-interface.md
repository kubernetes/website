---
title: কন্টেইনার রানটাইম ইন্টারফেস (Container Runtime Interface)
id: container-runtime-interface
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  kubelet এবং কন্টেইনার রানটাইমের মধ্যে যোগাযোগের জন্য প্রধান প্রোটোকল।

aka:
tags:
  - cri
---

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} এবং কন্টেইনার রানটাইমের এর মধ্যে যোগাযোগের জন্য প্রধান প্রোটোকল।

<!--more-->

কুবারনেটিস কন্টেইনার রানটাইম ইন্টারফেস (CRI)
[নোড কম্পোনেন্ট](/docs/concepts/architecture/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} এবং
{{< glossary_tooltip text="কন্টেইনার রানটাইমের" term_id="container-runtime" >}}
মধ্যে যোগাযোগের জন্য প্রধান [gRPC](https://grpc.io) প্রোটোকলকে সংজ্ঞায়িত করে।
