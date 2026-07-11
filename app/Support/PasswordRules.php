<?php

namespace App\Support;

use Illuminate\Validation\Rules\Password;

class PasswordRules
{
    public static function defaults()
    {
        return Password::min(8)
            ->letters()
            ->mixedCase()
            ->numbers();
    }

    public static function required($confirm = true)
    {
        $rules = ['required', 'string', static::defaults()];

        if ($confirm) {
            $rules[] = 'confirmed';
        }

        return $rules;
    }

    public static function optional($confirm = true)
    {
        $rules = ['nullable', 'string', static::defaults()];

        if ($confirm) {
            $rules[] = 'confirmed';
        }

        return $rules;
    }

    public static function messages()
    {
        return [
            'password.required' => 'Please enter a password.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }

    public static function hint()
    {
        return 'At least 8 characters with uppercase, lowercase, and a number.';
    }
}
