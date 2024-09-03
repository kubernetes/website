# কুবারনেটিস ডকুমেন্টেশন

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

এই রিপোজিটোরিতে [কুবারনেটিস ওয়েবসাইট এবং ডকুমেন্টেশন](https://kubernetes.io/) তৈরি করার জন্য প্রয়োজনীয় সমস্ত উপাদান রয়েছে। আমরা খুবই আনন্দিত যে আপনি অবদান রাখতে চান!

- [ডকুমেন্টেশন এ অবদান](#contributing-to-the-docs)
- [স্থানীয়করণ ReadMeগুলো](#localization-readmemds)

## এই রিপোজিটোরি ব্যবহার 

আপনি [Hugo (বর্ধিত সংস্করণ)](https://gohugo.io/) ব্যবহার করে স্থানীয়ভাবে ওয়েবসাইটটি চালাতে পারেন, অথবা আপনি এটি একটি কন্টেইনার রানটাইমে চালাতে পারেন। আমরা দৃঢ়ভাবে কন্টেইনার রানটাইম ব্যবহার করার পরামর্শ দিই, কারণ এটি লাইভ ওয়েবসাইটের সাথে ডিপ্লয়মেন্টের ধারাবাহিকতা দেয়।

## পূর্বশর্ত

এই রিপোজিটোরিটি ব্যবহার করার জন্য, আপনাকে লোকাল সিস্টেম বা, ডিভাইস এ নিম্নলিখিত জিনিস ইনস্টল করতে হবে:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (বর্ধিত সংস্করণ)](https://gohugo.io/)
- একটি কন্টেইনার রানটাইম, যেমন [Docker](https://www.docker.com/).

> [!NOTE]
[`netlify.toml`](netlify.toml#L11) ফাইলে `HUGO_VERSION` এনভায়রনমেন্ট ভেরিয়েবল দ্বারা নির্দিষ্ট করা Hugo বর্ধিত সংস্করণ ইনস্টল করা নিশ্চিত করুন৷

আপনি কাজ শুরু করার আগে, দরকারি জিনিসগুলো  ইনস্টল করুন। রিপোজিটোরি ক্লোন(clone) করুন এবং ডিরেক্টরিতে(directory) প্রবেশ করুন:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

কুবারনেটিস ওয়েবসাইটটি [Docsy Hugo থিম](https://github.com/google/docsy#readme) ব্যবহার করে। এমনকি যদি আপনি একটি কন্টেইনারে ওয়েবসাইট চালানোর পরিকল্পনা করেন, আমরা দৃঢ়ভাবে নিম্নলিখিতগুলি চালিয়ে সাবমডিউল এবং অন্যান্য প্রয়োজনীয় জিনিসগুলো  পুল(pull) করার পরামর্শ দিই:

### Windows
```powershell
# fetch submodule dependencies
git submodule update --init --recursive --depth 1
```

### Linux / other Unix
```bash
# fetch submodule dependencies
make module-init
```

## একটি কন্টেইনার ব্যবহার করে ওয়েবসাইট চালানো

একটি  কন্টেইনারে  সাইটটি তৈরি করতে, নিম্নলিখিতটি চালান:

```bash
# You can set $CONTAINER_ENGINE to the name of any Docker-like container tool
make container-serve
```

আপনি যদি ত্রুটি দেখতে পান, তাহলে সম্ভবত এর অর্থ হলো Hugo কন্টেইনারে যথেষ্ট কম্পিউটিং রিসোর্স নেই। এটি সমাধান করতে, আপনার মেশিনে Docker এর জন্য অনুমোদিত CPU এবং মেমরি ব্যবহারের পরিমাণ বাড়ান ([MacOS](https://docs.docker.com/desktop/settings/mac/) এবং [Windows](https://docs.docker.com/desktop/settings/windows/))।

ওয়েবসাইটটি দেখতে <http://localhost:1313>-এ আপনার ব্রাউজার খুলুন। আপনি সোর্স ফাইলগুলোতে পরিবর্তন করার সাথে সাথে, Hugo ওয়েবসাইট আপডেট করে এবং একটি ব্রাউজার রিফ্রেশ করতে বাধ্য করে।

## Hugo ব্যবহার করে লোকাল ডিভাইস এ ওয়েবসাইট চালানো

দরকারি জিনিসগুলো ইনস্টল করতে, স্থানীয়ভাবে সাইট তৈরি এবং পরীক্ষা করতে, চালান:

- For macOS and Linux
  ```bash
  npm ci
  make serve
  ```
- For Windows (PowerShell)
  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```
  
এটি পোর্ট 1313-এ স্থানীয় Hugo সার্ভার শুরু করবে। ওয়েবসাইট দেখতে <http://localhost:1313>-এ আপনার ব্রাউজার খুলুন। আপনি সোর্স ফাইলগুলোতে পরিবর্তন করার সাথে সাথে, Hugo ওয়েবসাইট আপডেট হবে এবং একটি ব্রাউজার রিফ্রেশ করতে বাধ্য করে।

## API রেফারেন্স পৃষ্ঠা তৈরি করা

`content/en/docs/reference/kubernetes-api` এ অবস্থিত API রেফারেন্স পৃষ্ঠাগুলো <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs> ব্যবহার করে Swagger স্পেসিফিকেশন থেকে তৈরি করা হয়েছে, যা OpenAPI স্পেসিফিকেশন নামেও পরিচিত।

একটি নতুন কুবারনেটিস রিলিজের জন্য রেফারেন্স পৃষ্ঠাগুলো আপডেট করতে এই পদক্ষেপগুলো অনুসরণ করুন:

1. `api-ref-generator` সাবমডিউল পুল (Pull) করুন:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Swagger স্পেসিফিকেশন আপডেট করুন:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. `api-ref-assets/config/`-এ, নতুন রিলিজের পরিবর্তনগুলো প্রতিফলিত করতে `toc.yaml` এবং `fields.yaml` ফাইলগুলোকে  হালনাগাদ  করে নিন।

4. পরবর্তী, পৃষ্ঠাগুলো তৈরি করুন:

   ```bash
   make api-reference
   ```

   আপনি একটি কন্টেইনার থেকে সাইট তৈরি এবং পরিবেশন করে স্থানীয়ভাবে ফলাফল পরীক্ষা করতে পারেন:
   
   ```bash
   make container-serve
   ```

   একটি ওয়েব ব্রাউজারে, API রেফারেন্স দেখতে <http://localhost:1313/docs/reference/kubernetes-api/> এ যান।

5. যখন নতুন চুক্তির সমস্ত পরিবর্তন কনফিগারেশন ফাইল `toc.yaml` এবং `fields.yaml`-এ প্রতিফলিত হয়, তখন নতুন তৈরি করা API রেফারেন্স পৃষ্ঠাগুলোর সাথে একটি পুল রিকোয়েস্ট তৈরি করুন।

## সমস্যা সমাধান (Troubleshooting)

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

প্রযুক্তিগত কারণে Hugo কে দুই সেট বাইনারিতে পাঠানো হয়। বর্তমান ওয়েবসাইটটি শুধুমাত্র **Hugo Extended** সংস্করণের উপর ভিত্তি করে চলে। [রিলিজ পৃষ্ঠা](https://github.com/gohugoio/hugo/releases) নামের মধ্যে `বর্ধিত(extended)` সহ সংরক্ষণাগারগুলো খুঁজুন। নিশ্চিত করতে, `hugo version` চালান এবং `extended` শব্দটি সন্ধান করুন।

### অনেকগুলো খোলা ফাইলের জন্য macOS সমস্যা সমাধান করা 

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

এটি Catalina পাশাপাশি Mojave macOS এর জন্য কাজ করে।

## SIG Docs এর সাথে জড়িত হন

[কমিউনিটি পৃষ্ঠা](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) থেকে SIG Docs কুবারনেটিস কমিউনিটি এবং মিটিং সম্পর্কে আরও জানুন।

এছাড়াও আপনি এই প্রকল্পের রক্ষণাবেক্ষণকারীদের কাছে পৌঁছাতে পারেন:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [এই Slack এর জন্য একটি আমন্ত্রণ পান](https://slack.k8s.io/)
- [মেইলিং তালিকা](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Docs এ অবদান রাখুন

আপনি আপনার GitHub অ্যাকাউন্টে এই রিপোজিটোরি এর একটি অনুলিপি তৈরি করতে স্ক্রিনের উপরের ডানদিকে **Fork** বোতামে ক্লিক করতে পারেন। এই অনুলিপিটিকে _ফর্ক(fork)_ বলা হয়। আপনার ফর্কটিতে আপনি যে কোনো পরিবর্তন করতে চান এবং আপনি যখন সেই পরিবর্তনগুলো আমাদের কাছে পাঠাতে প্রস্তুত হন, তখন আপনার ফর্কে যান এবং এটি সম্পর্কে আমাদের জানাতে একটি নতুন পুল রিকোয়েস্ট (Pull request) তৈরি করুন৷

একবার আপনার পুল রিকোয়েস্ট তৈরি হয়ে গেলে, একজন কুবারনেটিস পর্যালোচক স্পষ্ট, কার্যকর প্রতিক্রিয়া প্রদানের দায়িত্ব নেবেন। পুল রিকোয়েস্টের মালিক হিসাবে, **কুবারনেটিস পর্যালোচক আপনাকে যে প্রতিক্রিয়া প্রদান করেছেন তা সমাধান করার জন্য আপনার পুল রিকোয়েস্ট সংশোধন করার দায়িত্ব আপনার।**

এছাড়াও, মনে রাখবেন যে আপনার কাছে একাধিক কুবারনেটিস পর্যালোচক আপনাকে প্রতিক্রিয়া প্রদান করতে পারেন বা আপনি একজন কুবারনেটিস পর্যালোচকের কাছ থেকে প্রতিক্রিয়া পেতে পারেন যা আপনাকে প্রতিক্রিয়া প্রদানের জন্য প্রাথমিকভাবে নির্ধারিত একটি থেকে আলাদা।

তদুপরি, কিছু ক্ষেত্রে, আপনার একজন পর্যালোচক প্রয়োজনের সময় একজন কুবারনেটিস টেকনিকাল পর্যালোচনাকারীর কাছ থেকে প্রযুক্তিগত পর্যালোচনা চাইতে পারেন। পর্যালোচকরা যথাসময়ে প্রতিক্রিয়া প্রদানের জন্য তাদের যথাসাধ্য চেষ্টা করবেন কিন্তু প্রতিক্রিয়ার সময় পরিস্থিতির উপর ভিত্তি করে পরিবর্তিত হতে পারে।

কুবারনেটিস ডকুমেন্টেশনে অবদান সম্পর্কে আরও তথ্যের জন্য, দেখুন:

- [কুবারনেটিস ডক্সে অবদান রাখুন](https://kubernetes.io/docs/contribute/)
- [পৃষ্ঠা বিষয়বস্তুর প্রকার](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [ডকুমেন্টেশন শৈলী গাইড](https://kubernetes.io/docs/contribute/style/style-guide/)
- [কুবারনেটিস ডকুমেন্টেশন স্থানীয়করণ](https://kubernetes.io/docs/contribute/localization/)
- [কুবারনেটিস ডক্সের পরিচিতি](https://www.youtube.com/watch?v=pprMgmNzDcw)

### নতুন অবদানকারী অ্যাম্বাসেডর

অবদান রাখার সময় আপনার যদি যেকোনো সময়ে সাহায্যের প্রয়োজন হয়, [নতুন কন্ট্রিবিউটর অ্যাম্বাসেডর](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) যোগাযোগের একটি ভালো জায়গা। . এগুলো হলো SIG ডক্স অনুমোদনকারীযাদের দায়িত্ব গুলোর  মধ্যে নতুন অবদানকারীদের পরামর্শ দেওয়া এবং তাদের প্রথম কয়েকটি পুল রিকোয়েস্টের মাধ্যমে তাদের সাহায্য করা অন্তর্ভুক্ত৷ নতুন কন্ট্রিবিউটর অ্যাম্বাসেডরদের সাথে যোগাযোগ করার সবচেয়ে ভালো জায়গা হবে [Kubernetes Slack](https://slack.k8s.io/)। SIG ডক্সের জন্য বর্তমান নতুন অবদানকারী অ্যাম্বাসেডর:

| Name                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh               | @sreeram.venkitesh                      | @sreeram-venkitesh              |

## Localization READMEs

| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Bengali](README-bn.md)    | [Korean](README-ko.md)     |
| [Chinese](README-zh.md)    | [Polish](README-pl.md)     |
| [French](README-fr.md)     | [Portuguese](README-pt.md) |
| [German](README-de.md)     | [Russian](README-ru.md)    |
| [Hindi](README-hi.md)      | [Spanish](README-es.md)    |
| [Indonesian](README-id.md) | [Ukrainian](README-uk.md)  |
| [Italian](README-it.md)    | [Vietnamese](README-vi.md) |
| [Japanese](README-ja.md)   | |

## কোড অফ কন্ডাক্ট

কুবারনেটিস কমিউনিটিয়ের অংশগ্রহণ [CNCF কোড অফ কন্ডাক্ট](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) দ্বারা পরিচালিত হয়।

## ধন্যবাদ

কুবারনেটিস কমিউনিটিয়ের অংশগ্রহণে উন্নতি লাভ করে, এবং আমরা আমাদের ওয়েবসাইট এবং আমাদের ডকুমেন্টেশনে আপনার অবদানের প্রশংসা করি!
