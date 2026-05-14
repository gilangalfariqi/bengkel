<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class TokenRevocationDebugTest extends TestCase
{
    use RefreshDatabase;

    public function test_token_deletion_in_database(): void
    {
        $user = User::factory()->create();
        $tokenResponse = $user->createToken('test');
        $token = $tokenResponse->plainTextToken;

        // Verify token exists in database
        $this->assertNotNull(PersonalAccessToken::findToken($token));
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);

        // Call logout endpoint with token
        $logoutResponse = $this->postJson('/api/auth/logout', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $logoutResponse->assertStatus(200);

        // Verify token is deleted from database
        $this->assertNull(PersonalAccessToken::findToken($token));
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);

        // Debug: Check what the guard returns
        \Log::info('Token after deletion: ' . (PersonalAccessToken::findToken($token) ? 'EXISTS' : 'DELETED'));
        
        // Verify token no longer authenticates - use explicit fresh headers
        $meResponse = $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        \Log::info('Me response status: ' . $meResponse->status());
        \Log::info('Me response: ' . $meResponse->content());
        
        $meResponse->assertStatus(401);
    }

    public function test_sanctum_guard_revalidates_on_fresh_request(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        // First request with token should succeed
        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ])->assertStatus(200);

        // Delete token directly (simulating logout)
        PersonalAccessToken::findToken($token)?->delete();

        // Fresh request should fail
        $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ])->assertStatus(401);
    }
}
