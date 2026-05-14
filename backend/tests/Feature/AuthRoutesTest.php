<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRoutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_returns_success(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Test User',
            'email'                 => 'test@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.user.email', 'test@example.com')
                 ->assertJsonPath('data.user.role', 'customer');

        $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'role' => 'customer']);
    }

    public function test_register_validates_required_fields(): void
    {
        $response = $this->postJson('/api/auth/register', []);


        fwrite(STDERR, "register missing fields status={$response->getStatusCode()} body=" . $response->getContent() . "\n");

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Another User',

            'email'                 => 'taken@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_login_returns_token(): void
    {
        User::factory()->create([
            'email'    => 'login@example.com',
            'password' => 'password123', // factory uses 'hashed' cast
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'name', 'email', 'role']]]);
    }

    public function test_login_rejects_wrong_password(): void
    {
        User::factory()->create(['email' => 'wrong@example.com']);

        $response = $this->postJson('/api/auth/login', [
            'email'    => 'wrong@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
                 ->assertJsonPath('success', false);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.user.id', $user->id);
    }

    public function test_me_rejects_unauthenticated(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
                         ->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        // Token should be deleted from the database
        $this->assertNull(\Laravel\Sanctum\PersonalAccessToken::findToken($token));

        // Token no longer works
        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ])->assertStatus(401);
    }

    public function test_full_register_login_me_logout_flow(): void
    {
        // 1. Register
        $registerRes = $this->postJson('/api/auth/register', [
            'name'                  => 'Flow User',
            'email'                 => 'flow@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $registerRes->assertStatus(201)->assertJsonPath('success', true);

        // 2. Login
        $loginRes = $this->postJson('/api/auth/login', [
            'email'    => 'flow@example.com',
            'password' => 'password123',
        ]);
        $loginRes->assertStatus(200);
        $token = $loginRes->json('data.token');
        $this->assertNotEmpty($token);

        // 3. Me
        $meRes = $this->withToken($token)->getJson('/api/auth/me');
        $meRes->assertStatus(200)
              ->assertJsonPath('data.user.email', 'flow@example.com');

        // 4. Logout
        $logoutRes = $this->withToken($token)->postJson('/api/auth/logout');
        $logoutRes->assertStatus(200)->assertJsonPath('success', true);

        // 5. Verify token is revoked from database
        $this->assertNull(\Laravel\Sanctum\PersonalAccessToken::findToken($token));

        // 6. Token no longer works in a fresh request
        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ])->assertStatus(401);
    }

    public function test_change_password(): void
    {
        $user = User::factory()->create(['password' => 'oldpassword123']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->putJson('/api/auth/change-password', [
            'current_password'      => 'oldpassword123',
            'password'              => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ], ['Authorization' => 'Bearer ' . $token]);

        $response->assertStatus(200)->assertJsonPath('success', true);

        // Old password should no longer work
        $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'oldpassword123',
        ])->assertStatus(401);

        // New password should work
        $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'newpassword123',
        ])->assertStatus(200);
    }
}
