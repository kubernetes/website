---
reviewers:
- mitul3737
title: লিনাক্সে kubectl ইনস্টল এবং সেট আপ করুন
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: লিনাক্সে kubectl ইনস্টল করুন
---

## {{% heading "prerequisites" %}}

আপনাকে অবশ্যই একটি kubectl সংস্করণ ব্যবহার করতে হবে যা আপনার ক্লাস্টারের একটি ছোট সংস্করণের পার্থক্যের মধ্যে রয়েছে। উদাহরণস্বরূপ, একটি v{{< skew currentVersion >}} ক্লায়েন্ট v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}}, এবং v{{< skew currentVersionAddMinor 1 >}} এর কন্ট্রোল প্লেনের সাথে যোগাযোগ করতে পারে।
kubectl এর সর্বশেষ সামঞ্জস্যপূর্ণ সংস্করণ ব্যবহার করা অপ্রত্যাশিত সমস্যাগুলি এড়াতে সাহায্য করে৷

## লিনাক্সে kubectl ইনস্টল করুন

লিনাক্সে kubectl ইনস্টল করার জন্য নিম্নলিখিত পদ্ধতি বিদ্যমানঃ

- [লিনাক্সে কার্ল দিয়ে kubectl বাইনারি ইনস্টল করুন](#install-kubectl-binary-with-curl-on-linux)
- [নেটিভ প্যাকেজ ম্যানেজমেন্ট দিয়ে ইনস্টল করুন](#install-using-native-package-management)
- [অন্যান্য প্যাকেজ ব্যবস্থাপনা ব্যবহার করে ইনস্টল করুন](#install-using-other-package-management)

### লিনাক্সে কার্ল সহ kubectl বাইনারি ইনস্টল করুন

১. কমান্ড সহ সর্বশেষ রিলিজ ডাউনলোড করুন:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
একটি নির্দিষ্ট সংস্করণ ডাউনলোড করতে, নির্দিষ্ট সংস্করণের সাথে কমান্ডের `$(curl -L -s https://dl.k8s.io/release/stable.txt)` অংশটি প্রতিস্থাপন করুন। 

উদাহরণস্বরূপ, লিনাক্সে সংস্করণ {{% skew currentPatchVersion %}} ডাউনলোড করতে, টাইপ করুন:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

২. বাইনারি যাচাই করুন (ঐচ্ছিক)

   kubectl চেকসাম ফাইল ডাউনলোড করুন:
 
   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   চেকসাম ফাইলের বিপরীতে kubectl বাইনারি যাচাই করুন:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   বৈধ হলে, আউটপুট হবে:

   ```console
   kubectl: OK
   ```

   চেক ব্যর্থ হলে, `sha256` অশূন্য স্থিতি সহ প্রস্থান করে এবং অনুরূপ আউটপুট প্রিন্ট করে:

   ```bash
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   বাইনারি এবং চেকসামের একই সংস্করণ ডাউনলোড করুন।
   {{< /note >}}

৩. kubectl ইনস্টল করুন

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   যদি আপনার টার্গেট সিস্টেমে রুট অ্যাক্সেস না থাকে, তাহলেও আপনি `~/.local/bin` ডিরেক্টরিতে kubectl ইনস্টল করতে পারেন:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # and then append (or prepend) ~/.local/bin to $PATH
   ```

   {{< /note >}}

৪. আপনার ইনস্টল করা সংস্করণ আপ-টু-ডেট কিনা তা নিশ্চিত করতে পরীক্ষা করুন:

   ```bash
   kubectl version --client
   ```
   {{< note >}}
   উপরের কমান্ডটি একটি সতর্কতা তৈরি করবে:
   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```
  আপনি এই সতর্কতা উপেক্ষা করতে পারেন। আপনি শুধুমাত্র `kubectl` এর সংস্করণটি পরীক্ষা করছেন যা আপনি ইনস্টল করেছেন।

   
   {{< /note >}}
   
   অথবা সংস্করণের বিস্তারিত দেখার জন্য এটি ব্যবহার করুনঃ 

   ```cmd
   kubectl version --client --output=yaml    
   ```

### নেটিভ প্যাকেজ ম্যানেজমেন্ট ব্যবহার করে ইনস্টল করুন

{{< tabs name="kubectl_install" >}}
{{% tab name="Debian-based distributions" %}}

১. `apt` প্যাকেজ ইনডেক্স আপডেট করুন এবং Kubernetes `apt` রিপোযিটোরী ব্যবহার করার জন্য প্রয়োজনীয় প্যাকেজ ইনস্টল করুন:

   ```shell
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl
   ```
   আপনি যদি ডেবিয়ান ৯ (স্ট্রেচ) বা তার আগে ব্যবহার করেন তবে আপনাকে `apt-transport-https` ইনস্টল করতে হবে:
   ```shell
   sudo apt-get install -y apt-transport-https
   ```

২. গুগল ক্লাউড পাবলিক সাইনিং কী ডাউনলোড করুন: 

   ```shell
   sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
   ```

৩. কুবারনেটিস `apt` রিপোযিটোরী যোগ করুন:

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

৪. নতুন রিপোযিটোরীর সাথে `apt` প্যাকেজ ইনডেক্স আপডেট করুন এবং kubectl ইনস্টল করুন:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```
{{< note >}}
ডেবিয়ান ১২ এবং উবুন্টু ২২.০৪ এর চেয়ে পুরানো রিলিজে, `/etc/apt/keyrings` ডিফল্টরূপে বিদ্যমান নেই।
আপনার প্রয়োজন হলে আপনি এই ডিরেক্টরিটি তৈরি করতে পারেন, এটি ওয়ার্ল্ড-রিডেবল কিন্তু শুধুমাত্র অ্যাডমিনদের দ্বারা লেখার যোগ্য।

{{< /note >}} 

{{% /tab %}}

{{% tab name="Red Hat-based distributions" %}}
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
sudo yum install -y kubectl
```

{{% /tab %}}
{{< /tabs >}}

### অন্যান্য প্যাকেজ ব্যবস্থাপনা ব্যবহার করে ইনস্টল করুন

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
আপনি যদি উবুন্টু বা অন্য একটি লিনাক্স ডিস্ট্রিবিউশনে থাকেন যা [স্ন্যাপ](https://snapcraft.io/docs/core/install) প্যাকেজ ম্যানেজার সমর্থন করে, তাহলে kubectl একটি [স্ন্যাপ](https://snapcraft.io/) অ্যাপ্লিকেশান হিসেবে পাওয়া যাবে।


```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
আপনি যদি লিনাক্সে থাকেন এবং [হোম্ব্রু](https://docs.brew.sh/Homebrew-on-Linux) প্যাকেজ ম্যানেজার ব্যবহার করেন, তাহলে kubectl [ইনস্টলেশন](https://docs.brew.sh/Homebrew-on-Linux#install) এর জন্য পাওয়া যাবে।

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## kubectl কনফিগারেশন যাচাই করুন

{{< include "included/verify-kubectl.md" >}}

## ঐচ্ছিক kubectl কনফিগারেশন এবং প্লাগই

### শেল অটোকম্পিসন চালু করুন

kubectl Bash, Zsh, Fish এবং PowerShell-এর জন্য অটোকম্পিসন সমর্থন প্রদান করে, যা আপনাকে অনেক টাইপিং বাঁচাতে পারে।

নীচে Bash, Fish, এবং Zsh-এর জন্য স্বয়ংসম্পূর্ণতা সেট আপ করার পদ্ধতিগুলি রয়েছে৷

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl convert` প্লাগইন ইনস্টল করুন

{{< include "included/kubectl-convert-overview.md" >}}

১. কমান্ড সহ সর্বশেষ রিলিজ ডাউনলোড করুন:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   ```

২. বাইনারি যাচাই করুন (ঐচ্ছিক)

   kubectl-convert চেকসাম ফাইলটি ডাউনলোড করুন:

   ```bash
   curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   ```

   চেকসাম ফাইলের বিপরীতে kubectl-রূপান্তর বাইনারি যাচাই করুন: 

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   বৈধ হলে, আউটপুট হল:

   ```console
   kubectl-convert: OK
   ```

   চেক ব্যর্থ হলে, `sha256` অশূন্য স্থিতি সহ প্রস্থান করে এবং অনুরূপ আউটপুট প্রিন্ট করে:

   ```bash
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   বাইনারি এবং চেকসামের একই সংস্করণ ডাউনলোড করুন।
   {{< /note >}}

৩. kubectl-convert ইনস্টল করুন

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

৪. প্লাগইন সফলভাবে ইনস্টল করা হয়েছে যাচাই করুন

   ```shell
   kubectl convert --help
   ```

   আপনি যদি একটি ত্রুটি দেখতে না পান, এর মানে হল প্লাগইনটি সফলভাবে ইনস্টল করা হয়েছে।

৫. প্লাগইন ইনস্টল করার পরে, ইনস্টলেশন ফাইলগুলি পরিষ্কার করুন:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
