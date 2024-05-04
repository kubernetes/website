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

## রিলিজ সাইকেল

![কুবারনেটিস রিলিজ সাইকেলের একটি ছবি](/images/releases/release-cycle.jpg)

 কুবারনেটিস রিলিজ বর্তমানে প্রতি বছর প্রায় তিনবার হয়।

রিলিজ প্রক্রিয়াটিকে তিনটি প্রধান পর্যায় হিসাবে বিবেচনা করা যেতে পারে:

- এনহ্যান্সমেন্ট ডেফিনেশন
- ইমপ্লিমেন্টেশন 
- স্ট্যাবিলাইজেশন 

কিন্তু বাস্তবে, এটি একটি ওপেন সোর্স এবং চটপটে প্রকল্প, ফিচার পরিকল্পনা
এবং বাস্তবায়ন সব সময়ে ঘটছে। প্রজেক্ট স্কেল এবং বিশ্বব্যাপী
ডিস্ট্রিবিউটেড ডেভেলপার বেস এর ফলে, এটি গুরুত্বপূর্ণ যে প্রজেক্টের গতি যেনো 
ট্রেইলিং স্টেবিলাইজেশন ফেজ এর উপর নির্ভর না করে এবং বরং ক্রমাগত ইন্টিগ্রেশন টেস্টিং চলমান থাকে
যা নিশ্চিত করে যে প্রকল্পটি সর্বদা স্থিতিশীল যাতে একজন ডেভেলপার কোন নির্দিষ্ট কমিটে কোন সমস্যা 
তৈরি করেছে তা চিহ্নিত করা যেতে পারে।

বছর ধরে চলমান ফিচার নির্ধারণের সাথে, কিছু আইটেম একটি নির্দিষ্ট রিলিজের 
লক্ষ্য হিসেবে উঠে আসবে। **[এনহ্যান্সমেন্ট ফ্রিজ][enhancements-freeze]**
রিলিজ সাইকেলের ~৪ সপ্তাহের মধ্যে শুরু হয়। এই মুহুর্তে সমস্ত উদ্দেশ্যমূলক ফিচার কাজ করে
প্রদত্ত রিলিজ উপযুক্ত পরিকল্পনা নিদর্শন মধ্যে সংজ্ঞায়িত করা হয়েছে
রিলিজ টিমের সাথে একযোগে [এনহ্যান্সমেন্ট লিড](https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md).

এনহ্যান্সমেন্ট ফ্রিজের পরে, PR এবং ইস্যুগুলোর মাইলস্টোন ট্র্যাক করা গুরুত্বপূর্ণ।
মাইলস্টোন থাকা আইটেমগুলি সম্পূর্ণ করার জন্য একটি পাঞ্চডাউন তালিকা হিসাবে ব্যবহৃত হয়
রিলিজের জন্য। *ইস্যুতে*, মাইলস্টোন অবশ্যই সঠিকভাবে প্রয়োগ করতে হবে, triage মাধ্যমে
SIG, যাতে [রিলিজ টিম][release-team] বাগ এবং এনহ্যান্সমন্ট ট্র্যাক করতে পারে (যেকোন
এনহ্যান্সমেন্ট-সম্পর্কিত ইস্যুর একটি মাইলস্টোন প্রয়োজন)।

PR এ স্বয়ংক্রিয়ভাবে মাইলফলক বরাদ্দ করতে সাহায্য করার জন্য কিছু অটোমেশন 
রয়েছে৷

এই অটোমেশনটি বর্তমানে নিম্নলিখিত রিপোতে প্রযোজ্য:

- `kubernetes/enhancements`
- `kubernetes/kubernetes`
- `kubernetes/release`
- `kubernetes/sig-release`
- `kubernetes/test-infra`

তৈরি করার সময়, `master` ব্রাঞ্চের বিপরীতে PR গুলোর মানুষের দেওয়া নির্দেশনা প্রয়োজন কোন 
মাইলস্টোন টার্গেট করতে হবে তার জন্য। একবার মার্জ হলে, 
`master` ব্রাঞ্চের বিপরীতে তৈরি করা PR গুলোয় মাইলস্টোন় স্বয়ংক্রিয়ভাবে প্রয়োগ করা হয় তাই সেই সময় থেকে
ওই PR এর মাইলস্টোনে মানুষের ব্যবস্থাপনা কম প্রয়োজনীয়। রিলিজ ব্রাঞ্চ এর বিপরীতে তৈরি PR এ, 
মাইলস্টোন সংক্রিয়ভাবে প্রয়োগ হয় তাই মানুষবিহীন 
ব্যবস্থাপনা মাইলস্টোনের জন্য সবসময় প্রয়োজন।

অন্য কোনো প্রচেষ্টা যা রিলিজ টিমের দ্বারা ট্র্যাক করা উচিত যা কোনো 
অটোমেশন আম্ব্রেলার অধীনে নেই তাতে একটি মাইলফলক প্রয়োগ করা উচিত।

ইমপ্লিমেন্টেশন এবং বাগ ফিক্সিং পুরো সাইকেল জুড়ে চলেছে, কিন্তু শেষ হয়
কোড-ফ্রিজ সময়কালে।

**[কোড ফ্রিজ][code-freeze]** শুরু হয় ~১২ সপ্তাহে এবং পরবর্তী ~২ সপ্তাহ পর্যন্ত চলে।
এই সময়ে রিলিজ কোডবেসে শুধুমাত্র গুরুত্বপূর্ণ বাগ ফিক্স গ্রহণ করা 
হয়।

Code Freeze এর পরে এবং রিলিজের পূর্বে প্রায় দুই সপ্তাহের সময় রয়েছে, যা রিলিজ পূর্বে 
সমস্ত অবশিষ্ট গুরুত্বপূর্ণ সমস্যাগুলি সমাধান করা আবশ্যক। 
এটি ডকুমেন্টেশন চূড়ান্ত করার জন্য সময় দেয়।

যখন কোড বেস স্টেবল হয়, তখন মাস্টার ব্রাঞ্চটি সাধারণ উন্নতির জন্য পুনরায় খোলা হয় 
এবং পরবর্তী রিলিজের মাইলস্টোনে কাজ সেখানে শুরু করা হয়। 
বর্তমান রিলিজের জন্য অবশিষ্ট যেকোনো সংশোধন মাস্টার থেকে রিলিজ ব্রাঞ্চে চেরি-পিক করা হয়। 
রিলিজ ব্রাঞ্চ থেকে রিলিজ তৈরি করা হয়।

প্রত্যেকটি রিলিজ একটি বৃহৎ কুবারনেটিস লাইফসাইকের অংশ:

![কুবারনেটস রিলিজ লাইফসাইকেলের ছবি তিনটি রিলিজ বিস্তৃত](/images/releases/release-lifecycle.jpg)

## মাইলস্টোন থেকে আইটেম অপসারণ

মাইলস্টোন আইটেম যোগ করার প্রক্রিযার অধিক দূরে যাওয়ার আগে, 
দয়া করে লক্ষ্য করুন:

[রিলিজ টিম][release-team] এর সদস্যরা মাইলস্টোন থেকে ইস্যু সরাতে পারে
যদি তারা অথবা যদি দায়িত্বশীল SIG মনে করে যে সমস্যাটি বাস্তবে রিলিজ ব্লক 
করছে না এবং সম্ভবত সময়ের মধ্যে সমাধান হবে
না।

রিলিজ দলের সদস্যরা নিম্নলিখিত কারণে অথবা এর সমান কারণে মাইলস্টোন থেকে 
PR-গুলি সরাতে পারেন:

- PR সম্ভবত অস্থিতিশীল এবং ব্লকিং সমস্যা সমাধানের প্রয়োজন
  নেই
- নতুন PR, লেট ফিচার PR এবং এনহ্যান্সমেন্ট প্রক্রিয়ার
  অথবা [এক্সেপশন প্রক্রিয়া][exceptions] এর মধ্যে যায় নি
- পিআর এর মালিকানা নিতে এবং এটির সাথে কোন ফলো-আপ সমস্যা সমাধান করতে
  ইচ্ছুক কোন দায়িত্বশীল SIG নেই
- PR সঠিকভাবে লেবেল করা হয় না
- PR-এ কাজ দৃশ্যত থেমে গেছে এবং ডেলিভারির তারিখ অনিশ্চিত বা দেরি হবে

রিলিজ টিমের সদস্যরা লেবেলিং এবং SIG দের সাথে যোগাযোগে সাহায্য 
করবে,PR কে শ্রেণীবদ্ধ করা জমাদানকারীর দায়িত্ব এবং
প্রাসঙ্গিক SIG হতে সাহায্য নিশ্চিত করা যেনো PR দ্বারা কোনো ব্রেক হলে 
ধ্রুত সমাধানের গ্যারেন্টি দেওয়া হবে।

যেখানে অতিরিক্ত পদক্ষেপ প্রয়োজন, রিলিজ দল নিম্নলিখিত 
চ্যানেলের মাধ্যমে মানুষ থেকে মানুষে এস্ক্যালেশনের চেষ্টা করবে:

- Comment in GitHub mentioning the SIG team and SIG members as appropriate for
  the issue type
- Emailing the SIG mailing list
  - bootstrapped with group email addresses from the
    [community sig list][sig-list]
  - optionally also directly addressing SIG leadership or other SIG members
- Messaging the SIG's Slack channel
  - bootstrapped with the slackchannel and SIG leadership from the
    [community sig list][sig-list]
  - optionally directly "@" mentioning SIG leadership or others by handle

## মাইলস্টোনে একটি আইটেম সংযোজন

### Milestone Maintainers

The members of the [`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
GitHub team are entrusted with the responsibility of specifying the release
milestone on GitHub artifacts.

This group is [maintained](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers)
by SIG Release and has representation from the various SIGs' leadership.

### Feature additions

Feature planning and definition takes many forms today, but a typical example
might be a large piece of work described in a [KEP][keps], with associated task
issues in GitHub. When the plan has reached an implementable state and work is
underway, the enhancement or parts thereof are targeted for an upcoming milestone
by creating GitHub issues and marking them with the Prow "/milestone" command.

For the first ~4 weeks into the release cycle, the Release Team's Enhancements
Lead will interact with SIGs and feature owners via GitHub, Slack, and SIG
meetings to capture all required planning artifacts.

If you have an enhancement to target for an upcoming release milestone, begin a
conversation with your SIG leadership and with that release's Enhancements
Lead.

### Issue additions

Issues are marked as targeting a milestone via the Prow "/milestone" command.

The Release Team's [Bug Triage Lead](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md)
and overall community watch incoming issues and triage them, as described in
the contributor guide section on
[issue triage](https://k8s.dev/docs/guide/issue-triage/).

Marking issues with the milestone provides the community better visibility
regarding when an issue was observed and by when the community feels it must be
resolved. During [Code Freeze][code-freeze], a milestone must be set to merge
a PR.

An open issue is no longer required for a PR, but open issues and associated
PRs should have synchronized labels. For example a high priority bug issue
might not have its associated PR merged if the PR is only marked as lower
priority.

### PR Additions

PRs are marked as targeting a milestone via the Prow "/milestone" command.

This is a blocking requirement during Code Freeze as described above.

## Other Required Labels

[Here is the list of labels and their use and purpose.](https://git.k8s.io/test-infra/label_sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)

### SIG Owner Label

The SIG owner label defines the SIG to which we escalate if a milestone issue
is languishing or needs additional attention. If there are no updates after
escalation, the issue may be automatically removed from the milestone.

These are added with the Prow "/sig" command. For example to add the label
indicating SIG Storage is responsible, comment with `/sig storage`.

### Priority Label

Priority labels are used to determine an escalation path before moving issues
out of the release milestone. They are also used to determine whether or not a
release should be blocked on the resolution of the issue.

- `priority/critical-urgent`: Never automatically move out of a release
  milestone; continually escalate to contributor and SIG through all available
  channels.
  - considered a release blocking issue
  - requires daily updates from issue owners during [Code Freeze][code-freeze]
  - would require a patch release if left undiscovered until after the minor
    release
- `priority/important-soon`: Escalate to the issue owners and SIG owner; move
  out of milestone after several unsuccessful escalation attempts.
  - not considered a release blocking issue
  - would not require a patch release
  - will automatically be moved out of the release milestone at Code Freeze
    after a 4 day grace period
- `priority/important-longterm`: Escalate to the issue owners; move out of the
  milestone after 1 attempt.
  - even less urgent / critical than `priority/important-soon`
  - moved out of milestone more aggressively than `priority/important-soon`

### ইস্যু/PR Kind Label

The issue kind is used to help identify the types of changes going into the
release over time. This may allow the Release Team to develop a better
understanding of what sorts of issues we would miss with a faster release
cadence.

রিলিজ টার্গেট করা সমস্যাগুলির জন্য, পুল অনুরোধ সহ, নিম্নলিখিত একটি
সমস্যা ধরনের লেবেল সেট করা আবশ্যক:

- `kind/api-change`: একটি API যোগ করে, অপসারণ করে বা পরিবর্তন করে।
- `kind/bug`: একটি নতুন আবিষ্কৃত বাগ সংশোধন করে।
- `kind/cleanup`: টেস্ট যোগ করা, রিফ্যাক্টরিং, পুরানো বাগ ঠিক করা।
- `kind/design`: ডিজাইনের সাথে সম্পর্কিত।
- `kind/documentation`: ডকুমেন্টেশন যোগ করে।
- `kind/failing-test`: CI টেস্ট কেস ধারাবাহিকভাবে ব্যর্থ হয়।
- `kind/feature`: নতুন ফিচার।
- `kind/flake`: CI টেস্ট কেস মাঝে মাঝে ব্যর্থতা দেখাচ্ছে।

[cherry-picks]: https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md
[code-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#code-freeze
[enhancements-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#enhancements-freeze
[exceptions]: https://git.k8s.io/sig-release/releases/release_phases.md#exceptions
[keps]: https://git.k8s.io/enhancements/keps
[release-managers]: /releases/release-managers/
[release-team]: https://git.k8s.io/sig-release/release-team
[sig-list]: https://k8s.dev/sigs
