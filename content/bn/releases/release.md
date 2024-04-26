---
title: কুবারনেটিস রিলিজ সাইকেল
type: docs
auto_generated: true
---

<!-- THIS CONTENT IS AUTO-GENERATED via ./scripts/releng/update-release-info.sh in kubernetes/website -->

{{< warning >}}
এই কনটেন্ট স্বয়ংক্রিয়ভাবে তৈরি এবং লিঙ্কগুলি কাজ নাও করতে পারে৷ উকুমেন্টটির সোর্স অবস্থিত [এখানে](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/release.md).
{{< /warning >}}

# টার্গেটিং এনহ্যান্সমেন্টস, ইস্যু এবং PRs মাইলস্টোন রিলিজের জন্য

এই ডকুমেন্টটি ফোকাস করা কুবারনেটিস ডেভেলপার এবং কন্ট্রিবিউটরদের জন্য যাদের
একটি এনহ্যান্সমেন্ট, ইস্যু, অথবা পুল রিকুয়েস্ট তৈরি করতে হয় যা লক্ষ্য করে একটি নির্দিষ্ট 
মাইলফলক।

- [TL;DR](#tldr)
  - [নরমাল ডেভ (সপ্তাহ ১-১১)](#normal-dev-weeks-1-11)
  - [কোড ফ্রিজ (সপ্তাহ ১২-১৪)](#code-freeze-weeks-12-14)
  - [পোস্ট-রিলিজ (সপ্তাহ ১৪+)](#post-release-weeks-14+)
- [সংজ্ঞা](#definitions)
- [রিলিজ সাইকেল](#the-release-cycle)
- [মাইলস্টোন থেকে আইটেম অপসারণ](#removal-of-items-from-the-milestone)
- [মাইলস্টোনে একটি আইটেম সংযোজন](#adding-an-item-to-the-milestone)
  - [মাইলস্টোন রক্ষণাবেক্ষণকারী](#milestone-maintainers)
  - [ফিচার সংযোজন](#feature-additions)
  - [ইস্যু সংযোজন](#issue-additions)
  - [PR সংযোজন](#pr-additions)
- [অন্যান্য প্রয়োজনীয় লেবেল](#other-required-labels)
  - [SIG ওনার লেবেল](#sig-owner-label)
  - [প্রাইওরিটি লেবেল](#priority-label)
  - [ইস্যু/PR এর মতো লেবেল](#issuepr-kind-label)

শেফারডিং এনহ্যান্সমেন্ট, ইস্যু এবং পুল রিকুয়েস্ট করার প্রক্রিয়া 
কুবারনেটিস রিলিজে একাধিক স্টেকহোল্ডারদের অংশগ্রহণ বাড়ায়:

- এনহ্যান্সমেন্টস, ইস্যু, এবং পুল রিকুয়েস্ট ওনার
- SIG লিডারশিপ
- [রিলিজ টিম][release-team]

ওয়ার্কফ্লো এবং ইন্টারেকশন সম্পর্কিত তথ্য নীচে বর্ণিত হয়েছে।

একটি এনহ্যান্সমেন্ট, ইস্যু, অথবা পুল রিকুয়েস্ট (PR) এর ওনার হিসেবে, এটি আপনার 
দায়িত্ব রিলিজ মাইলস্টোন রিকোয়ারমেন্ট পূরণ হয়েছে নিশ্চিত করা। অটোমেশন এবং
রিলিজ টিম আপনার সাথে যোগাযোগ করবে যদি আপডেট প্রয়োজন হয়, কিন্তু
নিষ্ক্রিয়তার ফলে আপনার কাজ মাইলস্টোন থেকে সরে যেতে পারে। অতিরিক্ত 
রিকোয়ারমেন্ট প্রয়োজন যখন লক্ষ্য মাইলস্টোন একটি পূর্ববর্তী রিলিজ (আরও
তথ্যের জন্য [চেরি পিক প্রোসেস][cherry-picks] দেখ)

## TL;DR

আপনি যদি আপনার PR মার্জ করাতে চান তার জন্য নিম্নলিখিত প্রয়োজনীয় লেবেল এবং 
মাইলস্টোনগুলো প্রয়োজন, এখানে Prow /commands দ্বারা প্রতিনিধিত্ব করা হয়েছে যেগুলি যোগ করা লাগবে:

### নরমাল ডেভ (সপ্তাহ ১-১১)

- /sig {name}
- /kind {type}
- /lgtm
- /approved

### [কোড ফ্রিজ][code-freeze] (সপ্তাহ ১২-১৪)

- /milestone {v1.y}
- /sig {name}
- /kind {bug, failing-test}
- /lgtm
- /approved

### পোস্ট-রিলিজ (সপ্তাহ ১৪+)

'নরমাল ডেভ' পর্যায়ের ফিরে যাওয়ার রিকোয়ারমেন্ট:

- /sig {name}
- /kind {type}
- /lgtm
- /approved

1.y ব্রাঞ্চে মার্জ করা এখন [চেরি পিক্সের মাধ্যমে][cherry-picks], 
[রিলিজ ম্যানেজার][release-managers] দ্বারা অনুমোদিত।

পূর্বে, মাইলস্টোন-লক্ষ্যযুক্ত পুল রিকুয়েস্টের জন্য 
একটি সংস্থায়িত GitHub ইস্যু খোলা প্রয়োজন ছিল, কিন্তু এটি আর প্রয়োজন নয়
ফিচার বা এনহ্যান্সমেন্ট হলো ইফেক্টিভ GitHub ইস্যু বা [KEPs][keps] যা পরবর্তী 
পুল রিকুয়েস্টের পথে পরিচালিত হয়।

সাধারণ লেবেলিং প্রক্রিয়াটি আর্টিফ্যাক্ট টাইপ জুড়ে সামঞ্জস্যপূর্ণ হওয়া উচিত।

## সংজ্ঞা

- *ইস্যু ওনার*: সৃষ্টিকারক, অ্যাসাইনিজ, এবং ইস্যুটি রিলিজ
  মাইলস্টোনে সরবরাহ করা ব্যবহারকারী।

- *রিলিজ টিম*: প্রতিটি Kubernetes রিলিজে একটি দল আছে যারা বর্ণিত প্রজেক্ট ম্যানেজমেন্টের
  কাজ করে [এখানে][release-team]।
  
  যে কোনো প্রদত্ত রিলিজের সাথে সংশ্লিষ্ট দলের যোগাযোগের তথ্য পাওয়া যাবে
  [এখানে](https://git.k8s.io/sig-release/releases/).

- *Y days*: বিজনেস ডে বুঝায়।

- *এনহ্যান্সমেন্ট*: দেখ "[আমার কাজটা কী এনহ্যান্সমেন্ট?](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)"

- *[এনহ্যান্সমেন্ট ফ্রিজ][enhancements-freeze]*:
  সময়সীমা যার মধ্যে [KEPs][keps] সম্পন্ন করতে হবে
  এনহ্যান্সমেন্টগুলো বর্তমান রিলিজের অংশ করার জন্য

- *[এক্সেপশন রিকোয়েস্ট][exceptions]*:
  কোন এনহ্যান্সমেন্ট এর জন্য সময়সীমা বাড়ানোর অনুরোধ করার
  প্রক্রিয়া
  
- *[কোড ফ্রিজ][code-freeze]*:
  চূড়ান্ত প্রকাশের তারিখের আগে ~4 সপ্তাহের সময়কাল, যে সময়ে শুধুমাত্র
  ক্রিটিকাল বাগ ফিক্স রিলিজে মার্জ করা হয়েছে।

- *[প্রুনিং](https://git.k8s.io/sig-release/releases/release_phases.md#pruning)*:
  একটি রিলিজ মাইলস্টোন থেকে একটি এনহ্যান্সমেন্ট অপসারণের প্রক্রিয়া যদি এটি
  সম্পূর্ণরূপে বাস্তবায়িত বা অন্যথায় স্থিতিশীল নয় বলে মনে করা হয়।

- *রিলিজ মাইলস্টোন*: সিমেনটিক ভার্সন স্ট্রিং বা 
  [GitHub milestone](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests)
  যা একটি রিলিজ ভার্সন MAJOR.MINOR `vX.Y` নির্দেশ করে।

  আরও দেখ
  [রিলিজ ভার্সনিং](https://git.k8s.io/sig-release/release-engineering/versioning.md).

- *রিলিজ ব্রাঞ্চ*: Git ব্রাঞ্চ `release-X.Y` তৈরি করা হয়েছে `vX.Y` মাইলস্টোনের জন্য।

  `vX.Y-rc.0` রিলিজের সময় তৈরি করা হয়েছে এবং এর পরে রক্ষণাবেক্ষণ করা হয়েছে
  প্রায় 12 মাসের জন্য `vX.Y.Z` প্যাচ রিলিজ সহ মুক্তি।

  দ্রষ্টব্য: রিলিজ 1.19 এবং পরবর্তী ভার্সন 1 বছরের প্যাচ রিলিজ সমর্থন পায়, এবং
  রিলিজ 1.18 এবং তার আগে 9 মাসের প্যাচ রিলিজ সমর্থন পেয়েছে।










[cherry-picks]: https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md
[code-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#code-freeze
[enhancements-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#enhancements-freeze
[exceptions]: https://git.k8s.io/sig-release/releases/release_phases.md#exceptions
[keps]: https://git.k8s.io/enhancements/keps
[release-managers]: /releases/release-managers/
[release-team]: https://git.k8s.io/sig-release/release-team
[sig-list]: https://k8s.dev/sigs
