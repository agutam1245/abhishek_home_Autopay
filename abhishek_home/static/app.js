const chapters = [
  {
    title: "Getting Started",
    topics: ["print()", "Comments", "Expressions"],
    summary: "Meet Python, run your first instructions, and learn how the interpreter reads a program from top to bottom.",
    foundation: "A Python program is a set of instructions written in a text file. Python reads those instructions in order; unlike a calculator, a script usually needs print() to show a result.",
    concepts: [
      ["Python runs your instructions", "Write one statement per line. Python starts at the top and works downward, so a value must be created before a later line can use it."],
      ["Use print() to show a result", "Put text inside single or double quotes to make a string. print() can also show numbers, variables, and several values; it adds a newline at the end by default."],
      ["Comments are notes", "Start a comment with #. Python ignores the rest of that line, which makes comments useful for explaining why a step exists without changing what the program does."]
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
      },
      {
        title: "Control what print() adds",
        code: `print("Ready", end="... ")
print("go!")`,
        output: `Ready... go!`,
        explanation: "The end argument replaces print()'s usual newline. The second call continues on the same line."
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
    foundation: "A variable is a name that lets you refer to a value later. Python figures out a value's type when you assign it, so you can start using names without declaring them first.",
    concepts: [
      ["Names point to values", "Use one = sign to assign a value; it does not mean equality. Choose descriptive names such as student_name, and use snake_case for ordinary variable names."],
      ["Types describe values", "int stores whole numbers, float stores decimal numbers, str stores text, and bool stores True or False. The type determines which operations make sense."],
      ["Names are case-sensitive", "score, Score, and SCORE are different names. A variable name cannot start with a digit or be a Python keyword, so prefer short, meaningful names."]
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
      },
      {
        title: "Update a number in place",
        code: `count = 3
count += 2
print(count)`,
        output: `5`,
        explanation: "count += 2 is shorthand for count = count + 2. The variable now refers to the updated value."
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
    foundation: "input() pauses a command-line program and returns what the user typed as text. Convert that text to a number before adding, comparing, or multiplying it as a numeric value.",
    concepts: [
      ["input() returns text", "Even if someone types digits, input() returns a str. For example, the characters \"12\" are not yet the number 12, so numeric arithmetic needs a conversion."],
      ["Convert before calculating", "Use int() for whole-number text and float() for decimal text. Conversion can fail if the input is not a valid number, so real programs should handle that possibility."],
      ["Validate real-world input", "Users can press Enter without typing or enter unexpected characters. Check and clean text with methods such as strip(), then handle conversion errors rather than assuming input is always valid."]
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
      },
      {
        title: "Calculate a simple bill",
        code: `hours = float(input("Hours worked: "))
hourly_rate = 10
print(f"Pay: {hours * hourly_rate:.2f}")`,
        output: `Hours worked: 7.5
Pay: 75.00`,
        explanation: "float() accepts the decimal input 7.5. Multiplying by the hourly rate gives the pay, formatted to two decimal places."
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
    foundation: "An operator is a symbol or word that tells Python what to do with values. First learn arithmetic operators, then use comparisons and logic to make decisions in later chapters.",
    concepts: [
      ["Arithmetic operators", "+, -, *, /, //, %, and ** perform common calculations. / keeps a fractional result, // floors the quotient, % gives a remainder, and ** raises a number to a power."],
      ["Comparisons return Booleans", "Expressions such as score >= 50 evaluate to True or False. Use == to compare two values; a single = assigns a value to a name."],
      ["Combine conditions", "and is true only when both sides are true; or is true when at least one side is true; not flips a Boolean. Parentheses make compound conditions easier to read."]
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
      },
      {
        title: "Check whether a number is even",
        code: `number = 17
is_even = number % 2 == 0
print(is_even)`,
        output: `False`,
        explanation: "An even number has remainder 0 when divided by 2. The comparison returns a Boolean value."
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
    foundation: "A string is an ordered sequence of characters surrounded by quotes. Strings cannot be changed in place; methods and slices create new strings that you can store or print.",
    concepts: [
      ["Strings are ordered text", "Use an index in square brackets to read one character. Counting starts at 0, so text[0] is the first character; negative indexes count backward from the end."],
      ["Slices select a range", "text[start:stop] includes start and stops before stop. Leaving start blank begins at the first character; leaving stop blank continues to the end."],
      ["Methods return useful results", "Methods such as lower(), strip(), and replace() return transformed strings. Store the result if you need it, because the original string remains unchanged."]
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
      },
      {
        title: "Split and join text",
        code: `words = "read code daily".split()
print(words)
print(" -> ".join(words))`,
        output: `['read', 'code', 'daily']
read -> code -> daily`,
        explanation: "split() turns a string into a list of words. join() combines an iterable of strings using the text before its dot."
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
    foundation: "A conditional lets a program choose a path. Python evaluates a Boolean expression after if, and indentation marks the exact lines that belong to each branch.",
    concepts: [
      ["if checks a condition", "Write a condition after if and finish the line with a colon. The indented block runs only when the condition evaluates to True."],
      ["elif adds another case", "Python checks elif branches from top to bottom and runs the first matching block. Order matters when ranges overlap, so test the most specific or highest threshold first."],
      ["else is the fallback", "else has no condition of its own. Its indented block runs only when every preceding if and elif condition was False."]
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
      },
      {
        title: "Choose a price with or",
        code: `is_student = False
is_member = True
if is_student or is_member:
    price = 80
else:
    price = 100
print(price)`,
        output: `80`,
        explanation: "or makes the condition True when either side is True. Here membership is enough to get the reduced price."
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
    foundation: "A loop repeats a block of indented code. Use for when you have a sequence or known range to visit; use while when repetition should continue until a condition changes.",
    concepts: [
      ["for visits each item", "A for loop assigns the next item to its loop variable and runs the indented body. When there are no more items, execution continues after the loop."],
      ["range() creates a counting sequence", "range(start, stop, step) includes start and stops before stop. The default start is 0 and the default step is 1."],
      ["while repeats while True", "Python checks the condition before each iteration. Update a value used by the condition inside the loop, or the loop may never end."]
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
      },
      {
        title: "Skip selected values with continue",
        code: `for number in range(1, 6):
    if number % 2 == 0:
        continue
    print(number)`,
        output: `1
3
5`,
        explanation: "continue skips the remaining lines in the current iteration. The loop then moves to the next number."
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
    foundation: "Collections keep related values together so you can process them with one variable. Lists are flexible and changeable; tuples are ordered collections that are usually treated as fixed.",
    concepts: [
      ["Lists can change", "Create a list with square brackets. Lists keep their order and allow duplicates; append(), insert(), and pop() add, insert, or remove items."],
      ["Tuples are fixed sequences", "Create a tuple with parentheses or commas. Tuples support indexing and unpacking like lists, but their item references cannot be reassigned."],
      ["Comprehensions build lists", "A list comprehension evaluates an expression for each item in an iterable. Add an if condition at the end when you only want selected items."]
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
      },
      {
        title: "Insert and remove list items",
        code: `tasks = ["read", "practice"]
tasks.insert(1, "plan")
last_task = tasks.pop()
print(tasks)
print(last_task)`,
        output: `['read', 'plan']
practice`,
        explanation: "insert(1, ...) places an item at index 1. pop() removes and returns the last item when no index is supplied."
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
    foundation: "Use a dictionary when each value has a meaningful key, such as a username or product code. Use a set when membership and uniqueness matter more than order.",
    concepts: [
      ["Dictionaries map keys to values", "Create a dictionary with braces and key:value pairs. Keys are unique; reading a missing key with square brackets raises KeyError."],
      ["get() handles missing keys", "dict.get(key, default) returns a fallback instead of raising KeyError. Use items() to loop over both keys and values."],
      ["Sets contain unique items", "A set removes duplicates and is useful for fast membership checks. Union combines members; intersection finds shared members; difference finds members only in the first set."]
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
      },
      {
        title: "Build a dictionary with a comprehension",
        code: `prices = {"apple": 2, "pear": 3}
double_prices = {
    item: price * 2
    for item, price in prices.items()
}
print(double_prices)`,
        output: `{'apple': 4, 'pear': 6}`,
        explanation: "A dictionary comprehension creates one key:value pair for each item in the source dictionary."
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
    foundation: "A function is a named, reusable block of code. Define it once with def, then call it whenever that task is needed; arguments carry values in and return sends a result out.",
    concepts: [
      ["def creates a function", "The function body is indented under its def line and does not run until the function is called. Keep each function focused on one task."],
      ["Parameters receive inputs", "Parameters are names in the definition; arguments are the actual values supplied by the caller. Positional arguments match by order, while keyword arguments match by name."],
      ["return sends a result back", "return immediately ends the function and passes a value to the caller. A function without an explicit return gives back None."]
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
      },
      {
        title: "Return two related results",
        code: `def smallest_and_largest(numbers):
    return min(numbers), max(numbers)

low, high = smallest_and_largest([3, 8, 2])
print(low, high)`,
        output: `2 8`,
        explanation: "Python packages multiple return values into a tuple. The caller unpacks that tuple into low and high."
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
    foundation: "A module is a Python file that provides reusable names. The standard library comes with Python; third-party packages are installed separately and imported into your program.",
    concepts: [
      ["Modules organize reusable code", "import module makes its names available through the module name; from module import name brings a selected name into the current namespace."],
      ["The standard library is included", "Modules such as math, statistics, json, and pathlib ship with Python. Third-party libraries such as NumPy need to be installed in the active environment."],
      ["with manages files safely", "open() returns a file object. A with block closes it automatically, even if an exception occurs; choose a mode such as r to read or w to write."]
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
      },
      {
        title: "Convert a dictionary to JSON text",
        code: `import json

person = {"name": "Ada", "active": True}
text = json.dumps(person, sort_keys=True)
print(text)`,
        output: `{"active": true, "name": "Ada"}`,
        explanation: "json.dumps() converts a Python value to JSON text. JSON uses lowercase true and false, unlike Python's True and False."
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
    foundation: "An error message is evidence about where and why execution failed. Read the exception type and the last traceback line first, then inspect the named line and the values it uses.",
    concepts: [
      ["Syntax errors stop parsing", "Python checks grammar before running the affected code. Check matching quotes and parentheses, required colons, spelling, and consistent indentation."],
      ["Exceptions happen at runtime", "A program can be syntactically valid but fail while running, for example when converting invalid input or opening a missing file."],
      ["Catch only what you can handle", "Use a specific except clause for an expected failure and explain how to recover. Avoid a bare except that hides unrelated programming mistakes."]
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
      },
      {
        title: "Raise a clear error for a bad argument",
        code: `def divide(top, bottom):
    if bottom == 0:
        raise ValueError("bottom must not be zero")
    return top / bottom

try:
    divide(10, 0)
except ValueError as error:
    print(error)`,
        output: `bottom must not be zero`,
        explanation: "raise signals invalid input with a specific exception. The caller catches it and displays a useful message."
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
    foundation: "A class is a blueprint for objects. An object keeps its own data in attributes, while methods define actions that can read or update that data.",
    concepts: [
      ["A class defines a type", "Use class followed by a name and a colon. Each call to the class creates an instance, and each instance can hold different attribute values."],
      ["__init__ sets up an object", "Python calls this initializer when you create an instance. Assign values to self.attribute to save them on that particular object."],
      ["self refers to this object", "self is the conventional first parameter of an instance method. Python supplies the instance automatically when you call pet.speak()."]
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
      },
      {
        title: "Update an object's state with a method",
        code: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

account = BankAccount(25)
account.deposit(10)
print(account.balance)`,
        output: `35`,
        explanation: "deposit() changes the balance stored on this account instance. The method keeps related data and behavior together."
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
  },
  {
    title: "Virtual Environments and Packages",
    topics: ["venv", "pip", "Imports"],
    summary: "Create an isolated Python environment, install scientific packages, and check that your code can import them.",
    foundation: "Python includes a standard library, but tools such as NumPy, pandas, and SciPy are separate packages. A virtual environment gives one project its own package installs so they do not interfere with other projects.",
    concepts: [
      ["Create an environment per project", "python -m venv .venv creates an environment in the project folder. Use the environment's Python and pip so installs go to the right place."],
      ["Install with Python's pip", "Run python -m pip install numpy pandas scipy from the activated environment. Using python -m pip ties pip to that specific Python interpreter; choose a Python release supported by all three packages."],
      ["Install and import are different steps", "Install a package once in the environment with pip. Then import it in each program that needs it; package names and import names can differ."],
      ["Keep environments reproducible", "Avoid installing packages globally for a project. Record dependencies when sharing a project so another environment can install the same tools."]
    ],
    examples: [
      {
        title: "Create a virtual environment",
        code: `python -m venv .venv`,
        output: `Creates a .venv folder; no output is printed on success.`,
        explanation: "Run this from your project folder. The environment has its own Python executable and package directory."
      },
      {
        title: "Activate the environment in PowerShell",
        code: `.\\.venv\\Scripts\\Activate.ps1`,
        output: `The prompt starts with (.venv)`,
        explanation: "On macOS or Linux, activate it with source .venv/bin/activate. Activation makes python and pip refer to this environment."
      },
      {
        title: "Install NumPy, pandas, and SciPy",
        code: `python -m pip install numpy pandas scipy`,
        output: `pip prints download and installation details; exact text depends on package versions.`,
        explanation: "Run the command after activation. It installs the three packages into the current environment; an internet connection is normally needed."
      },
      {
        title: "Check package imports",
        code: `import numpy
import pandas
import scipy

print("All three packages are ready")`,
        output: `All three packages are ready`,
        explanation: "If Python reaches the print statement, all three imports succeeded in the interpreter running this file."
      },
      {
        title: "Check installed versions",
        code: `import numpy as np
import pandas as pd
import scipy

print("NumPy", np.__version__)
print("pandas", pd.__version__)
print("SciPy", scipy.__version__)`,
        output: `Each package prints its installed version number.`,
        explanation: "Version numbers change as packages are updated, so your output will not necessarily match someone else's."
      }
    ],
    quiz: {
      prompt: "Why use python -m pip instead of a plain pip command?",
      code: `python -m pip install numpy`,
      options: ["It runs pip for the selected Python interpreter", "It starts a new Python project", "It imports NumPy into every Python file"],
      correct: 0,
      explanation: "Using the interpreter to run pip helps install packages into the environment associated with that Python."
    }
  },
  {
    title: "NumPy Fundamentals",
    topics: ["Arrays", "Vectorized operations", "Shapes"],
    summary: "Work with fast, typed arrays and perform calculations across many values with concise NumPy operations.",
    foundation: "NumPy is a library for numerical data. Its main object, an ndarray, stores values in an array and lets one operation work on the whole array instead of writing a Python loop for every element.",
    concepts: [
      ["Create arrays from Python data", "Import NumPy using the common alias np, then call np.array() with a list or nested lists. A one-dimensional array is like a row of values; nested lists create multiple dimensions."],
      ["Array operations are element-wise", "Adding a number to an array or combining compatible arrays applies the operation to corresponding elements. This is called vectorization and often avoids an explicit loop."],
      ["Shape describes the dimensions", "array.shape gives the size along each dimension, and array.ndim gives the number of dimensions. These help confirm that data has the layout your calculation expects."],
      ["Select values with conditions", "A comparison such as array >= 5 creates a Boolean mask. Use that mask inside square brackets to select only matching values."],
      ["Choose a reduction", "Functions such as np.sum() and np.mean() reduce many values to a summary. For two-dimensional data, axis selects which direction to summarize."]
    ],
    examples: [
      {
        title: "Create an array and inspect its shape",
        code: `import numpy as np

grid = np.array([[1, 2, 3], [4, 5, 6]])
print(grid.shape)
print(grid.ndim)`,
        output: `(2, 3)
2`,
        explanation: "The array has two rows and three columns, so its shape is (2, 3) and it has two dimensions."
      },
      {
        title: "Apply arithmetic to every element",
        code: `import numpy as np

temperatures = np.array([18, 20, 22])
fahrenheit = temperatures * 9 / 5 + 32
print(fahrenheit)`,
        output: `[64.4 68.  71.6]`,
        explanation: "NumPy applies each arithmetic step to every element. The extra spaces in displayed values help align the array."
      },
      {
        title: "Select values with a condition",
        code: `import numpy as np

scores = np.array([3, 8, 5, 2])
print(scores[scores >= 5])`,
        output: `[8 5]`,
        explanation: "scores >= 5 creates a Boolean mask, and indexing with that mask keeps only values whose condition is True."
      },
      {
        title: "Summarize array values",
        code: `import numpy as np

readings = np.array([2, 4, 6])
print(np.sum(readings))
print(np.mean(readings))`,
        output: `12
4.0`,
        explanation: "sum adds all values; mean divides their total by the number of values."
      },
      {
        title: "Summarize each column",
        code: `import numpy as np

scores = np.array([[70, 80], [90, 100]])
print(np.mean(scores, axis=0))`,
        output: `[80. 90.]`,
        explanation: "axis=0 collapses the rows and calculates one mean for each column. axis=1 would calculate one mean per row."
      }
    ],
    quiz: {
      prompt: "What does this NumPy expression produce?",
      code: `np.array([1, 2, 3]) * 2`,
      options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "A single value: 12"],
      correct: 0,
      explanation: "Multiplication by 2 is applied to each array element."
    }
  },
  {
    title: "pandas Fundamentals",
    topics: ["Series", "DataFrames", "Filtering"],
    summary: "Represent labeled columns and tables, select rows and columns, and summarize real-world data with pandas.",
    foundation: "pandas is built for labeled, tabular data. A Series is one labeled column; a DataFrame is a table made from columns that can have different data types.",
    concepts: [
      ["A Series is a labeled column", "Create one with pd.Series(). Each value has an index label, which can be a number or a meaningful label such as a date."],
      ["A DataFrame is a labeled table", "Create a DataFrame from a dictionary of columns or read data from a file. Column names make it easier to select and explain information."],
      ["Select and filter deliberately", "Use frame['column'] to select one column. A condition such as frame['score'] >= 80 selects rows whose score meets the condition."],
      ["Handle missing values explicitly", "Real datasets may contain missing values, represented by NaN. Inspect them and choose whether to fill, exclude, or investigate them before calculating."],
      ["Group to compare categories", "groupby() splits rows by one or more category columns so an aggregation such as sum() or mean() can summarize each group."]
    ],
    examples: [
      {
        title: "Create a labeled Series",
        code: `import pandas as pd

visits = pd.Series([12, 18], index=["Mon", "Tue"])
print(visits.to_dict())`,
        output: `{'Mon': 12, 'Tue': 18}`,
        explanation: "The index labels identify which value belongs to each day. to_dict() displays the label-to-value mapping."
      },
      {
        title: "Create and inspect a DataFrame",
        code: `import pandas as pd

students = pd.DataFrame({
    "name": ["Mina", "Dev"],
    "score": [82, 91]
})
print(students["name"].tolist())
print(students["score"].mean())`,
        output: `['Mina', 'Dev']
86.5`,
        explanation: "The DataFrame stores named columns. Selecting score returns a Series, which provides a mean() method."
      },
      {
        title: "Filter rows with a condition",
        code: `import pandas as pd

students = pd.DataFrame({
    "name": ["Mina", "Dev", "Jo"],
    "score": [82, 91, 76]
})
passed = students[students["score"] >= 80]
print(passed["name"].tolist())`,
        output: `['Mina', 'Dev']`,
        explanation: "The comparison creates a Boolean condition for each row; using it inside brackets keeps rows where it is True."
      },
      {
        title: "Choose how to handle missing values",
        code: `import pandas as pd

scores = pd.Series([80, None, 95])
filled = scores.fillna(0)
print(filled.tolist())`,
        output: `[80.0, 0.0, 95.0]`,
        explanation: "fillna(0) replaces missing values with zero. That choice is only appropriate when zero is meaningful for your data."
      },
      {
        title: "Group and summarize rows",
        code: `import pandas as pd

sales = pd.DataFrame({
    "team": ["A", "B", "A"],
    "units": [3, 4, 2]
})
totals = sales.groupby("team")["units"].sum()
print(totals.to_dict())`,
        output: `{'A': 5, 'B': 4}`,
        explanation: "groupby() separates the rows by team, then sum() totals units within each group."
      }
    ],
    quiz: {
      prompt: "Which pandas object is most directly used to represent a table of named columns?",
      code: `table = pd.DataFrame({"city": ["Pune"], "rain_mm": [12]})`,
      options: ["DataFrame", "Boolean mask", "A Python comment"],
      correct: 0,
      explanation: "A DataFrame is pandas' two-dimensional, labeled table structure."
    }
  },
  {
    title: "SciPy Fundamentals",
    topics: ["Statistics", "Optimization", "Integration"],
    summary: "Use SciPy's focused scientific tools for probability, distances, equation solving, and numerical integration.",
    foundation: "SciPy builds on NumPy and provides algorithms for common scientific tasks. Its features live in submodules such as scipy.stats, scipy.optimize, and scipy.integrate, so import the tool you need.",
    concepts: [
      ["Use a SciPy submodule", "SciPy is organized into submodules. Import a specific function or submodule to make your code clear about which scientific tool it uses."],
      ["Describe probability distributions", "scipy.stats includes probability distributions and statistical tests. A probability density is not itself the probability of one exact continuous value; areas over intervals represent probabilities."],
      ["Solve equations numerically", "scipy.optimize offers algorithms for minimization and root finding. Root solvers generally need a starting estimate or an interval that brackets a solution."],
      ["Approximate integrals", "scipy.integrate can numerically estimate a definite integral. Results are floating-point approximations, so small rounding differences are normal."],
      ["Check inputs and assumptions", "A library can calculate only what your inputs describe. Confirm units, ranges, shapes, and assumptions before interpreting a scientific result."]
    ],
    examples: [
      {
        title: "Calculate a normal distribution density",
        code: `from scipy.stats import norm

print(round(norm.pdf(0), 3))`,
        output: `0.399`,
        explanation: "norm.pdf(0) evaluates the standard normal density at zero. This is a density value, not the probability that a continuous variable equals exactly zero."
      },
      {
        title: "Find the distance between two points",
        code: `from scipy.spatial.distance import euclidean

distance = euclidean([0, 0], [3, 4])
print(distance)`,
        output: `5.0`,
        explanation: "Euclidean distance is the straight-line distance. The 3-4-5 triangle makes this result easy to check."
      },
      {
        title: "Find a root inside an interval",
        code: `from scipy.optimize import root_scalar

result = root_scalar(
    lambda x: x * x - 9,
    bracket=[0, 5]
)
print(round(result.root, 6))`,
        output: `3.0`,
        explanation: "The bracket contains the positive root of x squared minus 9. root_scalar searches for a value where the function is zero."
      },
      {
        title: "Approximate a definite integral",
        code: `from scipy.integrate import quad

area, estimated_error = quad(
    lambda x: x ** 2,
    0,
    1
)
print(round(area, 6))`,
        output: `0.333333`,
        explanation: "quad numerically estimates the integral of x squared from 0 to 1. The exact value is one third; estimated_error reports the algorithm's error estimate."
      },
      {
        title: "Use a constant from SciPy",
        code: `from scipy.constants import c

print(c)`,
        output: `299792458.0`,
        explanation: "SciPy's constants module provides scientific values with units documented by the library; c is the speed of light in metres per second."
      }
    ],
    quiz: {
      prompt: "Which SciPy submodule is intended for finding numerical roots of equations?",
      code: `from scipy.optimize import root_scalar`,
      options: ["scipy.optimize", "scipy.integrate", "scipy.constants"],
      correct: 0,
      explanation: "scipy.optimize contains root-finding algorithms such as root_scalar."
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
    <section class="foundation-callout" aria-labelledby="foundation-title">
      <h3 id="foundation-title">Start with the basics</h3>
      <p>${escapeHTML(chapter.foundation)}</p>
    </section>
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
