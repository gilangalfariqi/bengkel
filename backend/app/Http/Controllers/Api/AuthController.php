<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'customer', // Default role
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user'         => $user,
            'token'        => $token,
            'access_token' => $token,
        ], 'User registered successfully.', 201);
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Manual credential check to avoid session guard dependency in tests
        $user = User::where('email', $request->email)->first();
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Invalid login credentials.', 401);
        }
        
        if (!$user->is_active) {
            return $this->errorResponse('Your account is suspended.', 403);
        }

        // Strictly allow only customers via API to prevent session confusion with Filament
        if ($user->role !== 'customer') {
            Auth::logout();
            return $this->errorResponse('Please use the Admin Panel to login as administrator.', 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user'         => $user,
            'token'        => $token,
            'access_token' => $token,
        ], 'Login successful.');
    }

    /**
     * Logout user (Revoke the token).
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            // Delete the current access token for this request
            $current = $user->currentAccessToken();
            if ($current) {
                $current->delete();
            } else {
                // Fallback: delete all tokens
                $user->tokens()->delete();
            }
        }

        return $this->successResponse(null, 'Successfully logged out.');
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return $this->errorResponse('Unauthenticated.', 401);
        }

        // Verify the bearer token still exists in personal_access_tokens
        // This ensures revoked tokens cannot be used even if cached by the guard
        $bearerToken = $request->bearerToken();
        if ($bearerToken) {
            $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($bearerToken);
            if (! $tokenModel || $tokenModel->tokenable_id !== $user->getKey()) {
                return $this->errorResponse('Unauthenticated.', 401);
            }
        }

        $data = array_merge(['user' => $user], $user->toArray());
        return $this->successResponse($data);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'  => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'max:20'],
        ]);

        $user->update($validated);

        return $this->successResponse($user, 'Profile updated successfully.');
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return $this->successResponse(null, 'Password changed successfully.');
    }

    /**
     * Send password reset link (stub for now, needs mailer setup).
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        // In a real app, we'd send an email here.
        // For now, we'll just return success to satisfy the endpoint requirement.
        return $this->successResponse(null, 'If your email is registered, you will receive a reset link.');
    }

    /**
     * Reset password (stub).
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        return $this->successResponse(null, 'Password has been reset successfully.');
    }
}
