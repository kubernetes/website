---
reviewers:
- mitul3737
title: macOS এ kubectl ইনস্টল এবং সেট আপ করুন
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: macOS এ kubectl ইনস্টল করুন
---

## {{% heading "prerequisites" %}}

আপনাকে অবশ্যই একটি kubectl সংস্করণ ব্যবহার করতে হবে যা আপনার ক্লাস্টারের একটি ছোট সংস্করণের পার্থক্যের মধ্যে রয়েছে। উদাহরণস্বরূপ, একটি v{{< skew currentVersion >}} ক্লায়েন্ট v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}}, এবং v{{< skew currentVersionAddMinor 1 >}} নিয়ন্ত্রণ প্লেন এর সাথে যোগাযোগ করতে পারে।
kubectl এর সর্বশেষ সামঞ্জস্যপূর্ণ সংস্করণ ব্যবহার করা অপ্রত্যাশিত সমস্যাগুলি এড়াতে সাহায্য করে৷

## macOS এ kubectl ইনস্টল করুন

macOS এ kubectl ইনস্টল করার জন্য নিম্নলিখিত পদ্ধতি রয়েছেঃ

- [macOS এ kubectl ইনস্টল করুন](#install-kubectl-on-macos)
  - [macOS-এ কার্ল দিয়ে kubectl বাইনারি ইনস্টল করুন](#install-kubectl-binary-with-curl-on-macos)
  - [MacOS এ Homebrew দিয়ে ইনস্টল করুন](#install-with-homebrew-on-macos)
  - [MacOS এ Macports দিয়ে ইনস্টল করুন](#install-with-macports-on-macos)
- [kubectl কনফিগারেশন যাচাই করুন](#verify-kubectl-configuration)
- [বাড়তি kubectl কনফিগারেশন এবং প্লাগইন](#optional-kubectl-configurations-and-plugins)
  - [শেল অটোকমপ্লিট সক্ষম করুন](#enable-shell-autocompletion)
  - [`kubectl convert` প্লাগইন ইনস্টল করুন](#install-kubectl-convert-plugin)

### macOS-এ কার্ল সহ kubectl বাইনারি ইনস্টল করুন

১. সর্বশেষ রিলিজ ডাউনলোড করুন:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   একটি নির্দিষ্ট সংস্করণ ডাউনলোড করতে, নির্দিষ্ট সংস্করণের সাথে কমান্ডের `$(curl -L -s https://dl.k8s.io/release/stable.txt)` অংশটি প্রতিস্থাপন করুন।

   উদাহরণস্বরূপ, Intel macOS-এ সংস্করণ {{% skew currentPatchVersion %}} ডাউনলোড করতে, টাইপ করুন:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/darwin/amd64/kubectl"
   ```

   এবং অ্যাপল সিলিকনে macOS এর জন্য, টাইপ করুন:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

২. বাইনারি যাচাই করুন (ঐচ্ছিক)

   kubectl checksum ফাইল ডাউনলোড করুন:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   চেকসাম ফাইলের বিপরীতে kubectl বাইনারি যাচাই করুন:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   বৈধ হলে, আউটপুট হল:

   ```console
   kubectl: OK
   ```

   চেক ব্যর্থ হলে, `shasum` অশূন্য স্থিতি সহ প্রস্থান করে এবং অনুরূপ আউটপুট প্রিন্ট করে:

   ```bash
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   বাইনারি এবং চেকসামের একই সংস্করণ ডাউনলোড করুন।
   {{< /note >}}

৩. kubectl বাইনারি এক্সিকিউটেবল করুন।

   ```bash
   chmod +x ./kubectl
   ```

৪. আপনার সিস্টেম `PATH`-এ একটি ফাইল অবস্থানে kubectl বাইনারি সরান।

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   নিশ্চিত করুন যে `/usr/local/bin` আপনার PATH এনভায়রনমেন্ট ভেরিয়েবলে আছে।
   {{< /note >}}

৫. আপনার ইনস্টল করা সংস্করণ আপ-টু-ডেট কিনা তা নিশ্চিত করতে পরীক্ষা করুন:

   ```bash
   kubectl version --client
   ```
   
   {{< note >}}
   উপরের কমান্ডটি একটি সতর্কতা তৈরি করবে:
   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```
   আপনি এই সতর্কতা উপেক্ষা করতে পারেন. আপনি শুধুমাত্র `kubectl` এর যে সংস্করণটি ইনস্টল করেছেন তা পরীক্ষা করছেন।
   
   {{< /note >}}
   
   অথবা সংস্করণের বিস্তারিত দেখার জন্য এটি ব্যবহার করুন:

   ```cmd
   kubectl version --client --output=yaml
   ```

৬. প্লাগইন ইনস্টল করার পরে, ইনস্টলেশন ফাইলগুলি পরিষ্কার করুন:

   ```bash
   rm kubectl kubectl.sha256
   ```

### MacOS এ Homebrew দিয়ে ইনস্টল করুন

আপনি যদি macOS-এ থাকেন এবং [Homebrew](https://brew.sh/) প্যাকেজ ম্যানেজার ব্যবহার করেন, তাহলে আপনি Homebrew-এর সাথে kubectl ইনস্টল করতে পারেন।

১. ইনস্টলেশন কমান্ড চালান:

   ```bash
   brew install kubectl
   ```

   অথবা,

   ```bash
   brew install kubernetes-cli
   ```

২. আপনার ইনস্টল করা সংস্করণ আপ-টু-ডেট কিনা তা নিশ্চিত করতে পরীক্ষা করুন:

   ```bash
   kubectl version --client
   ```

### MacOS এ Macports দিয়ে ইনস্টল করুন

আপনি যদি macOS এ থাকেন এবং [Macports](https://macports.org/) প্যাকেজ ম্যানেজার ব্যবহার করেন, তাহলে আপনি ম্যাকপোর্টের সাথে kubectl ইনস্টল করতে পারেন।

১. ইনস্টলেশন কমান্ড চালান:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

২. আপনার ইনস্টল করা সংস্করণ আপ-টু-ডেট কিনা তা নিশ্চিত করতে পরীক্ষা করুন:

   ```bash
   kubectl version --client
   ```

## kubectl কনফিগারেশন যাচাই করুন

{{< include "included/verify-kubectl.md" >}}

## ঐচ্ছিক kubectl কনফিগারেশন এবং প্লাগইন

### শেল অটোকমপ্লিট সক্ষম করুন

kubectl Bash, Zsh, Fish এবং PowerShell-এর জন্য অটোকমপ্লিট সমর্থন প্রদান করে যা আপনাকে অনেক টাইপিং বাঁচাতে পারে।

নীচে Bash, Fish, এবং Zsh-এর জন্য স্বয়ংসম্পূর্ণতা সেট আপ করার পদ্ধতিগুলি রয়েছে৷

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl convert` প্লাগইন ইনস্টল করুন

{{< include "included/kubectl-convert-overview.md" >}}

১. কমান্ড সহ সর্বশেষ রিলিজ ডাউনলোড করুন:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

২. বাইনারি যাচাই করুন (ঐচ্ছিক)

   kubectl-convert checksum ফাইলটি ডাউনলোড করুন:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   চেকসাম ফাইলের বিপরীতে kubectl-রূপান্তর বাইনারি যাচাই করুন:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   বৈধ হলে, আউটপুট হল:

   ```console
   kubectl-convert: OK
   ```

   চেক ব্যর্থ হলে, `shasum` অশূন্য স্থিতি সহ প্রস্থান করে এবং অনুরূপ আউটপুট প্রিন্ট করে:

   ```bash
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   বাইনারি এবং চেকসামের একই সংস্করণ ডাউনলোড করুন।
   {{< /note >}}

৩. kubectl-রূপান্তর বাইনারি এক্সিকিউটেবল করুন

   ```bash
   chmod +x ./kubectl-convert
   ```

৪. আপনার সিস্টেম `PATH`-এ একটি ফাইল অবস্থানে kubectl-রূপান্তর বাইনারি সরান।

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   নিশ্চিত করুন যে `/usr/local/bin` আপনার PATH এনভায়রনমেন্ট ভেরিয়েবলে আছে।
   {{< /note >}}

৫. প্লাগইন সফলভাবে ইনস্টল করা হয়েছে যাচাই করুন

   ```shell
   kubectl convert --help
   ```

   আপনি যদি একটি ত্রুটি দেখতে না পান, এর মানে হল প্লাগইনটি সফলভাবে ইনস্টল করা হয়েছে।

৬. প্লাগইন ইনস্টল করার পরে, ইনস্টলেশন ফাইলগুলি পরিষ্কার করুন:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
