## Instructions for Contributing to the Docs/Website

Welcome! We are very pleased you want to contribute to the documentation and/or website for Kubernetes.

You can click the "Fork" button in the upper-right area of the screen to create a copy of our site on your GitHub account called a "fork." Make any changes you want in your fork, and when you are ready to send those changes to us, go to the index page for your fork and click "New Pull Request" to let us know about it.

For more information about contributing to the Kubernetes documentation, see:

* [Creating a Documentation Pull Request](http://kubernetes.io/docs/contribute/create-pull-request/)
* [Writing a New Topic](http://kubernetes.io/docs/contribute/write-new-topic/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/stage-documentation-changes/)
* [Using Page Templates](http://kubernetes.io/docs/contribute/page-templates/)

## Automatic Staging for Pull Requests

When you create a pull request (either against master or the upcoming release), your changes are staged in a custom subdomain on Netlify so that you can see your changes in rendered form before the PR is merged. You can use this to verify that everything is correct before the PR gets merged. To view your changes:

- Scroll down to the PR's list of Automated Checks
- Click "Show All Checks"
- Look for "deploy/netlify"; you'll see "Deploy Preview Ready!" if staging was successful
- Click "Details" to bring up the staged site and navigate to your changes

## Branch structure and staging

The current version of the website is served out of the `master` branch. To make changes to the live docs, such as bug fixes, broken links, typos, etc, **target your pull request to the master branch**

The `release-1.x` branch stores changes for **upcoming releases of Kubernetes**. For example, the `release-1.5` branch has changes for the 1.5 release. These changes target branches (and *not* master) to avoid publishing documentation updates prior to the release for which they're relevant. If you have a change for an upcoming release of Kubernetes, **target your pull request to the appropriate release branch**.

The staging site for the next upcoming Kubernetes release is here: [http://kubernetes-io-vnext-staging.netlify.com/](http://kubernetes-io-vnext-staging.netlify.com/). The staging site reflects the current state of what's been merged in the release branch, or in other words, what the docs will look like for the next upcoming release. It's automatically updated as new PRs get merged.

## Staging the site locally (using Docker)

Don't like installing stuff? Download and run a local staging server with a single `docker run` command.

    git clone https://github.com/kubernetes/kubernetes.github.io.git
    cd kubernetes.github.io
    docker run -ti --rm -v "$PWD":/k8sdocs -p 4000:4000 gcr.io/google-samples/k8sdocs:1.0

Then visit [http://localhost:4000](http://localhost:4000) to see our site. Any changes you make on your local machine will be automatically staged.

If you're interested you can view [the Dockerfile for this image](https://github.com/kubernetes/kubernetes.github.io/blob/master/staging-container/Dockerfile).

## Staging the site locally (from scratch setup)

The below commands to setup your environment for running GitHub pages locally. Then, any edits you make will be viewable
on a lightweight webserver that runs on your local machine.

This will typically be the fastest way (by far) to iterate on docs changes and see them staged, once you get this set up, but it does involve several install steps that take awhile to complete, and makes system-wide modifications.

Install Ruby 2.2 or higher. If you're on Linux, run these commands:

    apt-get install software-properties-common
    apt-add-repository ppa:brightbox/ruby-ng
    apt-get install ruby2.2
    apt-get install ruby2.2-dev

* If you're on a Mac, follow [these instructions](https://gorails.com/setup/osx/).
* If you're on a Windows machine you can use the [Ruby Installer](http://rubyinstaller.org/downloads/). During the installation make sure to check the option for *Add Ruby executables to your PATH*.

The remainder of the steps should work the same across operating systems.

To confirm you've installed Ruby correctly, at the command prompt run `gem --version` and you should get a response with your version number. Likewise you can confirm you have Git installed properly by running `git --version`, which will respond with your version of Git.

Install the GitHub Pages package, which includes Jekyll:

	gem install github-pages

Clone our site:

	git clone https://github.com/kubernetes/kubernetes.github.io.git

Make any changes you want. Then, to see your changes locally:

	cd kubernetes.github.io
	jekyll serve

Your copy of the site will then be viewable at: [http://localhost:4000](http://localhost:4000)
(or wherever Jekyll tells you).

## GitHub help

If you're a bit rusty with git/GitHub, you might want to read
[this](http://readwrite.com/2013/10/02/github-for-beginners-part-2) for a refresher.

## Common Tasks

### Edit Page Titles or Change the Left Navigation

Edit the yaml files in `/_data/` for the Guides, Reference, Samples, or Support areas.

You may have to exit and `jekyll clean` before restarting the `jekyll serve` to
get changes to files in `/_data/` to show up.

### Add Images

Put the new image in `/images/docs/` if it's for the documentation, and just `/images/` if it's for the website.

**For diagrams, we greatly prefer SVG files!**

### Include code from another file

To include a file that is hosted on this GitHub repo, insert this code:

<pre>&#123;% include code.html language="&lt;LEXERVALUE&gt;" file="&lt;RELATIVEPATH&gt;" ghlink="&lt;PATHFROMROOT&gt;" %&#125;</pre>

* `LEXERVALUE`: The language in which the file was written; must be [a value supported by Rouge](https://github.com/jneen/rouge/wiki/list-of-supported-languages-and-lexers).
* `RELATIVEPATH`: The path to the file you're including, relative to the current file.
* `PATHFROMROOT`: The path to the file relative to root, e.g. `/docs/admin/foo.yaml`

To include a file that is hosted in the external, main Kubernetes repo, make sure it's added to [/update-imported-docs.sh](https://github.com/kubernetes/kubernetes.github.io/blob/master/update-imported-docs.sh), and run it so that the file gets downloaded, then enter:

<pre>&#123;% include code.html language="&lt;LEXERVALUE&gt;" file="&lt;RELATIVEPATH&gt;" k8slink="&lt;PATHFROMK8SROOT&gt;" %&#125;</pre>

* `PATHFROMK8SROOT`: The path to the file relative to the root of [the Kubernetes repo](https://github.com/kubernetes/kubernetes/tree/release-1.2), e.g. `/examples/rbd/foo.yaml`

## Using tabs for multi-language examples

By specifying some inline CSV in a varable called `tabspec`, you can include a file
called `tabs.html` that generates tabs showing code examples in multiple langauges.

<pre>&#123;% capture tabspec %&#125;servicesample
JSON,json,service-sample.json,/docs/user-guide/services/service-sample.json
YAML,yaml,service-sample.yaml,/docs/user-guide/services/service-sample.yaml&#123;% endcapture %&#125;
&#123;% include tabs.html %&#125;</pre>

In English, this would read: "Create a set of tabs with the alias `servicesample`,
and have tabs visually labeled "JSON" and "YAML" that use `json` and `yaml` Rouge syntax highlighting, which display the contents of
`service-sample.{extension}` on the page, and link to the file in GitHub at (full path)."

Example file: [Pods: Multi-Container](http://kubernetes.io/docs/user-guide/pods/multi-container/).

## Use a global variable

The `/_config.yml` file defines some useful variables you can use when editing docs.

* `page.githubbranch`: The name of the GitHub branch on the Kubernetes repo that is associated with this branch of the docs. e.g. `release-1.2`
* `page.version` The version of Kubernetes associated with this branch of the docs. e.g. `v1.2`
* `page.docsbranch` The name of the GitHub branch on the Docs/Website repo that you are currently using. e.g. `release-1.1` or `master`

This keeps the docs you're editing aligned with the Kubernetes version you're talking about. For example, if you define a link like so, you'll never have to worry about it going stale in future doc branches:

<pre>View the README [here](http://releases.k8s.io/&#123;&#123;page.githubbranch&#125;&#125;/cluster/addons/README.md).</pre>

That, of course, will send users to:

[http://releases.k8s.io/release-1.2/cluster/addons/README.md](http://releases.k8s.io/release-1.2/cluster/addons/README.md)

(Or whatever Kubernetes release that docs branch is associated with.)

## Config yaml guidelines

Guidelines for config yamls that are included in the site docs. These
are the yaml or json files that contain Kubernetes object
configuration to be used with `kubectl create -f` Config yamls should
be:

* Separate deployable files, not embedded in the document, unless very
  small variations of a full config.
* Included in the doc with the include code
  [above.](#include-code-from-another-file)
* In the same directory as the doc that they are being used in
  * If you are re-using a yaml from another doc, that is OK, just
    leave it there, don't move it up to a higher level directory.
* Tested in
  [test/examples_test.go](https://github.com/kubernetes/kubernetes.github.io/blob/master/test/examples_test.go)
* Follows
  [best practices.](http://kubernetes.io/docs/user-guide/config-best-practices/)

Don't assume the reader has this repository checked out, use `kubectl
create -f https://github...` in example commands. For Docker images
used in config yamls, try to use an image from an existing Kubernetes
example. If creating an image for a doc, follow the
[example guidelines](https://github.com/kubernetes/kubernetes/blob/master/examples/guidelines.md#throughout)
section on "Docker images" from the Kubernetes repository.

## Partners
Kubernetes partners refers to the companies who contribute to the Kubernetes core codebase and/or extend their platform to support Kubernetes. Partners can get their logos added to the partner section of the [community page](http://k8s.io/community) by following the below steps and meeting the below logo specifications. Partners will also need to have a URL that is specific to integrating with Kubernetes ready; this URL will be the destination when the logo is clicked.

* The partner product logo should be a transparent png image centered in a 215x125 px frame. (look at the existing logos for reference)
* The logo must link to a URL that is specific to integrating with Kubernetes, hosted on the partner's site.
* The logo should be named *product-name*_logo.png and placed in the `/images/community_logos` folder.
* The image reference (including the link to the partner URL) should be added in `community.html` under `<div class="partner-logos" > ...</div>`.
* Please do not change the order of the existing partner images. Append your logo to the end of the list.
* Once completed and tested the look and feel, submit the pull request.

## Thank you!

Kubernetes thrives on community participation and we really appreciate your
contributions to our site and our documentation!
