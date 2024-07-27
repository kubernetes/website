---
title: ডিপ্লয়মেন্টের টুল সহ কুবারনেটিস ইনস্টল করা
weight: 30
no_list: true
---

আপনার নিজস্ব প্রোডাকশন কুবারনেটিস ক্লাস্টার সেট আপ করার জন্য অনেক পদ্ধতি এবং সরঞ্জাম আছে।
উদাহরণ স্বরূপ:

- [kubeadm](/bn/docs/setup/production-environment/tools/kubeadm/)

- [kops](https://kops.sigs.k8s.io/): একটি স্বয়ংক্রিয় ক্লাস্টার প্রভিশনিং টুল।
  টিউটোরিয়াল, সর্বোত্তম অনুশীলন, কনফিগারেশন বিকল্প এবং কমিউনিটির
  কাছে পৌঁছানো তথ্যের জন্য, অনুগ্রহ করে চেক করুন
  [`kOps` ওয়েবসাইট](https://kops.sigs.k8s.io/) বিস্তারিত জানতে।

- [Kubespray](https://kubespray.io/):
  [Ansible](https://docs.ansible.com/) প্লেবুকের একটি রচনা,
  [ইনভেন্টরি](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory),
  প্রভিশনিং টুলস, এবং জেনেরিক ওস/কুবারনেটিস ক্লাস্টার কনফিগারেশন ব্যবস্থাপনা কাজের
  জন্য ডোমেন জ্ঞান । আপনি স্ল্যাক চ্যানেলে সম্প্রদায়ের সাথে যোগাযোগ করতে পারেন
  [#kubespray](https://kubernetes.slack.com/messages/kubespray/)।
