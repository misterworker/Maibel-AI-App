Run Dockerfile locally ->
1. cd scripts
2. docker run --env-file .env -p 8000:8000 ethandockerworker/fastapi-project:1.0.0
3. Set botApi.tsx link to http://localhost:8000/chat

Run development build locally for Windows 11 ->

1. Go to Wifi Settings -> CLick on your wifi properties -> Switch to private network
2. Configure firewall and security settings -> Disable firewall
3. Run npx expo start <ins>without any additional args</ins> and it should work.