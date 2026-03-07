---
layout: blog
title: "Grokkin' the Docs"
date: 2019-11-05
slug: Grokkin-the-Docs
author: >
  [Aimee Ukasick](https://www.linkedin.com/in/aimee-ukasick/) (independent contributor)
---

{{< figure
    src="/images/blog/grokkin-the-docs/grok-definition.png"
    alt="grok: to understand profoundly and intuitively"
    title="Definition courtesy of Merriam Webster online dictionary"
>}}

## Intro - Observations of a new SIG Docs contributor

I began contributing to the SIG Docs community in August 2019. Sometimes I feel
like I am a stranger in a strange land adapting to a new community:
investigating community organization, understanding contributor society,
learning new lessons, and incorporating new jargon. I'm an observer as well as a
contributor.

## Observation 01: Read the _Contribute_ pages! {#observation-1}

I contributed code and documentation to OpenStack, OPNFV, and Acumos, so I
thought contributing to the Kubernetes documentation would be the same. I was
wrong. I should have thoroughly **read** the [Contribute to Kubernetes
docs](https://kubernetes.io/docs/contribute/) pages instead of skimming them.

I am very familiar with the git/gerrit workflow. With those tools, a contributor clones
the `master` repo and then creates a local branch. Kubernetes uses a different
approach, called _Fork and Pull_. Each contributor `forks` the master repo, and
then the contributor pushes work to their fork before creating a pull request. I
created a simple pull request (PR), following the instructions in the **Start
contributing** page's [Submit a pull
request](https://kubernetes.io/docs/contribute/start/#submit-a-pull-request)
section. This section describes how to make a documentation change using the
GitHub UI. I learned that this method is fine for a change that requires a
single commit to fix. However, this method becomes complicated when you have to
make additional updates to your PR.  GitHub creates a new commit for each change
made using the GitHub UI. The Kubernetes GitHub org requires squashing commits.
The **Start contributing** page didn't mention squashing commits, so I looked at
the GitHub and git documentation. I could not squash my commits using the GitHub
UI. I had to `git fetch` and `git checkout` my pull request locally, squash the
commits using the command line, and then push my changes. If the **Start
contributing** had mentioned squashing commits, I would have worked from a local
clone instead of using the GitHub UI.

## Observation 02: Reach out and ping someone {#observation-2}

While working on my first PRs, I had questions about working from a local clone
and about keeping my fork updated from `upstream master`. I turned to searching
the internet instead of asking on the [Kubernetes Slack](http://slack.k8s.io/)
#sig-docs channel. I used the wrong process to update my fork, so I had to `git
rebase` my PRs, which did not go well at all. As a result, I closed those PRs
and submitted new ones.  When I asked for help on the #sig-docs channel,
contributors posted useful links, what my local git config file should look
like, and the exact set of git commands to run. The process used by contributors
was different than the one defined in the **Intermediate contributing** page.
I would have saved myself so much time if I had asked what GitHub workflow to
use. The more community knowledge that is documented, the easier it is for new
contributors to be productive quickly.

##  Observation 03: Don't let conflicting information ruin your day {#observation-3}

The Kubernetes community has a contributor guide for
[code](https://github.com/kubernetes/community/tree/master/contributors/guide)
and another one for [documentation](https://kubernetes.io/docs/contribute/). The
guides contain conflicting information on the same topic. For example, the SIG
Docs GitHub process recommends creating a local branch based on
`upstream/master`.  The [Kubernetes Community Contributor
Guide](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md)
advocates updating your fork from upstream and then creating a local branch
based on your fork. Which process should a new contributor follow? Are the two
processes interchangeable? The best place to ask questions about conflicting
information is the #sig-docs or #sig-contribex channels. I asked for
clarification about the GitHub workflows in the #sig-contribex channel.
@cblecker provided an extremely detailed response, which I used to update the
**Intermediate contributing** page.

## Observation 04: Information may be scattered {#observation-4}

It's common for large open source projects to have information scattered around
various repos or duplicated between repos. Sometimes groups work in silos, and
information is not shared. Other times, a person leaves to work on a
different project without passing on specialized knowledge.
Documentation gaps exist and may never be rectified because of higher priority
items. So new contributors may have difficulty finding basic information, such
as meeting details.

Attending SIG Docs meetings is a great way to become involved. However, people
have had a hard time locating the meeting URL. Most new contributors ask in the
#sig-docs channel, but I decided to locate the meeting information in the docs.
This required several clicks over multiple pages. How many new contributors miss
meetings because they can't locate the meeting details?  

## Observation 05: Patience is a virtue {#observation-5}

A contributor may wait days for feedback on a larger PR. The process from
submission to final approval may take weeks instead of days. There are two
reasons for this: 1) most reviewers work part-time on SIG Docs; and 2) reviewers
want to provide meaningful reviews. "Drive-by reviewing" doesn't happen in SIG
Docs! Reviewers check for the following:

- Do the commit message and PR description adequately describe the change?
- Does the PR follow the guidelines in the style and content guides?

  - Overall, is the grammar and punctuation correct?
  - Is the content clear, concise, and appropriate for non-native speakers?
  - Does the content stylistically fit in with the rest of the documentation?
  - Does the flow of the content make sense?  
  - Can anything be changed to make the content better, such as using a Hugo shortcode?
  - Does the content render correctly?

- Is the content technically correct?

Sometimes the review process made me feel defensive, annoyed, and frustrated. I'm
sure other contributors have felt the same way. Contributors need to be patient!
Writing excellent documentation is an iterative process. Reviewers scrutinize
PRs because they want to maintain a high level of quality in the documentation,
not because they want to annoy contributors!

## Observation 06: Make every word count {#observation-6}

Non-native English speakers read and contribute to the Kubernetes documentation.
When you are writing content, use simple, direct language in clear, concise
sentences.  Every sentence you write may be translated into another language, so
remove words that don't add substance. I admit that implementing these
guidelines is challenging at times.

Issues and pull requests aren't translated into other languages. However, you
should still follow the aforementioned guidelines when you write the description
for an issue or pull request. You should add details and background
information to an issue so the person doing triage doesn't have to apply the
`triage/needs-information` label. Likewise, when you create a pull request, you
should add enough information about the content change that reviewers don't have
to figure out the reason for the pull request. Providing details in clear,
concise language speeds up the process.

## Observation 07: Triaging issues is more difficult than it should be {#observation-7}

In SIG Docs, triaging issues requires the ability to distinguish between
support, bug, and feature requests not only for the documentation but also for
Kubernetes code projects. How to route, label, and prioritize issues has become
easier week by week. I'm still not 100% clear on which SIG and/or project is
responsible for which parts of the documentation. The SIGs and Working Groups
[page](https://github.com/kubernetes/community/blob/master/sig-list.md) helps,
but it is not enough. At a page level in the documentation, it's not
always obvious which SIG or project has domain expertise. The page's front
matter sometimes list reviewers but never lists a SIG or project. Each page should
indicate who is responsible for content, so that SIG Docs triagers know where to
route issues.

## Observation 08: SIG Docs is understaffed {#observation-8}

Documentation is the number one driver of software adoption<sup>1</sup>.

Many contributors devote a small amount of time to SIG Docs but only a handful
are trained technical writers. Few companies have hired tech writers to work on
Kubernetes docs at least half-time. That's very disheartening for online
documentation that has had over 53 million unique page views from readers in 229
countries year to date in 2019.  

SIG Docs faces challenges due to lack of technical writers:

- **Maintaining a high quality in the Kubernetes documentation**:
    There are over 750 pages of documentation. That's _750 pages_ to check for
    stale content on a regular basis. This involves more than running a link
    checker against the `kubernetes/website` repo. This involves people having a
    technical understanding of Kubernetes, knowing which code release changes
    impact documentation, and knowing where content is located in the
    documentation so that _all_ impacted pages and example code files are updated
    in a timely fashion. Other SIGs help with this, but based on the number of
    issues created by readers, enough people aren't working on keeping the content
    fresh.    
- **Reducing the time to review and merge a PR**:
    The larger the size of the PR, the longer it takes to get the `lgtm` label
    and eventual approval. My `size/M` and larger PRs took from five to thirty
    days to approve. Sometimes I politely poked reviewers to review again after
    I had pushed updates. Other times I asked on the #sig-docs channel for _any
    approver_ to take a look and approve. People are busy. People go on
    vacation. People also move on to new roles that don't involve SIG Docs and
    forget to remove themselves from the reviewer and approver assignment file.
    A large part of the time-to-merge problem is not having enough reviewers and
    approvers. The other part is the [high
    barrier](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer)
    to becoming a reviewer or approver, much higher than what I've seen on other
    open source projects. Experienced open source tech writers who want to
    contribute to SIG Docs aren't fast-tracked into approver and reviewer roles.
    On one hand, that high barrier ensures that those roles are filled by folks
    with a minimum level of Kubernetes documentation knowledge; on the other
    hand, it might deter experienced tech writers from contributing at all, or
    from a company allocating a tech writer to SIG Docs. Maybe SIG Docs should
    consider deviating from the Kubernetes community requirements by lowering
    the barrier to becoming a reviewer or approver, on a case-by-case basis, of
    course.          
- **Ensuring consistent naming across all pages**:
    Terms should be identical to what is used in the **Standardized Glossary**. Being consistent reduces confusion.
    Tracking down and fixing these occurrences is time-consuming but worthwhile for readers.
- **Working with the Steering Committee to create project documentation guidelines**:
    The [Kubernetes Repository Guidelines](https://github.com/kubernetes/community/blob/master/github-management/kubernetes-repositories.md) don't mention documentation at all. Between a
    project's GitHub docs and the Kubernetes docs, some projects have almost
    duplicate content, whereas others have conflicting content. Create clear
    guidelines so projects know to put roadmaps, milestones, and comprehensive
    feature details in the `kubernetes/<project>` repo and to put installation,
    configuration, usage details, and tutorials in the Kubernetes docs.       
- **Removing duplicate content**:
    Kubernetes users install Docker, so a good example of duplicate content is
    Docker installation instructions. Rather than repeat what's in the Docker
    docs, state which version of Docker works with which version of Kubernetes
    and link to the Docker docs for installation. Then detail any
    Kubernetes-specific configuration. That idea is the same for the container
    runtimes that Kubernetes supports.    
- **Removing third-party vendor content**:
    This is tightly coupled to removing duplicate content. Some third-party
    content consists of lists or tables detailing external products. Other
    third-party content is found in the **Tasks** and **Tutorials** sections.
    SIG Docs should not be responsible for verifying that third-party products
    work with the latest version of Kubernetes. Nor should SIG Docs be
    responsible for maintaining lists of training courses or cloud providers.
    Additionally, the Kubernetes documentation isn't the place to pitch vendor
    products. If SIG Docs is forced to reverse its policy on not allowing
    third-party content, there could be a tidal wave of
    vendor-or-commercially-oriented pull requests. Maintaining that content
    places an undue burden on SIG Docs.
- **Indicating which version of Kubernetes works with each task and tutorial**:
    This means reviewing each task and tutorial for every release. Readers
    assume if a task or tutorial is in the latest version of the docs, it works
    with the latest version of Kubernetes.     
- **Addressing issues**:
    There are 470 open issues in the `kubernetes/website` repo. It's hard to keep up with all the issues that are created. We encourage
    those creating simpler issues to submit PRs: some do; most do not.
- **Creating more detailed content**:
    Readers
    [indicated](https://kubernetes.io/blog/2019/10/29/kubernetes-documentation-end-user-survey)
    they would like to see more detailed content across all sections of the
    documentation, including tutorials.

Kubernetes has seen unparalleled growth since its first release in 2015. Like
any fast-growing project, it has growing pains. Providing consistently
high-quality documentation is one of those pains, and one incredibly important
to an open source project. SIG Docs needs a larger core team of tech writers who
are allocated at least 50%. SIG Docs can then better achieve goals, move forward
with new content, update existing content, and address open issues in a timely fashion.

## Observation 09: Contributing to technical documentation projects requires, on average, more skills than developing software {#observation-9}

When I said that to my former colleagues, the response was a healthy dose of
skepticism and lots of laughter. It seems that many developers, as well as
managers, don't fully know what tech writers contributing to open source
projects actually do. Having done both development and technical writing for the
better part of 22 years, I've noticed that tech writers are valued far less than
software developers of comparative standing.

SIG Docs core team members do far more than write content based on requirements:

- We use some of the same processes and tools as developers, such as the
  terminal, git workflow, GitHub, and IDEs like Atom, Golang, and Visual Studio Code; we
  also use documentation-specific plugins and tools.
- We possess a good eye for detail as well as design and organization: the big picture _and_ the little picture.
- We provide documentation which has a logical flow; it is not merely content on a page
  but the way pages fit into sections and sections fit into the overall structure.
- We write content that is comprehensive and uses language that readers not fluent in English can understand.
- We have a firm grasp of English composition using various markup languages.
- We are technical, sometimes to the level of a Kubernetes admin.
- We read, understand, and occasionally write code.
- We are project managers, able to plan new work as well as assign issues to releases.
- We are educators and diplomats with every review we do and with every comment we leave on an issue.
- We use site analytics to plan work based on which pages readers access most often as well as which pages readers say are unhelpful.
- We are surveyors, soliciting feedback from the community on a regular basis.
- We analyze the documentation as a whole, deciding what content should stay and
  what content should be removed based on available resources and reader needs.
- We have a working knowledge of Hugo and other frameworks used for
  online documentation; we know how to create, use, and debug Hugo shortcodes that
  enable content to be more robust than pure Markdown.
- We troubleshoot performance issues not only with Hugo but with Netlify.
- We grapple with the complex problem of API documentation.
- We are dedicated to providing the highest quality documentation that we can.

If you have any doubts about the complexity of the Kubernetes documentation
project, watch presentations given by SIG Docs Chair Zach Corleissen:

- [Multilingual Kubernetes](https://archive.fosdem.org/2019/schedule/event/multikuber/) - the kubernetes.io stack, how we got there, and what it took to get there
- [Found in Translation: Lessons from a Year of Open Source Localization](https://youtu.be/GXkpHAruNV8)

Additionally, [Docs as Code: The Missing Manual](https://youtu.be/JvRd7MmAxPw)
(Jennifer Rondeau, Margaret Eker; 2016) is an excellent presentation on the
complexity of documentation projects in general.

The Write the Docs [website](http://www.writethedocs.org/) and [YouTube
channel](https://www.youtube.com/channel/UCr019846MitZUEhc6apDdcQ) are
fantastic places to delve into the good, the bad, and the ugly of technical writing.

Think what an open source project would be without talented, dedicated tech writers!

## Observation 10: Community is everything {#observation-10}

The SIG Docs community, and the larger Kubernetes community, is dedicated,
intelligent, friendly, talented, fun, helpful, and a whole bunch of other
positive adjectives! People welcomed me with open arms, and not only because SIG
Docs needs more technical writers. I have never felt that my ideas and contributions were
dismissed because I was the newbie. Humility and respect go a long way.
Community members have a wealth of knowledge to share. Attend meetings, ask
questions, propose improvements, thank people, and contribute in
every way that you can!

Big shout out to those who helped me, and put up with me (LOL), during my
break-in period: @zacharaysarah, @sftim, @kbhawkey, @jaypipes,  @jrondeau,
@jmangel, @bradtopol, @cody_clark, @thecrudge, @jaredb, @tengqm, @steveperry-53,
@mrbobbytables, @cblecker, and @kbarnard10.

## Outro

Do I grok SIG Docs? Not quite yet, but I do understand that SIG Docs needs more
dedicated resources to continue to be successful.


## Citations
<sup>1</sup> @linuxfoundation. "Megan Byrd-Sanicki, Open Source Strategist, Google @megansanicki - documentation is the #1 driver of software adoption. #ossummit." _Twitter_, Oct 29, 2019, 3:54 a.m., twitter.com/linuxfoundation/status/1189103201439637510.
