# The Kubernetes documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

এই রিপোজিটরিতে [কুবেরনেটিস ওয়েবসাইট ডকুমেন্টেশনের](https://kubernetes.io/) যাবতীয় জিনিস রয়েছে। আপনি এখানে অবদান রাখতে চাইলে আমরা খুবই খুশি হবো!

- [কুবেরনেটিস ডকে অবদানের জন্য যা করবেন ](#contributing-to-the-docs)
- [Localization READMEs](#localization-readmes)

## এই রিপোজটরি ব্যবহার করে যা যা করতে পারবেন

You can run the website locally using [Hugo (Extended version)](https://gohugo.io/), or you can run it in a container runtime. We strongly recommend using the container runtime, as it gives deployment consistency with the live website.

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