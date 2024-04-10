# The Kubernetes documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

এই রিপোজিটরিতে [কুবেরনেটিস ওয়েবসাইট ডকুমেন্টেশনের](https://kubernetes.io/) যাবতীয় জিনিস রয়েছে। আপনি এখানে অবদান রাখতে চাইলে আমরা খুবই খুশি হবো!

- [কুবেরনেটিস ডকে অবদানের জন্য যা করবেন ](#contributing-to-the-docs)
- [Localization READMEs](#localization-readmes)

## এই রিপোজটরি ব্যবহার করে যা যা করতে পারবেন

আপনি [হুগো এক্সটেন্ডেড ভার্সন](https://gohugo.io/) ব্যবহার করে এই ওয়েবসাইটটি লোকালি চালাতে পারবেন, কিংবা আপনি কন্টেইনার রানটাইমেও চালাতে পারবেন। আমরা সবসময় বলি কন্টেইনার রানটাইম ব্যবহার করে চালানোর জন্য, কারণ এটা ওয়েবসাইটের ডেপ্লয়মেন্ট কনসিস্টেন্সি বজায় রেখে চলে। 

## পুর্বপ্রস্তুতিমুলক তথ্যাদি

এই রিপোজিটরিটি ব্যবহার করার জন্য, আপনার নিম্নোক্ত জিনিসগুলো অবশ্যই লোকাল মেশিনে ইন্সটল করে নিতে হবেঃ 

- [এনপিম/npm ](https://www.npmjs.com/)
- [গো প্রোগ্রামিং ল্যাংগুয়েজ/Go Programming Language ](https://go.dev/)
- [হুগো (এক্সটেন্ডেড ভার্সন)/Hugo (extended version) ](https://gohugo.io/)
- একটা কন্টেইনার রানটাইম যেমন [ডকার/Docker](https://www.docker.com/).

> [!নোট]
অবশ্যই নিশ্চিত করবেন আপনি যেন [`netlify.toml`](netlify.toml#L11) ফাইলে দেওয়ার নির্দিষ্ট `HUGO_VERSION` ইন্সটল করেন।

চলুন জেনে নেওয়া যাক কাজ শুরুর আগে আপনাকে কোন কাজগুলো করে নিতে হবে। 

প্রথমত, এই রিপোজিটরিটি আপনার লোকাল মেশিনে গিট ক্লোন করে নিতে হবে। 

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

এই কুবেরনেটিস ওয়েবসাইটটি [Docsy Hugo theme](https://github.com/google/docsy#readme) দিয়ে চলে। আপনি যদি কন্টেইনার দিয়েও ওয়েবসাইটি চালানোর পরিকল্পনা করেন, তবুও আমরা বলবো যেন আপনি submodule এবং অন্যান্য dependencies গুলো pull করে নেন। নিন্মোক্ত কমান্ডগুলো ব্যবহার করে আপনি কাজটি করতে পারবেনঃ 

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

## কন্টেইনার দিয়ে যেভাবে ওয়েবসাইটটি চালাবেন
এই সাইটটি কন্টেইনার দিয়ে build করার জন্য নিচের কমান্ডটি চালানঃ 

```bash
# You can set $CONTAINER_ENGINE to the name of any Docker-like container tool
make container-serve
```

যদি কোন error আসে, তবে সম্ভবত হুগো কন্টেইনারটি চলার জন্য যথেষ্ট resource পাচ্ছেনা। এই সমস্যা সমাধান করতে চাইলে, আপনার মেশিনে ডকারের জন্য নির্ধারিত CPU এবং memory রিসোর্স বাড়িয়ে নিন ([MacOS](https://docs.docker.com/desktop/settings/mac/) and [Windows](https://docs.docker.com/desktop/settings/windows/))। 

যেকোন একটি ব্রাউজার খুলে, <http://localhost:1313> ব্রাউজ করলে আপনি ওয়েবসাইটটি দেখতে পারবেন। আপনি সোর্স ফাইলে কোন পরিবর্তন করলে হুগো নিজে নিজেই ব্রাউজারে চলা ওয়েবসাইটটি রিফ্রেশ করে আপডেট করে নিবে। 
 
## হুগো দিয়ে যেভাবে লোকাল মেশিনে ওয়েবসাইটটি চালাবেন 

লোকাল মেশিনে dependencies, deploy এবং টেস্ট ফাইলগুলো ইন্সটল করার জন্য নিচের কমান্ডগুলো চালান 

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

আপনার মেশিনের 1313 পোর্টে হুগো ওয়েবসাইটটি চলবে। যেকোন একটি ব্রাউজার খুলে, <http://localhost:1313> ব্রাউজ করলে আপনি ওয়েবসাইটটি দেখতে পারবেন। আপনি সোর্স ফাইলে কোন পরিবর্তন করলে হুগো নিজে নিজেই ব্রাউজারে চলা ওয়েবসাইটটি রিফ্রেশ করে আপডেট করে নিবে। 
