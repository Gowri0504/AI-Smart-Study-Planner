import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@backend/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json({ error: "Topic query is required" }, { status: 400 });
  }

  // Mock AI Quiz Generation
  // In a real production scenario, you would prompt OpenAI/Gemini:
  // "Generate a 3-question multiple-choice quiz about ${query} in JSON format."
  
  const mockQuizzes: Record<string, any[]> = {
    "Algebra": [
      {
        id: 1,
        question: "What is the value of x in the equation 2x + 5 = 15?",
        options: ["5", "10", "20", "2.5"],
        correctAnswer: "5",
        explanation: "Subtract 5 from both sides to get 2x = 10, then divide by 2 to get x = 5."
      },
      {
        id: 2,
        question: "Which of the following is a quadratic equation?",
        options: ["y = mx + c", "y = ax^2 + bx + c", "y = a^x", "y = sin(x)"],
        correctAnswer: "y = ax^2 + bx + c",
        explanation: "A quadratic equation must have an x^2 term as its highest degree."
      },
      {
        id: 3,
        question: "What is the slope of the line y = 3x - 4?",
        options: ["-4", "4", "3", "0"],
        correctAnswer: "3",
        explanation: "In the slope-intercept form y = mx + b, m is the slope."
      }
    ],
    "default": [
      {
        id: 1,
        question: `What is the primary function of ${query}?`,
        options: ["To process data", "To store information", "To manage state", "All of the above"],
        correctAnswer: "All of the above",
        explanation: `Generally, ${query} encompasses multiple facets of these operations.`
      },
      {
        id: 2,
        question: `When was the concept of ${query} primarily popularized?`,
        options: ["1990s", "2000s", "2010s", "Recent years"],
        correctAnswer: "Recent years",
        explanation: "It has gained massive traction recently due to modern technological advancements."
      },
      {
        id: 3,
        question: `Which concept is closely related to ${query}?`,
        options: ["Optimization", "Redundancy", "Deprecation", "Static typing"],
        correctAnswer: "Optimization",
        explanation: `Optimization is a key factor when dealing with ${query}.`
      }
    ]
  };

  // Select mock based on topic, or fallback to generic
  let quizMatch = mockQuizzes["default"];
  Object.keys(mockQuizzes).forEach(key => {
    if (query.toLowerCase().includes(key.toLowerCase()) && key !== "default") {
      quizMatch = mockQuizzes[key];
    }
  });

  return NextResponse.json({ questions: quizMatch });
}
