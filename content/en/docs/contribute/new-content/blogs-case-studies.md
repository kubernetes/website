---
title: Submitting blog posts and case studies
linktitle: Blogs and case studies
slug: blogs-case-studies
content_template: templates/concept
weight: 30
---


{{% capture overview %}}

Anyone can write a blog post and submit it for review.
Case studies require extensive review before they're approved.

{{% /capture %}}

{{% capture body %}}

## Write a blog post

Blog posts should not be
vendor pitches. They must contain content that applies broadly to
the Kubernetes community. The SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject) manages the review process for blog posts. For more information, see [Submit a post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).

To submit a blog post, you can either:

- Use the
[Kubernetes blog submission form](https://docs.google.com/forms/d/e/1FAIpQLSdMpMoSIrhte5omZbTE7nB84qcGBy8XnnXhDFoW0h7p2zwXrw/viewform)
- [Open a pull request](/docs/contribute/new-content/new-content/#fork-the-repo) with a new blog post. Create new blog posts in the [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts) directory.

If you open a pull request, ensure that your blog post follows the correct naming conventions and frontmatter information:

- The markdown file name must follow the format `YYY-MM-DD-Your-Title-Here.md`. For example, `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
- The front matter must include the following:

```yaml
---
layout: blog
title: "Your Title Here"
date: YYYY-MM-DD
slug: text-for-URL-link-here-no-spaces
---
```

## Submit a case study

Case studies highlight how organizations are using Kubernetes to solve
real-world problems. The Kubernetes marketing team and members of the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} collaborate with you on all case studies.

Have a look at the source for the
[existing case studies](https://github.com/kubernetes/website/tree/master/content/en/case-studies).

Refer to the [case study guidelines](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md) and submit your request as outlined in the guidelines. 

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}
