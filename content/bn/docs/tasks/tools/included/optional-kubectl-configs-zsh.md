---
title: "zsh স্বয়ংক্রিয় সমাপ্তি" 
description: "zsh স্বয়ংক্রিয় সমাপ্তি এর জন্য কিছু ঐচ্ছিক কনফিগারেশন।"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Zsh-এর জন্য kubectl কমপ্লিশন স্ক্রিপ্ট `kubectl completion zsh` কমান্ড দিয়ে তৈরি করা যেতে পারে। আপনার শেলে সমাপ্তি স্ক্রিপ্ট সোর্স করা kubectl স্বয়ংসম্পূর্ণতা সক্ষম করে। 12

আপনার সমস্ত শেল সেশনে এটি করতে, আপনার `~/.zshrc` ফাইলে নিম্নলিখিত যোগ করুন:

```zsh
source <(kubectl completion zsh)
```

আপনার যদি kubectl-এর একটি উপনাম থাকে, kubectl স্বয়ংসম্পূর্ণতা স্বয়ংক্রিয়ভাবে এটির সাথে কাজ করবে।

আপনার শেল পুনরায় লোড করার পরে, kubectl স্বয়ংসম্পূর্ণতা কাজ করা উচিত।

যদি আপনি একটি ত্রুটি পান যেমন `2: command not found: compdef`, তাহলে আপনার `~/.zshrc` ফাইলের শুরুতে নিম্নলিখিত যোগ করুন:

```zsh
autoload -Uz compinit
compinit
```
