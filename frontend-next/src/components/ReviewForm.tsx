'use client';

import { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string; author: string }) => Promise<void>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment, author });
      setComment('');
      setAuthor('');
      setRating(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-bold text-sm uppercase mb-4">Deixe sua avaliação</h4>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4">
        <span className="text-sm text-gray-600 mr-2">Nota:</span>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5"
          >
            <svg
              className={`w-6 h-6 transition-colors ${star <= (hoverRating || rating) ? 'fill-yellow-400 stroke-yellow-400' : 'fill-none stroke-gray-300'}`}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Author */}
      <input
        type="text"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Seu nome"
        required
        className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:border-black text-sm"
      />

      {/* Comment */}
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="O que você achou do produto?"
        required
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:border-black text-sm resize-none"
      />

      <button
        type="submit"
        disabled={isSubmitting || !comment.trim() || !author.trim()}
        className="w-full py-2 bg-black text-white font-bold text-sm uppercase rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar avaliação'}
      </button>
    </form>
  );
}
