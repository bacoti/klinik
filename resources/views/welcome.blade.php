<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Laravel') }}</title>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])

        <style>
            html,
            body {
                margin: 0;
                padding: 0;
                min-height: 100vh;
                background-color: #f8fafc;
            }

            body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                color: #0f172a;
            }

            #app {
                min-height: 100vh;
            }
        </style>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
