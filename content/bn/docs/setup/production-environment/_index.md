---
title: "প্রোডাকশন পরিবেশ"
description: একটি প্রোডাকশন-মানের কুবারনেটস ক্লাস্টার তৈরি করুন
weight: 30
no_list: true
---
<!-- overview -->

একটি প্রোডাকশন-মানের কুবারনেটস ক্লাস্টারের জন্য পরিকল্পনা এবং প্রস্তুতি প্রয়োজন।
আপনার কুবারনেটিস ক্লাস্টার যদি সংকটপূর্ণ কাজের চাপ চালাতে হয়, তাহলে এটি অবশ্যই স্থিতিস্থাপক হওয়ার জন্য কনফিগার করতে হবে।
এই পৃষ্ঠাটি ব্যাখ্যা করে যে আপনি একটি প্রোডাকশন-প্রস্তুত ক্লাস্টার সেট আপ করতে নিতে পারেন,
অথবা প্রোডাকশন ব্যবহারের জন্য একটি বিদ্যমান ক্লাস্টার প্রচার করতে।
আপনি যদি ইতিমধ্যেই প্রোডাকশন সেটআপের সাথে পরিচিত হন এবং লিঙ্কগুলি চান তবে [পরবর্তী](#what-s-next) এ এগিয়ে যান।

<!-- body -->

## প্রোডাকশন বিবেচনা

সাধারণত, একটি প্রোডাকশন কুবারনেটিস ক্লাস্টার পরিবেশে ব্যক্তিগত শিক্ষা, উন্নয়ন, বা পরীক্ষার পরিবেশ কুবারনেটিস এর চেয়ে বেশি প্রয়োজনীয়তা থাকে।
একটি প্রোডাকশন পরিবেশের অনেক ব্যবহারকারীর নিরাপদ অ্যাক্সেস, সামঞ্জস্যপূর্ণ প্রাপ্যতা এবং পরিবর্তিত চাহিদাগুলির সাথে খাপ খাইয়ে নেওয়ার জন্য সংস্থানগুলির প্রয়োজন হতে পারে।

আপনি যখন সিদ্ধান্ত নিচ্ছেন যে আপনি আপনার উৎপাদন কুবারনেটস পরিবেশ কোথায় রাখতে চান (প্রাঙ্গনে বা ক্লাউডে) এবং আপনি যে পরিমাণ ব্যবস্থাপনা নিতে চান বা অন্যদের হাতে দিতে চান, বিবেচনা করুন কিভাবে একটি কুবারনেটিস ক্লাস্টারের জন্য আপনার প্রয়োজনীয়তা নিম্নলিখিত সমস্যাগুলির দ্বারা প্রভাবিত হয়:

- *প্রাপ্যতা*: একটি একক-মেশিন কুবারনেটিস [লার্নিং এনভায়রনমেন্ট](/docs/setup/#learning-environment)
ব্যর্থতার একক পয়েন্ট আছে। একটি অত্যন্ত উপলব্ধ ক্লাস্টার তৈরি করার অর্থ বিবেচনা করা:
  - কর্মী নোড থেকে নিয়ন্ত্রণ সমতল পৃথক করা।
  - একাধিক নোডগুলিতে নিয়ন্ত্রণ সমতল উপাদানগুলির প্রতিলিপি করা।
  - ক্লাস্টারের {{< glossary_tooltip term_id="kube-apiserver" text="API সার্ভার" >}}-এ ব্যালেন্সিং ট্রাফিক লোড করুন৷
  - পর্যাপ্ত কর্মী নোড উপলব্ধ থাকা, বা দ্রুত উপলব্ধ হতে সক্ষম, কারণ পরিবর্তিত কাজের চাপ এটি নিশ্চিত করে।

- *স্কেল*: আপনি যদি আশা করেন আপনার প্রোডাকশন কুবারনেটিস পরিবেশ একটি স্থিতিশীল পরিমাণে চাহিদা পাবে, তাহলে আপনি আপনার প্রয়োজনীয় ক্ষমতার জন্য সেট আপ করতে সক্ষম হবেন এবং সম্পন্ন হবে। কিন্তু, আপনি যদি সময়ের সাথে সাথে চাহিদা বাড়তে বা সিজন বা বিশেষ ইভেন্টের মতো বিষয়গুলির উপর ভিত্তি করে নাটকীয়ভাবে পরিবর্তনের আশা করেন, তাহলে আপনাকে পরিকল্পনা করতে হবে কীভাবে বৃদ্ধির উপশম করতে হবে কন্ট্রোল প্লেন এবং কর্মী নোডগুলিতে আরও অনুরোধ থেকে চাপ বা অব্যবহৃত সংস্থানগুলি কমাতে স্কেল ডাউন।

- *নিরাপত্তা এবং অ্যাক্সেস ম্যানেজমেন্ট*: আপনার নিজস্ব কুবারনেটিস লার্নিং ক্লাস্টারে আপনার সম্পূর্ণ অ্যাডমিন সুবিধা রয়েছে। কিন্তু গুরুত্বপূর্ণ কাজের চাপ সহ ভাগ করা ক্লাস্টার, এবং এক বা দুইজনের বেশি ব্যবহারকারীর জন্য কে এবং কি ক্লাস্টার সংস্থান অ্যাক্সেস করতে পারে, তার জন্য আরও পরিমার্জিত পদ্ধতির প্রয়োজন। আপনি ভূমিকা-ভিত্তিক অ্যাক্সেস কন্ট্রোল ([RBAC](/docs/reference/access-authn-authz/rbac/)) এবং অন্যান্য নিরাপত্তা ব্যবস্থা ব্যবহার করতে পারেন যাতে ব্যবহারকারী এবং কাজের চাপ তাদের প্রয়োজনীয় সংস্থানগুলিতে অ্যাক্সেস পেতে পারে, পাশাপাশি কাজের চাপ, এবং ক্লাস্টার নিরাপদ থাকে। 
আপনি [নীতি](/docs/concepts/policy/) এবং পরিচালনার মাধ্যমে ব্যবহারকারী এবং কাজের চাপ অ্যাক্সেস করতে পারে এমন সংস্থানগুলির সীমা নির্ধারণ করতে পারেন এবং
[কনটেইনার সম্পদ](/docs/concepts/configuration/manage-resources-containers/)।

নিজের হাতে একটি কুবারনেটস উৎপাদন পরিবেশ তৈরি করার আগে, এই কাজটির কিছু বা সমস্ত কাজ [টার্নকি ক্লাউড সলিউশন](/docs/setup/production-environment/turnkey-solutions/) প্রদানকারী বা অন্যান্য [কুবারনেটিস পার্টনার](https://kubernetes.io/partners/) এর কাছে হস্তান্তর করার কথা বিবেচনা করুন।
বিকল্পগুলোর মধ্যে রয়েছেঃ

- *সার্ভারলেস*: কোনও ক্লাস্টার পরিচালনা না করেই তৃতীয় পক্ষের সরঞ্জামগুলিতে কাজের চাপ চালান। সিপিউ ব্যবহার, মেমরি এবং ডিস্ক অনুরোধের মতো জিনিসগুলির জন্য আপনাকে চার্জ করা হবে।
- *পরিচালিত কন্ট্রোল প্লেন*: প্রদানকারীকে ক্লাস্টারের কন্ট্রোল প্লেনের স্কেল এবং প্রাপ্যতা, সেইসাথে প্যাচ এবং আপগ্রেডগুলি পরিচালনা করতে দিন।
- *পরিচালিত কর্মী নোড*: আপনার প্রয়োজন মেটাতে নোডগুলির পুল কনফিগার করুন, তারপর প্রদানকারী নিশ্চিত করে যে সেই নোডগুলি উপলব্ধ এবং প্রয়োজনের সময় আপগ্রেড বাস্তবায়নের জন্য প্রস্তুত।
- *ইন্টিগ্রেশন*: এমন প্রোভাইডার আছে যারা কুবারনেটসকে আপনার প্রয়োজন হতে পারে এমন অন্যান্য পরিষেবার সাথে একীভূত করে, যেমন স্টোরেজ, কনটেইনার রেজিস্ট্রি, প্রমাণীকরণ পদ্ধতি এবং ডেভেলপমেন্ট টুল।

আপনি নিজে একটি প্রোডাকশন কুবারনেটস ক্লাস্টার তৈরি করুন বা অংশীদারদের সাথে কাজ করুন না কেন, আপনার ক্লাস্টারের *কন্ট্রোল প্লেন*, *ওয়ার্কার নোড*, *ব্যবহারকারীর অ্যাক্সেস* এবং *ওয়ার্কলোড রিসোর্স* এর সাথে সম্পর্কিত আপনার চাহিদাগুলি মূল্যায়ন করতে নিম্নলিখিত বিভাগগুলি পর্যালোচনা করুন।

## উৎপাদন ক্লাস্টার সেটআপ

একটি উৎপাদন-মানের কুবারনেটস ক্লাস্টারে, কন্ট্রোল প্লেন পরিষেবাগুলি থেকে ক্লাস্টার পরিচালনা করে যা একাধিক কম্পিউটারে বিভিন্ন উপায়ে ছড়িয়ে পড়তে পারে। প্রতিটি কর্মী নোড, তবে, একটি একক সত্তাকে প্রতিনিধিত্ব করে যা কুবারনেটস পড চালানোর জন্য কনফিগার করা হয়েছে। 

### উৎপাদন নিয়ন্ত্রণ প্লেন 

সহজতম কুবারনেটিস ক্লাস্টারে একই মেশিনে পুরো নিয়ন্ত্রণ সমতল এবং কর্মী নোড পরিষেবাগুলি চলছে। আপনি কর্মী নোডগুলি যোগ করে সেই পরিবেশটি বৃদ্ধি করতে পারেন, যেমনটি [কুবারনেটিস উপাদান](/docs/concepts/overview/components/) এ চিত্রিত চিত্রে প্রতিফলিত হয়েছে। 

যদি ক্লাস্টারটি অল্প সময়ের জন্য উপলভ্য থাকে বা কিছু গুরুতর ভুল হয়ে গেলে তা বাতিল করা যেতে পারে, তাহলে এটি আপনার প্রয়োজন মেটাতে পারে।

আপনার যদি আরও স্থায়ী, অত্যন্ত উপলব্ধ ক্লাস্টারের প্রয়োজন হয় তবে, আপনার নিয়ন্ত্রণ সমতল প্রসারিত করার উপায়গুলি বিবেচনা করা উচিত। নকশা অনুসারে, একক মেশিনে চলমান এক-মেশিন নিয়ন্ত্রণ বিমান পরিষেবাগুলি খুব বেশি উপলব্ধ নয়।
যদি ক্লাস্টার চালু রাখা এবং চালানো এবং কিছু ভুল হলে তা মেরামত করা যায় তা নিশ্চিত করা গুরুত্বপূর্ণ, এই পদক্ষেপগুলি বিবেচনা করুনঃ 

- *ডিপ্লয়মেন্ট টুলস চয়ন করুন*: আপনি kubeadm, kops এবং kubespray এর মত টুল ব্যবহার করে একটি কন্ট্রোল প্লেন স্থাপন করতে পারেন। দেখা
[ডিপ্লয়মেন্ট টুলের সাথে কুবারনেটস ইনস্টল করা হচ্ছে](/docs/setup/production-environment/tools/)
প্রতিটি স্থাপনার পদ্ধতি ব্যবহার করে উৎপাদন-মানের স্থাপনার জন্য টিপস শিখতে। ভিন্ন [কন্টেইনার রানটাইমস](/docs/setup/production-environment/container-runtimes/)
আপনার স্থাপনার সাথে ব্যবহার করার জন্য উপলব্ধ। 
- *শংসাপত্র পরিচালনা করুন*: নিয়ন্ত্রণ বিমান পরিষেবাগুলির মধ্যে সুরক্ষিত যোগাযোগ শংসাপত্র ব্যবহার করে প্রয়োগ করা হয়। শংসাপত্রগুলি স্থাপনের সময় স্বয়ংক্রিয়ভাবে তৈরি হয় বা আপনি আপনার নিজের শংসাপত্র কর্তৃপক্ষ ব্যবহার করে সেগুলি তৈরি করতে পারেন৷
বিস্তারিত জানার জন্য [PKI সার্টিফিকেট এবং প্রয়োজনীয়তা](/docs/setup/best-practices/certificates/) দেখুন।
- *এপিআইসার্ভার জন্য লোড ব্যালেন্সার কনফিগার করুন*: একটি লোড ব্যালেন্সার কনফিগার করুন
বিভিন্ন নোডে চলমান এপিআইসার্ভার পরিষেবা দৃষ্টান্তগুলিতে বাহ্যিক API অনুরোধগুলি বিতরণ করতে। বিস্তারিত জানার জন্য [একটি বহিরাগত লোড ব্যালেন্সার তৈরি করুন](/docs/tasks/access-application-cluster/create-external-load-balancer/) দেখুন।
- *পৃথক এবং ব্যাকআপ etcd পরিষেবা*: etcd পরিষেবাগুলি হয় অন্যান্য কন্ট্রোল প্লেন পরিষেবাগুলির মতো একই মেশিনে চালানো যেতে পারে বা অতিরিক্ত নিরাপত্তা এবং প্রাপ্যতার জন্য আলাদা মেশিনে চলতে পারে৷ যেহেতু etcd ক্লাস্টার কনফিগারেশন ডেটা সঞ্চয় করে, তাই etcd ডাটাবেসের ব্যাকআপ নিয়মিত করা উচিত যাতে আপনি প্রয়োজনে সেই ডাটাবেসটি মেরামত করতে পারেন।
etcd কনফিগার এবং ব্যবহার সম্পর্কে বিস্তারিত জানার জন্য [etcd FAQ](https://etcd.io/docs/v3.4/faq/) দেখুন।
[Kubernetes-এর জন্য অপারেটিং etcd ক্লাস্টার](/docs/tasks/administer-cluster/configure-upgrade-etcd/) দেখুন এবং [kubeadm-এর সাথে একটি উচ্চ প্রাপ্যতা etcd ক্লাস্টার সেট আপ করুন](/docs/setup/production-environment/tools/kubeadm /setup-ha-etcd-with-kubeadm/)
বিস্তারিত জানার জন্য.
- *একাধিক কন্ট্রোল প্লেন সিস্টেম তৈরি করুন*: উচ্চ প্রাপ্যতার জন্য,
নিয়ন্ত্রণ সমতল একটি একক মেশিনে সীমাবদ্ধ করা উচিত নয়। যদি কন্ট্রোল প্লেন পরিষেবাগুলি একটি init পরিষেবা দ্বারা চালিত হয় (যেমন systemd), প্রতিটি পরিষেবা কমপক্ষে তিনটি মেশিনে চালানো উচিত। যাইহোক, Kubernetes-এ পড হিসাবে কন্ট্রোল প্লেন পরিষেবাগুলি চালানো নিশ্চিত করে যে আপনার অনুরোধ করা পরিষেবাগুলির প্রতিলিপিকৃত সংখ্যা সর্বদা উপলব্ধ থাকবে। 
সময়সূচী ত্রুটি সহনশীল হতে হবে, কিন্তু অত্যন্ত উপলব্ধ নয়। কিছু স্থাপনার টুল সেট আপ করা [Raft](https://raft.github.io/) কুবারনেটিস পরিষেবার নেতা নির্বাচন করতে ঐক্যমত্য অ্যালগরিদম। যদি প্রাইমারি চলে যায়, অন্য সার্ভিস নিজেই নির্বাচন করে এবং দায়িত্ব নেয়। 
- *একাধিক অঞ্চল স্প্যান করুন*: যদি আপনার ক্লাস্টারকে সর্বদা উপলব্ধ রাখা গুরুত্বপূর্ণ হয়, তবে একটি ক্লাস্টার তৈরি করার কথা বিবেচনা করুন যা একাধিক ডেটা সেন্টার জুড়ে চলে, ক্লাউড পরিবেশে অঞ্চল হিসাবে উল্লেখ করা হয়। অঞ্চলগুলির গ্রুপগুলিকে অঞ্চল হিসাবে উল্লেখ করা হয়।
একই অঞ্চলে একাধিক অঞ্চলে একটি ক্লাস্টার ছড়িয়ে দেওয়ার মাধ্যমে, এটি একটি জোন অনুপলব্ধ হয়ে গেলেও আপনার ক্লাস্টারটি কাজ করা চালিয়ে যাওয়ার সম্ভাবনাকে উন্নত করতে পারে।
বিস্তারিত জানার জন্য [একাধিক জোনে চলমান](/docs/setup/best-practices/multiple-zones/) দেখুন।
- *চলমান বৈশিষ্ট্যগুলি পরিচালনা করুন*: আপনি যদি সময়ের সাথে সাথে আপনার ক্লাস্টার রাখার পরিকল্পনা করেন তবে এর স্বাস্থ্য এবং নিরাপত্তা বজায় রাখার জন্য আপনাকে কিছু কাজ করতে হবে। উদাহরণ স্বরূপ,
আপনি kubeadm এর সাথে ইনস্টল করলে, আপনাকে সাহায্য করার জন্য নির্দেশাবলী রয়েছে
[শংসাপত্র ব্যবস্থাপনা](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
এবং [kubeadm ক্লাস্টার আপগ্রেড করা](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)।
কুবারনেটিস প্রশাসনিক কাজগুলির একটি দীর্ঘ তালিকার জন্য [ক্লাস্টার অ্যাডমিনিস্টার](/docs/tasks/administer-cluster/) দেখুন। 

আপনি যখন কন্ট্রোল প্লেন পরিষেবাগুলি চালান তখন উপলব্ধ বিকল্পগুলি সম্পর্কে জানতে, দেখুন [kube-apisserver](/docs/reference/command-line-tools-reference/kube-apiserver/),
[কুব-কন্ট্রোলার-ম্যানেজার](/docs/reference/command-line-tools-reference/kube-controller-manager/),
এবং [কুব-শিডিউলার](/docs/reference/command-line-tools-reference/kube-scheduler/)
উপাদান পৃষ্ঠা। অত্যন্ত উপলব্ধ নিয়ন্ত্রণ সমতল উদাহরণের জন্য, দেখুন
[অত্যন্ত উপলব্ধ টপোলজির জন্য বিকল্পগুলি](/docs/setup/production-environment/tools/kubeadm/ha-topology/),
[kubeadm-এর সাহায্যে অত্যন্ত উপলভ্য ক্লাস্টার তৈরি করা](/docs/setup/production-environment/tools/kubeadm/high-availability/),
এবং [Kubernetes-এর জন্য অপারেটিং etcd ক্লাস্টার](/docs/tasks/administer-cluster/configure-upgrade-etcd/)।
দেখুন [একটি etcd ক্লাস্টার ব্যাক আপ করা](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)
একটি etcd ব্যাকআপ পরিকল্পনা তৈরির তথ্যের জন্য।

### প্রোডাকশন ওয়ার্কার নোড

উৎপাদন-গুণমানের কাজের চাপ স্থিতিস্থাপক হতে হবে এবং তারা যেকোন কিছুর উপর নির্ভর করে স্থিতিস্থাপক হতে হবে (যেমন CoreDNS)। আপনি নিজের কন্ট্রোল প্লেন পরিচালনা করুন বা একটি ক্লাউড প্রদানকারী আপনার জন্য এটি করুন, আপনাকে এখনও বিবেচনা করতে হবে কিভাবে আপনি আপনার কর্মী নোডগুলি পরিচালনা করতে চান (এছাড়াও সহজভাবে *নোড* হিসাবে উল্লেখ করা হয়)।

- *নোডগুলি কনফিগার করুন*: নোডগুলি শারীরিক বা ভার্চুয়াল মেশিন হতে পারে। আপনি যদি নিজের নোডগুলি তৈরি করতে এবং পরিচালনা করতে চান তবে আপনি একটি সমর্থিত অপারেটিং সিস্টেম ইনস্টল করতে পারেন, তারপরে উপযুক্ত যোগ করুন এবং চালান
[নোড পরিষেবাগুলি](/docs/concepts/overview/components/#node-components)। বিবেচনা করুন:
   - উপযুক্ত মেমরি, সিপিউ, এবং ডিস্কের গতি এবং স্টোরেজ ক্ষমতা উপলব্ধ থাকার মাধ্যমে আপনি যখন নোড সেট আপ করেন তখন আপনার কাজের চাপের চাহিদা।
   - জেনেরিক কম্পিউটার সিস্টেমগুলি করবে কিনা বা আপনার কাছে এমন কাজের চাপ আছে যেগুলির জন্য জিপিউ প্রসেসর, উইন্ডোজ নোড, বা ভিএম বিচ্ছিন্নতা প্রয়োজন। 
- *ভ্যালিডেট নোড*: কিভাবে একটি নোড একটি কুবারনেটিস ক্লাস্টারে যোগদানের প্রয়োজনীয়তা পূরণ করে তা নিশ্চিত করার জন্য তথ্যের জন্য [ভ্যালিড নোড সেটআপ](/docs/setup/best-practices/node-conformance/) দেখুন।
- *ক্লাস্টারে নোড যোগ করুন*: আপনি যদি নিজের ক্লাস্টার পরিচালনা করেন তাহলে আপনি আপনার নিজস্ব মেশিন সেট আপ করে নোড যোগ করতে পারেন এবং হয় সেগুলিকে ম্যানুয়ালি যোগ করে অথবা ক্লাস্টারের এপিসার্ভারে নিজেদের নিবন্ধন করতে পারেন। এই উপায়ে নোড যোগ করার জন্য Kubernetes কিভাবে সেট আপ করতে হয় সে সম্পর্কে তথ্যের জন্য [নোডসমুহ](/docs/concepts/architecture/nodes/) বিভাগটি দেখুন।
- *Add Windows nodes to the cluster*: Kubernetes offers support for Windows
worker nodes, allowing you to run workloads implemented in Windows containers. See
[Windows in Kubernetes](/docs/setup/production-environment/windows/) for details.
- *Scale nodes*: Have a plan for expanding the capacity your cluster will
eventually need. See [Considerations for large clusters](/docs/setup/best-practices/cluster-large/)
to help determine how many nodes you need, based on the number of pods and
containers you need to run. If you are managing nodes yourself, this can mean
purchasing and installing your own physical equipment.
- *Autoscale nodes*: Most cloud providers support
[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#readme)
to replace unhealthy nodes or grow and shrink the number of nodes as demand requires. See the
[Frequently Asked Questions](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
for how the autoscaler works and
[Deployment](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler#deployment)
for how it is implemented by different cloud providers. For on-premises, there
are some virtualization platforms that can be scripted to spin up new nodes
based on demand.
- *Set up node health checks*: For important workloads, you want to make sure
that the nodes and pods running on those nodes are healthy. Using the
[Node Problem Detector](/docs/tasks/debug-application-cluster/monitor-node-health/)
daemon, you can ensure your nodes are healthy.

## Production user management

In production, you may be moving from a model where you or a small group of
people are accessing the cluster to where there may potentially be dozens or
hundreds of people. In a learning environment or platform prototype, you might have a single
administrative account for everything you do. In production, you will want
more accounts with different levels of access to different namespaces.

Taking on a production-quality cluster means deciding how you
want to selectively allow access by other users. In particular, you need to
select strategies for validating the identities of those who try to access your
cluster (authentication) and deciding if they have permissions to do what they
are asking (authorization):

- *Authentication*: The apiserver can authenticate users using client
certificates, bearer tokens, an authenticating proxy, or HTTP basic auth.
You can choose which authentication methods you want to use.
Using plugins, the apiserver can leverage your organization’s existing
authentication methods, such as LDAP or Kerberos. See
[Authentication](/docs/reference/access-authn-authz/authentication/)
for a description of these different methods of authenticating Kubernetes users.
- *Authorization*: When you set out to authorize your regular users, you will probably choose between RBAC and ABAC authorization. See [Authorization Overview](/docs/reference/access-authn-authz/authorization/) to review different modes for authorizing user accounts (as well as service account access to your cluster):
  - *Role-based access control* ([RBAC](/docs/reference/access-authn-authz/rbac/)): Lets you assign access to your cluster by allowing specific sets of permissions to authenticated users. Permissions can be assigned for a specific namespace (Role) or across the entire cluster (ClusterRole). Then using RoleBindings and ClusterRoleBindings, those permissions can be attached to particular users.
  - *Attribute-based access control* ([ABAC](/docs/reference/access-authn-authz/abac/)): Lets you create policies based on resource attributes in the cluster and will allow or deny access based on those attributes. Each line of a policy file identifies versioning properties (apiVersion and kind) and a map of spec properties to match the subject (user or group), resource property, non-resource property (/version or /apis), and readonly. See [Examples](/docs/reference/access-authn-authz/abac/#examples) for details.

As someone setting up authentication and authorization on your production Kubernetes cluster, here are some things to consider:

- *Set the authorization mode*: When the Kubernetes API server
([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
starts, the supported authentication modes must be set using the *--authorization-mode*
flag. For example, that flag in the *kube-adminserver.yaml* file (in */etc/kubernetes/manifests*)
could be set to Node,RBAC. This would allow Node and RBAC authorization for authenticated requests.
- *Create user certificates and role bindings (RBAC)*: If you are using RBAC
authorization, users can create a CertificateSigningRequest (CSR) that can be
signed by the cluster CA. Then you can bind Roles and ClusterRoles to each user.
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
for details.
- *Create policies that combine attributes (ABAC)*: If you are using ABAC
authorization, you can assign combinations of attributes to form policies to
authorize selected users or groups to access particular resources (such as a
pod), namespace, or apiGroup. For more information, see
[Examples](/docs/reference/access-authn-authz/abac/#examples).
- *Consider Admission Controllers*: Additional forms of authorization for
requests that can come in through the API server include
[Webhook Token Authentication](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication).
Webhooks and other special authorization types need to be enabled by adding
[Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
to the API server.

## Set limits on workload resources

Demands from production workloads can cause pressure both inside and outside
of the Kubernetes control plane. Consider these items when setting up for the
needs of your cluster's workloads:

- *Set namespace limits*: Set per-namespace quotas on things like memory and CPU. See
[Manage Memory, CPU, and API Resources](/docs/tasks/administer-cluster/manage-resources/)
for details. You can also set
[Hierarchical Namespaces](/blog/2020/08/14/introducing-hierarchical-namespaces/)
for inheriting limits.
- *Prepare for DNS demand*: If you expect workloads to massively scale up,
your DNS service must be ready to scale up as well. See
[Autoscale the DNS service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- *Create additional service accounts*: User accounts determine what users can
do on a cluster, while a service account defines pod access within a particular
namespace. By default, a pod takes on the default service account from its namespace.
See [Managing Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
for information on creating a new service account. For example, you might want to:
  - Add secrets that a pod could use to pull images from a particular container registry. See [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/) for an example.
  - Assign RBAC permissions to a service account. See [ServiceAccount permissions](/docs/reference/access-authn-authz/rbac/#service-account-permissions) for details.

## {{% heading "whatsnext" %}}

- Decide if you want to build your own production Kubernetes or obtain one from
available [Turnkey Cloud Solutions](/docs/setup/production-environment/turnkey-solutions/)
or [Kubernetes Partners](https://kubernetes.io/partners/).
- If you choose to build your own cluster, plan how you want to
handle [certificates](/docs/setup/best-practices/certificates/)
and set up high availability for features such as
[etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
and the
[API server](/docs/setup/production-environment/tools/kubeadm/ha-topology/).
- Choose from [kubeadm](/docs/setup/production-environment/tools/kubeadm/), [kops](/docs/setup/production-environment/tools/kops/) or [Kubespray](/docs/setup/production-environment/tools/kubespray/)
deployment methods.
- Configure user management by determining your
[Authentication](/docs/reference/access-authn-authz/authentication/) and
[Authorization](/docs/reference/access-authn-authz/authorization/) methods.
- Prepare for application workloads by setting up
[resource limits](/docs/tasks/administer-cluster/manage-resources/),
[DNS autoscaling](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
and [service accounts](/docs/reference/access-authn-authz/service-accounts-admin/).
