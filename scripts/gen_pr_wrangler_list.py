#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Wed Jun 19 16:04:16 2019

@author: josiahbjorgaard
"""
from random import shuffle
#from datetime import datetime

def create_new_wranger_doc(number1=7,number2=7):
    path_to_wiki='../../website.wiki/PR-Wranglers.md'
    path_to_owners='../OWNERS_ALIASES'
    path_to_output='../../website.wiki/PR-Wranglers-new.md'

    #Scrape the new list of possible wranglers from the OWNERS_ALIASES file
    with open(path_to_owners) as f:
        wranglers=get_wranglers(f)
        
    #Read the Byes from the PR-Wranglers.md file
    with open(path_to_wiki) as f:
        byes=get_byes(f)
                    
    #Create the new lists of Wranglers and Byes for two different quarters
    wranglers1,byes1=shuffle_wranglers_and_byes(wranglers,byes,number1) 
    wranglers2,byes2=shuffle_wranglers_and_byes(wranglers,byes1,number2) 
    
    #Recreate the new PR-Wranglers.md file from the old one
    with open(path_to_output,"w+") as fo:
        with open(path_to_wiki) as f:
            for line in f:
                if 'Schedule' in line:
                    line=schedule_title(line)
                    fo.write(line+"\n")
                    break
                fo.write(line)
            fo.write("\n")
            fo.write("Week | Approver\n")
            fo.write("---|---\n")
            for wrangler in wranglers1:
                fo.write("DATE | @"+wrangler+"\n")
            for wrangler in wranglers2:
                fo.write("DATE | @"+wrangler+"\n")
            fo.write("\n")
            fo.write("### Byes Q\n")
            fo.write("\n")
            for bye in byes1:
                fo.write("@"+bye+"\n")
            fo.write("\n")
            fo.write("### Byes Q\n")
            fo.write("\n")
            for bye in byes2:
                fo.write("@"+bye+"\n")
            fo.write("\n")
            fo.write("### Updates\n")
    return

def shuffle_wranglers_and_byes(wranglers_in,byes,number):
    new_byes=[]
    wranglers=list(wranglers_in)
    if number>len(wranglers):
        raise ValueError('Number must be <= the length of wranglers')
    shuffle(wranglers)
    for i,wrangler in enumerate(wranglers):
        if len(wranglers)<=number:
            break
        if wrangler not in byes:
            new_byes.append(wranglers.pop(i))
    return wranglers,new_byes

def schedule_title(line):
    lsp=line.split()
    try:
        int(lsp[1])
    except ValueError:
        print("Got "+lsp[1]+" instead of year, couldn't convert it to int")
    lsp[1]=str(int(lsp[1])+1)
    if lsp[3]=='Q1/Q2':
        lsp[3]='Q3/Q4'
    elif lsp[3]=='Q3/Q4':
        lsp[3]='Q1/Q2'
    #else:
        #raise #Exception('Could not find Q1/Q2 or Q3/Q4, instead got '+lsp[3])
    line=" ".join(lsp)
    return(line)       

def get_byes(f):
    byes=[]
    for line in f:
        if 'Byes Q2' in line or 'Byes Q4' in line:
            for line in f:
                if len(line)<2:
                    pass
                elif line[0] is '@':
                    byes.append(line.strip().strip("@"))
                else:
                    return byes
    return

def get_wranglers(f):
    wranglers=[]
    for line in f:
        if 'sig-docs-en-owners' in line:
            for line in f:
                line=line.strip();
                if line[0] is '-':
                    wranglers.append(line[1:].strip())
                else:
                    return wranglers
    return
