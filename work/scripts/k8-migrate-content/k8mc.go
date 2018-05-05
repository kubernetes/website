//usr/bin/env go run "$0" "$@"; exit "$?"

package main

import (
	"io/ioutil"
	"log"
	"regexp"
	"sort"

	"bufio"
	"bytes"
	"flag"
	"fmt"
	"io"
	"os"
	pth "path"
	"path/filepath"
	"strings"
	"time"

	"github.com/BurntSushi/toml"

	"github.com/spf13/cast"

	"gopkg.in/yaml.v2"

	"github.com/hacdias/fileutils"
)

func main() {
	log.SetFlags(0)
	log.SetPrefix("k8cm: ")
	pwd, err := os.Getwd()
	if err != nil {
		log.Fatal("error:", err)
	}

	m := newMigrator(filepath.Join(pwd, "../../../"))

	flag.Parse()

	// Start fresh
	if err := os.RemoveAll(m.absFilename("content")); err != nil {
		log.Fatal(err)
	}

	// Copies the content files into the new Hugo content roots and do basic
	// renaming of some files to match Hugo's standard.
	must(m.contentMigrate_Step1_Basic_Copy_And_Rename())

	must(m.contentMigrate_CreateGlossaryFromData())

	// Do all replacements needed in the content files:
	// * Add menu config
	// * Replace inline Liquid with shortcodes
	// * Etc.
	must(m.contentMigrate_Replacements())

	// Creates sections for Toc/Menus
	must(m.contentMigrate_CreateSections())

	// Copy in some content that failed in the steps above etc.
	must(m.contentMigrate_Final_Step())

	log.Println("Done.")

}

type keyVal struct {
	key string
	val string
}

type contentFixer func(path, s string) (string, error)
type contentFixers []contentFixer

func (f contentFixers) fix(path, s string) (string, error) {
	var err error
	for _, fixer := range f {
		s, err = fixer(path, s)
		if err != nil {
			return "", err
		}
	}
	return s, nil
}

var (
	frontmatterRe = regexp.MustCompile(`(?s)^\s{0,10}---(.*?)\n---(\s{1,2})`)
)

type mover struct {
	projectRoot string

	tocDirs map[string]tocDir
}

func newMigrator(root string) *mover {
	return &mover{projectRoot: root, tocDirs: make(map[string]tocDir)}
}

func (m *mover) contentMigrate_Step1_Basic_Copy_And_Rename() error {

	log.Println("Start Step 1 …")

	// Copy main content to content/en
	if err := m.copyDir("docs", "content/en/docs"); err != nil {
		return err
	}

	// Copy the root content files
	if err := m.copyFile("code-of-conduct.md", "content/en/code-of-conduct.md"); err != nil {
		return err
	}

	// Case Studies
	if err := m.copyDir("case-studies", "content/en/case-studies"); err != nil {
		return err
	}

	// Partners
	if err := m.copyDir("partners", "content/en/partners"); err != nil {
		return err
	}

	// Community
	if err := m.copyDir("community", "content/en/community"); err != nil {
		return err
	}

	// Copy blog content to content/en
	if err := m.copyDir("blog", "content/en/blog"); err != nil {
		return err
	}

	// Copy Chinese content to content/cn
	if err := m.copyDir("cn/docs", "content/cn/docs"); err != nil {
		return err
	}

	// Remove the includes.md -- it is rewritten as a Hugo bundle.
	if err := os.Remove(m.absFilename("content/en/docs/home/contribute/includes.md")); err != nil {
		return err
	}

	// Remove this for now.
	if err := os.RemoveAll(m.absFilename("content/en/docs/reference/generated")); err != nil {
		return err
	}

	// Create proper Hugo sections
	if err := m.renameContentFiles("index\\.md$", "_index.md"); err != nil {
		return err
	}

	if err := m.renameContentFiles("doc.*index\\.html$", "_index.html"); err != nil {
		return err
	}

	if err := m.renameContentFiles("(case|partner|community).*index\\.html$", "_index.html"); err != nil {
		return err
	}

	// We are going to replce this later, but just make sure it gets the name correctly.
	if err := m.renameContentFile("content/en/blog/index.html", "content/en/blog/_index.md"); err != nil {
		return err
	}

	return nil
}

func (m *mover) contentMigrate_CreateGlossaryFromData() error {
	mm, err := m.readDataDir("glossary", func() interface{} { return make(map[string]interface{}) })
	if err != nil {
		return err
	}

	glossaryDir := m.absFilename("content/en/docs/reference/glossary")

	if err := os.MkdirAll(glossaryDir, os.FileMode(0755)); err != nil && !os.IsNotExist(err) {
		return err
	}

	// Add a bundle index page.
	filename := filepath.Join(glossaryDir, "index.md")
	if err := ioutil.WriteFile(filename, []byte(`---
approvers:
- chenopis
- abiogenesis-now
title: Standardized Glossary
layout: glossary
noedit: true
default_active_tag: fundamental
weight: 5
---

`), os.FileMode(0755)); err != nil {
		return err
	}

	for k, v := range mm {
		if k == "_example" {
			continue
		}

		// Create pages in content/en/docs/reference/glossary for every entry.

		vv := cast.ToStringMap(v)

		name := vv["name"]
		id := vv["id"]
		shortDesc := cast.ToString(vv["short-description"])
		longDesc := cast.ToString(vv["long-description"])
		fullLink := cast.ToString(vv["full-link"])
		aka := cast.ToString(vv["aka"])
		tags := cast.ToStringSlice(vv["tags"])
		tagsStr := ""
		for _, tag := range tags {
			tagsStr = tagsStr + "- " + tag + "\n"
		}
		tagsStr = strings.TrimSpace(tagsStr)

		filename := filepath.Join(glossaryDir, fmt.Sprintf("%s.md", k))

		shortDescNoToolTip := regexp.MustCompile(`{% glossary_tooltip.*?%}`).ReplaceAllStringFunc(
			shortDesc, func(s string) string {
				matches := regexp.MustCompile(`{% glossary_tooltip\s(text=".*?"\s)?(term_id=".*?")?\s%}`).FindStringSubmatch(s)
				if len(matches) == 0 {
					return s
				} else {
					if matches[1] != "" {
						// Use the text provided
						text := regexp.MustCompile(`text="(.*?)"`).ReplaceAllString(matches[1], "$1")
						return strings.TrimSpace(text)
					} else {
						term := regexp.MustCompile(`term_id="(.*?)"`).ReplaceAllString(matches[2], "$1")
						return strings.TrimSpace(term)
					}
				}

			},
		)

		content := fmt.Sprintf(`---
title: %s
id: %s
date: 2018-04-12
full_link: %s
short_description: >
  %s
aka: %s
tags:
%s
---
 %s
<!--more--> 

%s
`, name, id, fullLink, shortDescNoToolTip, aka, tagsStr, shortDesc, longDesc)

		if err := ioutil.WriteFile(filename, []byte(content), os.FileMode(0755)); err != nil {
			return err
		}

	}

	return nil

}

func (m *mover) contentMigrate_CreateSections() error {
	log.Println("Start Create Sections Step …")

	// Create sections from the root nodes (the Toc) in /data

	mm, err := m.readDataDir("", func() interface{} { return &SectionFromData{} })
	if err != nil {
		return err
	}

	// Sort the map to get stable diffs
	var keys []string
	for k, _ := range mm {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	for _, k := range keys {
		vi := mm[k]
		v := vi.(*SectionFromData)

		for i, tocEntry := range v.Toc {
			switch v := tocEntry.(type) {
			case string:
			case map[interface{}]interface{}:
				if err := m.handleTocEntryRecursive(i, 1, cast.ToStringMap(v)); err != nil {
					return err
				}
			default:
				panic("unknown type")
			}
		}
	}

	for _, v := range m.tocDirs {
		dir := v.dir
		relFilename := filepath.Join("content", "en", dir, "_index.md")
		relFilenameHTML := filepath.Join("content", "en", dir, "_index.html")

		// Create a section file if not already there.
		if !m.checkRelFileExists(relFilename) && !m.checkRelFileExists(relFilenameHTML) {
			filename := filepath.Join(m.absFilename(relFilename))
			content := fmt.Sprintf(`---
title: %q
weight: %d
---

`, v.title, v.weight)

			if err := ioutil.WriteFile(filename, []byte(content), os.FileMode(0755)); err != nil {
				return err
			}
		}
	}

	// Mark any section not in ToC with a flag
	if err := m.doWithContentFile("en/docs", func(path string, info os.FileInfo) error {
		contenRoot := filepath.Join(m.projectRoot, "content")
		if !info.IsDir() {
			if strings.HasPrefix(info.Name(), "_index") {
				dir, _ := filepath.Split(path)
				dir = strings.TrimPrefix(dir, contenRoot)
				dir = strings.TrimPrefix(dir, string(os.PathSeparator)+"en"+string(os.PathSeparator))
				dir = strings.TrimSuffix(dir, string(os.PathSeparator))

				if _, ok := m.tocDirs[dir]; !ok {
					show := false
					for k, _ := range m.tocDirs {
						if strings.HasPrefix(k, dir) {
							show = true
							break
						}
					}
					if !show {
						if err := m.replaceInFile(path, addKeyValue("toc_hide", true)); err != nil {
							return err
						}
					}
				}
			}
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}

func (m *mover) readDataDir(name string, createMapEntry func() interface{}) (map[string]interface{}, error) {
	dataDir := filepath.Join(m.absFilename("data"), name)
	log.Println("Read data from", dataDir)
	fd, err := os.Open(dataDir)
	if err != nil {
		return nil, err
	}
	defer fd.Close()
	fis, err := fd.Readdir(-1)
	if err != nil {
		return nil, err
	}

	mm := make(map[string]interface{})

	for _, fi := range fis {
		if fi.IsDir() {
			continue
		}
		name := fi.Name()
		baseName := strings.TrimSuffix(name, filepath.Ext(name))
		b, err := ioutil.ReadFile(filepath.Join(dataDir, name))
		if err != nil {
			return nil, err
		}

		to := createMapEntry()

		if err := yaml.Unmarshal(b, to); err != nil {
			return nil, err
		}
		mm[baseName] = to

	}

	return mm, nil
}

type SectionFromData struct {
	Bigheader   string        `yaml:"bigheader"`
	Abstract    string        `yaml:"abstract"`
	LandingPage string        `yaml:"landing_page"`
	Toc         []interface{} `yaml:"toc"`
}

type tocDir struct {
	title  string
	dir    string
	weight int
}

func (m *mover) handleTocEntryRecursive(sidx, level int, entry map[string]interface{}) error {

	title := cast.ToString(entry["title"])

	if sect, found := entry["section"]; found {
		for i, e := range sect.([]interface{}) {
			sectionWeight := (sidx + 1 + i) * 10

			switch v := e.(type) {
			case string:
				v = strings.TrimSpace(v)
				if !strings.HasPrefix(v, "docs") {
					log.Println("skip toc file:", v)
					continue
				}
				if strings.HasSuffix(v, "index.md") {
					continue
				}

				if strings.Contains(v, "generated") {
					continue
				}

				dir := filepath.Dir(v)
				_, found := m.tocDirs[dir]

				if !found {
					m.tocDirs[dir] = tocDir{
						weight: sectionWeight,
						title:  title,
						dir:    dir,
					}
				}

			case map[interface{}]interface{}:
				mm := cast.ToStringMap(v)

				level = level + 1
				if err := m.handleTocEntryRecursive(i, level, mm); err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func (m *mover) contentMigrate_Replacements() error {
	log.Println("Start Replacement Step …")

	// Adjust link titles
	linkTitles := []keyVal{
		keyVal{"en/docs/home/_index.md", "Documentation"},
		keyVal{"en/docs/reference/_index.md", "Reference"},
	}

	for _, title := range linkTitles {
		if err := m.replaceInFileRel(filepath.Join("content", title.key), addLinkTitle(title.val)); err != nil {
			return err
		}
	}

	filesInDocsMainMenu := []string{
		"en/docs/home/_index.md",
		"en/docs/setup/_index.md",
		"en/docs/concepts/_index.md",
		"en/docs/tasks/_index.md",
		"en/docs/tutorials/_index.md",
		"en/docs/reference/_index.md",
	}

	for i, f := range filesInDocsMainMenu {
		weight := 20 + (i * 10)
		if err := m.replaceInFileRel(filepath.Join("content", f), addToDocsMainMenu(weight)); err != nil {
			return err
		}
	}

	// Adjust some layouts
	if err := m.replaceInFileRel(filepath.Join("content", "en/docs/home/_index.md"), stringsReplacer("layout: docsportal", "layout: docsportal_home")); err != nil {
		return err
	}

	// This is replaced with a section content file
	if err := os.Remove(m.absFilename(filepath.Join("content", "en/docs/reference/glossary.md"))); err != nil {
		return err
	}

	htmlAndMDContentFixSet := contentFixers{
		func(path, s string) (string, error) {
			s = strings.Replace(s, `layout: basic`, ``, 1)
			if strings.Contains(filepath.FromSlash(path), "docs/tutorials/kubernetes-basics/_index.html") {
				n, err := addKeyValue("linkTitle", "Try Our Interactive Tutorials")(path, s)
				if err == nil {
					s = n
				}
			}

			return s, nil
		},
	}

	mainContentFixSet := contentFixers{
		// This is a typo, but it creates a breaking shortcode
		// {{ "{% glossary_tooltip text=" }}"cluster" term_id="cluster" %}
		func(path, s string) (string, error) {
			return strings.Replace(s, `{{ "{% glossary_tooltip text=" }}"cluster" term_id="cluster" %}`, `{% glossary_tooltip text=" term_id="cluster" %}`, 1), nil
		},

		func(path, s string) (string, error) {

			// Fix newline
			s = strings.Replace(s, `{% glossary_tooltip text="Platform
Developers" term_id="platform-developer" %}`, `{% glossary_tooltip text="Platform Developers" term_id="platform-developer" %}`, 1)

			re := regexp.MustCompile(`{% glossary_tooltip(.*?)%}`)
			return re.ReplaceAllString(s, `{{< glossary_tooltip$1>}}`), nil
			return s, nil
		},

		// Markdown links with target set.
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`\[(.*?)\]\((.*?)\){:target="_blank"}`)
			return re.ReplaceAllString(s, `{{< link text="$1" url="$2" >}}`), nil
			return s, nil
		},

		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{% glossary_definition(.*?)%}`)
			return re.ReplaceAllString(s, `{{< glossary_definition$1>}}`), nil
			return s, nil
		},

		// Toc / table of contents
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{:toc}`)
			return re.ReplaceAllString(s, `{{< toc >}}`), nil
			return s, nil
		},

		// Code includes
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{% include code.html\s*(language=".*?")?(\s*file=".*?").*?%}`)
			return re.ReplaceAllString(s, `{{< code $1$2 >}}`), nil
		},

		// This is the most common. The language can be derived from the filename making it less chatty.
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{{< code language="yaml"(.*?)>}}`)
			return re.ReplaceAllString(s, `{{< code$1>}}`), nil
		},

		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{% assign reference_docs_url.*?%}`)
			return re.ReplaceAllString(s, ""), nil
			return s, nil
		},

		// re := regexp.MustCompile(`(?s){% capture (.*?) %}(.*?){% endcapture %}`)
		func(path, s string) (string, error) {
			re := regexp.MustCompile("(?s)```shell\\s?\\{% raw %\\}(.*?)\\{% endraw %\\}(.*?)(\n)?```")
			return re.ReplaceAllString(s, "```shell$1$2$3```"), nil
		},

		// Remove the rest of the "raw" markers
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`(?s)\{% raw %\}(.*?)\{% endraw %\}`)
			return re.ReplaceAllString(s, "$1"), nil
		},

		// Handle comments
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`(?s){% comment %}(.*?){% endcomment %}`)
			return re.ReplaceAllString(s, "{{< comment >}}$1{{< /comment >}}"), nil
		},

		// Handle the inline version loops
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`(?s){% for v in page.versions %}.*?{% endfor %}`)
			return re.ReplaceAllString(s, "{{< versions-other >}}"), nil
		},

		// The included content files does not share the same front matter etc.
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{{< include "task-tutorial-prereqs.md" >}}`)
			return re.ReplaceAllString(s, `{{< include "task-tutorial-prereqs.md" >}}
{{< version-check >}}
`), nil
		},

		func(path, s string) (string, error) {
			// Remove dangling TOC
			s = strings.Replace(s, "* TOC\n", "", 1)

			// Create alias for the security page
			s = strings.Replace(s, "permalink: /security/", "aliases: [/security/]", 1)

			// Some now superflous layout
			s = strings.Replace(s, "layout: docwithnav", "", 1)

			return s, nil
		},

		//

		func(path, s string) (string, error) {
			re := regexp.MustCompile(`\[(Kubernetes )?API reference.*?\]\({{ reference_docs_url }}\).*?"_blank"}`)
			return re.ReplaceAllString(s, "{{< reference_docs >}}"), nil
		},

		replaceCaptures,

		calloutsToShortCodes,

		// Handle the feature state dialogs
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{% assign for_k8s_version="(.*?)" %}{% include feature-state-(.*?).md %}`)
			return re.ReplaceAllString(s, `{{< feature-state for_k8s_version="$1" state="$2" >}}`), nil
			return s, nil
		},

		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{% include feature-state-(.*?).md %}`)
			return re.ReplaceAllString(s, `{{< feature-state state="$1" >}}`), nil
		},

		// Handle the params in content (version etc.)
		//
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{{\s?page\.(.*?)\s?}}`)
			return re.ReplaceAllString(s, `{{< param "$1" >}}`), nil
		},
	}

	if err := m.applyContentFixers(mainContentFixSet, "md$"); err != nil {
		return err
	}

	if err := m.applyContentFixers(htmlAndMDContentFixSet, "md$|html$"); err != nil {
		return err
	}

	blogFixers := contentFixers{
		// Makes proper YAML dates from "Friday, July 02, 2015" etc.
		fixDates,

		// Add slugs from filename. Note that we could have configured Hugo to use
		// date/slug from filename, but the 2018-01-00- filenames breaks it.
		func(path, s string) (string, error) {
			// 2018-01-00-Core-Workloads-Api-Ga.md
			re := regexp.MustCompile(`\d{4}-\d{2}-\d{2}-(.*?)\.md`)
			m := re.FindStringSubmatch(path)
			if len(m) < 2 {
				return s, nil
			}
			namePart := strings.Trim(m[1], " -")
			slug := strings.ToLower(strings.Replace(namePart, " ", "-", -1))
			s, err := addKeyValue("slug", slug)(path, s)
			if err != nil {
				return s, err
			}

			re = regexp.MustCompile(`(\d{4}-\d{2})(-00)-(.*?)\.md`)

			// For old blog posts with 2018-01-00 format type of filenames, set URL explicitly
			m = re.FindStringSubmatch(path)
			if len(m) > 1 {
				spl := strings.Split(m[1], "-")
				return addKeyValue("url", pth.Join("/blog", spl[0], spl[1], namePart))(path, s)
			}
			return s, err

		},

		func(path, s string) (string, error) {
			// Superflous
			s = strings.Replace(s, "permalink: /blog/:year/:month/:title\n", "", 1)
			s = strings.Replace(s, "layout: blog\n", "", 1)
			s = strings.Replace(s, `pagination:
  enabled: true
`, "", 1)

			// This isn't supported in Hugo. Doing with a shortcode isn't practical.
			s = m.removeCallout(s, "big-img")
			s = m.removeCallout(s, "big-image")
			s = m.removeCallout(s, "scale-yaml")
			s = m.removeCallout(s, "post-table")
			s = m.removeCallout(s, "blog-content")
			s = m.removeCallout(s, "inline-link")
			s = m.removeCallout(s, "sup")
			s = m.removeCallout(s, "style")

			// Tables needs at least 3 dashes. The blog seems to use ... 2.
			// |--|--|
			s = strings.Replace(s, "|--", "|---", -1)
			s = strings.Replace(s, "|--|", "|---|", -1)

			return s, nil
		},
	}

	if err := m.applyContentFixers(blogFixers, ".*blog/.*md$"); err != nil {
		return err
	}

	// Handle the tutorial includes
	if err := m.replaceStringWithFrontMatter("{% include templates/tutorial.md %}", "content_template", "templates/tutorial"); err != nil {
		return err
	}

	// Handle the concept includes
	if err := m.replaceStringWithFrontMatter("{% include templates/concept.md %}", "content_template", "templates/concept"); err != nil {
		return err
	}

	// Handle the task includes
	if err := m.replaceStringWithFrontMatter("{% include templates/task.md %}", "content_template", "templates/task"); err != nil {
		return err
	}

	// Handle the user journey (sounds like a rock band)
	if err := m.replaceStringWithFrontMatter(`{% include templates/user-journey-content.md %}`, "content_template", "templates/user-journey-content"); err != nil {
		return err
	}

	// Handle the explicit replacements defined in replacments toml (tabs etc.)
	if err := m.handleReplacementsFromTOML(); err != nil {
		return err
	}

	// These needs to be applied late
	lateContentFixSet := contentFixers{
		// Includes
		func(path, s string) (string, error) {
			re := regexp.MustCompile(`{% include(_relative)? (.*?) %}`)
			return re.ReplaceAllString(s, `{{< include "$2" >}}`), nil
			return s, nil
		},
		// The included content files does not share the same front matter etc.
		func(path, s string) (string, error) {
			return strings.Replace(s, `{{< include "task-tutorial-prereqs.md" >}}`, `{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}`, -1), nil
		},

		// Remove any endcapture leftovers
		//
		func(path, s string) (string, error) {
			return strings.Replace(s, `{% endcapture %}`, ``, -1), nil
		},
	}

	if err := m.applyContentFixers(lateContentFixSet, "md$"); err != nil {
		return err
	}
	return nil

}

func (m *mover) removeCallout(s, c string) string {
	re := regexp.MustCompile(fmt.Sprintf(`{:\s?\.?%s.*?}`, c))
	return re.ReplaceAllString(s, "")
}

func (m *mover) contentMigrate_Final_Step() error {
	log.Println("Start Final Step …")
	// Copy additional content files from the work dir.
	// This will in some cases revert changes made in previous steps, but
	// these are intentional.

	// These are new files.
	if err := m.copyDir("work/content", "content"); err != nil {
		return err
	}

	// These are just kept unchanged from the orignal. Needs manual handling.
	if err := m.copyDir("work/content_preserved", "content"); err != nil {
		return err
	}

	return nil
}

func (m *mover) applyContentFixers(fixers contentFixers, match string) error {
	re := regexp.MustCompile(match)
	return m.doWithContentFile("", func(path string, info os.FileInfo) error {
		if !info.IsDir() && re.MatchString(path) {
			if err := m.replaceInFile(path, fixers.fix); err != nil {
				return err
			}
		}
		return nil
	})
}

func (m *mover) renameContentFile(from, to string) error {
	from = m.absFilename(from)
	to = m.absFilename(to)
	return os.Rename(from, to)
}

func (m *mover) renameContentFiles(match, renameTo string) error {
	re := regexp.MustCompile(match)
	return m.doWithContentFile("", func(path string, info os.FileInfo) error {
		if !info.IsDir() && re.MatchString(path) {
			dir := filepath.Dir(path)
			targetFilename := filepath.Join(dir, renameTo)
			return os.Rename(path, targetFilename)
		}

		return nil
	})
}

func (m *mover) doWithContentFile(subfolder string, f func(path string, info os.FileInfo) error) error {
	docsPath := filepath.Join(m.projectRoot, "content", subfolder)
	return filepath.Walk(docsPath, func(path string, info os.FileInfo, err error) error {
		return f(path, info)
	})
}

func (m *mover) copyDir(from, to string) error {
	from, to = m.absFromTo(from, to)
	return fileutils.CopyDir(from, to)
}

func (m *mover) copyFile(from, to string) error {
	from, to = m.absFromTo(from, to)
	return fileutils.CopyFile(from, to)
}

func (m *mover) moveDir(from, to string) error {
	from, to = m.absFromTo(from, to)

	if err := os.RemoveAll(to); err != nil {
		return err
	}
	return os.Rename(from, to)
}

func (m *mover) absFromTo(from, to string) (string, string) {
	return m.absFilename(from), m.absFilename(to)
}

func (m *mover) absFilename(name string) string {
	abs := filepath.Join(m.projectRoot, name)
	if len(abs) < 20 {
		panic("path too short")
	}
	return abs
}

func (m *mover) checkRelFileExists(rel string) bool {
	if _, err := os.Stat(m.absFilename(rel)); err != nil {
		if !os.IsNotExist(err) {
			panic(err)
		}
		return false
	}
	return true
}

func must(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func (m *mover) openOrCreateTargetFile(target string, info os.FileInfo) (io.ReadWriteCloser, error) {
	targetDir := filepath.Dir(target)

	err := os.MkdirAll(targetDir, os.FileMode(0755))
	if err != nil {
		return nil, err
	}

	return m.openFileForWriting(target, info)
}

func (m *mover) openFileForWriting(filename string, info os.FileInfo) (io.ReadWriteCloser, error) {
	return os.OpenFile(filename, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, info.Mode())
}

func (m *mover) handleFile(filename string, create bool, info os.FileInfo, replacer func(path string, content string) (string, error)) error {

	var (
		out io.ReadWriteCloser
		in  bytes.Buffer
		err error
	)

	infile, err := os.Open(filename)
	if err != nil {
		return err
	}
	in.ReadFrom(infile)
	infile.Close()

	if create {
		out, err = m.openOrCreateTargetFile(filename, info)
	} else {
		out, err = m.openFileForWriting(filename, info)
	}

	if err != nil {
		return err
	}
	defer out.Close()

	return m.replace(filename, &in, out, replacer)
}

func (m *mover) handleReplacementsFromTOML() error {
	log.Println("Handle replacements defined in replacements.toml …")
	mm := make(map[string]interface{})
	_, err := toml.DecodeFile("replacements.toml", &mm)
	if err != nil {
		return err
	}
	replacements := cast.ToSlice(mm["replacements"])

	for _, r := range replacements {
		rm := cast.ToStringMapString(r)
		filename := rm["filename"]
		match := rm["matchRe"]
		replacement := rm["replacement"]

		matchRe := regexp.MustCompile(match)

		absFilename := m.absFilename(filename)
		replacer := func(path string, content string) (string, error) {
			return matchRe.ReplaceAllString(content, replacement), nil
		}

		if err := m.replaceInFile(absFilename, replacer); err != nil {
			return err
		}

	}

	return nil
}

func (m *mover) replace(path string, in io.Reader, out io.Writer, replacer func(path string, content string) (string, error)) error {
	var buff bytes.Buffer
	if _, err := io.Copy(&buff, in); err != nil {
		return err
	}

	var r io.Reader

	fixed, err := replacer(path, buff.String())
	if err != nil {
		// Just print the path and error to the console.
		// This will have to be handled manually somehow.
		log.Printf("%s\t%s\n", path, err)
		r = &buff
	} else {
		r = strings.NewReader(fixed)
	}

	if _, err = io.Copy(out, r); err != nil {
		return err
	}
	return nil
}

func (m *mover) replaceInFileRel(rel string, replacer func(path string, content string) (string, error)) error {
	return m.replaceInFile(m.absFilename(rel), replacer)
}

func (m *mover) replaceInFile(filename string, replacer func(path string, content string) (string, error)) error {
	fi, err := os.Stat(filename)
	if err != nil {
		return err
	}
	return m.handleFile(filename, false, fi, replacer)
}

/*func addToDocsMainMenu(weight int) func(path, s string) (string, error) {
	return func(path, s string) (string, error) {
		return appendToFrontMatter(s, fmt.Sprintf(`menu:
  docsmain:
    weight: %d`, weight)), nil
	}

}*/

func (m *mover) replaceStringWithFrontMatter(matcher, key, val string) error {

	matcherRe := regexp.MustCompile(matcher)

	err := m.doWithContentFile("", func(path string, info os.FileInfo) error {
		if info != nil && !info.IsDir() {
			b, err := ioutil.ReadFile(path)
			if err != nil {
				return err
			}
			if matcherRe.Match(b) {
				if err := m.replaceInFile(path, addKeyValue(key, val)); err != nil {
					return err
				}
				if err := m.replaceInFile(path, func(path, s string) (string, error) {
					return matcherRe.ReplaceAllString(s, ""), nil
				}); err != nil {
					return err
				}
			}
		}
		return nil
	})

	return err

}
func addToDocsMainMenu(weight int) func(path, s string) (string, error) {
	return func(path, s string) (string, error) {
		return appendToFrontMatter(s, fmt.Sprintf(`main_menu: true
weight: %d`, weight)), nil
	}

}

func addLinkTitle(title string) func(path, s string) (string, error) {
	return func(path, s string) (string, error) {
		return appendToFrontMatter(s, fmt.Sprintf("linkTitle: %q", title)), nil
	}
}

func addWeight(weight int) func(path, s string) (string, error) {
	return func(path, s string) (string, error) {
		return appendToFrontMatter(s, fmt.Sprintf("weight: %d", weight)), nil
	}
}

func addKeyValue(key string, value interface{}) func(path string, s string) (string, error) {
	return func(path, s string) (string, error) {
		return appendToFrontMatter(s, fmt.Sprintf("%s: %v", key, value)), nil
	}
}

func appendToFrontMatter(src, addition string) string {
	return frontmatterRe.ReplaceAllString(src, fmt.Sprintf(`---$1
%s
---$2`, addition))

}

func replaceCaptures(path, s string) (string, error) {
	re := regexp.MustCompile(`(?s){% capture (.*?) %}(.*?){% endcapture %}`)
	return re.ReplaceAllString(s, `{{% capture $1 %}}$2{{% /capture %}}`), nil
}

// Introduce them little by little to test
var callouts = regexp.MustCompile("note|caution|warning")

func calloutsToShortCodes(path, s string) (string, error) {

	// This contains callout examples that needs to be handled by hand.
	if strings.Contains(path, "style-guide") {
		return s, nil
	}

	if !strings.Contains(s, "{:") {
		return s, nil
	}

	calloutRe := regexp.MustCompile(`(\s*){:\s*\.(.*)}`)

	var all strings.Builder
	var current strings.Builder

	scanner := bufio.NewScanner(strings.NewReader(s))
	pcounter := 0
	var indent, shortcode string
	isOpen := false

	for scanner.Scan() {
		line := scanner.Text()
		l := strings.TrimSpace(line)
		if l == "" || l == "---" {
			pcounter = 0
		} else {
			pcounter++
		}

		// Test with the notes
		if strings.Contains(line, "{:") && callouts.MatchString(line) {
			// This may be the start or the end of a callout.
			isStart := pcounter == 1

			m := calloutRe.FindStringSubmatch(line)
			indent = m[1]
			shortcode = m[2]
			all.WriteString(fmt.Sprintf("%s{{< %s >}}\n", indent, shortcode))
			if !isStart {
				all.WriteString(current.String())
				all.WriteString(fmt.Sprintf("%s{{< /%s >}}\n", indent, shortcode))
				current.Reset()
			} else {
				isOpen = true
			}

		} else {
			current.WriteString(line)
			if !isOpen || pcounter != 0 {
				current.WriteRune('\n')
			}
			if pcounter == 0 {
				if isOpen {
					current.WriteString(fmt.Sprintf("%s{{< /%s >}}\n", indent, shortcode))
					isOpen = false
				}
				all.WriteString(current.String())
				current.Reset()
			}

		}

	}

	all.WriteString(current.String())

	return all.String(), nil

}

func stringsReplacer(old, new string) func(path, s string) (string, error) {
	return func(path, s string) (string, error) {
		return strings.Replace(s, old, new, -1), nil
	}

}

func fixDates(path, s string) (string, error) {
	dateRe := regexp.MustCompile(`(date):\s*(.*)\s*\n`)

	// Make text dates in front matter date into proper YAML dates.
	replaced := dateRe.ReplaceAllStringFunc(s, func(s string) string {
		m := dateRe.FindAllStringSubmatch(s, -1)
		key, val := m[0][1], m[0][2]

		tt, err := time.Parse("Monday, January 2, 2006", strings.TrimSpace(val))
		if err != nil {
			err = fmt.Errorf("Date Parse failed: %s: %s", key, err)
			return ""
		}

		return fmt.Sprintf("%s: %s\n", key, tt.Format("2006-01-02"))
	})

	if replaced != "" {
		return replaced, nil
	}

	return s, nil
}
