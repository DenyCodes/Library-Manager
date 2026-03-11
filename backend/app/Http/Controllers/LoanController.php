<?php

namespace App\Http\Controllers;

use App\Actions\CreateLoanAction;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LoanController extends Controller
{
    public function __construct(private readonly CreateLoanAction $createLoanAction)
    {
    }


    public function myLoans(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $loans = DB::select("
            SELECT
                l.id           AS loan_id,
                l.loaned_at,
                b.id           AS book_id,
                b.title,
                b.author,
                b.isbn
            FROM loans l
            INNER JOIN books b ON b.id = l.book_id
            WHERE l.user_id = :userId
            ORDER BY l.loaned_at DESC
        ", ['userId' => $userId]);

        return response()->json($loans);
    }

    public function store(Request $request, Book $book): JsonResponse
    {
        try {
            $loan = $this->createLoanAction->execute($request->user(), $book);

            return response()->json([
                'message' => 'Empréstimo realizado com sucesso!',
                'loan'    => $loan,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors'  => $e->errors(),
            ], 422);
        }
    }
}
