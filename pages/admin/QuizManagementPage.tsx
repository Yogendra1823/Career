import React, { useState } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { QUIZ_QUESTIONS } from '../../constants';
import { QuizQuestion } from '../../types';
import Tooltip from '../../components/Tooltip';

const QuizManagementPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    // FIX: Add difficulty to the form state with a default value.
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
  });

  const openAddModal = () => {
    setEditingQuestion(null);
    // FIX: Reset form state including difficulty.
    setFormData({ question: '', options: ['', '', '', ''], difficulty: 'Easy' });
    setIsModalOpen(true);
  };

  const openEditModal = (question: QuizQuestion) => {
    setEditingQuestion(question);
    // FIX: Populate form state with the difficulty of the question being edited.
    setFormData({ question: question.question, options: [...question.options], difficulty: question.difficulty });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDelete = (questionId: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  // FIX: Make handleFormChange more generic to handle all fields, including the new difficulty select.
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('option-')) {
      const index = parseInt(name.split('-')[1], 10);
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData(prev => ({ ...prev, options: newOptions }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      // FIX: Include difficulty when updating an existing question.
      setQuestions(prev =>
        prev.map(q =>
          q.id === editingQuestion.id
            ? { ...q, question: formData.question, options: formData.options, difficulty: formData.difficulty }
            : q
        )
      );
    } else {
      // FIX: Include difficulty when creating a new question.
      const newQuestion: QuizQuestion = {
        id: Date.now(), // Simple ID generation for mock purposes
        question: formData.question,
        options: formData.options,
        difficulty: formData.difficulty,
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    closeModal();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Quiz Management</h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Quiz Questions</h2>
          <Tooltip text="Add a new question to the career quiz.">
            <button
              onClick={openAddModal}
              className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add New Question
            </button>
          </Tooltip>
        </div>
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="border border-gray-200 dark:border-neutral-600 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{index + 1}. {q.question}</h3>
                  {/* FIX: Display the question difficulty. */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Difficulty: <span className="font-medium text-neutral dark:text-gray-200">{q.difficulty}</span></p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 pl-4">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                  <Tooltip text="Edit this question and its answers.">
                    <button onClick={() => openEditModal(q)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                  </Tooltip>
                  <Tooltip text="Permanently remove this question.">
                    <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingQuestion ? 'Edit Question' : 'Add New Question'}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question Text</label>
            <textarea
              id="question"
              name="question"
              rows={3}
              value={formData.question}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          {formData.options.map((option, index) => (
            <div key={index}>
              <label htmlFor={`option-${index}`} className="block text-sm font-medium text-gray-700">Option {index + 1}</label>
              <input
                type="text"
                id={`option-${index}`}
                name={`option-${index}`}
                value={option}
                onChange={handleFormChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          ))}
          {/* FIX: Add a select input for difficulty in the form. */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">{editingQuestion ? 'Save Changes' : 'Add Question'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuizManagementPage;
