<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $userRole = $request->user()->role->name ?? null;

        if (!$userRole || !in_array($userRole, $roles)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthorized. You do not have permission to access this resource.',
                    'required_roles' => $roles,
                    'your_role' => $userRole
                ], 403);
            }

            return redirect()->route('unauthorized')->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}
