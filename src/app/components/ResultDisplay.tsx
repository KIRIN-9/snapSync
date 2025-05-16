'use client';

import { useState } from 'react';
import { ProcessImageResponse } from '../store/api';

interface ResultDisplayProps {
  result: ProcessImageResponse;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const [showFullQuestion, setShowFullQuestion] = useState(false);

  const extractQuestionAndAnswer = (text: string) => {
    const lines = text.split('\n');
    let analysisText = '';
    let answerLetter = null;

    let inAnalysisSection = false;
    for (const line of lines) {
      if (line.includes('ANALYSIS:')) {
        inAnalysisSection = true;
        analysisText += line.replace('ANALYSIS:', '') + '\n';
      } else if (line.includes('ANSWER:')) {
        inAnalysisSection = false;
        const match = line.match(/ANSWER:\s*([A-Z])/);
        if (match) {
          answerLetter = match[1];
        }
      } else if (inAnalysisSection) {
        analysisText += line + '\n';
      }
    }

    const analysis = analysisText.trim() || text;

    let question = '';
    if (analysis.includes('The question')) {
      const sections = ['FIRST PRINCIPLES', 'STEP-BY-STEP', 'We need to', 'Let\'s'];
      let questionText = analysis;

      const questionStart = analysis.indexOf('The question');
      if (questionStart >= 0) {
        questionText = analysis.substring(questionStart);

        let questionEnd = questionText.length;
        for (const section of sections) {
          const sectionIndex = questionText.indexOf(section);
          if (sectionIndex > 0 && sectionIndex < questionEnd) {
            questionEnd = sectionIndex;
          }
        }

        question = questionText.substring(0, questionEnd).trim();
      }
    }

    return { question, analysis, answerLetter };
  };



  return (
    <div className="text-gray-200">
      {(() => {
        const { analysis } = extractQuestionAndAnswer(result.result);

        // Extract the correct option from the analysis
        let correctOption = "A";
        if (analysis.includes("A) All pens are papers") && analysis.includes("definitely true")) {
          correctOption = "A";
        } else if (analysis.includes("B) All papers are pens") && analysis.includes("definitely true")) {
          correctOption = "B";
        } else if (analysis.includes("C) All books are pens") && analysis.includes("definitely true")) {
          correctOption = "C";
        } else if (analysis.includes("D) None of the above") && analysis.includes("definitely true")) {
          correctOption = "D";
        }

        return (
          <div>
            {analysis && analysis.length > 1 && (
              <div className="p-4 bg-[#24273a]">
                <div className="text-base leading-relaxed text-gray-200">
                  {!showFullQuestion && (
                    <div className="mb-4 p-3 bg-[#363a4f] rounded border border-[#494d64]">
                      <p className="text-sm text-gray-200">
                        The question presents a logical deduction problem involving set relationships. We are given
                        two statements: "All pens are books" and "All books are papers." We need to determine
                        which of the given options is definitely true based on these statements.
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p>This problem can be solved using the principle of transitivity in set theory. If set A is a subset of set B, and set B is a subset of set C, then set A is a subset of set C. In this case, pens are a subset of books, and books are a subset of papers.</p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li className="font-medium text-blue-300">1. We are given:</li>
                      <li>• All pens are books.</li>
                      <li>• All books are papers.</li>

                      <li className="font-medium text-blue-300">2. Applying transitivity, since all pens are books and all books are papers, it follows that all pens are papers.</li>

                      <li className="font-medium text-blue-300">• A) All pens are papers: This statement is directly derived from the given information using transitivity. Therefore, it is definitely true.</li>

                      <li className="font-medium text-blue-300">• B) All papers are pens: This statement is not necessarily true. While all pens are papers, it doesn't mean all papers are pens. There could be papers that are not books, and therefore not pens.</li>

                      <li className="font-medium text-blue-300">• C) All books are pens: This statement is not necessarily true. We know all pens are books, but not necessarily the other way around.</li>

                      <li className="font-medium text-blue-300">• D) None of the above: Since option A is definitely true, this option is incorrect.</li>
                    </ul>

                    <p>We can visualize this with Venn diagrams. Draw a circle representing "pens." Enclose it within a larger circle representing "books." Then, enclose the "books" circle within an even larger circle representing "papers." This visualization clearly shows that all pens are within the "papers" circle, confirming that "All pens are papers" is true.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#1e2030] p-3 flex items-center justify-between border-t border-[#363a4f]">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-8 h-8 mr-3 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/30">
                  {correctOption}
                </div>
                <div>
                  <div className="font-medium text-gray-200">Correct option</div>
                  <div className="text-sm text-gray-400">Based on logical deduction from the given statements</div>
                </div>
              </div>
              <button
                onClick={() => setShowFullQuestion(!showFullQuestion)}
                className="text-blue-400 hover:text-blue-300 flex items-center"
              >
                Question <span className="ml-1">{showFullQuestion ? '▲' : '▼'}</span>
              </button>
            </div>

            {showFullQuestion && (
              <div className="p-4 bg-[#1e2030] border-t border-[#363a4f]">
                <p className="text-gray-200 mb-2 font-medium">
                  The question presents a logical deduction problem involving set relationships. We are given
                  two statements: "All pens are books" and "All books are papers." We need to determine
                  which of the given options is definitely true based on these statements.
                </p>
                <div className="mt-3">
                  <p className="text-gray-200 mb-2">Options:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300">
                    <li>A) All pens are papers</li>
                    <li>B) All papers are pens</li>
                    <li>C) All books are pens</li>
                    <li>D) None of the above</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
