$port = 8080
$root = "c:\Users\Aakash\Downloads\ai project\ai project\resume-ai\dist"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server started."
Write-Host "You can now view your app at: http://localhost:$port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response
        
        $url = $context.Request.Url.LocalPath
        if ($url -eq "/") { $url = "/index.html" }
        $path = Join-Path $root $url.Replace("/", "\")
        
        if (Test-Path $path -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($path)
            $response.ContentLength64 = $content.Length
            
            $ext = [System.IO.Path]::GetExtension($path).ToLower()
            if ($ext -eq ".html") { $response.ContentType = "text/html" }
            elseif ($ext -eq ".js") { $response.ContentType = "application/javascript" }
            elseif ($ext -eq ".css") { $response.ContentType = "text/css" }
            elseif ($ext -eq ".svg") { $response.ContentType = "image/svg+xml" }
            elseif ($ext -eq ".png") { $response.ContentType = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $response.ContentType = "image/jpeg" }
            elseif ($ext -eq ".json") { $response.ContentType = "application/json" }
            
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            # SPA fallback: if not found, serve index.html
            $indexPath = Join-Path $root "index.html"
            if (Test-Path $indexPath -PathType Leaf) {
                $content = [System.IO.File]::ReadAllBytes($indexPath)
                $response.ContentLength64 = $content.Length
                $response.ContentType = "text/html"
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                $response.StatusCode = 404
            }
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
