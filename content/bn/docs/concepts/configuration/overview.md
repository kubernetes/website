---
reviewers:
- mikedanese
title: কনফিগারেশন সেরা অনুশীলন
content_type: concept
weight: 10
---

<!-- overview -->
এই ডকুমেন্টটি কনফিগারেশন সেরা অনুশীলনগুলি হাইলাইট এবং একত্রিত করে যা
ব্যবহারকারী গাইড, Getting Started ডকুমেন্টেশন এবং উদাহরণ জুড়ে প্রবর্তিত হয়েছে।

এটি একটি জীবন্ত ডকুমেন্ট। আপনি যদি মনে করেন যে এই তালিকায় নেই এমন কিছু অন্যদের জন্য উপকারী হতে পারে,
অনুগ্রহ করে একটি ইস্যু ফাইল করতে বা একটি PR জমা দিতে দ্বিধা করবেন না।

<!-- body -->
## সাধারণ কনফিগারেশন টিপস

- কনফিগারেশন সংজ্ঞায়িত করার সময়, সর্বশেষ স্থিতিশীল API সংস্করণ নির্দিষ্ট করুন।

- কনফিগারেশন ফাইলগুলি ক্লাস্টারে পুশ করার আগে সংস্করণ নিয়ন্ত্রণে সংরক্ষণ করা উচিত। এটি
  প্রয়োজনে দ্রুত একটি কনফিগারেশন পরিবর্তন রোলব্যাক করতে দেয়। এটি ক্লাস্টার
  পুনঃসৃষ্টি এবং পুনরুদ্ধারেও সহায়তা করে।

- JSON এর পরিবর্তে YAML ব্যবহার করে আপনার কনফিগারেশন ফাইল লিখুন। যদিও এই ফর্ম্যাটগুলি প্রায় সব
  পরিস্থিতিতে বিনিময়যোগ্যভাবে ব্যবহার করা যেতে পারে, YAML আরও ব্যবহারকারী-বান্ধব হতে থাকে।

- যখনই এটি অর্থপূর্ণ হয় তখন সম্পর্কিত অবজেক্টগুলি একটি একক ফাইলে গ্রুপ করুন। একটি ফাইল প্রায়শই
  বেশ কয়েকটির চেয়ে পরিচালনা করা সহজ। এই সিনট্যাক্সের উদাহরণ হিসাবে
  [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml)
  ফাইলটি দেখুন।

- এটাও লক্ষ্য করুন যে অনেক `kubectl` কমান্ড একটি ডিরেক্টরিতে কল করা যেতে পারে। উদাহরণস্বরূপ, আপনি
  কনফিগ ফাইলের একটি ডিরেক্টরিতে `kubectl apply` কল করতে পারেন।

- অপ্রয়োজনীয়ভাবে ডিফল্ট মান নির্দিষ্ট করবেন না: সরল, ন্যূনতম কনফিগারেশন ত্রুটির সম্ভাবনা কম করবে।

- আরও ভাল ইন্ট্রোস্পেকশনের অনুমতি দিতে অ্যানোটেশনে অবজেক্ট বর্ণনা রাখুন।

{{< note >}}
[YAML 1.2](https://yaml.org/spec/1.2.0/#id2602744) বুলিয়ান মান স্পেসিফিকেশনে
[YAML 1.1](https://yaml.org/spec/1.1/#id864510) এর সাপেক্ষে একটি ব্রেকিং পরিবর্তন প্রবর্তিত হয়েছে।
এটি Kubernetes এ একটি পরিচিত [issue](https://github.com/kubernetes/kubernetes/issues/34146)।
YAML 1.2 শুধুমাত্র **true** এবং **false** কে বৈধ বুলিয়ান হিসাবে স্বীকৃতি দেয়, যখন YAML 1.1
**yes**, **no**, **on**, এবং **off** কেও বুলিয়ান হিসাবে গ্রহণ করে। তবে, Kubernetes YAML
[parsers](https://github.com/kubernetes/kubernetes/issues/34146#issuecomment-252692024) ব্যবহার করে যা
বেশিরভাগ YAML 1.1 এর সাথে সামঞ্জস্যপূর্ণ, যার মানে হল YAML ম্যানিফেস্টে **true** বা
**false** এর পরিবর্তে **yes** বা **no** ব্যবহার করলে অপ্রত্যাশিত ত্রুটি বা আচরণ হতে পারে। এই সমস্যা এড়াতে,
YAML ম্যানিফেস্টে বুলিয়ান মানের জন্য সর্বদা **true** বা **false** ব্যবহার করার এবং
যেকোনো স্ট্রিং যা বুলিয়ানের সাথে বিভ্রান্ত হতে পারে তা উদ্ধৃত করার সুপারিশ করা হয়, যেমন **"yes"** বা **"no"**।

বুলিয়ান ছাড়াও, YAML সংস্করণগুলির মধ্যে অতিরিক্ত স্পেসিফিকেশন পরিবর্তন রয়েছে। অনুগ্রহ করে
একটি বিস্তৃত তালিকার জন্য [YAML Specification Changes](https://spec.yaml.io/main/spec/1.2.2/ext/changes) ডকুমেন্টেশন দেখুন।
{{< /note >}}

## "Naked" পড বনাম ReplicaSet, Deployment, এবং Job {#naked-pods-vs-replicasets-deployments-and-jobs}

- আপনি এড়াতে পারলে naked পড (অর্থাৎ, পড যা [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) বা
  [Deployment](/docs/concepts/workloads/controllers/deployment/) এ আবদ্ধ নয়) ব্যবহার করবেন না। Naked পড
  একটি নোড ব্যর্থতার ক্ষেত্রে পুনরায় শিডিউল করা হবে না।

  একটি Deployment, যা একটি ReplicaSet তৈরি করে নিশ্চিত করতে যে পডের পছন্দসই সংখ্যা
  সর্বদা উপলব্ধ, এবং পড প্রতিস্থাপনের জন্য একটি কৌশল নির্দিষ্ট করে (যেমন
  [RollingUpdate](/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), প্রায় সবসময়
  সরাসরি পড তৈরি করার চেয়ে পছন্দনীয়, কিছু স্পষ্ট
  [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) পরিস্থিতি ছাড়া।
  একটি [Job](/docs/concepts/workloads/controllers/job/) ও উপযুক্ত হতে পারে।

## সেবা

- এর সংশ্লিষ্ট ব্যাকএন্ড ওয়ার্কলোড (Deployment বা ReplicaSet) এর আগে একটি [Service](/docs/concepts/services-networking/service/) তৈরি করুন,
  এবং এটি অ্যাক্সেস করতে হবে এমন যেকোনো ওয়ার্কলোডের আগে।
  যখন Kubernetes একটি কন্টেইনার শুরু করে, এটি সমস্ত সেবার দিকে নির্দেশ করে পরিবেশ ভেরিয়েবল প্রদান করে
  যা কন্টেইনার শুরু হওয়ার সময় চলছিল। উদাহরণস্বরূপ, যদি `foo` নামে একটি সেবা থাকে,
  সমস্ত কন্টেইনার তাদের প্রাথমিক পরিবেশে নিম্নলিখিত ভেরিয়েবল পাবে:

  ```shell
  FOO_SERVICE_HOST=<the host the Service is running on>
  FOO_SERVICE_PORT=<the port the Service is running on>
  ```

  *এটি একটি অর্ডারিং প্রয়োজনীয়তা বোঝায়* - যেকোনো `Service` যা একটি `Pod` অ্যাক্সেস করতে চায় তা অবশ্যই
  `Pod` নিজেই তৈরি হওয়ার আগে তৈরি করতে হবে, অন্যথায় পরিবেশ ভেরিয়েবল পপুলেট হবে না।
  DNS এর এই সীমাবদ্ধতা নেই।


- একটি ঐচ্ছিক (যদিও দৃঢ়ভাবে সুপারিশকৃত) [cluster add-on](/docs/concepts/cluster-administration/addons/)
  হল একটি DNS সার্ভার। DNS সার্ভার নতুন `Services` এর জন্য Kubernetes API দেখে এবং প্রতিটির জন্য
  DNS রেকর্ডের একটি সেট তৈরি করে। যদি ক্লাস্টার জুড়ে DNS সক্রিয় করা হয়ে থাকে তাহলে সমস্ত `Pods` স্বয়ংক্রিয়ভাবে
  `Services` এর নাম রেজোলিউশন করতে সক্ষম হওয়া উচিত।

- এটি একেবারে প্রয়োজনীয় না হলে একটি পডের জন্য `hostPort` নির্দিষ্ট করবেন না। যখন আপনি একটি পডকে
  `hostPort` এ বাইন্ড করেন, এটি পডটি শিডিউল করা যেতে পারে এমন স্থানের সংখ্যা সীমিত করে, কারণ প্রতিটি <`hostIP`,
  `hostPort`, `protocol`> সমন্বয় অনন্য হতে হবে। আপনি যদি `hostIP` এবং
  `protocol` স্পষ্টভাবে নির্দিষ্ট না করেন, Kubernetes ডিফল্ট `hostIP` হিসাবে `0.0.0.0` এবং ডিফল্ট
  `protocol` হিসাবে `TCP` ব্যবহার করবে।

  আপনার যদি শুধুমাত্র ডিবাগিং উদ্দেশ্যে পোর্টে অ্যাক্সেসের প্রয়োজন হয়, আপনি
  [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls)
  বা [`kubectl port-forward`](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) ব্যবহার করতে পারেন।

  আপনার যদি স্পষ্টভাবে নোডে একটি পডের পোর্ট এক্সপোজ করার প্রয়োজন হয়, `hostPort` এর আশ্রয় নেওয়ার আগে
  [NodePort](/docs/concepts/services-networking/service/#type-nodeport) সেবা ব্যবহার করার কথা বিবেচনা করুন।

- `hostPort` এর মতো একই কারণে `hostNetwork` ব্যবহার এড়িয়ে চলুন।

- যখন আপনার `kube-proxy` লোড ব্যালান্সিং এর প্রয়োজন নেই তখন সেবা আবিষ্কারের জন্য
  [headless Services](/docs/concepts/services-networking/service/#headless-services)
  (যার `ClusterIP` `None`) ব্যবহার করুন।

## লেবেল ব্যবহার করা

- আপনার অ্যাপ্লিকেশন বা Deployment এর __semantic attributes__ সনাক্ত করে এমন [labels](/docs/concepts/overview/working-with-objects/labels/)
  সংজ্ঞায়িত এবং ব্যবহার করুন, যেমন `{ app.kubernetes.io/name:
  MyApp, tier: frontend, phase: test, deployment: v3 }`। আপনি অন্যান্য রিসোর্সের জন্য উপযুক্ত পড নির্বাচন করতে
  এই লেবেলগুলি ব্যবহার করতে পারেন; উদাহরণস্বরূপ, একটি সেবা যা সমস্ত `tier: frontend`
  পড নির্বাচন করে, বা `app.kubernetes.io/name: MyApp` এর সমস্ত `phase: test` কম্পোনেন্ট।
  এই পদ্ধতির উদাহরণের জন্য [guestbook](https://github.com/kubernetes/examples/tree/master/guestbook/) অ্যাপ দেখুন।

  একটি সেবা তার সিলেক্টর থেকে রিলিজ-নির্দিষ্ট লেবেল বাদ দিয়ে একাধিক Deployment জুড়ে বিস্তৃত করা যেতে পারে।
  যখন আপনার ডাউনটাইম ছাড়া একটি চলমান সেবা আপডেট করার প্রয়োজন হয়, একটি
  [Deployment](/docs/concepts/workloads/controllers/deployment/) ব্যবহার করুন।

  একটি অবজেক্টের desired state একটি Deployment দ্বারা বর্ণিত হয়, এবং যদি সেই spec এ পরিবর্তন
  _প্রয়োগ_ করা হয়, deployment controller প্রকৃত অবস্থাকে desired state এ একটি নিয়ন্ত্রিত
  হারে পরিবর্তন করে।

- সাধারণ ব্যবহারের ক্ষেত্রে [Kubernetes common labels](/docs/concepts/overview/working-with-objects/common-labels/)
  ব্যবহার করুন। এই মানসম্মত লেবেলগুলি মেটাডেটা সমৃদ্ধ করে এমনভাবে যা সরঞ্জামগুলিকে অনুমতি দেয়,
  `kubectl` এবং [dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) সহ,
  একটি ইন্টারঅপারেবল উপায়ে কাজ করতে।

- আপনি ডিবাগিংয়ের জন্য লেবেল ম্যানিপুলেট করতে পারেন। যেহেতু Kubernetes কন্ট্রোলার (যেমন ReplicaSet) এবং
  সেবা সিলেক্টর লেবেল ব্যবহার করে পডের সাথে মিলে, একটি পড থেকে প্রাসঙ্গিক লেবেল সরিয়ে ফেললে এটি
  একটি কন্ট্রোলার দ্বারা বিবেচিত হওয়া বা একটি সেবা দ্বারা ট্রাফিক পরিবেশন করা থেকে বন্ধ হবে। আপনি যদি
  একটি বিদ্যমান পডের লেবেল সরিয়ে ফেলেন, এর কন্ট্রোলার এর জায়গা নিতে একটি নতুন পড তৈরি করবে। এটি একটি
  "quarantine" পরিবেশে পূর্বে "live" পড ডিবাগ করার একটি উপকারী উপায়। ইন্টারঅ্যাক্টিভভাবে
  লেবেল সরাতে বা যোগ করতে, [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label) ব্যবহার করুন।

## kubectl ব্যবহার করা

- `kubectl apply -f <directory>` ব্যবহার করুন। এটি `<directory>` এর সমস্ত `.yaml`,
  `.yml`, এবং `.json` ফাইলে Kubernetes কনফিগারেশন খোঁজে এবং এটি `apply` তে পাস করে।

- নির্দিষ্ট অবজেক্ট নামের পরিবর্তে `get` এবং `delete` অপারেশনের জন্য লেবেল সিলেক্টর ব্যবহার করুন।
  [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
  এবং [using labels effectively](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively) বিভাগ দেখুন।

- দ্রুত একক-কন্টেইনার Deployment এবং সেবা তৈরি করতে `kubectl create deployment` এবং `kubectl expose` ব্যবহার করুন।
  একটি উদাহরণের জন্য [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/) দেখুন।
