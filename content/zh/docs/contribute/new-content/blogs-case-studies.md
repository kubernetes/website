---
title: 提交博客和案例分析
linktitle: 博客和案例分析
slug: blogs-case-studies
content_type: concept
weight: 30
---
<!--
title: Submitting blog posts and case studies
linktitle: Blogs and case studies
slug: blogs-case-studies
content_type: concept
weight: 30
-->

<!-- overview -->
<!--
Anyone can write a blog post and submit it for review.
Case studies require extensive review before they're approved.
-->
任何人都可以撰写博客并提交评阅。
案例分析则在被批准之前需要更多的评阅。

<!-- body -->
<!--
## Write a blog post

Blog posts should not be
vendor pitches. They must contain content that applies broadly to
the Kubernetes community. The SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject) manages the review process for blog posts. For more information, see [Submit a post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).
-->
## 撰写博文 {#write-a-blog-post}

博客内容不可以是销售用语。
其中的内容必须是对整个 Kubernetes 社区中很多人都有参考意义。
SIG Docs [blog 子项目](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject)
负责管理博客的评阅过程。
更多信息可参考[提交博文](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post)。

<!--
To submit a blog post, you can either:

- Use the
[Kubernetes blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSdMpMoSIrhte5omZbTE7nB84qcGBy8XnnXhDFoW0h7p2zwXrw/viewform)
- [Open a pull request](/docs/contribute/new-content/new-content/#fork-the-repo) with a new blog post. Create new blog posts in the [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) directory.

If you open a pull request, ensure that your blog post follows the correct naming conventions and frontmatter information:

- The markdown file name must follow the format `YYY-MM-DD-Your-Title-Here.md`. For example, `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
- The front matter must include the following:
-->
要提交博文，你可以：

- 使用 [Kubernetes 博客提交表单](https://docs.google.com/forms/d/e/1FAIpQLSdMpMoSIrhte5omZbTE7nB84qcGBy8XnnXhDFoW0h7p2zwXrw/viewform)
- [发起一个包含博文的 PR](/zh/docs/contribute/new-content/new-content/#fork-the-repo)。
  新博文要创建于 [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) 目录下。

如果你要发起一个 PR，请确保所提交的博文遵从正确的命名规范和前言信息：

- Markdown 文件名必须遵从 `YYY-MM-DD-Your-Title-Here.md` 格式。
  例如，`2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
- 前言部分必须包含以下内容：

<!--
```yaml
---
layout: blog
title: "Your Title Here"
date: YYYY-MM-DD
slug: text-for-URL-link-here-no-spaces
---
```
-->
```yaml
---
layout: blog
title: "博文标题"
date: YYYY-MM-DD
slug: text-for-URL-link-here-no-spaces
---
```

<!--
## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. The Kubernetes marketing team and members of the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} collaborate with you on all case studies.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/master/content/en/case-studies).

Refer to the [case study guidelines](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md) and submit your request as outlined in the guidelines. 
-->
## 提交案例分析

案例分析用来概述组织如何使用 Kubernetes 解决现实世界的问题。
Kubernetes 市场化团队和 {{< glossary_tooltip text="CNCF" term_id="cncf" >}} 成员
会与你一起工作，撰写所有的案例分析。

请查看
[现有案例分析](https://github.com/kubernetes/website/tree/master/content/en/case-studies)
的源码。

参考[案例分析指南](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)
根据指南中的注意事项提交你的 PR 请求。

## {{% heading "whatsnext" %}}

