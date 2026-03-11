<?php

namespace App\Actions;

use App\Models\Book;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateLoanAction
{
    /**
     * Execute the loan creation with stock decrement in a transaction.
     *
     * @throws ValidationException
     */
    public function execute(User $user, Book $book): Loan
    {
        return DB::transaction(function () use ($user, $book) {
            // Lock the row to prevent race conditions
            $book = Book::lockForUpdate()->findOrFail($book->id);

            if (!$book->isAvailable()) {
                throw ValidationException::withMessages([
                    'book' => ['Este livro não possui cópias disponíveis para empréstimo.'],
                ]);
            }

            // Decrement available copies
            $book->decrement('available_copies');

            // Create the loan record
            $loan = Loan::create([
                'user_id'   => $user->id,
                'book_id'   => $book->id,
                'loaned_at' => now(),
            ]);

            return $loan->load('book');
        });
    }
}
