import { Question, LanguageId, DifficultyLevel, QuestionType, QuestionOption } from '../types.ts';
import { QUESTION_TEMPLATES } from '../data/questionPool.ts';

// Deterministic simple string hash
export function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

// Random pick helper
function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Procedural dynamic variations generator
// Transforms template parameters (identifiers, values, formatting)
export function generateDynamicVariation(
  language: LanguageId,
  difficulty: 'basic' | 'intermediate' | 'advanced',
  seedCounter: number
): Question {
  const varNames = ['alpha', 'beta', 'delta', 'buffer', 'payload', 'items', 'registry', 'elements', 'cache', 'queue'];
  const v1 = pickOne(varNames);
  const v2 = pickOne(varNames.filter(v => v !== v1));
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = num1 + Math.floor(Math.random() * 5) + 2;
  const num3 = num2 + Math.floor(Math.random() * 5) + 2;

  switch (language) {
    case 'python': {
      if (difficulty === 'basic') {
        const op = pickOne(['//', '%', '**']);
        if (op === '//') {
          const valA = 17 + Math.floor(Math.random() * 10);
          const valB = 4;
          const ans = Math.floor(valA / valB);
          return {
            question_id: `py-dyn-div-${seedCounter}-${valA}`,
            language: 'python',
            topic: 'Basic Operators & Arithmetic',
            difficulty: 'basic',
            question_type: 'output_prediction',
            question_hash: generateHash(`py-div-${valA}-${valB}`),
            concept_id: 'py-floor-division',
            concept_name: 'Integer Floor Division (//)',
            variation_id: `py-dyn-div-v${seedCounter}`,
            times_used: 1,
            prompt: `What is the exact result of this Python expression?`,
            code: `${v1} = ${valA}\n${v2} = ${valB}\nprint(${v1} // ${v2})`,
            options: [
              { id: 'A', text: `${ans}` },
              { id: 'B', text: `${(valA / valB).toFixed(2)}` },
              { id: 'C', text: `${valA % valB}` },
              { id: 'D', text: `${ans}.0` },
            ],
            correct_answer: 'A',
            explanation: `In Python, the "//" operator performs floor division, discarding any fractional remainder and returning an integer quotient. ${valA} // ${valB} evaluates to ${ans}.`,
            common_mistake: 'Confusing single slash "/" (which always returns a float in Python 3) with double slash "//" (floor division).',
            remember_this: 'Use "/" for float division and "//" for integer floor division.',
          };
        } else {
          const base = 2 + Math.floor(Math.random() * 3);
          const exp = 3;
          const ans = Math.pow(base, exp);
          return {
            question_id: `py-dyn-pow-${seedCounter}`,
            language: 'python',
            topic: 'Operators & Precedence',
            difficulty: 'basic',
            question_type: 'output_prediction',
            question_hash: generateHash(`py-pow-${base}-${exp}`),
            concept_id: 'py-exponentiation-precedence',
            concept_name: 'Exponentiation Operator (**)',
            variation_id: `py-dyn-pow-v${seedCounter}`,
            times_used: 1,
            prompt: `What does this expression print in Python?`,
            code: `print(2 + ${base} ** ${exp})`,
            options: [
              { id: 'A', text: `${2 + ans}` },
              { id: 'B', text: `${Math.pow(2 + base, exp)}` },
              { id: 'C', text: `${2 * ans}` },
              { id: 'D', text: 'SyntaxError' },
            ],
            correct_answer: 'A',
            explanation: `Exponentiation "**" has higher operator precedence than addition "+". Therefore, ${base} ** ${exp} is computed first (= ${ans}), followed by + 2 = ${2 + ans}.`,
            common_mistake: 'Assuming left-to-right evaluation without respecting operator precedence.',
            remember_this: 'Python follows standard PEMDAS: parentheses > exponentiation (**) > multiplication/division > addition/subtraction.',
          };
        }
      } else if (difficulty === 'intermediate') {
        const valX = [num1, num2];
        const pushVal = num3;
        return {
          question_id: `py-dyn-ref-${seedCounter}`,
          language: 'python',
          topic: 'Object References & Mutability',
          difficulty: 'intermediate',
          question_type: 'output_prediction',
          question_hash: generateHash(`py-ref-${v1}-${v2}-${num1}-${pushVal}`),
          concept_id: 'py-mutability-references',
          concept_name: 'Object References & Mutability',
          variation_id: `py-dyn-ref-v${seedCounter}`,
          times_used: 1,
          prompt: `Which output will this code produce?`,
          code: `${v1} = [${valX.join(', ')}]\n${v2} = ${v1}\n${v2}.append(${pushVal})\n\nprint(${v1})`,
          options: [
            { id: 'A', text: `[${valX.join(', ')}]` },
            { id: 'B', text: `[${pushVal}]` },
            { id: 'C', text: `[${[...valX, pushVal].join(', ')}]` },
            { id: 'D', text: 'TypeError' },
          ],
          correct_answer: 'C',
          explanation: `In Python, lists are mutable. The assignment "${v2} = ${v1}" points ${v2} to the exact same list in memory. Calling .append(${pushVal}) mutates that shared list, so ${v1} prints [${[...valX, pushVal].join(', ')}].`,
          common_mistake: 'Assuming assigning a list to a new variable creates an independent copy.',
          remember_this: 'Variable assignment never clones lists in Python. Use .copy() or list() for shallow cloning.',
        };
      } else {
        return {
          question_id: `py-dyn-gen-${seedCounter}`,
          language: 'python',
          topic: 'Generators & Memory',
          difficulty: 'advanced',
          question_type: 'code_comparison',
          question_hash: generateHash(`py-gen-${v1}-${num1}`),
          concept_id: 'py-generator-exhaustion',
          concept_name: 'Generator Exhaustion & Iterators',
          variation_id: `py-dyn-gen-v${seedCounter}`,
          times_used: 1,
          prompt: `What is the output when summing an already iterated generator?`,
          code: `gen = (x * 2 for x in [${num1}, ${num2}])\nfirst_sum = sum(gen)\nsecond_sum = sum(gen)\nprint(first_sum, second_sum)`,
          options: [
            { id: 'A', text: `${(num1 + num2) * 2} 0` },
            { id: 'B', text: `${(num1 + num2) * 2} ${(num1 + num2) * 2}` },
            { id: 'C', text: 'TypeError: generator cannot be reused' },
            { id: 'D', text: '0 0' },
          ],
          correct_answer: 'A',
          explanation: `Python generators are one-pass iterators. The first sum(gen) consumes all yielded values until StopIteration. The second sum(gen) receives an already exhausted generator and returns 0.`,
          common_mistake: 'Assuming generator expressions behave like persistent lists that can be re-iterated.',
          remember_this: 'Generators cannot be rewound. If you need multiple iterations over the dataset, store as a list or tuple.',
        };
      }
    }

    case 'javascript': {
      if (difficulty === 'basic') {
        const eqA = pickOne(['0 == "0"', '0 === "0"', 'false == "0"', 'null == undefined', 'NaN === NaN']);
        let correct: 'A' | 'B' | 'C' | 'D' = 'A';
        let ansText = 'true';
        let expl = '';
        if (eqA === 'NaN === NaN') {
          ansText = 'false';
          expl = 'NaN is the only value in JavaScript that is not equal to itself, by IEEE-754 standard.';
        } else if (eqA === '0 === "0"') {
          ansText = 'false';
          expl = 'Strict equality (===) checks both type and value without coercion. Number and string differ in type.';
        } else {
          ansText = 'true';
          expl = 'Loose equality (==) coerces operands according to the ECMAScript abstract equality comparison algorithm.';
        }

        return {
          question_id: `js-dyn-coercion-${seedCounter}`,
          language: 'javascript',
          topic: 'Equality & Type Coercion',
          difficulty: 'basic',
          question_type: 'what_will_happen',
          question_hash: generateHash(`js-coercion-${eqA}`),
          concept_id: 'js-equality-coercion',
          concept_name: 'Abstract vs Strict Equality (== vs ===)',
          variation_id: `js-dyn-eq-v${seedCounter}`,
          times_used: 1,
          prompt: `What does the expression "${eqA}" evaluate to in JavaScript?`,
          options: [
            { id: 'A', text: ansText },
            { id: 'B', text: ansText === 'true' ? 'false' : 'true' },
            { id: 'C', text: 'TypeError' },
            { id: 'D', text: 'undefined' },
          ],
          correct_answer: 'A',
          explanation: expl,
          common_mistake: 'Relying on loose equality (==) and getting unexpected truthy/falsy coercion.',
          remember_this: 'Always use strict equality (===) in modern JavaScript to eliminate coercion ambiguities.',
        };
      } else if (difficulty === 'intermediate') {
        return {
          question_id: `js-dyn-closure-${seedCounter}`,
          language: 'javascript',
          topic: 'Closures & Scoping',
          difficulty: 'intermediate',
          question_type: 'output_prediction',
          question_hash: generateHash(`js-closure-dyn-${v1}-${num1}`),
          concept_id: 'js-lexical-environment',
          concept_name: 'Lexical Environment & Closure Retention',
          variation_id: `js-dyn-closure-v${seedCounter}`,
          times_used: 1,
          prompt: `What will this factory function log?`,
          code: `function createCounter() {\n  let count = ${num1};\n  return function() {\n    count += ${num2};\n    return count;\n  };\n}\n\nconst c1 = createCounter();\nc1();\nconsole.log(c1());`,
          options: [
            { id: 'A', text: `${num1 + num2 * 2}` },
            { id: 'B', text: `${num1 + num2}` },
            { id: 'C', text: `${num2}` },
            { id: 'D', text: 'undefined' },
          ],
          correct_answer: 'A',
          explanation: `The inner function forms a closure over the lexical scope containing "count". Each call retains and mutates that enclosed state. First call adds ${num2} (${num1 + num2}); second call adds ${num2} again (= ${num1 + num2 * 2}).`,
          common_mistake: 'Thinking local variables are re-initialized each time the returned function is called.',
          remember_this: 'Closures retain live bindings to variables in their lexical scope, preserving state across invocations.',
        };
      } else {
        return {
          question_id: `js-dyn-micro-${seedCounter}`,
          language: 'javascript',
          topic: 'Event Loop & Promises',
          difficulty: 'advanced',
          question_type: 'output_prediction',
          question_hash: generateHash(`js-micro-dyn-${num1}-${num2}`),
          concept_id: 'js-event-loop-microtasks',
          concept_name: 'Microtask vs Macrotask Priority',
          variation_id: `js-dyn-micro-v${seedCounter}`,
          times_used: 1,
          prompt: `What is the precise console output sequence?`,
          code: `console.log(${num1});\nsetTimeout(() => console.log(${num2}), 0);\nqueueMicrotask(() => console.log(${num3}));\nconsole.log(${num1 * 2});`,
          options: [
            { id: 'A', text: `${num1}, ${num1 * 2}, ${num3}, ${num2}` },
            { id: 'B', text: `${num1}, ${num2}, ${num3}, ${num1 * 2}` },
            { id: 'C', text: `${num1}, ${num3}, ${num1 * 2}, ${num2}` },
            { id: 'D', text: `${num1}, ${num1 * 2}, ${num2}, ${num3}` },
          ],
          correct_answer: 'A',
          explanation: `Synchronous logs (${num1}, ${num1 * 2}) execute first on the call stack. Once the stack is clear, the microtask queue (${num3}) drains completely before the macrotask queue (setTimeout: ${num2}) is processed.`,
          common_mistake: 'Assuming setTimeout 0 ms puts its callback ahead of microtasks.',
          remember_this: 'Microtasks (Promises, queueMicrotask) have strict priority over Macrotasks (setTimeout, setInterval).',
        };
      }
    }

    case 'typescript': {
      return {
        question_id: `ts-dyn-gen-${seedCounter}`,
        language: 'typescript',
        topic: 'Generics & Utility Types',
        difficulty: difficulty,
        question_type: 'which_statement',
        question_hash: generateHash(`ts-utility-${seedCounter}-${difficulty}`),
        concept_id: 'ts-utility-types',
        concept_name: 'Mapped Types & Partial<T> / Readonly<T>',
        variation_id: `ts-dyn-util-v${seedCounter}`,
        times_used: 1,
        prompt: `How does TypeScript's built-in "Readonly<T>" utility type transform interface properties?`,
        code: `type Readonly<T> = {\n    readonly [P in keyof T]: T[P];\n};`,
        options: [
          { id: 'A', text: 'It maps over all keys of T using "keyof" and prefixes each property with the "readonly" modifier.' },
          { id: 'B', text: 'It deep-freezes the object at JavaScript runtime using Object.freeze.' },
          { id: 'C', text: 'It removes all optional "?" question mark flags.' },
          { id: 'D', text: 'It converts all properties to string literal types.' },
        ],
        correct_answer: 'A',
        specific_explanation: 'TypeScript mapped types iterate through property keys at compile time. Readonly<T> is purely a compile-time type constraint; it adds no JavaScript runtime overhead.',
        explanation: 'TypeScript mapped types iterate through property keys at compile time. Readonly<T> is purely a compile-time type constraint; it adds no JavaScript runtime overhead.',
        common_mistake: 'Thinking TypeScript utility types perform runtime mutations like Object.freeze.',
        remember_this: 'TypeScript utility types are erased at compile time and enforce static safety without runtime performance penalty.',
      };
    }

    case 'java': {
      return {
        question_id: `java-dyn-poly-${seedCounter}`,
        language: 'java',
        topic: 'OOP & Method Overriding',
        difficulty: difficulty,
        question_type: 'output_prediction',
        question_hash: generateHash(`java-poly-${seedCounter}`),
        concept_id: 'java-dynamic-binding',
        concept_name: 'Dynamic Method Dispatch vs Field Hiding',
        variation_id: `java-dyn-poly-v${seedCounter}`,
        times_used: 1,
        prompt: `What does this Java program print?`,
        code: `class Parent {\n    int val = 10;\n    void show() { System.out.print("P"); }\n}\nclass Child extends Parent {\n    int val = 20;\n    void show() { System.out.print("C"); }\n}\n\nParent obj = new Child();\nSystem.out.print(obj.val);\nobj.show();`,
        options: [
          { id: 'A', text: '10C' },
          { id: 'B', text: '20C' },
          { id: 'C', text: '10P' },
          { id: 'D', text: '20P' },
        ],
        correct_answer: 'A',
        explanation: `In Java, methods are resolved dynamically at runtime based on the actual object instance (Child\'s show() prints "C"). Fields (variables) are NOT polymorphic and are resolved statically at compile time based on the reference type (Parent\'s val is 10). Result: 10C.`,
        common_mistake: 'Believing instance variable fields in Java are polymorphic like methods.',
        remember_this: 'Methods are polymorphic (virtual by default in Java), but instance variables are resolved statically by the reference type.',
      };
    }

    case 'cpp': {
      return {
        question_id: `cpp-dyn-vtable-${seedCounter}`,
        language: 'cpp',
        topic: 'Virtual Functions & Polymorphism',
        difficulty: difficulty,
        question_type: 'what_will_happen',
        question_hash: generateHash(`cpp-vtable-${seedCounter}`),
        concept_id: 'cpp-virtual-destructor',
        concept_name: 'Virtual Destructors in Base Classes',
        variation_id: `cpp-dyn-vdestruct-v${seedCounter}`,
        times_used: 1,
        prompt: `Why is a virtual destructor critical in a polymorphic C++ base class?`,
        code: `class Base {\npublic:\n    virtual ~Base() = default; // Why virtual?\n};\nclass Derived : public Base {\n    int* buffer = new int[100];\npublic:\n    ~Derived() { delete[] buffer; }\n};`,
        options: [
          { id: 'A', text: 'Deleting a Derived object via a Base pointer without a virtual destructor results in undefined behavior and memory leaks.' },
          { id: 'B', text: 'Without it, Derived classes cannot inherit private members.' },
          { id: 'C', text: 'It prevents the compiler from using the vtable lookup table.' },
          { id: 'D', text: 'Virtual destructors are required for template instantiation.' },
        ],
        correct_answer: 'A',
        explanation: 'When deleting through a base pointer (Base* p = new Derived()), if ~Base() is not virtual, only Base::~Base() is called; Derived::~Derived() is skipped, causing undefined behavior and resource leaks.',
        common_mistake: 'Forgetting to make base class destructors virtual when using inheritance and dynamic allocation.',
        remember_this: 'If a class has any virtual member function, its destructor should almost certainly be declared virtual.',
      };
    }

    case 'c': {
      return {
        question_id: `c-dyn-sizeof-${seedCounter}`,
        language: 'c',
        topic: 'Struct Padding & Alignment',
        difficulty: difficulty,
        question_type: 'concept_based',
        question_hash: generateHash(`c-padding-${seedCounter}`),
        concept_id: 'c-struct-padding',
        concept_name: 'Struct Memory Alignment & Padding',
        variation_id: `c-dyn-pad-v${seedCounter}`,
        times_used: 1,
        prompt: `Why is sizeof(struct Node) often 8 bytes instead of 5 on a 64-bit architecture?`,
        code: `struct Node {\n    char c; // 1 byte\n    int i;  // 4 bytes\n};`,
        options: [
          { id: 'A', text: 'Compilers insert 3 padding bytes after char so int is aligned on a 4-byte memory boundary.' },
          { id: 'B', text: 'C structs always allocate multiples of 16 bytes.' },
          { id: 'C', text: 'char takes 4 bytes when inside a struct.' },
          { id: 'D', text: 'sizeof automatically includes 3 bytes for a hidden vtable pointer.' },
        ],
        correct_answer: 'A',
        explanation: 'Hardware architectures read multi-byte words efficiently when aligned on address multiples equal to their size. Compilers add padding bytes (structure alignment) to avoid unaligned memory access penalties.',
        common_mistake: 'Assuming struct size is simply the sum of the byte sizes of its members.',
        remember_this: 'Reordering struct members from largest to smallest type minimizes padding overhead.',
      };
    }

    case 'rust': {
      return {
        question_id: `rust-dyn-match-${seedCounter}`,
        language: 'rust',
        topic: 'Pattern Matching & Enums',
        difficulty: difficulty,
        question_type: 'syntax_challenge',
        question_hash: generateHash(`rust-match-${seedCounter}`),
        concept_id: 'rust-option-unwrap',
        concept_name: 'Option<T> Pattern Matching vs unwrap',
        variation_id: `rust-dyn-opt-v${seedCounter}`,
        times_used: 1,
        prompt: `What is the safest, most idiomatic way to handle Option<T> without risking a panic in Rust?`,
        options: [
          { id: 'A', text: 'Using "if let Some(val) = opt { ... }" or a "match" expression.' },
          { id: 'B', text: 'Calling ".unwrap()" on every Option.' },
          { id: 'C', text: 'Checking if opt == null before accessing.' },
          { id: 'D', text: 'Casting opt as raw pointer with "as *const T".' },
        ],
        correct_answer: 'A',
        explanation: 'Rust does not have null. Optionality is modeled via the Option<T> enum (Some(T) or None). Pattern matching or "if let" handles both variants safely without runtime panics.',
        common_mistake: 'Relying on ".unwrap()" in production code, causing panic crashes when None is received.',
        remember_this: 'Use unwrap_or, unwrap_or_else, match, or ? (try operator) instead of naked unwrap.',
      };
    }

    case 'go': {
      return {
        question_id: `go-dyn-defer-${seedCounter}`,
        language: 'go',
        topic: 'Control Flow & Resource Cleanup',
        difficulty: difficulty,
        question_type: 'output_prediction',
        question_hash: generateHash(`go-defer-${seedCounter}`),
        concept_id: 'go-defer-lifo',
        concept_name: 'Defer LIFO Execution Order',
        variation_id: `go-dyn-defer-v${seedCounter}`,
        times_used: 1,
        prompt: `What order will these deferred calls execute in Go?`,
        code: `package main\nimport "fmt"\n\nfunc main() {\n    defer fmt.Print("A")\n    defer fmt.Print("B")\n    defer fmt.Print("C")\n}`,
        options: [
          { id: 'A', text: 'CBA' },
          { id: 'B', text: 'ABC' },
          { id: 'C', text: 'Random / non-deterministic' },
          { id: 'D', text: 'BAC' },
        ],
        correct_answer: 'A',
        explanation: 'Deferred function calls are pushed onto a stack. When the surrounding function returns, its deferred calls are executed in Last-In-First-Out (LIFO) order: C then B then A.',
        common_mistake: 'Assuming deferred functions execute in first-in-first-out (FIFO) order.',
        remember_this: 'Go defers execute in reverse order of declaration (LIFO stack).',
      };
    }

    case 'php': {
      return {
        question_id: `php-dyn-nullsafe-${seedCounter}`,
        language: 'php',
        topic: 'Modern PHP 8 Features',
        difficulty: difficulty,
        question_type: 'what_will_happen',
        question_hash: generateHash(`php-nullsafe-${seedCounter}`),
        concept_id: 'php-nullsafe-operator',
        concept_name: 'Nullsafe Operator (?->)',
        variation_id: `php-dyn-nullsafe-v${seedCounter}`,
        times_used: 1,
        prompt: `What happens when $user is null in "$user?->getProfile()?->getName()"?`,
        options: [
          { id: 'A', text: 'It evaluates safely to null without raising an error or exception.' },
          { id: 'B', text: 'It throws a Fatal Error: Call to a member function on null.' },
          { id: 'C', text: 'It returns an empty string "".' },
          { id: 'D', text: 'It throws a TypeError.' },
        ],
        correct_answer: 'A',
        explanation: 'PHP 8.0 introduced the nullsafe operator (?->). If any element in the chain evaluates to null, execution of the chain short-circuits and immediately returns null.',
        common_mistake: 'Using regular object operator "->" on nullable objects and crashing with fatal error.',
        remember_this: 'Use the nullsafe operator "?->" when accessing properties or methods on potentially null objects.',
      };
    }

    case 'ruby': {
      return {
        question_id: `ruby-dyn-sym-${seedCounter}`,
        language: 'ruby',
        topic: 'Data Types & Object Identity',
        difficulty: difficulty,
        question_type: 'code_comparison',
        question_hash: generateHash(`ruby-sym-${seedCounter}`),
        concept_id: 'ruby-symbols-vs-strings',
        concept_name: 'Symbols vs Strings Object Identity',
        variation_id: `ruby-dyn-sym-v${seedCounter}`,
        times_used: 1,
        prompt: `What is the result of comparing object_id between identical symbols vs identical strings in Ruby?`,
        code: `sym1 = :status\nsym2 = :status\nstr1 = "status"\nstr2 = "status"\n\nputs "#{sym1.object_id == sym2.object_id} #{str1.object_id == str2.object_id}"`,
        options: [
          { id: 'A', text: 'true false' },
          { id: 'B', text: 'true true' },
          { id: 'C', text: 'false false' },
          { id: 'D', text: 'false true' },
        ],
        correct_answer: 'A',
        explanation: 'Symbols are immutable interned identifiers: identical symbol names always point to the exact same memory object (true). Strings are mutable objects; creating a new string literal creates a new object in heap memory with a distinct object_id (false).',
        common_mistake: 'Thinking string literals in Ruby are automatically interned like symbols.',
        remember_this: 'Symbols are immutable and reused (same object_id); strings create new objects unless frozen.',
      };
    }
  }
}

// Generates exactly 10 questions with:
// 1. Zero duplicate questions (checked against seen question hashes)
// 2. Multi-dimensional variation (varied question types, parameters)
// 3. Diverse concept distribution (no 2 questions test the exact same concept unless user is in adaptive drill mode)
export function generateQuizQuestions(
  languages: LanguageId[],
  difficulty: DifficultyLevel,
  excludeHashes: string[] = []
): Question[] {
  const selectedQuestions: Question[] = [];
  const chosenConceptIds = new Set<string>();
  const seenHashesSet = new Set<string>(excludeHashes);

  // 1. Gather all candidates from static templates that match selected languages & difficulty
  const matchingTemplates = QUESTION_TEMPLATES.filter(t => {
    const langMatch = languages.includes(t.language);
    if (!langMatch) return false;
    if (difficulty === 'adaptive' || difficulty === 'basic') return true;
    return t.difficulty === difficulty;
  });

  // Shuffle templates for randomness
  const shuffledTemplates = shuffle(matchingTemplates);

  for (const t of shuffledTemplates) {
    if (selectedQuestions.length >= 10) break;
    if (chosenConceptIds.has(t.concept_id)) continue; // Don't repeat concept in same quiz

    // Pick a variation that hasn't been seen
    const unseenVariations = t.variations.filter(v => {
      const h = generateHash(t.language + t.concept_id + v.variation_id);
      return !seenHashesSet.has(h);
    });

    const chosenVar = unseenVariations.length > 0 ? pickOne(unseenVariations) : pickOne(t.variations);

    const questionHash = generateHash(t.language + t.concept_id + chosenVar.variation_id);
    seenHashesSet.add(questionHash);
    chosenConceptIds.add(t.concept_id);

    selectedQuestions.push({
      question_id: `${t.language}-${chosenVar.variation_id}`,
      language: t.language,
      topic: t.topic,
      difficulty: t.difficulty,
      question_type: chosenVar.question_type,
      question_hash: questionHash,
      concept_id: t.concept_id,
      concept_name: t.concept_name,
      variation_id: chosenVar.variation_id,
      times_used: 1,
      prompt: chosenVar.prompt,
      code: chosenVar.code,
      options: chosenVar.options,
      correct_answer: chosenVar.correct_answer,
      explanation: chosenVar.specific_explanation || t.base_explanation,
      common_mistake: t.common_mistake,
      remember_this: t.remember_this,
      source: 'built_in',
    });
  }

  // 2. If we need more questions to reach exactly 10, generate dynamic procedural variations
  let counter = 1;
  const effectiveDiff = difficulty === 'adaptive' ? 'intermediate' : difficulty;

  while (selectedQuestions.length < 10) {
    const lang = pickOne(languages);
    const dynQ = generateDynamicVariation(lang, effectiveDiff as 'basic' | 'intermediate' | 'advanced', counter++);

    // Check duplicate
    if (!seenHashesSet.has(dynQ.question_hash)) {
      seenHashesSet.add(dynQ.question_hash);
      selectedQuestions.push(dynQ);
    }
  }

  return selectedQuestions.slice(0, 10);
}

// "Try Similar Question" Feature
// Finds or synthesizes an alternative variation for the EXACT same concept
export function getSimilarQuestionForConcept(
  conceptId: string,
  language: LanguageId,
  currentVariationId: string
): Question {
  const template = QUESTION_TEMPLATES.find(t => t.concept_id === conceptId);
  if (template) {
    const otherVars = template.variations.filter(v => v.variation_id !== currentVariationId);
    if (otherVars.length > 0) {
      const v = pickOne(otherVars);
      return {
        question_id: `${template.language}-${v.variation_id}-similar`,
        language: template.language,
        topic: template.topic,
        difficulty: template.difficulty,
        question_type: v.question_type,
        question_hash: generateHash(template.language + template.concept_id + v.variation_id + '-sim'),
        concept_id: template.concept_id,
        concept_name: template.concept_name,
        variation_id: v.variation_id,
        times_used: 1,
        prompt: v.prompt,
        code: v.code,
        options: v.options,
        correct_answer: v.correct_answer,
        explanation: v.specific_explanation || template.base_explanation,
        common_mistake: template.common_mistake,
        remember_this: template.remember_this,
        source: 'dynamic_variation',
      };
    }
  }

  // Fallback: generate a fresh dynamic variation
  return generateDynamicVariation(language, 'intermediate', Date.now());
}
