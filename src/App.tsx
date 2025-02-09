import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [questions, setQuestions] = useState<any>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get("/api/Uw5CrX").then((res) => {
      setQuestions(res.data.questions);
      setLoading(false);
    });
  }, []);

  const handleOptionSelect = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    let newScore = 0;

    questions.forEach((question: any) => {
      const selectedOptionId = selectedAnswers[question.id];
      const correctOption = question.options.find((opt: any) => opt.is_correct);

      if (selectedOptionId) {
        if (selectedOptionId === correctOption?.id) {
          newScore += 4;
        } else {
          newScore -= 1;
        }
      }
    });

    setScore(newScore);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 px-4 max-w-3xl mx-auto">
      {questions.map((question: any, index: number) => {
        const correctOption = question.options.find((opt: any) => opt.is_correct);
        const userAnswer = selectedAnswers[question.id];
        const isCorrect = userAnswer === correctOption?.id;

        return (
          <div key={question.id} className="py-4 border-b">
            <p className="font-semibold mb-2 text-lg">
              Q{index + 1}. {question.description}
            </p>
            <ul className="space-y-2">
              {question.options.map((option: any) => (
                <li key={option.id}>
                  <label className="cursor-pointer flex items-center">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={selectedAnswers[question.id] === option.id}
                      onChange={() => handleOptionSelect(question.id, option.id)}
                      className="mr-2"
                    />
                    {option.description}
                  </label>
                </li>
              ))}
            </ul>
            {score !== null && (
              <p className="text-sm mt-2 text-gray-700">
                {isCorrect
                  ? "✅ Answer is correct!"
                  : `❌ The correct answer is: ${correctOption?.description}`}
              </p>
            )}
          </div>
        );
      })}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mt-6 rounded-md cursor-pointer"
      >
        Submit
      </button>

      {score !== null && (
        <p className="mt-6 text-xl font-bold text-center">
          Your total score is <span className="text-blue-600">{score}</span>
        </p>
      )}
    </div>
  );
}

export default App;
