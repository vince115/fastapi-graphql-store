# run.sh
#!/usr/bin/env bash

# 設定預設 Port，如果有帶參數就用參數
PORT=${1:-8000}

echo "🚀 準備啟動 FastAPI on port $PORT ..."

# 檢查該 Port 是否已被使用
PID=$(lsof -ti tcp:$PORT)

if [ -n "$PID" ]; then
    echo "⚠️  Port $PORT 已被進程 $PID 佔用，嘗試關閉..."
    kill -9 $PID
    echo "✅ 已清除佔用的進程 $PID"
fi

# 啟動虛擬環境
if [ -d "venv" ]; then
    echo "📦 啟用虛擬環境..."
    source venv/bin/activate

    # 加入當前 backend 目錄到 PYTHONPATH
    export PYTHONPATH=$(pwd)
   
else
    echo "❌ 找不到虛擬環境 venv，請先建立 virtualenv。"
    exit 1
fi

# 啟動 FastAPI
echo "🚀 啟動 uvicorn 服務..."
# uvicorn main:app --reload --port $PORT
# uvicorn backend.main:app --reload --port $PORT
 PYTHONPATH=$(pwd) uvicorn main:app --reload --port $PORT