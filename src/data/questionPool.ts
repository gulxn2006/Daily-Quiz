import { QuestionTemplate, Question } from '../types.ts';

export const QUESTION_TEMPLATES: QuestionTemplate[] = [
  // -------------------------------------------------------------
  // 1. PYTHON: Mutability & Object References
  // -------------------------------------------------------------
  {
    concept_id: 'py-mutability-references',
    concept_name: 'Object References & Mutability',
    language: 'python',
    difficulty: 'intermediate',
    topic: 'Collections & Memory',
    base_explanation: 'In Python, variables are labels bound to objects in memory. Passing or assigning mutable objects (like lists, dicts, sets) does not create a copy; both variables reference the exact same memory address. Modifying through one reference reflects in all.',
    common_mistake: 'Assuming assignment (b = a) copies the values into a separate memory block rather than binding to the same reference.',
    remember_this: 'Assignment never copies in Python. To create a real copy of a mutable container, use .copy(), list(x), or copy.deepcopy() for nested structures.',
    variations: [
      {
        variation_id: 'py-mut-1',
        question_type: 'output_prediction',
        prompt: 'Which output will this Python code produce?',
        code: `numbers = [1, 2, 3]\nresult = numbers\nresult.append(4)\n\nprint(numbers)`,
        options: [
          { id: 'A', text: '[1, 2, 3]' },
          { id: 'B', text: '[4]' },
          { id: 'C', text: '[1, 2, 3, 4]' },
          { id: 'D', text: 'Error: Cannot modify aliased list' },
        ],
        correct_answer: 'C',
        specific_explanation: 'list in Python is a mutable object. "result = numbers" points result to the exact same list. Calling result.append(4) modifies the underlying list, so numbers reflects [1, 2, 3, 4].',
      },
      {
        variation_id: 'py-mut-2',
        question_type: 'output_prediction',
        prompt: 'What will be printed to the console?',
        code: `a = {"items": [10, 20]}\nb = a\n\nb["items"].append(30)\n\nprint(a["items"])`,
        options: [
          { id: 'A', text: '[10, 20]' },
          { id: 'B', text: '[10, 20, 30]' },
          { id: 'C', text: '{"items": [10, 20, 30]}' },
          { id: 'D', text: 'KeyError: items' },
        ],
        correct_answer: 'B',
        specific_explanation: 'Dictionaries and lists are mutable. "b = a" aliases the dictionary, and mutating b["items"] alters the shared list in place.',
      },
      {
        variation_id: 'py-mut-3',
        question_type: 'find_bug',
        prompt: 'Why does this function behave unexpectedly across multiple calls?',
        code: `def add_user(username, registry=[]):\n    registry.append(username)\n    return registry\n\nprint(add_user("alice"))\nprint(add_user("bob"))`,
        options: [
          { id: 'A', text: 'Default arguments in Python are evaluated once at function definition time, sharing state across calls.' },
          { id: 'B', text: 'Local variables inside functions are automatically cleared after invocation.' },
          { id: 'C', text: 'Python does not permit list parameters without explicit type hints.' },
          { id: 'D', text: 'registry must be declared global to retain appended values.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'Python default parameter values are evaluated once when the function is defined, not each time it is executed. Mutating a default list or dict persists between calls!',
      },
      {
        variation_id: 'py-mut-4',
        question_type: 'what_will_happen',
        prompt: 'What is the value of matrix[1][0] after running this code?',
        code: `matrix = [[0] * 3] * 3\nmatrix[0][0] = 7\n\nprint(matrix[1][0])`,
        options: [
          { id: 'A', text: '0' },
          { id: 'B', text: '7' },
          { id: 'C', text: 'None' },
          { id: 'D', text: 'IndexError' },
        ],
        correct_answer: 'B',
        specific_explanation: 'The multiplication syntax [[0] * 3] * 3 creates 3 references to the SAME inner list! Updating matrix[0][0] modifies that single inner list, making matrix[1][0] also 7.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. JAVASCRIPT: Event Loop & Microtasks
  // -------------------------------------------------------------
  {
    concept_id: 'js-event-loop-microtasks',
    concept_name: 'Event Loop & Microtask Queue',
    language: 'javascript',
    difficulty: 'intermediate',
    topic: 'Async & Runtime Internals',
    base_explanation: 'JavaScript executes synchronous code first on the call stack. Once call stack is empty, microtasks (Promise.then, queueMicrotask) run until exhausted, BEFORE macrotasks (setTimeout, setInterval, setImmediate) are dequeued.',
    common_mistake: 'Assuming setTimeout(fn, 0) runs immediately or before resolved Promise microtasks.',
    remember_this: 'Synchronous > Microtasks (Promise/queueMicrotask) > Macrotasks (setTimeout/setInterval).',
    variations: [
      {
        variation_id: 'js-el-1',
        question_type: 'output_prediction',
        prompt: 'What will be the exact order of logged numbers?',
        code: `console.log(1);\n\nsetTimeout(() => console.log(2), 0);\n\nPromise.resolve().then(() => console.log(3));\n\nconsole.log(4);`,
        options: [
          { id: 'A', text: '1, 4, 3, 2' },
          { id: 'B', text: '1, 2, 3, 4' },
          { id: 'C', text: '1, 4, 2, 3' },
          { id: 'D', text: '1, 3, 4, 2' },
        ],
        correct_answer: 'A',
        specific_explanation: '1 and 4 are synchronous. Promise.then callback is queued in the microtask queue and runs immediately after call stack empties. setTimeout is queued in macrotask queue and runs in the next turn.',
      },
      {
        variation_id: 'js-el-2',
        question_type: 'code_comparison',
        prompt: 'Analyze this async execution. What is printed first and second?',
        code: `async function check() {\n  console.log('A');\n  await Promise.resolve();\n  console.log('B');\n}\n\ncheck();\nconsole.log('C');`,
        options: [
          { id: 'A', text: 'A, C, then B' },
          { id: 'B', text: 'A, B, then C' },
          { id: 'C', text: 'C, A, then B' },
          { id: 'D', text: 'B, A, then C' },
        ],
        correct_answer: 'A',
        specific_explanation: 'check() starts synchronously, printing A. The await pauses check() and schedules the continuation into microtask queue. Code resumes after check(), printing C synchronously, then B executes from microtask queue.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. JAVASCRIPT: Closures & Scoping with var vs let
  // -------------------------------------------------------------
  {
    concept_id: 'js-closure-var-let',
    concept_name: 'Closures & Lexical Scoping (var vs let)',
    language: 'javascript',
    difficulty: 'basic',
    topic: 'Scoping & Variables',
    base_explanation: '"var" is function-scoped (or global) and hoisted. In a loop, all asynchronous callbacks share the single mutated variable. "let" creates a new lexical binding for each loop iteration.',
    common_mistake: 'Expecting "var i" to be preserved separately in each callback closure without an IIFE or block scope.',
    remember_this: 'Use "let" for loop iterators so each iteration gets its own unique lexical closure.',
    variations: [
      {
        variation_id: 'js-scope-1',
        question_type: 'output_prediction',
        prompt: 'What will this loop print to the console?',
        code: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}`,
        options: [
          { id: 'A', text: '0 1 2' },
          { id: 'B', text: '3 3 3' },
          { id: 'C', text: 'undefined undefined undefined' },
          { id: 'D', text: '2 2 2' },
        ],
        correct_answer: 'B',
        specific_explanation: 'Because var is not block-scoped, the loop shares one single "i" which reaches 3 when the loop terminates. When the timer callbacks run 10ms later, they all read i = 3.',
      },
      {
        variation_id: 'js-scope-2',
        question_type: 'debugging',
        prompt: 'How do you fix this code so it logs 0, 1, 2 without adding an IIFE?',
        code: `// Current:\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
        options: [
          { id: 'A', text: 'Change "var i = 0" to "let i = 0"' },
          { id: 'B', text: 'Increase setTimeout delay from 0 to 100' },
          { id: 'C', text: 'Change "i++" to "++i"' },
          { id: 'D', text: 'Make the setTimeout callback an async function' },
        ],
        correct_answer: 'A',
        specific_explanation: 'Replacing "var" with "let" provides block scoping. Each iteration gets a distinct binding of "i" captured by that iteration\'s callback closure.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 4. PYTHON: GIL and Concurrency
  // -------------------------------------------------------------
  {
    concept_id: 'py-gil-concurrency',
    concept_name: 'Python GIL & CPU-bound Concurrency',
    language: 'python',
    difficulty: 'advanced',
    topic: 'Concurrency & Internals',
    base_explanation: 'The CPython Global Interpreter Lock (GIL) is a mutex preventing multiple native threads from executing Python bytecodes at the same time. While threading helps I/O-bound programs, CPU-bound tasks in multithreading can actually run slower due to lock contention overhead.',
    common_mistake: 'Using threading.Thread for heavy mathematical computations thinking it utilizes multiple CPU cores.',
    remember_this: 'For CPU-bound tasks in Python, use multiprocessing or ProcessPoolExecutor to bypass the GIL.',
    variations: [
      {
        variation_id: 'py-gil-1',
        question_type: 'concept_based',
        prompt: 'Why does a CPU-heavy computation using standard Python "threading" typically NOT speed up on an 8-core CPU?',
        options: [
          { id: 'A', text: 'The CPython GIL allows only one OS thread to execute Python bytecode at a time.' },
          { id: 'B', text: 'Python threads can only run on CPU core 0 by operating system design.' },
          { id: 'C', text: 'Python disables floating point arithmetic inside threads.' },
          { id: 'D', text: 'CPython threads are green threads and do not use OS threads.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'The Global Interpreter Lock ensures thread-safety for Python memory management by serializing bytecode execution. For CPU-bound tasks, multiprocessing or C-extensions are needed.',
      },
      {
        variation_id: 'py-gil-2',
        question_type: 'scenario_based',
        prompt: 'You need to resize 10,000 high-resolution images in parallel in Python. Which standard library module is most optimal?',
        options: [
          { id: 'A', text: 'concurrent.futures.ProcessPoolExecutor or multiprocessing' },
          { id: 'B', text: 'threading.Thread' },
          { id: 'C', text: 'asyncio.gather()' },
          { id: 'D', text: 'queue.Queue with daemon threads' },
        ],
        correct_answer: 'A',
        specific_explanation: 'Image processing is CPU-bound. Processes have separate memory spaces and independent Python interpreters, allowing true multi-core parallel processing without GIL contention.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 5. TYPESCRIPT: Discriminated Unions & Exhaustiveness
  // -------------------------------------------------------------
  {
    concept_id: 'ts-discriminated-unions',
    concept_name: 'Discriminated Unions & Exhaustiveness Checking',
    language: 'typescript',
    difficulty: 'intermediate',
    topic: 'Type Narrowing & Safety',
    base_explanation: 'A discriminated union uses a common literal property (like "kind" or "type") across union members. In a switch statement, assigning the unhandled case to the "never" type guarantees compile-time exhaustiveness.',
    common_mistake: 'Using type assertion (as any) instead of letting TypeScript narrow the union through tag checking.',
    remember_this: 'Use "const _exhaustiveCheck: never = x" in the default branch to get compile errors when new variants are added.',
    variations: [
      {
        variation_id: 'ts-du-1',
        question_type: 'code_completion',
        prompt: 'Which code in the default branch ensures a compile-time error if a new Shape is added?',
        code: `type Circle = { kind: 'circle'; radius: number };\ntype Square = { kind: 'square'; size: number };\ntype Shape = Circle | Square;\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case 'circle': return Math.PI * s.radius ** 2;\n    case 'square': return s.size * s.size;\n    default:\n      // What belongs here?\n  }\n}`,
        options: [
          { id: 'A', text: 'const _exhaustive: never = s; throw new Error();' },
          { id: 'B', text: 'return s as any;' },
          { id: 'C', text: 'return 0;' },
          { id: 'D', text: 'const _exhaustive: unknown = s;' },
        ],
        correct_answer: 'A',
        specific_explanation: 'If all cases of the union are handled, the type of "s" in the default branch is reduced to "never". If someone adds "Triangle" to Shape, TypeScript flags that Triangle cannot be assigned to never.',
      },
      {
        variation_id: 'ts-du-2',
        question_type: 'which_statement',
        prompt: 'Which statement regarding TypeScript discriminated unions is TRUE?',
        options: [
          { id: 'A', text: 'The discriminant property must be a singleton type (such as a string literal, number literal, or boolean).' },
          { id: 'B', text: 'Discriminated unions only work if all members are interface types, not type aliases.' },
          { id: 'C', text: 'The switch statement cannot narrow types; only "instanceof" can.' },
          { id: 'D', text: 'Discriminated unions add runtime overhead to JavaScript output.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'A discriminant property must be a literal type so TypeScript\'s control flow analysis can distinguish and eliminate union variants during narrowing.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 6. JAVA: String Pool & Reference Equality
  // -------------------------------------------------------------
  {
    concept_id: 'java-string-pool-equality',
    concept_name: 'String Pool & Reference vs Value Equality',
    language: 'java',
    difficulty: 'basic',
    topic: 'JVM Memory & Object References',
    base_explanation: 'In Java, "==" compares memory references for objects, while ".equals()" compares actual value content. String literals are stored in the JVM String Intern Pool, but "new String()" allocates a distinct object in heap memory.',
    common_mistake: 'Using "==" to compare String or Object equality instead of ".equals()".',
    remember_this: 'Always compare String contents with .equals() or Objects.equals(a, b), never "==".',
    variations: [
      {
        variation_id: 'java-str-1',
        question_type: 'output_prediction',
        prompt: 'What will this Java program print?',
        code: `String s1 = "hello";\nString s2 = "hello";\nString s3 = new String("hello");\n\nSystem.out.println((s1 == s2) + " " + (s1 == s3));`,
        options: [
          { id: 'A', text: 'true false' },
          { id: 'B', text: 'true true' },
          { id: 'C', text: 'false false' },
          { id: 'D', text: 'Compilation error' },
        ],
        correct_answer: 'A',
        specific_explanation: 's1 and s2 point to the identical interned literal in the String pool (s1 == s2 is true). s3 was created via "new", allocating a separate heap object, so (s1 == s3) is false.',
      },
      {
        variation_id: 'java-str-2',
        question_type: 'output_prediction',
        prompt: 'What is the output of this integer comparison?',
        code: `Integer a = 100;\nInteger b = 100;\nInteger x = 200;\nInteger y = 200;\n\nSystem.out.println((a == b) + " " + (x == y));`,
        options: [
          { id: 'A', text: 'true false' },
          { id: 'B', text: 'true true' },
          { id: 'C', text: 'false false' },
          { id: 'D', text: 'false true' },
        ],
        correct_answer: 'A',
        specific_explanation: 'Java caches Integer objects in the range -128 to 127. Autoboxing 100 returns the same cached instance (a == b is true). 200 is outside the cache, instantiating two distinct objects (x == y is false).',
      },
    ],
  },

  // -------------------------------------------------------------
  // 7. C++: Move Semantics & RAII
  // -------------------------------------------------------------
  {
    concept_id: 'cpp-move-semantics-raii',
    concept_name: 'Move Semantics & rvalue References',
    language: 'cpp',
    difficulty: 'advanced',
    topic: 'Memory Management & Performance',
    base_explanation: 'std::move casts an lvalue to an rvalue reference (&&), enabling move constructors and move assignments to transfer ownership of resources without expensive deep heap copying. The moved-from object is left in a valid but unspecified state.',
    common_mistake: 'Using an object after calling std::move on it, assuming its original contents are intact.',
    remember_this: 'std::move does not move anything by itself; it is an unconditional static_cast to an rvalue reference allowing move constructors to take over resources.',
    variations: [
      {
        variation_id: 'cpp-move-1',
        question_type: 'what_will_happen',
        prompt: 'What happens when std::move is called on this vector?',
        code: `#include <vector>\n#include <iostream>\n\nstd::vector<int> a = {1, 2, 3};\nstd::vector<int> b = std::move(a);\n\nstd::cout << a.size() << " " << b.size();`,
        options: [
          { id: 'A', text: '0 3 (or a is empty, b has 3)' },
          { id: 'B', text: '3 3 (deep copy performed)' },
          { id: 'C', text: 'Undefined behavior / Segfault' },
          { id: 'D', text: 'Compilation error' },
        ],
        correct_answer: 'A',
        specific_explanation: 'b\'s move constructor steals the internal dynamic array pointer from a and sets a\'s size to 0. a is left valid and empty without any memory re-allocation.',
      },
      {
        variation_id: 'cpp-move-2',
        question_type: 'find_bug',
        prompt: 'Why will this modern C++ unique_ptr code fail to compile?',
        code: `#include <memory>\n\nstd::unique_ptr<int> p1 = std::make_unique<int>(42);\nstd::unique_ptr<int> p2 = p1; // Line X`,
        options: [
          { id: 'A', text: 'std::unique_ptr copy constructor is deleted; ownership must be transferred with std::move(p1).' },
          { id: 'B', text: 'make_unique requires an explicit raw pointer argument.' },
          { id: 'C', text: 'unique_ptr cannot store primitive types like int.' },
          { id: 'D', text: 'p2 must be declared as auto&.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'std::unique_ptr enforces exclusive ownership. Its copy constructor and copy assignment operator are explicitly deleted (= delete). You must use "std::move(p1)" to transfer ownership.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 8. C: Pointer Arithmetic & Array Indexing
  // -------------------------------------------------------------
  {
    concept_id: 'c-pointer-arithmetic',
    concept_name: 'Pointer Arithmetic & Array Decay',
    language: 'c',
    difficulty: 'intermediate',
    topic: 'Memory & Systems',
    base_explanation: 'In C, array names decay into pointers to their first element in expressions. Pointer arithmetic scales by sizeof(*ptr), not raw byte count. Furthermore, array indexing a[i] is defined as *(a + i), making i[a] mathematically identical!',
    common_mistake: 'Assuming pointer + 1 increments by 1 byte instead of 1 * sizeof(type).',
    remember_this: 'ptr + n advances by n * sizeof(*ptr) bytes. a[i] is literally syntactic sugar for *(a + i).',
    variations: [
      {
        variation_id: 'c-ptr-1',
        question_type: 'output_prediction',
        prompt: 'What will be printed by this C program?',
        code: `#include <stdio.h>\n\nint main() {\n    int arr[] = {10, 20, 30, 40};\n    int *p = arr;\n    p++;\n    printf("%d\\n", *(p + 1));\n    return 0;\n}`,
        options: [
          { id: 'A', text: '20' },
          { id: 'B', text: '30' },
          { id: 'C', text: '40' },
          { id: 'D', text: '10' },
        ],
        correct_answer: 'B',
        specific_explanation: 'p starts at arr[0] (10). "p++" advances p to point to arr[1] (20). Then "*(p + 1)" dereferences one element further, which is arr[2] (30).',
      },
      {
        variation_id: 'c-ptr-2',
        question_type: 'syntax_challenge',
        prompt: 'In C, what is the value of 2[arr] if arr is declared as "int arr[] = {5, 10, 15, 20};"?',
        options: [
          { id: 'A', text: '15' },
          { id: 'B', text: 'Syntax error' },
          { id: 'C', text: '10' },
          { id: 'D', text: 'Garbage memory value' },
        ],
        correct_answer: 'A',
        specific_explanation: 'By C standard definition, arr[2] expands to *(arr + 2). Since addition is commutative, *(2 + arr) is identical to 2[arr], resolving to arr[2] = 15.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 9. RUST: Borrow Checker & Ownership
  // -------------------------------------------------------------
  {
    concept_id: 'rust-ownership-borrowing',
    concept_name: 'Ownership & Borrow Checker Rules',
    language: 'rust',
    difficulty: 'advanced',
    topic: 'Memory Safety & Concurrency',
    base_explanation: 'Rust enforces memory safety through ownership: each value has one owner. Types without the Copy trait are MOVED on assignment. You can have either any number of immutable references (&T) OR exactly one mutable reference (&mut T) at any time, never both concurrently.',
    common_mistake: 'Trying to read from a non-Copy variable after moving it to another variable or function.',
    remember_this: 'Move invalidates the source variable. Aliasing XOR Mutability: multiple readers OR one writer.',
    variations: [
      {
        variation_id: 'rust-own-1',
        question_type: 'find_bug',
        prompt: 'Why does this Rust code fail to compile?',
        code: `fn main() {\n    let s1 = String::from("zero_trace");\n    let s2 = s1;\n    println!("{}", s1);\n}`,
        options: [
          { id: 'A', text: 'Value borrowed here after move: String does not implement Copy, so ownership moved to s2.' },
          { id: 'B', text: 'Strings in Rust must be printed with {:?} debug format.' },
          { id: 'C', text: 's1 must be declared with "let mut s1".' },
          { id: 'D', text: 'String::from allocates in read-only memory.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'String allocates on the heap and implements Drop but not Copy. "let s2 = s1;" moves the heap pointer to s2, invalidating s1 to prevent double-free bugs at runtime.',
      },
      {
        variation_id: 'rust-own-2',
        question_type: 'which_statement',
        prompt: 'Which of the following compile successfully under Rust borrow rules?',
        code: `let mut data = vec![1, 2, 3];\nlet r1 = &data;\nlet r2 = &data;\nprintln!("{} {}", r1[0], r2[0]);`,
        options: [
          { id: 'A', text: 'Compiles fine because multiple immutable references are permitted simultaneously.' },
          { id: 'B', text: 'Fails to compile because vector references must be mutable.' },
          { id: 'C', text: 'Fails because r1 locks data permanently.' },
          { id: 'D', text: 'Compiles only if wrapped in an unsafe block.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'Rust allows any number of shared immutable references (&data) concurrently as long as no active mutable reference (&mut data) exists in that scope.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 10. GO: Slices & Concurrency (Goroutines & Channels)
  // -------------------------------------------------------------
  {
    concept_id: 'go-slices-channels',
    concept_name: 'Slice Headers & Channels',
    language: 'go',
    difficulty: 'intermediate',
    topic: 'Memory & Concurrency',
    base_explanation: 'In Go, a slice is a 3-word header: pointer to backing array, length, and capacity. Sub-slicing shares the same backing array until append exceeds capacity and reallocates.',
    common_mistake: 'Assuming passing a slice by value creates a full deep clone of the underlying elements.',
    remember_this: 'Sub-slices reference the same backing array. Modifying elements within capacity affects the original array.',
    variations: [
      {
        variation_id: 'go-slice-1',
        question_type: 'output_prediction',
        prompt: 'What will be printed by this Go snippet?',
        code: `package main\nimport "fmt"\n\nfunc main() {\n    a := []int{1, 2, 3}\n    b := a\n    b[0] = 99\n    fmt.Println(a[0])\n}`,
        options: [
          { id: 'A', text: '99' },
          { id: 'B', text: '1' },
          { id: 'C', text: '0' },
          { id: 'D', text: 'panic: runtime error' },
        ],
        correct_answer: 'A',
        specific_explanation: 'Assigning "b := a" copies the slice header (pointer, len, cap). Both slice headers point to the exact same underlying backing array in memory, so mutating b[0] changes a[0].',
      },
      {
        variation_id: 'go-slice-2',
        question_type: 'what_will_happen',
        prompt: 'What happens when writing to an unbuffered channel without a concurrent receiver?',
        code: `ch := make(chan int)\nch <- 42 // no goroutine reading`,
        options: [
          { id: 'A', text: 'fatal error: all goroutines are asleep - deadlock!' },
          { id: 'B', text: 'Value is dropped silently' },
          { id: 'C', text: 'The channel automatically buffers 1 item' },
          { id: 'D', text: 'Returns false' },
        ],
        correct_answer: 'A',
        specific_explanation: 'Sending on an unbuffered channel blocks until another goroutine is ready to receive. If the main goroutine blocks with no active worker goroutines, the Go runtime panics with a deadlock.',
      },
    ],
  },

  // -------------------------------------------------------------
  // 11. PHP: Type Juggling & Array Copy-on-Write
  // -------------------------------------------------------------
  {
    concept_id: 'php-type-juggling-cow',
    concept_name: 'Loose Equality & Copy-on-Write',
    language: 'php',
    difficulty: 'basic',
    topic: 'Types & Operators',
    base_explanation: 'PHP arrays utilize Copy-on-Write (COW): assigning an array does not duplicate memory until one of the variables is modified. In PHP 8+, loose comparison "==" semantics were tightened, but "===" remains mandatory for strict type checking.',
    common_mistake: 'Using "==" instead of "===" when comparing results of functions like strpos() which return 0 on success or false on failure.',
    remember_this: 'Always use strict comparison "===" to avoid type coercion pitfalls (like 0 == false).',
    variations: [
      {
        variation_id: 'php-type-1',
        question_type: 'which_statement',
        prompt: 'In PHP, why is "strpos(\'coding\', \'c\') == false" problematic?',
        options: [
          { id: 'A', text: 'strpos returns index 0 for the match, and 0 == false evaluates to true in loose comparison!' },
          { id: 'B', text: 'strpos throws a TypeError if the needle is found at index 0.' },
          { id: 'C', text: 'PHP strings are 1-indexed by default.' },
          { id: 'D', text: 'strpos always returns a boolean in PHP 8.' },
        ],
        correct_answer: 'A',
        specific_explanation: '\'c\' is found at index 0. In loose comparison "0 == false" evaluates to true, falsely indicating the substring was NOT found! The correct check is "=== false".',
      },
    ],
  },

  // -------------------------------------------------------------
  // 12. RUBY: Blocks, Procs & Lambdas
  // -------------------------------------------------------------
  {
    concept_id: 'ruby-procs-lambdas',
    concept_name: 'Procs vs Lambdas in Ruby',
    language: 'ruby',
    difficulty: 'intermediate',
    topic: 'Functional & Metaprogramming',
    base_explanation: 'Both Procs and Lambdas are closures in Ruby. Lambdas enforce strict arity (argument count checking) and a "return" inside a lambda returns only from the lambda. A Proc does not enforce arity, and a "return" inside a Proc returns from the enclosing method.',
    common_mistake: 'Using "return" inside a Proc and accidentally terminating the outer caller method prematurely.',
    remember_this: 'Lambdas check argument count and return locally like a normal method. Procs return from the caller scope.',
    variations: [
      {
        variation_id: 'ruby-proc-1',
        question_type: 'what_will_happen',
        prompt: 'What happens when calling "return" inside a regular Ruby Proc?',
        options: [
          { id: 'A', text: 'It attempts to return from the enclosing method that called the proc.' },
          { id: 'B', text: 'It returns only from the proc block, behaving identically to a lambda.' },
          { id: 'C', text: 'It throws a SyntaxError.' },
          { id: 'D', text: 'It yields nil to the next block.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'In Ruby, a Proc acts like a block of inline code. A "return" inside a Proc attempts to return from the method context where the Proc was defined.',
      },
    ],
  },
];
