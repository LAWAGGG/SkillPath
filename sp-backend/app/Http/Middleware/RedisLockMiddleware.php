<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class RedisLockMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Only apply to POST requests
        if ($request->method() !== 'POST') {
            return $next($request);
        }

        // Generate a unique key per user/IP and route path
        // Using auth()->id() if user is authenticated, fallback to IP address
        $identifier = auth()->id() ?? $request->ip();
        $path = $request->path();
        
        $lockKey = "route_lock:{$identifier}:{$path}";

        // Use default cache store (configured in .env) for locking
        // Lock duration is 10 seconds
        $lock = Cache::lock($lockKey, 10);

        if (! $lock->get()) {
            // Failed to acquire lock (another request from the SAME user/IP is already processing)
            return response()->json([
                'message' => 'Tolong tunggu sebentar, permintaan Anda sedang diproses.'
            ], 429);
        }

        try {
            return $next($request);
        } finally {
            // Always release the lock when the request completes or fails
            $lock->release();
        }
    }
}
