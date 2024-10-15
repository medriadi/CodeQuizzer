const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

const quizzes = [
  {
    title: 'JavaScript Basics',
    description: 'Test your knowledge on basic JavaScript concepts.',
    questions: [
      {
        questionText: 'What is the output of `typeof null` in JavaScript?',
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctAnswer: '"object"',
        explanation: 'In JavaScript, typeof null returns "object". This is a long-standing bug in the language.',
      },
      {
        questionText: 'Which company developed JavaScript?',
        options: ['Microsoft', 'Google', 'Netscape', 'Apple'],
        correctAnswer: 'Netscape',
        explanation: 'JavaScript was developed by Netscape Communications.',
      },
      {
        questionText: 'Which method is used to add an element at the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 'push()',
        explanation: '`push()` adds one or more elements to the end of an array.',
      },
      {
        questionText: 'How do you create a function in JavaScript?',
        options: ['function myFunction()', 'function:myFunction()', 'create myFunction()', 'def myFunction()'],
        correctAnswer: 'function myFunction()',
        explanation: 'The correct syntax to declare a function is `function myFunction()`.',
      },
      {
        questionText: 'Which keyword is used to declare a constant in JavaScript?',
        options: ['var', 'let', 'const', 'constant'],
        correctAnswer: 'const',
        explanation: '`const` declares a block-scoped, read-only named constant.',
      },
      {
        questionText: 'What is the correct way to write a JavaScript array?',
        options: [
          'var colors = (1:"red", 2:"green", 3:"blue")',
          'var colors = ["red", "green", "blue"]',
          'var colors = "red", "green", "blue"',
          'var colors = {"red", "green", "blue"}',
        ],
        correctAnswer: 'var colors = ["red", "green", "blue"]',
        explanation: 'Arrays are written with square brackets and comma-separated values.',
      },
      {
        questionText: 'How do you write "Hello World" in an alert box?',
        options: [
          'msgBox("Hello World");',
          'alertBox("Hello World");',
          'msg("Hello World");',
          'alert("Hello World");',
        ],
        correctAnswer: 'alert("Hello World");',
        explanation: '`alert("Hello World");` displays an alert box with the message.',
      },
      {
        questionText: 'Which event occurs when the user clicks on an HTML element?',
        options: ['onchange', 'onmouseover', 'onclick', 'onmouseclick'],
        correctAnswer: 'onclick',
        explanation: '`onclick` is the correct event that occurs when a user clicks on an element.',
      },
      {
        questionText: 'How do you declare a JavaScript variable?',
        options: ['v carName;', 'variable carName;', 'var carName;', 'declare carName;'],
        correctAnswer: 'var carName;',
        explanation: '`var carName;` is the correct way to declare a variable in JavaScript.',
      },
      {
        questionText: 'Which operator is used to assign a value to a variable?',
        options: ['*', '-', '=', '+'],
        correctAnswer: '=',
        explanation: '`=` is the assignment operator used to assign values to variables.',
      },
    ],
  },
  {
    title: 'Python Fundamentals',
    description: 'Assess your understanding of fundamental Python programming.',
    questions: [
      {
        questionText: 'What is the output of `print(2 ** 3)` in Python?',
        options: ['5', '6', '8', '9'],
        correctAnswer: '8',
        explanation: '`**` is the exponentiation operator in Python. 2 ** 3 equals 8.',
      },
      {
        questionText: 'Which keyword is used to define a function in Python?',
        options: ['func', 'define', 'def', 'function'],
        correctAnswer: 'def',
        explanation: 'The `def` keyword is used to define functions in Python.',
      },
      {
        questionText: 'What is the correct file extension for Python files?',
        options: ['.pyth', '.pt', '.pyt', '.py'],
        correctAnswer: '.py',
        explanation: 'Python files use the `.py` extension.',
      },
      {
        questionText: 'How do you insert COMMENTS in Python code?',
        options: ['// This is a comment', '# This is a comment', '/* This is a comment */', '<!-- This is a comment -->'],
        correctAnswer: '# This is a comment',
        explanation: 'In Python, comments are inserted using the `#` symbol.',
      },
      {
        questionText: 'Which data type is immutable in Python?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correctAnswer: 'Tuple',
        explanation: 'Tuples are immutable, meaning their elements cannot be changed after creation.',
      },
      {
        questionText: 'Which method can be used to remove any whitespace from both the beginning and the end of a string?',
        options: ['strip()', 'trim()', 'len()', 'remove()'],
        correctAnswer: 'strip()',
        explanation: '`strip()` removes whitespace from both ends of a string.',
      },
      {
        questionText: 'How do you start a for loop in Python?',
        options: [
          'for (i = 0; i < 5; i++):',
          'for i in range(5):',
          'for i < 5:',
          'for i = 1 to 5:',
        ],
        correctAnswer: 'for i in range(5):',
        explanation: '`for i in range(5):` is the correct syntax to start a for loop in Python.',
      },
      {
        questionText: 'What is the correct syntax to output the type of a variable or object in Python?',
        options: [
          'print(typeof(x))',
          'print(type(x))',
          'print(typeof x)',
          'print(type of x)',
        ],
        correctAnswer: 'print(type(x))',
        explanation: '`print(type(x))` is the correct syntax to display the type of a variable or object.',
      },
      {
        questionText: 'Which keyword is used for exception handling in Python?',
        options: ['try', 'catch', 'except', 'finally'],
        correctAnswer: 'except',
        explanation: 'The `except` keyword is used to handle exceptions in Python.',
      },
      {
        questionText: 'What is the output of `print("Hello" + " " + "World")`?',
        options: ['HelloWorld', 'Hello World', 'Hello+World', 'Hello + World'],
        correctAnswer: 'Hello World',
        explanation: 'The `+` operator concatenates the strings with a space in between, resulting in "Hello World".',
      },
    ],
  },
  {
    title: 'Java Fundamentals',
    description: 'Evaluate your grasp of core Java programming concepts.',
    questions: [
      {
        questionText: 'What is the size of an int variable in Java?',
        options: ['16 bits', '32 bits', '64 bits', '128 bits'],
        correctAnswer: '32 bits',
        explanation: 'In Java, an `int` is a 32-bit signed integer.',
      },
      {
        questionText: 'Which method is the entry point for any Java program?',
        options: ['start()', 'main()', 'init()', 'run()'],
        correctAnswer: 'main()',
        explanation: 'The `main()` method is the entry point of any Java application.',
      },
      {
        questionText: 'Which keyword is used to inherit a class in Java?',
        options: ['implements', 'extends', 'inherits', 'super'],
        correctAnswer: 'extends',
        explanation: '`extends` is used to inherit from a superclass in Java.',
      },
      {
        questionText: 'What is the default value of a boolean variable in Java?',
        options: ['true', 'false', 'null', '0'],
        correctAnswer: 'false',
        explanation: 'The default value of a `boolean` in Java is `false`.',
      },
      {
        questionText: 'Which of the following is not a Java keyword?',
        options: ['static', 'Boolean', 'void', 'private'],
        correctAnswer: 'Boolean',
        explanation: '`Boolean` is a class in Java, not a keyword.',
      },
      {
        questionText: 'Which exception is thrown when a thread is waiting, sleeping, or otherwise occupied, and the thread is interrupted?',
        options: [
          'IOException',
          'InterruptedException',
          'NullPointerException',
          'ArithmeticException',
        ],
        correctAnswer: 'InterruptedException',
        explanation: '`InterruptedException` is thrown when a thread is interrupted.',
      },
      {
        questionText: 'Which collection class allows you to grow or shrink its size and provides indexed access to its elements?',
        options: ['ArrayList', 'LinkedList', 'HashSet', 'TreeSet'],
        correctAnswer: 'ArrayList',
        explanation: '`ArrayList` allows dynamic resizing and provides indexed access.',
      },
      {
        questionText: 'What is the purpose of the `final` keyword in Java?',
        options: [
          'To define constants',
          'To prevent inheritance',
          'To prevent method overriding',
          'All of the above',
        ],
        correctAnswer: 'All of the above',
        explanation: '`final` can be used to define constants, prevent inheritance, and prevent method overriding.',
      },
      {
        questionText: 'Which of the following is used to compile a Java program?',
        options: ['java', 'javac', 'compile', 'JVM'],
        correctAnswer: 'javac',
        explanation: '`javac` is the compiler used to compile Java source files.',
      },
      {
        questionText: 'Which interface must be implemented by any class whose instances are intended to be executed by a thread?',
        options: ['Runnable', 'Callable', 'Threadable', 'Executor'],
        correctAnswer: 'Runnable',
        explanation: '`Runnable` interface must be implemented by classes whose instances are to be executed by a thread.',
      },
    ],
  },
  {
    title: 'C++ Essentials',
    description: 'Test your understanding of essential C++ programming concepts.',
    questions: [
      {
        questionText: 'What is the correct syntax to declare a pointer to an int in C++?',
        options: ['int ptr;', 'int *ptr;', 'pointer int ptr;', 'int& ptr;'],
        correctAnswer: 'int *ptr;',
        explanation: '`int *ptr;` correctly declares a pointer to an integer.',
      },
      {
        questionText: 'Which feature of C++ allows you to use the same function name with different parameters?',
        options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        correctAnswer: 'Polymorphism',
        explanation: 'Polymorphism allows using the same function name with different parameters.',
      },
      {
        questionText: 'What is the output of the following code snippet?\n\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 5;\n    int &ref = a;\n    ref = 10;\n    cout << a;\n    return 0;\n}\n```',
        options: ['5', '10', 'Error', 'Undefined'],
        correctAnswer: '10',
        explanation: 'Changing the reference `ref` changes the value of `a` to 10.',
      },
      {
        questionText: 'Which of the following is not a valid access specifier in C++?',
        options: ['public', 'private', 'protected', 'friendly'],
        correctAnswer: 'friendly',
        explanation: '`friendly` is not a valid access specifier in C++.',
      },
      {
        questionText: 'What is the purpose of a constructor in a C++ class?',
        options: [
          'To destroy objects',
          'To initialize objects',
          'To perform memory allocation',
          'To define member functions',
        ],
        correctAnswer: 'To initialize objects',
        explanation: 'Constructors are used to initialize objects of a class.',
      },
      {
        questionText: 'Which of the following operators is used to allocate memory dynamically in C++?',
        options: ['new', 'malloc', 'alloc', 'create'],
        correctAnswer: 'new',
        explanation: '`new` is the operator used for dynamic memory allocation in C++.',
      },
      {
        questionText: 'What does the `virtual` keyword indicate in C++?',
        options: [
          'A function that cannot be overridden',
          'A function that can be overridden',
          'A constant variable',
          'An abstract class',
        ],
        correctAnswer: 'A function that can be overridden',
        explanation: '`virtual` indicates that a function can be overridden in derived classes.',
      },
      {
        questionText: 'Which of the following is used to handle exceptions in C++?',
        options: ['try-catch', 'begin-except', 'throw-catch', 'start-stop'],
        correctAnswer: 'try-catch',
        explanation: 'C++ uses `try-catch` blocks to handle exceptions.',
      },
      {
        questionText: 'What is the default access specifier for members of a class in C++?',
        options: ['public', 'private', 'protected', 'friend'],
        correctAnswer: 'private',
        explanation: 'By default, members of a class are `private` in C++.',
      },
      {
        questionText: 'Which STL container is implemented as a balanced binary tree?',
        options: ['vector', 'list', 'set', 'deque'],
        correctAnswer: 'set',
        explanation: '`set` in STL is typically implemented as a balanced binary tree (like Red-Black Tree).',
      },
    ],
  },
  {
    title: 'C# Basics',
    description: 'Evaluate your understanding of fundamental C# programming concepts.',
    questions: [
      {
        questionText: 'Which keyword is used to create a class in C#?',
        options: ['class', 'Class', 'CLASS', 'object'],
        correctAnswer: 'class',
        explanation: '`class` is the keyword used to declare a class in C#.',
      },
      {
        questionText: 'What is the default access modifier for class members in C#?',
        options: ['public', 'private', 'protected', 'internal'],
        correctAnswer: 'private',
        explanation: 'By default, class members in C# are `private`.',
      },
      {
        questionText: 'Which method is the entry point of a C# program?',
        options: ['Start()', 'Main()', 'Init()', 'Run()'],
        correctAnswer: 'Main()',
        explanation: '`Main()` is the entry point of any C# program.',
      },
      {
        questionText: 'Which keyword is used to inherit a class in C#?',
        options: ['extends', 'implements', 'inherits', ':'],
        correctAnswer: ':',
        explanation: 'In C#, the colon `:` is used to inherit from a base class.',
      },
      {
        questionText: 'Which of the following is a value type in C#?',
        options: ['string', 'object', 'int', 'Array'],
        correctAnswer: 'int',
        explanation: '`int` is a value type in C#.',
      },
      {
        questionText: 'What is the purpose of the `using` statement in C#?',
        options: [
          'To include namespaces',
          'To create instances of classes',
          'To handle exceptions',
          'To manage resource disposal',
        ],
        correctAnswer: 'To manage resource disposal',
        explanation: '`using` ensures that resources are disposed of properly.',
      },
      {
        questionText: 'Which access modifier makes a class member accessible only within its own class?',
        options: ['public', 'private', 'protected', 'internal'],
        correctAnswer: 'private',
        explanation: '`private` access modifier restricts access to within the class itself.',
      },
      {
        questionText: 'What is the size of a `bool` type in C#?',
        options: ['8 bits', '16 bits', '32 bits', 'Not precisely defined'],
        correctAnswer: 'Not precisely defined',
        explanation: 'The `bool` type in C# does not have a specified size.',
      },
      {
        questionText: 'Which interface must be implemented by a class to support iteration in C#?',
        options: ['IEnumerable', 'IEnumerator', 'ICollection', 'IList'],
        correctAnswer: 'IEnumerable',
        explanation: '`IEnumerable` must be implemented to support iteration using `foreach`.',
      },
      {
        questionText: 'What is the correct way to declare a constant in C#?',
        options: ['const int x = 10;', 'constant int x = 10;', 'final int x = 10;', 'readonly int x = 10;'],
        correctAnswer: 'const int x = 10;',
        explanation: '`const` is used to declare a compile-time constant in C#.',
      },
    ],
  },
  {
    title: 'Ruby Programming',
    description: 'Assess your knowledge of Ruby programming language fundamentals.',
    questions: [
      {
        questionText: 'How do you define a method in Ruby?',
        options: [
          'def method_name',
          'function method_name',
          'method method_name',
          'define method_name',
        ],
        correctAnswer: 'def method_name',
        explanation: 'In Ruby, methods are defined using the `def` keyword followed by the method name.',
      },
      {
        questionText: 'What is the symbol syntax for the :symbol in Ruby?',
        options: [':symbol', 'symbol:', 'symbol', 'Symbol::'],
        correctAnswer: ':symbol',
        explanation: 'Symbols in Ruby are prefixed with a colon, e.g., `:symbol`.',
      },
      {
        questionText: 'Which keyword is used to create a new instance of a class in Ruby?',
        options: ['new', 'create', 'init', 'construct'],
        correctAnswer: 'new',
        explanation: '`new` is used to instantiate a new object from a class in Ruby.',
      },
      {
        questionText: 'How do you write a comment in Ruby?',
        options: ['// This is a comment', '# This is a comment', '/* This is a comment */', '<!-- This is a comment -->'],
        correctAnswer: '# This is a comment',
        explanation: 'Comments in Ruby start with a `#` symbol.',
      },
      {
        questionText: 'What is the default return value of a Ruby method?',
        options: ['nil', '0', 'true', 'last evaluated expression'],
        correctAnswer: 'last evaluated expression',
        explanation: 'Ruby methods return the value of the last evaluated expression by default.',
      },
      {
        questionText: 'How do you create an array in Ruby?',
        options: [
          '[1, 2, 3]',
          '(1, 2, 3)',
          '{1, 2, 3}',
          '<1, 2, 3>',
        ],
        correctAnswer: '[1, 2, 3]',
        explanation: 'Arrays in Ruby are created using square brackets with comma-separated values.',
      },
      {
        questionText: 'Which method adds an element to the end of an array in Ruby?',
        options: ['push', 'append', 'add', 'insert'],
        correctAnswer: 'push',
        explanation: '`push` adds one or more elements to the end of an array in Ruby.',
      },
      {
        questionText: 'How do you handle exceptions in Ruby?',
        options: [
          'try-catch',
          'begin-rescue-end',
          'handle-exception',
          'try-except',
        ],
        correctAnswer: 'begin-rescue-end',
        explanation: 'Ruby uses `begin-rescue-end` blocks to handle exceptions.',
      },
      {
        questionText: 'What is the correct way to define a class in Ruby?',
        options: [
          'class MyClass',
          'Class MyClass',
          'def class MyClass',
          'create class MyClass',
        ],
        correctAnswer: 'class MyClass',
        explanation: 'Classes in Ruby are defined using the `class` keyword followed by the class name.',
      },
      {
        questionText: 'Which operator is used to merge two hashes in Ruby?',
        options: ['+', '|', '&', '**'],
        correctAnswer: '|',
        explanation: 'The `|` operator merges two hashes, combining their key-value pairs.',
      },
    ],
  },
  {
    title: 'Go (Golang) Basics',
    description: 'Evaluate your understanding of the Go programming language fundamentals.',
    questions: [
      {
        questionText: 'What is the correct way to declare a variable in Go?',
        options: [
          'var x int',
          'int x',
          'declare x int',
          'x := int',
        ],
        correctAnswer: 'var x int',
        explanation: '`var x int` declares a variable `x` of type `int` in Go.',
      },
      {
        questionText: 'How do you define a constant in Go?',
        options: [
          'const Pi = 3.14',
          'define Pi = 3.14',
          'Pi := 3.14',
          'final Pi = 3.14',
        ],
        correctAnswer: 'const Pi = 3.14',
        explanation: 'Constants in Go are defined using the `const` keyword.',
      },
      {
        questionText: 'Which keyword is used to handle errors in Go?',
        options: ['try', 'catch', 'error', 'if'],
        correctAnswer: 'if',
        explanation: 'Errors in Go are handled using `if` statements to check returned error values.',
      },
      {
        questionText: 'How do you start a for loop in Go?',
        options: [
          'for i := 0; i < 5; i++ {',
          'for (i = 0; i < 5; i++) {',
          'loop for i = 0 to 5 {',
          'foreach i in 0..5 {',
        ],
        correctAnswer: 'for i := 0; i < 5; i++ {',
        explanation: 'The correct syntax for a for loop in Go is `for i := 0; i < 5; i++ {`.',
      },
      {
        questionText: 'What is the default value of a string in Go?',
        options: ['null', 'nil', '""', '"undefined"'],
        correctAnswer: '""',
        explanation: 'The default value of a string in Go is an empty string `""`.',
      },
      {
        questionText: 'Which data structure is used to implement a queue in Go?',
        options: ['Array', 'Slice', 'Map', 'Struct'],
        correctAnswer: 'Slice',
        explanation: 'Slices are commonly used to implement queues in Go due to their dynamic size.',
      },
      {
        questionText: 'How do you define a function that returns two values in Go?',
        options: [
          'func add(a int, b int) (int, int) {',
          'func add(a int, b int) int, int {',
          'def add(a int, b int) (int, int) {',
          'function add(a int, b int) (int, int) {',
        ],
        correctAnswer: 'func add(a int, b int) (int, int) {',
        explanation: 'Functions in Go can return multiple values by specifying them in parentheses.',
      },
      {
        questionText: 'What is the keyword used to create a new goroutine?',
        options: ['thread', 'go', 'async', 'concurrent'],
        correctAnswer: 'go',
        explanation: 'The `go` keyword is used to start a new goroutine in Go.',
      },
      {
        questionText: 'Which package is used for formatted I/O in Go?',
        options: ['fmt', 'io', 'bufio', 'print'],
        correctAnswer: 'fmt',
        explanation: 'The `fmt` package provides I/O formatting functions in Go.',
      },
      {
        questionText: 'How do you handle exceptions in Go?',
        options: [
          'try-catch',
          'panic-recover',
          'throw-catch',
          'handle-exception',
        ],
        correctAnswer: 'panic-recover',
        explanation: 'Go uses `panic` to raise exceptions and `recover` to handle them.',
      },
    ],
  },
  {
    title: 'PHP Essentials',
    description: 'Test your understanding of core PHP programming concepts.',
    questions: [
      {
        questionText: 'What does PHP stand for?',
        options: [
          'Personal Home Page',
          'PHP: Hypertext Preprocessor',
          'Private Home Page',
          'Professional HTML Processor',
        ],
        correctAnswer: 'PHP: Hypertext Preprocessor',
        explanation: 'PHP stands for PHP: Hypertext Preprocessor.',
      },
      {
        questionText: 'Which symbol is used to declare a variable in PHP?',
        options: ['&', '$', '@', '#'],
        correctAnswer: '$',
        explanation: 'Variables in PHP are declared using the `$` symbol.',
      },
      {
        questionText: 'How do you start a PHP block of code?',
        options: [
          '<php>',
          '<?php',
          '<?',
          '<script>',
        ],
        correctAnswer: '<?php',
        explanation: 'PHP code blocks start with `<?php`.',
      },
      {
        questionText: 'Which function is used to output text in PHP?',
        options: ['echo', 'print', 'printf', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: '`echo`, `print`, and `printf` can all be used to output text in PHP.',
      },
      {
        questionText: 'Which superglobal variable holds form data in PHP sent via POST method?',
        options: ['$POST', '$_POST', '$_POST[]', '$_POST[]'],
        correctAnswer: '$_POST',
        explanation: '`$_POST` is the superglobal variable that holds form data sent via POST method.',
      },
      {
        questionText: 'How do you create an array in PHP?',
        options: [
          'array = (1, 2, 3)',
          'array = [1, 2, 3]',
          '$array = array(1, 2, 3)',
          '$array = {1, 2, 3}',
        ],
        correctAnswer: '$array = array(1, 2, 3)',
        explanation: 'Arrays in PHP are created using the `array()` function or the `[]` syntax.',
      },
      {
        questionText: 'Which loop is guaranteed to execute at least once in PHP?',
        options: ['for', 'while', 'do-while', 'foreach'],
        correctAnswer: 'do-while',
        explanation: '`do-while` loop executes the block of code once before checking the condition.',
      },
      {
        questionText: 'Which operator is used to concatenate two strings in PHP?',
        options: ['+', '.', '&&', '|'],
        correctAnswer: '.',
        explanation: 'The `.` operator is used to concatenate two strings in PHP.',
      },
      {
        questionText: 'How do you declare a constant in PHP?',
        options: [
          'const PI = 3.14;',
          'define("PI", 3.14);',
          'constant("PI", 3.14);',
          'Both a and b',
        ],
        correctAnswer: 'Both a and b',
        explanation: 'Constants in PHP can be declared using `const` or the `define()` function.',
      },
      {
        questionText: 'Which function is used to include and evaluate a specified file in PHP?',
        options: ['include()', 'require()', 'import()', 'load()'],
        correctAnswer: 'include()',
        explanation: '`include()` is used to include and evaluate a specified file in PHP.',
      },
    ],
  },
  {
    title: 'TypeScript Basics',
    description: 'Assess your understanding of fundamental TypeScript programming concepts.',
    questions: [
      {
        questionText: 'What is TypeScript?',
        options: [
          'A superset of JavaScript that adds static typing',
          'A framework for building mobile apps',
          'A database management system',
          'A CSS preprocessor',
        ],
        correctAnswer: 'A superset of JavaScript that adds static typing',
        explanation: 'TypeScript is a superset of JavaScript that introduces static typing and other features.',
      },
      {
        questionText: 'How do you define an interface in TypeScript?',
        options: [
          'interface Person { name: string; age: number; }',
          'interface Person = { name: string; age: number; }',
          'type Person = { name: string; age: number; }',
          'class Person { name: string; age: number; }',
        ],
        correctAnswer: 'interface Person { name: string; age: number; }',
        explanation: 'Interfaces in TypeScript are defined using the `interface` keyword followed by the structure.',
      },
      {
        questionText: 'Which command compiles a TypeScript file into JavaScript?',
        options: ['tsc', 'tscompile', 'typescript', 'compile-ts'],
        correctAnswer: 'tsc',
        explanation: '`tsc` is the TypeScript compiler command that converts `.ts` files to `.js` files.',
      },
      {
        questionText: 'How do you make a property optional in a TypeScript interface?',
        options: [
          'Add a `?` after the property name',
          'Use the `optional` keyword',
          'Set the property to `null` by default',
          'Properties cannot be optional',
        ],
        correctAnswer: 'Add a `?` after the property name',
        explanation: 'Appending a `?` to the property name makes it optional in an interface.',
      },
      {
        questionText: 'What is the type of `null` and `undefined` in TypeScript by default?',
        options: [
          'object and undefined respectively',
          'any and any respectively',
          'null and undefined respectively',
          'never and never respectively',
        ],
        correctAnswer: 'object and undefined respectively',
        explanation: 'In TypeScript, `typeof null` returns "object" and `typeof undefined` returns "undefined".',
      },
      {
        questionText: 'How do you declare a tuple in TypeScript?',
        options: [
          'let tuple: [string, number] = ["hello", 10];',
          'let tuple = ["hello", 10];',
          'let tuple: tuple = ("hello", 10);',
          'let tuple: [string, number] = ("hello", 10);',
        ],
        correctAnswer: 'let tuple: [string, number] = ["hello", 10];',
        explanation: 'Tuples are declared with a specific type and length, using square brackets.',
      },
      {
        questionText: 'Which keyword is used to inherit a class in TypeScript?',
        options: ['extends', 'implements', 'inherits', 'super'],
        correctAnswer: 'extends',
        explanation: '`extends` is used to inherit from a base class in TypeScript.',
      },
      {
        questionText: 'How do you define a generic function in TypeScript?',
        options: [
          'function identity<T>(arg: T): T { return arg; }',
          'function identity(arg: T): T { return arg; }',
          'function identity(arg: any): any { return arg; }',
          'function<T> identity(arg: T): T { return arg; }',
        ],
        correctAnswer: 'function identity<T>(arg: T): T { return arg; }',
        explanation: 'Generics are defined using angle brackets with a type parameter, e.g., `<T>`.',
      },
      {
        questionText: 'Which type assertion syntax is correct in TypeScript?',
        options: [
          'let someValue: any = "this is a string"; let strLength: number = someValue.length;',
          'let someValue: any = "this is a string"; let strLength: number = (<string>someValue).length;',
          'let someValue: any = "this is a string"; let strLength: number = (someValue as string).length;',
          'Both b and c are correct',
        ],
        correctAnswer: 'Both b and c are correct',
        explanation: 'Type assertions can be done using either `<type>` or `as type` syntax.',
      },
      {
        questionText: 'What is the purpose of the `readonly` modifier in TypeScript?',
        options: [
          'To make a property accessible only within its class',
          'To prevent a property from being modified after initialization',
          'To allow a property to be modified only once',
          'To enforce type checking on a property',
        ],
        correctAnswer: 'To prevent a property from being modified after initialization',
        explanation: 'The `readonly` modifier ensures that a property cannot be reassigned after its initial assignment.',
      },
      {
        questionText: 'Which compiler option enables strict type-checking in TypeScript?',
        options: [
          '--strict',
          '--noImplicitAny',
          '--strictNullChecks',
          'All of the above',
        ],
        correctAnswer: 'All of the above',
        explanation: 'All listed compiler options contribute to stricter type-checking in TypeScript.',
      },
    ],
  },
  {
    title: 'Swift Programming',
    description: 'Evaluate your understanding of core Swift programming concepts.',
    questions: [
      {
        questionText: 'What is the correct way to declare a variable in Swift?',
        options: [
          'var name: String',
          'variable name: String',
          'let name: String',
          'declare var name: String',
        ],
        correctAnswer: 'var name: String',
        explanation: '`var name: String` declares a mutable variable in Swift.',
      },
      {
        questionText: 'Which keyword is used to define a constant in Swift?',
        options: ['var', 'let', 'const', 'static'],
        correctAnswer: 'let',
        explanation: '`let` is used to declare constants in Swift.',
      },
      {
        questionText: 'How do you handle errors in Swift?',
        options: [
          'try-catch',
          'do-try-catch',
          'begin-rescue',
          'throw-catch',
        ],
        correctAnswer: 'do-try-catch',
        explanation: 'Swift uses `do-try-catch` blocks to handle errors.',
      },
      {
        questionText: 'Which of the following is used to define a class in Swift?',
        options: [
          'class MyClass {}',
          'struct MyClass {}',
          'object MyClass {}',
          'define MyClass {}',
        ],
        correctAnswer: 'class MyClass {}',
        explanation: 'Classes in Swift are defined using the `class` keyword.',
      },
      {
        questionText: 'What is the default access level for properties and methods in Swift?',
        options: ['public', 'private', 'internal', 'fileprivate'],
        correctAnswer: 'internal',
        explanation: 'The default access level in Swift is `internal`, which allows access within the same module.',
      },
      {
        questionText: 'How do you declare an optional variable in Swift?',
        options: [
          'var name: String?',
          'var name: Optional<String>',
          'Both a and b',
          'var name: String!',
        ],
        correctAnswer: 'Both a and b',
        explanation: 'Optional variables can be declared using `?` or `Optional<>` syntax.',
      },
      {
        questionText: 'Which operator is used to unwrap an optional in Swift?',
        options: ['!', '?', '&', '|'],
        correctAnswer: '!',
        explanation: '`!` is the force unwrap operator used to extract the value from an optional.',
      },
      {
        questionText: 'What is a protocol in Swift?',
        options: [
          'A blueprint of methods, properties, and other requirements for a class, struct, or enum',
          'A type of class that cannot be inherited',
          'A way to handle errors',
          'A built-in data type',
        ],
        correctAnswer: 'A blueprint of methods, properties, and other requirements for a class, struct, or enum',
        explanation: 'Protocols define a blueprint of methods, properties, and other requirements that suit a particular task or piece of functionality.',
      },
      {
        questionText: 'Which method is called when a class is instantiated in Swift?',
        options: ['init()', 'start()', 'construct()', 'setup()'],
        correctAnswer: 'init()',
        explanation: '`init()` is the initializer method called when a class instance is created.',
      },
      {
        questionText: 'How do you inherit from a superclass in Swift?',
        options: [
          'class SubClass: SuperClass {}',
          'class SubClass < SuperClass {}',
          'class SubClass extends SuperClass {}',
          'class SubClass inherits SuperClass {}',
        ],
        correctAnswer: 'class SubClass: SuperClass {}',
        explanation: 'Inheritance in Swift is denoted using the colon `:` followed by the superclass name.',
      },
    ],
  },
  // You can add more quizzes for other languages here following the same structure
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await Quiz.deleteMany({});
    await Question.deleteMany({});
    console.log('Existing quizzes and questions removed');

    for (const quizData of quizzes) {
      const { title, description, questions } = quizData;
      const questionIds = [];

      for (const questionData of questions) {
        // Ensure correctAnswer is among the options
        if (!questionData.options.includes(questionData.correctAnswer)) {
          console.error(
            `Correct answer "${questionData.correctAnswer}" not in options for question "${questionData.questionText}"`
          );
          continue; // Skip this question
        }

        const question = new Question(questionData);
        await question.save();
        questionIds.push(question._id);
      }

      const quiz = new Quiz({
        title,
        description,
        questions: questionIds,
      });

      await quiz.save();
      console.log(`Quiz "${title}" created`);
    }

    console.log('Database seeding completed');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
