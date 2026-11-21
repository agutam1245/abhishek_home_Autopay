const chapters = [
  {
    title: "Real Numbers",
    topics: ["Euclid's algorithm", "Prime factorisation", "Irrational numbers"],
    summary: "Explore how whole numbers are built, how to find a greatest common divisor efficiently, and how to reason about irrational numbers.",
    formulas: [
      ["Euclid's division lemma", "a = bq + r, 0 ≤ r < b"],
      ["HCF and LCM", "HCF(a, b) × LCM(a, b) = a × b"],
      ["Prime factorisation", "Write each integer as a product of primes"]
    ],
    examples: [
      {
        title: "Find the HCF using Euclid's algorithm",
        question: "Find the HCF of 867 and 255.",
        steps: [
          "867 = 255 × 3 + 102",
          "255 = 102 × 2 + 51",
          "102 = 51 × 2 + 0. The last non-zero remainder is the HCF."
        ],
        answer: "HCF(867, 255) = 51"
      },
      {
        title: "Use prime factors to find an LCM",
        question: "Find the LCM of 72 and 120 using prime factorisation.",
        steps: [
          "72 = 2³ × 3² and 120 = 2³ × 3 × 5.",
          "For the LCM, use the greatest exponent of each prime: 2³ × 3² × 5.",
          "Multiply: 8 × 9 × 5 = 360."
        ],
        answer: "LCM(72, 120) = 360"
      }
    ]
  },
  {
    title: "Polynomials",
    topics: ["Zeros", "Coefficients", "Polynomial graphs"],
    summary: "Connect a polynomial's zeros to its factors and coefficients, then use those relationships to build and check polynomials.",
    formulas: [
      ["Quadratic polynomial", "p(x) = ax² + bx + c"],
      ["Sum of zeros", "α + β = −b/a"],
      ["Product of zeros", "αβ = c/a"]
    ],
    examples: [
      {
        title: "Find the zeros and check the relationships",
        question: "Find the zeros of x² − 5x + 6.",
        steps: [
          "Factor the expression: x² − 5x + 6 = (x − 2)(x − 3).",
          "Set each factor equal to zero: x = 2 or x = 3.",
          "Their sum is 5 = −(−5)/1, and their product is 6 = 6/1."
        ],
        answer: "Zeros: 2 and 3"
      },
      {
        title: "Build a polynomial from its zeros",
        question: "Write a monic quadratic polynomial whose zeros are −1 and 4.",
        steps: [
          "For zeros α and β, a monic quadratic is x² − (α + β)x + αβ.",
          "Here α + β = 3 and αβ = −4.",
          "Substitute these values into the form."
        ],
        answer: "p(x) = x² − 3x − 4"
      }
    ]
  },
  {
    title: "Pair of Linear Equations in Two Variables",
    topics: ["Substitution", "Elimination", "Consistency"],
    summary: "Solve two linear equations together and interpret whether their lines meet once, overlap, or never meet.",
    formulas: [
      ["General form", "a₁x + b₁y + c₁ = 0"],
      ["One solution", "a₁/a₂ ≠ b₁/b₂"],
      ["No solution", "a₁/a₂ = b₁/b₂ ≠ c₁/c₂"]
    ],
    examples: [
      {
        title: "Solve by substitution",
        question: "Solve 2x + y = 11 and x − y = 1.",
        steps: [
          "From x − y = 1, write y = x − 1.",
          "Substitute in the first equation: 2x + x − 1 = 11, so 3x = 12.",
          "Thus x = 4, and y = 4 − 1 = 3."
        ],
        answer: "(x, y) = (4, 3)"
      },
      {
        title: "Classify a pair of lines",
        question: "How many solutions do 2x + 3y = 6 and 4x + 6y = 12 have?",
        steps: [
          "Compare coefficients: a₁/a₂ = 2/4 = 1/2 and b₁/b₂ = 3/6 = 1/2.",
          "Also c₁/c₂ = 6/12 = 1/2.",
          "All three ratios match, so both equations describe the same line."
        ],
        answer: "Infinitely many solutions"
      }
    ]
  },
  {
    title: "Quadratic Equations",
    topics: ["Factorisation", "Quadratic formula", "Discriminant"],
    summary: "Solve second-degree equations by factorisation or formula, and use the discriminant to predict the roots.",
    formulas: [
      ["Standard form", "ax² + bx + c = 0, a ≠ 0"],
      ["Quadratic formula", "x = (−b ± √(b² − 4ac)) / 2a"],
      ["Discriminant", "D = b² − 4ac"]
    ],
    examples: [
      {
        title: "Solve by factorisation",
        question: "Solve x² − 7x + 12 = 0.",
        steps: [
          "Find two numbers with product 12 and sum 7: 3 and 4.",
          "Factor: (x − 3)(x − 4) = 0.",
          "Set each factor to zero."
        ],
        answer: "x = 3 or x = 4"
      },
      {
        title: "Check whether the roots are real",
        question: "Determine the nature of the roots of x² + 4x + 5 = 0.",
        steps: [
          "Here a = 1, b = 4, and c = 5.",
          "D = b² − 4ac = 16 − 20 = −4.",
          "Since D is negative, the equation has no real roots."
        ],
        answer: "No real roots"
      }
    ]
  },
  {
    title: "Arithmetic Progressions",
    topics: ["Common difference", "nth term", "Sum of terms"],
    summary: "Recognise a constant-step sequence and calculate a term or a partial sum without listing every term.",
    formulas: [
      ["nth term", "aₙ = a + (n − 1)d"],
      ["Sum of n terms", "Sₙ = n/2 [2a + (n − 1)d]"],
      ["Last-term form", "Sₙ = n/2 (a + l)"]
    ],
    examples: [
      {
        title: "Find a term and a sum",
        question: "For the AP 4, 7, 10, … find the 20th term and the sum of its first 20 terms.",
        steps: [
          "The first term is a = 4 and the common difference is d = 3.",
          "a₂₀ = 4 + 19 × 3 = 61.",
          "S₂₀ = 20/2 × [2 × 4 + 19 × 3] = 10 × 65 = 650."
        ],
        answer: "20th term = 61; sum = 650"
      },
      {
        title: "Find the number of terms",
        question: "How many terms are in the AP 5, 9, 13, …, 81?",
        steps: [
          "Here a = 5, d = 4, and the last term l = 81.",
          "Use l = a + (n − 1)d: 81 = 5 + 4(n − 1).",
          "So 76 = 4(n − 1), hence n − 1 = 19."
        ],
        answer: "n = 20 terms"
      }
    ]
  },
  {
    title: "Triangles",
    topics: ["Similarity", "Basic proportionality theorem", "Pythagoras"],
    summary: "Use proportional sides and matching angles to compare triangles and solve length problems.",
    formulas: [
      ["Similar triangles", "Corresponding angles equal; sides proportional"],
      ["Basic proportionality", "DE ∥ BC ⇒ AD/DB = AE/EC"],
      ["Pythagoras", "hypotenuse² = side₁² + side₂²"]
    ],
    examples: [
      {
        title: "Use a similarity ratio",
        question: "Two similar triangles have corresponding side ratio 2:3. If the smaller triangle has perimeter 24 cm, find the larger perimeter.",
        steps: [
          "For similar triangles, the ratio of perimeters equals the ratio of corresponding sides.",
          "The scale factor from smaller to larger is 3/2.",
          "Larger perimeter = 24 × 3/2."
        ],
        answer: "36 cm"
      },
      {
        title: "Find the hypotenuse",
        question: "A right triangle has perpendicular sides 9 cm and 12 cm. Find its hypotenuse.",
        steps: [
          "Apply Pythagoras: c² = 9² + 12².",
          "c² = 81 + 144 = 225.",
          "Take the positive square root because a length is positive."
        ],
        answer: "15 cm"
      }
    ]
  },
  {
    title: "Coordinate Geometry",
    topics: ["Distance formula", "Section formula", "Midpoint"],
    summary: "Translate geometric questions into coordinates and use distance or section relationships to find lengths and points.",
    formulas: [
      ["Distance", "√[(x₂ − x₁)² + (y₂ − y₁)²]"],
      ["Midpoint", "((x₁ + x₂)/2, (y₁ + y₂)/2)"],
      ["Section ratio m:n", "((mx₂ + nx₁)/(m+n), (my₂ + ny₁)/(m+n))"]
    ],
    examples: [
      {
        title: "Find the distance between two points",
        question: "Find the distance between A(−1, 2) and B(3, 5).",
        steps: [
          "Use the distance formula: AB = √[(3 − (−1))² + (5 − 2)²].",
          "AB = √(4² + 3²) = √(16 + 9).",
          "Take the square root."
        ],
        answer: "AB = 5 units"
      },
      {
        title: "Find the midpoint",
        question: "Find the midpoint of P(2, −1) and Q(8, 5).",
        steps: [
          "Average the x-coordinates: (2 + 8)/2 = 5.",
          "Average the y-coordinates: (−1 + 5)/2 = 2.",
          "Combine the coordinate averages."
        ],
        answer: "Midpoint = (5, 2)"
      }
    ]
  },
  {
    title: "Introduction to Trigonometry",
    topics: ["Trigonometric ratios", "Identities", "Complementary angles"],
    summary: "Relate the sides of a right triangle to an acute angle and use identities to simplify expressions.",
    formulas: [
      ["Basic ratios", "sin θ = P/H, cos θ = B/H, tan θ = P/B"],
      ["Pythagorean identity", "sin² θ + cos² θ = 1"],
      ["Ratio identity", "tan θ = sin θ / cos θ"]
    ],
    examples: [
      {
        title: "Find the other ratios",
        question: "For an acute angle θ, sin θ = 3/5. Find cos θ and tan θ.",
        steps: [
          "In a right triangle, take opposite = 3 and hypotenuse = 5.",
          "By Pythagoras, adjacent² = 5² − 3² = 16, so adjacent = 4.",
          "Thus cos θ = 4/5 and tan θ = 3/4."
        ],
        answer: "cos θ = 4/5; tan θ = 3/4"
      },
      {
        title: "Evaluate using a standard value",
        question: "Evaluate 2 sin 30° + cos 60°.",
        steps: [
          "Use sin 30° = 1/2 and cos 60° = 1/2.",
          "Substitute: 2 × 1/2 + 1/2.",
          "Simplify the sum."
        ],
        answer: "3/2"
      }
    ]
  },
  {
    title: "Some Applications of Trigonometry",
    topics: ["Angles of elevation", "Angles of depression", "Heights and distances"],
    summary: "Model a line of sight as the hypotenuse of a right triangle and choose the ratio that connects known and unknown lengths.",
    formulas: [
      ["Tangent", "tan θ = height / horizontal distance"],
      ["Sine", "sin θ = height / line of sight"],
      ["Elevation", "Angle measured upward from the horizontal"]
    ],
    examples: [
      {
        title: "Find a tower's height",
        question: "From a point 20 m from a tower's base, the angle of elevation to its top is 45°. Find the height, assuming level ground.",
        steps: [
          "Let the height be h. Then tan 45° = h/20.",
          "Since tan 45° = 1, h/20 = 1.",
          "Multiply both sides by 20."
        ],
        answer: "The tower is 20 m high"
      },
      {
        title: "Find a horizontal distance",
        question: "A 10 m vertical pole casts a shadow on level ground. If the sun's angle of elevation is 30°, find the shadow length.",
        steps: [
          "Let the shadow length be d. Then tan 30° = 10/d.",
          "Since tan 30° = 1/√3, d = 10√3.",
          "A positive length is approximately 17.32 m."
        ],
        answer: "10√3 m (about 17.32 m)"
      }
    ]
  },
  {
    title: "Circles",
    topics: ["Tangents", "Radius and tangent", "Equal tangent lengths"],
    summary: "Use the right angle between a radius and tangent, and the equal lengths of tangents drawn from one external point.",
    formulas: [
      ["Radius and tangent", "Radius ⟂ tangent at the point of contact"],
      ["Tangent length", "PT² = OP² − r²"],
      ["Two tangents", "PA = PB from the same external point P"]
    ],
    examples: [
      {
        title: "Find a tangent length",
        question: "A circle has radius 5 cm. An external point is 13 cm from the centre. Find the tangent length.",
        steps: [
          "The radius to the point of contact is perpendicular to the tangent.",
          "Use the right triangle: tangent² = 13² − 5² = 169 − 25 = 144.",
          "Take the positive square root."
        ],
        answer: "12 cm"
      },
      {
        title: "Use equal tangents",
        question: "Two tangents PA and PB are drawn to a circle from P. If PA = 3x − 2 and PB = x + 8, find x and the tangent length.",
        steps: [
          "Tangents from the same external point are equal: 3x − 2 = x + 8.",
          "So 2x = 10 and x = 5.",
          "Substitute: PA = 3 × 5 − 2."
        ],
        answer: "x = 5; PA = PB = 13 units"
      }
    ]
  },
  {
    title: "Areas Related to Circles",
    topics: ["Circumference", "Sector area", "Circular paths"],
    summary: "Break a circle into sectors, or compare concentric circles, to calculate curved lengths and shaded areas.",
    formulas: [
      ["Circumference", "C = 2πr"],
      ["Sector area", "(θ/360°) × πr²"],
      ["Arc length", "(θ/360°) × 2πr"]
    ],
    examples: [
      {
        title: "Find the area of a quarter-circle sector",
        question: "Find the area of a 90° sector in a circle of radius 14 cm. Use π = 22/7.",
        steps: [
          "Sector area = (θ/360°) × πr².",
          "Substitute: (90/360) × (22/7) × 14².",
          "Simplify: 1/4 × 616."
        ],
        answer: "154 cm²"
      },
      {
        title: "Find the area of a circular path",
        question: "A circular path lies between two concentric circles of radii 7 m and 5 m. Find its area using π = 22/7.",
        steps: [
          "Path area = area of outer circle − area of inner circle.",
          "A = π(7² − 5²) = π(49 − 25) = 24π.",
          "Use π = 22/7 to evaluate."
        ],
        answer: "528/7 m² (about 75.43 m²)"
      }
    ]
  },
  {
    title: "Surface Areas and Volumes",
    topics: ["Cylinder", "Cone", "Sphere"],
    summary: "Choose the correct surface-area or volume formula, and keep track of whether a question asks for curved area, total area, or capacity.",
    formulas: [
      ["Cylinder volume", "πr²h"],
      ["Cone volume", "⅓πr²h; slant height l = √(r² + h²)"],
      ["Sphere volume", "⁴⁄₃πr³"]
    ],
    examples: [
      {
        title: "Find a cone's volume and curved area",
        question: "A cone has radius 3 cm and height 4 cm. Find its volume and curved surface area.",
        steps: [
          "The slant height is l = √(3² + 4²) = 5 cm.",
          "Volume = ⅓πr²h = ⅓ × π × 9 × 4 = 12π cm³.",
          "Curved area = πrl = π × 3 × 5 = 15π cm²."
        ],
        answer: "Volume = 12π cm³; curved area = 15π cm²"
      },
      {
        title: "Find a sphere's volume",
        question: "Find the volume of a sphere with diameter 6 cm.",
        steps: [
          "The radius is half the diameter: r = 3 cm.",
          "V = ⁴⁄₃πr³ = ⁴⁄₃ × π × 27.",
          "Simplify the product."
        ],
        answer: "36π cm³"
      }
    ]
  },
  {
    title: "Statistics",
    topics: ["Mean", "Median", "Grouped data"],
    summary: "Summarise a data set using a measure of centre, and apply the grouped-data formula carefully with the correct median class.",
    formulas: [
      ["Grouped mean", "x̄ = Σfᵢxᵢ / Σfᵢ"],
      ["Median", "l + [(N/2 − cf)/f]h"],
      ["Class mark", "(lower limit + upper limit)/2"]
    ],
    examples: [
      {
        title: "Find the mean of grouped data",
        question: "Find the mean for classes 0–10, 10–20, 20–30 with frequencies 2, 3, 5.",
        steps: [
          "The class marks are 5, 15, and 25.",
          "Compute Σfᵢxᵢ = 2 × 5 + 3 × 15 + 5 × 25 = 180.",
          "The total frequency is 2 + 3 + 5 = 10, so mean = 180/10."
        ],
        answer: "Mean = 18"
      },
      {
        title: "Find the median of grouped data",
        question: "Find the median for classes 0–10, 10–20, 20–30 with frequencies 2, 5, 3.",
        steps: [
          "N = 10, so N/2 = 5. The cumulative frequencies are 2, 7, 10; the median class is 10–20.",
          "Use l = 10, cf = 2, f = 5, and h = 10.",
          "Median = 10 + [(5 − 2)/5] × 10 = 16."
        ],
        answer: "Median = 16"
      }
    ]
  },
  {
    title: "Probability",
    topics: ["Equally likely outcomes", "Sample space", "Complementary events"],
    summary: "Count the favourable outcomes and the total equally likely outcomes, then express the chance as a fraction between zero and one.",
    formulas: [
      ["Probability", "P(E) = favourable outcomes / total outcomes"],
      ["Impossible event", "P(E) = 0"],
      ["Complement", "P(not E) = 1 − P(E)"]
    ],
    examples: [
      {
        title: "Find the chance of an even number",
        question: "A fair six-sided die is rolled. What is the probability of getting an even number?",
        steps: [
          "The possible outcomes are 1, 2, 3, 4, 5, 6: six equally likely outcomes.",
          "The favourable outcomes are 2, 4, and 6: three outcomes.",
          "Probability = favourable outcomes / total outcomes = 3/6."
        ],
        answer: "1/2"
      },
      {
        title: "Find a probability from a bag",
        question: "A bag contains 3 red and 2 blue counters. One counter is picked at random. Find the probability it is not blue.",
        steps: [
          "There are 5 counters altogether.",
          "The outcomes that are not blue are the 3 red counters.",
          "Probability = 3/5."
        ],
        answer: "3/5"
      }
    ]
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

const storageKey = "maths-made-clear-reviewed";
const reviewedChapters = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
let activeChapter = 0;
let visibleChapters = chapters.map((_, index) => index);

function updateProgress() {
  const completed = reviewedChapters.size;
  const percentage = (completed / chapters.length) * 100;
  progressCount.textContent = `${completed}/${chapters.length}`;
  progressRing.setAttribute("aria-label", `${completed} of ${chapters.length} chapters reviewed`);
  progressFill.style.width = `${percentage}%`;
  progressSummary.textContent = completed
    ? `${completed} of ${chapters.length} chapters reviewed`
    : "Choose a chapter to get started";
}

function renderChapterList() {
  chapterCount.textContent = String(visibleChapters.length);
  chapterList.innerHTML = "";

  if (!visibleChapters.length) {
    const empty = document.createElement("p");
    empty.className = "empty-results";
    empty.textContent = "No chapters match that search. Try another topic.";
    chapterList.append(empty);
    return;
  }

  visibleChapters.forEach((index) => {
    const chapter = chapters[index];
    const button = document.createElement("button");
    button.className = `chapter-button${reviewedChapters.has(index) ? " is-complete" : ""}`;
    button.type = "button";
    button.setAttribute("aria-current", index === activeChapter ? "page" : "false");
    button.innerHTML = `<span class="chapter-number">${String(index + 1).padStart(2, "0")}</span><span class="chapter-label">${chapter.title}</span>`;
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
  const exampleCards = chapter.examples.map((example, index) => `
    <details class="example-card">
      <summary>
        <span class="example-badge">${String(index + 1).padStart(2, "0")}</span>
        <span class="example-title">
          <strong>${example.title}</strong>
          <span>${example.question}</span>
        </span>
      </summary>
      <div class="solution">
        <p class="solution-label">Step-by-step solution</p>
        <ol>${example.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
        <p class="answer-line">Answer: ${example.answer}</p>
      </div>
    </details>
  `).join("");

  content.innerHTML = `
    <p class="chapter-kicker"><span>CHAPTER ${String(activeChapter + 1).padStart(2, "0")}</span><span aria-hidden="true">·</span><span>CONCEPTS & PRACTICE</span></p>
    <h2>${chapter.title}</h2>
    <p class="chapter-summary">${chapter.summary}</p>
    <div class="chapter-meta" aria-label="Topics in this chapter">
      ${chapter.topics.map((topic) => `<span class="topic-pill">${topic}</span>`).join("")}
    </div>
    <div class="chapter-action-row">
      <span class="lesson-count">${chapter.formulas.length} key ideas · ${chapter.examples.length} worked examples</span>
      <button class="review-button${isReviewed ? " is-complete" : ""}" type="button" aria-pressed="${isReviewed}">
        <span class="review-icon" aria-hidden="true">${isReviewed ? "✓" : ""}</span>
        ${isReviewed ? "Reviewed" : "Mark as reviewed"}
      </button>
    </div>
    <div class="section-heading">
      <h3>Quick revision</h3>
      <p>Keep these close while you practise</p>
    </div>
    <div class="formula-grid">
      ${chapter.formulas.map(([label, formula]) => `<div class="formula-card"><strong>${label}</strong><span>${formula}</span></div>`).join("")}
    </div>
    <div class="section-heading">
      <h3>Worked examples</h3>
      <p>Open an example to see each step</p>
    </div>
    <div class="example-list">${exampleCards}</div>
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
}

function filterChapters(query) {
  const normalized = query.trim().toLocaleLowerCase();
  visibleChapters = chapters
    .map((chapter, index) => ({ chapter, index }))
    .filter(({ chapter }) => {
      const searchableText = [chapter.title, chapter.summary, ...chapter.topics].join(" ").toLocaleLowerCase();
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
