# Kubernetes ডকুমেন্টেশন

[![নেটলিফাই স্ট্যাটাস](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub রিলিজ](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

এই সংগ্রহস্থলে [Kubernetes ওয়েবসাইট এবং ডকুমেন্টেশন](https://kubernetes.io/) তৈরি করার জন্য প্রয়োজনীয় সম্পদ রয়েছে। আমরা আনন্দিত যে আপনি অবদান রাখতে চান!

- [অবদানের Docs](#contributing-to-the-docs)
- [স্থানীয়করণ ReadMes](#localization-readmemds)

## এই সংগ্রহস্থল ব্যবহার করে

আপনি স্থানীয়ভাবে [Hugo (বর্ধিত সংস্করণ)](https://gohugo.io/) ব্যবহার করে ওয়েবসাইটটি চালাতে পারবেন, অথবা আপনি এটি একটি কন্টেইনার রানটাইমে চালাতে পারেন। আমরা দৃঢ়ভাবে কন্টেইনার রানটাইম ব্যবহার করার পরামর্শ দিই, কারণ এটি লাইভ ওয়েবসাইটের সাথে স্থাপনার ধারাবাহিকতা দেয়।

## পূর্বশর্ত

এই সংগ্রহস্থলটি ব্যবহার করার জন্য, আপনাকে স্থানীয়ভাবে নিম্নলিখিতগুলো ইনস্টল করতে হবে:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (বর্ধিত সংস্করণ)](https://gohugo.io/)
- একটি কন্টেইনার রানটাইম , যেমন [Docker](https://www.docker.com/)।

আপনি শুরু করার আগে, নির্ভরতাগুলি ইনস্টল করুন। সংগ্রহস্থল ক্লোন করুন এবং ডিরেক্টরিতে নেভিগেট করুন:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

Kubernetes ওয়েবসাইট [Docsy Hugo থিম](https://github.com/google/docsy#readme) ব্যবহার করে। এমনকি যদি আপনি একটি পাত্রে ওয়েবসাইট চালানোর পরিকল্পনা করেন, আমরা দৃঢ়ভাবে নিম্নলিখিতগুলি চালিয়ে সাবমডিউল এবং অন্যান্য বিকাশ নির্ভরতাগুলিকে টেনে নেওয়ার সুপারিশ করছি:

### Windows

```powershell
# সাবমডিউল নির্ভরতা আনুন
git submodule update --init --recursive --depth 1
```

### Linux) / অন্যান্য Unix

```bash
# সাবমডিউল নির্ভরতা আনুন
make module-init
```

## একটি ধারক ব্যবহার করে ওয়েবসাইট চালানো

একটি পাত্রে সাইটটি তৈরি করতে, নিম্নলিখিতগুলি চালান:

```bash
# আপনি $CONTAINER_ENGINE সেট করতে পারেন যে কোনো ডকার-এর মতো কন্টেইনার টুলের নামে
make container-serve
```

আপনি যদি ত্রুটিগুলি দেখতে পান, তাহলে সম্ভবত এর অর্থ হল হুগো কন্টেইনারে যথেষ্ট কম্পিউটিং সংস্থান উপলব্ধ ছিল না। এটি সমাধান করতে, আপনার মেশিনে ডকারের জন্য অনুমোদিত CPU এবং মেমরি ব্যবহারের পরিমাণ বাড়ান ([MacOSX](https://docs.docker.com/docker-for-mac/#resources) এবং [Windows](https:// /docs.docker.com/docker-for-windows/#resources))।

ওয়েবসাইট দেখতে <http://localhost:1313>-এ আপনার ব্রাউজার খুলুন। আপনি সোর্স ফাইলগুলিতে পরিবর্তন করার সাথে সাথে, Hugo ওয়েবসাইট আপডেট করে এবং একটি ব্রাউজার রিফ্রেশ করতে বাধ্য করে।

## Hugo ব্যবহার করে স্থানীয়ভাবে ওয়েবসাইট চালানো

[`netlify.toml`](netlify.toml#L10) ফাইলে `HUGO_VERSION` এনভায়রনমেন্ট ভেরিয়েবল দ্বারা নির্দিষ্ট করা Hugo বর্ধিত সংস্করণ ইনস্টল করা নিশ্চিত করুন৷

স্থানীয়ভাবে সাইট তৈরি এবং পরীক্ষা করতে, চালান:

```bash
# নির্ভরতা ইনস্টল করুন
npm ci
make serve
```

এটি পোর্ট 1313-এ স্থানীয় Hugo সার্ভার শুরু করবে। ওয়েবসাইট দেখতে <http://localhost:1313>-এ আপনার ব্রাউজার খুলুন। আপনি সোর্স ফাইলগুলিতে পরিবর্তন করার সাথে সাথে, Hugo ওয়েবসাইট আপডেট করে এবং একটি ব্রাউজার রিফ্রেশ করতে বাধ্য করে।

## API রেফারেন্স পৃষ্ঠা তৈরি করা

API রেফারেন্স-এ `content/en/docs/reference/kubernetes-api` অবস্থিত পৃষ্ঠাগুলি Swagger স্পেসিফিকেশন ব্যবহার করে তৈরি করা হয়েছে, যা OpenAPI স্পেসিফিকেশন নামেও পরিচিত <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs> ব্যবহার করে.

একটি নতুন Kubernetes প্রকাশের জন্য রেফারেন্স পৃষ্ঠাগুলি আপডেট করতে এই পদক্ষেপগুলি অনুসরণ করুন:

1. `api-ref-generator` সাবমডিউল টানুন:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Swagger স্পেসিফিকেশন আপডেট করুন:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. `api-ref-assets/config/`-এ, নতুন রিলিজের পরিবর্তনগুলি প্রতিফলিত করতে `toc.yaml` এবং `fields.yaml` ফাইলগুলিকে মানিয়ে নিন।

4. পরবর্তী, পৃষ্ঠাগুলি তৈরি করুন:

   ```bash
   make api-reference
   ```

   আপনি একটি ধারক চিত্র থেকে সাইট তৈরি এবং পরিবেশন করে স্থানীয়ভাবে ফলাফল পরীক্ষা করতে পারেন:

   ```bash
   make container-image
   make container-serve
   ```

   একটি ওয়েব ব্রাউজারে, API রেফারেন্স দেখতে <http://localhost:1313/docs/reference/kubernetes-api/> এ যান।

5. যখন নতুন চুক্তির সমস্ত পরিবর্তন কনফিগারেশন ফাইল `toc.yaml` এবং `fields.yaml`-এ প্রতিফলিত হয়, তখন নতুন তৈরি করা API রেফারেন্স পৃষ্ঠাগুলির সাথে একটি পুল অনুরোধ তৈরি করুন।

## সমস্যা সমাধান

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

প্রযুক্তিগত কারণে Hugo দুই সেট বাইনারিতে পাঠানো হয়। বর্তমান ওয়েবসাইটটি শুধুমাত্র **Hugo Extended** সংস্করণের উপর ভিত্তি করে চলে। [রিলিজ পৃষ্ঠা](https://github.com/gohugoio/hugo/releases) নামের মধ্যে `extended` সহ সংরক্ষণাগারগুলি খুঁজুন। নিশ্চিত করতে, `hugo version` চালান এবং `extended` শব্দটি সন্ধান করুন।

### অনেকগুলি খোলা ফাইলের জন্য macOS সমস্যা সমাধান করা হচ্ছে

আপনি যদি macOS-এ `make serve` চালান এবং নিম্নলিখিত ত্রুটি পান:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

খোলা ফাইলগুলির জন্য বর্তমান সীমা পরীক্ষা করার চেষ্টা করুন:

`launchctl limit maxfiles`

তারপরে নিম্নলিখিত কমান্ডগুলি চালান (<https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c> থেকে অভিযোজিত):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
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

এটি ক্যাটালিনার পাশাপাশি Mojave macOS এর জন্য কাজ করে।

## SIG ডক্সের সাথে জড়িত হন

[কমিউনিটি পৃষ্ঠা](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) এ SIG ডক্স কুবারনেটস সম্প্রদায় এবং মিটিং সম্পর্কে আরও জানুন।

এছাড়াও আপনি এই প্রকল্পের রক্ষণাবেক্ষণকারীদের কাছে পৌঁছাতে পারেন:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [এই slack জন্য একটি আমন্ত্রণ পান](https://slack.k8s.io/)
- [মেলিং তালিকা](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## ডক্স অবদান

আপনি আপনার GitHub অ্যাকাউন্টে এই সংগ্রহস্থলের একটি অনুলিপি তৈরি করতে স্ক্রিনের উপরের ডানদিকে **Fork** বোতামে ক্লিক করতে পারেন। এই অনুলিপিটিকে _fork_ বলা হয়। আপনার fork যে কোনও পরিবর্তন করতে চান করুন এবং যখন সেই পরিবর্তনগুলি আমাদের কাছে পাঠাতে প্রস্তুত হন, তখন আপনার fork যান এবং এটি সম্পর্কে আমাদের জানাতে একটি নতুন পুল অনুরোধ তৈরি করুন৷

একবার আপনার পুল অনুরোধ তৈরি হয়ে গেলে, একজন Kubernetes পর্যালোচক স্পষ্ট, কার্যকর প্রতিক্রিয়া প্রদানের দায়িত্ব নেবেন। পুল অনুরোধের মালিক হিসাবে, **কুবারনেটস পর্যালোচক আপনাকে যে প্রতিক্রিয়া প্রদান করেছেন তা সমাধান করার জন্য আপনার পুল অনুরোধ সংশোধন করার দায়িত্ব আপনার।**

এছাড়াও, মনে রাখবেন যে একাধিক Kubernetes পর্যালোচক আপনাকে প্রতিক্রিয়া প্রদান করতে পারেন অথবা আপনি একজন Kubernetes পর্যালোচকের কাছ থেকেও প্রতিক্রিয়া পেতে পারেন যা আপনাকে প্রতিক্রিয়া প্রদানের জন্য প্রাথমিকভাবে বরাদ্দ করা থেকে ভিন্ন।

উপরন্তু, কিছু ক্ষেত্রে, আপনার একজন পর্যালোচক প্রয়োজনের সময় একজন Kubernetes কারিগরি পর্যালোচনাকারীর কাছ থেকে প্রযুক্তিগত পর্যালোচনা চাইতে পারেন। পর্যালোচকরা যথাসময়ে প্রতিক্রিয়া প্রদানের জন্য তাদের যথাসাধ্য চেষ্টা করবেন কিন্তু প্রতিক্রিয়ার সময় পরিস্থিতির উপর ভিত্তি করে পরিবর্তিত হতে পারে।

Kubernetes ডকুমেন্টেশনে অবদান সম্পর্কে আরও তথ্যের জন্য, দেখুন:

- [Kubernetes ডক্সে অবদান রাখুন](https://kubernetes.io/docs/contribute/)
- [পৃষ্ঠা সামগ্রীর ধরন](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [ডকুমেন্টেশন স্টাইল গাইড](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Kubernetes ডকুমেন্টেশন স্থানীয়করণ](https://kubernetes.io/docs/contribute/localization/)

### নতুন অবদানকারী অ্যাম্বাসেডর

অবদান রাখার সময় আপনার যদি যেকোনো সময়ে সাহায্যের প্রয়োজন হয়, [নতুন অবদানকারী অ্যাম্বাসেডর](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) যোগাযোগের একটি ভালো জায়গা। . এরা হল SIG ডক্স অনুমোদনকারী যাদের দায়িত্বগুলির মধ্যে নতুন অবদানকারীদের পরামর্শ দেওয়া এবং তাদের প্রথম কয়েকটি পুল অনুরোধের মাধ্যমে তাদের সাহায্য করা অন্তর্ভুক্ত৷ নতুন কন্ট্রিবিউটর অ্যাম্বাসেডরদের সাথে যোগাযোগ করার সবচেয়ে ভালো জায়গা হবে [Kubernetes Slack](https://slack.k8s.io/)। SIG ডক্সের জন্য বর্তমান নতুন অবদানকারী অ্যাম্বাসেডর:

| নাম                       | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Arsh Sharma                | @arsh                      | @RinkiyaKeDad              |

<!-- ## `README.md` এর স্থানীয়করণ -->

<!-- | ভাষা                   | ভাষা                   |
| -------------------------- | -------------------------- |
| [Bengali](README-bn.md)    |      |
| [Chinese](README-zh.md)    | [Korean](README-ko.md)     |
| [French](README-fr.md)     | [Polish](README-pl.md)     |
| [German](README-de.md)     | [Portuguese](README-pt.md) |
| [Hindi](README-hi.md)      | [Russian](README-ru.md)    |
| [Indonesian](README-id.md) | [Spanish](README-es.md)    |
| [Italian](README-it.md)    | [Ukrainian](README-uk.md)  |
| [Japanese](README-ja.md)   | [Vietnamese](README-vi.md) | -->

## আচরণ বিধি

Kubernetes সম্প্রদায়ে অংশগ্রহণ [CNCF আচরণ বিধি](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) দ্বারা পরিচালিত হয়।

## ধন্যবাদ

Kubernetes সম্প্রদায়ের অংশগ্রহণে উন্নতি লাভ করে, এবং আমরা আমাদের ওয়েবসাইট এবং আমাদের ডকুমেন্টেশনে আপনার অবদানের প্রশংসা করি!
