#!/bin/bash

PORT=${1:-8000}  # 預設關閉 8000 Port，可傳參數指定其他 Port

echo "🔍 嘗試關閉佔用 Port $PORT 的進程..."

PID=$(lsof -ti tcp:$PORT)

if [ -n "$PID" ]; then
    kill -9 $PID
    echo "✅ 已成功關閉進程 (PID: $PID) 佔用的 Port $PORT"
else
    echo "⚠️  沒有發現任何佔用 Port $PORT 的進程"
fi