---
title: রিলিজ ম্যানেজারস
type: docs
---

"রিলিজ ম্যানেজাররা" হল একটি সার্বিক শব্দ যা কুবারনেটিসের সেই অবদানকারীদের
নির্দেশ করে, যারা রিলিজ ব্রাঞ্চগুলি বজায় রাখা এবং SIG Release দ্বারা
সরবরাহিত টুলগুলি ব্যবহার করে রিলিজ তৈরি করার দায়িত্বে থাকে।

প্রত্যেক ভূমিকার দায়িত্ব নীচে বর্ণিত হয়েছে।

- [যোগাযোগ](#contact)
  - [নিরাপত্তা ইম্বার্গো নীতি](#security-embargo-policy)
- [হ্যান্ডবুক](#handbooks)
- [রিলিজ ম্যানেজারস](#release-managers)
  - [রিলিজ ম্যানেজার হওয়া](#becoming-a-release-manager)
- [রিলিজ ম্যানেজার অ্যাসোসিয়েটস](#release-manager-associates)
  - [রিলিজ ম্যানেজার অ্যাসোসিয়েট হওয়া](#becoming-a-release-manager-associate)
- [SIG রিলিজ লিডস](#sig-release-leads)
  - [চেয়ারস](#chairs)
  - [টেকনিক্যাল লিডস](#technical-leads)
 
  ## যোগাযোগ

| মেইলিং লিস্ট | স্ল্যাক | দৃশ্যমান | ব্যবহার | সদস্যতা |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (চ্যানেল) / @release-managers (ইউজার গ্রুপ) | পাবলিক | রিলিজ ম্যানেজারদের জন্য পাবলিক আলোচনা | সকল রিলিজ ম্যানেজার (অ্যাসোসিয়েট, এবং SIG চেয়ারস সহ) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | নেই | প্রাইভেট | স্পেশাল রিলিজ ম্যানেজারদের জন্য প্রাইভেট আলোচনা | রিলিজ ম্যানেজার, SIG রিলিজ লীডারশিপ |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (চ্যানেল) / @security-rel-team (ইউজার গ্রুপ) | প্রাইভেট | সিকিউরিটি রেসপন্স কমিটির সাথে সিকিউরিটি রিলিজ সমন্বয় | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### নিরাপত্তা ইম্বার্গো নীতি

কিছু রিলিজ সম্পর্কিত তথ্য ইম্বার্গোর অধীনে রয়েছে এবং আমরা তারা সেট করার জন্য নীতি নির্ধারণ করেছি। 
অধিক তথ্যের জন্য দয়া করে
[নিরাপত্তা ইম্বার্গো নীতি](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)
দেখুন।

## হ্যান্ডবুক

**লক্ষ্যস্থান: প্যাচ রিলিজ টীম এবং শাখা ম্যানেজার হ্যান্ডবুকগুলি পরের তারিখে ডিডুপ্লিকেট করা হবে।**

- [প্যাচ রিলিজ টীম][handbook-patch-release]
- [শাখা ম্যানেজার][handbook-branch-mgmt]

## রিলিজ ম্যানেজার

**নোট:** ডকুমেন্টেশনে প্যাচ রিলিজ টিম এবং ব্রাঞ্চ ম্যানেজমেন্ট ভূমিকা সম্পর্কে 
উল্লেখ থাকতে পারে। এই দুই ভূমিকা রিলিজ ম্যানেজার ভূমিকায় একীভূত
করা হয়েছে।

মিনিমাম প্রয়োজনীয়তা রিলিজ ম্যানেজার এবং রিলিজ ম্যানেজার অ্যাসোসিয়েটগুলির জন্য নিম্নলিখিত:

- বেসিক ইউনিক্স কমান্ডের পরিচিতি এবং শেল স্ক্রিপ্ট ডিবাগ করতে পারা।
- `git` এবং সম্পর্কিত `git` কমান্ড লাইন ইনভোকেশন এর মাধ্যমে
ব্রাঞ্চ সোর্স কোড ওয়ার্কফ্লো পরিচিতি।
- গুগল ক্লাউডের সাধারণ জ্ঞান (ক্লাউড বিল্ড এবং ক্লাউড স্টোরেজ)।
- সাহায্য চাওয়া এবং স্পষ্টভাবে যোগাযোগের জন্য উন্মুক্ত।
- কুবার্নিটিস কমিউনিটি [সদস্যতা][community-membership]

রিলিজ ম্যানেজারদের দায়িত্ব অনুসারে:

- কুবার্নিটিস রিলিজ করা এবং সমন্বয় করা:
  - প্যাচ রিলিজ (`x.y.z`, যেখানে `z` > 0)
  - মাইনর রিলিজ (`x.y.z`, যেখানে `z` = 0)
  - প্রি-রিলিজ (আলফা, বেটা এবং রিলিজ ক্যান্ডিডেট)
  - প্রতিটি রিলিজ চক্রে রিলিজ টিম
    সঙ্গে কাজ করা
  - প্যাচ রিলিজের জন্য [সময়সূচি এবং ক্যাডেন্স নির্ধারণ করা][patches]
- রিলিজ ব্রাঞ্চগুলি মেন্টেনেন্স করা:
  - চেরি পিকগুলি পর্যালোচনা করা
  - রিলিজ ব্রাঞ্চটি স্বাস্থ্যকর রাখা এবং কোনও
   অপ্রত্যাশিত প্যাচ মার্জ না হয়ে থাকা নিশ্চিত করা ।
- [রিলিজ ম্যানেজার অ্যাসোসিয়েটগুলির](#রিলিজ-ম্যানেজার-অ্যাসোসিয়েটগুলি) গ্রুপ মেন্টরিং করা
- k/release এ বৈশিষ্ট্যগুলি উন্নত করা এবং কোড রক্ষণ করা
- Buddy প্রোগ্রামে সক্রিয়ভাবে অংশগ্রহণের মাধ্যমে রিলিজ ম্যানেজার সহযোগী
এবং অবদানকারীদের সহায়তা করা
  - মাসিকভাবে অ্যাসোসিয়েটগুলির সাথে চেক ইন করুন এবং কাজ দেয়ার জন্য তাদের সামর্থ্য বৃদ্ধি করুন,
     তাদেরকে রিলিজ করতে সাহায্য করুন এবং মেন্টরিং করুন
  - অ্যাসোসিয়েটগুলির নতুন অবদানকারীদের নিয়োগে সহায়তা করা
যেমন, প্রশ্নের উত্তর দেওয়া এবং তাদের জন্য উপযুক্ত কাজের পরামর্শ দেওয়া

এই দলটি মাঝে মাঝে [সিকিউরিটি রেসপন্স কমিটির][src]
সাথে ঘনিষ্ঠভাবে কাজ করে এবং তাই [সিকিউরিটি রিলিজ প্রসেসে][security-release-process]
উল্লিখিত নির্দেশিকা মেনে চলা উচিত।

GitHub অ্যাক্সেস নিয়ন্ত্রণ: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub উল্লেখ: [@kubernetes/release-engineering](https://github.com/orgs/kubernetes/teams/release-engineering)

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### রিলিজ ম্যানেজার হওয়ার পথ

রিলিজ ম্যানেজার হতে চাইলে, প্রথমে কাউকে রিলিজ ম্যানেজার অ্যাসোসিয়েট হিসেবে কাজ করতে হবে।
অ্যাসোসিয়েটরা কয়েকটি চক্র জুড়ে রিলিজের উপর সক্রিয়ভাবে কাজ করে রিলিজ 
ম্যানেজারে পদোন্নতি পায়:

- নেতৃত্ব দেওয়ার ইচ্ছা প্রদর্শন করা
- রিলিজ ম্যানেজারদের সাথে ট্যাগ-টিম করে প্যাচগুলিতে কাজ করা,
শেষ পর্যন্ত স্বাধীনভাবে একটি রিলিজ কাটা যায় ।
  - রিলিজের একটি সীমাবদ্ধ কার্যকারিতা থাকার কারণে, আমরা ইমেজ প্রচার
এবং অন্যান্য কোর রিলিজ ইঞ্জিনিয়ারিং কাজের উল্লেখযোগ্য অবদানকেও মূল্যায়ন করি ।
- অ্যাসোসিয়েটদের কাজ কিভাবে হচ্ছে তা জিজ্ঞাসাবাদ করা, উন্নতির প্রস্তাবনা দেওয়া,
ফিডব্যাক সংগ্রহ করা এবং পরিবর্তন চালনা করা
- নির্ভরযোগ্য এবং দ্রুত সাড়া দেওয়া ।
- এমন উন্নত কাজে নিজেকে নিযুক্ত করা যা সম্পন্ন করতে রিলিজ
 ম্যানেজার-স্তরের অ্যাক্সেস এবং সুবিধার প্রয়োজন ।

## রিলিজ ম্যানেজার অ্যাসোসিয়েটস

রিলিজ ম্যানেজার অ্যাসোসিয়েটরা হলেন রিলিজ ম্যানেজারদের শিক্ষানবিশ, যাদের আগে রিলিজ ম্যানেজার শ্যাডো হিসেবে পরিচিত করা হতো। তাদের 
দায়িত্ব হল:

- প্যাচ রিলিজের কাজ, চেরি পিক রিভিউ
- k/release আপডেট করা: নির্ভরশীলতা আপডেট করা এবং সোর্স
কোডবেজে অভ্যস্ত হওয়া
- ডকুমেন্টেশনে অবদান রাখা: হ্যান্ডবুকগুলি মেনটেইন করা, নিশ্চিত করা
  যে রিলিজ প্রক্রিয়াগুলি ডকুমেন্টেড হয়েছে
- একজন রিলিজ ম্যানেজারের সাহায্যে: রিলিজ টিমের সাথে রিলিজ
  চক্রের সময় কাজ করা এবং কুবেরনেটস রিলিজ কাটা
- অগ্রাধিকার এবং যোগাযোগে সাহায্যের সুযোগ খুঁজে বের করা
  - প্যাচ রিলিজ সম্পর্কে প্রাক-ঘোষণা এবং আপডেট পাঠানো
  - ক্যালেন্ডার আপডেট করা, রিলিজের তারিখ এবং মাইলস্টোনগুলির সাথে সাহায্য করা
    [রিলিজ চক্রের টাইমলাইন][k-sig-release-releases] থেকে
- Buddy প্রোগ্রামের মাধ্যমে, নতুন অবদানকারীদের অনবোর্ডিং করা এবং
   তাদের সাথে কাজের জুটি বাঁধা

GitHub মেনশনস: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski ([@salaxander](https://github.com/salaxander))

### রিলিজ ম্যানেজার অ্যাসোসিয়েট হওয়ার পথ

অবদানকারীরা নিম্নলিখিত দেখানোর মাধ্যমে অ্যাসোসিয়েট হতে পারেন:

- নিয়মিত অংশগ্রহণ, যার মধ্যে ৬-১২ মাসের সক্রিয় রিলিজ
  ইঞ্জিনিয়ারিং-সম্পর্কিত কাজ অন্তর্ভুক্ত
- একটি রিলিজ চক্রে রিলিজ টিমে একজন টেকনিকাল
   লিড হিসেবে ভূমিকা পালনের অভিজ্ঞতা
  - SIG রিলিজ সামগ্রিকভাবে কীভাবে কাজ করে তা বোঝার জন্য এই
অভিজ্ঞতাটি একটি শক্ত ভিত্তিরেখা প্রদান করে—যার মধ্যে প্রযুক্তিগত দক্ষতা,
যোগাযোগ/রেস্পন্সিভনেস এবং নির্ভরযোগ্যতা সম্পর্কিত আমাদের প্রত্যাশাগুলি অন্তর্ভুক্ত
- k/release আইটেমগুলিতে কাজ করা যা Testgrid এর সাথে আমাদের ইন্টার‌্যাকশন এর
উন্নত করে, লাইব্রেরি পরিষ্কার করা ইত্যাদি কাজে অবদান রাখা
  - এই প্রচেষ্টাগুলি রিলিজ ম্যানেজারদের এবং অ্যাসোসিয়েটদের সাথে
     ইন্টার‌্যাক্ট করা এবং জুটি বাঁধা প্রয়োজন
 
  ## SIG রিলিজ লিডস

SIG রিলিজ চেয়ারস এবং টেকনিকাল লিডস দায়ী আছেন:

- SIG রিলিজের গভর্নেন্সের জন্য
- রিলিজ ম্যানেজার এবং অ্যাসোসিয়েটদের জন্য জ্ঞান বিনিময় সেশন নেতৃত্ব দান
- নেতৃত্ব এবং অগ্রাধিকার নির্ধারণে কোচিং প্রদান

তাদের এখানে স্পষ্টভাবে উল্লেখ করা হয়েছে কারণ তারা প্রতিটি ভূমিকার
জন্য বিভিন্ন যোগাযোগ চ্যানেল এবং অনুমতি গ্রুপ (GitHub টিমস, GCP অ্যাক্সেস)
এর মালিক। এই হিসাবে, তারা অত্যন্ত অধিকারপ্রাপ্ত কমিউনিটি সদস্য এবং কিছু ব্যক্তিগত
যোগাযোগের জন্য সচেতন, যা কখনো কখনো কুবারনেটিস নিরাপত্তা প্রকাশনার সাথে সম্পর্কিত
হতে পারে।

GitHub টিম: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### চেয়ারস

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### টেকনিকাল লিডস

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

পূর্ববর্তী শাখা ম্যানেজারদের তালিকা [releases directory][k-sig-release-releases]-এ kubernetes/sig-release রিপোজিটরিতে 
`release-x.y/release_team.md` ফাইলে পাওয়া যাবে।

উদাহরণ: [1.15 Release Team](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
