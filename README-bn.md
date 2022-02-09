# Kubernetes ডকুমেন্টেশন

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

স্বাগত! এই সংগ্রহস্থলে [Kubernetes ওয়েবসাইট এবং ডকুমেন্টেশন](https://kubernetes.io/) তৈরি করার জন্য প্রয়োজনীয় সমস্ত উপাদান রয়েছে। আমরা খুবই আনন্দিত যে আপনি অবদান রাখতে চান!


- [ডকুমেন্টেশন এ অবদান](#contributing-to-the-docs)
- [স্থানীয়করণ ReadMeগুলি](#localization-readmemds)

## `README.md` এর স্থানীয়করণ কুবারনেটস ডকুমেন্টেশন
আপনি বাংলা স্থানীয়করণের রক্ষণাবেক্ষণকারীদের (maintainers) কাছে পৌঁছাতে পারেন:
* MD Shahriyar Al Mustakim Mitul ([LinkedIn](https://www.linkedin.com/in/md-shahriyar-al-mustakim-mitul-9084b31a0/), [Twitter](https://twitter.com/ShahriyarMitul), [GitHub](https://github.com/mitul3737))
* [Slack চ্যানেল](https://kubernetes.slack.com/messages/kubernetes-docs-bn)



## এই সংগ্রহস্থল ব্যবহার করে


আপনি Hugo (বর্ধিত সংস্করণ) ব্যবহার করে স্থানীয়ভাবে ওয়েবসাইটটি চালাতে পারেন, অথবা আপনি এটি একটি কন্টেইনার রানটাইমে চালাতে পারেন। আমরা দৃঢ়ভাবে কন্টেইনার রানটাইম ব্যবহার করার পরামর্শ দিই, কারণ এটি লাইভ ওয়েবসাইটের সাথে স্থাপনার ধারাবাহিকতা দেয়।

## পূর্বশর্ত

এই সংগ্রহস্থলটি(repository) ব্যবহার করার জন্য, আপনাকে লোকাল সিস্টেম বা, ডিভাইস এ নিম্নলিখিত জিনিস ইনস্টল করতে হবে:

- [npm](https://www.npmjs.com/)
- [Go](https://golang.org/)
- [Hugo (বর্ধিত সংস্করণ)](https://gohugo.io/)
- একটি ধারক রানটাইম, উদাহরন হিসেবে [Docker](https://www.docker.com/).

আপনি কাজ শুরু করার আগে, দরকারি জিনিশগুলি ইনস্টল করুন। সংগ্রহস্থল ক্লোন(clone) করুন এবং ডিরেক্টরিতে(directory) প্রবেশ করুন:
```bash
git clone https://github.com/kubernetes/website.git
cd website
```

কুবারনেটিস ওয়েবসাইটটি [Docsy Hugo থিম](https://github.com/google/docsy#readme) ব্যবহার করে। এমনকি যদি আপনি একটি কনটেইনার ওয়েবসাইট চালানোর পরিকল্পনা করেন, আমরা দৃঢ়ভাবে নিম্নলিখিতগুলি চালিয়ে সাবমডিউল এবং অন্যান্য প্রয়োজনীয় জিনিসগুলিশগুলি  পুল(pull) করার পরামর্শ দিই:


```bash
# ডকসি সাবমডিউল পুল করুন
git submodule update --init --recursive --depth 1
```

## একটি কনটেইনার ব্যবহার করে ওয়েবসাইট চালানো

একটি  কনটেইনারে  সাইটটি তৈরি করতে, কনটেইনার চিত্র(container image) তৈরি করতে এবং এটি চালাতে নিম্নলিখিতটি চালান:

```bash
make container-image
make container-serve
```

আপনি যদি ত্রুটি দেখতে পান, তাহলে সম্ভবত এর অর্থ হল Hugo কন্টেইনারে যথেষ্ট কম্পিউটিং স্থান উপস্থিত ছিল না। এটি সমাধান করতে, আপনার মেশিনে ডকারের (Docker) জন্য অনুমোদিত CPU এবং মেমরি ব্যবহারের পরিমাণ বাড়ান [MacOSX](https://docs.docker.com/docker-for-mac/#resources) এবং [Windows](https://docs.docker.com/docker-for-windows/#resources)

ওয়েবসাইটটি দেখতে <http://localhost:1313>-এ আপনার ব্রাউজার খুলুন। আপনি সোর্স ফাইলগুলিতে পরিবর্তন করার সাথে সাথে, Hugo ওয়েবসাইট আপডেট করে এবং একটি ব্রাউজার রিফ্রেশ করতে বাধ্য করে।

## Hugo ব্যবহার করে লোকাল ডিভাইস এ ওয়েবসাইট চালানো

নিশ্চিত করুন যে Hugo বর্ধিত সংস্করণ ইনস্টল করা হয়েছে `HUGO_VERSION`নামক এনভায়রনমেন্ট ভেরিয়েবল দ্বারা[`netlify.toml`](netlify.toml#L10)

স্থানীয়ভাবে সাইট তৈরি এবং পরীক্ষা করতে, চালান:

```bash
# নির্ভরতা গুলি ইনস্টল করুন
npm ci
make serve
```

এটি পোর্ট 1313-এ স্থানীয় হুগো সার্ভার শুরু করবে। ওয়েবসাইট দেখতে <http://localhost:1313>-এ আপনার ব্রাউজার খুলুন। আপনি সোর্স ফাইলগুলিতে পরিবর্তন করার সাথে সাথে, Hugo ওয়েবসাইট আপডেট হবে এবং একটি ব্রাউজার রিফ্রেশ করতে বাধ্য করে।


## API রেফারেন্স পৃষ্ঠা তৈরি করা


`content/en/docs/reference/kubernetes-api` এ অবস্থিত API রেফারেন্স পৃষ্ঠাগুলি <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs> ব্যবহার করে Swagger স্পেসিফিকেশন থেকে তৈরি করা হয়েছে

একটি নতুন কুবারনেটিস(Kubernetes) রিলিজের জন্য রেফারেন্স পৃষ্ঠাগুলি আপডেট করতে এই পদক্ষেপগুলি অনুসরণ করুন:

1. `api-ref-generator` সাবমডিউল পুল (Pull) করুন:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Swagger স্পেসিফিকেশন আপডেট করুন:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. `api-ref-assets/config/`-এ, নতুন রিলিজের পরিবর্তনগুলি প্রতিফলিত করতে `toc.yaml` এবং `fields.yaml` ফাইলগুলিকে  হালনাগাদ  করে নিন।


4. পরবর্তী, পৃষ্ঠাগুলি তৈরি করুন:

   ```bash
   make api-reference
   ```

  আপনি একটি কনটেইনার চিত্র (Container image) থেকে সাইট তৈরি এবং পরিবেশন করে স্থানীয়ভাবে ফলাফল পরীক্ষা করতে পারেন:

   ```bash
   make container-image
   make container-serve
   ```

   একটি ওয়েব ব্রাউজারে, API রেফারেন্স দেখতে <http://localhost:1313/docs/reference/kubernetes-api/> এ যান।

5.যখন নতুন চুক্তির সমস্ত পরিবর্তন কনফিগারেশন ফাইল `toc.yaml` এবং `fields.yaml`-এ প্রতিফলিত হয়, তখন নতুন জেনারেট করা API রেফারেন্স পৃষ্ঠাগুলির সাথে একটি পুল অনুরোধ (Pull request) তৈরি করুন।


## সমস্যা সমাধান

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version


প্রযুক্তিগত কারণে হুগোকে দুই সেট বাইনারিতে পাঠানো হয়েছে। বর্তমান ওয়েবসাইটটি শুধুমাত্র **Hugo Extended** সংস্করণের উপর ভিত্তি করে চলে। [রিলিজ পৃষ্ঠা](https://github.com/gohugoio/hugo/releases) নামের মধ্যে `বর্ধিত(extended)` সহ সংরক্ষণাগারগুলি খুঁজুন। নিশ্চিত করতে, `হুগো সংস্করণ (hugo version)` চালান এবং `বর্ধিত (extended)` শব্দটি সন্ধান করুন।


### অনেকগুলি খোলা ফাইলের জন্য macOS সমস্যা সমাধান করা হচ্ছে

আপনি যদি macOS-এ `make serve` চালান এবং নিম্নলিখিত ত্রুটি পান:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

খোলা ফাইলগুলির জন্য বর্তমান সীমা পরীক্ষা করার চেষ্টা করুন:

`launchctl limit maxfiles`

তারপর নিম্নলিখিত কমান্ডগুলি চালান (<https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c> থেকে নেয়া):

```shell
#!/bin/sh
# নিচের গুলি মূল সারাংশ(gist) লিঙ্ক, এবং আমার সারাংশ(gist) লিঙ্ক এর সাথে সম্পর্ক স্থাপন করি.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist
sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons
sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist
sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```


এটি ক্যাটালিনার(Catalina) পাশাপাশি Mojave macOS এর জন্য কাজ করে।

## SIG ডক্সের সাথে জড়িত হন

[কমিউনিটি পৃষ্ঠা](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) এ SIG ডক্স কুবারনেটিস সম্প্রদায় এবং মিটিং সম্পর্কে আরও জানুন।

এছাড়াও আপনি এই প্রকল্পের রক্ষণাবেক্ষণকারীদের কাছে পৌঁছাতে পারেন:
- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [এই Slack এর জন্য একটি আমন্ত্রণ পান](https://slack.k8s.io/)
- [মেইলিং তালিকা](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## ডক্স এ অবদান রাখুন

আপনি আপনার GitHub অ্যাকাউন্টে এই সংগ্রহস্থলের (repository) একটি অনুলিপি তৈরি করতে স্ক্রিনের উপরের ডানদিকে **Fork** বোতামে ক্লিক করতে পারেন। এই অনুলিপিটিকে _ফর্ক(fork)_ বলা হয়। আপনার ফর্কটতিতে আপনি যে কোনো পরিবর্তন করতে চান এবং আপনি যখন সেই পরিবর্তনগুলি আমাদের কাছে পাঠাতে প্রস্তুত হন, তখন আপনার ফর্কে যান এবং এটি সম্পর্কে আমাদের জানাতে একটি নতুন পুল অনুরোধ (Pull request) তৈরি করুন৷

একবার আপনার পুল অনুরোধ(Pull request) তৈরি হয়ে গেলে, একজন Kubernetes পর্যালোচক স্পষ্ট, কার্যকর প্রতিক্রিয়া প্রদানের দায়িত্ব নেবেন। পুল অনুরোধের মালিক হিসাবে, **কুবারনেটস (Kubernetes) পর্যালোচক আপনাকে যে প্রতিক্রিয়া প্রদান করেছেন তা সমাধান করার জন্য আপনার পুল অনুরোধ (Pull request) সংশোধন করার দায়িত্ব আপনার।**


এছাড়াও, মনে রাখবেন যে আপনার কাছে একাধিক Kubernetes পর্যালোচক আপনাকে প্রতিক্রিয়া প্রদান করতে পারেন বা আপনি একজন Kubernetes পর্যালোচকের কাছ থেকে প্রতিক্রিয়া পেতে পারেন যা আপনাকে প্রতিক্রিয়া প্রদানের জন্য প্রাথমিকভাবে নির্ধারিত একটি থেকে আলাদা।


তদুপরি, কিছু ক্ষেত্রে, আপনার একজন পর্যালোচক প্রয়োজনের সময় একজন কুবারনেটস কারিগরি পর্যালোচনাকারীর কাছ থেকে প্রযুক্তিগত পর্যালোচনা চাইতে পারেন। পর্যালোচকরা যথাসময়ে প্রতিক্রিয়া প্রদানের জন্য তাদের যথাসাধ্য চেষ্টা করবেন কিন্তু প্রতিক্রিয়ার সময় পরিস্থিতির উপর ভিত্তি করে পরিবর্তিত হতে পারে।

Kubernetes ডকুমেন্টেশনে অবদান সম্পর্কে আরও তথ্যের জন্য, দেখুন:
- [কুবারনেটিস ডক্সে অবদান রাখুন](https://kubernetes.io/docs/contribute/)
- [পৃষ্ঠা বিষয়বস্তুর প্রকার](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [ডকুমেন্টেশন শৈলী গাইড](https://kubernetes.io/docs/contribute/style/style-guide/)
- [কুবারনেটিস ডকুমেন্টেশন স্থানীয়করণ](https://kubernetes.io/docs/contribute/localization/)



## আচরণ বিধি

Kubernetes সম্প্রদায়ে অংশগ্রহণ [CNCF কোড অফ কন্ডাক্ট](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) দ্বারা পরিচালিত হয়।

## ধন্যবাদ

Kubernetes সম্প্রদায়ের অংশগ্রহণে উন্নতি লাভ করে, এবং আমরা আমাদের ওয়েবসাইট এবং আমাদের ডকুমেন্টেশনে আপনার অবদানের প্রশংসা করি!



