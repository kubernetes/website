---
layout: blog
title: "কুবারনেটিস 1.29: পারসিস্টেন্টভলিউম গ্র্যাজুয়েটদের জন্য একক পড অ্যাক্সেস মোড"
date: 2023-12-18
slug: read-write-once-pod-access-mode-ga
author: >
  Chris Henzie (Google)
---

Kubernetes v1.29 প্রকাশের সাথে, ReadWriteOncePod ভলিউম অ্যাক্সেস মোড 
সবার জন্য গ্র্যাজুয়েট হয়েছে: এটি কুবারনেটিস এর স্থিতিশীল API এর অংশ। 
এই ব্লগ পোস্টে, আমি এই অ্যাক্সেস মোড এবং এটি কী করে তা আরও ঘনিষ্ঠভাবে দেখব।

## `ReadWriteOncePod` কি?

`ReadWriteOncePod` হলো 
[পারসিস্টেন্টভলিউম(PersistentVolumes (PVs))](/docs/concepts/storage/persistent-volumes/#persistent-volumes) এবং 
[পারসিস্টেন্টভলিউমক্লেমস(PersistentVolumeClaims (PVCs))](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
এর জন্য একটি অ্যাক্সেস মোড যা কুবারনেটিস v1.22-এ চালু করা হয়েছে। এই অ্যাক্সেস মোড 
আপনাকে ক্লাস্টারে একটি একক পডে ভলিউম অ্যাক্সেস সীমাবদ্ধ করতে সক্ষম করে, এটি নিশ্চিত 
করে যে একটি সময়ে শুধুমাত্র একটি পড ভলিউমে লিখতে পারে। এটি স্টেটফুল ওয়ার্কলোডগুলির 
জন্য বিশেষভাবে উপযোগী হতে পারে যার জন্য স্টোরেজে একক-লেখকের অ্যাক্সেস প্রয়োজন।

অ্যাক্সেস মোড এবং `ReadWriteOncePod` কীভাবে কাজ করে সে সম্পর্কে আরও প্রসঙ্গের জন্য পড়ুন 
[অ্যাক্সেস মোডগুলি কী এবং কেন সেগুলি গুরুত্বপূর্ণ?](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#what-are-access-modes-and-why-are-they-important) 
2021 থেকে পারসিস্টেন্টভলিউম নিবন্ধের জন্য একক পড অ্যাক্সেস মোড প্রবর্তন করা হয়েছে ।

## কিভাবে আমি `ReadWriteOncePod` ব্যবহার শুরু করতে পারি?

ReadWriteOncePod ভলিউম অ্যাক্সেস মোড ডিফল্টরূপে কুবারনেটিস ভার্সন v1.27 
এবং তার পরে উপলব্ধ। কুবারনেটিস v1.29 এবং পরবর্তীতে, কুবারনেটিস API 
সর্বদা এই অ্যাক্সেস মোডকে স্বীকৃতি দেয়।

মনে রাখবেন যে `ReadWriteOncePod` 
[শুধুমাত্র CSI ভলিউমগুলির জন্য সাপোর্টেড](/docs/concepts/storage/persistent-volumes/#access-modes), 
এবং এই বৈশিষ্ট্যটি ব্যবহার করার আগে, আপনাকে নিম্নলিখিত 
[CSI সাইডকারগুলিকে](https://kubernetes-csi.github.io/docs/sidecar-containers.html)
এই ভার্সনগুলিতে বা তার বেশি আপডেট করতে হবে:

- [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
- [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
- [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)

`ReadWriteOncePod` ব্যবহার শুরু করতে, আপনাকে `ReadWriteOncePod` 
অ্যাক্সেস মোড সহ একটি PVC তৈরি করতে হবে:

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: single-writer-only
spec:
  accessModes:
  - ReadWriteOncePod # Allows only a single pod to access single-writer-only.
  resources:
    requests:
      storage: 1Gi
```

যদি আপনার স্টোরেজ প্লাগইন 
[ডায়নামিক প্রভিশনিং সাপোর্টে করে](/docs/concepts/storage/dynamic-provisioning/), 
তাহলে `ReadWriteOncePod` অ্যাক্সেস মোড প্রয়োগ করে নতুন 
পারসিস্টেন্টভলিউম তৈরি করা হবে।

`ReadWriteOncePod` ব্যবহার করার জন্য বিদ্যমান ভলিউম স্থানান্তরিত করার বিশদ বিবরণের জন্য
[বিদ্যমান পারসিস্টেন্টভলিউম স্থানান্তর করা](/blog/2021/09/13/read-write-once-pod-access-mode-alpha/#migrating-existing-persistentvolumes) পড়ুন ।

## আমি কীভাবে আরও শিখতে পারি?

`ReadWriteOncePod` অ্যাক্সেস মোড এবং CSI স্পেক পরিবর্তনের প্রেরণা সম্পর্কে 
আরও বিশদ বিবরণের জন্য অনুগ্রহ করে ব্লগ পোস্টগুলি 
[alpha](/blog/2021/09/13/read-write-once-pod-access-mode-alpha), 
[beta](/blog/2023/04/20/read-write-once-pod-access-mode-beta), এবং 
[KEP-2485](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/2485-read-write-once-pod-pv-access-mode/README.md) দেখুন৷ 

## আমি কিভাবে জড়িত হতে পারি?

[কুবারনেটিস #csi স্ল্যাক চ্যানেল](https://kubernetes.slack.com/messages/csi) এবং 
যে কোনো স্ট্যান্ডার্ড 
[SIG স্টোরেজ কমিউনিকেশন চ্যানেল](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) 
হলো SIG স্টোরেজ এবং CSI টিমের কাছে পৌঁছানোর দুর্দান্ত পদ্ধতি।

নিম্নলিখিত ব্যক্তিদের বিশেষ ধন্যবাদ যাদের চিন্তাশীল পর্যালোচনা এবং প্রতিক্রিয়া এই বৈশিষ্ট্যটি গঠনে সহায়তা করেছে:

* Abdullah Gharaibeh (ahg-g)
* Aldo Culquicondor (alculquicondor)
* Antonio Ojea (aojea)
* David Eads (deads2k)
* Jan Šafránek (jsafrane)
* Joe Betz (jpbetz)
* Kante Yin (kerthcet)
* Michelle Au (msau42)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)

আপনি যদি CSI বা কুবারনেটিস স্টোরেজ সিস্টেমের যেকোন অংশের ডিজাইন 
এবং বিকাশের সাথে জড়িত হতে আগ্রহী হন, তাহলে 
[কুবারনেটিস স্টোরেজ স্পেশাল ইন্টারেস্ট গ্রুপে](https://github.com/kubernetes/community/tree/master/sig-storage) (Special Interest Group(SIG)) যোগ দিন। 
আমরা দ্রুত বৃদ্ধি করছি এবং সবসময় নতুন অবদানকারীদের স্বাগত জানাই।
