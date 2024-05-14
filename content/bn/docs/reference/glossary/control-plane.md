---
title: কন্ট্রোল প্লেন
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  কন্টেইনার অর্কেস্ট্রেশন লেয়ার যা কন্টেইনারের জীবনচক্র সংজ্ঞায়িত, ডেপ্লয় এবং পরিচালনা করতে API এবং ইন্টারফেসগুলিকে প্রকাশ করে।
  
aka:
tags:
- fundamental
---
কন্টেইনার অর্কেস্ট্রেশন লেয়ার যা কন্টেইনারের জীবনচক্র সংজ্ঞায়িত, ডেপ্লয় এবং পরিচালনা করতে API এবং ইন্টারফেসগুলিকে প্রকাশ করে।

<!--more--> 
 
 এই লেয়ারটি বিভিন্ন উপাদান দ্বারা গঠিত, যেমন (কিন্তু এতে সীমাবদ্ধ নয়):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API সার্ভার" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="শিডিউলার" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="কন্ট্রোলার ম্যানেজারr" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="ক্লাউড কন্ট্রোলার ম্যানেজার" term_id="cloud-controller-manager" >}}

 এই উপাদানগুলি ট্রাডিশনাল অপারেটিং সিস্টেম সার্ভিস (daemons) বা কন্টেইনার হিসাবে চালানো যেতে পারে। এই উপাদানগুলি চালানো হোস্টগুলিকে ঐতিহাসিকভাবে {{< glossary_tooltip text="masters" term_id="master" >}} বলা হত।
