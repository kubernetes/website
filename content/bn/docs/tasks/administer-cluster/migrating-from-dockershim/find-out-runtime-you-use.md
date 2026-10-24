---
title: একটি Node এ কোন কন্টেইনার রানটাইম ব্যবহার করা হয় তা খুঁজে বের করুন
content_type: task
reviewers:
- SergeyKanzhelev
weight: 30
---

<!-- overview -->

এই পৃষ্ঠাটি আপনার ক্লাস্টারের Node গুলি কোন [কন্টেইনার রানটাইম](/bn/docs/setup/production-environment/container-runtimes/)
ব্যবহার করে তা খুঁজে বের করার ধাপগুলি রূপরেখা দেয়।

আপনি আপনার ক্লাস্টার চালানোর উপায়ের উপর নির্ভর করে, Node এর জন্য কন্টেইনার রানটাইম
প্রি-কনফিগার করা থাকতে পারে বা আপনাকে এটি কনফিগার করতে হতে পারে। যদি আপনি একটি ম্যানেজড
কুবারনেটিস সার্ভিস ব্যবহার করেন, Node এর জন্য কোন কন্টেইনার রানটাইম কনফিগার করা আছে তা চেক করার জন্য ভেন্ডর-নির্দিষ্ট উপায় থাকতে পারে। এই পৃষ্ঠায় বর্ণিত পদ্ধতিটি যখনই
`kubectl` এর এক্সিকিউশন অনুমোদিত হয় তখন কাজ করা উচিত।

## {{% heading "prerequisites" %}}

`kubectl` ইনস্টল এবং কনফিগার করুন। বিস্তারিত জানতে [টুল ইনস্টল করুন](/bn/docs/tasks/tools/#kubectl) বিভাগ দেখুন।

## একটি Node এ ব্যবহৃত কন্টেইনার রানটাইম খুঁজে বের করুন

Node তথ্য ফেচ এবং দেখাতে `kubectl` ব্যবহার করুন:

```shell
kubectl get nodes -o wide
```

আউটপুট নিম্নলিখিতটির অনুরূপ। `CONTAINER-RUNTIME` কলাম
রানটাইম এবং এর ভার্সন আউটপুট করে।

Docker Engine এর জন্য, আউটপুট এরকম:

```none
NAME         STATUS   VERSION    CONTAINER-RUNTIME
node-1       Ready    v1.16.15   docker://19.3.1
node-2       Ready    v1.16.15   docker://19.3.1
node-3       Ready    v1.16.15   docker://19.3.1
```
যদি আপনার রানটাইম Docker Engine হিসাবে দেখায়, আপনি এখনও কুবারনেটিস v1.24 এ dockershim অপসারণ দ্বারা প্রভাবিত নাও হতে পারেন।
আপনি dockershim ব্যবহার করেন কিনা তা দেখতে [রানটাইম এন্ডপয়েন্ট চেক করুন](#which-endpoint)।
যদি আপনি dockershim ব্যবহার না করেন, আপনি প্রভাবিত নন।

containerd এর জন্য, আউটপুট এরকম:

```none
NAME         STATUS   VERSION   CONTAINER-RUNTIME
node-1       Ready    v1.19.6   containerd://1.4.1
node-2       Ready    v1.19.6   containerd://1.4.1
node-3       Ready    v1.19.6   containerd://1.4.1
```

কন্টেইনার রানটাইম সম্পর্কে আরও তথ্য
[কন্টেইনার রানটাইম](/bn/docs/setup/production-environment/container-runtimes/)
পৃষ্ঠায় খুঁজে পান।

## আপনি কোন কন্টেইনার রানটাইম এন্ডপয়েন্ট ব্যবহার করেন তা খুঁজে বের করুন {#which-endpoint}

কন্টেইনার রানটাইম [CRI
প্রোটোকল](/bn/docs/concepts/architecture/cri/) ব্যবহার করে একটি Unix সকেটের মাধ্যমে kubelet এর সাথে কথা বলে, যা gRPC
ফ্রেমওয়ার্কের উপর ভিত্তি করে। kubelet একটি ক্লায়েন্ট হিসাবে কাজ করে, এবং রানটাইম একটি সার্ভার হিসাবে কাজ করে।
কিছু ক্ষেত্রে, আপনার Node গুলি কোন সকেট ব্যবহার করে তা জানা উপযোগী হতে পারে। উদাহরণস্বরূপ, কুবারনেটিস v1.24 এবং পরবর্তীতে dockershim অপসারণের সাথে, আপনি
জানতে চাইতে পারেন যে আপনি dockershim সহ Docker Engine ব্যবহার করেন কিনা।

{{<note>}}
যদি আপনি বর্তমানে `cri-dockerd` সহ আপনার Node এ Docker Engine ব্যবহার করেন, আপনি
dockershim অপসারণ দ্বারা প্রভাবিত নন।
{{</note>}}

আপনি আপনার Node এ kubelet কনফিগারেশন চেক করে কোন সকেট ব্যবহার করেন তা চেক করতে পারেন।

1.  kubelet প্রসেসের জন্য স্টার্টিং কমান্ড পড়ুন:

    ```
    tr \\0 ' ' < /proc/"$(pgrep kubelet)"/cmdline
    ```
    যদি আপনার `tr` বা `pgrep` না থাকে, kubelet
    প্রসেসের জন্য কমান্ড লাইন ম্যানুয়ালি চেক করুন।

1.  আউটপুটে, `--container-runtime` ফ্ল্যাগ এবং
    `--container-runtime-endpoint` ফ্ল্যাগ খুঁজুন।

    *   যদি আপনার Node কুবারনেটিস v1.23 এবং তার আগের ব্যবহার করে এবং এই ফ্ল্যাগগুলি
        উপস্থিত না থাকে বা যদি `--container-runtime` ফ্ল্যাগ `remote` না হয়,
        আপনি Docker Engine সহ dockershim সকেট ব্যবহার করেন। `--container-runtime` কমান্ড লাইন
        আর্গুমেন্ট কুবারনেটিস v1.27 এবং পরবর্তীতে উপলব্ধ নয়।
    *   যদি `--container-runtime-endpoint` ফ্ল্যাগ উপস্থিত থাকে, আপনি কোন রানটাইম ব্যবহার করেন তা খুঁজে বের করতে সকেট
        নাম চেক করুন। উদাহরণস্বরূপ,
        `unix:///run/containerd/containerd.sock` হল containerd এন্ডপয়েন্ট।

যদি আপনি একটি Node এ Docker Engine থেকে containerd এ কন্টেইনার রানটাইম পরিবর্তন করতে চান,
আপনি [Docker Engine থেকে containerd এ মাইগ্রেট করা](/bn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/) সম্পর্কে আরও তথ্য খুঁজে পেতে পারেন,
বা, যদি আপনি কুবারনেটিস v1.24 এবং পরবর্তীতে Docker Engine ব্যবহার চালিয়ে যেতে চান, একটি
CRI-সামঞ্জস্যপূর্ণ অ্যাডাপ্টারে মাইগ্রেট করুন যেমন [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd)।
