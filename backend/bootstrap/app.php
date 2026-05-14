<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {

        /*
        |--------------------------------------------------------------------------
        | Custom Middleware Aliases
        |--------------------------------------------------------------------------
        */

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureUserRole::class,
        ]);

        /*
        |--------------------------------------------------------------------------
        | API Architecture
        |--------------------------------------------------------------------------
        |
        | This project uses:
        | - Next.js frontend
        | - Laravel API backend
        | - Sanctum Bearer Token authentication
        |
        | No Laravel Blade auth/session redirects are used.
        |
        */
    })

    ->withExceptions(function (Exceptions $exceptions): void {

        /*
        |--------------------------------------------------------------------------
        | Force JSON Responses for API Routes
        |--------------------------------------------------------------------------
        */

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) =>
                $request->is('api/*') ||
                str_starts_with($request->path(), 'api/') ||
                $request->expectsJson()
        );

        /*
        |--------------------------------------------------------------------------
        | API Exception Rendering
        |--------------------------------------------------------------------------
        */

        $exceptions->render(function (\Throwable $exception, Request $request) {

            // Only customize API responses
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            /*
            |--------------------------------------------------------------------------
            | Authentication Exception
            |--------------------------------------------------------------------------
            */

            if ($exception instanceof AuthenticationException) {
                return response()->json([
                    'message' => 'Unauthenticated.',
                ], 401);
            }

            /*
            |--------------------------------------------------------------------------
            | Validation Exception
            |--------------------------------------------------------------------------
            */

            if ($exception instanceof ValidationException) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $exception->errors(),
                ], 422);
            }

            /*
            |--------------------------------------------------------------------------
            | Authorization Exception
            |--------------------------------------------------------------------------
            */

            if ($exception instanceof AuthorizationException) {
                return response()->json([
                    'message' => 'Forbidden.',
                ], 403);
            }

            /*
            |--------------------------------------------------------------------------
            | Generic API Exception
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'message' => app()->hasDebugModeEnabled()
                    ? $exception->getMessage()
                    : 'Server Error.',
            ], 500);
        });
    })

    ->create();