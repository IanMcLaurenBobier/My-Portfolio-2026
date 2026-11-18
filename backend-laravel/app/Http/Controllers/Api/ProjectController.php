<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::query()->orderBy('sort_order')->orderByDesc('created_at');

        if ($request->filled('category')) {
            $query->where('category', $request->string('category')->toString());
        }

        $projects = $query->get();

        return response()->json([
            'data' => $projects,
            'total' => $projects->count(),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found.'], 404);
        }

        return response()->json(['data' => $project]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $slug = Str::slug($validated['title']) . '-' . Str::random(4);

        $project = Project::create([
            ...$validated,
            'slug' => $slug,
        ]);

        return response()->json([
            'message' => 'Project created.',
            'data' => $project,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found.'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project removed.']);
    }
}
