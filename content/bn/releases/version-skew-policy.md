---
reviewers:
- sig-api-machinery
- sig-architecture
- sig-cli
- sig-cluster-lifecycle
- sig-node
- sig-release
title: সংস্করণ স্কেও(Skew) নীতি
type: docs
description: >
  বিভিন্ন কুবারনেটিসের উপাদানগুলির মধ্যে সমর্থিত সর্বাধিক সংস্করণ স্ক্যু(skew)।
---

<!-- overview -->
এই ডকুমেন্টটি বিভিন্ন কুবারনেটিসের উপাদানগুলির মধ্যে সমর্থিত সর্বাধিক সংস্করণ স্ক্যু(skew) বর্ণনা করে।
নির্দিষ্ট ক্লাস্টার সরঞ্জামগুলি সংস্করণ স্ক্যুতে(skew) অতিরিক্ত সীমাবদ্ধতা স্থাপন করতে পারে৷

<!-- body -->

## সমর্থিত সংস্করণগুলি

কুবারনেটিস সংস্করণ **x.y.z** হিসাবে প্রকাশ করা হয়,
যেখানে **x** হল মুখ্য সংস্করণ, **y** হল গৌণ সংস্করণ এবং **z** হল প্যাচ ভার্সন (patch version),
যা [শব্দার্থিক সংস্করণ](https://semver.org/) পরিভাষা অনুসরণ করে হয়। অতিরিক্ত তথ্যসমূহের জন্য, দেখুন
[কুবারনেটিস রিলিজ সংস্করণ](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning)।

কুবারনেটিস প্রজেক্ট সাম্প্রতিক তিনটি পর্যন্ত ছোট রিলিজের জন্য রিলিজ শাখা বজায় রাখে
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}})।
কুবারনেটিস 1.19 এবং নতুন ভার্সন [আনুমানিক 1 বছরের প্যাচ সাপোর্ট পায়(patch support)](/bn/releases/patch-releases/#support-period)
কুবারনেটিস 1.18 এবং তার বেশি বয়সীরা প্রায় 9 মাস প্যাচ সাপোর্ট (patch support) পেয়েছে।

প্রযোজ্য সংশোধন, নিরাপত্তা সংশোধন সহ, তীব্রতা এবং সম্ভাব্যতার উপর নির্ভর করে,
সেই তিনটি রিলিজ শাখায় ব্যাকপোর্ট করা যেতে পারে। প্যাচ রিলিজগুলি এই শাখাগুলি থেকে একটি
[নিয়মিত ক্যাডেন্স](/bn/releases/patch-releases/#cadence) এ কাটা হয়, এবং প্রয়োজনে অতিরিক্ত জরুরী রিলিজগুলি।

এ [রিলিজ ম্যানেজার](/bn/releases/release-managers/) গ্রুপ এই সিদ্ধান্তের মালিক।

আরও তথ্যের জন্য, কুবারনেটিস [প্যাচ রিলিজ](/bn/releases/patch-releases/) পৃষ্ঠাটি দেখুন।

## সমর্থিত সংস্করণ স্ক্যু(skew)

### কুবে-এপিসার্ভার (kube-apiserver)

[অত্যন্ত-উপলব্ধ (HA) ক্লাস্টারে](/bn/docs/setup/production-environment/tools/kubeadm/high-availability/),,
নতুন এবং প্রাচীনতম `kube-apiserver` উদাহরণগুলি অবশ্যই একটি ছোট সংস্করণের মধ্যে থাকতে হবে৷

উদাহরণ:









