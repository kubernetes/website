---
title: কন্টেইনার রানটাইম
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
 কন্টেইনার রানটাইম হল সেই সফটওয়্যার যা কন্টেইনার চালানোর জন্য দায়ী।

aka:
tags:
- fundamental
- workload
---
 একটি মৌলিক উপাদান যা কুবারনেটিসকে কার্যকরভাবে কন্টেইনার চালানোর ক্ষমতা দেয়।
 এটি কুবারনেটিস পরিবেশের মধ্যে কন্টেইনারগুলির সম্পাদন এবং জীবনচক্র পরিচালনার জন্য দায়ী।

<!--more-->

কুবারনেটস কনটেইনার রানটাইম সমর্থন করে যেমন
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
এবং [কুবারনেটিস CRI (কন্টেইনার রানটাইম
ইন্টারফেস)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)।