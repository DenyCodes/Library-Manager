<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title'            => 'Dom Casmurro',
                'author'           => 'Machado de Assis',
                'isbn'             => '978-85-359-0277-5',
                'available_copies' => 3,
            ],
            [
                'title'            => 'Grande Sertão: Veredas',
                'author'           => 'João Guimarães Rosa',
                'isbn'             => '978-85-2600-521-5',
                'available_copies' => 2,
            ],
            [
                'title'            => 'A Hora da Estrela',
                'author'           => 'Clarice Lispector',
                'isbn'             => '978-85-359-0438-0',
                'available_copies' => 4,
            ],
            [
                'title'            => 'Vidas Secas',
                'author'           => 'Graciliano Ramos',
                'isbn'             => '978-85-2600-435-5',
                'available_copies' => 3,
            ],
            [
                'title'            => 'O Cortiço',
                'author'           => 'Aluísio Azevedo',
                'isbn'             => '978-85-359-0156-3',
                'available_copies' => 2,
            ],
            [
                'title'            => 'Memórias Póstumas de Brás Cubas',
                'author'           => 'Machado de Assis',
                'isbn'             => '978-85-359-0109-9',
                'available_copies' => 5,
            ],
            [
                'title'            => 'Capitães da Areia',
                'author'           => 'Jorge Amado',
                'isbn'             => '978-85-2840-218-9',
                'available_copies' => 3,
            ],
            [
                'title'            => 'Iracema',
                'author'           => 'José de Alencar',
                'isbn'             => '978-85-3020-098-5',
                'available_copies' => 4,
            ],
            [
                'title'            => 'O Alquimista',
                'author'           => 'Paulo Coelho',
                'isbn'             => '978-85-250-0998-9',
                'available_copies' => 6,
            ],
            [
                'title'            => 'A Moreninha',
                'author'           => 'Joaquim Manuel de Macedo',
                'isbn'             => '978-85-3020-199-9',
                'available_copies' => 2,
            ],
            [
                'title'            => 'Quincas Borba',
                'author'           => 'Machado de Assis',
                'isbn'             => '978-85-359-0288-1',
                'available_copies' => 1,
            ],
            [
                'title'            => 'Esaú e Jacó',
                'author'           => 'Machado de Assis',
                'isbn'             => '978-85-359-0317-8',
                'available_copies' => 0,
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}
