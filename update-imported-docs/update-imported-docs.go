package main

import (
  "bufio"
  "fmt"
  "io/ioutil"
  "os"
  "os/exec"
  "path"
  "path/filepath"
  "regexp"
  "strings"
  "github.com/ghodss/yaml"
)

func main() {

  //get command line arguments without executable
  clArgs := os.Args[1:]

  //check that an argument has been passed in
  if len(clArgs) == 0 {
    fmt.Fprintf(os.Stderr, "Please specify a config file as a command line argument.\n")
    os.Exit(1)
  }
  configFile := clArgs[0]

  //get directory of executable
  ex, err := os.Executable()
  checkError(err)
  exPath := filepath.Dir(ex) //file path of updated-imported-docs executable
  suffix := filepath.Base(exPath) //should be "updated-imported-docs"

  //check if suffix is "updated-imported-docs"
  if suffix != "update-imported-docs" {
    fmt.Fprintf(os.Stderr, "Instead of `go run update-imported-docs.go <config.yml>`, use the compiled binary `./update-imported-docs <config.yml>`\n")
    os.Exit(1)
  }

  //set root directory of website
  websiteRepo := filepath.Clean(strings.TrimSuffix(exPath,suffix)) //path of parent directory
  fmt.Fprintf(os.Stdout, "Website root directory: %s\n", websiteRepo)

  //read config.yaml file specified by first command line argument
  content, err := ioutil.ReadFile(configFile)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Error when reading file: %v\n", err)
    os.Exit(1)
  }

  //convert contents of config.yml file into a map
  var config map[string]interface{}
  err = yaml.Unmarshal(content, &config)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Error when unmarshal the config file: %v\n", err)
    os.Exit(1)
  }

  //change working directory to website root
  err = os.Chdir(websiteRepo)
  checkError(err)

  //clean out temp directory
  tmpDir := "/tmp/update_docs"
  os.RemoveAll(tmpDir)
  os.Mkdir(tmpDir, 0750)

  // Match the content between 2 `---`
  // It mostly have something like:
  // ---
  // title: ***
  // notile: ***
  // ---
  titleRegex := regexp.MustCompile("^---\ntitle:(.*\n)*?---\n")

  // To extract repo path prefix from `remote`
  remoteGitRegex := regexp.MustCompile("(https://.*)\\.git$")

  //execute for each repo
  repos := config["repos"].([]interface{})
  for _, repo := range repos {
    err = os.Chdir(tmpDir)
    checkError(err)

    //get config info for repo, clone repo locally
    r := repo.(map[string]interface{})
    repoName := r["name"].(string)
    remotePathMatch := remoteGitRegex.FindAllStringSubmatch(r["remote"].(string), -1)
    if (len(remotePathMatch) == 0) {
      fmt.Fprintf(os.Stderr, "\n\t\t\t!\t!\t!\n\nInvalid remote path %q. Schema should look like: https://<url>.git\n", r["remote"].(string))
      os.Exit(1)
    }
    remotePrefix := fmt.Sprintf("%s/tree/master", remotePathMatch[0][1])

    cmd := "git"
    args := []string{"clone", "--depth=1", "-b", r["branch"].(string), r["remote"].(string), repoName}
    fmt.Fprintf(os.Stdout, "\n\t\t\t*\t*\t*\n\nCloning repo %q...\n", repoName)
    if err := exec.Command(cmd, args...).Run(); err != nil {
      fmt.Fprintf(os.Stderr, "\n\t\t\t!\t!\t!\n\nError when cloning repo %q: %v\n", repoName, err)
      os.Exit(1)
    }

    err = os.Chdir(repoName)
    checkError(err)

    //if generate-command is specified in the repo config,
    //run the command for that repo, e.g. "hack/generate-docs.sh"
    if r["generate-command"] != nil {
      genCmd := r["generate-command"].(string)

      fmt.Fprintf(os.Stdout, "Generating docs for repo %q with %q...\n\n", repoName, genCmd)
      cmd := exec.Command(genCmd)
      cmdReader, err := cmd.StdoutPipe()
      if err != nil {
        fmt.Fprintf(os.Stderr, "\n\t\t\t!\t!\t!\n\nError when generating docs for repo %q: %v\n", repoName, err)
        os.Exit(1)
      }

      //display running output of generate command
      scanner := bufio.NewScanner(cmdReader)
      go func() {
        for scanner.Scan() {
          fmt.Printf("generator output | %s\n", scanner.Text())
        }
      }()

      err = cmd.Start()
      if err != nil {
        fmt.Fprintln(os.Stderr, "Error starting %q command\n", genCmd, err)
        os.Exit(1)
      }

      err = cmd.Wait()
      if err != nil {
        fmt.Fprintln(os.Stderr, "Error waiting for %q command\n", genCmd, err)
        os.Exit(1)
      }

    }

    //copy and rename files from src -> dst specified in config
    err = os.Chdir(websiteRepo)
    checkError(err)
    files := r["files"].([]interface{})
    for _, file := range files {
      f := file.(map[string]interface{})
      src := f["src"].(string)
      dst := f["dst"].(string)
      srcDir := filepath.Dir(src)
      absSrc, err := filepath.Abs(path.Join(tmpDir, repoName, src))
      checkError(err)
      absDst, err := filepath.Abs(dst)
      checkError(err)
      // Ignore the error if the old file is not found/
      content, _ := ioutil.ReadFile(absDst)
      titleBlock := titleRegex.Find(content)
      content, err = ioutil.ReadFile(absSrc)
      checkError(err)

      // Write to new output file
      dstFile, err := os.OpenFile(absDst, os.O_RDWR|os.O_CREATE, 0755)
      checkError(err)
      defer dstFile.Close()
      _, err = dstFile.Write(titleBlock)
      checkError(err)

      // Process content if necessary
      if r["gen-absolute-links"] != nil {
        content = processLinks(content, remotePrefix, srcDir)
      }
      _, err = dstFile.Write(content)
      checkError(err)
      dstFile.Sync()
    }
  }
  fmt.Fprintf(os.Stdout, "\n\t\t\t*\t*\t*\n\nDocs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them.\n")
}

//
func processLinks(content []byte, remotePrefix string, subPath string) []byte {
  // To catch anything of the form [text](url)
  linkRegex := regexp.MustCompile("(\\[.+?\\])\\(([^\\s\\)]+)\\)")
  // Regexes to skip
  absUrlRegex := regexp.MustCompile("https*://")
  mailRegex := regexp.MustCompile("mailto:")

  processedContent := linkRegex.ReplaceAllFunc(content, func(b []byte) []byte {
    if (absUrlRegex.Match(b) || mailRegex.Match(b)) {
      return b // no processing needed
    }
    match := linkRegex.FindAllStringSubmatch(string(b), -1)
    url := match[0][2]
    if url[0] == '#' { // link on current page
      return b
    } else if url[0] == '/' { // link at root of repo
      return []byte(fmt.Sprintf("%s(%s/%s)", match[0][1], remotePrefix, url[1:]))
    } else { // link relative to current page
      return []byte(fmt.Sprintf("%s(%s/%s/%s)", match[0][1], remotePrefix, subPath, url))
    }
  })

  h1Regex := regexp.MustCompile("^(# .*)?\n")
  processedContent = h1Regex.ReplaceAll(processedContent, []byte(""))

  return processedContent
}

func checkError(err error) {
  if err != nil {
    fmt.Fprintln(os.Stderr, err)
    os.Exit(1)
  }
}
