import React, { useState } from 'react';

interface Question {
  question: string;
  choices: string[];
  correctOption: number;
  explanation: string;
}

interface Props {
  question: Question;
  onSave: () => void;
  onCancel: () => void;
}

const EditQuestionForm: React.FC<Props> = ({ question, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setEditedQuestion({
      ...editedQuestion,
      [field]: e.target.value
    });
  };

  const handleSaveClick = () => {
    // Save the edited question
    onSave();
  };

  const handleCancelClick = () => {
    // Cancel editing
    onCancel();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Edit Question</h3>
      <label className="block mb-2">
        Question:
        <textarea
          value={editedQuestion.question}
          onChange={(e) => handleInputChange(e, 'question')}
          className="form-textarea mt-1 block w-full"
        />
      </label>
      <label className="block mb-2">
        Choices:
        {editedQuestion.choices.map((choice, index) => (
          <input
            key={index}
            type="text"
            value={choice}
            onChange={(e) => {
              const newChoices = [...editedQuestion.choices];
              newChoices[index] = e.target.value;
              setEditedQuestion({
                ...editedQuestion,
                choices: newChoices
              });
            }}
            className="form-input mt-1 block w-full"
          />
        ))}
      </label>
      <label className="block mb-2">
        Correct Option:
        <input
          type="number"
          value={editedQuestion.correctOption}
          onChange={(e) => handleInputChange(e, 'correctOption')}
          className="form-input mt-1 block w-full"
        />
      </label>
      <label className="block mb-4">
        Explanation:
        <textarea
          value={editedQuestion.explanation}
          onChange={(e) => handleInputChange(e, 'explanation')}
          className="form-textarea mt-1 block w-full"
        />
      </label>
      <button onClick={handleSaveClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2">Save</button>
      <button onClick={handleCancelClick} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4">Cancel</button>
    </div>
  );
};

export default EditQuestionForm;
