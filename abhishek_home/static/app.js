const chapters = [
  {
    title: "Getting Started",
    topics: ["print()", "Comments", "Expressions"],
    summary: "Meet Python, run your first instructions, and learn how the interpreter reads a program from top to bottom.",
    concepts: [
      ["Python runs your instructions", "Write one statement per line. Python starts at the top and works downward."],
      ["Use print() to show a result", "Put text inside quotes. print() can also display numbers and several values."],
      ["Comments are notes", "Start a comment with #. Python ignores the rest of that line."]
    ],
    examples: [
      {
        title: "Say hello",
        code: `print("Hello, Python!")`,
        output: `Hello, Python!`,
        explanation: "print() sends the text inside the quotes to the output."
      },
      {
        title: "Print several values",
        code: `print("Python", "is", "fun!", sep=" · ")`,
        output: `Python · is · fun!`,
        explanation: "print() separates values with a space by default. The sep argument lets you choose another separator."
      },
      {
        title: "Add a helpful comment",
        code: `# This line is for the reader, not the computer
print("Comments make code easier to follow")`,
        output: `Comments make code easier to follow`,
        explanation: "The interpreter skips the line that begins with # and runs the print statement."
      },
      {
        title: "Let Python do the arithmetic",
        code: `print(8 + 4 * 2)
print((8 + 4) * 2)`,
        output: `16
24`,
        explanation: "Multiplication happens before addition. Parentheses make the order explicit."
      }
    ],
    quiz: {
      prompt: "What does this program display?",
      code: `print("Py", "thon", sep="")`,
      options: ["Py thon", "Python", "Py, thon"],
      correct: 1,
      explanation: "sep=\"\" joins the two printed values without anything between them."
    }
  },
  {
    title: "Variables and Data Types",
    topics: ["Variables", "int / float / str", "Booleans"],
    summary: "Store information in named variables and recognize Python's everyday data types.",
    concepts: [
      ["Names point to values", "Use = to assign a value. Choose readable names like student_name."],
      ["Types describe values", "Common built-in types include int, float, str, and bool."],
      ["Names are case-sensitive", "score, Score, and SCORE are three different names."]
    ],
    examples: [
      {
        title: "Create and use a variable",
        code: `student_name = "Aarav"
print("Welcome,", student_name)`,
        output: `Welcome, Aarav`,
        explanation: "The name student_name refers to the string \"Aarav\", so it can be reused later."
      },
      {
        title: "Check a value's type",
        code: `age = 15
height = 1.62
print(type(age).__name__)
print(type(height).__name__)`,
        output: `int
float`,
        explanation: "Whole numbers are usually int values; numbers with a decimal point are float values."
      },
      {
        title: "Store a yes-or-no value",
        code: `is_learning = True
finished_lesson = False
print(is_learning)
print(type(finished_lesson).__name__)`,
        output: `True
bool`,
        explanation: "A Boolean stores one of two values: True or False. Capitalization matters."
      },
      {
        title: "Swap two values",
        code: `left, right = "sun", "moon"
left, right = right, left
print(left, right)`,
        output: `moon sun`,
        explanation: "Python can unpack the two values on the right into the two names on the left."
      }
    ],
    quiz: {
      prompt: "What is the type of 7.0?",
      code: `print(type(7.0).__name__)`,
      options: ["int", "float", "str"],
      correct: 1,
      explanation: "A number written with a decimal point is a float, even when its value is a whole number."
    }
  },
  {
    title: "Input and Conversion",
    topics: ["input()", "int() / float()", "split()"],
    summary: "Collect text from a user and convert it to numbers when your program needs to calculate.",
    concepts: [
      ["input() returns text", "Even if someone types digits, input() gives your program a string."],
      ["Convert before calculating", "Use int() for whole numbers and float() for decimal numbers."],
      ["Validate real-world input", "Users can type unexpected values. Later chapters show how to handle that safely."]
    ],
    examples: [
      {
        title: "Ask for a name",
        code: `name = input("Name: ")
print("Hello,", name)`,
        output: `Name: Mira
Hello, Mira`,
        explanation: "The user types Mira after the prompt. input() stores those characters in name."
      },
      {
        title: "Convert input to an integer",
        code: `age = int(input("Age: "))
print("Next year:", age + 1)`,
        output: `Age: 15
Next year: 16`,
        explanation: "int() converts the text \"15\" to the number 15, so addition is numeric."
      },
      {
        title: "Work with decimal input",
        code: `price = float(input("Price: "))
print(f"With tax: {price * 1.05:.2f}")`,
        output: `Price: 20
With tax: 21.00`,
        explanation: "float() accepts decimal values. The format specifier :.2f displays two digits after the decimal point."
      },
      {
        title: "Read two numbers from one line",
        code: `first, second = map(int, input("Two numbers: ").split())
print(first + second)`,
        output: `Two numbers: 4 7
11`,
        explanation: "split() separates the input at spaces, map(int, ...) converts each piece, and the two values are unpacked."
      }
    ],
    quiz: {
      prompt: "What does int(input()) return when the user types 8?",
      code: `value = int(input())
print(value + 2)`,
      options: ["82", "10", "An error every time"],
      correct: 1,
      explanation: "int() converts the typed text to the integer 8, then Python adds 2."
    }
  },
  {
    title: "Operators",
    topics: ["Arithmetic", "Comparison", "Logic"],
    summary: "Use arithmetic, comparison, and logical operators to calculate values and make decisions.",
    concepts: [
      ["Arithmetic operators", "+, -, *, /, //, %, and ** perform common calculations."],
      ["Comparisons return Booleans", "Expressions such as score >= 50 evaluate to True or False."],
      ["Combine conditions", "and, or, and not let you build larger logical tests."]
    ],
    examples: [
      {
        title: "Compare division operators",
        code: `print(7 / 2)
print(7 // 2)
print(7 % 2)`,
        output: `3.5
3
1`,
        explanation: "/ gives regular division, // gives the whole-number quotient, and % gives the remainder."
      },
      {
        title: "Raise a number to a power",
        code: `print(2 ** 5)
print(9 ** 0.5)`,
        output: `32
3.0`,
        explanation: "** is Python's exponent operator. Raising 9 to 0.5 calculates its square root."
      },
      {
        title: "Compare values",
        code: `temperature = 24
print(temperature > 20)
print(temperature == 24)`,
        output: `True
True`,
        explanation: "Comparison operators produce Boolean results. Use == to compare; a single = assigns."
      },
      {
        title: "Combine conditions",
        code: `age = 16
has_ticket = True
print(age >= 13 and has_ticket)`,
        output: `True`,
        explanation: "The full expression is True only when both sides of and are True."
      }
    ],
    quiz: {
      prompt: "What is the result of 10 // 3?",
      code: `print(10 // 3)`,
      options: ["3.333...", "3", "1"],
      correct: 1,
      explanation: "// returns the floor-division result, which is 3 for these positive values."
    }
  },
  {
    title: "Strings",
    topics: ["Indexing", "Slicing", "String methods"],
    summary: "Work with text using indexing, slices, useful methods, and readable formatted strings.",
    concepts: [
      ["Strings are ordered text", "Use an index to read one character. The first index is 0."],
      ["Slices select a range", "text[start:stop] includes start and stops before stop."],
      ["Methods return useful results", "Methods like lower(), strip(), and replace() help transform text."]
    ],
    examples: [
      {
        title: "Read a character and a slice",
        code: `word = "Python"
print(word[0])
print(word[1:4])
print(word[-1])`,
        output: `P
yth
n`,
        explanation: "Negative indices count from the end. A slice includes the start index but not the stop index."
      },
      {
        title: "Clean up user text",
        code: `message = "  Hello, World!  "
clean = message.strip().lower()
print(clean)`,
        output: `hello, world!`,
        explanation: "strip() removes surrounding whitespace; lower() returns a lowercase version."
      },
      {
        title: "Replace part of a string",
        code: `sentence = "I like tea"
print(sentence.replace("tea", "coffee"))`,
        output: `I like coffee`,
        explanation: "replace(old, new) returns a new string with matching text changed; the original stays the same."
      },
      {
        title: "Build a message with an f-string",
        code: `name = "Leela"
points = 12
print(f"{name} scored {points} points.")`,
        output: `Leela scored 12 points.`,
        explanation: "An f-string evaluates expressions inside curly braces and inserts their values into the text."
      }
    ],
    quiz: {
      prompt: "What does this slice produce?",
      code: `print("Python"[1:4])`,
      options: ["Pyt", "yth", "ytho"],
      correct: 1,
      explanation: "The slice starts at index 1 and stops before index 4, selecting y, t, and h."
    }
  },
  {
    title: "Conditionals",
    topics: ["if / elif / else", "Indentation", "Nested conditions"],
    summary: "Choose which code to run by testing conditions and organizing branches with indentation.",
    concepts: [
      ["if checks a condition", "The indented block runs only when the condition is True."],
      ["elif adds another case", "Python checks elif branches in order and runs the first matching block."],
      ["else is the fallback", "Use else when none of the earlier conditions matched."]
    ],
    examples: [
      {
        title: "Choose a branch",
        code: `number = -3
if number > 0:
    print("positive")
elif number < 0:
    print("negative")
else:
    print("zero")`,
        output: `negative`,
        explanation: "Python tests number > 0, then number < 0. The second condition is True, so its block runs."
      },
      {
        title: "Assign a letter grade",
        code: `score = 84
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "Keep practicing"
print(grade)`,
        output: `B`,
        explanation: "The score is below 90 but at least 80, so the second branch assigns B."
      },
      {
        title: "Check two conditions together",
        code: `age = 17
has_permission = True
if age >= 16 and has_permission:
    print("You can join")
else:
    print("Not yet")`,
        output: `You can join`,
        explanation: "Both conditions joined by and must be True for the first block to run."
      },
      {
        title: "Use membership in a condition",
        code: `language = "Python"
if "Py" in language:
    print("Python starts with Py")
else:
    print("No match")`,
        output: `Python starts with Py`,
        explanation: "The in operator checks whether one string occurs inside another."
      }
    ],
    quiz: {
      prompt: "What is printed when score is 72?",
      code: `score = 72
if score >= 80:
    print("B")
elif score >= 60:
    print("C")
else:
    print("Keep practicing")`,
      options: ["B", "C", "Keep practicing"],
      correct: 1,
      explanation: "72 is less than 80 but at least 60, so the elif branch prints C."
    }
  },
  {
    title: "Loops",
    topics: ["for", "while", "range()"],
    summary: "Repeat actions with for and while loops, and use range() to count without writing the same code again.",
    concepts: [
      ["for visits each item", "A for loop repeats once for every item in a sequence."],
      ["range() creates a counting sequence", "range(start, stop, step) stops before the stop value."],
      ["while repeats while True", "Update the condition inside the loop so it eventually becomes False."]
    ],
    examples: [
      {
        title: "Count with range()",
        code: `for number in range(1, 5):
    print(number)`,
        output: `1
2
3
4`,
        explanation: "The stop value 5 is excluded, so range(1, 5) produces 1, 2, 3, and 4."
      },
      {
        title: "Loop through a word",
        code: `for letter in "cat":
    print(letter.upper())`,
        output: `C
A
T`,
        explanation: "A string is iterable, so the loop receives one character at a time."
      },
      {
        title: "Add numbers with a while loop",
        code: `total = 0
number = 1
while number <= 4:
    total += number
    number += 1
print(total)`,
        output: `10`,
        explanation: "The loop adds 1, 2, 3, and 4. Increasing number makes the condition eventually False."
      },
      {
        title: "Stop when you find a match",
        code: `for number in range(1, 8):
    if number * number > 20:
        print(number)
        break`,
        output: `5`,
        explanation: "break immediately exits the loop when the first square greater than 20 is found."
      }
    ],
    quiz: {
      prompt: "Which values are printed?",
      code: `for n in range(2, 7, 2):
    print(n)`,
      options: ["2, 4, 6", "2, 4, 6, 8", "2, 3, 4, 5, 6"],
      correct: 0,
      explanation: "The step is 2 and the stop value 7 is excluded, so the loop prints 2, 4, and 6."
    }
  },
  {
    title: "Lists and Tuples",
    topics: ["Lists", "Tuples", "Comprehensions"],
    summary: "Group values into ordered collections, update lists, and use tuples for fixed collections of related values.",
    concepts: [
      ["Lists can change", "Append, remove, or update list items after creating a list."],
      ["Tuples are fixed sequences", "Use a tuple when the collection should not be changed."],
      ["Comprehensions build lists", "A list comprehension creates a new list from an iterable in one readable expression."]
    ],
    examples: [
      {
        title: "Create and update a list",
        code: `colors = ["red", "blue"]
colors.append("green")
colors[0] = "orange"
print(colors)`,
        output: `['orange', 'blue', 'green']`,
        explanation: "append() adds an item at the end. Index assignment changes an existing list item."
      },
      {
        title: "Select part of a list",
        code: `scores = [72, 85, 91, 68]
print(scores[1:3])
print(len(scores))`,
        output: `[85, 91]
4`,
        explanation: "The slice takes indices 1 and 2. len() counts all the elements."
      },
      {
        title: "Build a list with a comprehension",
        code: `squares = [number ** 2 for number in range(1, 5)]
print(squares)`,
        output: `[1, 4, 9, 16]`,
        explanation: "The expression before for is evaluated once for each number from 1 through 4."
      },
      {
        title: "Unpack a tuple",
        code: `dimensions = (640, 480)
width, height = dimensions
print(f"{width} by {height}")`,
        output: `640 by 480`,
        explanation: "Tuple unpacking assigns the first item to width and the second to height."
      }
    ],
    quiz: {
      prompt: "What is printed after the append?",
      code: `items = [1, 2]
items.append(3)
print(items)`,
      options: ["[1, 2]", "[3, 1, 2]", "[1, 2, 3]"],
      correct: 2,
      explanation: "append(3) adds 3 to the end of the existing list."
    }
  },
  {
    title: "Dictionaries and Sets",
    topics: ["Key-value pairs", "Set uniqueness", "Set operations"],
    summary: "Use dictionaries to look up values by key and sets to keep unique items or compare groups.",
    concepts: [
      ["Dictionaries map keys to values", "Use a key such as \"name\" or \"score\" to look up its value."],
      ["get() handles missing keys", "dict.get(key, default) returns a fallback instead of raising KeyError."],
      ["Sets contain unique items", "A set removes duplicates and supports union and intersection."]
    ],
    examples: [
      {
        title: "Read and update a dictionary",
        code: `person = {"name": "Nia", "city": "Jaipur"}
person["city"] = "Kota"
print(person["name"], person["city"])`,
        output: `Nia Kota`,
        explanation: "Use a key in square brackets to read or replace its value."
      },
      {
        title: "Provide a default with get()",
        code: `prices = {"tea": 20}
print(prices.get("coffee", 0))`,
        output: `0`,
        explanation: "There is no coffee key, so get() returns the default value 0."
      },
      {
        title: "Loop through dictionary entries",
        code: `marks = {"Asha": 88, "Dev": 92}
for name, score in marks.items():
    print(f"{name}: {score}")`,
        output: `Asha: 88
Dev: 92`,
        explanation: "items() gives each key-value pair, which can be unpacked into name and score."
      },
      {
        title: "Find unique values and overlap",
        code: `club_a = {"art", "music", "chess"}
club_b = {"music", "robotics"}
print(sorted(club_a | club_b))
print(sorted(club_a & club_b))`,
        output: `['art', 'chess', 'music', 'robotics']
['music']`,
        explanation: "| joins the sets; & finds values present in both. sorted() makes the displayed order predictable."
      }
    ],
    quiz: {
      prompt: "What does get() return when a key is missing?",
      code: `settings = {}
print(settings.get("theme", "light"))`,
      options: ["None every time", "light", "KeyError"],
      correct: 1,
      explanation: "The second argument is the default value, so get() returns \"light\"."
    }
  },
  {
    title: "Functions",
    topics: ["def", "Parameters", "return"],
    summary: "Package reusable steps into functions, pass information through parameters, and return results to the caller.",
    concepts: [
      ["def creates a function", "The indented function body runs when the function is called."],
      ["Parameters receive inputs", "Pass values as arguments when calling a function."],
      ["return sends a result back", "A returned value can be stored, printed, or used in another calculation."]
    ],
    examples: [
      {
        title: "Write a greeting function",
        code: `def greet(name):
    print(f"Hello, {name}!")

greet("Ravi")`,
        output: `Hello, Ravi!`,
        explanation: "name is a parameter. Calling greet(\"Ravi\") passes the string Ravi into the function."
      },
      {
        title: "Return a calculation",
        code: `def area_rectangle(width, height):
    return width * height

area = area_rectangle(5, 3)
print(area)`,
        output: `15`,
        explanation: "return sends the product back to the caller, which stores it in area."
      },
      {
        title: "Use a default parameter",
        code: `def make_tag(text, tag="p"):
    return f"<{tag}>{text}</{tag}>"

print(make_tag("Hello"))
print(make_tag("Title", "h1"))`,
        output: `<p>Hello</p>
<h1>Title</h1>`,
        explanation: "If tag is omitted, its default is p. Passing h1 overrides that default."
      },
      {
        title: "Return a Boolean answer",
        code: `def is_even(number):
    return number % 2 == 0

print(is_even(14))
print(is_even(9))`,
        output: `True
False`,
        explanation: "The comparison after return evaluates to True for even numbers and False otherwise."
      }
    ],
    quiz: {
      prompt: "What does double(4) return?",
      code: `def double(number):
    return number * 2

print(double(4))`,
      options: ["4", "8", "None"],
      correct: 1,
      explanation: "The function multiplies its argument by 2 and returns the result, 8."
    }
  },
  {
    title: "Modules and Files",
    topics: ["import", "Standard library", "with open()"],
    summary: "Reuse code from Python's standard library and read or write files with a context manager.",
    concepts: [
      ["Modules organize reusable code", "import a module or selected names from it to use its features."],
      ["The standard library is included", "Modules such as math, statistics, and pathlib are available with Python."],
      ["with manages files safely", "A with block closes the file automatically when the block ends."]
    ],
    examples: [
      {
        title: "Import a useful math function",
        code: `from math import sqrt
print(sqrt(81))`,
        output: `9.0`,
        explanation: "from math import sqrt makes sqrt available by name. Its result is a floating-point number."
      },
      {
        title: "Use a standard-library statistic",
        code: `from statistics import mean
scores = [70, 80, 90]
print(mean(scores))`,
        output: `80`,
        explanation: "The statistics module provides common calculations such as the arithmetic mean."
      },
      {
        title: "Write text to a file",
        code: `with open("note.txt", "w", encoding="utf-8") as file:
    file.write("Practice a little each day.")
print("Saved note.txt")`,
        output: `Saved note.txt`,
        explanation: "Mode w creates or replaces the file. The with block closes it even if an error occurs."
      },
      {
        title: "Read text from a file",
        code: `with open("note.txt", encoding="utf-8") as file:
    message = file.read()
print(message)`,
        output: `Practice a little each day.`,
        explanation: "With no mode specified, open() reads the file. Run the write example first to create note.txt."
      }
    ],
    quiz: {
      prompt: "What does a with open(...) block do when it finishes?",
      code: `with open("note.txt", encoding="utf-8") as file:
    text = file.read()`,
      options: ["Deletes the file", "Closes the file automatically", "Imports the file as a module"],
      correct: 1,
      explanation: "The context manager closes the file as the with block exits."
    }
  },
  {
    title: "Errors and Debugging",
    topics: ["Syntax errors", "Exceptions", "try / except"],
    summary: "Read error messages, handle expected problems, and use small debugging steps to find the cause of a bug.",
    concepts: [
      ["Syntax errors stop parsing", "Check spelling, quotes, colons, parentheses, and indentation first."],
      ["Exceptions happen at runtime", "Invalid input or a missing key can raise an exception while code runs."],
      ["Catch only what you can handle", "Use a specific except clause and give a useful next step."]
    ],
    examples: [
      {
        title: "Handle invalid number input",
        code: `text = "twenty"
try:
    age = int(text)
    print(age)
except ValueError:
    print("Please enter digits.")`,
        output: `Please enter digits.`,
        explanation: "int(\"twenty\") raises ValueError. The matching except block handles that expected input problem."
      },
      {
        title: "Handle a missing dictionary key",
        code: `scores = {"Mina": 91}
try:
    print(scores["Ravi"])
except KeyError:
    print("No score found")`,
        output: `No score found`,
        explanation: "Accessing a missing key with square brackets raises KeyError, which this code handles."
      },
      {
        title: "Use else and finally",
        code: `try:
    result = 12 / 3
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print(result)
finally:
    print("Done")`,
        output: `4.0
Done`,
        explanation: "else runs when no exception occurred. finally runs whether there was an exception or not."
      },
      {
        title: "Debug with a small print",
        code: `prices = [5, 8, 12]
total = sum(prices)
print("Debug total:", total)
print("Average:", total / len(prices))`,
        output: `Debug total: 25
Average: 8.333333333333334`,
        explanation: "Printing an intermediate value helps check the calculation before adding more code."
      }
    ],
    quiz: {
      prompt: "Which exception should you catch when int(\"hello\") fails?",
      code: `int("hello")`,
      options: ["ValueError", "KeyError", "NameError"],
      correct: 0,
      explanation: "The text is not a valid integer representation, so int() raises ValueError."
    }
  },
  {
    title: "Classes and Objects",
    topics: ["class", "__init__", "Methods"],
    summary: "Create your own types by combining data and behavior in classes, then make objects from those classes.",
    concepts: [
      ["A class defines a type", "It describes the data and methods that its objects will have."],
      ["__init__ sets up an object", "Python calls this method when you create a new instance."],
      ["self refers to this object", "Use self to read or update the instance's attributes and call its methods."]
    ],
    examples: [
      {
        title: "Create a simple class",
        code: `class Dog:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return f"{self.name} says woof!"

pet = Dog("Pip")
print(pet.speak())`,
        output: `Pip says woof!`,
        explanation: "Dog(\"Pip\") creates an object. __init__ stores Pip on that object, and speak() uses it."
      },
      {
        title: "Add a calculation method",
        code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

shape = Rectangle(4, 6)
print(shape.area())`,
        output: `24`,
        explanation: "The instance stores width and height. Its area() method uses those values to calculate the result."
      },
      {
        title: "Create multiple independent objects",
        code: `class Counter:
    def __init__(self, start=0):
        self.value = start

    def add_one(self):
        self.value += 1

first = Counter()
second = Counter(10)
first.add_one()
print(first.value, second.value)`,
        output: `1 10`,
        explanation: "Each object has its own value. Updating first does not change second."
      },
      {
        title: "Extend a class with inheritance",
        code: `class Animal:
    def move(self):
        return "moving"

class Bird(Animal):
    def move(self):
        return "flying"

print(Bird().move())`,
        output: `flying`,
        explanation: "Bird inherits from Animal and overrides move() with behavior of its own."
      }
    ],
    quiz: {
      prompt: "What does self refer to inside an instance method?",
      code: `class Box:
    def __init__(self, size):
        self.size = size`,
      options: ["The current object", "The class's file name", "A Python keyword for a number"],
      correct: 0,
      explanation: "self is the conventional name for the current instance, allowing methods to access its attributes."
    }
  }
];

const chapterList = document.querySelector("#chapter-list");
const content = document.querySelector("#chapter-content");
const searchInput = document.querySelector("#chapter-search");
const progressCount = document.querySelector("#progress-count");
const progressFill = document.querySelector("#progress-fill");
const progressRing = document.querySelector("#progress-ring");
const progressSummary = document.querySelector("#progress-summary");
const chapterCount = document.querySelector("#chapter-count");

const storageKey = "pysteps-reviewed-chapters";
const reviewedChapters = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
let activeChapter = 0;
let visibleChapters = chapters.map((_, index) => index);

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function updateProgress() {
  const completed = reviewedChapters.size;
  const percentage = (completed / chapters.length) * 100;
  progressCount.textContent = `${completed}/${chapters.length}`;
  progressRing.setAttribute("aria-label", `${completed} of ${chapters.length} chapters reviewed`);
  progressFill.style.width = `${percentage}%`;
  progressSummary.textContent = completed
    ? `${completed} of ${chapters.length} chapters reviewed`
    : "Choose your first chapter";
}

function renderChapterList() {
  chapterCount.textContent = String(visibleChapters.length);
  chapterList.innerHTML = "";

  if (!visibleChapters.length) {
    const empty = document.createElement("p");
    empty.className = "empty-results";
    empty.textContent = "No chapters match that search. Try another word.";
    chapterList.append(empty);
    return;
  }

  visibleChapters.forEach((index) => {
    const chapter = chapters[index];
    const button = document.createElement("button");
    button.className = `chapter-button${reviewedChapters.has(index) ? " is-complete" : ""}`;
    button.type = "button";
    button.setAttribute("aria-current", index === activeChapter ? "page" : "false");
    button.innerHTML = `<span class="chapter-number">${String(index + 1).padStart(2, "0")}</span><span class="chapter-label">${escapeHTML(chapter.title)}</span>`;
    button.addEventListener("click", () => {
      activeChapter = index;
      renderChapterList();
      renderChapter();
      if (window.matchMedia("(max-width: 700px)").matches) {
        content.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    chapterList.append(button);
  });
}

function renderChapter() {
  const chapter = chapters[activeChapter];
  const isReviewed = reviewedChapters.has(activeChapter);
  const examples = chapter.examples.map((example, index) => `
    <article class="code-example">
      <div class="code-example-heading">
        <span class="example-badge">${String(index + 1).padStart(2, "0")}</span>
        <div class="example-title">
          <strong>${escapeHTML(example.title)}</strong>
          <span>Example ${index + 1} of ${chapter.examples.length}</span>
        </div>
        <button class="copy-button" type="button" data-copy-index="${index}" aria-label="Copy ${escapeHTML(example.title)} code">Copy code</button>
      </div>
      <pre class="code-window"><code>${escapeHTML(example.code)}</code></pre>
      <div class="output-window">
        <span class="output-label"><span aria-hidden="true">●</span> OUTPUT</span>
        <pre><code>${escapeHTML(example.output)}</code></pre>
      </div>
      <p class="example-explanation">${escapeHTML(example.explanation)}</p>
    </article>
  `).join("");
  const concepts = chapter.concepts.map(([title, description]) => `
    <article class="concept-card">
      <span class="concept-dot" aria-hidden="true"></span>
      <div><h4>${escapeHTML(title)}</h4><p>${escapeHTML(description)}</p></div>
    </article>
  `).join("");
  const options = chapter.quiz.options.map((option, index) => `
    <button class="quiz-option" type="button" data-option="${index}" aria-pressed="false">
      <span class="option-letter">${String.fromCharCode(65 + index)}</span>${escapeHTML(option)}
    </button>
  `).join("");

  content.innerHTML = `
    <p class="chapter-kicker"><span>CHAPTER ${String(activeChapter + 1).padStart(2, "0")}</span><span aria-hidden="true">·</span><span>LEARN BY DOING</span></p>
    <div class="course-heading">
      <div><h2>${escapeHTML(chapter.title)}</h2><p class="chapter-summary">${escapeHTML(chapter.summary)}</p></div>
      <span class="level-badge">BEGINNER</span>
    </div>
    <div class="chapter-meta" aria-label="Topics in this chapter">
      ${chapter.topics.map((topic) => `<span class="topic-pill">${escapeHTML(topic)}</span>`).join("")}
    </div>
    <div class="chapter-action-row">
      <span class="lesson-count">${chapter.concepts.length} concepts · ${chapter.examples.length} code examples · 1 quick check</span>
      <button class="review-button${isReviewed ? " is-complete" : ""}" type="button" aria-pressed="${isReviewed}">
        <span class="review-icon" aria-hidden="true">${isReviewed ? "✓" : ""}</span>
        ${isReviewed ? "Chapter complete" : "Mark chapter complete"}
      </button>
    </div>
    <div class="section-heading">
      <h3>Key ideas</h3>
      <p>The building blocks for this chapter</p>
    </div>
    <div class="concept-grid">${concepts}</div>
    <div class="section-heading examples-section-heading">
      <h3>Code examples</h3>
      <p>Read the code, check the output, then try changing it</p>
    </div>
    <div class="code-example-list">${examples}</div>
    <section class="quiz-card" aria-labelledby="quiz-title">
      <div class="quiz-kicker"><span aria-hidden="true">✦</span> QUICK CHECK</div>
      <h3 id="quiz-title">${escapeHTML(chapter.quiz.prompt)}</h3>
      <pre class="quiz-code"><code>${escapeHTML(chapter.quiz.code)}</code></pre>
      <div class="quiz-options">${options}</div>
      <p class="quiz-feedback" role="status" aria-live="polite"></p>
    </section>
  `;

  content.querySelector(".review-button").addEventListener("click", () => {
    if (reviewedChapters.has(activeChapter)) {
      reviewedChapters.delete(activeChapter);
    } else {
      reviewedChapters.add(activeChapter);
    }
    localStorage.setItem(storageKey, JSON.stringify([...reviewedChapters]));
    updateProgress();
    renderChapterList();
    renderChapter();
  });

  content.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const code = chapter.examples[Number(button.dataset.copyIndex)].code;
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = "Copied!";
        window.setTimeout(() => {
          button.textContent = "Copy code";
        }, 1600);
      }).catch(() => {
        button.textContent = "Copy failed";
      });
    });
  });

  const feedback = content.querySelector(".quiz-feedback");
  content.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = Number(button.dataset.option);
      content.querySelectorAll(".quiz-option").forEach((option) => {
        option.classList.remove("is-correct", "is-wrong");
        option.setAttribute("aria-pressed", "false");
      });
      button.setAttribute("aria-pressed", "true");
      if (selected === chapter.quiz.correct) {
        button.classList.add("is-correct");
        feedback.textContent = `Correct! ${chapter.quiz.explanation}`;
      } else {
        button.classList.add("is-wrong");
        feedback.textContent = "Not quite. Trace the code one line at a time and try again.";
      }
    });
  });
}

function filterChapters(query) {
  const normalized = query.trim().toLocaleLowerCase();
  visibleChapters = chapters
    .map((chapter, index) => ({ chapter, index }))
    .filter(({ chapter }) => {
      const exampleText = chapter.examples.map((example) => `${example.title} ${example.code}`).join(" ");
      const searchableText = [chapter.title, chapter.summary, ...chapter.topics, exampleText]
        .join(" ")
        .toLocaleLowerCase();
      return searchableText.includes(normalized);
    })
    .map(({ index }) => index);

  if (visibleChapters.length && !visibleChapters.includes(activeChapter)) {
    activeChapter = visibleChapters[0];
    renderChapter();
  }
  renderChapterList();
}

searchInput.addEventListener("input", (event) => {
  filterChapters(event.currentTarget.value);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    searchInput.blur();
    filterChapters("");
  }
});

chapterCount.textContent = String(chapters.length);
updateProgress();
renderChapterList();
renderChapter();
