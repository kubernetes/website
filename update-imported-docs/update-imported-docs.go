package main

import (
  "fmt"
  "io"
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
  if err != nil {
      panic(err)
  }
  exPath := filepath.Dir(ex) //file path of updated-imported-docs executable
  suffix := filepath.Base(exPath) //should be "updated-imported-docs"

  //set root directory of website
  websiteRepo := filepath.Clean(strings.TrimSuffix(exPath,suffix)) //path of parent directory
  fmt.Fprintf(os.Stdout, "Website root directory: %s\n", websiteRepo)

  //read config.yaml file specified by first command line argument
  content, err := ioutil.ReadFile(configFile)
  if err != nil {
    fmt.Fprintf(os.Stderr, "error when reading file: %v\n", err)
    os.Exit(1)
  }

  //convert contents of config.yml file into a map
  var config map[string]interface{}
  err = yaml.Unmarshal(content, &config)
  if err != nil {
    fmt.Fprintf(os.Stderr, "error when unmarshal the config file: %v\n", err)
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
  titleRegex := regexp.MustCompile("^---\n(.*\n)*---\n")

  //execute for each repo
  repos := config["repos"].([]interface{})
  for _, repo := range repos {
    err = os.Chdir(tmpDir)
    checkError(err)

    //get config info for repo, clone repo locally
    r := repo.(map[string]interface{})
    repoName := r["name"].(string)
    cmd := "git"
    args := []string{"clone", "--depth=1", "-b", r["branch"].(string), r["remote"].(string), repoName}
    fmt.Fprintf(os.Stdout, "Cloning repo %q\n", repoName)
    if err := exec.Command(cmd, args...).Run(); err != nil {
      fmt.Fprintf(os.Stderr, "error when cloning repo %q: %v\n", repoName, err)
      os.Exit(1)
    }

    err = os.Chdir(repoName)
    checkError(err)

    //if generate-command is specified in the repo config,
    //run the command for that repo, e.g. "hack/generate-docs.sh"
    if r["generate-command"] != nil {
      genCmd := r["generate-command"].(string)

      fmt.Fprintf(os.Stdout, "Generating docs for repo %q with %q\n", repoName, genCmd)
      if err := exec.Command(genCmd).Run(); err != nil {
        fmt.Fprintf(os.Stderr, "error when generating docs for repo %q: %v\n", repoName, err)
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
      absSrc, err := filepath.Abs(path.Join(tmpDir, repoName, src))
      checkError(err)
      absDst, err := filepath.Abs(dst)
      checkError(err)
      // Ignore the error if the old file is not found/
      content, _ := ioutil.ReadFile(absDst)
      titleBlock := titleRegex.Find(content)
      content, err = ioutil.ReadFile(absSrc)
      checkError(err)
      dstFile, err := os.OpenFile(absDst, os.O_RDWR|os.O_CREATE, 0755)
      checkError(err)
      defer dstFile.Close()
      _, err = dstFile.Write(titleBlock)
      checkError(err)
      _, err = dstFile.Write(content)
      checkError(err)
      dstFile.Sync()
    }
  }
  fmt.Fprintf(os.Stdout, "Docs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them\n")
}

func copyFile(src, dst string) error {
  sf, err := os.Open(src)
  if err != nil {
    return err
  }
  defer sf.Close()

  df, err := os.Create(dst)
  if err != nil {
    return err
  }
  defer df.Close()

  _, err = io.Copy(df, sf)
  if err != nil {
    return err
  }

  return df.Sync()
}

func checkError(err error) {
  if err != nil {
    fmt.Fprintln(os.Stderr, err)
    os.Exit(1)
  }
}
