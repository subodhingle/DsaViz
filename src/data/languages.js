// Language definitions — Judge0 language IDs + starter templates
export const LANGUAGES = [
  {
    id: 'javascript', label: 'JavaScript', judge0Id: 63, ext: 'js',
    color: '#F7DF1E', icon: 'JS',
    starter: `// JavaScript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

const arr = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", bubbleSort(arr).join(", "));`,
  },
  {
    id: 'python', label: 'Python', judge0Id: 71, ext: 'py',
    color: '#3776AB', icon: 'PY',
    starter: `# Python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

arr = [64, 34, 25, 12, 22, 11, 90]
print("Sorted:", bubble_sort(arr))`,
  },
  {
    id: 'cpp', label: 'C++', judge0Id: 54, ext: 'cpp',
    color: '#00599C', icon: 'C++',
    starter: `#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);
    cout << "Sorted: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
  },
  {
    id: 'c', label: 'C', judge0Id: 50, ext: 'c',
    color: '#A8B9CC', icon: 'C',
    starter: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - 1 - i; j++)
            if (arr[j] > arr[j + 1]) {
                int tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    bubbleSort(arr, n);
    printf("Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
  },
  {
    id: 'java', label: 'Java', judge0Id: 62, ext: 'java',
    color: '#ED8B00', icon: 'JV',
    starter: `import java.util.Arrays;

public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - 1 - i; j++)
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(arr);
        System.out.println("Sorted: " + Arrays.toString(arr));
    }
}`,
  },
  {
    id: 'typescript', label: 'TypeScript', judge0Id: 74, ext: 'ts',
    color: '#3178C6', icon: 'TS',
    starter: `// TypeScript
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

const arr: number[] = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", bubbleSort(arr).join(", "));`,
  },
  {
    id: 'go', label: 'Go', judge0Id: 60, ext: 'go',
    color: '#00ADD8', icon: 'GO',
    starter: `package main

import "fmt"

func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-1-i; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

func main() {
    arr := []int{64, 34, 25, 12, 22, 11, 90}
    bubbleSort(arr)
    fmt.Println("Sorted:", arr)
}`,
  },
  {
    id: 'rust', label: 'Rust', judge0Id: 73, ext: 'rs',
    color: '#CE422B', icon: 'RS',
    starter: `fn bubble_sort(arr: &mut Vec<i32>) {
    let n = arr.len();
    for i in 0..n - 1 {
        for j in 0..n - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}

fn main() {
    let mut arr = vec![64, 34, 25, 12, 22, 11, 90];
    bubble_sort(&mut arr);
    println!("Sorted: {:?}", arr);
}`,
  },
  {
    id: 'csharp', label: 'C#', judge0Id: 51, ext: 'cs',
    color: '#9B4F96', icon: 'C#',
    starter: `using System;

class Program {
    static void BubbleSort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - 1 - i; j++)
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
    }

    static void Main() {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        BubbleSort(arr);
        Console.WriteLine("Sorted: " + string.Join(", ", arr));
    }
}`,
  },
  {
    id: 'ruby', label: 'Ruby', judge0Id: 72, ext: 'rb',
    color: '#CC342D', icon: 'RB',
    starter: `# Ruby
def bubble_sort(arr)
  n = arr.length
  (n - 1).times do |i|
    (n - 1 - i).times do |j|
      arr[j], arr[j + 1] = arr[j + 1], arr[j] if arr[j] > arr[j + 1]
    end
  end
  arr
end

arr = [64, 34, 25, 12, 22, 11, 90]
puts "Sorted: #{bubble_sort(arr).join(', ')}"`,
  },
]

export const LANG_MAP = Object.fromEntries(LANGUAGES.map(l => [l.id, l]))

// Simple token-based syntax highlighter (no external deps)
export function tokenize(code, langId) {
  const keywords = {
    javascript: ['function','const','let','var','return','if','else','for','while','do','break','continue','new','class','import','export','default','typeof','instanceof','true','false','null','undefined','async','await','of','in','switch','case'],
    typescript: ['function','const','let','var','return','if','else','for','while','do','break','continue','new','class','import','export','default','typeof','instanceof','true','false','null','undefined','async','await','of','in','switch','case','interface','type','enum','extends','implements','public','private','protected','readonly','number','string','boolean','void','any'],
    python:     ['def','class','return','if','elif','else','for','while','in','not','and','or','import','from','as','with','try','except','finally','raise','pass','break','continue','True','False','None','lambda','yield','global','nonlocal'],
    cpp:        ['int','float','double','char','bool','void','return','if','else','for','while','do','break','continue','class','struct','namespace','using','include','new','delete','public','private','protected','virtual','const','static','auto','template','typename'],
    c:          ['int','float','double','char','void','return','if','else','for','while','do','break','continue','struct','typedef','include','define','const','static','unsigned','signed','long','short'],
    java:       ['public','private','protected','class','interface','extends','implements','return','if','else','for','while','do','break','continue','new','import','package','static','final','void','int','double','float','boolean','char','String','true','false','null','this','super','abstract','enum'],
    go:         ['func','var','const','type','struct','interface','return','if','else','for','range','break','continue','import','package','go','chan','select','case','default','defer','map','make','new','nil','true','false','len','cap','append'],
    rust:       ['fn','let','mut','const','struct','enum','impl','trait','use','mod','pub','return','if','else','for','while','loop','break','continue','match','Some','None','Ok','Err','true','false','self','Self','super','crate','move','ref','in','where','type','as'],
    csharp:     ['public','private','protected','class','interface','struct','enum','return','if','else','for','foreach','while','do','break','continue','new','using','namespace','static','void','int','double','float','bool','string','char','true','false','null','this','base','abstract','virtual','override','sealed','readonly','const','var','async','await'],
    ruby:       ['def','class','module','return','if','elsif','else','unless','for','while','do','end','break','next','require','include','extend','true','false','nil','self','super','begin','rescue','ensure','raise','yield','lambda','proc','puts','print','p'],
  }

  const kws = new Set(keywords[langId] || keywords.javascript)
  const tokens = []
  let i = 0

  while (i < code.length) {
    // String
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const q = code[i]; let s = q; i++
      while (i < code.length && code[i] !== q) {
        if (code[i] === '\\') { s += code[i++] }
        s += code[i++]
      }
      s += q; i++
      tokens.push({ type: 'string', value: s })
      continue
    }
    // Line comment
    if (code[i] === '/' && code[i+1] === '/') {
      let s = ''
      while (i < code.length && code[i] !== '\n') s += code[i++]
      tokens.push({ type: 'comment', value: s })
      continue
    }
    // Block comment
    if (code[i] === '/' && code[i+1] === '*') {
      let s = '/*'; i += 2
      while (i < code.length && !(code[i] === '*' && code[i+1] === '/')) s += code[i++]
      s += '*/'; i += 2
      tokens.push({ type: 'comment', value: s })
      continue
    }
    // Hash comment (Python/Ruby)
    if (code[i] === '#' && (langId === 'python' || langId === 'ruby')) {
      let s = ''
      while (i < code.length && code[i] !== '\n') s += code[i++]
      tokens.push({ type: 'comment', value: s })
      continue
    }
    // Number
    if (/[0-9]/.test(code[i])) {
      let s = ''
      while (i < code.length && /[0-9._xXa-fA-F]/.test(code[i])) s += code[i++]
      tokens.push({ type: 'number', value: s })
      continue
    }
    // Word / keyword
    if (/[a-zA-Z_$]/.test(code[i])) {
      let s = ''
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) s += code[i++]
      tokens.push({ type: kws.has(s) ? 'keyword' : 'ident', value: s })
      continue
    }
    // Punctuation / operator
    tokens.push({ type: 'punct', value: code[i++] })
  }
  return tokens
}

// Token → color
export function tokenColor(type) {
  return {
    keyword: '#569CD6',
    string:  '#CE9178',
    comment: '#4A6080',
    number:  '#B5CEA8',
    ident:   '#C8DCF0',
    punct:   '#7A9AB8',
  }[type] || '#C8DCF0'
}
