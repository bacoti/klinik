<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthorized. Please login first.'], 401);
        }

        $user = $request->user();
        
        if (!$user->role) {
            return response()->json(['message' => 'User role not found.'], 403);
        }

        if (!in_array($user->role->name, $roles)) {
            return response()->json([
                'message' => 'Access denied. Required roles: ' . implode(', ', $roles) . '. Your role: ' . $user->role->name
            ], 403);
        }

        return $next($request);
    }
}
