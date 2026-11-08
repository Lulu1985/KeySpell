/* 词库数据：每个模块为一组代码词汇 / 代码片段，练习时随机打乱顺序 */
const TYPING_DATA = {
  python: {
    label: "PYTHON",
    kicker: "PYTHON TYPING TRAINER",
    logoMark: "P",
    modules: [
      {
        name: "Python 关键字",
        icon: "🔑",
        tint: 1,
        words: [
          "False", "None", "True", "and", "as", "assert", "async", "await",
          "break", "class", "continue", "def", "del", "elif", "else", "except",
          "finally", "for", "from", "global", "if", "import", "in", "is",
          "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
          "while", "with", "yield"
        ]
      },
      {
        name: "内置函数",
        icon: "🛠️",
        tint: 2,
        words: [
          "abs(x)", "aiter(async_iter)", "all(xs)", "any(xs)", "anext(async_iter)",
          "ascii(obj)", "bin(x)", "bool(x)", "breakpoint()", "bytearray(x)",
          "bytes(x)", "callable(obj)", "chr(65)", "classmethod", "compile(s, f, m)",
          "complex(1, 2)", "delattr(obj, 'x')", "dict()", "dir(obj)", "divmod(7, 3)",
          "enumerate(xs)", "eval(expr)", "exec(code)", "filter(fn, xs)", "float(x)",
          "format(x, '.2f')", "frozenset(xs)", "getattr(obj, 'x')", "globals()",
          "hasattr(obj, 'x')", "hash(obj)", "help(obj)", "hex(255)", "id(obj)",
          "input('> ')", "int(x)", "isinstance(obj, cls)", "issubclass(a, b)",
          "iter(xs)", "len(xs)", "list(xs)", "locals()", "map(fn, xs)", "max(xs)",
          "memoryview(b)", "min(xs)", "next(it)", "object()", "oct(8)", "open(p)",
          "ord('A')", "pow(2, 10)", "print(x)", "property", "range(10)", "repr(x)",
          "reversed(xs)", "round(3.14)", "set(xs)", "setattr(obj, 'x', 1)",
          "slice(0, 5)", "sorted(xs)", "staticmethod", "str(x)", "sum(xs)",
          "super()", "tuple(xs)", "type(x)", "vars(obj)", "zip(a, b)"
        ]
      },
      {
        name: "基础高频",
        icon: "⌨️",
        tint: 3,
        words: [
          "print", "input", "def", "return", "import", "class", "while", "for",
          "if", "else", "elif", "pass", "None", "True", "False", "and", "or",
          "not", "in", "is", "try", "except", "with", "as", "yield", "lambda",
          "from", "break", "continue", "global", "nonlocal", "raise", "finally"
        ]
      },
      {
        name: "变量与数据",
        icon: "📦",
        tint: 4,
        words: [
          "x = 1", "total = 0", "price = 9.9", "name = 'Bob'", "flag = True",
          "data = None", "nums = [1, 2, 3]", "user = {'id': 7}", "count += 1",
          "x, y = 1, 2", "text = 'hi'", "result = a * b", "pi: float = 3.14",
          "n: int = 0", "items: list = []", "a = b = 0", "x += 1", "x -= 1",
          "x *= 2", "x /= 2", "x //= 2", "x %= 3", "x **= 2", "s += 'a'",
          "flag = not flag", "a, b = b, a", "x = y if cond else z"
        ]
      },
      {
        name: "字符串方法",
        icon: "✂️",
        tint: 5,
        words: [
          "s[0]", "s[-1]", "s[1:3]", "s[::-1]", "len(s)", "'hi'.upper()",
          "'hi'.lower()", "'a,b'.split(',')", "'-'.join(xs)", "s.strip()",
          "s.replace('a', 'b')", "f'hello {name}'", "s.startswith('a')",
          "s.endswith('.py')", "s.find('x')", "s.index('x')", "s.count('a')",
          "s.isdigit()", "s.isalpha()", "s.isspace()", "s.title()", "s.capitalize()",
          "s.swapcase()", "s.center(10)", "s.ljust(10)", "s.rjust(10)",
          "s.zfill(5)", "s.lstrip()", "s.rstrip()", "s.partition(',')",
          "s.rpartition(',')", "s.splitlines()", "s.encode('utf-8')",
          "b.decode('utf-8')", "s.format()", "'{0}{1}'.format(a, b)"
        ]
      },
      {
        name: "列表方法",
        icon: "🧺",
        tint: 6,
        words: [
          "[1, 2, 3]", "list(range(10))", "[i * i for i in xs]",
          "[x for x in xs if x > 0]", "nums.append(4)", "nums.pop()",
          "nums[1:3]", "sorted(nums)", "sum(nums)", "max(nums)", "min(nums)",
          "nums.reverse()", "nums.insert(0, x)", "nums.remove(x)", "nums.clear()",
          "nums.copy()", "nums.count(x)", "nums.index(x)", "nums.extend(b)",
          "nums.sort()", "nums.sort(reverse=True)", "nums.sort(key=len)",
          "list(reversed(nums))", "len(nums)", "nums[0]", "nums[-1]",
          "nums[:3]", "nums[::2]", "nums * 2", "a + b", "x in nums"
        ]
      },
      {
        name: "字典与集合",
        icon: "🗂️",
        tint: 1,
        words: [
          "{'a': 1}", "d['key']", "d.get('k', 0)", "d.keys()", "d.values()",
          "d.items()", "d.update(x)", "del d['k']", "set([1, 2])",
          "{x for x in xs}", "a | b", "len(d)", "d.pop('k')", "d.popitem()",
          "d.setdefault('k', 0)", "d.copy()", "d.clear()", "dict.fromkeys(xs)",
          "a & b", "a - b", "a ^ b", "a <= b", "a >= b", "s.add(x)",
          "s.remove(x)", "s.discard(x)", "s.pop()", "s.clear()", "s.copy()",
          "s.union(b)", "s.intersection(b)", "s.difference(b)", "s.issubset(b)"
        ]
      },
      {
        name: "条件与比较",
        icon: "⚖️",
        tint: 2,
        words: [
          "if x > 0:", "if x == 0:", "if x != y:", "if x >= 10:",
          "elif x < 0:", "else:", "x in ys", "x is None", "not flag",
          "a and b", "a or b", "0 < x < 10", "if x:", "if not x:",
          "if x is not None:", "if len(xs) > 0:", "if a == b and c > d:",
          "if a or b:", "x > 0 and x < 10", "x < 0 or x > 10",
          "x if cond else y", "match x:", "case 1:", "case _:",
          "isinstance(x, int)", "type(x) is int", "x == y", "x != y"
        ]
      },
      {
        name: "循环与迭代",
        icon: "🔁",
        tint: 3,
        words: [
          "for i in range(10):", "for x in xs:", "while x > 0:", "break",
          "continue", "pass", "enumerate(xs)", "zip(a, b)", "range(1, 5)",
          "range(0, 10, 2)", "iter(xs)", "next(it)", "for k, v in d.items():",
          "for i, x in enumerate(xs):", "for a, b in zip(x, y):",
          "for _ in range(3):", "while True:", "while not done:",
          "for x in reversed(xs):", "for x in sorted(xs):",
          "for x in set(xs):", "for line in f:", "for ch in s:",
          "for key in d:", "for value in d.values():", "break out of loop"
        ]
      },
      {
        name: "函数与作用域",
        icon: "🧩",
        tint: 4,
        words: [
          "def f(x):", "return x + 1", "def add(a, b):", "lambda x: x * 2",
          "*args", "**kwargs", "global total", "nonlocal x",
          "def __init__(self):", "def main():", "if __name__ == '__main__':",
          "yield x", "def f(a, b=1):", "def f(*args, **kwargs):",
          "def f(a, *, b):", "def f(a: int, b: str) -> bool:", "return",
          "return a, b", "lambda: 0", "lambda x, y: x + y",
          "sorted(xs, key=lambda x: x[1])", "map(lambda x: x*2, xs)",
          "filter(lambda x: x > 0, xs)", "functools.reduce(lambda a,b: a+b, xs)",
          "def gen():", "yield from xs", "return (x for x in xs)"
        ]
      },
      {
        name: "面向对象",
        icon: "🐱",
        tint: 5,
        words: [
          "class Cat:", "class Dog(Animal):", "self.name = name",
          "super().__init__()", "@property", "@staticmethod", "@classmethod",
          "obj.method()", "__str__(self)", "__repr__(self)",
          "isinstance(obj, Cat)", "hasattr(obj, 'x')", "class A(B, C):",
          "def __init__(self, name):", "self.x = x", "self._x = x",
          "self.__x = x", "@property", "@x.setter", "@x.deleter",
          "__len__(self)", "__getitem__(self, k)", "__setitem__(self, k, v)",
          "__iter__(self)", "__next__(self)", "__call__(self, x)",
          "__eq__(self, o)", "__hash__(self)", "__bool__(self)",
          "__enter__(self)", "__exit__(self, *a)", "getattr(obj, 'x')",
          "setattr(obj, 'x', 1)", "delattr(obj, 'x')", "type(obj)",
          "issubclass(Cat, Animal)"
        ]
      },
      {
        name: "异常与资源",
        icon: "🛡️",
        tint: 6,
        words: [
          "try:", "except ValueError:", "except Exception as e:", "finally:",
          "raise ValueError('x')", "with open('a.txt') as f:", "assert x > 0",
          "Exception('err')", "e.args", "warnings.warn('x')", "sys.exit(1)",
          "except (A, B) as e:", "except:", "else:", "raise", "raise ... from e",
          "except KeyError:", "except IndexError:", "except TypeError:",
          "except FileNotFoundError:", "except ZeroDivisionError:",
          "except AttributeError:", "except RuntimeError:", "except ImportError:",
          "contextlib.suppress(A)", "try / except / finally", "with ... as ...:"
        ]
      },
      {
        name: "文件与模块",
        icon: "📁",
        tint: 1,
        words: [
          "import os", "import sys", "from math import sqrt",
          "os.path.join(a, b)", "open('a.txt', 'r')", "f.read()", "f.write(s)",
          "json.loads(s)", "json.dumps(d)", "os.listdir('.')", "sys.argv[0]",
          "if __name__ == '__main__':", "f.readline()", "f.readlines()",
          "f.close()", "with open(p) as f:", "open(p, 'w')", "open(p, 'a')",
          "open(p, 'rb')", "f.tell()", "f.seek(0)", "os.path.exists(p)",
          "os.path.isfile(p)", "os.path.isdir(p)", "os.path.basename(p)",
          "os.path.dirname(p)", "os.path.splitext(p)", "os.getcwd()",
          "os.makedirs(d, exist_ok=True)", "os.remove(p)", "shutil.copy(a, b)",
          "shutil.move(a, b)", "glob.glob('*.py')", "pathlib.Path(p)"
        ]
      },
      {
        name: "生成式与迭代器",
        icon: "🌊",
        tint: 2,
        words: [
          "(x for x in xs)", "yield x", "next(gen)", "iter(xs)",
          "sum(x for x in xs)", "{k: v for k, v in d.items()}",
          "[x for x in xs if x]", "zip(*rows)", "itertools.chain(a, b)",
          "enumerate(xs, 1)", "map(str, xs)", "filter(None, xs)",
          "yield from xs", "itertools.count()", "itertools.cycle(xs)",
          "itertools.repeat(x)", "itertools.islice(it, 5)", "itertools.tee(it)",
          "itertools.product(a, b)", "itertools.permutations(xs)",
          "itertools.combinations(xs, 2)", "itertools.groupby(xs, key=fn)",
          "itertools.accumulate(xs)", "functools.reduce(fn, xs)",
          "max(xs, key=fn)", "min(xs, key=fn)", "sorted(xs, key=fn)"
        ]
      },
      {
        name: "装饰器与闭包",
        icon: "🎀",
        tint: 3,
        words: [
          "@decorator", "def wrapper(*args):", "functools.wraps(f)",
          "def outer():", "inner()", "return inner", "@app.route('/')",
          "@dataclass", "@lru_cache()", "closure = outer()", "nonlocal count",
          "def inner(x):", "@timer", "@cache", "@retry(times=3)",
          "def deco(f):", "return wrapper", "@deco", "def f():",
          "functools.lru_cache(maxsize=128)", "functools.wraps(f)",
          "functools.partial(f, x=1)", "functools.singledispatch",
          "class Deco:", "def __call__(self, f):"
        ]
      },
      {
        name: "常见报错",
        icon: "🚨",
        tint: 4,
        words: [
          "SyntaxError", "TypeError", "IndexError", "KeyError", "NameError",
          "ValueError", "ZeroDivisionError", "AttributeError",
          "IndentationError", "ImportError", "Traceback", "RuntimeError",
          "FileNotFoundError", "PermissionError", "StopIteration",
          "NotImplementedError", "RecursionError", "MemoryError",
          "UnicodeDecodeError", "UnicodeEncodeError", "EOFError",
          "KeyboardInterrupt", "SystemExit", "AssertionError",
          "ModuleNotFoundError", "ConnectionError", "TimeoutError"
        ]
      },
      {
        name: "turtle 常用词汇",
        icon: "🐢",
        tint: 5,
        words: [
          "turtle.forward(100)", "turtle.right(90)", "turtle.left(45)",
          "turtle.penup()", "turtle.pendown()", "turtle.goto(0, 0)",
          "turtle.color('red')", "turtle.circle(50)", "turtle.write('hi')",
          "turtle.done()", "turtle.speed(0)", "turtle.home()",
          "turtle.backward(50)", "turtle.setheading(90)", "turtle.pensize(3)",
          "turtle.fillcolor('blue')", "turtle.begin_fill()", "turtle.end_fill()",
          "turtle.bgcolor('white')", "turtle.title('draw')", "turtle.setup(400, 300)",
          "turtle.dot(10, 'red')", "turtle.stamp()", "turtle.clear()",
          "turtle.reset()", "turtle.undo()", "turtle.screensize(800, 600)"
        ]
      },
      {
        name: "pygame 常用词汇",
        icon: "🎮",
        tint: 6,
        words: [
          "pygame.init()", "pygame.display.set_mode(size)",
          "screen.blit(img, pos)", "pygame.event.get()", "pygame.QUIT",
          "clock.tick(60)", "pygame.draw.rect(s, c, r)",
          "pygame.image.load(p)", "pygame.mixer.music.play()",
          "pygame.KEYDOWN", "pygame.quit()", "font.render(text, True, c)",
          "pygame.display.flip()", "pygame.display.update()", "screen.fill(c)",
          "pygame.draw.circle(s, c, pos, r)", "pygame.draw.line(s, c, a, b)",
          "pygame.key.get_pressed()", "pygame.mouse.get_pos()",
          "pygame.Rect(x, y, w, h)", "pygame.time.Clock()", "pygame.Surface((w, h))",
          "pygame.font.SysFont('arial', 20)", "pygame.mouse.get_pressed()",
          "pygame.K_SPACE", "pygame.K_UP", "pygame.K_DOWN", "pygame.K_LEFT",
          "pygame.K_RIGHT", "pygame.KEYUP", "pygame.MOUSEBUTTONDOWN"
        ]
      },
      {
        name: "综合短句",
        icon: "⚡",
        tint: 1,
        words: [
          "for i in range(3):", "print('hello')", "if x > 0:",
          "while True:", "nums = [1, 2]", "d = {'a': 1}",
          "with open(p) as f:", "import math", "class A:", "try:",
          "return x", "def f(x):", "for x in xs:", "print(f'{x}')",
          "if __name__ == '__main__':", "import numpy as np",
          "import pandas as pd", "from collections import defaultdict",
          "from collections import Counter", "from itertools import product",
          "from pathlib import Path", "import re", "re.findall(r'\\d+', s)",
          "np.array([1, 2])", "pd.read_csv(p)", "plt.plot(x, y)",
          "plt.show()", "plt.savefig(p)", "datetime.now()", "time.sleep(1)",
          "random.randint(1, 10)", "random.choice(xs)", "random.shuffle(xs)"
        ]
      }
    ]
  },

  cpp: {
    label: "C++",
    kicker: "C++ TYPING TRAINER",
    logoMark: "C",
    modules: [
      {
        name: "C++ 关键字",
        icon: "🔑",
        tint: 1,
        words: [
          "alignas", "alignof", "asm", "auto", "bool", "break", "case", "catch",
          "char", "char8_t", "char16_t", "char32_t", "class", "concept", "const",
          "consteval", "constexpr", "constinit", "const_cast", "continue",
          "co_await", "co_return", "co_yield", "decltype", "default", "delete",
          "do", "double", "dynamic_cast", "else", "enum", "explicit", "export",
          "extern", "false", "float", "for", "friend", "goto", "if", "inline",
          "int", "long", "mutable", "namespace", "new", "noexcept", "nullptr",
          "operator", "private", "protected", "public", "register",
          "reinterpret_cast", "requires", "return", "short", "signed", "sizeof",
          "static", "static_assert", "static_cast", "struct", "switch",
          "template", "this", "thread_local", "throw", "true", "try", "typedef",
          "typeid", "typename", "union", "unsigned", "using", "virtual", "void",
          "volatile", "wchar_t", "while"
        ]
      },
      {
        name: "基础高频",
        icon: "⌨️",
        tint: 2,
        words: [
          "int", "return", "void", "main", "include", "cout", "cin", "endl",
          "const", "auto", "bool", "true", "false", "nullptr", "class",
          "struct", "namespace", "std", "using", "if", "else", "for", "while",
          "new", "delete", "string", "vector", "map", "set", "cin", "cout",
          "#include", "#define", "#ifdef", "#endif", "std::", "using namespace std;"
        ]
      },
      {
        name: "变量与类型",
        icon: "🔢",
        tint: 3,
        words: [
          "int x = 0;", "double d = 3.14;", "float f = 1.5f;",
          "char c = 'a';", "bool ok = true;", "long long n = 0;",
          "auto x = 1;", "sizeof(int)", "const int MAX = 100;",
          "int a = 1, b = 2;", "unsigned int u = 0;", "string name = 'Bob';",
          "short s = 1;", "long l = 1L;", "size_t n = 0;", "int8_t x = 0;",
          "int16_t x = 0;", "int32_t x = 0;", "int64_t x = 0;", "uint8_t x = 0;",
          "constexpr int N = 10;", "const auto& r = x;", "static int cnt = 0;",
          "extern int g_var;", "volatile int flag;", "mutable int cache;",
          "int& ref = x;", "int* ptr = &x;", "const int* p = &x;",
          "int* const p = &x;", "const int& r = x;", "int&& rr = 1;"
        ]
      },
      {
        name: "输入输出",
        icon: "📟",
        tint: 4,
        words: [
          "cin >> x;", "cout << x;", "cout << x << endl;",
          "cout << 'hi' << endl;", "cin >> a >> b;", "getline(cin, s);",
          "printf('%d', x);", "scanf('%d', &x);", "cerr << 'err';",
          "cout << fixed;", "cout.precision(2);", "ios::sync_with_stdio(false);",
          "cin.tie(nullptr);", "cout << setw(5) << x;", "cout << setfill('0');",
          "cout << hex << x;", "cout << oct << x;", "cout << setprecision(3);",
          "fprintf(stderr, 'err');", "sprintf(buf, '%d', x);",
          "sscanf(s, '%d', &x);", "cout << boolalpha << ok;",
          "cin.get(ch);", "cin.getline(buf, n);", "cout.put(ch);",
          "cout.write(s, n);", "cout.flush();", "cin.ignore();"
        ]
      },
      {
        name: "条件判断",
        icon: "⚖️",
        tint: 5,
        words: [
          "if (x > 0) {", "} else {", "} else if (x < 0) {", "if (x == 0)",
          "if (!flag)", "if (x >= 10 && y < 5)", "x > 0 ? a : b",
          "switch (x) {", "case 1:", "break;", "default:", "if (x != y)",
          "if (x > 0 && x < 10)", "if (x < 0 || x > 10)", "if (a == b && c != d)",
          "if (ptr != nullptr)", "if (ptr)", "if (!ptr)", "if (s.empty())",
          "if (v.size() > 0)", "if (a > b) swap(a, b);", "case 'a':",
          "case 1: case 2:", "break;", "continue;", "return 0;",
          "if constexpr (cond) {}", "if (auto p = f(); p) {}"
        ]
      },
      {
        name: "循环结构",
        icon: "🔁",
        tint: 6,
        words: [
          "for (int i = 0; i < n; i++)", "for (auto x : v)",
          "while (x > 0)", "while (cin >> x)", "do {", "} while (x);",
          "break;", "continue;", "++i", "i--", "for (int i = n; i > 0; --i)",
          "for (auto& x : v)", "for (const auto& x : v)", "for (auto it = v.begin(); it != v.end(); ++it)",
          "for (int i = 0; i < v.size(); ++i)", "for (int i = 1; i <= n; i++)",
          "for (;;)", "while (true)", "do { ... } while (cond);",
          "for (int i : {1, 2, 3})", "for (auto& [k, v] : m)", "for (auto* p : arr)"
        ]
      },
      {
        name: "函数定义",
        icon: "🧩",
        tint: 1,
        words: [
          "int add(int a, int b)", "void print(int x)", "return a + b;",
          "int main()", "bool check(int x)", "double avg(int a, int b)",
          "inline int f(int x)", "int f() const", "static void log()",
          "int& x", "const string& s", "void swap(int& a, int& b)",
          "int f(int a, int b = 0)", "int f(int a, ...)", "auto f() -> int",
          "template<typename T> T max(T a, T b)", "int f(int x) noexcept",
          "int* f()", "int& f()", "void f(int&& x)", "void f(const T& x)",
          "void f(T&& x)", "int f() override", "virtual void f()",
          "void f() = 0;", "void f() = delete;", "void f() = default;"
        ]
      },
      {
        name: "数组与容器",
        icon: "🧺",
        tint: 2,
        words: [
          "int a[10];", "vector<int> v;", "v.push_back(1);", "v.size()",
          "v[0]", "v.begin()", "v.end()", "array<int, 3> a;",
          "map<string, int> m;", "set<int> s;", "queue<int> q;",
          "stack<int> st;", "v.pop_back()", "v.front()", "v.back()",
          "v.empty()", "v.clear()", "v.resize(n)", "v.insert(v.begin(), x)",
          "v.erase(v.begin())", "deque<int> dq;", "dq.push_front(x)",
          "dq.push_back(x)", "dq.pop_front()", "dq.pop_back()",
          "priority_queue<int> pq;", "pq.top()", "pq.pop()",
          "unordered_map<string, int> um;", "unordered_set<int> us;",
          "multiset<int> ms;", "multimap<int, int> mm;", "list<int> l;",
          "l.push_back(x)", "l.push_front(x)", "forward_list<int> fl;"
        ]
      },
      {
        name: "字符串操作",
        icon: "✂️",
        tint: 3,
        words: [
          "string s = 'hi';", "s.size()", "s.length()", "s.substr(0, 2)",
          "s.find('a')", "s += 'x';", "s.c_str()", "to_string(x)",
          "s.empty()", "s[0]", "stoi(s)", "s.substr(pos, len)",
          "s.compare(t)", "s.append('a')", "s.push_back('a')", "s.pop_back()",
          "s.insert(pos, 'a')", "s.erase(pos, len)", "s.replace(pos, len, t)",
          "s.find_first_of('a')", "s.find_last_of('a')", "s.rfind('a')",
          "s.starts_with('a')", "s.ends_with('.txt')", "s.contains('a')",
          "stol(s)", "stoll(s)", "stod(s)", "stof(s)", "stoul(s)",
          "string(n, 'a')", "s + t", "getline(cin, s)", "stringstream ss(s);"
        ]
      },
      {
        name: "指针与引用",
        icon: "🧭",
        tint: 4,
        words: [
          "int* p = &x;", "*p = 5;", "int& r = x;", "nullptr",
          "new int(5);", "delete p;", "p->x", "&arr[0]", "const int* p",
          "int** pp", "unique_ptr<int> p;", "memcpy(dst, src, n);",
          "p++;", "p--;", "*(p + 1)", "p[1]", "void* vp = &x;",
          "int* q = nullptr;", "delete[] arr;", "new int[10];",
          "shared_ptr<int> p;", "make_shared<int>(5)", "weak_ptr<int> w = p;",
          "p.use_count()", "p.reset()", "p.release()", "move(p)",
          "forward<T>(x)", "static_cast<int*>(p)", "reinterpret_cast<int*>(p)",
          "const_cast<int*>(p)", "dynamic_cast<Derived*>(b)"
        ]
      },
      {
        name: "类与对象",
        icon: "🐶",
        tint: 5,
        words: [
          "class Dog {", "public:", "private:", "protected:", "Dog() {",
          "~Dog() {", "void bark();", "int age;", "this->age = age;",
          "static int count;", "friend class Cat;", "Dog(const Dog& o)",
          "Dog(Dog&& o) noexcept", "Dog& operator=(const Dog& o)",
          "Dog& operator=(Dog&& o) noexcept", "explicit Dog(int x)",
          "operator int() const", "Dog operator+(const Dog& o)",
          "bool operator==(const Dog& o) const", "void operator()(int x)",
          "Dog* d = new Dog();", "delete d;", "Dog d;", "Dog d(3);",
          "Dog d{};", "Dog d = Dog();", "d.bark();", "d.age",
          "Dog::count", "Dog::bark()", "const Dog& d", "Dog&& d = Dog();"
        ]
      },
      {
        name: "继承与多态",
        icon: "🌱",
        tint: 6,
        words: [
          "class Cat : public Animal {", "virtual void speak();", "override",
          "Animal* a = new Cat();", "a->speak();", "delete a;",
          "virtual void f() = 0;", "dynamic_cast<Cat*>(a);", "~Animal() {}",
          "class D : public B1, public B2", "class D : virtual public B",
          "public:", "protected:", "private:", "virtual ~Animal() = default;",
          "a->speak();", "Cat c;", "Animal& ref = c;", "ref.speak();",
          "typeid(*a).name()", "a->f();", "static_cast<Cat*>(a)",
          "dynamic_cast<Cat&>(ref)", "virtual void f() override final;"
        ]
      },
      {
        name: "模板与泛型",
        icon: "🧬",
        tint: 1,
        words: [
          "template <typename T>", "template <class T>", "T max(T a, T b)",
          "vector<T> v;", "typename T", "T& x", "auto", "concepts",
          "std::enable_if", "template<>", "pair<K, V>", "map<T, U>",
          "template<typename T, typename U>", "template<int N>",
          "template<typename... Args>", "sizeof...(Args)", "Args&&... args",
          "std::forward<Args>(args)...", "decltype(auto)", "auto f() -> T",
          "template<typename T = int>", "extern template class vector<int>;",
          "template<typename T> concept C = ...;", "requires C<T>",
          "if constexpr (is_integral_v<T>) {}", "std::is_same_v<T, U>"
        ]
      },
      {
        name: "STL 算法",
        icon: "📚",
        tint: 2,
        words: [
          "sort(v.begin(), v.end());", "reverse(v.begin(), v.end());",
          "find(v.begin(), v.end(), x)", "count(v.begin(), v.end(), x)",
          "max_element(v.begin(), v.end())", "lower_bound(v.begin(), v.end(), x)",
          "upper_bound(v.begin(), v.end(), x)", "unique(v.begin(), v.end());",
          "accumulate(v.begin(), v.end(), 0)",
          "next_permutation(v.begin(), v.end())",
          "binary_search(v.begin(), v.end(), x)",
          "min_element(v.begin(), v.end())", "fill(v.begin(), v.end(), 0)",
          "copy(a.begin(), a.end(), b.begin())", "transform(a.begin(), a.end(), b.begin(), f)",
          "for_each(v.begin(), v.end(), f)", "remove(v.begin(), v.end(), x)",
          "replace(v.begin(), v.end(), a, b)", "merge(a.begin(), a.end(), b.begin(), b.end(), c.begin())",
          "partial_sort(v.begin(), v.begin() + k, v.end())",
          "nth_element(v.begin(), v.begin() + k, v.end())",
          "stable_sort(v.begin(), v.end())", "is_sorted(v.begin(), v.end())",
          "clamp(x, lo, hi)", "max(a, b)", "min(a, b)", "swap(a, b)",
          "make_heap(v.begin(), v.end())", "push_heap(v.begin(), v.end())",
          "pop_heap(v.begin(), v.end())", "iota(v.begin(), v.end(), 0)"
        ]
      },
      {
        name: "异常处理",
        icon: "🛡️",
        tint: 3,
        words: [
          "try {", "} catch (const exception& e) {",
          "throw runtime_error('x');", "catch (...)", "e.what()", "noexcept",
          "assert(x > 0);", "std::exception", "throw 1;", "try / catch",
          "invalid_argument('x')", "out_of_range('x')", "logic_error",
          "runtime_error", "domain_error", "length_error", "out_of_range",
          "range_error", "overflow_error", "underflow_error", "bad_alloc",
          "bad_cast", "bad_typeid", "bad_exception", "throw_with_nested(e)",
          "rethrow_if_nested(e)", "current_exception()", "rethrow_exception(p)",
          "noexcept(f())", "throw()", "dynamic exception specification"
        ]
      },
      {
        name: "文件读写",
        icon: "📁",
        tint: 4,
        words: [
          "ifstream in('a.txt');", "ofstream out('b.txt');", "in >> x;",
          "getline(in, line);", "out << x << endl;", "in.close();", "ios::app",
          "fstream file('a.txt');", "file.is_open()", "file.eof()",
          "freopen('in.txt', 'r', stdin);", "out.open('b.txt');",
          "ifstream in(p, ios::binary);", "ofstream out(p, ios::app);",
          "istreambuf_iterator<char>(in)", "ostreambuf_iterator<char>(out)",
          "in.seekg(0)", "out.seekp(0)", "in.tellg()", "out.tellp()",
          "in.read(buf, n)", "out.write(buf, n)", "in.gcount()",
          "ios::in", "ios::out", "ios::trunc", "ios::ate", "ios::binary",
          "file.exceptions(ifstream::failbit)"
        ]
      },
      {
        name: "多线程与并发",
        icon: "🧵",
        tint: 5,
        words: [
          "std::thread t(func);", "t.join();", "std::mutex m;",
          "lock_guard<mutex> lock(m);", "condition_variable cv;",
          "atomic<int> count;", "async(f);", "future<int> f;", "f.get();",
          "cv.wait(lock);", "cv.notify_one();",
          "thread::hardware_concurrency()", "t.detach()", "t.joinable()",
          "unique_lock<mutex> lock(m);", "lock(m1, m2);", "scoped_lock lk(m1, m2);",
          "cv.wait_for(lock, chrono::seconds(1))", "cv.notify_all();",
          "promise<int> p;", "shared_future<int> sf = f.share();",
          "packaged_task<int()> task(f);", "this_thread::sleep_for(chrono::milliseconds(100));",
          "this_thread::get_id();", "call_once(flag, f);", "once_flag flag;",
          "atomic<int> x{0};", "x.fetch_add(1)", "x.load()", "x.store(1)",
          "x.compare_exchange_strong(old, new)"
        ]
      },
      {
        name: "现代 C++",
        icon: "⚡",
        tint: 6,
        words: [
          "auto x = 1;", "for (auto& x : v)", "nullptr",
          "unique_ptr<T> p;", "make_unique<T>()", "move(a)",
          "emplace_back(x)", "constexpr int N = 10;",
          "auto [a, b] = pair;", "std::optional<int> o;",
          "lambda [&](int x) { }", "std::function<int(int)> f;",
          "auto f = [](int x) { return x; };", "auto f = [=]() {};",
          "auto f = [&]() {};", "auto f = [this]() {};",
          "std::variant<int, string> v;", "std::any a;", "std::string_view sv = s;",
          "std::span<int> s(arr);", "std::array<int, 3> a{1, 2, 3};",
          "if constexpr (cond) {}", "concepts", "requires", "co_await",
          "modules", "import std;", "std::format('{}', x)",
          "std::jthread t(f);", "std::stop_token", "ranges::sort(v)",
          "ranges::views::filter", "ranges::views::transform"
        ]
      },
      {
        name: "常用数学与工具",
        icon: "🧮",
        tint: 1,
        words: [
          "abs(x)", "fabs(x)", "sqrt(x)", "pow(x, y)", "exp(x)", "log(x)",
          "log10(x)", "sin(x)", "cos(x)", "tan(x)", "asin(x)", "acos(x)",
          "atan(x)", "atan2(y, x)", "ceil(x)", "floor(x)", "round(x)",
          "fmod(x, y)", "min(a, b)", "max(a, b)", "swap(a, b)", "abs(x)",
          "gcd(a, b)", "lcm(a, b)", "clamp(x, lo, hi)", "midpoint(a, b)",
          "to_underlying(e)", "bit_cast<T>(x)", "byteswap(x)", "has_single_bit(x)",
          "bit_ceil(x)", "bit_floor(x)", "bit_width(x)", "rotl(x, s)",
          "rotr(x, s)", "countl_zero(x)", "countr_zero(x)", "popcount(x)",
          "chrono::seconds(1)", "chrono::milliseconds(100)", "chrono::steady_clock::now()",
          "chrono::system_clock::now()", "time(nullptr)", "clock()",
          "rand()", "srand(time(0))", "mt19937 rng(seed)", "uniform_int_distribution<int>(lo, hi)"
        ]
      }
    ]
  }
};
