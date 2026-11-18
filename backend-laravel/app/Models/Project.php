<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'category',
        'domain',
        'summary',
        'architecture_notes',
        'features',
        'technologies',
        'image_url',
        'live_url',
        'repo_url',
        'year',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'technologies' => 'array',
    ];
}
