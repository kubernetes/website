---
title: কন্ট্রোল প্লেন
id: control-plane
date: ২০১৯/০৫/১২
full_link:
short_description: >
  কন্টেইনার অর্কেস্ট্রেশন স্তর যেটা, কন্টেইনারের জীবনচক্রটি সংজ্ঞায়িত, স্থাপন এবং পরিচালনা করতে এপিআই(API) এবং ইন্টারফেসগুলি প্রকাশ করে।
aka:
tags:
- fundamental
---
কন্টেইনার অর্কেস্ট্রেশন স্তর যেটা, কন্টেইনারের জীবনচক্রটি সংজ্ঞায়িত, স্থাপন এবং পরিচালনা করতে এপিআই(API) এবং ইন্টারফেসগুলি প্রকাশ করে।

<!--more--> 
 
এই স্তরটি অনেকগুলি ভিন্ন উপাদান দ্বারা রচিত, যেমন (তবে সীমাবদ্ধ নয়):

* {{< glossary_tooltip text="etcd" term_id="etcd" >}}
* {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
* {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
* {{< glossary_tooltip text="Controller Manager" term_id="kube-controller-manager" >}}
* {{< glossary_tooltip text="Cloud Controller Manager" term_id="cloud-controller-manager" >}}

এই উপাদানগুলি ঐতিহ্যবাহী অপারেটিং সিস্টেম পরিষেবাদি(daemons) বা কন্টেইনার্স(containers) হিসাবে চালানো যেতে পারে। এই উপাদানগুলি চালানো হোস্টগুলিকে ঐতিহাসিকভাবে {{< glossary_tooltip text="masters" term_id="master" >}} বলা হত।
