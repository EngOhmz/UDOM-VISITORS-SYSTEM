<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\PasswordRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    public function showForgotForm()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetLink(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
        ], [
            'login.required' => 'Please enter your email or phone number.',
        ]);

        $login = $request->login;
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($field, $login)->first();

        if (!$user || empty($user->email)) {
            return back()->withErrors([
                'login' => 'No account found with that email/phone, or no email is registered for this account. Please contact the administrator.',
            ]);
        }

        try {
            $status = Password::sendResetLink(['email' => $user->email]);
        } catch (\Exception $e) {
            Log::error('Password reset email failed: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return back()->withErrors([
                'login' => 'We could not send the reset email. Please check your mail settings or try again later.',
            ]);
        }

        if ($status === Password::RESET_LINK_SENT) {
            $maskedEmail = $this->maskEmail($user->email);

            return back()->with(
                'success',
                "Password reset link has been sent to {$maskedEmail}. Please check your inbox and spam folder."
            );
        }

        if ($status === Password::RESET_THROTTLED) {
            return back()->withErrors([
                'login' => 'Please wait a minute before requesting another reset link.',
            ]);
        }

        return back()->withErrors(['login' => __($status)]);
    }

    protected function maskEmail($email)
    {
        if (!$email || strpos($email, '@') === false) {
            return 'your registered email address';
        }

        [$local, $domain] = explode('@', $email, 2);
        $visible = substr($local, 0, min(2, strlen($local)));
        $maskedLocal = $visible . str_repeat('*', max(strlen($local) - strlen($visible), 3));

        return $maskedLocal . '@' . $domain;
    }

    public function showResetForm(Request $request, $token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email,
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => PasswordRules::required(),
        ], PasswordRules::messages());

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('success', 'Your password has been reset. You can now sign in.');
        }

        return back()->withErrors(['email' => __($status)]);
    }
}
