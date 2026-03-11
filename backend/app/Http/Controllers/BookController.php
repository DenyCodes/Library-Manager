<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{

    public function index(): JsonResponse
    {
        $books = Book::orderBy('title')->get()->map(function (Book $book) {
            return [
                'id'               => $book->id,
                'title'            => $book->title,
                'author'           => $book->author,
                'isbn'             => $book->isbn,
                'available_copies' => $book->available_copies,
                'is_available'     => $book->isAvailable(),
            ];
        });

        return response()->json($books);
    }
}
