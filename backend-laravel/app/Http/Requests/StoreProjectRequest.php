<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:2', 'max:160'],
            'subtitle' => ['nullable', 'string', 'max:220'],
            'category' => ['required', 'in:Featured,Additional'],
            'domain' => ['required', 'string', 'max:140'],
            'summary' => ['required', 'string', 'min:10', 'max:2000'],
            'architecture_notes' => ['nullable', 'string', 'max:2000'],
            'features' => ['nullable', 'array'],
            'technologies' => ['required', 'array', 'min:1'],
            'live_url' => ['nullable', 'url', 'max:255'],
            'repo_url' => ['nullable', 'url', 'max:255'],
            'year' => ['nullable', 'string', 'max:20'],
        ];
    }
}
