---
layout: blog
title: "GSoD 2020: Improving the API Reference Experience"
date: 2020-12-04
slug: gsod-2020-improving-api-reference-experience
author: >
  [Philippe Martin](https://github.com/feloy)
---

_Editor's note: Better API references have been my goal since I joined Kubernetes docs three and a half years ago. Philippe has succeeded fantastically. More than a better API reference, though, Philippe embodied the best of the Kubernetes community in this project: excellence through collaboration, and a process that made the community itself better. Thanks, Google Season of Docs, for making Philippe's work possible. —Zach Corleissen_

## Introduction

The [Google Season of Docs](https://developers.google.com/season-of-docs) project brings open source organizations and technical writers together to work closely on a specific documentation project.

I was selected by the CNCF to work on Kubernetes documentation, specifically to make the API Reference documentation more accessible.

I'm a software developer with a great interest in documentation systems. In the late 90's I started translating Linux-HOWTO documents into French. From one thing to another, I learned about documentation systems. Eventually, I wrote a Linux-HOWTO to help documentarians learn the language used at that time for writing documents, LinuxDoc/SGML.

Shortly afterward, Linux documentation adopted the DocBook language. I helped some writers rewrite their documents in this format; for example, the Advanced Bash-Scripting Guide. I also worked on the GNU `makeinfo` program to add DocBook output, making it possible to transform *GNU Info* documentation into Docbook format.

## Background

The [Kubernetes website](https://kubernetes.io/docs/home/) is built with Hugo from documentation written in Markdown format in the [website repository](https://github.com/kubernetes/website), using the [Docsy Hugo theme](https://www.docsy.dev/about/).

The existing API reference documentation is a large HTML file generated from the Kubernetes OpenAPI specification.

On my side, I wanted for some time to make the API Reference more accessible, by:
- building individual and autonomous pages for each Kubernetes resource
- adapting the format to mobile reading
- reusing the website's assets and theme to build, integrate, and display the reference pages
- allowing the search engines to reference the content of the pages

Around one year ago, I started to work on the generator building the current unique HTML page, to add a DocBook output, so the API Reference could be generated first in DocBook format, and after that in PDF or other formats supported by DocBook processors. The first result has been some [Ebook files for the API Reference](https://github.com/feloy/kubernetes-resources-reference/releases) and an auto-edited paper book.

I decided later to add another output to this generator, to generate Markdown files and create [a website with the API Reference](https://web.archive.org/web/20201022201911/https://www.k8sref.io/docs/workloads/).

When the CNCF proposed a project for the Google Season of Docs to work on the API Reference, I applied, and the match occurred.

## The Project

### swagger-ui

The first idea of the CNCF members that proposed this project was to test the [`swagger-ui` tool](https://swagger.io/tools/swagger-ui/), to try and document the Kubernetes API Reference with this standard tool. 

Because the Kubernetes API is much larger than many other APIs, it has been necessary to write a tool to split the complete API Reference by API Groups, and insert in the Documentation website several `swagger-ui` components, one for each API Group.

Generally, APIs are used by developers by calling endpoints with a specific HTTP verb, with specific parameters and waiting for a response. The `swagger-ui` interface is built for this usage: the interface displays a list of endpoints and their associated verbs, and for each the parameters and responses formats. 

The Kubernetes API is most of the time used differently: users create manifest files containing resources definitions in YAML format, and use the `kubectl` CLI to *apply* these manifests to the cluster. In this case, the most important information is the description of the structures used as parameters and responses (the Kubernetes Resources).

Because of this specificity, we realized that it would be difficult to adapt the `swagger-ui` interface to satisfy the users of the Kubernetes API and this direction has been abandoned.

### Markdown pages

The second stage of the project has been to adapt the work I had done to create the k8sref.io website, to include it in the official documentation website.

The main changes have been to:
- use go-templates to represent the output pages, so non-developers can adapt the generated pages without having to edit the generator code
- create a new custom [shortcode](https://gohugo.io/content-management/shortcodes/), to easily create links from inside the website to specific pages of the API reference
- improve the navigation between the sections of the API reference
- add the code of the generator to the Kubernetes GitHub repository containing the different reference generators

All the discussions and work done can be found in website [pull request #23294](https://github.com/kubernetes/website/pull/23294).

Adding the generator code to the Kubernetes project happened in [kubernetes-sigs/reference-docs#179](https://github.com/kubernetes-sigs/reference-docs/pull/179).

Here are the features of the new API Reference to be included in the official documentation website:

- the resources are categorized, in the categories Workloads, Services, Config & Storage, Authentication, Authorization, Policies, Extend, Cluster. This structure is configurable with a simple [`toc.yaml` file](https://github.com/kubernetes-sigs/reference-docs/blob/master/gen-resourcesdocs/config/v1.20/toc.yaml)
- each page displays associated resources at the first level ; for example: Pod, PodSpec, PodStatus, PodList
- most resource pages inline relevant definitions ; the exceptions are when those definitions are common to several resources, or are too complex to be displayed inline. With the old approach, you had to follow a hyperlink to read each extra detail.
- some widely used definitions, such as `ObjectMeta`, are documented in a specific page
- required fields are indicated, and placed first
- fields of a resource can be categorized and ordered, with the help of a [`fields.yaml` file](https://github.com/kubernetes-sigs/reference-docs/blob/master/gen-resourcesdocs/config/v1.20/fields.yaml)
- `map` fields are indicated. For example the `.spec.nodeSelector` for a `Pod` is `map[string]string`, instead of `object`, using the value of `x-kubernetes-list-type`
- patch strategies are indicated
- `apiVersion` and `kind` display the value, not the `string` type
- At the top of a reference page, the page displays the Go import necessary to use these resources from a Go program.

The work is currently on hold pending the 1.20 release. When the release finishes and the work is integrated, the API reference will be available at https://kubernetes.io/docs/reference/.

### Future Work

There are points to improve, particularly:

- Some Kubernetes resources are deeply nested. Inlining the definition of these resources makes them difficult to understand.
- The created `shortcode` uses the URL of the page to reference a Resource page. It would be easier for documentarians if they could reference a Resource by its group and name.

## Appreciation

I would like to thank my mentor [Zach Corleissen](https://github.com/zacharysarah) and the lead writers [Karen Bradshaw](https://github.com/kbhawkey), [Celeste Horgan](https://github.com/celestehorgan), [Tim Bannister](https://github.com/sftim) and [Qiming Teng](https://github.com/tengqm) who supervised me during all the season. They all have been very encouraging and gave me tons of great advice.
